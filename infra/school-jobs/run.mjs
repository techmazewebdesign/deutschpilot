// Server-only scheduled client. No provider credentials or content are printed.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
export async function runJobs(env = process.env, transport = fetch, read = readFileSync) {
  if (env.SCHOOL_JOBS_ENABLED !== "true") return { status: "disabled" };
  const base = new URL(env.SCHOOL_JOBS_BASE_URL || "");
  if (
    base.protocol !== "https:" ||
    base.username ||
    base.password ||
    base.pathname !== "/" ||
    base.search ||
    base.hash
  )
    throw new Error("HTTPS origin without credentials/path/query required");
  if (env.SCHOOL_JOBS_POLICY_CONFIRMED !== "true")
    throw new Error("Controller policy confirmation required");
  const secret = read(env.SCHOOL_JOBS_SECRET_FILE, "utf8").trim();
  if (secret.length < 32) throw new Error("Job secret file missing or too short");
  const headers = { Authorization: `Bearer ${secret}` };
  // Optional Vercel automation credential remains server-only, never a query/cookie.
  if (env.SCHOOL_VERCEL_BYPASS_SECRET_FILE) {
    const bypass = read(env.SCHOOL_VERCEL_BYPASS_SECRET_FILE, "utf8").trim();
    if (!bypass) throw new Error("Configured deployment automation secret is empty");
    headers["x-vercel-protection-bypass"] = bypass;
  }
  async function post(path) {
    const response = await transport(new URL(path, base), {
      method: "POST",
      headers,
      redirect: "error",
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json"))
      throw new Error(
        `Job endpoint rejected (${response.status}); verify access/protection/policy`
      );
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid job response");
    }
    return data;
  }
  // Real server dry-run validates its own active owner and configured retention.
  const preview = await post("/api/school/maintenance");
  if (preview.dryRun !== true || preview.policyConfigured !== true || !preview.records)
    throw new Error("Server policy dry-run did not confirm configured retention");
  let maintenance = "dry-run";
  if (env.SCHOOL_JOBS_EXECUTE_MAINTENANCE === "true") {
    const result = await post("/api/school/maintenance?execute=true");
    if (result.dryRun !== false) throw new Error("Server did not confirm maintenance execution");
    maintenance = "executed-bounded-batch";
  }
  let reminders = "disabled",
    push = "disabled";
  if (env.SCHOOL_JOBS_REMINDERS_ENABLED === "true") {
    const allowPush = env.SCHOOL_JOBS_PUSH_APPROVED === "true";
    const result = await post(`/api/school/notifications?push=${allowPush ? "true" : "false"}`);
    if (!allowPush && result.pushDisabled !== true)
      throw new Error("Server did not confirm push suppression");
    reminders = "processed";
    if (allowPush) push = "approved-provider-attempt; receipt-is-not-device-display";
  }
  return { status: "completed", maintenance, reminders, push };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.stdout.write(JSON.stringify(await runJobs()) + "\n");
  } catch {
    process.stderr.write(
      "School jobs failed; check access, policy, provider health and private operator configuration. No automatic replay.\n"
    );
    process.exitCode = 1;
  }
}
