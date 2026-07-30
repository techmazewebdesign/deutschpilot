import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

const BASE_URL = "https://deutschpilot.de";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "seo" });
  return {
    title: t("faqTitle"),
    description: t("faqDescription"),
  };
}

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"] as const;

export default async function FaqPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "faq" });

  const faqs = FAQ_KEYS.map((key) => ({
    key,
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">FAQ</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
              {t("heading")}
            </h1>
            <p className="text-[#C9D2DE] text-base max-w-xl mx-auto">
              {t("intro")}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.key}
                className="group rounded-xl border border-white/10 bg-[#0B1B33]/50 open:border-[#CEA66F]/30 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 text-white font-medium">
                  {f.question}
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/30 transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-6 pb-5 text-sm text-[#C9D2DE] leading-relaxed">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-[#CEA66F]/25 bg-[#CEA66F]/8 text-center">
            <h2 className="text-lg font-serif font-bold text-white mb-1.5">
              {t("stillQuestions.heading")}
            </h2>
            <p className="text-sm text-white/50 mb-4">
              {t("stillQuestions.body")}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
            >
              {t("stillQuestions.button")} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
