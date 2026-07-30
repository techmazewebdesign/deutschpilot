import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{t("subtitle")}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">{t("title")}</h1>
          </div>
          <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-8 sm:p-12 mb-10">
            <p className="text-[#C9D2DE] text-lg leading-relaxed">{t("body")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[["5+", t("stats.experience")], ["1200+", t("stats.students")], ["96%", t("stats.recommendation")]].map(([stat, label]) => (
              <div key={stat} className="text-center bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-[#CEA66F] mb-2">{stat}</div>
                <div className="text-sm text-white/60">{label}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href={`/${locale}/signup`} className="inline-block bg-[#D9B173] text-[#071424] font-semibold px-8 py-3 rounded-md hover:bg-[#B98A4E] transition-colors">
              {t("cta")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
