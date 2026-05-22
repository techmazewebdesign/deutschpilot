"use client";

import { useEffect, useState } from "react";
import { Flame, X } from "lucide-react";

const MILESTONES = [3, 7, 14, 30, 60, 100];

interface Props {
  streak: number;
  locale: string;
}

export function StreakBanner({ streak, locale }: Props) {
  const de = locale === "de";
  const [visible, setVisible] = useState(false);

  const milestone = MILESTONES.find((m) => m === streak);

  useEffect(() => {
    if (!milestone) return;
    const key = `streak_milestone_${milestone}_dismissed`;
    if (typeof window !== "undefined" && !localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [milestone]);

  function dismiss() {
    if (milestone) {
      localStorage.setItem(`streak_milestone_${milestone}_dismissed`, "1");
    }
    setVisible(false);
  }

  if (!visible || !milestone) return null;

  const messages: Record<number, { de: string; en: string; emoji: string }> = {
    3:   { de: "3 Tage in Folge! Du bist auf einem guten Weg.", en: "3 days in a row! You're building a great habit.", emoji: "🔥" },
    7:   { de: "Eine ganze Woche! Dein Streak ist beeindruckend.", en: "A full week! Your streak is impressive.", emoji: "🏆" },
    14:  { de: "14 Tage — zwei Wochen Disziplin. Fantastisch!", en: "14 days — two weeks of dedication. Fantastic!", emoji: "⚡" },
    30:  { de: "30 Tage! Ein ganzer Monat konsequentes Lernen.", en: "30 days! A full month of consistent learning.", emoji: "🌟" },
    60:  { de: "60 Tage! Du bist ein echtes Vorbild.", en: "60 days! You're a true role model.", emoji: "💎" },
    100: { de: "100 Tage Streak! Außergewöhnlich. Weiter so!", en: "100-day streak! Extraordinary. Keep going!", emoji: "🎯" },
  };

  const msg = messages[milestone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E0B873]/40 bg-gradient-to-r from-[#E0B873]/15 via-[#E0B873]/10 to-[#E0B873]/5 px-5 py-4 flex items-center gap-4">
      <div className="text-2xl flex-shrink-0">{msg.emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-[#E0B873]" />
          {milestone}{de ? "-Tage-Streak erreicht!" : "-day streak reached!"}
        </p>
        <p className="text-xs text-white/60 mt-0.5">
          {de ? msg.de : msg.en}
        </p>
      </div>
      <button
        onClick={dismiss}
        className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
