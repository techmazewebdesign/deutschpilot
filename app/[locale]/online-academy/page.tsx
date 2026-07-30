import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { Video, Bot, BookOpen, Award, Newspaper, ChevronRight, Car } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "seo" });
  return {
    title: t("academyTitle"),
    description: t("academyDescription"),
  };
}

export default async function OnlineAcademyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const t = await getTranslations({ locale, namespace: "onlineAcademy" });

  const pillars = [
    { icon: BookOpen, href: "/levels", key: "courses" },
    { icon: Video, href: "/classes", key: "liveClasses" },
    { icon: Bot, href: "/ai-trainer", key: "aiCompanion" },
    { icon: Award, href: "/mock-exam", key: "mockExams" },
    { icon: Newspaper, href: "/magazine", key: "magazine" },
    { icon: Car, href: "/driving-theory", key: "drivingTheory" },
  ] as const;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#E0B873] uppercase mb-4">
            {t("badge")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-5">
            {t("heading")}
          </h1>
          <p className="text-[#C9D2DE] max-w-xl mx-auto mb-14 leading-relaxed">
            {t("intro")}
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-14 text-left">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.key}
                  href={`/${locale}${p.href}`}
                  className="group bg-[#0A1E35]/70 border border-white/10 hover:border-[#E0B873]/30 rounded-2xl p-6 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="h-6 w-6 text-[#E0B873]" />
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#E0B873] transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{t(`pillars.${p.key}.title`)}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{t(`pillars.${p.key}.body`)}</p>
                </Link>
              );
            })}
          </div>

          <Link
            href={`/${locale}/signup`}
            className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
          >
            {t("ctaButton")}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
