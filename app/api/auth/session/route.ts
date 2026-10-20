import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { sendWelcomeEmail } from "@/lib/email";

const SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== new URL(req.url).origin) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    }

    const identity = await getAdminAuth().verifyIdToken(idToken, true);
    if (!identity.email_verified || Date.now() / 1000 - identity.auth_time > 300) {
      return NextResponse.json({ error: "Verify your email and sign in again." }, { status: 401 });
    }
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    // Send welcome email on first verified session (fire-and-forget)
    try {
      const decoded = identity;
      if (decoded.email_verified) {
        const userDoc = await getAdminDb().doc(`users/${decoded.uid}`).get();
        const data = userDoc.data();
        if (data && !data.welcomeEmailSent && decoded.email) {
          // Mark first so concurrent requests don't double-send
          await getAdminDb().doc(`users/${decoded.uid}`).update({ welcomeEmailSent: true });
          sendWelcomeEmail({
            to: decoded.email,
            name: data.fullName ?? decoded.name ?? decoded.email.split("@")[0],
          }).catch(() => {
            /* non-blocking */
          });
        }
      }
    } catch {
      /* Non-blocking — session still works if email fails */
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("__session", sessionCookie, {
      maxAge: SESSION_DURATION_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    console.error("[session/create]", err);
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("__session", "", { maxAge: 0, path: "/" });
  return response;
}
