import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import ts from "typescript";
function load(file: string, mocks: Record<string, unknown>, env: Record<string, string> = {}) {
  const exports: Record<string, any> = {};
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, {
    exports,
    require: (name: string) => {
      if (!(name in mocks)) throw new Error(`Unexpected dependency ${name}`);
      return mocks[name];
    },
    console,
    process: { env },
    Buffer,
    URL,
  });
  return exports;
}
function helper(session: unknown, database = {}) {
  let initialised = 0;
  const mod = load("lib/legacyLearningAccess.ts", {
    "server-only": {},
    "./session": { getServerSession: async () => session },
    "./supabaseAdmin": {
      createAdminSupabaseClient: () => {
        initialised++;
        return database;
      },
    },
    "node:crypto": require("node:crypto"),
  });
  return { mod, initialised: () => initialised };
}
test("private learning helper rejects unsigned and foreign UID before initialising privileged client", async () => {
  const a = helper(null);
  await assert.rejects(a.mod.legacyLearningClient("a"));
  assert.equal(a.initialised(), 0);
  const b = helper({ user: { id: "a", role: "student" } });
  await assert.rejects(b.mod.legacyLearningClient("b"));
  await assert.rejects(b.mod.legacyAdminClient());
  assert.equal(b.initialised(), 0);
  const db = { synthetic: true };
  const c = helper({ user: { id: "a", role: "student" } }, db);
  assert.equal(await c.mod.legacyLearningClient("a"), db);
});
test("profile resolution never reassigns a legacy row by matching email", async () => {
  const eq: unknown[] = [];
  let writes = 0;
  const chain = {
    select: () => chain,
    eq: (...args: unknown[]) => {
      eq.push(args);
      return chain;
    },
    maybeSingle: async () => ({ data: null, error: null }),
    update: () => {
      writes++;
      throw Error("ownership reassignment");
    },
  };
  const mod = load("lib/profileHelper.ts", {
    "server-only": {},
    "./supabaseAdmin": { createAdminSupabaseClient: () => ({ from: () => chain }) },
  });
  assert.equal(await mod.findProfile("verified-uid", "same@example.invalid"), null);
  assert.equal(writes, 0);
  assert.deepEqual(JSON.parse(JSON.stringify(eq)), [["firebase_uid", "verified-uid"]]);
});
test("placement score and bounded level computed on server, never taken from request", () => {
  const { mod } = helper(null);
  const answers = Object.fromEntries(
    [
      "Good morning",
      "Ich bin",
      "das",
      "bin",
      "klein",
      "macht",
      "hätte",
      "nevertheless",
      "darauf",
      "Er hätte früher kommen sollen.",
    ].map((v, i) => [String(i + 1), v])
  );
  const grade = mod.gradeLegacyPlacement(answers);
  assert.equal(grade.score, 10);
  assert.equal(grade.level, "B2");
  assert.throws(() => mod.gradeLegacyPlacement({ ...answers, score: 100 }));
  assert.throws(() => mod.gradeLegacyPlacement({ 1: "Good morning" }));
  assert.throws(() => mod.gradeLegacyPlacement({ ...answers, 1: "x".repeat(201) }));
  assert.throws(
    () => mod.requireQuery({ error: { message: "private database diagnostics" } }),
    /could not be loaded/
  );
});
test("teacher public directory uses publication opt-in and never returns Firebase UID/email", async () => {
  const selections: string[] = [];
  const filters: unknown[] = [];
  const rows = {
    user_id: "private-firebase-uid",
    full_name: "Synthetic Teacher",
    email: "private@example.invalid",
    bio: "Bio",
    avatar_url: null,
    teaches_levels: ["A1"],
    experience_years: 3,
  };
  const builder = (table: string): any => ({
    select: (columns: string) => {
      selections.push(table + ":" + columns);
      return builder(table);
    },
    eq: (...args: unknown[]) => {
      filters.push(args);
      return builder(table);
    },
    in: () => builder(table),
    order: () => builder(table),
    limit: async () => ({ data: [rows], error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  });
  const { mod } = helper(null, { from: builder });
  const result = await mod.publicLegacyTeachers();
  assert.equal(result[0].full_name, "Synthetic Teacher");
  assert.notEqual(result[0].user_id, "private-firebase-uid");
  assert.equal(result[0].email, undefined);
  assert.ok(filters.some((v: any) => v[0] === "public_directory_enabled" && v[1] === true));
  assert.ok(selections.every((x) => !x.includes("email")));
});
const container = process.env.SCHOOL_TEST_POSTGRES_CONTAINER || "deutschpilot-school-test-20261020";
const sql = (db: string, input: string) =>
  execFileSync(
    "docker",
    ["exec", "-i", container, "psql", "-U", "postgres", "-d", db, "-v", "ON_ERROR_STOP=1", "-At"],
    { input, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
  ).trim();
test("real PostgreSQL: legacy open policies denied, service-only RPC preserves best completion and owner rows", () => {
  const db = "legacy_privacy_mobile_" + Date.now();
  sql("postgres", `CREATE DATABASE ${db};`);
  try {
    sql(
      db,
      `CREATE TABLE profiles(id text PRIMARY KEY, email text); CREATE TABLE courses(id uuid PRIMARY KEY,is_published bool); CREATE TABLE lessons(id uuid PRIMARY KEY,course_id uuid REFERENCES courses(id)); CREATE TABLE student_progress(id uuid DEFAULT gen_random_uuid(),user_id text,lesson_id uuid,course_id uuid,score integer,completed boolean,updated_at timestamptz,UNIQUE(user_id,lesson_id)); CREATE TABLE student_room_progress(id uuid DEFAULT gen_random_uuid(),user_id text); CREATE TABLE student_task_progress(id uuid DEFAULT gen_random_uuid(),user_id text); CREATE TABLE class_enrollments(id uuid DEFAULT gen_random_uuid(),student_id text); CREATE TABLE live_classes(id uuid PRIMARY KEY,meet_url text); CREATE TABLE teacher_profiles(user_id text PRIMARY KEY); INSERT INTO profiles VALUES('private-profile','private@example.invalid'); INSERT INTO courses VALUES('10000000-0000-0000-0000-000000000001',true),('10000000-0000-0000-0000-000000000002',false); INSERT INTO lessons VALUES('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001'); ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; GRANT ALL ON profiles TO anon,authenticated; CREATE POLICY old_broad ON profiles FOR ALL TO anon,authenticated USING(true) WITH CHECK(true);`
    );
    sql(db, fs.readFileSync("supabase/migration-legacy-private-access.sql", "utf8"));
    for (const role of ["anon", "authenticated"]) {
      for (const table of [
        "profiles",
        "student_progress",
        "student_room_progress",
        "student_task_progress",
        "placement_tests",
        "class_enrollments",
        "teacher_profiles",
        "live_classes",
      ])
        assert.throws(
          () => sql(db, `SET ROLE ${role}; SELECT * FROM ${table};`),
          /permission denied/
        );
      assert.throws(
        () =>
          sql(
            db,
            `SET ROLE ${role}; SELECT save_learning_progress('a','20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',100,true);`
          ),
        /permission denied/
      );
    }
    // Reintroducing an old broad grant cannot bypass restrictive false policy.
    sql(db, "GRANT SELECT,INSERT,UPDATE,DELETE ON profiles TO anon,authenticated;");
    for (const role of ["anon", "authenticated"]) {
      assert.equal(
        sql(db, `SET ROLE ${role}; SELECT count(*) FROM profiles;`).split("\n").pop(),
        "0"
      );
      assert.throws(
        () =>
          sql(
            db,
            `SET ROLE ${role}; INSERT INTO profiles(id,email) VALUES('forged','fake@example.invalid');`
          ),
        /row-level security/
      );
    }
    const rpc = (uid: string, score: number, done: boolean) =>
      `SELECT save_learning_progress('${uid}','20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',${score},${done});`;
    sql(
      db,
      "SET ROLE service_role;" + rpc("a", 90, true) + rpc("a", 10, false) + rpc("b", 30, false)
    );
    assert.equal(
      sql(
        db,
        "SET ROLE service_role; SELECT user_id||':'||score||':'||completed FROM student_progress ORDER BY user_id;"
      ),
      "SET\na:90:true\nb:30:false"
    );
    assert.throws(
      () =>
        sql(
          db,
          "SET ROLE service_role; SELECT save_learning_progress('a','20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002',100,true);"
        ),
      /Published lesson/
    );
    assert.throws(
      () => sql(db, "SET ROLE service_role;" + rpc("a", 101, true)),
      /Invalid progress/
    );
    assert.equal(
      sql(db, "SET ROLE service_role; SELECT count(*) FROM profiles;").split("\n").pop(),
      "1"
    );
    // Idempotent application; no implicit consent or email-based ownership backfill.
    sql(db, fs.readFileSync("supabase/migration-legacy-private-access.sql", "utf8"));
    assert.equal(sql(db, "SELECT count(*) FROM profiles WHERE firebase_uid IS NOT NULL;"), "0");
  } finally {
    sql("postgres", `DROP DATABASE ${db} WITH (FORCE);`);
  }
});

test("placement HTTP denies unauthenticated, cross-origin, oversized and forged-owner payloads before database", async () => {
  let session: any = null;
  let calls = 0;
  const grades = helper(null).mod;
  const mod = load("app/api/learning/placement/route.ts", {
    "next/server": {
      NextResponse: { json: (body: any, init: any) => ({ body, status: init?.status || 200 }) },
    },
    "@/lib/session": { getServerSession: async () => session },
    "@/lib/legacyLearningAccess": {
      gradeLegacyPlacement: grades.gradeLegacyPlacement,
      legacyLearningClient: async () => {
        calls++;
        throw Error("must not reach DB");
      },
      requireQuery: grades.requireQuery,
    },
  });
  const request = (body: unknown, origin = "https://school.invalid") =>
    new Request("https://school.invalid/api/learning/placement", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  assert.equal((await mod.POST(request({}))).status, 401);
  session = { user: { id: "verified-user" } };
  assert.equal((await mod.POST(request({}, "https://other.invalid"))).status, 403);
  assert.equal(
    (await mod.POST(request({ action: "submit", answers: {}, userId: "victim" }))).status,
    400
  );
  assert.equal(
    (await mod.POST(request({ action: "submit", answers: { a: "x".repeat(5000) } }))).status,
    413
  );
  assert.equal(calls, 0);
});
function adminHarness(failRevocation = false) {
  const calls: string[] = [];
  const auth = {
    getUser: async () => ({ customClaims: { role: "admin", existing: true } }),
    revokeRefreshTokens: async (uid: string) => {
      calls.push("revoke:" + uid);
      if (failRevocation) throw Error("provider unavailable");
    },
    setCustomUserClaims: async (uid: string, claims: any) => {
      assert.equal(claims.existing, true);
      calls.push("claims:" + uid + ":" + claims.role);
    },
    updateUser: async (uid: string, value: any) => {
      calls.push("disabled:" + uid + ":" + value.disabled);
    },
  };
  const chain = { update: () => chain, eq: async () => ({ error: null }) };
  const mod = load("app/api/admin/users/route.ts", {
    "next/server": {
      NextResponse: { json: (body: any, init: any) => ({ body, status: init?.status || 200 }) },
    },
    "@/lib/firebase-admin": { getAdminAuth: () => auth },
    "@/lib/session": {
      getServerSession: async () => ({ user: { id: "current-admin", role: "admin" } }),
    },
    "@/lib/supabaseAdmin": { createAdminSupabaseClient: () => ({ from: () => chain }) },
    "@/lib/sales-training": { isConfiguredSalesEmail: () => false },
  });
  const request = (body: unknown) =>
    new Request("https://school.invalid/api/admin/users", {
      method: "PATCH",
      headers: { Origin: "https://school.invalid", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  return { mod, calls, request };
}
test("global role change and disable revoke stale sessions before and after authority mutation", async () => {
  const h = adminHarness();
  assert.equal((await h.mod.PATCH(h.request({ uid: "target", role: "student" }))).status, 200);
  assert.deepEqual(h.calls, ["revoke:target", "claims:target:student", "revoke:target"]);
  const d = adminHarness();
  assert.equal((await d.mod.PATCH(d.request({ uid: "target", disabled: true }))).status, 200);
  assert.deepEqual(d.calls, ["revoke:target", "disabled:target:true", "revoke:target"]);
});
test("administrator self-demotion/disable/delete and revocation outages stop before dangerous changes", async () => {
  const h = adminHarness();
  assert.equal(
    (await h.mod.PATCH(h.request({ uid: "current-admin", role: "student" }))).status,
    409
  );
  assert.equal(
    (await h.mod.PATCH(h.request({ uid: "current-admin", disabled: true }))).status,
    409
  );
  assert.equal((await h.mod.DELETE(h.request({ uid: "current-admin" }))).status, 409);
  assert.equal((await h.mod.DELETE(h.request({ uid: "target" }))).status, 409);
  assert.deepEqual(h.calls, []);
  const failed = adminHarness(true);
  assert.equal(
    (await failed.mod.PATCH(failed.request({ uid: "target", role: "student" }))).status,
    503
  );
  assert.deepEqual(failed.calls, ["revoke:target"]);
});

test("placement success persists only verified UID and updates level only from its owned saved test", async () => {
  const recorded: any[] = [];
  let table = "";
  let inserted = false;
  const chain: any = {
    insert: (value: any) => {
      recorded.push(["insert", value]);
      inserted = true;
      return chain;
    },
    update: (value: any) => {
      recorded.push(["update", value]);
      return chain;
    },
    select: () => chain,
    eq: (key: string, value: unknown) => {
      recorded.push([key, value]);
      return chain;
    },
    single: async () => ({ data: { id: "30000000-0000-0000-0000-000000000001" }, error: null }),
    maybeSingle: async () => ({
      data: table === "placement_tests" ? { level_result: "B1" } : { id: "profile" },
      error: null,
    }),
  };
  const grades = helper(null).mod;
  const mod = load("app/api/learning/placement/route.ts", {
    "next/server": {
      NextResponse: { json: (body: any, init: any) => ({ body, status: init?.status || 200 }) },
    },
    "@/lib/session": { getServerSession: async () => ({ user: { id: "verified-user" } }) },
    "@/lib/legacyLearningAccess": {
      gradeLegacyPlacement: grades.gradeLegacyPlacement,
      requireQuery: grades.requireQuery,
      legacyLearningClient: async (uid: string) => {
        assert.equal(uid, "verified-user");
        return {
          from: (name: string) => {
            table = name;
            return chain;
          },
        };
      },
    },
  });
  const request = (input: unknown) =>
    new Request("https://school.invalid/api/learning/placement", {
      method: "POST",
      headers: { Origin: "https://school.invalid" },
      body: JSON.stringify(input),
    });
  const answers = Object.fromEntries(
    [
      "Good morning",
      "Ich bin",
      "das",
      "bin",
      "klein",
      "macht",
      "hätte",
      "nevertheless",
      "darauf",
      "Er hätte früher kommen sollen.",
    ].map((v, i) => [String(i + 1), v])
  );
  const result = await mod.POST(request({ action: "submit", answers }));
  assert.equal(result.status, 200);
  assert.equal(result.body.score, 10);
  assert.equal(recorded[0][1].user_id, "verified-user");
  assert.equal(inserted, true);
  assert.equal(
    (await mod.POST(request({ action: "saveLevel", testId: result.body.testId }))).status,
    200
  );
  assert.ok(recorded.some((x) => x[0] === "user_id" && x[1] === "verified-user"));
  assert.ok(recorded.some((x) => x[0] === "firebase_uid" && x[1] === "verified-user"));
  assert.ok(recorded.some((x) => x[0] === "update" && x[1].german_level === "B1"));
});

test("revoked ID token cannot mint a new session or assign a signup role", async () => {
  let minted = 0,
    profiles = 0,
    claims = 0;
  const auth = {
    verifyIdToken: async (_token: string, revoked: boolean) => {
      assert.equal(revoked, true);
      throw Error("revoked token");
    },
    createSessionCookie: async () => {
      minted++;
    },
    setCustomUserClaims: async () => {
      claims++;
    },
  };
  const next = {
    "next/server": {
      NextResponse: {
        json: (body: any, init: any) => ({
          body,
          status: init?.status || 200,
          cookies: { set: () => {} },
        }),
      },
    },
    "@/lib/firebase-admin": {
      getAdminAuth: () => auth,
      getAdminDb: () => {
        throw Error("DB should not be reached");
      },
    },
  };
  const session = load("app/api/auth/session/route.ts", {
    ...next,
    "@/lib/email": {
      sendWelcomeEmail: () => {
        throw Error("no mail");
      },
    },
  });
  const req = (body: unknown, url: string) =>
    new Request(url, {
      method: "POST",
      headers: { Origin: "https://school.invalid", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  assert.equal(
    (await session.POST(req({ idToken: "old-token" }, "https://school.invalid/api/auth/session")))
      .status,
    401
  );
  const role = load(
    "app/api/auth/set-role/route.ts",
    {
      ...next,
      "@/lib/profileHelper": {
        findOrCreateProfile: async () => {
          profiles++;
        },
      },
    },
    { SUPABASE_SERVICE_ROLE_KEY: "synthetic-placeholder" }
  );
  assert.equal(
    (
      await role.POST(
        req(
          { idToken: "old-token", fullName: "Synthetic Student", role: "teacher" },
          "https://school.invalid/api/auth/set-role"
        )
      )
    ).status,
    401
  );
  assert.equal(minted, 0);
  assert.equal(profiles, 0);
  assert.equal(claims, 0);
});
test("a new valid signup cannot self-assign teacher/admin privileges", async () => {
  let writes = 0;
  const mod = load(
    "app/api/auth/set-role/route.ts",
    {
      "next/server": {
        NextResponse: { json: (body: any, init: any) => ({ body, status: init?.status || 200 }) },
      },
      "@/lib/firebase-admin": {
        getAdminAuth: () => ({
          verifyIdToken: async (_token: string, revoked: boolean) => {
            assert.equal(revoked, true);
            return { uid: "new-student", email: "synthetic@example.invalid" };
          },
          getUser: async () => ({ customClaims: {} }),
          setCustomUserClaims: async () => {
            writes++;
          },
        }),
        getAdminDb: () => {
          throw Error("Firestore must not be reached");
        },
      },
      "@/lib/profileHelper": {
        findOrCreateProfile: async () => {
          writes++;
        },
      },
    },
    { SUPABASE_SERVICE_ROLE_KEY: "synthetic-placeholder" }
  );
  for (const role of ["teacher", "admin"]) {
    const response = await mod.POST(
      new Request("https://school.invalid/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: "valid-synthetic", fullName: "Synthetic Student", role }),
      })
    );
    assert.equal(response.status, 403);
  }
  assert.equal(writes, 0);
});
