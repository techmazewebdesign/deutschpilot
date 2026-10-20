import { randomUUID } from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import {
  applyScanResult,
  authorizeDownload,
  MAX_FILE_BYTES,
  registerDocument,
} from "@/lib/school/documents";
import { SchoolError, snapshot } from "@/lib/school/engine";
import {
  checkMutationOrigin,
  errorResponse,
  mutate,
  privateHeaders,
  schoolIdentity,
  readSnapshot,
} from "@/lib/school/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    checkMutationOrigin(request);
    const u = await schoolIdentity(request);
    const length = Number(request.headers.get("content-length"));
    if (length > MAX_FILE_BYTES + 65536)
      throw new SchoolError("SIZE", "A bounded upload of at most 10 MB is required", 413);
    const scanUrl = process.env.SCHOOL_SCANNER_URL;
    const scanToken = process.env.SCHOOL_SCANNER_TOKEN;
    if (!scanUrl || !scanToken || !scanUrl.startsWith("https://"))
      throw new SchoolError("SCANNER_REQUIRED", "Private upload scanner is not configured", 503);
    const reader = request.body?.getReader();
    if (!reader) throw new SchoolError("INVALID_PAYLOAD", "Upload body required", 400);
    const chunks: Uint8Array[] = [];
    let received = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      received += part.value.byteLength;
      if (received > MAX_FILE_BYTES + 65536) {
        await reader.cancel();
        throw new SchoolError("SIZE", "Maximum document size is 10 MB", 413);
      }
      chunks.push(part.value);
    }
    const boundedBody = Buffer.concat(chunks);
    const form = await new Response(boundedBody, {
      headers: { "Content-Type": request.headers.get("content-type") || "" },
    }).formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new SchoolError("INVALID_PAYLOAD", "File required", 400);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const input: {
      title: string;
      category: string;
      fileName: string;
      bytes: Uint8Array;
      absenceId?: string;
      letterId?: string;
      requestId?: string;
    } = {
      title: String(form.get("title") || ""),
      category: String(form.get("category") || ""),
      fileName: file.name,
      bytes,
      ...Object.fromEntries(
        ["absenceId", "letterId", "requestId"].flatMap((k) =>
          form.get(k) ? [[k, String(form.get(k))]] : []
        )
      ),
    };
    const id = randomUUID();
    const saved = await mutate(
      u,
      {
        action: "document.upload",
        documentId: id,
        absenceId: input.absenceId,
        letterId: input.letterId,
        requestId: input.requestId,
      },
      (s) => registerDocument(s, u, input, id)
    );
    const d = saved.result;
    const db = createAdminSupabaseClient();
    const { error } = await db.storage
      .from("school-private")
      .upload(d.storagePath!, bytes, { contentType: d.mime, upsert: false });
    if (error)
      throw new SchoolError(
        "UPLOAD_FAILED",
        "Upload failed; quarantined record retained for review",
        503
      );
    // Scanner contract: authenticated binary POST, exact sha256 echoed and verdict clean/rejected.
    // No client endpoint can mark a document clean. Failed scans leave inaccessible quarantine.
    let response: Response;
    try {
      response = await fetch(scanUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${scanToken}`,
          "Content-Type": d.mime,
          "X-Content-SHA256": d.sha256!,
        },
        body: Buffer.from(bytes),
        signal: AbortSignal.timeout(20000),
        redirect: "error",
      });
    } catch {
      throw new SchoolError("SCAN_PENDING", "File quarantined; scanner did not complete", 503);
    }
    if (!response.ok)
      throw new SchoolError("SCAN_PENDING", "File quarantined; scanner did not complete", 503);
    const scan = await response.json();
    if (scan.sha256 !== d.sha256 || !["clean", "rejected"].includes(scan.verdict))
      throw new SchoolError("SCAN_PENDING", "File quarantined; scanner response was invalid", 503);
    const final = await mutate(u, { action: "document.scan", documentId: id }, (s) =>
      applyScanResult(s, id, d.sha256!, scan.verdict)
    );
    return Response.json(
      { snapshot: await readSnapshot(u), documentId: id },
      { status: 201, headers: privateHeaders }
    );
  } catch (e) {
    return errorResponse(e);
  }
}
export async function GET(request: Request) {
  try {
    const u = await schoolIdentity(request);
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new SchoolError("INVALID_PAYLOAD", "Document ID required", 400);
    const { result: d } = await mutate(u, { action: "document.download", documentId: id }, (s) =>
      authorizeDownload(s, u, id)
    );
    const { data, error } = await createAdminSupabaseClient()
      .storage.from("school-private")
      .download(d.storagePath!);
    if (error || !data)
      throw new SchoolError("STORAGE_UNAVAILABLE", "Document storage unavailable", 503);
    return new Response(data, {
      headers: {
        ...privateHeaders,
        "Content-Type": d.mime,
        "Content-Disposition": `attachment; filename="document"; filename*=UTF-8''${encodeURIComponent(d.fileName)}`,
        "Content-Security-Policy": "sandbox; default-src 'none'",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
