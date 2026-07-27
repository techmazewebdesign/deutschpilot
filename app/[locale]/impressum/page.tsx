import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export function generateMetadata(): Metadata {
  return { title: "Impressum | DeutschPilot", robots: { index: true, follow: true } };
}

export default function ImpressumPage({ params }: { params: { locale: string } }) {
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

  const isDE = locale === "de";

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-white mb-8">{isDE ? "Impressum" : "Imprint"}</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-[#C9D2DE]">
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "Angaben gemäß § 5 TMG" : "Information pursuant to § 5 TMG"}</h2>
              <p>
                PLUCO GROUP SP. Z O.O.<br />
                Ksawerów 3<br />
                02-656 Warsaw, Poland<br />
                {isDE ? "Handelsregister: KRS 0000564904" : "Commercial Register: KRS 0000564904"}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "Kontakt" : "Contact"}</h2>
              <p>E-Mail: info@deutschpilot.de</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
