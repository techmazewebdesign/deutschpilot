"use client";

import { BarChart3, BookOpen, Trophy, Clock, TrendingUp, Award, Sparkles } from "lucide-react";

const STATS = [
  { label: "Lessons Completed", value: "24", icon: BookOpen, color: "#CEA66F" },
  { label: "Current Streak", value: "12 days", icon: Trophy, color: "#E0B873" },
  { label: "Hours Learned", value: "18.5", icon: Clock, color: "#84cc16" },
  { label: "Rooms Cleared", value: "1 / 6", icon: TrendingUp, color: "#22c55e" },
];

const ACTIVITIES = [
  { text: "Completed 'Introducing Yourself' lesson", time: "2h ago", icon: CheckCircle },
  { text: "Earned A1.1 Checkpoint badge", time: "Yesterday", icon: Award },
  { text: "Practiced 10 phrases with AI Trainer", time: "Yesterday", icon: Sparkles },
];

function CheckCircle(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function DashboardPreviewSection() {
  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#CEA66F]/70 uppercase tracking-[0.2em] mb-3">
            Your Dashboard
          </p>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
            Track Every Step of Your Progress
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto">
            A clean, focused overview of your learning journey — stats, streaks, and next steps all in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#0A1E35]/50 border border-white/8 rounded-2xl p-5 hover:border-[#CEA66F]/15 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center border"
                    style={{ background: `${stat.color}15`, borderColor: `${stat.color}25` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs text-white/40">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
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
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {ACTIVITIES.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-3.5 w-3.5 text-[#CEA66F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 truncate">{activity.text}</p>
                      <p className="text-[11px] text-white/30">{activity.time}</p>
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
              <h3 className="text-sm font-semibold text-white">Weekly Learning</h3>
            </div>
            <div className="flex items-end gap-2 h-32">
              {[
                { day: "Mon", h: 2.5 },
                { day: "Tue", h: 3.0 },
                { day: "Wed", h: 1.5 },
                { day: "Thu", h: 4.0 },
                { day: "Fri", h: 2.0 },
                { day: "Sat", h: 3.5 },
                { day: "Sun", h: 1.8 },
              ].map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-white/5 rounded-t-md relative overflow-hidden" style={{ height: `${(d.h / 4.5) * 100}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#CEA66F]/30 to-[#CEA66F]/60" />
                  </div>
                  <span className="text-[10px] text-white/40">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
              <p className="text-[11px] text-white/40">Total this week</p>
              <p className="text-sm font-bold text-[#CEA66F]">18.3 hrs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
