import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { sendWelcomeEmail } from "@/lib/email";

const SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    }

    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    // Send welcome email on first verified session (fire-and-forget)
    try {
      const decoded = await getAdminAuth().verifyIdToken(idToken);
      if (decoded.email_verified) {
        const userDoc = await getAdminDb().doc(`users/${decoded.uid}`).get();
        const data = userDoc.data();
        if (data && !data.welcomeEmailSent && decoded.email) {
          // Mark first so concurrent requests don't double-send
          await getAdminDb().doc(`users/${decoded.uid}`).update({ welcomeEmailSent: true });
          sendWelcomeEmail({
            to: decoded.email,
            name: data.fullName ?? decoded.name ?? decoded.email.split("@")[0],
          }).catch(() => {/* non-blocking */});
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
