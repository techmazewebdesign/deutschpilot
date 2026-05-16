"use client";

import { useTranslations } from "next-intl";
import { Rocket, Video, Bot, Users, Award, MapPin } from "lucide-react";

const featureItems = [
  { key: "intensive", icon: Rocket },
  { key: "live", icon: Video },
  { key: "ai", icon: Bot },
  { key: "community", icon: Users },
  { key: "certificate", icon: Award },
  { key: "retreats", icon: MapPin },
];

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="py-20 bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featureItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex flex-col items-center text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/5 group-hover:bg-gold/10 transition-colors">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {t(`items.${item.key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
