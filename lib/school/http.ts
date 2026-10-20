import { SchoolError, type Identity } from "./engine";
type Claims = {
  uid: string;
  email?: string;
  name?: unknown;
  email_verified?: boolean;
  role?: unknown;
};
type AuthVerifier = {
  verifyIdToken: (token: string, checkRevoked: boolean) => Promise<Claims>;
  verifySessionCookie: (cookie: string, checkRevoked: boolean) => Promise<Claims>;
};
export async function verifiedSchoolIdentity(
  request: Request,
  cookie: string | undefined,
  auth: AuthVerifier
): Promise<Identity> {
  try {
    const header = request.headers.get("authorization");
    let decoded: Claims;
    if (header) {
      if (!header.startsWith("Bearer ") || header.length > 10000)
        throw new Error("Invalid authorization");
      decoded = await auth.verifyIdToken(header.slice(7), true);
    } else {
      if (!cookie) throw new Error("Missing cookie");
      decoded = await auth.verifySessionCookie(cookie, true);
    }
    if (!decoded.uid || !decoded.email_verified || !decoded.email)
      throw new Error("Verified identity required");
    return {
      id: decoded.uid,
      email: decoded.email,
      name: typeof decoded.name === "string" ? decoded.name : "",
      verified: true,
      admin: decoded.role === "admin",
    };
  } catch {
    throw new SchoolError("UNAUTHENTICATED", "Sign in with a verified account", 401);
  }
}
export function requireSchoolMutationOrigin(request: Request) {
  if (request.headers.get("authorization")?.startsWith("Bearer ")) return;
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    throw new SchoolError("ORIGIN", "Invalid request origin", 403);
}
export async function readSchoolJson(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new SchoolError("INVALID_PAYLOAD", "JSON body required", 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    length += part.value.byteLength;
    if (length > 100000) {
      await reader.cancel();
      throw new SchoolError("SIZE", "Request too large", 413);
    }
    chunks.push(part.value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new SchoolError("INVALID_PAYLOAD", "Invalid JSON", 400);
  }
}
