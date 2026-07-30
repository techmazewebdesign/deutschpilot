import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { Users, MessageSquare, Globe, CalendarDays, Mail } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "communityPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CommunityPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "communityPage" });

  const features = [
    { icon: MessageSquare, key: "languageExchange" },
    { icon: Users, key: "studyGroups" },
    { icon: CalendarDays, key: "liveEvents" },
    { icon: Globe, key: "internationalPerspectives" },
  ] as const;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">

        {/* Hero */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(224,184,115,0.07)_0%,_transparent_60%)]" />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#E0B873]/25 bg-[#E0B873]/8">
              <Users className="h-3.5 w-3.5 text-[#E0B873]" />
              <span className="text-xs font-semibold text-[#E0B873] uppercase tracking-widest">
                {t("badge")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              {t("heroHeading")}
            </h1>
            <p className="text-[#C9D2DE] text-lg max-w-xl mx-auto leading-relaxed">
              {t("heroDescription")}
            </p>
          </div>
        </section>

        {/* What's coming */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em] mb-3">
              {t("expectLabel")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {t("expectHeading")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.key} className="bg-[#0A1E35]/70 border border-white/8 rounded-2xl p-6 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#E0B873]/12 border border-[#E0B873]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-[#E0B873]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {t(`features.${f.key}.title`)}
                    </h3>
                    <p className="text-xs text-white/45 leading-relaxed">
                      {t(`features.${f.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Coming soon CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-10 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(224,184,115,0.10)_0%,_transparent_60%)]" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E0B873]/12 border border-[#E0B873]/25 mb-6 mx-auto">
                <Mail className="h-6 w-6 text-[#E0B873]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-3">
                {t("launchingSoonHeading")}
              </h2>
              <p className="text-white/50 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                {t("launchingSoonBody")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:info@deutschpilot.de?subject=Community%20Interest"
                  className="inline-flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-semibold px-7 py-3 rounded-xl hover:bg-[#C99B50] transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  {t("expressInterest")}
                </a>
                <Link
                  href={`/${locale}/magazine`}
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-medium px-7 py-3 rounded-xl hover:border-white/30 hover:text-white transition-colors text-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("browseMagazine")}
                </Link>
              </div>
              <p className="mt-6 text-xs text-white/25">
                {t("reachUsDirectly")}
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
