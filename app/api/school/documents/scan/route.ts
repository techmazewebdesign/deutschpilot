import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { actor, office, SchoolError, snapshot } from "@/lib/school/engine";
import { applyScanResult } from "@/lib/school/documents";
import {
  checkMutationOrigin,
  errorResponse,
  mutate,
  privateHeaders,
  readState,
  schoolIdentity,
  readSnapshot,
} from "@/lib/school/server";
import { createHash } from "node:crypto";
export const dynamic = "force-dynamic";
/** Office-only retry of a quarantined upload; scanner remains sole source of verdict. */
export async function POST(request: Request) {
  try {
    checkMutationOrigin(request);
    const u = await schoolIdentity(request);
    const id = new URL(request.url).searchParams.get("id");
    const state = await readState(u, { action: "document.rescan", documentId: id });
    if (!office(actor(state, u))) throw new SchoolError("FORBIDDEN", "Office access required");

    const d = state.documents.find((x) => x.id === id && x.scanStatus === "quarantined");
    if (!d || d.expiresAt <= new Date().toISOString())
      throw new SchoolError("DOCUMENT_UNAVAILABLE", "No quarantined document available", 409);
    const url = process.env.SCHOOL_SCANNER_URL;
    const token = process.env.SCHOOL_SCANNER_TOKEN;
    if (!url?.startsWith("https://") || !token)
      throw new SchoolError("SCANNER_REQUIRED", "Scanner unavailable", 503);
    const { data, error } = await createAdminSupabaseClient()
      .storage.from("school-private")
      .download(d.storagePath!);
    if (error || !data)
      throw new SchoolError("STORAGE_UNAVAILABLE", "Private file unavailable", 503);
    const bytes = Buffer.from(await data.arrayBuffer());
    if (createHash("sha256").update(bytes).digest("hex") !== d.sha256)
      throw new SchoolError("INTEGRITY", "Document integrity check failed", 409);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": d.mime,
        "X-Content-SHA256": d.sha256!,
      },
      body: bytes,
      signal: AbortSignal.timeout(20000),
      redirect: "error",
    });
    if (!response.ok) throw new SchoolError("SCAN_PENDING", "Scan remains pending", 503);
    const scan = await response.json();
    if (scan.sha256 !== d.sha256 || !["clean", "rejected"].includes(scan.verdict))
      throw new SchoolError("SCAN_PENDING", "Invalid scanner verdict", 503);
    const saved = await mutate(u, { action: "document.scan", documentId: d.id }, (s) => {
      if (!office(actor(s, u))) throw new SchoolError("FORBIDDEN", "Office access required");
      applyScanResult(s, d.id, d.sha256!, scan.verdict);
    });
    return Response.json({ snapshot: await readSnapshot(u) }, { headers: privateHeaders });
  } catch (e) {
    return errorResponse(e);
  }
}
