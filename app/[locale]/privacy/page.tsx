import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { pageAlternates } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    alternates: pageAlternates(params.locale, "/privacy"),
    title: de ? "Datenschutz | DeutschPilot" : "Privacy Policy | DeutschPilot",
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
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="mb-8 font-serif text-4xl font-bold text-white">
            {isDE ? "Datenschutzerklärung" : "Privacy Policy"}
          </h1>
          <div className="space-y-6 text-[#C9D2DE]">
            <div className="rounded-xl border border-white/10 bg-[#0B1B33]/50 p-6">
              <h2 className="mb-3 font-semibold text-white">
                {isDE ? "1. Datenschutz auf einen Blick" : "1. Privacy at a Glance"}
              </h2>
              <p className="leading-relaxed">
                {isDE
                  ? "Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und den Zweck der Verarbeitung von personenbezogenen Daten auf unserer Website auf."
                  : "This privacy policy informs you about the nature, scope, and purpose of the processing of personal data on our website."}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0B1B33]/50 p-6">
              <h2 className="mb-3 font-semibold text-white">
                {isDE ? "2. Verantwortliche Stelle" : "2. Responsible Party"}
              </h2>
              <p>
                PLUCO GROUP SP. Z O.O.
                <br />
                Ksawerów 3, 02-656 Warsaw, Poland
                <br />
                info@deutschpilot.de
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0B1B33]/50 p-6">
              <h2 className="mb-3 font-semibold text-white">
                {isDE ? "3. Ihre Rechte" : "3. Your Rights"}
              </h2>
              <p className="leading-relaxed">
                {isDE
                  ? "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten."
                  : "You have the right to access, correct, delete, and restrict the processing of your personal data."}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0B1B33]/50 p-6">
              <h2 className="mb-3 font-semibold text-white">
                {isDE
                  ? "4. Schulbereich — nur nach Aktivierung durch Ihre Schule"
                  : "4. School workspace — only after activation by your school"}
              </h2>
              <div className="space-y-4 leading-relaxed">
                <Link href={`/${locale}/school`} className="inline-block text-[#E0B873] underline">
                  {isDE ? "Schulbereich öffnen" : "Open school workspace"}
                </Link>
                <p>
                  {isDE
                    ? "Wenn Ihre Schule einen Schulbereich aktiviert und Sie als Mitglied aufnimmt, werden Ihre Kontokennung, Ihr Name, Ihre E-Mail-Adresse, Ihre Schulrolle, Klassenzuweisungen, Anwesenheit, Abwesenheitsmeldungen und synchronisierte Übungsergebnisse für die Organisation des Unterrichts verarbeitet. Die verantwortliche Schule und ihr Datenschutzkontakt werden im Schulbereich angezeigt. Ihre Schule muss vor der Aktivierung die geltenden Rechtsgrundlagen, Aufbewahrungsfristen, Empfänger und erforderlichen Verträge festlegen und Ihnen ihre spezifischen Datenschutzinformationen bereitstellen."
                    : "If your school activates a workspace and admits you as a member, your account ID, name, email, school role, class assignments, attendance, absence reports and synchronised practice results are processed to organise teaching. The responsible school and its privacy contact are displayed in the workspace. Before activation, your school must determine applicable legal bases, retention periods, recipients and required agreements, and provide its specific privacy information."}
                </p>
                <p>
                  {isDE
                    ? "Lehrkräfte sehen die ihnen zugewiesenen Klassen und deren Lernfortschritte. Klassenchats sind für die jeweiligen Klassenmitglieder und alle zugewiesenen Lehrkräfte sichtbar; berechtigte Verwaltungsmitglieder können ebenfalls zugreifen und moderieren. Nachrichten bleiben auch bei einem Lehrkraftwechsel Teil des Klassenverlaufs. Bitte keine Diagnosen oder vertraulichen Nachweise im Chat teilen."
                    : "Teachers see their assigned classes and learning progress. Class conversations are visible to the relevant class members and all assigned teachers; authorised school managers and office staff can also access and moderate them. Messages remain part of the class history when teachers change. Do not share diagnoses or confidential evidence in chat."}
                </p>
                <p>
                  {isDE
                    ? "Private Dokumente und ärztliche Bescheinigungen sind nur für die betreffende lernende Person und berechtigte Verwaltungsmitglieder zugänglich. Dokumentenverarbeitung und gesundheitsbezogene Angaben bleiben gesperrt, solange die erforderliche Konfiguration fehlt. Dateien werden zunächst in Quarantäne gespeichert und erst nach einer serverseitigen Sicherheitsprüfung zum Download freigegeben. Beauftragte Speicher- und Prüfdienste verarbeiten die dafür erforderlichen Inhalte. Eine Jobcenter-Kategorie stellt keine Übermittlung an das Jobcenter dar. Empfangsbestätigungen und hochgeladene unterschriebene Kopien sind keine qualifizierten elektronischen Signaturen."
                    : "Private documents and medical certificates are accessible only to the student concerned and authorised school management or office staff. Document processing and health-related information remain blocked without the required configuration. Files are initially quarantined and become downloadable only after a server-side security check. Contracted storage and scanning services process the content necessary for that purpose. A Jobcenter category does not transmit anything to Jobcenter. Receipt acknowledgements and uploaded signed copies are not qualified electronic signatures."}
                </p>
                <p>
                  {isDE
                    ? "Die Schule dokumentiert eigene Aufbewahrungsfristen für Anwesenheit, Abwesenheiten, Schreiben, Mitteilungen, Lernfortschritte und Protokolle sowie für Dokumentkategorien und Chats. Nicht konfigurierte Fristen sind keine Freigabe einer Routinebereinigung. Gesetzte Aufbewahrungssperren verhindern die reguläre Dokumentenbereinigung. Kontosicherheit und Zugriffsprüfung verwenden Firebase; Schuldaten und private Dateien werden über den konfigurierten Supabase-Dienst verarbeitet. Bei ausdrücklich aktivierten mobilen Push-Mitteilungen werden nach Ihrer Gerätefreigabe ein Push-Token und allgemeine Benachrichtigungsdaten über den konfigurierten Push-Dienst verarbeitet. Benachrichtigungen enthalten keine Diagnosen oder Dokumentinhalte. Konkrete Anbieter, Speicherorte und gegebenenfalls Drittlandübermittlungen müssen vor der jeweiligen Schulaktivierung dokumentiert werden."
                    : "The school documents its own retention periods for attendance, absences, letters, notifications, learning progress and audit records, as well as document categories and chats. Unconfigured periods do not authorise routine cleanup. Recorded retention holds prevent ordinary document cleanup. Account security and access checks use Firebase; school data and private files are processed through the configured Supabase service. If mobile push is explicitly enabled, a push token and generic notification data are processed through the configured push service after device permission. Notifications contain no diagnoses or document contents. Specific providers, storage locations and any international transfers must be documented before the school is activated."}
                </p>
                <p>
                  {isDE
                    ? "Im Schulbereich können Sie Ihre zugeordneten Daten exportieren und eine Löschprüfung beantragen. Bei einer Kontolöschung werden schulische Aufbewahrungspflichten und dokumentierte Sperren geprüft; eine bestehende Pflicht kann die sofortige Löschung bestimmter Schulunterlagen verhindern. Wenden Sie sich für Berichtigung, Auskunft, Einschränkung und die Bearbeitung solcher Fälle an den im Schulbereich genannten Datenschutzkontakt."
                    : "Inside the school workspace you can export your associated data and request deletion review. Account deletion checks school retention obligations and recorded holds; an applicable obligation may prevent immediate deletion of specific school records. Contact the privacy contact shown in the workspace for correction, access, restriction and review of such cases."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
