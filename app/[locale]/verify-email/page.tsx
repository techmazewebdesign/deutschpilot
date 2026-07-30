"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export default function VerifyEmailPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations("auth");
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Signup redirects here with ?sent=0 when its sendEmailVerification call
    // failed — warn instead of claiming an email is on its way.
    // (window.location instead of useSearchParams: avoids the Suspense
    // requirement during static prerender of this client page.)
    if (new URLSearchParams(window.location.search).get("sent") === "0") {
      setError(t("resendEmailFailedNotice"));
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        router.push(`/${locale}/signin`);
        return;
      }
      setUserEmail(user.email);

      if (user.emailVerified) {
        await handleVerifiedUser();
        return;
      }

      intervalRef.current = setInterval(async () => {
        try {
          await user.reload();
          if (firebaseAuth.currentUser?.emailVerified) {
            clearInterval(intervalRef.current!);
            await handleVerifiedUser();
          }
        } catch {
          /* ignore */
        }
      }, 3000);
    });

    return () => {
      unsubscribe();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleVerifiedUser() {
    const user = firebaseAuth.currentUser;
    if (!user) return;
    setVerified(true);

    // Force-refresh token to pick up custom claims set during signup
    const tokenResult = await user.getIdTokenResult(true);
    const idToken = await user.getIdToken();
    const role = (tokenResult.claims.role as string) ?? "student";

    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const dest =
      role === "admin" ? `/${locale}/admin` :
      role === "teacher" ? `/${locale}/teacher` :
      `/${locale}/rooms`;

    setTimeout(() => router.push(dest), 1800);
  }

  async function handleResend() {
    const user = firebaseAuth.currentUser;
    if (!user || resendCooldown > 0) return;
    setError(null);
    setResending(true);
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/${locale}/verify-email`,
      });
      setResendCooldown(60);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((s) => {
          if (s <= 1) { clearInterval(cooldownRef.current!); return 0; }
          return s - 1;
        });
      }, 1000);
    } catch {
      setError(t("couldNotSendEmail"));
    } finally {
      setResending(false);
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-[#071424] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-5 inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-400/10 border border-green-400/30">
            <span className="text-green-400 text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            {t("emailVerifiedTitle")}
          </h1>
          <p className="text-[#C9D2DE] text-sm">
            {t("emailVerifiedRedirecting")}
          </p>
        </div>
      </div>
    );
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

        <div className="text-center mb-8">
          <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#CEA66F]/10 border border-[#CEA66F]/30">
            <span className="text-[#CEA66F] text-2xl">✉</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            {t("checkYourEmailTitle")}
          </h1>
          <p className="text-[#C9D2DE] text-sm leading-relaxed">
            {t("verificationSentBody", { email: userEmail ?? t("yourEmailFallback") })}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 mb-4 text-center">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2 justify-center mb-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#CEA66F] animate-pulse" />
          <p className="text-xs text-white/40">
            {t("waitingForVerification")}
          </p>
        </div>

        <div className="mt-6 space-y-3 text-center">
          <button
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
            className="text-sm text-[#CEA66F] hover:underline disabled:opacity-40 disabled:no-underline"
          >
            {resendCooldown > 0
              ? t("resendIn", { seconds: resendCooldown })
              : resending
              ? t("sending")
              : t("resendLink")}
          </button>
          <p className="text-xs text-white/25">
            <Link href={`/${locale}/signup`} className="hover:text-white/40 transition-colors">
              ← {t("backToSignup")}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-10">
          © {new Date().getFullYear()} DeutschPilot
        </p>
      </div>
    </div>
  );
}
