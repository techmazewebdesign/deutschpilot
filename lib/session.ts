import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase-admin";

export type UserRole = "student" | "teacher" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
};

export type AuthSession = { user: SessionUser };

export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const sessionCookie = cookies().get("__session")?.value;
    if (!sessionCookie) return null;

    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    const claims = decoded as Record<string, unknown>;

    return {
      user: {
        id: decoded.uid,
        email: decoded.email ?? "",
        name: (claims.name as string) ?? "",
        role: ((claims.role as UserRole) ?? "student"),
        emailVerified: decoded.email_verified ?? false,
      },
    };
  } catch {
    return null;
  }
}
