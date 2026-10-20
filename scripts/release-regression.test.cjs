const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, mocks, env = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, {
    exports,
    require: (name) => {
      if (!(name in mocks)) throw new Error(`Unexpected dependency ${name}`);
      return mocks[name];
    },
    process: { env },
    console,
    URL,
  });
  return exports;
}
function checkout({ pilot = true, env = {}, signedIn = false } = {}) {
  let sessionReads = 0;
  const forbidden = () => {
    throw new Error("Stripe/database must not be reached by a blocked request");
  };
  const policy = load("lib/fernusg.ts", {}, env);
  const mod = load(
    "app/api/checkout/create-session/route.ts",
    {
      "next/server": {
        NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) },
      },
      "@/lib/session": {
        getServerSession: async () => {
          sessionReads++;
          return signedIn ? { user: { id: "test-uid" } } : null;
        },
      },
      "@/lib/stripe": new Proxy({}, { get: () => forbidden }),
      "@/lib/entitlements": new Proxy({}, { get: () => forbidden }),
      "@/lib/aiTrainer/access": { getAITrainerAccess: forbidden },
      "@/lib/pilot": { FREE_PILOT_MODE: pilot },
      "@/lib/fernusg": policy,
    },
    env
  );
  const request = (headers) => ({
    headers: new Headers(headers),
    json: async () => ({ product: "full_access", plan: "tester_trial", locale: "en" }),
    url: "https://preview.example/api/checkout/create-session",
  });
  return { mod, request, sessionReads: () => sessionReads };
}
test("free pilot rejects all payment products before identity, Stripe or database access", async () => {
  const h = checkout();
  const response = await h.mod.POST(
    h.request({ referer: "https://preview.example/en/subscription" })
  );
  assert.equal(response.status, 410);
  assert.equal(h.sessionReads(), 0);
});
test("Germany country signal blocks an English checkout flow when pilot is disabled", async () => {
  const h = checkout({ pilot: false, env: { STRIPE_SECRET_KEY: "test-only-placeholder" } });
  const response = await h.mod.POST(
    h.request({ referer: "https://preview.example/en/subscription", "x-vercel-ip-country": "DE" })
  );
  assert.equal(response.status, 451);
  assert.match(response.body.error, /Germany/);
  assert.equal(h.sessionReads(), 0);
});
test("German checkout flow remains on hold without a country signal", async () => {
  const h = checkout({ pilot: false });
  const response = await h.mod.POST(
    h.request({ referer: "https://preview.example/de/subscription" })
  );
  assert.equal(response.status, 451);
  assert.match(response.body.error, /Deutschland/);
});
test("unconfigured non-German payments and unsigned requests fail closed", async () => {
  const a = checkout({ pilot: false });
  assert.equal((await a.mod.POST(a.request({ "x-vercel-ip-country": "AT" }))).status, 503);
  const b = checkout({ pilot: false, env: { STRIPE_SECRET_KEY: "test-only-placeholder" } });
  assert.equal((await b.mod.POST(b.request({ "x-vercel-ip-country": "US" }))).status, 401);
});
test("unauthenticated native deletion never initializes database or deletes an identity", async () => {
  const forbidden = () => {
    throw new Error("Deletion side effect reached");
  };
  const mod = load("app/api/account/delete/route.ts", {
    "next/server": {
      NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) },
    },
    "@/lib/session": { getServerSession: async () => null },
    "@/lib/firebase-admin": { getAdminAuth: forbidden, getAdminDb: forbidden },
    "@/lib/supabaseAdmin": { createAdminSupabaseClient: forbidden },
    "@/lib/stripe": { stripe: {} },
    "@/lib/school/server": {
      deleteSchoolAccountData: forbidden,
      preflightSchoolAccountDeletion: forbidden,
    },
    "@/lib/school/engine": { SchoolError: class SchoolError extends Error {} },
  });
  const response = await mod.POST({ headers: new Headers(), json: forbidden });
  assert.equal(response.status, 401);
});
