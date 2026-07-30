"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { GoogleSigninButton } from "@/components/auth/google-signin-button";

interface Props {
  locale: string;
  loginLabel: string;
  forgotPasswordLabel: string;
  passwordLabel: string;
  emailLabel: string;
}

export function SigninFormClient({
  locale,
  loginLabel,
  forgotPasswordLabel,
  passwordLabel,
  emailLabel,
}: Props) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CEA66F]/50 focus:bg-white/8 transition-all";

  function firebaseError(code: string): string {
    const map: Record<string, string> = {
      "auth/invalid-credential": t("errorInvalidCredentials"),
      "auth/wrong-password": t("errorInvalidCredentials"),
      "auth/user-not-found": t("errorUserNotFound"),
      "auth/user-disabled": t("errorUserDisabled"),
      "auth/too-many-requests": t("errorTooManyRequests"),
      "auth/invalid-email": t("errorInvalidEmail"),
    };
    return map[code] ?? t("errorInvalidCredentials");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = cred.user;

      if (!user.emailVerified) {
        router.push(`/${locale}/verify-email`);
        return;
      }

      const tokenResult = await user.getIdTokenResult(true);
      const idToken = await user.getIdToken();
      const detectedRole = (tokenResult.claims.role as string) ?? "student";

      if (process.env.NODE_ENV === "development") {
        console.log("[signin] Detected role:", detectedRole);
      }

      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionRes.ok) {
        setError(t("sessionCreateFailed"));
        return;
      }

      // Redirect based on role
      const dest =
        detectedRole === "admin" ? `/${locale}/admin` :
        detectedRole === "teacher" ? `/${locale}/teacher` :
        `/${locale}/rooms`;

      if (process.env.NODE_ENV === "development") {
        console.log("[signin] Redirect target:", dest);
      }

      router.push(dest);
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(firebaseError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <div>
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
          {emailLabel}
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

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
            {passwordLabel}
          </label>
          <Link href={`/${locale}/forgot-password`} className="text-xs text-[#CEA66F] hover:underline">
            {forgotPasswordLabel}
          </Link>
        </div>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D9B173] text-[#071424] font-semibold py-3 rounded-md hover:bg-[#B98A4E] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t("signingIn") : loginLabel}
      </button>
    </form>

    <GoogleSigninButton locale={locale} variant="signin" />
    </>
  );
}
