import { createHash, randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { requestDeletion } from "./privacy";
import type {
  SchoolMember,
  SchoolSettings,
  SchoolSnapshot,
  SchoolDocument,
  SchoolAction,
} from "./contract";
export class SchoolError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 403
  ) {
    super(message);
  }
}
export type Identity = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  admin: boolean;
};
export type SchoolState = Omit<SchoolSnapshot, "actor" | "capabilities"> & {
  deletionRequests?: import("./privacy").DeletionRequest[];
  devices?: { userId: string; token: string; registeredAt: string }[];
  pushDeliveries?: {
    id: string;
    notificationId: string;
    token: string;
    status: "pending" | "sending" | "ticket" | "delivered" | "failed" | "unknown";
    attempts: number;
    ticketId?: string;
    updatedAt: string;
  }[];
  cleanupPaths?: string[];
  invites: {
    hash: string;
    email: string;
    name: string;
    role: SchoolMember["role"];
    expiresAt: string;
  }[];
  audit: { id: string; actorId: string; action: string; target: string; at: string }[];
};
const id = z.string().min(1).max(160);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
    "Invalid date"
  );
const text = z.string().trim().min(1).max(200);
const role = z.enum(["owner", "office", "teacher", "student"]);
const category = z.enum(["general", "medical", "jobcenter", "signed_letter"]);
const settingsSchema = z
  .object({
    name: text,
    operator: text,
    privacyContact: z.string().email().max(200),
    legalBasis: z.string().max(2000),
    healthLegalBasis: z.string().max(2000),
    retentionDays: z.number().int().min(1).max(3650),
    retentionByCategory: z
      .object({
        general: z.number().int().min(1).max(3650),
        medical: z.number().int().min(1).max(3650),
        jobcenter: z.number().int().min(1).max(3650),
        signed_letter: z.number().int().min(1).max(3650),
      })
      .strict()
      .optional(),
    recordRetentionDays: z
      .object({
        attendance: z.number().int().min(1).max(36500),
        absences: z.number().int().min(1).max(36500),
        letters: z.number().int().min(1).max(36500),
        notifications: z.number().int().min(1).max(36500),
        progress: z.number().int().min(1).max(36500),
        audit: z.number().int().min(1).max(36500),
      })
      .strict()
      .optional(),
    retentionPolicyNote: z.string().trim().min(1).max(2000).optional(),
    chatRetentionDays: z.number().int().min(1).max(3650).optional(),
    sensitiveUploadsEnabled: z.boolean(),
  })
  .strict();
