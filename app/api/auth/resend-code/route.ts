import { NextResponse } from "next/server";

/**
 * Email verification resend is handled entirely by Firebase Auth.
 * The verify-email page calls sendEmailVerification(firebaseAuth.currentUser)
 * directly via the Firebase SDK.
 * This route is no longer used.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Verification email resend is handled by Firebase Auth." },
    { status: 410 }
  );
}
