/** Shared web/native school contract. Never import server modules into clients. */
export type SchoolAuditEntry = {
  id: string;
  actorId: string;
  action: string;
  target: string;
  at: string;
};
export type SchoolRole = "owner" | "office" | "teacher" | "student";
export type SchoolMember = {
  id: string;
  email: string;
  name: string;
  role: SchoolRole;
  active: boolean;
};
export type SchoolClass = {
  id: string;
  name: string;
  teacherIds: string[];
  studentIds: string[];
  schedule: string;
};
export type Attendance = {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: "present" | "late" | "absent" | "excused";
  updatedBy: string;
  updatedAt: string;
  excusedByAbsenceId?: string;
  statusBeforeExcuse?: "absent" | "late";
};
export type Absence = {
  id: string;
  studentId: string;
  from: string;
  to: string;
  reason: "illness" | "personal" | "other";
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  createdAt: string;
};
export type SchoolDocument = {
  id: string;
  studentId: string;
  uploadedBy: string;
  title: string;
  category: "general" | "medical" | "jobcenter" | "signed_letter";
  fileName: string;
  mime: string;
  size: number;
  scanStatus: "quarantined" | "clean" | "rejected";
  createdAt: string;
  expiresAt: string;
  absenceId?: string;
  letterId?: string;
  requestId?: string;
  storagePath?: string;
  legalHold?: boolean;
  holdReason?: string;
  sha256?: string;
};
export type DocumentRequest = {
  id: string;
  studentId: string;
  title: string;
  category: SchoolDocument["category"];
  dueDate: string;
  createdBy: string;
  createdAt: string;
  fulfilledBy?: string;
};
export type SchoolLetter = {
  id: string;
  title: string;
  body: string;
  studentIds: string[];
  dueDate: string;
  createdBy: string;
  createdAt: string;
  acknowledgements: Record<string, string>;
  readBy: Record<string, string>;
  returnedDocuments: Record<string, string>;
};
export type SchoolNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  delivery: "in_app";
};
export type SchoolProgress = {
  lessonTitle?: string;
  level?: string;
  source?: "mobile" | "web" | "unknown";
  id: string;
  studentId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  updatedAt: string;
};
export type SchoolSettings = {
  name: string;
  operator: string;
  privacyContact: string;
  legalBasis: string;
  healthLegalBasis: string;
  retentionDays: number;
  retentionByCategory?: Record<SchoolDocument["category"], number>;
  chatRetentionDays?: number;
  recordRetentionDays?: Record<
    "attendance" | "absences" | "letters" | "notifications" | "progress" | "audit",
    number
  >;
  retentionPolicyNote?: string;
  sensitiveUploadsEnabled: boolean;
};
export type SchoolChatMessage = {
  id: string;
  classId: string;
  authorId: string;
  authorName: string;
  clientMessageId?: string;
  body: string;
  createdAt: string;
  deletedAt?: string;
  deletedBy?: string;
};
export type SchoolChatRead = { classId: string; userId: string; readAt: string };
export type SchoolSnapshot = {
  schoolId: string;
  version: number;
  pagination?: Record<string, boolean>;
  pageCursors?: Record<string, string | null>;
  actor: SchoolMember;
  settings: SchoolSettings;
  members: SchoolMember[];
  classes: SchoolClass[];
  attendance: Attendance[];
  absences: Absence[];
  absenceSummaries?: Pick<Absence, "id" | "studentId" | "from" | "to" | "status">[];
  documents: SchoolDocument[];
  documentRequests: DocumentRequest[];
  letters: SchoolLetter[];
  notifications: SchoolNotification[];
  progress: SchoolProgress[];
  progressMetadataPending?: boolean;
  deletionRequests?: {
    userId: string;
    requestedAt: string;
    status: "pending_review" | "cleanup_pending" | "completed";
    reason: string;
  }[];
  chatMessages: SchoolChatMessage[];
  chatReads: SchoolChatRead[];
  capabilities: {
    sensitiveUploads: boolean;
    push: boolean;
    signatures: "acknowledgement_and_uploaded_copy";
  };
};
export type SchoolAction =
  | { action: "bootstrap"; name: string }
  | { action: "settings.update"; settings: SchoolSettings }
  | { action: "invite.create"; email: string; name: string; role: SchoolRole }
  | { action: "invite.accept"; code: string }
  | { action: "member.update"; memberId: string; role: SchoolRole; active: boolean }
  | {
      action: "class.save";
      id?: string;
      name: string;
      teacherIds: string[];
      studentIds: string[];
      schedule: string;
    }
  | {
      action: "attendance.set";
      classId: string;
      studentId: string;
      date: string;
      status: Attendance["status"];
    }
  | { action: "absence.report"; from: string; to: string; reason: Absence["reason"] }
  | { action: "absence.review"; absenceId: string; status: "approved" | "rejected" }
  | {
      action: "document.request";
      studentId: string;
      title: string;
      category: SchoolDocument["category"];
      dueDate: string;
    }
  | { action: "letter.send"; title: string; body: string; studentIds: string[]; dueDate: string }
  | { action: "letter.read" | "letter.acknowledge"; letterId: string }
  | { action: "notification.read"; notificationId: string }
  | { action: "progress.sync"; items: { lessonId: string; completed: boolean; score: number }[] }
  | { action: "retention.run" }
  | {
      action: "section.page";
      section:
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
      before?: string;
    }
  | { action: "audit.list"; before?: string }
  | { action: "privacy.deletion.request" }
  | { action: "data.export"; cursor?: string }
  | { action: "chat.send"; classId: string; body: string; clientMessageId?: string }
  | { action: "document.hold"; documentId: string; hold: boolean; reason: string }
  | { action: "device.register"; token: string }
  | { action: "device.unregister"; token: string }
  | { action: "chat.read"; classId: string }
  | { action: "chat.moderate"; classId: string; messageId: string }
  | { action: "chat.history"; classId: string; before?: string };
// GET /api/school -> SchoolSnapshot; POST -> {snapshot, inviteCode?} or {export}.
// POST /api/school/documents multipart: file,title,category,absenceId?,letterId?,requestId?
// GET /api/school/documents?id=... -> authenticated private binary, only clean files.
// All API errors: {error, code}; 401 auth, 403 scope, 409 conflict/hold, 503 unconfigured.
