/**
 * GET /api/auth/profile
 *
 * Returns the Supabase profile for the currently signed-in Firebase user.
 * Looks up by firebase_uid. Auto-creates the profile if missing.
 *
 * Auth: accepts either:
 *   1. __session cookie (set after signin — the normal path)
 *   2. Authorization: Bearer <idToken> header (used right after signup
 *      before the session cookie has been written)
 */
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getAdminAuth } from "@/lib/firebase-admin";
import { findOrCreateProfile } from "@/lib/profileHelper";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY not set." },
      { status: 500 }
    );
  }

  // ── 1. Identify the caller ────────────────────────────────────────────────
  // Try session cookie first (standard signin path), then Bearer token fallback.
  let firebaseUid: string;
  let email: string;
  let name: string;
  let role: string;

  const sessionFromCookie = await getServerSession();

  if (sessionFromCookie?.user) {
    // Normal path — session cookie present
    ({ id: firebaseUid, email, name, role } = sessionFromCookie.user);
  } else {
    // Fallback path — Authorization: Bearer <idToken>
    // Used right after signup before the __session cookie is written.
    const authHeader = req.headers.get("authorization") ?? "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!bearerToken) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    try {
      const decoded = await getAdminAuth().verifyIdToken(bearerToken);
      firebaseUid = decoded.uid;
      email = decoded.email ?? "";
      name = (decoded.name as string) ?? "";
      role = (decoded.role as string) ?? "student";
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[profile] Bearer token verification failed:", msg);
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
  }

  // ── 2. Find or create Supabase profile ────────────────────────────────────
  const safeRole =
    role === "teacher" || role === "admin" ? role : "student";

  try {
    const profile = await findOrCreateProfile({
      firebaseUid,
      email,
      fullName: name || email.split("@")[0],
      role: safeRole as "student" | "teacher" | "admin",
      germanLevel: safeRole === "student" ? "A1" : null,
    });

    console.log(
      `[profile] ✓ Resolved  supabase_id=${profile.id}  firebase_uid=${profile.firebase_uid}  role=${profile.role}`
    );

    return NextResponse.json({
      profile: {
        id: profile.id,
        firebase_uid: profile.firebase_uid,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        german_level: profile.german_level,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[profile] ✗ findOrCreateProfile failed:", msg);
    return NextResponse.json(
      { error: "Could not load your profile. Please sign out and sign in again." },
      { status: 500 }
    );
  }
}
