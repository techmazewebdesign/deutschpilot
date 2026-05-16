"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

const steps = ["discover", "reserve", "apply", "start"];

export function HowItWorksSection() {
  const t = useTranslations("howItWorks");

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

        <div className="relative">
          {/* Gold connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="relative flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Circle with number */}
                <div className="relative z-10 w-16 h-16 rounded-full border-2 border-gold/30 bg-navy-800 flex items-center justify-center mb-6 shadow-[0_8px_40px_rgba(201,169,97,0.08)]">
                  <span className="text-xl font-bold text-gold font-mono">
                    {index + 1}
                  </span>
                </div>

                {/* Step content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {t(`steps.${step}.desc`)}
                </p>

                {/* Checkmark for completed steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-[calc(50%+2rem)] w-full h-px bg-gold/20 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
