"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signInWithGoogle, googleAuthErrorMessage } from "@/lib/googleAuth";

interface Props {
  locale: string;
  variant?: "signin" | "signup";
}

function dashboardDest(locale: string, role: string): string {
  if (role === "admin") return `/${locale}/admin`;
  if (role === "teacher") return `/${locale}/teacher`;
  return `/${locale}/rooms`;
}

export function GoogleSigninButton({ locale, variant = "signin" }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();
  const de = locale === "de";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const { role } = await signInWithGoogle();
      router.push(dashboardDest(locale, role));
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      const msg = code ? googleAuthErrorMessage(code, de) : t("googleSigninFailed");
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30 uppercase tracking-wider">
          {t("or")}
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-[#1f1f1f] font-semibold py-3 rounded-md hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.92c1.7-1.57 2.68-3.88 2.68-6.64z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34C2.44 15.98 5.48 18 9 18z" />
          <path fill="#FBBC05" d="M3.97 10.72c-.18-.54-.28-1.11-.28-1.72s.1-1.18.28-1.72V4.94H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.06l3.01-2.34z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
        </svg>
        {loading
          ? t("connecting")
          : variant === "signup"
            ? t("continueWithGoogleSignup")
            : t("continueWithGoogleSignin")}
      </button>
    </div>
  );
}
