import { getFirebaseRuntime } from "./firebase";
import type {
  SchoolAction,
  SchoolSnapshot,
  SchoolDocument,
  SchoolChatMessage,
} from "../../lib/school/contract";
export type {
  SchoolAction,
  SchoolSnapshot,
  SchoolDocument,
  SchoolChatMessage,
} from "../../lib/school/contract";
export type SchoolCommandResult = {
  snapshot?: SchoolSnapshot;
  inviteCode?: string;
  messages?: SchoolChatMessage[];
  section?: string;
  items?: Record<string, unknown>[];
  nextCursor?: string | null;
  export?: unknown;
};
export class SchoolError extends Error {
  constructor(
    message: string,
    public code = "NETWORK",
    public httpStatus = 0
  ) {
    super(message);
  }
}
async function request(path: string, init: RequestInit = {}, uid?: string) {
  const { auth, apiBaseUrl } = await getFirebaseRuntime();
  const user = auth.currentUser;
  if (!user || (uid && user.uid !== uid))
    throw new SchoolError("Bitte erneut anmelden.", "AUTH_CHANGED");
  const token = await user.getIdToken();
  if (auth.currentUser?.uid !== user.uid)
    throw new SchoolError("Das Konto wurde gewechselt. Bitte neu laden.", "AUTH_CHANGED");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: "no-store",
    });
    if (auth.currentUser?.uid !== user.uid)
      throw new SchoolError("Das Konto wurde gewechselt. Bitte neu laden.", "AUTH_CHANGED");
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new SchoolError(
        error.error || `Schulserver nicht verfügbar (${response.status}).`,
        error.code || String(response.status),
        response.status
      );
    }
    return response;
  } catch (error) {
    if (error instanceof SchoolError) throw error;
    throw new SchoolError(
      "Keine bestätigte Verbindung. Bitte neu laden und den Status prüfen, bevor du erneut sendest."
    );
  } finally {
    clearTimeout(timeout);
  }
}
async function authenticatedJson(response: Response, uid: string) {
  const result = await response.json();
  const { auth } = await getFirebaseRuntime();
  if (auth.currentUser?.uid !== uid)
    throw new SchoolError("Das Konto wurde gewechselt. Bitte neu laden.", "AUTH_CHANGED");
  if (result.snapshot && result.snapshot.actor?.id !== uid)
    throw new SchoolError("Schulkonto gewechselt.", "AUTH_CHANGED");
  return result;
}
export async function loadSchool(uid: string): Promise<SchoolSnapshot> {
  const result = await authenticatedJson(await request("/api/school", {}, uid), uid);
  if (result.actor?.id !== uid) throw new SchoolError("Schulkonto gewechselt.", "AUTH_CHANGED");
  return result;
}
export async function schoolCommand(
  uid: string,
  command: SchoolAction
): Promise<SchoolCommandResult> {
  return authenticatedJson(
    await request(
      "/api/school",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      },
      uid
    ),
    uid
  );
}
export async function uploadSchoolDocument(
  uid: string,
  asset: { uri: string; name: string; mimeType?: string; size?: number },
  fields: {
    title: string;
    category: SchoolDocument["category"];
    absenceId?: string;
    letterId?: string;
    requestId?: string;
  }
) {
  if ((asset.size ?? Infinity) > 10 * 1024 * 1024)
    throw new SchoolError("Bitte eine Datei bis 10 MB auswählen.");
  if (!["application/pdf", "image/jpeg", "image/png"].includes(asset.mimeType || ""))
    throw new SchoolError("Nur PDF, JPEG und PNG sind erlaubt.");
  const data = new FormData();
  data.append("file", {
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType,
  } as unknown as Blob);
  for (const [key, value] of Object.entries(fields)) if (value) data.append(key, value);
  return authenticatedJson(
    await request("/api/school/documents", { method: "POST", body: data }, uid),
    uid
  );
}
// Fetch remains authenticated. Never expose a persistent/public storage URL or log private bytes.
export async function fetchSchoolDocument(uid: string, id: string): Promise<Blob> {
  return (await request(`/api/school/documents?id=${encodeURIComponent(id)}`, {}, uid)).blob();
}

export function isSchoolAccessDenial(error: unknown): boolean {
  return (
    error instanceof SchoolError &&
    ([401, 403].includes(error.httpStatus) ||
      ["AUTH_CHANGED", "NOT_MEMBER", "UNAUTHENTICATED", "FORBIDDEN"].includes(error.code))
  );
}
