"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Lock, CheckCircle2, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("hero");
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  return (
    <section className="relative overflow-hidden bg-[#071424]" style={{ minHeight: "calc(100svh - 4rem)" }}>
      {/* Full-section background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero_image.jpg"
          alt="DeutschPilot"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "60% center" }}
          className="scale-105"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/85 from-10% via-[#071424]/40 via-40% to-transparent to-70%" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071424] via-[#071424]/40 to-transparent z-10" />

      {/* Content */}
      <div
        className="relative z-20 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 flex items-center"
        style={{ minHeight: "calc(100svh - 4rem)", paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Left: Text */}
          <div className="max-w-xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CEA66F]/40 bg-[#CEA66F]/10 px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-[#CEA66F] uppercase">
                <Sparkles className="h-3 w-3" />
                {t("badge")}
              </span>
            </div>

            <h1 className="font-serif font-bold leading-[1.1] text-[#F5F1E8] mb-6"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
              Learn German.
              <span className="block text-[#CEA66F]">Your Path.</span>
              <span className="block">Your Future.</span>
            </h1>

            <p className="text-[#C9D2DE] mb-8 leading-relaxed max-w-md"
               style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link href={`/${locale}/signup`}>
                <Button
                  size="lg"
                  className="bg-[#D9B173] text-[#071424] hover:bg-[#B98A4E] font-semibold rounded-md px-7"
                >
                  Start Your Journey <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link href={`/${locale}/rooms`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#C9D2DE]/30 text-[#C9D2DE] hover:bg-white/5 hover:border-[#CEA66F]/50 rounded-md px-7"
                >
                  Explore A1 Rooms
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/40">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#CEA66F]" />
                <span>A1–C1 Levels</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#CEA66F]" />
                <span>AI Co-Pilot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#CEA66F]" />
                <span>Certificate</span>
              </div>
            </div>
          </div>

          {/* Right: Glass Cockpit Card */}
          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-md">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-[#CEA66F]/5 rounded-3xl blur-2xl" />

              <div className="relative bg-[#0B1B33]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#CEA66F]/15 flex items-center justify-center border border-[#CEA66F]/25">
                      <GraduationCap className="h-4 w-4 text-[#CEA66F]" />
                    </div>
                    <span className="text-sm font-semibold text-white">Your Learning Cockpit</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#CEA66F] bg-[#CEA66F]/10 px-2 py-0.5 rounded-full border border-[#CEA66F]/20">LIVE</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Current Level</p>
                    <p className="text-lg font-bold text-[#CEA66F]">A1</p>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Current Room</p>
                    <p className="text-sm font-semibold text-white truncate">Greetings &amp; Introductions</p>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#CEA66F] rounded-full" style={{ width: "18%" }} />
                      </div>
                      <span className="text-xs font-semibold text-[#CEA66F]">18%</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Next Lesson</p>
                    <p className="text-xs text-white/70 truncate">Introducing Yourself</p>
                  </div>
                </div>

                {/* AI Co-Pilot status */}
                <div className="flex items-center gap-3 bg-[#CEA66F]/8 border border-[#CEA66F]/15 rounded-xl p-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-[#CEA66F]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-[#CEA66F]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">AI Co-Pilot</p>
                    <p className="text-[11px] text-white/50">Ready to assist your learning</p>
                  </div>
                  <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Ready</span>
                </div>

                {/* Certificate path */}
                <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl p-3">
                  <div className="h-8 w-8 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white/60">Certificate Path</p>
                    <p className="text-[11px] text-white/35">Complete A1–C1 to unlock</p>
                  </div>
                  <Lock className="h-4 w-4 text-white/25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
