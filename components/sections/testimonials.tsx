"use client";

import { useTranslations } from "next-intl";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonialData = [
  {
    key: "maria",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    key: "jonas",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    key: "aylin",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

export function TestimonialsSection() {
  const t = useTranslations();

  return (
    <section className="py-20 bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-medium tracking-wider text-gold uppercase mb-2">
              {t("testimonials.subtitle")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {t("testimonials.title")}
            </h2>
          </div>
          <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-gold hover:text-gold/80 hover:bg-gold/10">
            {t("testimonials.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonialData.map((item, index) => (
            <div
              key={item.key}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-navy-800/50 hover:bg-navy-800 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors cursor-pointer">
                    <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {t(`testimonials.items.${item.key}.name`)}
                    </h4>
                    <p className="text-xs text-gold">
                      {t(`testimonials.items.${item.key}.result`)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  &ldquo;{t(`testimonials.items.${item.key}.text`)}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
