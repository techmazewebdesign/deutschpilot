"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { schoolSignInUrl } from "@/lib/school/auth-return";

export function LearningRecovery({
  locale,
  reset,
  missingProfile = false,
}: {
  locale: string;
  reset?: () => void;
  missingProfile?: boolean;
}) {
  const de = locale === "de";
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <main className="min-h-screen bg-[#071424] px-6 py-16 text-white">
      <section
        className="mx-auto max-w-xl rounded-2xl border border-white/20 p-7"
        aria-labelledby="learning-recovery-title"
      >
        <h1
          ref={heading}
          tabIndex={-1}
          id="learning-recovery-title"
          className="text-2xl font-semibold focus:outline-none"
        >
          {de ? "Lernbereich derzeit nicht verfügbar" : "Learning area currently unavailable"}
        </h1>
        <p className="mt-4 text-slate-200" role="alert">
          {missingProfile
            ? de
              ? "Für dieses verifizierte Konto ist noch kein verknüpftes Lernprofil vorhanden. Bitte wenden Sie sich an den Support. Eine Schul-Einladung können Sie im Schulbereich annehmen."
              : "This verified account does not yet have a linked learning profile. Please contact support. You can accept a school invitation in the school workspace."
            : de
              ? "Ihre Lerndaten konnten nicht vollständig geladen oder geprüft werden. Fortschritt und Klassenzahlen werden deshalb nicht angezeigt. Bitte versuchen Sie es erneut oder wenden Sie sich an den Support."
              : "Your learning data could not be fully loaded or verified. Progress and class totals are therefore not displayed. Please retry or contact support."}
        </p>
        <p className="mt-4 text-slate-200">
          {de
            ? "Der Schulbereich prüft Ihren Zugang und Ihre Einladungen unabhängig vom Lern-Dashboard."
            : "The school workspace checks your access and invitations separately from the learning dashboard."}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-[#E0B873] px-4 py-3 font-semibold text-[#071424]"
            >
              {de ? "Erneut versuchen" : "Retry"}
            </button>
          )}
          <Link href={`/${locale}/school`} className="rounded-lg border border-white/40 px-4 py-3">
            {de ? "Zum Schulbereich" : "Open school workspace"}
          </Link>
          <Link
            href={schoolSignInUrl(locale)}
            className="rounded-lg border border-white/40 px-4 py-3"
          >
            {de ? "Erneut anmelden" : "Sign in again"}
          </Link>
        </div>
        <a className="mt-6 inline-block underline" href="mailto:support@desivo.de">
          {de ? "Support kontaktieren" : "Contact support"}
        </a>
      </section>
    </main>
  );
}

export default function LearningError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: string }>();
  return <LearningRecovery locale={params.locale} reset={reset} />;
}
