/**
 * POST /api/admin/promote
 * Body: { email: string, secret: string }
 *
 * One-time bootstrap route: promotes an existing Firebase user to
 * admin (sets the custom claim AND syncs the Supabase profile role).
 * Protected by ADMIN_PROMOTE_SECRET since no admin necessarily exists
 * yet to gate this normally (chicken-and-egg bootstrap problem).
 *
 * The user must already have signed up (this does not create
 * accounts) — if no Firebase user exists for that email, it returns
 * a clear 404 rather than creating one.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { findOrCreateProfile } from "@/lib/profileHelper";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_PROMOTE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "ADMIN_PROMOTE_SECRET not configured." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, secret: providedSecret } = body as { email?: string; secret?: string };

  if (providedSecret !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!email) {
    return NextResponse.json({ error: "Missing email." }, { status: 400 });
  }

  let firebaseUser;
  try {
    firebaseUser = await getAdminAuth().getUserByEmail(email);
  } catch {
    return NextResponse.json(
      { error: `No account found for ${email}. They need to sign up first — this route cannot create accounts.` },
      { status: 404 }
    );
  }

  await getAdminAuth().setCustomUserClaims(firebaseUser.uid, { role: "admin" });

  const profile = await findOrCreateProfile({
    firebaseUid: firebaseUser.uid,
    email,
    fullName: firebaseUser.displayName || email.split("@")[0],
    role: "admin",
  });

  return NextResponse.json({ ok: true, uid: firebaseUser.uid, supabaseId: profile.id, role: "admin" });
}
