import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    alternates: pageAlternates(params.locale, "/privacy"),
    title: de ? "Datenschutz | DeutschPilot" : "Privacy Policy | DeutschPilot",
    description: de
      ? "Datenschutzhinweise von DeutschPilot zu Konten, Lernfortschritt, Zahlungen, Hosting, Speicherdauer und Betroffenenrechten."
      : "DeutschPilot privacy information covering accounts, learning progress, payments, hosting, retention, and data-subject rights.",
  };
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
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
              <p>PLUCO GROUP SP. Z O.O.<br />Ksawerów 3, 02-656 Warsaw, Poland<br />info@deutschpilot.de</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "3. Ihre Rechte" : "3. Your Rights"}</h2>
              <p className="leading-relaxed">
                {isDE
                  ? "Sie haben – soweit anwendbar – das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Zur Ausübung Ihrer Rechte schreiben Sie an info@deutschpilot.de. Außerdem können Sie sich bei einer zuständigen Aufsichtsbehörde beschweren."
                  : "Where applicable, you have the right to access, correct, delete, restrict, port, and object to the processing of your personal data. You may withdraw consent at any time for the future. To exercise a right, email info@deutschpilot.de. You may also complain to a competent supervisory authority."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "4. Konto, Lernen und Abonnement" : "4. Account, learning and subscription"}</h2>
              <p className="leading-relaxed">{isDE
                ? "Wir verarbeiten Konto- und Anmeldedaten, Lernfortschritt, gewählte Inhalte sowie Abonnementstatus zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Firebase verarbeitet die Identität; Supabase speichert Lern- und serverseitig bestätigte Berechtigungsdaten. Clientseitige Angaben allein schalten keinen kostenpflichtigen Zugang frei."
                : "We process account and sign-in data, learning progress, selected content and subscription status to perform the contract (GDPR Art. 6(1)(b)). Firebase handles identity; Supabase stores learning data and server-confirmed entitlements. Client-side claims alone never unlock paid access."}</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "5. Zahlung und Rechnungen" : "5. Payments and invoices"}</h2>
              <p className="leading-relaxed">{isDE
                ? "Zahlungen, wiederkehrende Abrechnung, Rechnungen und das Abrechnungsportal werden durch Stripe verarbeitet. Wir erhalten insbesondere Kunden-, Abonnement-, Zahlungsstatus-, Rechnungs- und Steuerdaten, jedoch keine vollständigen Kartendaten. Rechtsgrundlagen sind Vertragserfüllung sowie handels- und steuerrechtliche Pflichten (Art. 6 Abs. 1 lit. b und c DSGVO)."
                : "Stripe processes payments, recurring billing, invoices and the billing portal. We receive customer, subscription, payment-status, invoice and tax data, but not full card details. Legal bases are contract performance and accounting/tax obligations (GDPR Art. 6(1)(b) and (c))."}</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "6. Hosting, E-Mail und Übermittlungen" : "6. Hosting, email and transfers"}</h2>
              <p className="leading-relaxed">{isDE
                ? "Vercel stellt die Webanwendung bereit; der konfigurierte E-Mail-Anbieter versendet Vertrags-, Zahlungs- und Sicherheitsnachrichten. Soweit Anbieter Daten außerhalb des EWR verarbeiten, werden die nach DSGVO erforderlichen Übermittlungsmechanismen eingesetzt. Technische Protokolle werden zur Sicherheit und Fehleranalyse auf Grundlage berechtigter Interessen verarbeitet (Art. 6 Abs. 1 lit. f DSGVO)."
                : "Vercel hosts the web application; the configured email provider sends contractual, payment and security messages. Where providers process data outside the EEA, required GDPR transfer mechanisms are used. Technical logs are processed for security and troubleshooting based on legitimate interests (GDPR Art. 6(1)(f))."}</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "7. Speicherdauer und Kontakt" : "7. Retention and contact"}</h2>
              <p className="leading-relaxed">{isDE
                ? "Kontodaten werden grundsätzlich bis zur Löschung des Kontos oder Wegfall des Zwecks gespeichert. Vertrags-, Rechnungs- und Zahlungsnachweise werden für die gesetzlichen handels- und steuerrechtlichen Fristen aufbewahrt; Sicherheits- und Zustellnachweise nur so lange wie erforderlich. Anfragen zu Betroffenenrechten: info@deutschpilot.de. Es besteht ein Beschwerderecht bei der zuständigen Datenschutzaufsicht, insbesondere der polnischen UODO."
                : "Account data is generally retained until account deletion or the purpose ends. Contract, invoice and payment evidence is retained for statutory accounting and tax periods; security and delivery evidence only as long as necessary. Data-subject requests: info@deutschpilot.de. You may complain to the competent supervisory authority, including Poland's UODO."}</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "8. Cookies, lokale Speicherung und Analyse" : "8. Cookies, local storage and analytics"}</h2>
              <p className="leading-relaxed">{isDE
                ? "Wir verwenden notwendige Sitzungs- und Sicherheitsspeicher für Anmeldung, Sprache, Lernfortschritt und Berechtigungen. Optionale Analyse- oder Marketingtechnologien dürfen nur nach einer entsprechenden Einwilligung aktiviert werden. Soweit in der laufenden Version kein Einwilligungsdialog für eine optionale Kategorie angezeigt wird, wird diese Kategorie nicht als aktiviert beschrieben. Browserdaten können in den Browsereinstellungen gelöscht werden; eine erteilte Einwilligung kann jederzeit für die Zukunft widerrufen werden."
                : "We use necessary session and security storage for sign-in, language, learning progress, and entitlements. Optional analytics or marketing technologies may be enabled only after the corresponding consent. If the current release does not present a consent control for an optional category, this notice does not claim that category is active. Browser data can be cleared in browser settings, and consent can be withdrawn for the future at any time."}</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "9. Sicherheit und Datenmanagement" : "9. Security and data management"}</h2>
              <p className="leading-relaxed">{isDE
                ? "Wir setzen angemessene technische und organisatorische Maßnahmen ein, darunter verschlüsselte Übertragung, Anbieter-gestützte Kontosicherheit, serverseitige Prüfung bezahlter Berechtigungen sowie rollenbezogene Zugriffe. Kein System ist absolut sicher. Verwenden Sie ein starkes, nur hier eingesetztes Passwort und übermitteln Sie keine besonderen Kategorien personenbezogener Daten, wenn eine Funktion dies nicht ausdrücklich vorsieht."
                : "We use reasonable technical and organisational measures, including encrypted transport, provider-managed account security, server-side verification of paid entitlements, and role-based access. No system is absolutely secure. Use a strong, unique password and do not submit special-category personal data unless a feature expressly calls for it."}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
