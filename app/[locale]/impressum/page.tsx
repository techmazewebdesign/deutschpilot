import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

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
              <p>DeutschPilot GmbH<br />Musterstraße 1<br />10115 Berlin<br />Deutschland</p>
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
