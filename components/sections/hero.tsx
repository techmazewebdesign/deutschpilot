"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("hero");
  const titleLines = t("title").split("\n");

  return (
    <section className="relative overflow-hidden bg-[#071424]" style={{ minHeight: "calc(100svh - 4rem)" }}>

      {/* === LAYER 1: Full-section background image === */}
      <div className="absolute inset-0">
        <Image
          src="/Images/hero_image.jpg"
          alt="DeutschPilot"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "60% center" }}
          className="scale-105"
        />
      </div>

      {/* === LAYER 2: Gradient overlays — reduced, image clearly visible === */}
      {/* Left-to-right: only enough to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/75 from-15% via-[#071424]/20 via-45% to-transparent to-75%" />
      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#071424] via-[#071424]/40 to-transparent z-10" />

      {/* === LAYER 3: Content === */}
      <div
        className="relative z-20 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 flex flex-col justify-center"
        style={{ minHeight: "calc(100svh - 4rem)", paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div className="max-w-xl animate-fade-in">

          {/* Badge */}
          <div className="mb-7">
            <span className="inline-block rounded-full border border-[#CEA66F]/40 bg-[#CEA66F]/10 px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-[#CEA66F] uppercase">
              {t("badge")}
            </span>
          </div>

          {/* Headline — last line in gold */}
          <h1 className="font-serif font-bold leading-[1.1] text-[#F5F1E8] mb-7"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}>
            {titleLines.map((line, i) => (
              <span
                key={i}
                className={`block ${i === titleLines.length - 1 ? "text-[#CEA66F]" : ""}`}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-[#C9D2DE] mb-9 leading-relaxed max-w-sm"
             style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}>
            {t("subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Button
              size="lg"
              className="bg-[#D9B173] text-[#071424] hover:bg-[#B98A4E] font-semibold rounded-md px-7"
            >
              {t("cta1")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#C9D2DE]/30 text-[#C9D2DE] hover:bg-white/5 hover:border-[#CEA66F]/50 rounded-md px-7"
            >
              {t("cta2")}
            </Button>
          </div>

          {/* Success story pill */}
          <div className="group cursor-pointer inline-flex">
            <div className="flex items-center gap-3 bg-[#0B1B33]/70 backdrop-blur-sm rounded-full pl-2 pr-5 py-2 border border-[#1B3150]/60 hover:border-[#CEA66F]/40 transition-colors">
              <div className="h-9 w-9 rounded-full bg-[#CEA66F]/25 flex items-center justify-center group-hover:bg-[#CEA66F]/35 transition-colors flex-shrink-0">
                <Play className="h-3.5 w-3.5 text-[#CEA66F] fill-[#CEA66F] ml-0.5" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#F5F1E8]">{t("success")}</p>
                <p className="text-[11px] text-[#C9D2DE]">Anna hat B2 in 3 Monaten erreicht</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
