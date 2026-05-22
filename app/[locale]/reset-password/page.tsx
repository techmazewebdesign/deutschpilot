"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const isDE = locale === "de";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputClass =
    "w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CEA66F]/50 transition-all";

  useEffect(() => {
    if (!token) {
      setError(
        isDE
          ? "Ungültiger oder fehlender Reset-Link."
          : "Invalid or missing reset link."
      );
    }
  }, [token, isDE]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(isDE ? "Passwörter stimmen nicht überein." : "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError(
        isDE
          ? "Das Passwort muss mindestens 8 Zeichen lang sein."
          : "Password must be at least 8 characters."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON */
      }
      if (!res.ok) {
        setError(data.error ?? (isDE ? "Fehler. Bitte erneut versuchen." : "Error. Please try again."));
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/signin`), 2500);
    } catch {
      setError(isDE ? "Etwas ist schiefgelaufen." : "Something went wrong.");
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

        {success ? (
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-400/10 border border-green-400/30">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white mb-2">
              {isDE ? "Passwort geändert!" : "Password updated!"}
            </h1>
            <p className="text-[#C9D2DE] text-sm">
              {isDE ? "Du wirst weitergeleitet…" : "Redirecting you…"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-white mb-2">
                {isDE ? "Neues Passwort" : "New password"}
              </h1>
              <p className="text-[#C9D2DE] text-sm">
                {isDE
                  ? "Gib dein neues Passwort ein."
                  : "Enter your new password below."}
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
                  {isDE ? "Neues Passwort" : "New password"}
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
                  {isDE ? "Passwort bestätigen" : "Confirm password"}
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-[#D9B173] text-[#071424] font-semibold py-3 rounded-md hover:bg-[#B98A4E] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? (isDE ? "Wird gespeichert…" : "Saving…")
                  : (isDE ? "Passwort speichern" : "Save password")}
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
