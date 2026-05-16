"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Calendar, Home, Compass, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const retreatFeatures = [
  { key: "duration", icon: Calendar },
  { key: "accommodation", icon: Home },
  { key: "activities", icon: Compass },
  { key: "networking", icon: Users },
];

export function RetreatsSection() {
  const t = useTranslations("retreats");

  return (
    <section className="py-20 bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              alt="Mountain retreat"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 sm:p-12">
            <div>
              <p className="text-xs font-medium tracking-wider text-gold uppercase mb-4">
                Retreats
              </p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                {t("title").split(". ").map((line, i) => (
                  <span key={i} className="block">
                    {line}{i < 2 ? "." : ""}
                  </span>
                ))}
              </h2>
              <p className="text-white/60 mb-8 max-w-md">
                {t("subtitle")}
              </p>
              <Button className="bg-gold text-navy-900 hover:bg-gold/90 font-semibold">
                {t("cta")}
              </Button>
            </div>

            <div className="space-y-4">
              {retreatFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.key}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <span className="text-sm text-white/80">
                      {t(`features.${feature.key}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
