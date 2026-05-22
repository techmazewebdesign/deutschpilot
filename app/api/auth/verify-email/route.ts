import { NextResponse } from "next/server";

/**
 * Email verification is handled entirely by Firebase Auth.
 * The verify-email page polls onAuthStateChanged + user.reload() to detect
 * when the user clicks the Firebase verification link, then calls
 * POST /api/auth/session to issue a session cookie.
 * This route is no longer used.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Email verification is handled by Firebase Auth." },
    { status: 410 }
  );
}