const schemas = {
  bootstrap: z.object({ action: z.literal("bootstrap"), name: text }).strict(),
  "settings.update": z
    .object({ action: z.literal("settings.update"), settings: settingsSchema })
    .strict(),
  "invite.create": z
    .object({
      action: z.literal("invite.create"),
      email: z.string().email().max(200),
      name: text,
      role,
    })
    .strict(),
  "invite.accept": z
    .object({ action: z.literal("invite.accept"), code: z.string().min(24).max(200) })
    .strict(),
  "member.update": z
    .object({ action: z.literal("member.update"), memberId: id, role, active: z.boolean() })
    .strict(),
  "class.save": z
    .object({
      action: z.literal("class.save"),
      id: id.optional(),
      name: text,
      teacherIds: z.array(id).max(100),
      studentIds: z.array(id).max(500),
      schedule: z.string().max(2000),
    })
    .strict(),
  "attendance.set": z
    .object({
      action: z.literal("attendance.set"),
      classId: id,
      studentId: id,
      date,
      status: z.enum(["present", "late", "absent", "excused"]),
    })
    .strict(),
  "absence.report": z
    .object({
      action: z.literal("absence.report"),
      from: date,
      to: date,
      reason: z.enum(["illness", "personal", "other"]),
    })
    .strict(),
  "absence.review": z
    .object({
      action: z.literal("absence.review"),
      absenceId: id,
      status: z.enum(["approved", "rejected"]),
    })
    .strict(),
  "document.request": z
    .object({
      action: z.literal("document.request"),
      studentId: id,
      title: text,
      category,
      dueDate: date,
    })
    .strict(),
  "letter.send": z
    .object({
      action: z.literal("letter.send"),
      title: text,
      body: z.string().trim().min(1).max(10000),
      studentIds: z.array(id).min(1).max(500),
      dueDate: date,
    })
    .strict(),
  "letter.read": z.object({ action: z.literal("letter.read"), letterId: id }).strict(),
  "letter.acknowledge": z
    .object({ action: z.literal("letter.acknowledge"), letterId: id })
    .strict(),
  "notification.read": z
    .object({ action: z.literal("notification.read"), notificationId: id })
    .strict(),
  "progress.sync": z
    .object({
      action: z.literal("progress.sync"),
      items: z
        .array(
          z
            .object({ lessonId: id, completed: z.boolean(), score: z.number().min(0).max(100) })
            .strict()
        )
        .max(500),
    })
    .strict(),
  "retention.run": z.object({ action: z.literal("retention.run") }).strict(),
  "chat.send": z
    .object({
      action: z.literal("chat.send"),
      classId: id,
      body: z.string().trim().min(1).max(4000),
      clientMessageId: id.optional(),
    })
    .strict(),
  "device.register": z
    .object({
      action: z.literal("device.register"),
      token: z.string().regex(/^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/),
    })
    .strict(),
  "device.unregister": z
    .object({ action: z.literal("device.unregister"), token: z.string().max(200) })
    .strict(),
  "document.hold": z
    .object({
      action: z.literal("document.hold"),
      documentId: id,
      hold: z.boolean(),
      reason: z.string().trim().min(1).max(500),
    })
    .strict(),
  "chat.read": z.object({ action: z.literal("chat.read"), classId: id }).strict(),
  "chat.moderate": z
    .object({ action: z.literal("chat.moderate"), classId: id, messageId: id })
    .strict(),
  "chat.history": z
    .object({ action: z.literal("chat.history"), classId: id, before: id.optional() })
    .strict(),
  "privacy.deletion.request": z.object({ action: z.literal("privacy.deletion.request") }).strict(),
  "section.page": z
    .object({
      action: z.literal("section.page"),
      section: z.enum([
        "members",
        "classes",
        "attendance",
        "absences",
        "absenceSummaries",
        "documents",
        "documentRequests",
        "letters",
        "notifications",
        "progress",
      ]),
      before: id.optional(),
    })
    .strict(),
  "audit.list": z.object({ action: z.literal("audit.list"), before: id.optional() }).strict(),
  "data.export": z
    .object({ action: z.literal("data.export"), cursor: z.string().max(500).optional() })
    .strict(),
};
export function parseAction(value: unknown): SchoolAction {
  const a = (value as { action?: string })?.action;
  const schema = schemas[a as keyof typeof schemas];
  if (!schema) throw new SchoolError("INVALID_ACTION", "Unknown action", 400);
  const r = schema.safeParse(value);
  if (!r.success) throw new SchoolError("INVALID_PAYLOAD", "Invalid command payload", 400);
  return r.data as SchoolAction;
}
export function emptyState(schoolId: string): SchoolState {
  return {
    schoolId,
    version: 0,
    settings: {
      name: "School",
      operator: "",
      privacyContact: "",
      legalBasis: "",
      healthLegalBasis: "",
      retentionDays: 30,
      sensitiveUploadsEnabled: false,
    },
    members: [],
    classes: [],
    attendance: [],
    absences: [],
    documents: [],
    documentRequests: [],
    letters: [],
    notifications: [],
    progress: [],
    chatMessages: [],
    chatReads: [],
    invites: [],
    audit: [],
  };
}
export function actor(s: SchoolState, u: Identity) {
  const m = s.members.find((m) => m.id === u.id && m.active);
  if (!m || !u.verified) throw new SchoolError("NOT_MEMBER", "Verified school membership required");
  return m;
}
export function office(m: SchoolMember) {
  return m.role === "owner" || m.role === "office";
}
function requireThat(ok: unknown, message = "Access denied"): asserts ok {
  if (!ok) throw new SchoolError("FORBIDDEN", message);
}
export function assigned(s: SchoolState, m: SchoolMember, studentId: string) {
  return (
    office(m) ||
    m.id === studentId ||
    (m.role === "teacher" &&
      s.classes.some((c) => c.teacherIds.includes(m.id) && c.studentIds.includes(studentId)))
  );
}
export function canReadDocument(s: SchoolState, m: SchoolMember, d: SchoolDocument) {
  return office(m) || d.studentId === m.id;
}
export function uploadsEnabled(s: SchoolState) {
  const x = s.settings;
  return !!(
    x.sensitiveUploadsEnabled &&
    x.operator &&
    x.privacyContact &&
    x.legalBasis &&
    x.healthLegalBasis &&
    x.retentionDays > 0 &&
    x.chatRetentionDays &&
    x.retentionPolicyNote &&
    x.recordRetentionDays &&
    Object.values(x.recordRetentionDays).every((n) => Number.isInteger(n) && n > 0) &&
    x.retentionByCategory &&
    Object.values(x.retentionByCategory).every((n) => Number.isInteger(n) && n > 0)
  );
}
export function audit(s: SchoolState, u: Identity, action: string, target = "") {
  s.audit.push({ id: randomUUID(), actorId: u.id, action, target, at: new Date().toISOString() });
}
function notify(s: SchoolState, userId: string, title: string, key?: string) {
  if (key) {
    const existing = s.notifications.find((n) => n.id === key);
    if (existing && !existing.readAt) return;
    if (existing) {
      existing.createdAt = new Date().toISOString();
      existing.readAt = null;
      return;
    }
  }
  s.notifications.push({
    id: key || randomUUID(),
    userId,
    title,
    body: "Open your secure school dashboard for details.",
    createdAt: new Date().toISOString(),
    readAt: null,
    delivery: "in_app",
  });
}
export function snapshot(s: SchoolState, u: Identity): SchoolSnapshot {
  const m = actor(s, u);
  const classes = s.classes.filter(
    (c) => office(m) || c.teacherIds.includes(m.id) || c.studentIds.includes(m.id)
  );
  const visible = (uid: string) => assigned(s, m, uid);
  return {
    schoolId: s.schoolId,
    version: s.version,
    actor: m,
    settings: s.settings,
    members: s.members
      .filter(
        (x) =>
          office(m) ||
          x.id === m.id ||
          classes.some((c) => c.studentIds.includes(x.id) || c.teacherIds.includes(x.id))
      )
      .map((x) => ({ ...x, email: office(m) || x.id === m.id ? x.email : "" })),
    classes,
    attendance: s.attendance.filter(
      (x) => visible(x.studentId) && classes.some((c) => c.id === x.classId)
    ),
    absenceSummaries:
      m.role === "teacher"
        ? s.absenceSummaries ||
          s.absences
            .filter((a) => assigned(s, m, a.studentId))
            .map(({ id, studentId, from, to, status }) => ({ id, studentId, from, to, status }))
        : [],
    absences: s.absences.filter((x) => office(m) || x.studentId === m.id),
    documents: s.documents
      .filter((d) => canReadDocument(s, m, d))
      .map(({ storagePath, sha256, ...d }) => d),
    documentRequests: s.documentRequests.filter((x) => office(m) || x.studentId === m.id),
    letters: s.letters
      .filter((l) => office(m) || l.createdBy === m.id || l.studentIds.includes(m.id))
      .map((l) =>
        office(m) || l.createdBy === m.id
          ? l
          : {
              ...l,
              studentIds: [m.id],
              readBy: l.readBy[m.id] ? { [m.id]: l.readBy[m.id] } : {},
              acknowledgements: l.acknowledgements[m.id]
                ? { [m.id]: l.acknowledgements[m.id] }
                : {},
              returnedDocuments: l.returnedDocuments[m.id]
                ? { [m.id]: l.returnedDocuments[m.id] }
                : {},
            }
      ),
    notifications: s.notifications.filter((n) => n.userId === m.id),
    progress: s.progress.filter((p) => visible(p.studentId)),
    deletionRequests: (s.deletionRequests || []).filter((r) => office(m) || r.userId === m.id),
    chatMessages: (s.chatMessages || [])
      .filter((x) => classes.some((c) => c.id === x.classId))
      .slice(-100)
      .map((x) => (x.deletedAt ? { ...x, body: "" } : x)),
    chatReads: (s.chatReads || []).filter(
      (x) => x.userId === m.id && classes.some((c) => c.id === x.classId)
    ),
    capabilities: {
      sensitiveUploads: uploadsEnabled(s),
      push: false,
      signatures: "acknowledgement_and_uploaded_copy",
    },
  };
}
export function apply(
  s: SchoolState,
  u: Identity,
  input: unknown,
  bootstrapUid?: string
): {
  inviteCode?: string;
  export?: unknown;
  storagePathsToDelete?: string[];
  messages?: SchoolState["chatMessages"];
  auditEntries?: SchoolState["audit"];
} {
  const c = parseAction(input);
  const now = new Date().toISOString();
  if (c.action === "bootstrap") {
    requireThat(
      s.members.length === 0 && u.admin && u.verified && bootstrapUid === u.id,
      "Configured owner identity required"
    );
    s.members.push({
      id: u.id,
      email: u.email,
      name: u.name || c.name,
      role: "owner",
      active: true,
    });
    s.settings.name = c.name;
    audit(s, u, c.action);
    return {};
  }
  if (c.action === "invite.accept") {
    requireThat(u.verified);
    const hash = createHash("sha256").update(c.code).digest("hex");
    const i = s.invites.find(
      (x) => x.hash === hash && x.email === u.email.toLowerCase() && x.expiresAt > now
    );
    requireThat(i, "Invalid or expired invitation");
    requireThat(!s.members.some((x) => x.id === u.id), "Already a member");
    s.members.push({ id: u.id, email: u.email, name: i.name, role: i.role, active: true });
    s.invites = s.invites.filter((x) => x !== i);
    audit(s, u, c.action);
    return {};
  }
  const m = actor(s, u);
  const student = (uid: string) =>
    s.members.some((x) => x.id === uid && x.active && x.role === "student");
  switch (c.action) {
    case "settings.update":
      requireThat(m.role === "owner");
      requireThat(
        !c.settings.sensitiveUploadsEnabled ||
          !!(c.settings.operator && c.settings.legalBasis && c.settings.healthLegalBasis),
        "Documented legal settings required"
      );
      requireThat(
        !c.settings.sensitiveUploadsEnabled || uploadsEnabled({ ...s, settings: c.settings }),
        "Complete retention policies are required before sensitive processing"
      );
      s.settings = c.settings;
      break;
    case "invite.create": {
      requireThat(m.role === "owner");
      const code = randomBytes(32).toString("base64url");
      const email = c.email.toLowerCase();
      requireThat(!s.members.some((x) => x.email.toLowerCase() === email), "Member already exists");
      s.invites = s.invites.filter((x) => x.email !== email);
      s.invites.push({
        hash: createHash("sha256").update(code).digest("hex"),
        email,
        name: c.name,
        role: c.role,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
      audit(s, u, c.action, email);
      return { inviteCode: code };
    }
    case "member.update": {
      requireThat(m.role === "owner");
      requireThat(c.memberId !== m.id || c.active, "Cannot deactivate your own session");
      const member = s.members.find((x) => x.id === c.memberId);
      requireThat(member);
      if (member.role === "owner" && (c.role !== "owner" || !c.active))
        requireThat(
          s.members.filter((x) => x.role === "owner" && x.active).length > 1,
          "Cannot remove last owner"
        );
      member.role = c.role;
      member.active = c.active;
      for (const cl of s.classes) {
        if (c.role !== "teacher" || !c.active)
          cl.teacherIds = cl.teacherIds.filter((x) => x !== member.id);
        if (c.role !== "student" || !c.active)
          cl.studentIds = cl.studentIds.filter((x) => x !== member.id);
      }
      break;
    }
    case "class.save": {
      requireThat(office(m));
      requireThat(
        c.teacherIds.every((uid) =>
          s.members.some((x) => x.id === uid && x.role === "teacher" && x.active)
        ) && c.studentIds.every(student),
        "Invalid class members"
      );
      const cl = {
        id: c.id || randomUUID(),
        name: c.name,
        teacherIds: Array.from(new Set(c.teacherIds)),
        studentIds: Array.from(new Set(c.studentIds)),
        schedule: c.schedule,
      };
      if (c.id)
        requireThat(
          s.classes.some((x) => x.id === c.id),
          "Unknown class"
        );
      s.classes = s.classes.filter((x) => x.id !== cl.id);
      s.classes.push(cl);
      break;
    }
    case "attendance.set": {
      const cl = s.classes.find((x) => x.id === c.classId);
      requireThat(cl && cl.studentIds.includes(c.studentId));
      requireThat(office(m) || (m.role === "teacher" && cl.teacherIds.includes(m.id)));
      requireThat(c.status !== "excused" || office(m), "Only office can excuse attendance");
      const key = `${c.classId}:${c.studentId}:${c.date}`;
      s.attendance = s.attendance.filter((a) => a.id !== key);
      const approved = s.absences.find(
        (a) =>
          a.studentId === c.studentId &&
          a.status === "approved" &&
          a.from <= c.date &&
          a.to >= c.date
      );
      const auto = approved && (c.status === "absent" || c.status === "late");
      s.attendance.push({
        ...c,
        id: key,
        status: auto ? "excused" : c.status,
        ...(auto
          ? { excusedByAbsenceId: approved.id, statusBeforeExcuse: c.status as "absent" | "late" }
          : {}),
        updatedBy: m.id,
        updatedAt: now,
      });
      break;
    }
    case "absence.report":
      requireThat(m.role === "student");
      requireThat(
        c.reason !== "illness" || uploadsEnabled(s),
        "Health information policy must be configured before reporting illness"
      );
      requireThat(
        c.from <= c.to && Date.parse(c.to) - Date.parse(c.from) <= 90 * 86400000,
        "Invalid absence range"
      );
      s.absences.push({
        id: randomUUID(),
        studentId: m.id,
        from: c.from,
        to: c.to,
        reason: c.reason,
        status: "pending",
        createdAt: now,
      });
      s.members
        .filter((x) => x.active && office(x))
        .forEach((x) =>
          notify(
            s,
            x.id,
            "New absence report",
            `absencereport:${s.absences[s.absences.length - 1].id}:${x.id}`
          )
        );
      break;
    case "absence.review": {
      requireThat(office(m));
      const a = s.absences.find((x) => x.id === c.absenceId);
      requireThat(a);
      a.status = c.status;
      a.reviewedBy = m.id;
      for (const at of s.attendance)
        if (at.studentId === a.studentId && at.date >= a.from && at.date <= a.to) {
          if (c.status === "approved" && (at.status === "absent" || at.status === "late")) {
            at.statusBeforeExcuse = at.status;
            at.status = "excused";
            at.excusedByAbsenceId = a.id;
            at.updatedBy = m.id;
            at.updatedAt = now;
          }
          if (c.status === "rejected" && at.excusedByAbsenceId === a.id) {
            const alternative = s.absences.find(
              (x) =>
                x.id !== a.id &&
                x.studentId === a.studentId &&
                x.status === "approved" &&
                x.from <= at.date &&
                x.to >= at.date
            );
            if (alternative) at.excusedByAbsenceId = alternative.id;
            else {
              at.status = at.statusBeforeExcuse || "absent";
              delete at.excusedByAbsenceId;
              delete at.statusBeforeExcuse;
            }
            at.updatedBy = m.id;
            at.updatedAt = now;
          }
        }
      for (const cl of s.classes.filter((c) => c.studentIds.includes(a.studentId)))
        for (const teacherId of cl.teacherIds)
          notify(
            s,
            teacherId,
            "Class attendance information updated",
            `absenceupdate:${a.id}:${c.status}:${teacherId}`
          );
      notify(s, a.studentId, "Absence report reviewed");
      break;
    }
    case "document.request":
      requireThat(office(m) && student(c.studentId));
      s.documentRequests.push({ ...c, id: randomUUID(), createdBy: m.id, createdAt: now });
      notify(s, c.studentId, "Document requested");
      break;
    case "letter.send":
      requireThat(office(m) || m.role === "teacher");
      requireThat(c.studentIds.every((uid) => student(uid) && assigned(s, m, uid)));
      s.letters.push({
        ...c,
        id: randomUUID(),
        studentIds: Array.from(new Set(c.studentIds)),
        createdBy: m.id,
        createdAt: now,
        readBy: {},
        acknowledgements: {},
        returnedDocuments: {},
      });
      c.studentIds.forEach((uid) => notify(s, uid, "New school letter"));
      break;
    case "letter.read":
    case "letter.acknowledge": {
      const l = s.letters.find((x) => x.id === c.letterId);
      requireThat(l && l.studentIds.includes(m.id));
      l.readBy[m.id] ??= now;
      if (c.action === "letter.acknowledge") l.acknowledgements[m.id] ??= now;
      break;
    }
    case "notification.read": {
      const n = s.notifications.find((x) => x.id === c.notificationId && x.userId === m.id);
      requireThat(n);
      n.readAt ??= now;
      break;
    }
    case "progress.sync":
      requireThat(m.role === "student");
      for (const p of c.items) {
        const key = `${m.id}:${p.lessonId}`;
        const prior = s.progress.find((x) => x.id === key);
        if (prior) {
          prior.completed ||= p.completed;
          prior.score = Math.max(prior.score, p.score);
          prior.updatedAt = now;
        } else s.progress.push({ ...p, id: key, studentId: m.id, updatedAt: now });
      }
      break;
    case "device.register":
    case "device.unregister": {
      s.devices = (s.devices || []).filter(
        (d) => !(d.token === c.token && (d.userId === m.id || c.action === "device.register"))
      );
      if (c.action === "device.register")
        s.devices.push({ userId: m.id, token: c.token, registeredAt: now });
      break;
    }
    case "document.hold": {
      requireThat(office(m));
      const d = s.documents.find((x) => x.id === c.documentId);
      requireThat(d);
      requireThat(
        !(s.deletionRequests || []).some(
          (r) => r.userId === d.studentId && r.status === "cleanup_pending"
        ),
        "Document destruction is already approved and in progress"
      );
      d.legalHold = c.hold;
      d.holdReason = c.hold ? c.reason : undefined;
      break;
    }
    case "chat.send":
    case "chat.read":
    case "chat.moderate":
    case "chat.history": {
      const cl = s.classes.find((x) => x.id === c.classId);
      requireThat(
        cl && (office(m) || cl.teacherIds.includes(m.id) || cl.studentIds.includes(m.id))
      );
      s.chatMessages ??= [];
      s.chatReads ??= [];
      if (c.action === "chat.send") {
        if (
          c.clientMessageId &&
          s.chatMessages.some((x) => x.authorId === m.id && x.clientMessageId === c.clientMessageId)
        ) {
          return {};
        }
        s.chatMessages.push({
          id: randomUUID(),
          ...(c.clientMessageId ? { clientMessageId: c.clientMessageId } : {}),
          classId: cl.id,
          authorId: m.id,
          authorName: m.name,
          body: c.body,
          createdAt: now,
        });
        for (const recipient of Array.from(new Set([...cl.teacherIds, ...cl.studentIds])))
          if (recipient !== m.id && s.members.some((x) => x.id === recipient && x.active))
            notify(s, recipient, "New class message", `classchat:${cl.id}:${recipient}`);
      } else if (c.action === "chat.read") {
        s.chatReads = s.chatReads.filter((x) => !(x.classId === cl.id && x.userId === m.id));
        s.chatReads.push({ classId: cl.id, userId: m.id, readAt: now });
      } else if (c.action === "chat.moderate") {
        requireThat(office(m) || cl.teacherIds.includes(m.id));
        const msg = s.chatMessages.find((x) => x.id === c.messageId && x.classId === cl.id);
        requireThat(msg);
        msg.body = "";
        msg.deletedAt = now;
        msg.deletedBy = m.id;
      } else {
        let messages = s.chatMessages.filter((x) => x.classId === cl.id);
        if (c.before) {
          const index = messages.findIndex((x) => x.id === c.before);
          requireThat(index >= 0, "Invalid history cursor");
          messages = messages.slice(0, index);
        }
        audit(s, u, c.action, cl.id);
        return {
          messages: messages.slice(-100).map((x) => (x.deletedAt ? { ...x, body: "" } : x)),
        };
      }
      break;
    }
    case "audit.list": {
      requireThat(m.role === "owner");
      let entries = s.audit;
      if (c.before) {
        const cursor = entries.findIndex((x) => x.id === c.before);
        requireThat(cursor >= 0, "Invalid audit cursor");
        entries = entries.slice(0, cursor);
      }
      return { auditEntries: entries.slice(-100) };
    }
    case "privacy.deletion.request":
      requestDeletion(s, u);
      break;
    case "data.export":
      return { export: exportUser(s, m.id) };
    case "retention.run": {
      requireThat(office(m));
      const expired = s.documents.filter((d) => d.expiresAt <= now && !d.legalHold);
      s.documents = s.documents.filter((d) => d.expiresAt > now || d.legalHold);
      if (s.settings.chatRetentionDays)
        for (const msg of s.chatMessages || [])
          if (
            !msg.deletedAt &&
            Date.parse(msg.createdAt) < Date.now() - s.settings.chatRetentionDays * 86400000
          ) {
            msg.body = "";
            msg.deletedAt = now;
            msg.deletedBy = "retention";
          }
      s.cleanupPaths = Array.from(
        new Set([
          ...(s.cleanupPaths || []),
          ...expired.map((d) => d.storagePath).filter((x): x is string => !!x),
        ])
      );
      audit(s, u, c.action);
      return { storagePathsToDelete: s.cleanupPaths };
    }
  }
  const identifiers = c as unknown as Record<string, unknown>;
  const target = String(
    identifiers.documentId ||
      identifiers.memberId ||
      identifiers.letterId ||
      identifiers.absenceId ||
      identifiers.classId ||
      identifiers.notificationId ||
      ""
  );
  audit(s, u, c.action, target);
  return {};
}
export function exportUser(s: SchoolState, uid: string) {
  return {
    chatMessages: (s.chatMessages || []).filter((x) => x.authorId === uid),
    deletionRequests: (s.deletionRequests || []).filter((x) => x.userId === uid),
    membership: s.members.find((x) => x.id === uid),
    attendance: s.attendance.filter((x) => x.studentId === uid),
    absences: s.absences.filter((x) => x.studentId === uid),
    documents: s.documents.filter((x) => x.studentId === uid).map(({ storagePath, ...x }) => x),
    requests: s.documentRequests.filter((x) => x.studentId === uid),
    letters: s.letters
      .filter((x) => x.studentIds.includes(uid))
      .map((x) => ({
        ...x,
        studentIds: [uid],
        readBy: { [uid]: x.readBy[uid] },
        acknowledgements: { [uid]: x.acknowledgements[uid] },
        returnedDocuments: { [uid]: x.returnedDocuments[uid] },
      })),
    notifications: s.notifications.filter((x) => x.userId === uid),
    progress: s.progress.filter((x) => x.studentId === uid),
  };
}
