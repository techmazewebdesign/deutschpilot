"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const t = useTranslations("cta");
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  return (
    <section className="py-20 bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              {t("title")}
            </h2>
            <p className="text-white/50 mb-8">{t("subtitle")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/signup` as any}>
                <Button size="lg" className="bg-gold text-navy-900 hover:bg-gold/90 font-semibold">
                  {t("cta1")}
                </Button>
              </Link>
              <Link href={`/${locale}/placement-test` as any}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {t("cta2")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
