"use client";

import { useTranslations } from "next-intl";
import { BarChart3, BookOpen, Trophy, Clock, TrendingUp, Award, Sparkles } from "lucide-react";

const STAT_META = [
  { labelKey: "statLessonsLabel", valueKey: "statLessonsValue", icon: BookOpen, color: "#CEA66F" },
  { labelKey: "statStreakLabel", valueKey: "statStreakValue", icon: Trophy, color: "#E0B873" },
  { labelKey: "statHoursLabel", valueKey: "statHoursValue", icon: Clock, color: "#84cc16" },
  { labelKey: "statRoomsLabel", valueKey: "statRoomsValue", icon: TrendingUp, color: "#22c55e" },
];

const ACTIVITY_META = [
  { textKey: "activity1Text", timeKey: "activity1Time", icon: CheckCircle },
  { textKey: "activity2Text", timeKey: "activity2Time", icon: Award },
  { textKey: "activity3Text", timeKey: "activity3Time", icon: Sparkles },
];

function CheckCircle(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

const WEEK_DAYS = [
  { dayKey: "dayMon", h: 2.5 },
  { dayKey: "dayTue", h: 3.0 },
  { dayKey: "dayWed", h: 1.5 },
  { dayKey: "dayThu", h: 4.0 },
  { dayKey: "dayFri", h: 2.0 },
  { dayKey: "daySat", h: 3.5 },
  { dayKey: "daySun", h: 1.8 },
];

export function DashboardPreviewSection() {
  const t = useTranslations("dashboardPreview");
  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#CEA66F]/70 uppercase tracking-[0.2em] mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_META.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.labelKey}
                className="bg-[#0A1E35]/50 border border-white/8 rounded-2xl p-5 hover:border-[#CEA66F]/15 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center border"
                    style={{ background: `${stat.color}15`, borderColor: `${stat.color}25` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs text-white/40">{t(stat.labelKey)}</span>
                </div>
                <p className="text-2xl font-bold text-white">{t(stat.valueKey)}</p>
              </div>
            );
          })}
        </div>

        {/* Activity + Progress */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Activity */}
          <div className="bg-[#0A1E35]/50 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-4 w-4 text-[#CEA66F]" />
              <h3 className="text-sm font-semibold text-white">{t("recentActivity")}</h3>
            </div>
            <div className="space-y-3">
              {ACTIVITY_META.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-3.5 w-3.5 text-[#CEA66F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 truncate">{t(activity.textKey)}</p>
                      <p className="text-[11px] text-white/30">{t(activity.timeKey)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-[#0A1E35]/50 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-4 w-4 text-[#CEA66F]" />
              <h3 className="text-sm font-semibold text-white">{t("weeklyLearning")}</h3>
            </div>
            <div className="flex items-end gap-2 h-32">
              {WEEK_DAYS.map((d) => (
                <div key={d.dayKey} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-white/5 rounded-t-md relative overflow-hidden" style={{ height: `${(d.h / 4.5) * 100}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#CEA66F]/30 to-[#CEA66F]/60" />
                  </div>
                  <span className="text-[10px] text-white/40">{t(d.dayKey)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
              <p className="text-[11px] text-white/40">{t("totalThisWeek")}</p>
              <p className="text-sm font-bold text-[#CEA66F]">{t("totalHours")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
