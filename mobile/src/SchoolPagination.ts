import {
  schoolCommand,
  SchoolError,
  type SchoolCommandResult,
  type SchoolSnapshot,
} from "./SchoolClient";
export type SchoolSection =
  | "members"
  | "classes"
  | "attendance"
  | "absences"
  | "absenceSummaries"
  | "documents"
  | "documentRequests"
  | "letters"
  | "notifications"
  | "progress";
export function checkedSchoolSnapshot(result: SchoolCommandResult, uid: string) {
  if (!result.snapshot || result.snapshot.actor.id !== uid)
    throw new SchoolError("Das Schulkonto wurde gewechselt. Bitte neu laden.", "AUTH_CHANGED");
  return result.snapshot;
}
export function mergeSchoolPage(
  current: SchoolSnapshot,
  result: SchoolCommandResult,
  section: SchoolSection,
  uid: string
): SchoolSnapshot {
  const fresh = checkedSchoolSnapshot(result, uid);
  if (
    current.actor.id !== uid ||
    current.schoolId !== fresh.schoolId ||
    current.actor.role !== fresh.actor.role
  )
    throw new SchoolError(
      "Deine Schulberechtigung hat sich geändert. Bitte neu laden.",
      "AUTH_CHANGED"
    );
  if (
    current.version !== fresh.version &&
    !(section === "progress" && fresh.actor.role === "student")
  )
    throw new SchoolError(
      "Die Schuldaten wurden inzwischen geändert. Bitte neu laden und ältere Einträge erneut abrufen.",
      "PAGE_CHANGED"
    );
  if (
    result.section !== section ||
    !Array.isArray(result.items) ||
    (result.nextCursor !== null && typeof result.nextCursor !== "string")
  )
    throw new SchoolError(
      "Die nächste Seite konnte nicht bestätigt werden. Bitte neu laden.",
      "INVALID_PAGE"
    );
  const rows = new Map<string, unknown>();
  for (const row of current[section] || []) rows.set(row.id, row);
  for (const row of result.items) {
    if (!row || typeof row !== "object" || !("id" in row) || typeof row.id !== "string")
      throw new SchoolError("Ungültige Schuldatenseite.", "INVALID_PAGE");
    rows.set(row.id, row);
  }
  return {
    ...current,
    version: fresh.version,
    [section]: Array.from(rows.values()),
    pagination: { ...current.pagination, [section]: result.nextCursor !== null },
    pageCursors: { ...current.pageCursors, [section]: result.nextCursor },
  };
}
const configuredPages = Number(process.env.EXPO_PUBLIC_SCHOOL_SYNC_MAX_PAGES || 100);
export const defaultProgressPageLimit =
  Number.isSafeInteger(configuredPages) && configuredPages > 0 && configuredPages <= 10000
    ? configuredPages
    : 100;
/** Safety limit bounds a background request burst, never the product's student/lesson capacity. Partial is explicit. */
export async function completeSchoolProgress(
  uid: string,
  initial: SchoolSnapshot,
  options: {
    maxPages?: number;
    cancelled?: () => boolean;
    page?: (before: string) => Promise<SchoolCommandResult>;
  } = {}
) {
  let snapshot = initial;
  let pagesRead = 0;
  const limit = options.maxPages ?? defaultProgressPageLimit;
  if (!Number.isSafeInteger(limit) || limit < 1)
    throw new SchoolError("Ungültige Synchronisierungsgrenze.", "INVALID_PAGE");
  if (snapshot.actor.id !== uid) throw new SchoolError("Schulkonto gewechselt.", "AUTH_CHANGED");
  const seen = new Set<string>();
  while (snapshot.pagination?.progress) {
    if (pagesRead >= limit || options.cancelled?.())
      return { snapshot, complete: false, pagesRead };
    const cursor = snapshot.pageCursors?.progress;
    if (!cursor || seen.has(cursor))
      throw new SchoolError(
        "Die Fortschrittsseiten konnten nicht vollständig geladen werden.",
        "INVALID_PAGE"
      );
    seen.add(cursor);
    const result = await (options.page
      ? options.page(cursor)
      : schoolCommand(uid, { action: "section.page", section: "progress", before: cursor }));
    snapshot = mergeSchoolPage(snapshot, result, "progress", uid);
    pagesRead++;
  }
  return { snapshot, complete: true, pagesRead };
}
