import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "seo" });
  return { alternates: pageAlternates(params.locale, "/terms"), title: t("termsTitle") };
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
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

  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-white mb-8">{t("heading")}</h1>
          <div className="space-y-6 text-[#C9D2DE]">
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section1.heading")}</h2>
              <p className="leading-relaxed">
                {t("section1.body")}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section2.heading")}</h2>
              <p className="leading-relaxed">
                {t("section2.body")}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section3.heading")}</h2>
              <p className="leading-relaxed">
                {t("section3.body")}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{t("section4.heading")}</h2>
              <p className="leading-relaxed">
                {locale === "de"
                  ? "Die Abrechnung erfolgt wiederkehrend über Stripe. Bei fehlgeschlagener oder unvollständiger Zahlung wird kein Premium-Zugang gewährt. Die ordentliche Kündigung ist jederzeit über „Verträge hier kündigen“, im Konto oder im Stripe-Abrechnungsportal möglich und wirkt zum Ende des bereits bezahlten Monats. Gesetzliche außerordentliche Kündigungs- und Erstattungsrechte bleiben unberührt. Kontakt: info@deutschpilot.de."
                  : "Recurring billing is handled by Stripe. Failed or incomplete payments do not grant premium access. Ordinary cancellation is available through “Cancel subscription,” the account page or Stripe billing portal and takes effect at the end of the paid month. Statutory extraordinary cancellation and refund rights remain unaffected. Contact: info@deutschpilot.de."}
              </p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{locale === "de" ? "5. Vertrag, Verfügbarkeit und Haftung" : "5. Contract, availability and liability"}</h2>
              <p className="leading-relaxed">{locale === "de"
                ? "Der Vertrag kommt mit der Zahlungsbestätigung zustande. Zugang ist persönlich und nicht übertragbar. Wartung, Sicherheitsmaßnahmen und zumutbare Inhaltsänderungen bleiben vorbehalten. Für Vorsatz, grobe Fahrlässigkeit sowie Schäden an Leben, Körper oder Gesundheit gilt die gesetzliche Haftung; zwingende Verbraucherrechte bleiben unberührt."
                : "The contract is formed when payment is confirmed. Access is personal and non-transferable. Maintenance, security measures and reasonable content changes remain possible. Statutory liability applies to intent, gross negligence and harm to life, body or health; mandatory consumer rights remain unaffected."}</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{locale === "de" ? "6. Anwendbares Recht" : "6. Governing law"}</h2>
              <p className="leading-relaxed">{locale === "de"
                ? "Es gilt polnisches Recht. Für Verbraucher:innen bleiben zwingende Schutzvorschriften des Staates ihres gewöhnlichen Aufenthalts und gesetzliche Gerichtsstände unberührt. Vertragssprachen sind Deutsch und Englisch."
                : "Polish law applies. Consumers retain mandatory protections of their country of habitual residence and statutory venues. Contract languages are German and English."}</p>
            </div>
            <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3">{locale === "de" ? "Muster-Widerruf" : "Model withdrawal notice"}</h2>
              <p className="leading-relaxed">{locale === "de"
                ? "An PLUCO GROUP SP. Z O.O., Ksawerów 3, 02-656 Warschau, Polen, info@deutschpilot.de: Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über das DeutschPilot-Abonnement. Name, Anschrift, Bestelldatum, Datum und Unterschrift (nur bei Papiermitteilung)."
                : "To PLUCO GROUP SP. Z O.O., Ksawerów 3, 02-656 Warsaw, Poland, info@deutschpilot.de: I withdraw from my DeutschPilot subscription contract. Name, address, order date, date and signature (paper notices only)."}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
