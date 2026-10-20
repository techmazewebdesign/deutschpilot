import { randomUUID } from "node:crypto";
import { SchoolError, audit, type SchoolState, type Identity } from "./engine";
export type DeletionRequest = {
  userId: string;
  requestedAt: string;
  status: "pending_review" | "cleanup_pending" | "completed";
  reason: string;
};
export function requestDeletion(s: SchoolState, u: Identity) {
  s.deletionRequests ??= [];
  let r = s.deletionRequests.find((x) => x.userId === u.id && x.status !== "completed");
  if (!r) {
    r = {
      userId: u.id,
      requestedAt: new Date().toISOString(),
      status: "pending_review",
      reason: "Controller retention review requested",
    };
    s.deletionRequests.push(r);
  }
  audit(s, u, "privacy.deletion.request");
  return r;
}
export function deletionHold(s: SchoolState, uid: string): string | null {
  if (s.documents.some((d) => d.studentId === uid && d.legalHold))
    return "A school record has an explicit legal hold. Contact the school privacy office for review.";
  const member = s.members.find((m) => m.id === uid);
  if (
    member?.role === "owner" &&
    s.members.filter((m) => m.role === "owner" && m.active && m.id !== uid).length === 0
  )
    return "Transfer school ownership before deleting the last owner account.";
  return null;
}
export function prepareDeletion(s: SchoolState, u: Identity) {
  const r = requestDeletion(s, u);
  const reason = deletionHold(s, u.id);
  if (reason) {
    r.reason = reason;
    return { blocked: true, paths: [] as string[], reason };
  }
  r.status = "cleanup_pending";
  r.reason = "Private file removal pending";
  const member = s.members.find((m) => m.id === u.id);
  if (member) member.active = false;
  return {
    blocked: false,
    paths: s.documents
      .filter((d) => d.studentId === u.id || d.uploadedBy === u.id)
      .map((d) => d.storagePath)
      .filter((x): x is string => !!x),
    reason: "",
  };
}
export function finalizeDeletion(s: SchoolState, u: Identity) {
  const reason = deletionHold(s, u.id);
  if (reason) throw new SchoolError("SCHOOL_RECORDS_HOLD", reason, 409);
  const pseudonym = "deleted-" + randomUUID();
  const email = s.members.find((m) => m.id === u.id)?.email.toLowerCase();
  s.members = s.members.filter((m) => m.id !== u.id);
  for (const c of s.classes) {
    c.studentIds = c.studentIds.filter((x) => x !== u.id);
    c.teacherIds = c.teacherIds.filter((x) => x !== u.id);
  }
  s.invites = s.invites.filter((i) => i.email !== email);
  s.documents = s.documents.filter((d) => d.studentId !== u.id && d.uploadedBy !== u.id);
  s.absences = s.absences.filter((x) => x.studentId !== u.id);
  s.documentRequests = s.documentRequests.filter((x) => x.studentId !== u.id);
  for (const r of s.documentRequests) if (r.createdBy === u.id) r.createdBy = pseudonym;
  s.attendance = s.attendance.filter((x) => x.studentId !== u.id);
  for (const a of s.attendance) if (a.updatedBy === u.id) a.updatedBy = pseudonym;
  s.progress = s.progress.filter((x) => x.studentId !== u.id);
  const tokens = (s.devices || []).filter((d) => d.userId === u.id).map((d) => d.token);
  s.devices = (s.devices || []).filter((d) => d.userId !== u.id);
  s.pushDeliveries = (s.pushDeliveries || []).filter((p) => !tokens.includes(p.token));
  s.notifications = s.notifications.filter((x) => x.userId !== u.id);
  s.chatReads = s.chatReads.filter((x) => x.userId !== u.id);
  for (const msg of s.chatMessages) {
    if (msg.authorId === u.id) {
      msg.authorId = pseudonym;
      msg.authorName = "Deleted member";
      msg.body = "";
      msg.deletedAt = new Date().toISOString();
      msg.deletedBy = "privacy";
      delete msg.clientMessageId;
    }
    if (msg.deletedBy === u.id) msg.deletedBy = pseudonym;
  }
  for (const l of s.letters) {
    l.studentIds = l.studentIds.filter((x) => x !== u.id);
    delete l.readBy[u.id];
    delete l.acknowledgements[u.id];
    delete l.returnedDocuments[u.id];
    if (l.createdBy === u.id) l.createdBy = pseudonym;
  }
  s.audit = s.audit.map((a) => ({
    ...a,
    actorId: a.actorId === u.id ? pseudonym : a.actorId,
    target:
      a.target.includes(u.id) || a.target.toLowerCase() === u.email.toLowerCase()
        ? "redacted"
        : a.target,
  }));
  s.deletionRequests = (s.deletionRequests || []).filter((r) => r.userId !== u.id);
}
