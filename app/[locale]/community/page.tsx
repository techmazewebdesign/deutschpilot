import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

export default async function CommunityPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (PLACEHOLDER_LOCALES.includes(locale as any)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const t = await getTranslations({ locale, namespace: "community" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{t("subtitle")}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">{t("title")}</h1>
            <p className="text-[#C9D2DE] max-w-xl mx-auto">{t("description")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { key: "members", value: "3,800+", icon: "👥" },
              { key: "events", value: "240+", icon: "🎙️" },
              { key: "countries", value: "68", icon: "🌍" },
              { key: "exchange", value: "24/7", icon: "💬" },
            ].map((item) => (
              <div key={item.key} className="text-center bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold text-[#CEA66F] mb-1">{item.value}</div>
                <div className="text-sm text-white/60">{t(`features.${item.key}`)}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href={`/${locale}/signup` as any} className="inline-block bg-[#D9B173] text-[#071424] font-semibold px-8 py-3 rounded-md hover:bg-[#B98A4E] transition-colors">
              {t("cta")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
