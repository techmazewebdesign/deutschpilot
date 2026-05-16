"use client";

import { useTranslations } from "next-intl";
import { Users, MessageCircle, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { key: "members", icon: Users },
  { key: "events", icon: Calendar },
  { key: "countries", icon: Globe },
  { key: "exchange", icon: MessageCircle },
];

export function CommunitySection() {
  const t = useTranslations("community");

  return (
    <section className="py-24 md:py-32 bg-navy-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium tracking-wider text-gold uppercase mb-4">
              {t("subtitle")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              {t("title")}
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              {t("description")}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.key}
                    className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-navy-800/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40">
                        {t(`features.${feature.key}`)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button className="bg-gold text-navy-900 hover:bg-gold/90 font-semibold">
              {t("cta")}
            </Button>
          </div>

          <div className="relative rounded-2xl border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
            <div className="relative h-80 flex items-center justify-center">
              <div className="text-center">
                <Users className="h-16 w-16 text-gold mx-auto mb-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
