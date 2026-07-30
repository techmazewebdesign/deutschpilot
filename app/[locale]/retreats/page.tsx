import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { MapPin, Users, Calendar, Leaf } from "lucide-react";
import { RetreatWaitlistForm } from "@/components/retreats/waitlist-form";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "seo" });
  return {
    title: t("retreatsTitle"),
    description: t("retreatsDescription"),
  };
}

export default async function RetreatsPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "retreatsPage" });

  const features = [
    { icon: <MapPin className="h-5 w-5 text-[#E0B873]" />, key: "environment" },
    { icon: <Calendar className="h-5 w-5 text-[#E0B873]" />, key: "program" },
    { icon: <Users className="h-5 w-5 text-[#E0B873]" />, key: "groups" },
    { icon: <Leaf className="h-5 w-5 text-[#E0B873]" />, key: "relaxation" },
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
            {features.map((f) => (
              <div key={f.key} className="bg-[#0A1E35]/70 border border-white/10 rounded-2xl p-5 flex gap-4">
                <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{t(`features.${f.key}.title`)}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{t(`features.${f.key}.body`)}</p>
                </div>
              </div>
            ))}
          </div>

          <RetreatWaitlistForm locale={locale} />
        </section>
      </main>
      <Footer />
    </>
  );
}
