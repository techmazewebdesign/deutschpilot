"use client";

import { useTranslations } from "next-intl";
import { Award, Printer } from "lucide-react";

const LEVEL_NAMES: Record<string, { de: string; en: string }> = {
  A1: { de: "Anfänger", en: "Beginner" },
  A2: { de: "Grundlegende Kenntnisse", en: "Elementary" },
  B1: { de: "Mittelstufe", en: "Intermediate" },
  B2: { de: "Gehobene Mittelstufe", en: "Upper Intermediate" },
  C1: { de: "Fortgeschritten", en: "Advanced" },
};

export function CertificateCard({ level, userName, locale }: { level: string; userName: string; locale: string }) {
  const t = useTranslations("certificates");
  const de = locale === "de";
  const today = new Date().toLocaleDateString(de ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl border-2 border-[#E0B873]/30 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-8 text-center relative overflow-hidden print:border-black print:bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(224,184,115,0.08)_0%,_transparent_60%)] print:hidden" />
      <div className="relative">
        <Award className="h-10 w-10 text-[#E0B873] mx-auto mb-4 print:text-black" />
        <p className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.25em] mb-4 print:text-black">
          {t("certificateOfCompletion")}
        </p>
        <p className="text-sm text-white/50 mb-1 print:text-black">
          {t("awardedTo")}
        </p>
        <h2 className="text-2xl font-serif font-bold text-white mb-4 print:text-black">{userName}</h2>
        <p className="text-sm text-white/60 mb-6 leading-relaxed print:text-black">
          {t("completingLevel")}
          {" "}
          <strong className="text-[#E0B873] print:text-black">{level} — {de ? LEVEL_NAMES[level]?.de : LEVEL_NAMES[level]?.en}</strong>
          {" "}
          ({t("cefrAbbreviation")})
        </p>
        <p className="text-xs text-white/30 mb-6 print:text-black">{today} · DeutschPilot</p>
        <button
          onClick={() => window.print()}
          className="print:hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-medium hover:border-white/30 hover:text-white transition-colors"
        >
          <Printer className="h-4 w-4" /> {t("printSavePdf")}
        </button>
      </div>
    </div>
  );
}
