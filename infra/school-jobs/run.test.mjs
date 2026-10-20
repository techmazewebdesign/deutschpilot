import { test } from "node:test";
import assert from "node:assert/strict";
import { runJobs } from "./run.mjs";
const configured = {
  SCHOOL_JOBS_ENABLED: "true",
  SCHOOL_JOBS_BASE_URL: "https://school.synthetic.invalid",
  SCHOOL_JOBS_POLICY_CONFIRMED: "true",
  SCHOOL_JOBS_SECRET_FILE: "/synthetic/secret",
};
const read = () => "synthetic-server-only-token-1234567890";
const good = () => Response.json({ dryRun: true, policyConfigured: true, records: {} });
test("disabled jobs make no network or secret reads", async () => {
  assert.deepEqual(
    await runJobs(
      {},
      () => {
        throw Error("network forbidden");
      },
      () => {
        throw Error("secret read forbidden");
      }
    ),
    { status: "disabled" }
  );
});
test("scheduler refuses insecure origins, absent operator policy confirmation and short secrets before requests", async () => {
  for (const patch of [
    { SCHOOL_JOBS_BASE_URL: "http://localhost" },
    { SCHOOL_JOBS_BASE_URL: "https://user:pass@school.invalid" },
    { SCHOOL_JOBS_BASE_URL: "https://school.invalid/path" },
    { SCHOOL_JOBS_POLICY_CONFIRMED: "false" },
  ])
    await assert.rejects(
      runJobs(
        { ...configured, ...patch },
        () => {
          throw Error("should not reach network");
        },
        read
      )
    );
  await assert.rejects(
    runJobs(
      configured,
      () => {
        throw Error("should not reach network");
      },
      () => ""
    )
  );
});
test("default maintenance is dry-run and notifications/push remain uncalled", async () => {
  const calls = [];
  const result = await runJobs(
    configured,
    async (url, init) => {
      calls.push({ url: String(url), init });
      return good();
    },
    read
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://school.synthetic.invalid/api/school/maintenance");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.redirect, "error");
  assert.equal(result.maintenance, "dry-run");
  assert.equal(result.push, "disabled");
});
test("reminders explicitly suppress push; independent execution and push approvals required", async () => {
  const calls = [];
  const request = async (url, init) => {
    calls.push({ url: String(url), init });
    return String(url).includes("notifications") ? Response.json({ pushDisabled: true }) : good();
  };
  await runJobs({ ...configured, SCHOOL_JOBS_REMINDERS_ENABLED: "true" }, request, read);
  assert.equal(
    calls[1].url,
    "https://school.synthetic.invalid/api/school/notifications?push=false"
  );
  const approved = [];
  await runJobs(
    {
      ...configured,
      SCHOOL_JOBS_EXECUTE_MAINTENANCE: "true",
      SCHOOL_JOBS_REMINDERS_ENABLED: "true",
      SCHOOL_JOBS_PUSH_APPROVED: "true",
    },
    async (url) => {
      approved.push(String(url));
      return String(url).includes("execute")
        ? Response.json({ dryRun: false })
        : String(url).includes("notifications")
          ? Response.json({})
          : good();
    },
    read
  );
  assert.equal(approved[1], "https://school.synthetic.invalid/api/school/maintenance?execute=true");
  assert.ok(approved[2].endsWith("?push=true"));
});
test("auth/protection/HTML/missing-policy failures stop before writes; no redirect replay", async () => {
  for (const reply of [
    new Response("", { status: 403 }),
    new Response("", { status: 307, headers: { location: "https://login.invalid" } }),
    new Response("<html>Login</html>", { headers: { "content-type": "text/html" } }),
    Response.json({ dryRun: true, policyConfigured: false }),
    Response.json({ dryRun: true }),
  ]) {
    let calls = 0;
    await assert.rejects(
      runJobs(
        {
          ...configured,
          SCHOOL_JOBS_EXECUTE_MAINTENANCE: "true",
          SCHOOL_JOBS_REMINDERS_ENABLED: "true",
        },
        async () => {
          calls++;
          return reply;
        },
        read
      )
    );
    assert.equal(calls, 1);
  }
});
test("Vercel automation secret remains a server header and push suppression must be confirmed", async () => {
  let observed;
  await runJobs(
    { ...configured, SCHOOL_VERCEL_BYPASS_SECRET_FILE: "/synthetic/bypass" },
    async (url, init) => {
      observed = { url, init };
      return good();
    },
    read
  );
  assert.equal(observed.init.headers["x-vercel-protection-bypass"], read());
  assert.ok(!String(observed.url).includes(read()));
  await assert.rejects(
    runJobs(
      { ...configured, SCHOOL_JOBS_REMINDERS_ENABLED: "true" },
      async (url) =>
        String(url).includes("notifications") ? Response.json({ acceptedTickets: 0 }) : good(),
      read
    )
  );
});
