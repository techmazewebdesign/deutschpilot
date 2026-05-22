import { NextResponse } from "next/server";

/**
 * Sign-up is handled entirely client-side via Firebase Auth SDK.
 * After createUserWithEmailAndPassword succeeds, the client calls:
 *   POST /api/auth/set-role  → sets custom claim + writes Firestore user doc
 *   Firebase sendEmailVerification → sends verification email
 * This route is no longer used and exists only for backwards-compatibility.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Sign-up is handled by Firebase Auth + /api/auth/set-role." },
    { status: 410 }
  );
}
