import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "seo" });
  return { title: t("termsTitle") };
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-white mb-8">{t("heading")}</h1>
          <div className="space-y-6 text-[#C9D2DE]">
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section1.heading")}</h2>
              <p className="leading-relaxed">
                {t("section1.body")}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section2.heading")}</h2>
              <p className="leading-relaxed">
                {t("section2.body")}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section3.heading")}</h2>
              <p className="leading-relaxed">
                {t("section3.body")}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section4.heading")}</h2>
              <p>info@deutschpilot.de</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
