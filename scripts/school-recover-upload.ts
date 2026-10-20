/** Manual incident recovery only. No time-based expiry, no automated force unlock.
 * First fence ALL potentially resumed writers/old credentials and obtain provider drain evidence.
 */
import { createAdminSupabaseClient } from "../lib/supabaseAdmin";
function value(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
async function main() {
  const school = process.env.SCHOOL_ID,
    owner = process.env.SCHOOL_MAINTENANCE_OWNER_UID,
    id = value("--document-id");
  if (!school || !owner || !id)
    throw new Error("SCHOOL_ID, SCHOOL_MAINTENANCE_OWNER_UID and --document-id required");
  const db = createAdminSupabaseClient();
  const { data, error } = await db
    .from("school_upload_reservations")
    .select("id,status,cleanup_requested,updated_at")
    .eq("school_id", school)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) throw new Error("Reservation unavailable; inspect the incident securely");
  if (!process.argv.includes("--apply")) {
    process.stdout.write(
      JSON.stringify(
        {
          dryRun: true,
          reservation: data,
          automaticExpiry: false,
          required:
            "Stop/revoke all writer execution and credentials; confirm provider requests drained/aborted. Uncertain evidence means DO NOT APPLY.",
        },
        null,
        2
      ) + "\n"
    );
    return;
  }
  const fence = value("--writer-fence-ref"),
    drain = value("--provider-drain-ref");
  if (
    process.env.SCHOOL_UPLOAD_RECOVERY_ALLOW_WRITE !== "yes" ||
    process.env.SCHOOL_UPLOAD_WRITERS_FENCED !== "confirmed" ||
    process.env.SCHOOL_UPLOAD_PROVIDER_DRAINED !== "confirmed" ||
    value("--confirm") !== "WRITERS FENCED AND STORAGE DRAINED" ||
    !fence ||
    fence.length < 12 ||
    !drain ||
    drain.length < 12
  )
    throw new Error(
      "Explicit operator write opt-in, writer fence and provider drain confirmations and incident evidence references are mandatory"
    );
  const actor = {
    id: owner,
    email: "",
    name: "Reviewed upload recovery",
    verified: true,
    admin: false,
  };
  const result = await db.rpc("school_upload_recover", {
    p_school: school,
    p_actor: actor,
    p_document_id: id,
    p_confirmation: "WRITERS FENCED AND STORAGE DRAINED",
    p_fence_reference: fence,
    p_drain_reference: drain,
  });
  if (result.error || typeof result.data !== "string")
    throw new Error(
      "Recovery rejected: confirm owner authority, hold review and incident evidence"
    );
  const path = result.data;
  const removed = await db.storage.from("school-private").remove([path]);
  if (removed.error) throw new Error("Recovery remains in cleanup queue; storage removal failed");
  const ack = await db.rpc("school_cleanup_ack", { p_school: school, p_paths: [path] });
  if (ack.error) throw new Error("Cleanup remains pending; acknowledgment rejected");
  process.stdout.write(
    JSON.stringify({
      recovered: true,
      documentId: id,
      privateObjectRemoved: true,
      accountDeletionStillRequiresNormalRetry: true,
    }) + "\n"
  );
}
void main().catch(() => {
  process.stderr.write(
    "Upload recovery not completed. Do not bypass the reservation. Review operator/fence/drain evidence and queued cleanup securely.\n"
  );
  process.exitCode = 1;
});
