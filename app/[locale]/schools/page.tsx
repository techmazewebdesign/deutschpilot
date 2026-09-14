import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Users } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { pageAlternates } from "@/lib/page-alternates";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const de = params.locale === "de";

  return {
    alternates: pageAlternates(params.locale, "/schools"),
    title: de ? "DeutschPilot für Sprachschulen" : "DeutschPilot for language schools",
    description: de
      ? "Informationen für Sprachschulen, die DeutschPilot als digitale Lernplattform erwerben oder institutionell lizenzieren möchten."
      : "Information for language schools considering DeutschPilot as a digital learning platform through acquisition or institutional licensing.",
  };
}

export default function SchoolsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const de = locale === "de";

  if (isPlaceholderLocale(locale)) {
    return <><Navigation /><PlaceholderPage locale={locale} /><Footer /></>;
  }

  const mailSubject = encodeURIComponent(de ? "Vertrauliche Anfrage: DeutschPilot für Sprachschulen" : "Confidential enquiry: DeutschPilot for language schools");
  const mailBody = encodeURIComponent(de
    ? "Guten Tag,\n\nwir interessieren uns für DeutschPilot als digitale Lernplattform für unsere Sprachschule. Bitte senden Sie uns Informationen zu einem vertraulichen Kennenlerngespräch.\n\nName der Einrichtung:\nAnsprechperson:\nFunktion:\n"
    : "Hello,\n\nwe are interested in DeutschPilot as a digital learning platform for our language school. Please send us information about a confidential introductory conversation.\n\nInstitution:\nContact person:\nRole:\n");
  const points = de
    ? [
        { Icon: Building2, title: "Institutioneller Betrieb", body: "Die Schule kann das Angebot in ihr eigenes Lern-, Betreuungs- und Vertragsmodell einbinden." },
        { Icon: Users, title: "Produkt- und Rollenbasis", body: "Lern-, Lehrkraft- und Administrationsfunktionen, strukturierte Inhalte sowie optionale Live-Kursverwaltung." },
        { Icon: ShieldCheck, title: "Transparente Übergabe", body: "Der aktuelle deutsche Paid-Enrollment-Hold und die erforderliche rechtliche Prüfung werden offen dokumentiert." },
      ]
    : [
        { Icon: Building2, title: "Institution-managed operation", body: "The school can incorporate the platform into its own teaching, support, and contract model." },
        { Icon: Users, title: "Product and role foundation", body: "Learner, teacher, and administration capabilities, structured content, and optional live-class management." },
        { Icon: ShieldCheck, title: "Transparent handover", body: "The current German paid-enrollment hold and required legal review are disclosed clearly." },
      ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424] text-white">
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#CEA66F]">{de ? "Für Sprachschulen" : "For language schools"}</p>
          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-6xl">{de ? "Eine digitale Lernplattform für den institutionellen Einsatz." : "A digital learning platform for institutional use."}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#C9D2DE]">{de ? "DeutschPilot kann im Rahmen eines Erwerbs oder einer institutionellen Lizenz von einer Sprachschule in das eigene Unterrichts- und Betreuungsmodell integriert werden." : "Through acquisition or institutional licensing, DeutschPilot can be integrated by a language school into its own teaching and learner-support model."}</p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {points.map(({ Icon, title, body }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="mb-5 h-6 w-6 text-[#CEA66F]" aria-hidden="true" />
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#C9D2DE]">{body}</p>
              </article>
            ))}
          </div>

          <section className="mt-12 rounded-2xl border border-[#CEA66F]/25 bg-[#0B1B33] p-7 sm:p-9">
            <h2 className="font-serif text-2xl font-bold">{de ? "Transparente Ausgangslage" : "Transparent starting point"}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#C9D2DE]">{de ? "Neue kostenpflichtige Anmeldungen aus Deutschland sind derzeit pausiert. DeutschPilot wird nicht als ZFU-zugelassener Lehrgang, staatlich anerkannter Abschluss oder Garantie für Lern- oder Prüfungsergebnisse angeboten. Eine Erwerberin oder ein Erwerber muss das vorgesehene deutsche Betriebsmodell vor einer kostenpflichtigen Öffnung rechtlich prüfen lassen." : "New paid enrolments from Germany are currently paused. DeutschPilot is not offered as a ZFU-approved programme, a state-recognised qualification, or a guarantee of learning or examination outcomes. Before a paid German launch, an acquirer must obtain legal review of its intended operating model."}</p>
          </section>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={`mailto:info@deutschpilot.de?subject=${mailSubject}&body=${mailBody}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D9B173] px-5 py-3 text-sm font-bold text-[#071424] transition-colors hover:bg-[#E7C68E]">
              {de ? "Vertrauliche Anfrage senden" : "Send a confidential enquiry"}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href={`/${locale}/privacy`} className="text-sm text-[#C9D2DE] underline decoration-white/30 underline-offset-4 hover:text-white">{de ? "Datenschutzhinweise" : "Privacy information"}</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
