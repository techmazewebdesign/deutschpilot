import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export default function TermsPage({ params }: { params: { locale: string } }) {
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
          <h1 className="text-4xl font-serif font-bold text-white mb-8">{isDE ? "Allgemeine Geschäftsbedingungen" : "Terms of Service"}</h1>
          <div className="space-y-6 text-[#C9D2DE]">
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "1. Geltungsbereich" : "1. Scope"}</h2>
              <p className="leading-relaxed">
                {isDE
                  ? "Diese AGB gelten für alle Verträge zwischen DeutschPilot GmbH und seinen Kunden über die Nutzung der Lernplattform und zugehöriger Dienstleistungen."
                  : "These Terms of Service apply to all contracts between DeutschPilot GmbH and its customers regarding the use of the learning platform and related services."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "2. Leistungsumfang" : "2. Scope of Services"}</h2>
              <p className="leading-relaxed">
                {isDE
                  ? "DeutschPilot bietet Online-Sprachkurse, Retreats und Community-Funktionen an. Die genauen Leistungen ergeben sich aus dem jeweiligen Kursangebot."
                  : "DeutschPilot offers online language courses, retreats, and community features. The exact services are defined in the respective course offerings."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "3. Kontakt" : "3. Contact"}</h2>
              <p>info@deutschpilot.de</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
