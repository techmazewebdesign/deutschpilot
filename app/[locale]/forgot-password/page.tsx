"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export default function ForgotPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isDE = locale === "de";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CEA66F]/50 transition-all";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#071424] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href={`/${locale}`} className="flex items-center gap-2 mb-10">
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
            <span className="text-[9px] tracking-[0.22em] text-[#CEA66F] uppercase mt-[2px]">Sprache. Zukunft. Du.</span>
          </div>
        </Link>

        {submitted ? (
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#CEA66F]/10 border border-[#CEA66F]/30">
              <span className="text-[#CEA66F] text-2xl">✉</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white mb-3">
              {isDE ? "E-Mail gesendet" : "Email sent"}
            </h1>
            <p className="text-[#C9D2DE] text-sm leading-relaxed">
              {isDE
                ? "Falls ein Konto mit dieser E-Mail existiert, haben wir einen Zurücksetz-Link gesendet. Bitte überprüfe deinen Posteingang."
                : "If an account with this email exists, we've sent a reset link. Please check your inbox."}
            </p>
            <Link
              href={`/${locale}/signin`}
              className="inline-block mt-6 text-sm text-[#CEA66F] hover:underline"
            >
              ← {isDE ? "Zurück zur Anmeldung" : "Back to sign in"}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-white mb-2">
                {isDE ? "Passwort vergessen?" : "Forgot password?"}
              </h1>
              <p className="text-[#C9D2DE] text-sm">
                {isDE
                  ? "Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum Zurücksetzen."
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  {isDE ? "E-Mail-Adresse" : "Email address"}
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="email@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D9B173] text-[#071424] font-semibold py-3 rounded-md hover:bg-[#B98A4E] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? (isDE ? "Wird gesendet…" : "Sending…")
                  : (isDE ? "Link senden" : "Send reset link")}
              </button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              <Link href={`/${locale}/signin`} className="text-[#CEA66F] hover:underline">
                ← {isDE ? "Zurück zur Anmeldung" : "Back to sign in"}
              </Link>
            </p>
          </>
        )}

        <p className="text-center text-xs text-white/30 mt-10">
          © {new Date().getFullYear()} DeutschPilot
        </p>
      </div>
    </div>
  );
}
