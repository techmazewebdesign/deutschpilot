"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, BookOpen, Users, Award } from "lucide-react";

const journeySteps = [
  { key: "discover", icon: BookOpen },
  { key: "reserve", icon: CheckCircle2 },
  { key: "apply", icon: CheckCircle2 },
  { key: "learn", icon: Users },
  { key: "certify", icon: Award },
];

export function StudentJourneySection() {
  const t = useTranslations("studentJourney");

  return (
    <section className="py-24 md:py-32 bg-navy-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-wider text-gold uppercase mb-4">
            {t("subtitle")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            {t("title")}
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/20 to-transparent md:-translate-x-1/2" />

          <div className="space-y-12">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.key}
                  className={`relative flex items-center gap-8 animate-fade-in ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Icon circle */}
                  <div className="relative z-10 w-16 h-16 rounded-full border-2 border-gold/30 bg-navy-800 flex items-center justify-center flex-shrink-0 shadow-[0_8px_40px_rgba(201,169,97,0.08)]">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>

                  {/* Content card */}
                  <div
                    className={`flex-1 rounded-xl border border-white/10 bg-navy-800/50 p-6 hover:bg-navy-800 transition-colors ${
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t(`steps.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {t(`steps.${step.key}.desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
