import { NextResponse } from "next/server";

/**
 * Password reset is handled entirely by Firebase Auth.
 * The forgot-password page calls sendPasswordResetEmail(firebaseAuth, email)
 * which sends the reset link directly via Firebase.
 * This route is no longer used.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Password reset is handled by Firebase Auth." },
    { status: 410 }
  );
}
