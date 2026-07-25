"use client";

import { signInWithPopup, type User } from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "@/lib/firebase";

export type GoogleSignInResult = {
  user: User;
  role: "student" | "teacher" | "admin";
};

/**
 * Sign in (or sign up, for a first-time Google user) via Google popup, then
 * establish the __session cookie and resolve the Supabase role.
 *
 * Deliberately does NOT call /api/auth/set-role — that route always writes
 * the role it's given, which would silently downgrade a returning
 * teacher/admin to "student". /api/auth/profile derives role from the
 * Firebase custom claim instead (defaulting to "student" only when no
 * claim exists yet, i.e. a brand-new account) and auto-creates the
 * Supabase profile row, so it's safe to call on every Google sign-in.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const cred = await signInWithPopup(firebaseAuth, googleAuthProvider);
  const user = cred.user;

  const idToken = await user.getIdToken();

  const sessionRes = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!sessionRes.ok) {
    throw new Error("session-failed");
  }

  const profileRes = await fetch("/api/auth/profile", {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!profileRes.ok) {
    throw new Error("profile-failed");
  }
  const { profile } = (await profileRes.json()) as {
    profile: { role: "student" | "teacher" | "admin" };
  };

  // Refresh the token so the custom-claims role is current for later calls.
  await user.getIdToken(true);

  return { user, role: profile.role };
}

export function googleAuthErrorMessage(code: string, de: boolean): string | null {
  // Returning null means "not an error worth showing" (e.g. user closed the popup).
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return null;
  }
  const map: Record<string, [string, string]> = {
    "auth/popup-blocked": [
      "Das Google-Popup wurde blockiert. Bitte Popups für diese Seite erlauben.",
      "The Google popup was blocked. Please allow popups for this site.",
    ],
    "auth/account-exists-with-different-credential": [
      "Diese E-Mail ist bereits mit einem Passwort registriert. Bitte melde dich mit E-Mail und Passwort an.",
      "This email is already registered with a password. Please sign in with email and password instead.",
    ],
    "auth/unauthorized-domain": [
      "Diese Domain ist für Google-Anmeldung nicht freigegeben.",
      "This domain isn't authorized for Google sign-in.",
    ],
  };
  const entry = map[code];
  if (entry) return de ? entry[0] : entry[1];
  return de ? "Anmeldung mit Google fehlgeschlagen." : "Google sign-in failed.";
}
