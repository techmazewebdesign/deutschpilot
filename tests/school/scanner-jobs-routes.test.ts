import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import * as engine from "../../lib/school/engine";
const ts = createRequire(import.meta.url)("typescript");
const secret = "synthetic-server-only-12345678901234567890";
function route(
  kind: "notifications" | "maintenance",
  options: { push?: boolean; settings?: unknown; denyRpc?: boolean } = {}
) {
  const calls: string[] = [];
  const db = {
    from(table: string) {
      calls.push(`table:${table}`);
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        async maybeSingle() {
          return { data: { payload: options.settings }, error: null };
        },
      };
    },
  };
  const exported: { POST?: (r: Request) => Promise<Response> } = {};
  const modules: Record<string, unknown> = {
    "node:crypto": createRequire(import.meta.url)("node:crypto"),
    "@/lib/school/engine": engine,
    "@/lib/supabaseAdmin": { createAdminSupabaseClient: () => db },
    "@/lib/school/server": {
      schoolId: () => "synthetic-school",
      privateHeaders: {},
      pushConfigured: () => options.push ?? true,
      repositoryRpc: async (name: string) => {
        calls.push(name);
        if (options.denyRpc) throw new engine.SchoolError("FORBIDDEN", "Denied", 403);
        if (name === "school_reminders") return 1;
        if (name === "school_repository_record_retention") return { dryRun: true };
        return [];
      },
      errorResponse: (e: unknown) =>
        Response.json(
          { error: "denied" },
          { status: e instanceof engine.SchoolError ? e.status : 503 }
        ),
    },
  };
  runInNewContext(
    ts.transpileModule(readFileSync(`app/api/school/${kind}/route.ts`, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      exports: exported,
      require: (name: string) => modules[name],
      Buffer,
      Request,
      Response,
      URL,
      AbortSignal,
      process: { env: { SCHOOL_JOBS_CRON_SECRET: secret, SCHOOL_MAINTENANCE_OWNER_UID: "owner" } },
      fetch: async () => {
        calls.push("provider-fetch");
        throw Error("Network forbidden");
      },
    }
  );
  return {
    calls,
    post: (query = "", auth = true) =>
      exported.POST!(
        new Request(`https://synthetic.invalid/api/school/${kind}${query}`, {
          method: "POST",
          headers: auth ? { authorization: `Bearer ${secret}` } : {},
        })
      ),
  };
}
const policy = {
  operator: "Synthetic",
  privacyContact: "privacy@synthetic.invalid",
  legalBasis: "Synthetic only",
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
  retentionPolicyNote: "Synthetic, not legal advice",
  chatRetentionDays: 30,
  sensitiveUploadsEnabled: false,
  healthLegalBasis: "",
};
test("actual notifications route push=false creates reminders but never claims, sends or checks receipts", async () => {
  const h = route("notifications");
  const r = await h.post("?push=false");
  assert.equal(r.status, 200);
  assert.equal((await r.json()).pushDisabled, true);
  assert.deepEqual(h.calls, ["school_reminders"]);
});
test("scheduler secret remains mandatory before any reminder, policy or provider calls", async () => {
  for (const kind of ["notifications", "maintenance"] as const) {
    const h = route(kind, { settings: policy });
    assert.equal((await h.post("", false)).status, 403);
    assert.deepEqual(h.calls, []);
  }
});
test("push=true never overrides global push disabled; existing callers retain configured behavior", async () => {
  const off = route("notifications", { push: false });
  assert.equal((await off.post("?push=true")).status, 200);
  assert.deepEqual(off.calls, ["school_reminders"]);
  const existing = route("notifications");
  assert.equal((await existing.post()).status, 200);
  assert.deepEqual(existing.calls, [
    "school_reminders",
    "school_push_claim",
    "school_push_receipts",
  ]);
});
test("missing and partial retention policies stop execution before any mutation", async () => {
  for (const settings of [
    undefined,
    {},
    { ...policy, recordRetentionDays: { attendance: 30 } },
    { ...policy, retentionByCategory: { general: 30 } },
    { ...policy, recordRetentionDays: { ...policy.recordRetentionDays, audit: 36501 } },
    { ...policy, legalBasis: " " },
  ]) {
    const h = route("maintenance", { settings });
    assert.equal((await h.post("?execute=true")).status, 409);
    assert.deepEqual(h.calls, ["table:school_settings"]);
  }
});
test("valid controller retention policy permits dry-run with health uploads disabled; DB membership remains final authority", async () => {
  const h = route("maintenance", { settings: policy });
  const r = await h.post();
  assert.equal(r.status, 200);
  const result = await r.json();
  assert.equal(result.dryRun, true);
  assert.equal(result.policyConfigured, true);
  assert.deepEqual(h.calls, ["table:school_settings", "school_repository_record_retention"]);
  const denied = route("maintenance", { settings: policy, denyRpc: true });
  assert.equal((await denied.post()).status, 403);
  assert.deepEqual(denied.calls, ["table:school_settings", "school_repository_record_retention"]);
});
