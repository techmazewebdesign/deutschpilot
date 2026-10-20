import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  apply,
  actor,
  emptyState,
  exportUser,
  snapshot,
  type Identity,
  type SchoolState,
} from "../../lib/school/engine";
import {
  applyScanResult,
  authorizeDownload,
  registerDocument,
  sniffFile,
} from "../../lib/school/documents";
const identity = (id: string, admin = false): Identity => ({
  id,
  email: `${id}@school.example`,
  name: id,
  verified: true,
  admin,
});
export function fixture() {
  const s = emptyState("synthetic-school");
  const owner = identity("owner", true);
  apply(s, owner, { action: "bootstrap", name: "Synthetic school" }, owner.id);
  for (const [id, role] of [
    ["office", "office"],
    ["teacher", "teacher"],
    ["teacher2", "teacher"],
    ["otherTeacher", "teacher"],
    ["student", "student"],
    ["otherStudent", "student"],
  ] as const) {
    const { inviteCode } = apply(s, owner, {
      action: "invite.create",
      email: `${id}@school.example`,
      name: id,
      role,
    });
    apply(s, identity(id), { action: "invite.accept", code: inviteCode });
  }
  apply(s, owner, {
    action: "class.save",
    id: undefined,
    name: "A1",
    teacherIds: ["teacher", "teacher2"],
    studentIds: ["student"],
    schedule: "Monday 10:00",
  });
  apply(s, owner, {
    action: "class.save",
    name: "B1",
    teacherIds: ["otherTeacher"],
    studentIds: ["otherStudent"],
    schedule: "",
  });
  return {
    s,
    owner,
    student: identity("student"),
    teacher: identity("teacher"),
    office: identity("office"),
    classId: s.classes[0].id,
  };
}
const fail = (fn: () => unknown) => assert.throws(fn);
test("explicit membership, verified email invitations, expiring hashed token and bootstrap ownership", () => {
  const { s, owner } = fixture();
  fail(() => actor(s, identity("unknown", true)));
  fail(() => actor(s, { ...owner, verified: false }));
  fail(() => apply(s, owner, { action: "bootstrap", name: "Takeover" }, owner.id));
  assert.equal(s.invites.length, 0);
  const { inviteCode } = apply(s, owner, {
    action: "invite.create",
    email: "new@school.example",
    name: "new",
    role: "teacher",
  });
  assert.ok(!JSON.stringify(s).includes(inviteCode!));
  fail(() => apply(s, identity("attacker"), { action: "invite.accept", code: inviteCode }));
  s.invites[0].expiresAt = "2000-01-01";
  fail(() => apply(s, identity("new"), { action: "invite.accept", code: inviteCode }));
});
test("last owner preserved and student cannot self-promote or assign roster", () => {
  const { s, owner, student } = fixture();
  fail(() =>
    apply(s, owner, { action: "member.update", memberId: "owner", role: "student", active: true })
  );
  fail(() =>
    apply(s, student, { action: "member.update", memberId: "student", role: "owner", active: true })
  );
  fail(() =>
    apply(s, student, {
      action: "class.save",
      name: "Fake",
      teacherIds: ["student"],
      studentIds: [],
      schedule: "",
    })
  );
});
test("attendance class boundary and office-only excuse", () => {
  const { s, classId, teacher, office, student } = fixture();
  apply(s, teacher, {
    action: "attendance.set",
    classId,
    studentId: "student",
    date: "2026-10-20",
    status: "absent",
  });
  fail(() =>
    apply(s, identity("otherTeacher"), {
      action: "attendance.set",
      classId,
      studentId: "student",
      date: "2026-10-20",
      status: "present",
    })
  );
  fail(() =>
    apply(s, teacher, {
      action: "attendance.set",
      classId,
      studentId: "student",
      date: "2026-10-20",
      status: "excused",
    })
  );
  allowUploads(s, identity("owner", true));
  apply(s, student, {
    action: "absence.report",
    from: "2026-10-20",
    to: "2026-10-20",
    reason: "illness",
  });
  assert.equal(snapshot(s, teacher).absences.length, 0);
  apply(s, office, { action: "absence.review", absenceId: s.absences[0].id, status: "approved" });
  assert.equal(s.attendance[0].status, "excused");
  assert.equal(snapshot(s, identity("otherStudent")).attendance.length, 0);
});
test("strict commands reject invalid date, reversed range, spoofed author and extra keys", () => {
  const { s, student } = fixture();
  for (const c of [
    { action: "absence.report", from: "2026-02-30", to: "2026-03-01", reason: "illness" },
    { action: "absence.report", from: "2026-10-21", to: "2026-10-20", reason: "illness" },
    {
      action: "absence.report",
      from: "2026-10-20",
      to: "2026-10-20",
      reason: "illness",
      studentId: "otherStudent",
    },
    { action: "unknown" },
  ])
    fail(() => apply(s, student, c));
});
test("progress synchronisation is account scoped, monotonic and teacher class scoped", () => {
  const { s, student, teacher } = fixture();
  apply(s, student, {
    action: "progress.sync",
    items: [{ lessonId: "l1", completed: true, score: 90 }],
  });
  apply(s, student, {
    action: "progress.sync",
    items: [{ lessonId: "l1", completed: false, score: 10 }],
  });
  assert.equal(s.progress.length, 1);
  assert.equal(s.progress[0].score, 90);
  assert.equal(s.progress[0].completed, true);
  assert.equal(snapshot(s, teacher).progress.length, 1);
  assert.equal(snapshot(s, identity("otherTeacher")).progress.length, 0);
});
test("multi-recipient letters redact recipient/read/return metadata, acknowledge without QES", () => {
  const { s, owner, student } = fixture();
  apply(s, owner, {
    action: "letter.send",
    title: "School agreement",
    body: "Please return.",
    studentIds: ["student", "otherStudent"],
    dueDate: "2026-10-30",
  });
  const l = s.letters[0];
  apply(s, identity("otherStudent"), { action: "letter.acknowledge", letterId: l.id });
  const visible = snapshot(s, student).letters[0];
  assert.deepEqual(visible.studentIds, ["student"]);
  assert.deepEqual(visible.acknowledgements, {});
  fail(() => apply(s, identity("teacher"), { action: "letter.acknowledge", letterId: l.id }));
  apply(s, student, { action: "letter.acknowledge", letterId: l.id });
  assert.ok(l.readBy.student && l.acknowledgements.student);
});
test("notifications have actual own read state and generic content", () => {
  const { s, owner, student } = fixture();
  apply(s, owner, {
    action: "letter.send",
    title: "Private health title",
    body: "Sensitive diagnosis",
    studentIds: ["student"],
    dueDate: "2026-10-30",
  });
  const n = s.notifications[0];
  assert.ok(!JSON.stringify(n).includes("diagnosis"));
  fail(() =>
    apply(s, identity("otherStudent"), { action: "notification.read", notificationId: n.id })
  );
  apply(s, student, { action: "notification.read", notificationId: n.id });
  assert.ok(n.readAt);
  assert.equal(snapshot(s, identity("otherStudent")).notifications.length, 0);
});
const pdf = Buffer.from("%PDF-1.7\n Synthetic harmless test document");
function allowUploads(s: SchoolState, owner: Identity) {
  apply(s, owner, {
    action: "settings.update",
    settings: {
      name: "School",
      operator: "Synthetic operator",
      privacyContact: "privacy@school.example",
      legalBasis: "Controller-approved synthetic basis",
      healthLegalBasis: "Controller-approved synthetic health condition",
      retentionDays: 30,
      sensitiveUploadsEnabled: true,
      retentionPolicyNote: "Synthetic controller test policies; not a German legal recommendation",
      recordRetentionDays: {
        attendance: 30,
        absences: 30,
        letters: 30,
        notifications: 30,
        progress: 30,
        audit: 30,
      },
      retentionByCategory: { general: 30, medical: 30, jobcenter: 30, signed_letter: 30 },
      chatRetentionDays: 30,
    },
  });
}
test("documents require policy, sniff bytes and size, quarantine even general files, never teacher accessible", () => {
  const { s, owner, student, teacher, office } = fixture();
  const input = { title: "Private", category: "general", fileName: "test.pdf", bytes: pdf };
  fail(() => registerDocument(s, student, input));
  allowUploads(s, owner);
  fail(() => sniffFile(Buffer.from("evil.exe")));
  fail(() => registerDocument(s, student, { ...input, bytes: Buffer.alloc(11 * 1024 * 1024) }));
  const d = registerDocument(s, student, input);
  assert.equal(d.scanStatus, "quarantined");
  fail(() => authorizeDownload(s, student, d.id));
  fail(() => authorizeDownload(s, office, d.id));
  assert.equal(snapshot(s, teacher).documents.length, 0);
  applyScanResult(s, d.id, d.sha256!, "clean");
  assert.equal(authorizeDownload(s, student, d.id).id, d.id);
  assert.equal(authorizeDownload(s, office, d.id).id, d.id);
  fail(() => authorizeDownload(s, teacher, d.id));
  fail(() => authorizeDownload(s, identity("otherStudent"), d.id));
  assert.ok(!("storagePath" in snapshot(s, student).documents[0]));
  assert.ok(s.audit.some((x) => x.action === "document.download"));
});
test("signed copy and document request are fulfilled only after trusted clean result, rejection stays inaccessible", () => {
  const { s, owner, student } = fixture();
  allowUploads(s, owner);
  apply(s, owner, {
    action: "letter.send",
    title: "Sign",
    body: "Return signed",
    studentIds: ["student"],
    dueDate: "2026-10-30",
  });
  const l = s.letters[0];
  apply(s, owner, {
    action: "document.request",
    title: "Returned copy",
    category: "signed_letter",
    studentId: "student",
    dueDate: "2026-10-30",
  });
  const r = s.documentRequests[0];
  const d = registerDocument(s, student, {
    title: "Signed",
    category: "signed_letter",
    fileName: "test.pdf",
    bytes: pdf,
    letterId: l.id,
    requestId: r.id,
  });
  assert.equal(r.fulfilledBy, undefined);
  assert.equal(l.returnedDocuments.student, undefined);
  fail(() => applyScanResult(s, d.id, "wronghash", "clean"));
  applyScanResult(s, d.id, d.sha256!, "rejected");
  fail(() => authorizeDownload(s, student, d.id));
  const next = registerDocument(s, student, {
    title: "Signed",
    category: "signed_letter",
    fileName: "new.pdf",
    bytes: pdf,
    letterId: l.id,
    requestId: r.id,
  });
  applyScanResult(s, next.id, next.sha256!, "clean");
  assert.equal(r.fulfilledBy, next.id);
  assert.equal(l.returnedDocuments.student, next.id);
});
test("expired files are blocked immediately and cleanup queue survives retry", () => {
  const { s, owner, student } = fixture();
  allowUploads(s, owner);
  const d = registerDocument(s, student, {
    title: "Private",
    category: "medical",
    fileName: "test.pdf",
    bytes: pdf,
  });
  applyScanResult(s, d.id, d.sha256!, "clean");
  d.expiresAt = "2000-01-01";
  fail(() => authorizeDownload(s, student, d.id));
  const first = apply(s, owner, { action: "retention.run" });
  assert.deepEqual(first.storagePathsToDelete, [d.storagePath]);
  assert.equal(s.documents.length, 0);
  assert.deepEqual(apply(s, owner, { action: "retention.run" }).storagePathsToDelete, [
    d.storagePath,
  ]);
});
test("class group chat allows multiple teachers full paged history, excludes unrelated and revoked members", () => {
  const { s, owner, student, teacher, classId } = fixture();
  for (let n = 0; n < 105; n++)
    apply(s, student, { action: "chat.send", classId, body: `message ${n}` });
  assert.equal(snapshot(s, teacher).chatMessages.length, 100);
  assert.equal(snapshot(s, identity("teacher2")).chatMessages.length, 100);
  const older = apply(s, teacher, {
    action: "chat.history",
    classId,
    before: s.chatMessages[100].id,
  });
  assert.equal(older.messages?.length, 100);
  fail(() => apply(s, identity("otherTeacher"), { action: "chat.history", classId }));
  apply(s, teacher, { action: "chat.moderate", classId, messageId: s.chatMessages[0].id });
  assert.equal(s.chatMessages[0].body, "");
  assert.ok(s.chatMessages[0].deletedAt);
  fail(() =>
    apply(s, student, { action: "chat.moderate", classId, messageId: s.chatMessages[1].id })
  );
  apply(s, student, { action: "chat.read", classId });
  assert.equal(snapshot(s, student).chatReads.length, 1);
  apply(s, owner, { action: "member.update", memberId: "teacher", role: "teacher", active: false });
  fail(() => apply(s, teacher, { action: "chat.history", classId }));
});
test("data export scoped and ordinary student deletion has no blanket school-membership hold", async () => {
  const { s, student } = fixture();
  const exported = exportUser(s, student.id);
  assert.equal(exported.membership?.id, student.id);
  const{deletionHold}=await import("../../lib/school/privacy");
  assert.equal(deletionHold(s,student.id),null);
  assert.ok(deletionHold(s,"owner"));
});

