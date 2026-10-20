import { timingSafeEqual } from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { errorResponse, privateHeaders, repositoryRpc, schoolId } from "@/lib/school/server";
import { SchoolError, retentionPolicyConfigured } from "@/lib/school/engine";
export const dynamic = "force-dynamic";
/** Operator scheduler only; dry-run default. Uses configured owner identity for audited maintenance. */
export async function POST(request: Request) {
  try {
    const secret = process.env.SCHOOL_JOBS_CRON_SECRET;
    const uid = process.env.SCHOOL_MAINTENANCE_OWNER_UID;
    const incoming = Buffer.from(request.headers.get("authorization") || "");
    const expected = Buffer.from(`Bearer ${secret}`);
    if (
      !secret ||
      !uid ||
      incoming.length !== expected.length ||
      !timingSafeEqual(incoming, expected)
    )
      throw new SchoolError("FORBIDDEN", "Forbidden");
    const dryRun = new URL(request.url).searchParams.get("execute") !== "true";
    const actor = {
      id: uid,
      email: "",
      name: "Scheduled maintenance",
      verified: true,
      admin: false,
    };
    // Read only the single server-configured settings row; no pupil records hydrated.
    const { data: configuredSettings, error: policyError } = await createAdminSupabaseClient()
      .from("school_settings")
      .select("payload")
      .eq("school_id", schoolId())
      .eq("id", "settings")
      .maybeSingle();
    if (policyError) throw new SchoolError("POLICY_UNAVAILABLE", "School policy unavailable", 503);
    if (!retentionPolicyConfigured(configuredSettings?.payload))
      throw new SchoolError(
        "POLICY_REQUIRED",
        "Controller and complete retention policy required",
        409
      );
    const records = await repositoryRpc("school_repository_record_retention", {
      p_actor: actor,
      p_dry_run: dryRun,
    });
    if (dryRun)
      return Response.json(
        { records, dryRun: true, policyConfigured: true },
        { headers: privateHeaders }
      );
    const paths = await repositoryRpc<string[]>("school_repository_retention", { p_actor: actor });
    if (paths.length) {
      const { error } = await createAdminSupabaseClient()
        .storage.from("school-private")
        .remove(paths);
      if (error)
        throw new SchoolError(
          "CLEANUP_PENDING",
          "Expired files blocked; object cleanup remains queued",
          503
        );
      await repositoryRpc("school_cleanup_ack", { p_paths: paths });
    }
    return Response.json(
      {
        dryRun: false,
        policyConfigured: true,
        records,
        privateFilesRemoved: paths.length,
        boundedBatch: true,
      },
      { headers: privateHeaders }
    );
  } catch (e) {
    return errorResponse(e);
  }
}
