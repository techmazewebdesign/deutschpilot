/**
 * POST /api/auth/set-role
 *
 * Called immediately after Firebase signup.
 * 1. Verifies the Firebase ID token (server-side, Firebase Admin SDK).
 * 2. Sets Firebase custom claims { role } so the session cookie carries the role.
 * 3. Finds or creates a Supabase profile row:
 *    - profiles.id       = auto-generated uuid  (NOT the Firebase UID)
 *    - profiles.firebase_uid = Firebase UID (text)
 *    - profiles.role     = selected role
 * 4. Saves to Firestore (non-blocking secondary store).
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { findOrCreateProfile } from "@/lib/profileHelper";

export const runtime = "nodejs";

const isDev = process.env.NODE_ENV === "development";
const ALLOWED_ROLES = ["student"] as const;
type SignupRole = (typeof ALLOWED_ROLES)[number];

export async function POST(req: NextRequest) {
  // ── 0. Env guard ──────────────────────────────────────────────────────────
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Account setup is temporarily unavailable." },
      { status: 500 }
    );
  }

  // ── 1. Parse body ─────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { idToken, fullName, email, role, germanLevel } = body as {
    idToken?: string;
    fullName?: string;
    email?: string;
    role?: string;
    germanLevel?: string | null;
  };

  if (typeof idToken !== "string" || !idToken || idToken.length > 10000)
    return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
  if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.length > 100)
    return NextResponse.json({ error: "Missing fullName." }, { status: 400 });

  let safeRole: SignupRole | "teacher" | "admin" = ALLOWED_ROLES.includes(role as SignupRole)
    ? (role as SignupRole)
    : "student";

  // ── 2. Verify Firebase ID token ───────────────────────────────────────────
  let firebaseUid: string;
  let userEmail: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken, true);
    firebaseUid = decoded.uid;
    userEmail = decoded.email ?? "";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[set-role] verifyIdToken failed:", msg);
    return NextResponse.json(
      { error: "Invalid or expired ID token.", ...(isDev && { detail: msg }) },
      { status: 401 }
    );
  }

  // ── 3. Set Firebase custom claims (non-blocking) ──────────────────────────
  try {
    const existing = await getAdminAuth().getUser(firebaseUid);
    const currentRole = existing.customClaims?.role;
    if (!currentRole && role && role !== "student")
      return NextResponse.json(
        { error: "Staff access must be assigned by an administrator." },
        { status: 403 }
      );
    if (currentRole === "admin" || currentRole === "teacher" || currentRole === "student")
      safeRole = currentRole;
    if (!existing.customClaims?.role) {
      await getAdminAuth().setCustomUserClaims(firebaseUid, {
        ...existing.customClaims,
        role: safeRole,
      });
    }
    console.log(`[set-role] ✓ Firebase custom claims set  role=${safeRole}`);
  } catch (err) {
    return NextResponse.json(
      { error: "Account role could not be verified. Please retry." },
      { status: 503 }
    );
  }

  // ── 4. Find or create Supabase profile (BLOCKING) ─────────────────────────
  // profiles.id is auto-generated uuid — NEVER insert firebaseUid as profiles.id
  let profile;
  try {
    profile = await findOrCreateProfile({
      firebaseUid,
      email: userEmail,
      fullName: String(fullName),
      role: safeRole,
      germanLevel:
        typeof germanLevel === "string" && ["A1", "A2", "B1", "B2", "C1"].includes(germanLevel)
          ? germanLevel
          : null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[set-role] ✗ Profile creation failed:", msg);
    return NextResponse.json(
      { error: "Failed to create profile in database.", ...(isDev && { detail: msg }) },
      { status: 500 }
    );
  }

  // ── 5. Save to Firestore (non-blocking secondary store) ───────────────────
  try {
    await getAdminDb()
      .doc(`users/${firebaseUid}`)
      .set(
        {
          firebase_uid: firebaseUid,
          supabase_profile_id: profile.id,
          fullName,
          email: userEmail,
          role: safeRole,
          germanLevel:
            typeof germanLevel === "string" && ["A1", "A2", "B1", "B2", "C1"].includes(germanLevel)
              ? germanLevel
              : null,
          createdAt: new Date(),
        },
        { merge: true }
      );
    console.log(`[set-role] ✓ Firestore record saved`);
  } catch (err) {
    console.warn("[set-role] ⚠ Firestore save failed (non-blocking):", err);
  }

  // ── 6. Success ────────────────────────────────────────────────────────────
  return NextResponse.json({ ok: true, uid: firebaseUid, role: safeRole, supabaseId: profile.id });
}
