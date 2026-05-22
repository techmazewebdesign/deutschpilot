import { NextResponse } from "next/server";

/**
 * Sign-in is handled entirely client-side via Firebase Auth SDK.
 * After signInWithEmailAndPassword succeeds, the client calls:
 *   POST /api/auth/session  → exchanges Firebase ID token for a session cookie
 * This route is no longer used and exists only for backwards-compatibility.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Sign-in is handled by Firebase Auth + /api/auth/session." },
    { status: 410 }
  );
}
