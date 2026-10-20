import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { requireSchoolMutationOrigin } from "../../lib/school/http";
import { SchoolError } from "../../lib/school/engine";
const requireLocal = createRequire(import.meta.url);
const ts = requireLocal("typescript");
function harness(
  sessionUser: Record<string, unknown> | null,
  bearerClaims: Record<string, unknown> | null = null
) {
  const calls: { name: string; value?: unknown }[] = [];
  const chain: any = {
    select: () => chain,
    eq: () => chain,
    delete: () => chain,
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve: Function) => resolve({ data: null, error: null }),
  };
  const modules: Record<string, unknown> = {
    "next/server": {
      NextResponse: {
        json: (body: unknown, options?: ResponseInit) => {
          const response = Response.json(body, options) as Response & {
            cookies: { set: Function };
          };
          response.cookies = { set: () => {} };
          return response;
        },
      },
    },
    "@/lib/session": { getServerSession: async () => (sessionUser ? { user: sessionUser } : null) },
    "@/lib/firebase-admin": {
      getAdminAuth: () => ({
        verifyIdToken: async (_token: string, revoked: boolean) => {
          calls.push({ name: "verify", value: revoked });
          if (!bearerClaims) throw new Error("Invalid");
          return bearerClaims;
        },
        deleteUser: async (uid: string) => calls.push({ name: "identity.delete", value: uid }),
      }),
      getAdminDb: () => ({
        doc: () => ({ delete: async () => calls.push({ name: "profile.delete" }) }),
      }),
    },
    "@/lib/supabaseAdmin": {
      createAdminSupabaseClient: () => ({
        from: () => {
          calls.push({ name: "database.access" });
          return chain;
        },
      }),
    },
    "@/lib/school/server": {
      checkMutationOrigin: requireSchoolMutationOrigin,
      deleteSchoolAccountData: async (identity: unknown) =>
        calls.push({ name: "school.cleanup", value: identity }),
    },
    "@/lib/school/engine": { SchoolError },
    "@/lib/stripe": {
      stripe: { subscriptions: { cancel: async () => calls.push({ name: "stripe.cancel" }) } },
    },
  };
  const source = readFileSync(
    new URL("../../app/api/account/delete/route.ts", import.meta.url),
    "utf8"
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports: Record<string, unknown> = {};
  runInNewContext(compiled, {
    exports,
    require: (name: string) => {
      if (!(name in modules)) throw new Error("Unexpected import " + name);
      return modules[name];
    },
    process: { env: {} },
    console: { error: () => {} },
  });
  return { POST: exports.POST as (request: Request) => Promise<Response>, calls };
}
const user = {
  id: "cookie-uid",
  email: "changed@synthetic.example",
  name: "Synthetic",
  role: "student",
  emailVerified: false,
};
const request = (origin?: string, bearer?: string) =>
  new Request("https://school.example/api/account/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(origin ? { Origin: origin } : {}),
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: JSON.stringify({ confirmation: "DELETE MY DEUTSCHPILOT ACCOUNT" }),
  });
test("authenticated foreign/missing cookie Origin stops before school cleanup, Stripe and data access", async () => {
  for (const origin of [undefined, "https://evil.school.example"]) {
    const h = harness(user);
    const response = await h.POST(request(origin));
    assert.equal(response.status, 403);
    assert.equal(h.calls.length, 0);
  }
});
test("revoked-checked own authentication permits deletion after email change without weakening school read", async () => {
  const h = harness(user);
  const response = await h.POST(request("https://school.example"));
  assert.equal(response.status, 200);
  assert.equal(
    h.calls.find((c) => c.name === "school.cleanup")?.value &&
      (h.calls.find((c) => c.name === "school.cleanup")!.value as { id: string; verified: boolean })
        .verified,
    true
  );
  assert.equal(h.calls.filter((c) => c.name === "identity.delete")[0].value, "cookie-uid");
  assert.ok(
    h.calls.findIndex((c) => c.name === "school.cleanup") <
      h.calls.findIndex((c) => c.name === "identity.delete")
  );
});
test("verified bearer identity takes precedence over another cookie; invalid bearer never falls back", async () => {
  const claims = { uid: "native-uid", email: "native@synthetic.example", email_verified: false };
  const h = harness(user, claims);
  assert.equal((await h.POST(request(undefined, "valid-native"))).status, 200);
  assert.equal(h.calls.find((c) => c.name === "verify")?.value, true);
  assert.equal(
    (h.calls.find((c) => c.name === "school.cleanup")?.value as { id: string }).id,
    "native-uid"
  );
  const denied = harness(user);
  assert.equal((await denied.POST(request(undefined, "forged"))).status, 401);
  assert.ok(!denied.calls.some((c) => c.name === "school.cleanup" || c.name === "database.access"));
  const unauth = harness(null);
  assert.equal((await unauth.POST(request())).status, 401);
});
