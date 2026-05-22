"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Clock,
  ShoppingBag,
  MapPin,
  Stethoscope,
  Lock,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

const ROOMS = [
  {
    id: 1,
    icon: Users,
    title: "Greetings & Introductions",
    lessons: 8,
    desc: "Make first contacts, introduce yourself, greet others.",
    unlocked: true,
    progress: 18,
  },
  {
    id: 2,
    icon: Clock,
    title: "Numbers, Time & Dates",
    lessons: 7,
    desc: "Numbers, clock time, dates, and days of the week.",
    unlocked: true,
    progress: 0,
  },
  {
    id: 3,
    icon: Users,
    title: "Family & Personal Life",
    lessons: 8,
    desc: "Describe family, share hobbies and personal information.",
    unlocked: false,
    progress: 0,
  },
  {
    id: 4,
    icon: ShoppingBag,
    title: "Shopping & Daily Needs",
    lessons: 7,
    desc: "At the supermarket, understand prices, ask for products.",
    unlocked: false,
    progress: 0,
  },
  {
    id: 5,
    icon: MapPin,
    title: "City, Transport & Directions",
    lessons: 8,
    desc: "Navigate the city, use public transport, ask for directions.",
    unlocked: false,
    progress: 0,
  },
  {
    id: 6,
    icon: Stethoscope,
    title: "Doctor, Office & Real Life",
    lessons: 8,
    desc: "Communicate at the doctor, office and everyday situations.",
    unlocked: false,
    progress: 0,
  },
];

export function RoomShowcaseSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[#CEA66F]/70 uppercase tracking-[0.2em]">A1 Level</span>
              <span className="text-[10px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">6 Rooms</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-2">
              Your First Learning Rooms
            </h2>
            <p className="text-white/45 max-w-xl">
              Each room is a complete learning environment with lessons, interactive exercises, and a checkpoint quiz.
            </p>
          </div>
          <Link
            href={`/${locale}/rooms`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#CEA66F] hover:text-[#D9B173] transition-colors flex-shrink-0"
          >
            View all rooms <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Room cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROOMS.map((room) => {
            const Icon = room.icon;
            return (
              <div
                key={room.id}
                className={`relative overflow-hidden rounded-2xl border transition-all flex flex-col ${
                  room.unlocked
                    ? "bg-[#0A1E35]/60 border-white/10 backdrop-blur-sm hover:border-[#CEA66F]/20"
                    : "bg-[#0A1E35]/30 border-white/5 opacity-55"
                }`}
              >
                {/* Room number tag */}
                <div className="absolute top-4 right-4">
                  <span className="text-[9px] font-bold text-white/20 bg-white/5 px-1.5 py-0.5 rounded">
                    Room {room.id}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {/* Icon */}
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${
                      room.unlocked
                        ? "bg-[#CEA66F]/12 border border-[#CEA66F]/20"
                        : "bg-white/5 border border-white/8"
                    }`}
                  >
                    {room.unlocked ? (
                      <Icon className="h-5 w-5 text-[#CEA66F]" />
                    ) : (
                      <Lock className="h-5 w-5 text-white/25" />
                    )}
                  </div>

                  <h3 className={`font-semibold text-sm leading-snug mb-1.5 ${room.unlocked ? "text-white" : "text-white/35"}`}>
                    {room.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed flex-1 mb-4">
                    {room.desc}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-xs text-white/35">
                      <BookOpen className="h-3 w-3" />
                      <span>{room.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {room.unlocked ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-[#CEA66F]/60" />
                          <span className="text-[#CEA66F]/60">A1.{room.id} — Open</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 text-white/20" />
                          <span className="text-white/20">Locked</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5">
                      <span>Progress</span>
                      <span>{room.progress}%</span>
                    </div>
                    <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#CEA66F] to-[#C99B50] rounded-full transition-all"
                        style={{ width: `${room.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  {room.unlocked ? (
                    <Link
                      href={`/${locale}/courses`}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#CEA66F]/10 border border-[#CEA66F]/20 text-[#CEA66F] text-xs font-semibold hover:bg-[#CEA66F]/20 transition-colors"
                    >
                      Enter Room <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white/3 border border-white/8 text-white/25 text-xs font-medium">
                      <Lock className="h-3.5 w-3.5" />
                      Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
