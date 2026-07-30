"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Flame, X } from "lucide-react";

const MILESTONES = [3, 7, 14, 30, 60, 100];

interface Props {
  streak: number;
  locale: string;
}

export function StreakBanner({ streak, locale }: Props) {
  const t = useTranslations("streakBanner");
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

  const emojis: Record<number, string> = {
    3: "🔥",
    7: "🏆",
    14: "⚡",
    30: "🌟",
    60: "💎",
    100: "🎯",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E0B873]/40 bg-gradient-to-r from-[#E0B873]/15 via-[#E0B873]/10 to-[#E0B873]/5 px-5 py-4 flex items-center gap-4">
      <div className="text-2xl flex-shrink-0">{emojis[milestone]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-[#E0B873]" />
          {t("title", { count: milestone })}
        </p>
        <p className="text-xs text-white/60 mt-0.5">
          {t(`messages.${milestone}`)}
        </p>
      </div>
      <button
        onClick={dismiss}
        className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
        aria-label={t("dismissAriaLabel")}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
