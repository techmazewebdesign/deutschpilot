import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return { title: de ? "AGB | DeutschPilot" : "Terms of Service | DeutschPilot" };
}

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
                  ? "Diese AGB gelten für alle Verträge zwischen der PLUCO GROUP SP. Z O.O. (Betreiberin von DeutschPilot) und ihren Kunden über die Nutzung der Lernplattform und zugehöriger Dienstleistungen."
                  : "These Terms of Service apply to all contracts between PLUCO GROUP SP. Z O.O. (operator of DeutschPilot) and its customers regarding the use of the learning platform and related services."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "2. Leistungsumfang" : "2. Scope of Services"}</h2>
              <p className="leading-relaxed">
                {isDE
                  ? "DeutschPilot bietet Online-Sprachkurse, Retreats und Community-Funktionen an. Die genauen Leistungen ergeben sich aus dem jeweiligen Kursangebot. Kostenpflichtige Niveaustufen (A2–C1) werden einmalig bezahlt und schalten den dauerhaften Zugriff auf die zugehörigen Lernräume frei; das Einsteigerniveau A1 ist kostenlos."
                  : "DeutschPilot offers online language courses, retreats, and community features. The exact services are defined in the respective course offerings. Paid levels (A2–C1) are purchased as a one-time payment that unlocks permanent access to the associated learning rooms; the A1 beginner level is free."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "3. Widerrufsrecht" : "3. Right of Withdrawal"}</h2>
              <p className="leading-relaxed">
                {isDE
                  ? "Verbraucher:innen haben grundsätzlich ein 14-tägiges Widerrufsrecht bei digitalen Inhalten. Da mit dem Kauf einer Niveaustufe sofort auf digitale Lerninhalte zugegriffen werden kann, erlischt das Widerrufsrecht vorzeitig, sobald der Kauf abgeschlossen und der Zugriff freigeschaltet wurde — vorausgesetzt, der/die Kund:in hat der sofortigen Ausführung ausdrücklich zugestimmt und bestätigt, dass dadurch das Widerrufsrecht erlischt. Diese Bestätigung erfolgt im Bestellprozess."
                  : "Consumers generally have a 14-day right of withdrawal for digital content. Because purchasing a level grants immediate access to digital learning content, the right of withdrawal expires as soon as the purchase is completed and access is unlocked — provided the customer has expressly consented to immediate performance and acknowledged that this ends the right of withdrawal. This confirmation is obtained during checkout."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{isDE ? "4. Kontakt" : "4. Contact"}</h2>
              <p>info@deutschpilot.de</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