test("health reason blocked without policy, category retention and legal hold honored", () => {
  const { s, owner, student } = fixture();
  fail(() =>
    apply(s, student, {
      action: "absence.report",
      from: "2026-10-20",
      to: "2026-10-20",
      reason: "illness",
    })
  );
  allowUploads(s, owner);
  s.settings.retentionByCategory = { general: 30, medical: 7, jobcenter: 30, signed_letter: 60 };
  const d = registerDocument(s, student, {
    title: "Certificate",
    category: "medical",
    fileName: "test.pdf",
    bytes: pdf,
  });
  assert.ok(Date.parse(d.expiresAt) - Date.parse(d.createdAt) < 8 * 86400000);
  d.expiresAt = "2000-01-01";
  apply(s, owner, {
    action: "document.hold",
    documentId: d.id,
    hold: true,
    reason: "Synthetic explicit statutory hold",
  });
  apply(s, owner, { action: "retention.run" });
  assert.equal(s.documents.length, 1);
  fail(() =>
    apply(s, student, { action: "document.hold", documentId: d.id, hold: false, reason: "Bypass" })
  );
  apply(s, owner, {
    action: "document.hold",
    documentId: d.id,
    hold: false,
    reason: "Controller released hold",
  });
  apply(s, owner, { action: "retention.run" });
  assert.equal(s.documents.length, 0);
});
test("chat retry idempotent and history retention removes content", () => {
  const { s, owner, student, classId } = fixture();
  apply(s, student, { action: "chat.send", classId, body: "once", clientMessageId: "request-1" });
  apply(s, student, { action: "chat.send", classId, body: "once", clientMessageId: "request-1" });
  assert.equal(s.chatMessages.length, 1);
  s.settings.chatRetentionDays = 30;
  s.chatMessages[0].createdAt = "2000-01-01";
  apply(s, owner, { action: "retention.run" });
  assert.equal(s.chatMessages[0].body, "");
});
test("device registration is own-account and token never exposed in snapshot/export", () => {
  const { s, student } = fixture();
  apply(s, student, { action: "device.register", token: "ExpoPushToken[synthetic123]" });
  assert.equal(s.devices?.[0].userId, student.id);
  assert.ok(!JSON.stringify(snapshot(s, student)).includes("synthetic123"));
  assert.ok(!JSON.stringify(exportUser(s, "otherStudent")).includes("synthetic123"));
  fail(() => apply(s, student, { action: "device.register", token: "bad" }));
  apply(s, student, { action: "device.unregister", token: "ExpoPushToken[synthetic123]" });
  assert.equal(s.devices?.length, 0);
});
test("deletion purge removes own data and pseudonymises identifiers while clearing authored text, explicit hold persists request", async () => {
  const { prepareDeletion, finalizeDeletion } = await import("../../lib/school/privacy");
  const { s, owner, student, classId } = fixture();
  allowUploads(s, owner);
  apply(s, student, { action: "chat.send", classId, body: "personal" });
  apply(s, student, {
    action: "progress.sync",
    items: [{ lessonId: "l1", completed: true, score: 70 }],
  });
  const d = registerDocument(s, student, {
    title: "Medical",
    category: "medical",
    fileName: "test.pdf",
    bytes: pdf,
  });
  d.legalHold = true;
  assert.equal(prepareDeletion(s, student).blocked, true);
  assert.equal(s.deletionRequests?.[0].status, "pending_review");
  assert.equal(s.members.find((m) => m.id === student.id)?.active, true);
  d.legalHold = false;
  assert.equal(prepareDeletion(s, student).blocked, false);
  assert.equal(s.members.find((m) => m.id === student.id)?.active, false);
  finalizeDeletion(s, student);
  assert.ok(!s.members.some((m) => m.id === student.id));
  assert.equal(s.progress.length, 0);
  assert.equal(s.documents.length, 0);
  assert.equal(s.chatMessages[0].body, "");
  assert.equal(s.chatMessages[0].authorName, "Deleted member");
  assert.ok(!s.classes[0].studentIds.includes(student.id));
  assert.equal(prepareDeletion(s, owner).blocked, true);
});
test("push outbox prevents token-reassignment leaks and distinguishes tickets, receipts, unknown transport", async () => {
  const { claimPushBatch, pushStillAuthorized, finishPushAttempt, applyPushReceipt } =
    await import("../../lib/school/push");
  const { s, owner, student } = fixture();
  apply(s, student, { action: "device.register", token: "ExpoPushToken[synthetic123]" });
  s.devices![0].registeredAt = "2000-01-01";
  apply(s, owner, {
    action: "letter.send",
    title: "Letter",
    body: "Private",
    studentIds: ["student"],
    dueDate: "2026-10-30",
  });
  const [p] = claimPushBatch(s);
  assert.equal(p.status, "sending");
  apply(s, identity("otherStudent"), {
    action: "device.register",
    token: "ExpoPushToken[synthetic123]",
  });
  assert.equal(pushStillAuthorized(s, p), false);
  assert.equal(claimPushBatch(s).length, 0);
  assert.equal(p.status, "failed");
  apply(s, student, { action: "device.register", token: "ExpoPushToken[secondtoken]" });
  s.devices!.find((d) => d.userId === student.id)!.registeredAt = "2000-01-01";
  const [q] = claimPushBatch(s);
  finishPushAttempt(s, q.id, { ticketId: "ticket-synthetic" });
  assert.equal(q.status, "ticket");
  applyPushReceipt(s, "ticket-synthetic", "ok");
  assert.equal(q.status, "delivered");
  apply(s, owner, {
    action: "letter.send",
    title: "Another",
    body: "Private",
    studentIds: ["student"],
    dueDate: "2026-10-30",
  });
  const [r] = claimPushBatch(s);
  finishPushAttempt(s, r.id, { unknown: true });
  assert.equal(r.status, "unknown");
  assert.equal(claimPushBatch(s).length, 0);
});
test("owner audit is bounded, paged and denied to office/teacher/student", () => {
  const { s, owner, student, teacher, office, classId } = fixture();
  for (let i = 0; i < 110; i++)
    apply(s, student, { action: "chat.send", classId, body: `message${i}` });
  const page = apply(s, owner, { action: "audit.list" }).auditEntries!;
  assert.equal(page.length, 100);
  assert.ok(page.some((a) => a.target === classId));
  const previous = apply(s, owner, { action: "audit.list", before: page[0].id }).auditEntries!;
  assert.ok(previous.length > 0);
  for (const identity of [student, teacher, office])
    fail(() => apply(s, identity, { action: "audit.list" }));
  assert.ok(!JSON.stringify(page).includes("message109"));
});
test("new legal hold cannot race an approved in-progress private-file deletion", async () => {
  const { prepareDeletion } = await import("../../lib/school/privacy");
  const { s, owner, student } = fixture();
  allowUploads(s, owner);
  const d = registerDocument(s, student, {
    title: "Private",
    category: "general",
    fileName: "test.pdf",
    bytes: pdf,
  });
  assert.equal(prepareDeletion(s, student).blocked, false);
  fail(() =>
    apply(s, owner, {
      action: "document.hold",
      documentId: d.id,
      hold: true,
      reason: "Late hold during destruction",
    })
  );
});
