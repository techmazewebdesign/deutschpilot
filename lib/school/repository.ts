import { createHash } from "node:crypto";
import { createAdminSupabaseClient } from "../supabaseAdmin";
import { emptyState, SchoolError, type Identity, type SchoolState } from "./engine";
export type StoredRow = {
  id: string;
  payload: Record<string, unknown>;
  revision: number;
  created_at: string;
};
export type LoadedState = {
  state: SchoolState;
  records: Record<string, StoredRow[]>;
  pagination: Record<string, boolean>;
};
const arrays = [
  "members",
  "classes",
  "attendance",
  "absences",
  "documents",
  "documentRequests",
  "letters",
  "chatMessages",
  "chatReads",
  "notifications",
  "progress",
  "invites",
  "devices",
  "deletionRequests",
  "audit",
] as const;
export function databaseError(error: { code?: string; message?: string } | null): never {
  const message = error?.message || "";
  if (
    error?.code === "40001" ||
    error?.code === "40P01" ||
    error?.code === "23505" ||
    message.includes("SCHOOL_CONFLICT")
  )
    throw new SchoolError("CONFLICT", "Records changed; retry request", 409);
  if (message.includes("SCHOOL_UPLOAD_PENDING"))
    throw new SchoolError(
      "UPLOAD_PENDING",
      "A private upload is unresolved; deletion awaits secure cleanup or reviewed recovery",
      503
    );
  if (message.includes("SCHOOL_NOT_MEMBER"))
    throw new SchoolError("NOT_MEMBER", "Verified school membership required", 403);
  if (message.includes("SCHOOL_"))
    throw new SchoolError("FORBIDDEN", "School access or workflow was denied", 403);
  throw new SchoolError("STORAGE_UNAVAILABLE", "School storage is unavailable", 503);
}
export function hydrate(
  schoolId: string,
  records: Record<string, StoredRow[]>,
  pagination: Record<string, boolean> = {}
): LoadedState {
  const state = emptyState(schoolId);
  for (const key of arrays)
    (state as unknown as Record<string, unknown>)[key] = (records[key] || []).map((x) => x.payload);
  if (records.settings?.[0])
    state.settings = records.settings[0].payload as unknown as SchoolState["settings"];
  state.cleanupPaths = (records.cleanup || []).map((x) => String(x.payload.path));
  state.version = Math.max(
    0,
    ...Object.values(records).flatMap((rows) => rows.map((x) => Number(x.revision)))
  );
  state.absenceSummaries = (records.absenceSummaries || []).map(
    (x) => x.payload
  ) as unknown as SchoolState["absenceSummaries"];
  state.chatMessages.sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)
  );
  return { state, records, pagination };
}
function recordId(kind: string, payload: Record<string, unknown>): string {
  if (kind === "settings") return "settings";
  if (kind === "invites") return String(payload.hash);
  if (kind === "devices") return createHash("sha256").update(String(payload.token)).digest("hex");
  if (kind === "deletionRequests") return String(payload.userId);
  if (kind === "chatReads") return `${payload.classId}:${payload.userId}`;
  if (kind === "cleanup") return createHash("sha256").update(String(payload.path)).digest("hex");
  return String(payload.id);
}
export function changesBetween(loaded: LoadedState, state: SchoolState) {
  const changes: { kind: string; id: string; expected: number | null; payload: unknown }[] = [];
  for (const kind of ["settings", ...arrays, "cleanup"]) {
    const previous = new Map((loaded.records[kind] || []).map((x) => [x.id, x]));
    const values =
      kind === "settings"
        ? [state.settings]
        : kind === "cleanup"
          ? (state.cleanupPaths || []).map((path) => ({ path }))
          : (state as unknown as Record<string, unknown[]>)[kind] || [];
    for (const value of values) {
      const payload = value as Record<string, unknown>;
      const id = recordId(kind, payload);
      const old = previous.get(id);
      previous.delete(id);
      if (!old || JSON.stringify(old.payload) !== JSON.stringify(payload))
        changes.push({ kind, id, expected: old?.revision ?? null, payload });
    }
    for (const [id, row] of Array.from(previous.entries()))
      changes.push({ kind, id, expected: row.revision, payload: null });
  }
  return changes;
}
export async function loadSchool(
  schoolId: string,
  u: Identity,
  action: Record<string, unknown> = {}
): Promise<LoadedState> {
  const { data, error } = await createAdminSupabaseClient().rpc("school_repository_read", {
    p_school: schoolId,
    p_actor: u,
    p_action: action,
  });
  if (error) databaseError(error);
  return hydrate(schoolId, data.records, data.pagination);
}
export async function transactSchool<T>(
  schoolId: string,
  u: Identity,
  action: Record<string, unknown>,
  fn: (s: SchoolState) => T | Promise<T>,
  bootstrapUid?: string
): Promise<{ state: SchoolState; result: T; pagination: Record<string, boolean> }> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const loaded = await loadSchool(schoolId, u, action);
    const state = structuredClone(loaded.state);
    const result = await fn(state);
    const changes = changesBetween(loaded, state);
    const { data, error } = await createAdminSupabaseClient().rpc("school_repository_commit", {
      p_school: schoolId,
      p_actor: u,
      p_action: action,
      p_changes: changes,
      p_bootstrap_uid: bootstrapUid || null,
    });
    if (error) {
      try {
        databaseError(error);
      } catch (e) {
        if (e instanceof SchoolError && e.code === "CONFLICT" && attempt < 3) continue;
        throw e;
      }
    }
    state.version = Number(data);
    return { state, result, pagination: loaded.pagination };
  }
  throw new SchoolError("CONFLICT", "Please retry request", 409);
}
export async function schoolHistory(
  schoolId: string,
  u: Identity,
  kind: "chatMessages" | "audit",
  classId?: string,
  before?: string
) {
  const { data, error } = await createAdminSupabaseClient().rpc("school_repository_history", {
    p_school: schoolId,
    p_actor: u,
    p_kind: kind,
    p_class: classId || null,
    p_before: before || null,
  });
  if (error) databaseError(error);
  return data as unknown[];
}
