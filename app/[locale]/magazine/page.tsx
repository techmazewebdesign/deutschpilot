import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { articles } from "@/lib/magazine";
import { Clock } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "magazine" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      types: {
        "application/rss+xml": `https://deutschpilot.de/${params.locale}/rss.xml`,
      },
    },
  };
}

export default async function MagazinePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const de = locale === "de";

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const t = await getTranslations({ locale, namespace: "magazine" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#E0B873] uppercase mb-4">
              {t("badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-5">
              {t("heading")}
            </h1>
            <p className="text-[#C9D2DE] max-w-xl mx-auto leading-relaxed">
              {t("intro")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/${locale}/magazine/${a.slug}`}
                className="group bg-[#0A1E35]/70 border border-white/10 rounded-2xl p-7 hover:border-[#E0B873]/40 transition-colors flex flex-col"
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {a.tags.map((t) => (
                    <span key={t} className="text-[10px] font-semibold uppercase tracking-wider text-[#E0B873]/70 bg-[#E0B873]/8 px-2 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#E0B873] transition-colors leading-snug">
                  {de ? a.title_de : a.title_en}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-5 flex-1">
                  {de ? a.description_de : a.description_en}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <time dateTime={a.date}>
                    {new Date(a.date + "T00:00:00").toLocaleDateString(de ? "de-DE" : "en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </time>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t("readingTime", { minutes: a.readingMinutes })}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-white/40 mb-4">
              {t("practiceCtaText")}
            </p>
            <Link
              href={`/${locale}/courses`}
              className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
            >
              {t("practiceCtaButton")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
