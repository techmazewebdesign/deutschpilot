import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import * as crypto from "node:crypto";
import * as engine from "../../lib/school/engine";
import * as documents from "../../lib/school/documents";
import { hydrate, changesBetween } from "../../lib/school/repository";
const container = process.env.SCHOOL_TEST_POSTGRES_CONTAINER;
const localRequire = createRequire(import.meta.url);
const ts = localRequire("typescript");
const q = (v: unknown) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`,
  str = (v: string) => `'${v.replace(/'/g, "''")}'`;
function sql(text: string) {
  return execFileSync(
    "/usr/local/bin/docker",
    ["exec", "-i", container!, "psql", "-U", "postgres", "-Atq", "-v", "ON_ERROR_STOP=1"],
    { input: text, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
  ).trim();
}
function setup() {
  const school = "upload-handshake-" + randomUUID();
  const owner = {
      id: "owner",
      email: "owner@synthetic.example",
      name: "Owner",
      verified: true,
      admin: true,
    },
    student = {
      id: "student",
      email: "student@synthetic.example",
      name: "Student",
      verified: true,
      admin: false,
    };
  const rpc = (name: string, ...args: string[]) => {
    const result = sql(
      `set role service_role;select to_jsonb(public.${name}(${str(school)},${args.join(",")}));`
    );
    return result ? JSON.parse(result) : null;
  };
  const load = (u: engine.Identity, a: Record<string, unknown> = {}) => {
    const data = rpc("school_repository_read", q(u), q(a));
    return hydrate(school, data.records, data.pagination);
  };
  const mutate = (
    u: engine.Identity,
    a: Record<string, unknown>,
    fn: (s: engine.SchoolState) => unknown
  ) => {
    const l = load(u, a),
      state = structuredClone(l.state),
      result = fn(state);
    rpc("school_repository_commit", q(u), q(a), q(changesBetween(l, state)), str(owner.id));
    return { state, result };
  };
  const command = (u: engine.Identity, a: Record<string, unknown>) =>
    mutate(u, a, (s) => engine.apply(s, u, a, owner.id)).result as ReturnType<typeof engine.apply>;
  command(owner, { action: "bootstrap", name: "Synthetic upload handshake" });
  const invite = command(owner, {
    action: "invite.create",
    email: student.email,
    name: student.name,
    role: "student",
  });
  command(student, { action: "invite.accept", code: invite.inviteCode });
  command(owner, {
    action: "settings.update",
    settings: {
      name: "Synthetic",
      operator: "Synthetic",
      privacyContact: "privacy@synthetic.example",
      legalBasis: "Synthetic only",
      healthLegalBasis: "Synthetic only",
      retentionDays: 30,
      retentionByCategory: { general: 30, medical: 30, jobcenter: 30, signed_letter: 30 },
      recordRetentionDays: {
        attendance: 30,
        absences: 30,
        letters: 30,
        notifications: 30,
        progress: 30,
        audit: 30,
      },
      retentionPolicyNote: "Synthetic test policy; not a German legal recommendation",
      chatRetentionDays: 30,
      sensitiveUploadsEnabled: true,
    },
  });
  const objects = new Map<string, Uint8Array>();
  let storageCalls = 0,
    scanCalls = 0;
  type Writer = (path: string, bytes: Uint8Array) => Promise<{ error: unknown }>;
  let writer: Writer = async (path, bytes) => {
    objects.set(path, bytes);
    return { error: null };
  };
  let afterMetadata: (() => Promise<void>) | undefined;
  const modules: Record<string, unknown> = {
    "node:crypto": crypto,
    "@/lib/supabaseAdmin": {
      createAdminSupabaseClient: () => ({
        storage: {
          from: () => ({
            upload: async (path: string, bytes: Uint8Array) => {
              storageCalls++;
              return writer(path, bytes);
            },
          }),
        },
      }),
    },
    "@/lib/school/documents": documents,
    "@/lib/school/engine": engine,
    "@/lib/school/server": {
      checkMutationOrigin: () => {},
      schoolIdentity: async () => student,
      mutate: async (
        u: engine.Identity,
        a: Record<string, unknown>,
        fn: (s: engine.SchoolState) => unknown
      ) => {
        const result = mutate(u, a, fn);
        if (a.action === "document.upload" && afterMetadata) await afterMetadata();
        return result;
      },
      repositoryRpc: async (name: string, args: Record<string, unknown>) => {
        const order: Record<string, string[]> = {
          school_upload_begin: ["p_actor", "p_document_id"],
          school_upload_finish: ["p_actor", "p_document_id", "p_lease", "p_outcome"],
        };
        if (!order[name]) throw new Error("Unexpected RPC " + name);
        return rpc(
          name,
          ...order[name].map((key) => (key === "p_actor" ? q(args[key]) : str(String(args[key]))))
        );
      },
      privateHeaders: {},
      readSnapshot: async () => engine.snapshot(load(student).state, student),
      errorResponse: (e: unknown) =>
        Response.json(
          { code: e instanceof engine.SchoolError ? e.code : "UNAVAILABLE" },
          { status: e instanceof engine.SchoolError ? e.status : 503 }
        ),
    },
  };
  const exports: Record<string, unknown> = {};
  const source = ts.transpileModule(
    readFileSync(new URL("../../app/api/school/documents/route.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }
  ).outputText;
  runInNewContext(source, {
    exports,
    require: (name: string) => {
      if (!(name in modules)) throw new Error("Unexpected import " + name);
      return modules[name];
    },
    Response,
    Request,
    File,
    Buffer,
    AbortSignal,
    process: {
      env: {
        SCHOOL_SCANNER_URL: "https://synthetic.invalid/scan",
        SCHOOL_SCANNER_TOKEN: "synthetic",
      },
    },
    fetch: async (_url: unknown, init: { headers: Record<string, string> }) => {
      scanCalls++;
      return Response.json({ sha256: init.headers["X-Content-SHA256"], verdict: "clean" });
    },
  });
  const post = () => {
    const form = new FormData();
    form.set(
      "file",
      new File(["%PDF-1.7 synthetic private file"], "private.pdf", { type: "application/pdf" })
    );
    form.set("title", "Synthetic");
    form.set("category", "medical");
    return (exports.POST as (req: Request) => Promise<Response>)(
      new Request("https://synthetic.invalid/api/school/documents", { method: "POST", body: form })
    );
  };
  const doc = () =>
    JSON.parse(sql(`select payload from school_documents where school_id=${str(school)}limit 1;`));
  const counts = () =>
    sql(
      `select(select count(*)from school_members where school_id=${str(school)}and id='student'),(select count(*)from school_documents where school_id=${str(school)}),(select count(*)from school_cleanup where school_id=${str(school)}),(select count(*)from school_upload_reservations where school_id=${str(school)});`
    );
  const clean = (paths: string[]) => {
    for (const path of paths) objects.delete(path);
    rpc("school_cleanup_ack", q(paths));
  };
  return {
    school,
    owner,
    student,
    rpc,
    command,
    objects,
    post,
    doc,
    counts,
    clean,
    setWriter: (fn: Writer) => (writer = fn),
    setAfterMetadata: (fn: () => Promise<void>) => (afterMetadata = fn),
    storageCalls: () => storageCalls,
    scanCalls: () => scanCalls,
  };
}
function gate() {
  let release!: () => void, entered!: (v: string) => void;
  const paused = new Promise<string>((r) => (entered = r)),
    resume = new Promise<void>((r) => (release = r));
  return { paused, resume, release, entered };
}
test(
  "actual POST + real PostgreSQL: delayed storage write blocks completed account deletion until settled and removed",
  { skip: !container },
  async () => {
    const h = setup(),
      g = gate();
    h.setWriter(async (path, bytes) => {
      g.entered(path);
      await g.resume;
      h.objects.set(path, bytes);
      return { error: null };
    });
    const pending = h.post(),
      path = await g.paused;
    assert.equal(h.rpc("school_privacy_prepare", q(h.student)).blocked, false);
    assert.deepEqual(h.rpc("school_privacy_cleanup_batch", str(h.student.id)), []);
    h.objects.delete(path);
    assert.throws(() => h.rpc("school_cleanup_ack", q([path])));
    assert.throws(() => h.rpc("school_privacy_finalize", q(h.student)));
    g.release();
    assert.equal((await pending).status, 409);
    assert.equal(h.scanCalls(), 0);
    assert.ok(h.objects.has(path));
    const paths = h.rpc("school_privacy_cleanup_batch", str(h.student.id));
    assert.deepEqual(paths, [path]);
    h.clean(paths);
    h.rpc("school_privacy_finalize", q(h.student));
    assert.equal(h.counts(), "0|0|0|0");
    assert.equal(h.objects.size, 0);
  }
);
test(
  "actual POST: deletion safely cancels RESERVED before begin; resuming handler cannot write bytes",
  { skip: !container },
  async () => {
    const h = setup(),
      g = gate();
    h.setAfterMetadata(async () => {
      g.entered("reserved");
      await g.resume;
    });
    const pending = h.post();
    await g.paused;
    h.rpc("school_privacy_prepare", q(h.student));
    const paths = h.rpc("school_privacy_cleanup_batch", str(h.student.id));
    assert.equal(paths.length, 1);
    h.clean(paths);
    h.rpc("school_privacy_finalize", q(h.student));
    g.release();
    assert.ok((await pending).status >= 400);
    assert.equal(h.storageCalls(), 0);
    assert.equal(h.counts(), "0|0|0|0");
  }
);
test(
  "actual POST: ambiguous timeout plus late provider write stays UNKNOWN until explicit fenced recovery",
  { skip: !container },
  async () => {
    const h = setup();
    let lateWrite: (() => void) | undefined;
    h.setWriter(async (path, bytes) => {
      lateWrite = () => h.objects.set(path, bytes);
      return { error: new Error("Synthetic provider timeout with unknown outcome") };
    });
    assert.equal((await h.post()).status, 503);
    const d = h.doc();
    h.rpc("school_privacy_prepare", q(h.student));
    assert.deepEqual(h.rpc("school_privacy_cleanup_batch", str(h.student.id)), []);
    assert.throws(() => h.rpc("school_cleanup_ack", q([d.storagePath])));
    assert.throws(() => h.rpc("school_privacy_finalize", q(h.student)));
    lateWrite!();
    lateWrite = undefined;
    assert.ok(h.objects.has(d.storagePath));
    assert.throws(() =>
      h.rpc("school_upload_recover", q(h.owner), str(d.id), str("just expire it"), str(""), str(""))
    );
    h.rpc(
      "school_upload_recover",
      q(h.owner),
      str(d.id),
      str("WRITERS FENCED AND STORAGE DRAINED"),
      str("INCIDENT-TEST writer process stopped"),
      str("INCIDENT-TEST provider callback drained")
    );
    h.clean(h.rpc("school_privacy_cleanup_batch", str(h.student.id)));
    h.rpc("school_privacy_finalize", q(h.student));
    assert.equal(h.counts(), "0|0|0|0");
    assert.equal(h.objects.size, 0);
  }
);
test(
  "WRITING crash-state has no automatic expiry; owner recovery requires fence and drain evidence",
  { skip: !container },
  async () => {
    const h = setup(),
      g = gate();
    h.setWriter(async () => {
      g.entered("writing");
      await g.resume;
      return { error: new Error("Synthetic writer terminated") };
    });
    const pending = h.post();
    await g.paused;
    const d = h.doc();
    sql(
      `update school_upload_reservations set updated_at='2000-01-01'where school_id=${str(h.school)};`
    );
    h.rpc("school_privacy_prepare", q(h.student));
    assert.deepEqual(h.rpc("school_privacy_cleanup_batch", str(h.student.id)), []);
    assert.throws(() => h.rpc("school_privacy_finalize", q(h.student)));
    assert.throws(() =>
      h.rpc(
        "school_upload_recover",
        q(h.student),
        str(d.id),
        str("WRITERS FENCED AND STORAGE DRAINED"),
        str("writer stopped evidence"),
        str("provider drained evidence")
      )
    );
    g.release();
    assert.equal((await pending).status, 503);
    assert.throws(() =>
      h.rpc(
        "school_upload_recover",
        q(h.owner),
        str(d.id),
        str("WRITERS FENCED AND STORAGE DRAINED"),
        str("too short"),
        str("provider drained evidence")
      )
    );
    h.rpc(
      "school_upload_recover",
      q(h.owner),
      str(d.id),
      str("WRITERS FENCED AND STORAGE DRAINED"),
      str("TEST confirmed terminated writer"),
      str("TEST confirmed no pending provider writes")
    );
    h.clean(h.rpc("school_privacy_cleanup_batch", str(h.student.id)));
    h.rpc("school_privacy_finalize", q(h.student));
    assert.equal(h.counts(), "0|0|0|0");
  }
);
test(
  "actual POST: member revocation during write queues terminal cleanup and prevents scan",
  { skip: !container },
  async () => {
    const h = setup(),
      g = gate();
    h.setWriter(async (path, bytes) => {
      g.entered(path);
      await g.resume;
      h.objects.set(path, bytes);
      return { error: null };
    });
    const pending = h.post(),
      path = await g.paused;
    h.command(h.owner, {
      action: "member.update",
      memberId: h.student.id,
      role: "student",
      active: false,
    });
    assert.throws(() => h.rpc("school_cleanup_ack", q([path])));
    g.release();
    assert.equal((await pending).status, 409);
    assert.equal(h.scanCalls(), 0);
    const paths = h.rpc("school_repository_retention", q(h.owner));
    assert.deepEqual(paths, [path]);
    h.clean(paths);
    assert.equal(h.objects.size, 0);
    assert.equal(h.counts(), "1|0|0|0");
  }
);
test(
  "actual POST: retention never acknowledges or deletes metadata while bytes can still arrive",
  { skip: !container },
  async () => {
    const h = setup(),
      g = gate();
    h.setWriter(async (path, bytes) => {
      g.entered(path);
      await g.resume;
      h.objects.set(path, bytes);
      return { error: null };
    });
    const pending = h.post(),
      path = await g.paused;
    const d = h.doc();
    sql(
      `update school_documents set payload=jsonb_set(payload,'{expiresAt}','"2000-01-01T00:00:00Z"')where school_id=${str(h.school)}and id=${str(d.id)};`
    );
    assert.deepEqual(h.rpc("school_repository_retention", q(h.owner)), []);
    assert.throws(() => h.rpc("school_cleanup_ack", q([path])));
    assert.ok(h.doc());
    g.release();
    assert.equal((await pending).status, 409);
    h.clean(h.rpc("school_repository_retention", q(h.owner)));
    assert.equal(h.objects.size, 0);
    assert.equal(h.counts(), "1|0|0|0");
  }
);
test(
  "actual POST: successful stored/clean file retains a durable reservation until ordinary safe deletion",
  { skip: !container },
  async () => {
    const h = setup();
    assert.equal((await h.post()).status, 201);
    const d = h.doc();
    assert.equal(d.scanStatus, "clean");
    assert.equal(h.scanCalls(), 1);
    assert.ok(h.objects.has(d.storagePath));
    h.rpc("school_privacy_prepare", q(h.student));
    h.clean(h.rpc("school_privacy_cleanup_batch", str(h.student.id)));
    h.rpc("school_privacy_finalize", q(h.student));
    assert.equal(h.objects.size, 0);
    assert.equal(h.counts(), "0|0|0|0");
  }
);
test(
  "terminal writer ledger still requires object cleanup when document metadata is unexpectedly absent",
  { skip: !container },
  async () => {
    const h = setup();
    assert.equal((await h.post()).status, 201);
    const d = h.doc();
    sql(`delete from school_documents where school_id=${str(h.school)}and id=${str(d.id)};`);
    assert.ok(h.objects.has(d.storagePath));
    h.rpc("school_privacy_prepare", q(h.student));
    assert.throws(() => h.rpc("school_privacy_finalize", q(h.student)));
    const paths = h.rpc("school_privacy_cleanup_batch", str(h.student.id));
    assert.deepEqual(paths, [d.storagePath]);
    h.clean(paths);
    h.rpc("school_privacy_finalize", q(h.student));
    assert.equal(h.counts(), "0|0|0|0");
    assert.equal(h.objects.size, 0);
  }
);
test(
  "retention cleanup approval freezes late hold updates before any storage deletion",
  { skip: !container },
  async () => {
    const h = setup();
    assert.equal((await h.post()).status, 201);
    const d = h.doc();
    sql(
      `update school_documents set payload=jsonb_set(payload,'{expiresAt}','"2000-01-01T00:00:00Z"')where school_id=${str(h.school)}and id=${str(d.id)};`
    );
    const paths = h.rpc("school_repository_retention", q(h.owner));
    assert.deepEqual(paths, [d.storagePath]);
    assert.throws(() =>
      h.command(h.owner, {
        action: "document.hold",
        documentId: d.id,
        hold: true,
        reason: "Late hold after approved destruction",
      })
    );
    h.clean(paths);
    assert.equal(h.objects.size, 0);
    assert.equal(h.counts(), "1|0|0|0");
  }
);
