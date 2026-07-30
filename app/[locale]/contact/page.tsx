import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { ContactFormClient } from "@/components/contact/contact-form-client";
import { isPlaceholderLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "seo" });
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
  };
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{t("subheading")}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white">{t("heading")}</h1>
          </div>

          <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-8">
            <ContactFormClient locale={locale} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
