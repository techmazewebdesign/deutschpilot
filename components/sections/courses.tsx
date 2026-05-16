"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const courseData = [
  { level: "A1", price: 299, image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80" },
  { level: "A2", price: 349, image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80" },
  { level: "B1", price: 399, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", popular: true },
  { level: "B2", price: 449, image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80" },
  { level: "C1", price: 499, image: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&q=80" },
];

export function CoursesSection() {
  const t = useTranslations();

  return (
    <section className="py-20 bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-medium tracking-wider text-gold uppercase mb-2">
              {t("courses.subtitle")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              {t("courses.title")}
            </h2>
          </div>
          <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-gold hover:text-gold/80 hover:bg-gold/10">
            {t("courses.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {courseData.map((course, index) => (
            <Card
              key={course.level}
              className={`relative overflow-hidden border-white/10 bg-navy-800/50 hover:bg-navy-800 transition-all group animate-fade-in ${
                course.popular ? "ring-1 ring-gold/50" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {course.popular && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gold text-navy-900 text-[10px] font-bold tracking-wider uppercase px-3">
                    {t("courses.popular")}
                  </Badge>
                </div>
              )}

              <div className="relative h-40 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-100 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundImage: `url(${course.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent" />
              </div>

              <CardContent className="p-5 relative">
                <div className="text-3xl font-bold text-white mb-1">{course.level}</div>
                <div className="text-sm text-white/60 mb-4">
                  {t(`courses.levels.${course.level}.label`)}
                </div>

                <ul className="space-y-2 mb-5">
                  <li className="flex items-center gap-2 text-xs text-white/50">
                    <Check className="h-3 w-3 text-gold" />
                    8 {t("courses.duration")}
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/50">
                    <Check className="h-3 w-3 text-gold" />
                    {t("courses.features.online")}
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/50">
                    <Check className="h-3 w-3 text-gold" />
                    {t("courses.features.certificate")}
                  </li>
                </ul>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/40">{t("courses.from")} </span>
                    <span className="text-lg font-bold text-white">{course.price} €</span>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-colors">
                    <ArrowRight className="h-4 w-4 text-white/60 group-hover:text-navy-900 transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="ghost" className="text-gold hover:text-gold/80">
            {t("courses.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
