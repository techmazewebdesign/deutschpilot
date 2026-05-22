"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Target, CheckCircle2, Clock, Flame, ArrowRight } from "lucide-react";

const MISSIONS = [
  { label: "Complete 1 A1 Room lesson", done: false },
  { label: "Practice 5 new German phrases", done: false },
  { label: "Review yesterday's vocabulary", done: true },
  { label: "Speak with AI Trainer for 5 min", done: false },
];

export function DailyMissionSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  const completed = MISSIONS.filter((m) => m.done).length;
  const total = MISSIONS.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CEA66F]/30 bg-[#CEA66F]/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-[#CEA66F] uppercase mb-4">
              <Flame className="h-3 w-3" />
              Daily Streak
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
              Today's Mission
            </h2>
            <p className="text-white/45 max-w-md mb-8">
              Small, daily goals that compound into fluency. Complete your missions to keep your streak alive and earn progress toward your certificate.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-[#CEA66F]/10 border border-[#CEA66F]/20 flex items-center justify-center">
                <Flame className="h-5 w-5 text-[#CEA66F]" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">12 Day Streak</p>
                <p className="text-xs text-white/40">Keep it going to unlock bonus rewards</p>
              </div>
            </div>

            <Link
              href={`/${locale}/signup`}
              className="inline-flex items-center gap-2 bg-[#D9B173] text-[#071424] hover:bg-[#B98A4E] font-semibold rounded-md px-6 py-2.5 text-sm transition-colors"
            >
              Start Mission <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: Mission card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-[#CEA66F]/3 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0B1E35]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#CEA66F]/10 border border-[#CEA66F]/20 flex items-center justify-center">
                    <Target className="h-4 w-4 text-[#CEA66F]" />
                  </div>
                  <span className="text-sm font-semibold text-white">Daily Goals</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                  <Clock className="h-3 w-3" />
                  <span>Resets in 8h</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-[11px] text-white/40 mb-1.5">
                  <span>Mission Progress</span>
                  <span>{completed}/{total} completed</span>
                </div>
                <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#CEA66F] to-[#C99B50] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5">
                {MISSIONS.map((mission, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl p-3 border ${
                      mission.done
                        ? "bg-emerald-500/5 border-emerald-500/10"
                        : "bg-white/[0.02] border-white/6"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        mission.done
                          ? "bg-emerald-500/15 border border-emerald-500/30"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      {mission.done ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-white/20" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        mission.done ? "text-white/40 line-through" : "text-white/70"
                      }`}
                    >
                      {mission.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
