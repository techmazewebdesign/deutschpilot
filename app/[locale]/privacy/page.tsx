import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

export default function PrivacyPage({ params }: { params: { locale: string } }) {
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

  const isDE = locale === "de";

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-white mb-8">{isDE ? "Datenschutzerklärung" : "Privacy Policy"}</h1>
          <div className="space-y-6 text-[#C9D2DE]">
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "1. Datenschutz auf einen Blick" : "1. Privacy at a Glance"}</h2>
              <p className="leading-relaxed">
                {isDE
                  ? "Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und den Zweck der Verarbeitung von personenbezogenen Daten auf unserer Website auf."
                  : "This privacy policy informs you about the nature, scope, and purpose of the processing of personal data on our website."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "2. Verantwortliche Stelle" : "2. Responsible Party"}</h2>
              <p>DeutschPilot GmbH<br />info@deutschpilot.de</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "3. Ihre Rechte" : "3. Your Rights"}</h2>
              <p className="leading-relaxed">
                {isDE
                  ? "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten."
                  : "You have the right to access, correct, delete, and restrict the processing of your personal data."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
