import { timingSafeEqual } from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { errorResponse, privateHeaders, repositoryRpc } from "@/lib/school/server";
import { SchoolError } from "@/lib/school/engine";
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
    const records = await repositoryRpc("school_repository_record_retention", {
      p_actor: actor,
      p_dry_run: dryRun,
    });
    if (dryRun) return Response.json({ records, dryRun: true }, { headers: privateHeaders });
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
      { dryRun: false, records, privateFilesRemoved: paths.length, boundedBatch: true },
      { headers: privateHeaders }
    );
  } catch (e) {
    return errorResponse(e);
  }
}
