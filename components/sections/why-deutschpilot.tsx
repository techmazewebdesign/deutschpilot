"use client";

import { useTranslations } from "next-intl";
import { BookOpen, Brain, Headphones, Award, PenTool, Users } from "lucide-react";

const FACTS = [
  { icon: BookOpen, key: "rooms" },
  { icon: Headphones, key: "skills" },
  { icon: Brain, key: "aiFeedback" },
  { icon: Award, key: "unlock" },
  { icon: PenTool, key: "guides" },
  { icon: Users, key: "freeStart" },
] as const;

export function WhyDeutschPilotSection() {
  const t = useTranslations("whyDeutschPilot");

  return (
    <section className="bg-[#071424] py-20 lg:py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-2">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            {t("heading")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.key}
                className="rounded-2xl border border-white/8 bg-[#0A1E35]/50 p-6 hover:border-[#CEA66F]/25 transition-colors"
              >
                <div className="h-11 w-11 rounded-xl bg-[#CEA66F]/12 border border-[#CEA66F]/25 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#CEA66F]" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  {t(`facts.${fact.key}.title`)}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {t(`facts.${fact.key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
