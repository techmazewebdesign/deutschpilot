import { NextResponse } from "next/server";

/**
 * Password reset completion is handled entirely by Firebase Auth.
 * Firebase sends a reset link that points to the Firebase-hosted action handler.
 * This route is no longer used.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Password reset is handled by Firebase Auth." },
    { status: 410 }
  );
}
