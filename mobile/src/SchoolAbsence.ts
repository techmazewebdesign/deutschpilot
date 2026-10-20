import type { SchoolSnapshot } from "../../lib/school/contract";
/** Teacher register receives dates/status only. Never expose private reasons or file metadata. */
export function teacherAbsenceRows(snapshot: SchoolSnapshot) {
  if (snapshot.actor.role !== "teacher") return [];
  return (snapshot.absenceSummaries || []).map((row) => ({
    id: row.id,
    studentId: row.studentId,
    from: row.from,
    to: row.to,
    status: row.status,
  }));
}
