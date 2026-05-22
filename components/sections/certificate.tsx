"use client";

import { Award, Lock, CheckCircle2, Star, Shield } from "lucide-react";

const REQUIREMENTS = [
  { label: "Complete all A1 Rooms", done: false },
  { label: "Pass A1 Checkpoint Quiz (≥60%)", done: false },
  { label: "Complete all A2 Rooms", done: false },
  { label: "Pass A2 Checkpoint Quiz (≥60%)", done: false },
  { label: "Finish B1–C1 Learning Path", done: false },
  { label: "Final C1 Assessment", done: false },
];

export function CertificateSection() {
  const doneCount = REQUIREMENTS.filter((r) => r.done).length;
  const total = REQUIREMENTS.length;

  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Certificate Card */}
          <div className="relative">
            <div className="absolute -inset-6 bg-[#CEA66F]/5 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-[#0B1E35] to-[#0A1628] border border-[#CEA66F]/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CEA66F]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-[#CEA66F]/10 border border-[#CEA66F]/25 flex items-center justify-center mb-5">
                  <Award className="h-8 w-8 text-[#CEA66F]" />
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-1">
                  DeutschPilot Certificate
                </h3>
                <p className="text-xs text-white/40 mb-6">Recognized CEFR Language Proficiency</p>

                <div className="w-full bg-white/5 border border-white/8 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/40">Level</span>
                    <span className="text-sm font-bold text-[#CEA66F]">C1 — Advanced</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/40">Status</span>
                    <span className="text-xs font-medium text-white/50 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Progress</span>
                    <span className="text-xs font-bold text-[#CEA66F]">{Math.round((doneCount / total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/6 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#CEA66F] to-[#C99B50] rounded-full"
                      style={{ width: `${(doneCount / total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                  <Shield className="h-3 w-3" />
                  <span>Blockchain-verified · Shareable · Professional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Requirements */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CEA66F]/30 bg-[#CEA66F]/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-[#CEA66F] uppercase mb-4">
              <Star className="h-3 w-3" />
              Certificate Path
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
              Earn a Recognized Certificate
            </h2>
            <p className="text-white/45 max-w-md mb-8">
              Complete the full A1–C1 learning path and pass each checkpoint quiz to unlock your official DeutschPilot CEFR certificate.
            </p>

            <div className="space-y-2.5">
              {REQUIREMENTS.map((req, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl p-3 border ${
                    req.done
                      ? "bg-emerald-500/5 border-emerald-500/10"
                      : "bg-white/[0.02] border-white/6"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      req.done
                        ? "bg-emerald-500/15 border border-emerald-500/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {req.done ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Lock className="h-3 w-3 text-white/25" />
                    )}
                  </div>
                  <span
                    className={`text-xs ${
                      req.done ? "text-white/40 line-through" : "text-white/70"
                    }`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
