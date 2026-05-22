"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Lock, CheckCircle2, ChevronRight } from "lucide-react";

const LEVELS = [
  { key: "A1", name: "Beginner", active: true, color: "#22c55e", rooms: 6 },
  { key: "A2", name: "Elementary", active: true, color: "#84cc16", rooms: 6 },
  { key: "B1", name: "Intermediate", active: false, color: "#E0B873", rooms: 6 },
  { key: "B2", name: "Upper Intermediate", active: false, color: "#f97316", rooms: 6 },
  { key: "C1", name: "Advanced", active: false, color: "#a855f7", rooms: 6 },
];

export function LevelJourneySection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  return (
    <section className="bg-[#071424] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#CEA66F]/70 uppercase tracking-[0.2em] mb-3">
            Your Learning Path
          </p>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
            A Clear Roadmap from A1 to C1
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto">
            Structured levels with themed rooms, checkpoint quizzes, and real-world practice — every step is designed for measurable progress.
          </p>
        </div>

        {/* Journey Path */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-white/8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {LEVELS.map((level, i) => (
              <div key={level.key} className="relative flex flex-col items-center">
                {/* Level badge */}
                <div
                  className={`relative z-10 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 mb-4 transition-all ${
                    level.active
                      ? "shadow-lg"
                      : "opacity-50"
                  }`}
                  style={{
                    borderColor: level.active ? level.color : "rgba(255,255,255,0.1)",
                    background: level.active ? `${level.color}15` : "rgba(255,255,255,0.03)",
                  }}
                >
                  {level.active ? (
                    <>
                      <span className="text-lg font-black leading-none" style={{ color: level.color }}>
                        {level.key}
                      </span>
                      <Star className="h-2.5 w-2.5 mt-0.5" style={{ color: level.color }} />
                    </>
                  ) : (
                    <Lock className="h-5 w-5 text-white/25" />
                  )}
                </div>

                {/* Content card */}
                <div
                  className={`w-full rounded-xl border p-4 transition-all ${
                    level.active
                      ? "bg-[#0A1E35]/60 border-white/10 backdrop-blur-sm hover:border-[#CEA66F]/20"
                      : "bg-white/[0.02] border-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-white">{level.key}</h3>
                    <span className="text-xs text-white/50">· {level.name}</span>
                  </div>
                  <p className="text-xs text-white/35 mb-3">
                    {level.rooms} rooms with lessons, exercises &amp; quizzes
                  </p>
                  <div className="flex items-center gap-1 text-[11px]">
                    {level.active ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" style={{ color: level.color }} />
                        <span style={{ color: level.color }}>Available</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 text-white/25" />
                        <span className="text-white/25">Coming soon</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href={`/${locale}/levels`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#CEA66F] hover:text-[#D9B173] transition-colors"
          >
            Explore all levels <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
