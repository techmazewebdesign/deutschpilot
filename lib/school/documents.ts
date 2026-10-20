import { createHash, randomUUID } from "node:crypto";
import {
  actor,
  audit,
  canReadDocument,
  office,
  SchoolError,
  uploadsEnabled,
  type Identity,
  type SchoolState,
} from "./engine";
import type { SchoolDocument } from "./contract";
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export function sniffFile(bytes: Uint8Array) {
  if (bytes.length < 8)
    throw new SchoolError("FILE_TYPE", "Only PDF, PNG and JPEG are accepted", 400);
  const b = Buffer.from(bytes);
  if (b.subarray(0, 5).toString() === "%PDF-") return "application/pdf";
  if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (b[0] === 255 && b[1] === 216 && b[2] === 255) return "image/jpeg";
  throw new SchoolError("FILE_TYPE", "Only PDF, PNG and JPEG are accepted", 400);
}
export function registerDocument(
  s: SchoolState,
  u: Identity,
  input: {
    title: string;
    category: string;
    fileName: string;
    bytes: Uint8Array;
    absenceId?: string;
    letterId?: string;
    requestId?: string;
  },
  documentId = randomUUID()
): SchoolDocument {
  const m = actor(s, u);
  if (m.role !== "student")
    throw new SchoolError("FORBIDDEN", "Only students upload their own private records");
  if (!uploadsEnabled(s))
    throw new SchoolError(
      "POLICY_REQUIRED",
      "Document processing legal basis and retention must be configured",
      503
    );
  if (!input.bytes.length || input.bytes.length > MAX_FILE_BYTES)
    throw new SchoolError("SIZE", "Maximum document size is 10 MB", 413);
  if (!input.title.trim() || input.title.length > 200 || input.fileName.length > 200)
    throw new SchoolError("INVALID_PAYLOAD", "Invalid document title or filename", 400);
  if (!["medical", "general", "jobcenter", "signed_letter"].includes(input.category))
    throw new SchoolError("INVALID_PAYLOAD", "Invalid document category", 400);
  if (input.absenceId && !s.absences.some((x) => x.id === input.absenceId && x.studentId === m.id))
    throw new SchoolError("FORBIDDEN", "Unknown absence");
  if (
    input.letterId &&
    !s.letters.some((x) => x.id === input.letterId && x.studentIds.includes(m.id))
  )
    throw new SchoolError("FORBIDDEN", "Unknown letter");
  if (input.category === "signed_letter" && !input.letterId)
    throw new SchoolError("INVALID_PAYLOAD", "A signed letter needs a letter reference", 400);
  if (
    input.requestId &&
    !s.documentRequests.some(
      (x) =>
        x.id === input.requestId &&
        x.studentId === m.id &&
        x.category === input.category &&
        !x.fulfilledBy
    )
  )
    throw new SchoolError("FORBIDDEN", "Unknown or already fulfilled request");
  const now = new Date();
  const d: SchoolDocument = {
    id: documentId,
    studentId: m.id,
    uploadedBy: m.id,
    title: input.title.trim(),
    category: input.category as SchoolDocument["category"],
    fileName: input.fileName.replace(/[\r\n\\/\x00-\x1f]/g, "_"),
    mime: sniffFile(input.bytes),
    size: input.bytes.length,
    scanStatus: "quarantined",
    createdAt: now.toISOString(),
    expiresAt: new Date(
      now.getTime() +
        (s.settings.retentionByCategory?.[input.category as SchoolDocument["category"]] ||
          s.settings.retentionDays) *
          86400000
    ).toISOString(),
    storagePath: `${s.schoolId}/${m.id}/${documentId}`,
    sha256: createHash("sha256").update(input.bytes).digest("hex"),
    ...(input.absenceId ? { absenceId: input.absenceId } : {}),
    ...(input.letterId ? { letterId: input.letterId } : {}),
    ...(input.requestId ? { requestId: input.requestId } : {}),
  };
  s.documents.push(d);
  audit(s, u, "document.upload", d.id);
  return d;
}
/** Called only by a trusted server scanner adapter after hashing the exact stored bytes. */
export function applyScanResult(
  s: SchoolState,
  documentId: string,
  sha256: string,
  verdict: "clean" | "rejected"
) {
  const d = s.documents.find((x) => x.id === documentId);
  if (!d || d.sha256 !== sha256 || d.scanStatus !== "quarantined")
    throw new SchoolError("SCAN_CONFLICT", "Document scan state changed", 409);
  d.scanStatus = verdict;
  if (verdict === "clean") {
    if (d.requestId) {
      const r = s.documentRequests.find((x) => x.id === d.requestId);
      if (r && !r.fulfilledBy) r.fulfilledBy = d.id;
    }
    if (d.letterId) {
      const l = s.letters.find((x) => x.id === d.letterId);
      if (l) l.returnedDocuments[d.studentId] = d.id;
    }
    s.members
      .filter((x) => x.active && office(x))
      .forEach((x) =>
        s.notifications.push({
          id: randomUUID(),
          userId: x.id,
          title: "Private document available",
          body: "Open your secure school dashboard for details.",
          createdAt: new Date().toISOString(),
          readAt: null,
          delivery: "in_app",
        })
      );
  }
  s.audit.push({
    id: randomUUID(),
    actorId: "trusted-scanner",
    action: `document.scan.${verdict}`,
    target: d.id,
    at: new Date().toISOString(),
  });
}
export function authorizeDownload(s: SchoolState, u: Identity, id: string) {
  const m = actor(s, u);
  const d = s.documents.find((x) => x.id === id);
  if (!d || !canReadDocument(s, m, d)) throw new SchoolError("FORBIDDEN", "Document not available");
  if (d.scanStatus !== "clean" || d.expiresAt <= new Date().toISOString())
    throw new SchoolError(
      "DOCUMENT_UNAVAILABLE",
      "Document is quarantined, rejected or expired",
      409
    );
  audit(s, u, "document.download", id);
  return d;
}
