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
const ALLOWED_ROLES = ["student", "teacher"] as const;
type SignupRole = (typeof ALLOWED_ROLES)[number];

export async function POST(req: NextRequest) {
  // ── 0. Env guard ──────────────────────────────────────────────────────────
  console.log("[set-role] SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY not set in .env.local" },
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

  if (!idToken)   return NextResponse.json({ error: "Missing idToken."  }, { status: 400 });
  if (!fullName)  return NextResponse.json({ error: "Missing fullName." }, { status: 400 });

  const safeRole: SignupRole = ALLOWED_ROLES.includes(role as SignupRole)
    ? (role as SignupRole)
    : "student";

  // ── 2. Verify Firebase ID token ───────────────────────────────────────────
  let firebaseUid: string;
  let userEmail: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    firebaseUid = decoded.uid;
    userEmail = email ?? decoded.email ?? "";
    console.log(`[set-role] ✓ Token verified  firebase_uid=${firebaseUid}  email=${userEmail}  role=${safeRole}`);
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
    await getAdminAuth().setCustomUserClaims(firebaseUid, { role: safeRole });
    console.log(`[set-role] ✓ Firebase custom claims set  role=${safeRole}`);
  } catch (err) {
    console.warn("[set-role] ⚠ setCustomUserClaims failed (non-blocking):", err);
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
      germanLevel: typeof germanLevel === "string" ? germanLevel : null,
    });
    console.log(`[set-role] ✓ Supabase profile ready  supabase_id=${profile.id}  firebase_uid=${profile.firebase_uid}  role=${profile.role}`);
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
    await getAdminDb().doc(`users/${firebaseUid}`).set(
      {
        firebase_uid: firebaseUid,
        supabase_profile_id: profile.id,
        fullName,
        email: userEmail,
        role: safeRole,
        germanLevel: germanLevel ?? null,
        createdAt: new Date(),
        emailVerified: false,
        disabled: false,
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
