import { decorateSchoolProgress } from "./progress-metadata";
import { loadSchool, transactSchool, databaseError } from "./repository";
import { verifiedSchoolIdentity, requireSchoolMutationOrigin } from "./http";
import { cookies } from "next/headers";
import { getAdminAuth } from "../firebase-admin";
import { createAdminSupabaseClient } from "../supabaseAdmin";
import { SchoolError, snapshot, apply, type Identity, type SchoolState } from "./engine";
export async function schoolIdentity(request: Request): Promise<Identity> {
  return verifiedSchoolIdentity(request, cookies().get("__session")?.value, getAdminAuth());
}
export const checkMutationOrigin = requireSchoolMutationOrigin;
export function schoolId() {
  const id = process.env.SCHOOL_ID;
  if (!id || !/^[a-zA-Z0-9_-]{1,100}$/.test(id))
    throw new SchoolError("UNCONFIGURED", "School service is not configured", 503);
  return id;
}
export async function readState(
  u: Identity,
  action: Record<string, unknown> = {}
): Promise<SchoolState> {
  return (await loadSchool(schoolId(), u, action)).state;
}
export async function readSnapshot(u: Identity) {
  const loaded = await loadSchool(schoolId(), u);
  const visible = snapshot(loaded.state, u);
  visible.pagination = loaded.pagination;
  visible.pageCursors = Object.fromEntries(
    Object.entries(loaded.records).map(([kind, rows]) => [
      kind,
      loaded.pagination[kind] ? rows[rows.length - 1]?.id || null : null,
    ])
  );
  const progress = await decorateSchoolProgress(visible.progress);
  visible.progress = progress.items;
  visible.progressMetadataPending = progress.pending;
  visible.capabilities.push = pushConfigured();
  return visible;
}
export async function mutate<T>(
  u: Identity,
  action: Record<string, unknown>,
  fn: (s: SchoolState) => T | Promise<T>
) {
  return transactSchool(schoolId(), u, action, fn, process.env.SCHOOL_BOOTSTRAP_OWNER_UID);
}
export async function repositoryRpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await createAdminSupabaseClient().rpc(name, {
    p_school: schoolId(),
    ...args,
  });
  if (error) databaseError(error);
  return data as T;
}
export function errorResponse(error: unknown) {
  const e =
    error instanceof SchoolError
      ? error
      : new SchoolError("UNAVAILABLE", "School service is temporarily unavailable", 503);
  return Response.json(
    { error: e.message, code: e.code },
    { status: e.status, headers: { "Cache-Control": "no-store" } }
  );
}
export const privateHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
export function pushConfigured() {
  return !!(
    process.env.SCHOOL_PUSH_CRON_SECRET &&
    process.env.EXPO_ACCESS_TOKEN &&
    process.env.SCHOOL_PUSH_ENABLED === "true"
  );
}

/** Called before existing profile/subscription/identity deletion. File deletion is retryable;
 * membership remains disabled until cleanup succeeds. Explicit holds are persisted as review requests. */
export async function deleteSchoolAccountData(u: Identity) {
  if (!process.env.SCHOOL_ID) return;
  const prepared = await repositoryRpc<{ blocked: boolean; empty?: boolean; reason?: string }>(
    "school_privacy_prepare",
    { p_actor: u }
  );
  if (prepared.blocked)
    throw new SchoolError(
      "SCHOOL_RECORDS_HOLD",
      prepared.reason || "School retention review required",
      409
    );
  if (prepared.empty) return;
  for (let batch = 0; batch < 10000; batch++) {
    const paths = await repositoryRpc<string[]>("school_privacy_cleanup_batch", { p_uid: u.id });
    if (!paths.length) {
      await repositoryRpc("school_privacy_finalize", { p_actor: u });
      return;
    }
    const { error } = await createAdminSupabaseClient()
      .storage.from("school-private")
      .remove(paths);
    if (error)
      throw new SchoolError("CLEANUP_PENDING", "Private file removal pending; retry deletion", 503);
    await repositoryRpc("school_cleanup_ack", { p_paths: paths });
  }
  throw new SchoolError(
    "CLEANUP_PENDING",
    "Large account cleanup remains queued; retry deletion",
    503
  );
}
export async function syncSchoolLearningProgress(
  u: Identity,
  items: { lessonId: string; completed: boolean; score: number }[]
): Promise<"synced" | "not_member" | "not_configured" | "pending"> {
  if (!process.env.SCHOOL_ID) return "not_configured";
  try {
    const action = { action: "progress.sync" as const, items };
    const membership = (await loadSchool(schoolId(), u, action)).state.members.find(
      (m) => m.id === u.id
    );
    if (membership?.role !== "student") return "not_member";
    await mutate(u, action, (s) => apply(s, u, action));
    return "synced";
  } catch (e) {
    if (e instanceof SchoolError && e.code === "NOT_MEMBER") return "not_member";
    return "pending";
  }
}
