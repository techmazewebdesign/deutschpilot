import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

const BASE_URL = "https://deutschpilot.de";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    title: de
      ? "Häufige Fragen zu DeutschPilot | FAQ"
      : "Frequently Asked Questions | DeutschPilot FAQ",
    description: de
      ? "Antworten auf die häufigsten Fragen zu Niveaus, Themenräumen, Zertifikaten, dem Einstufungstest und dem Lernen mit DeutschPilot."
      : "Answers to the most common questions about levels, learning rooms, certificates, the placement test, and learning with DeutschPilot.",
  };
}

type Faq = { qDE: string; qEN: string; aDE: string; aEN: string };

const FAQS: Faq[] = [
  {
    qDE: "Wie funktioniert DeutschPilot?",
    qEN: "How does DeutschPilot work?",
    aDE: "Du lernst in Themenräumen: jeder Raum hat drei Lektionen zu einem Alltagsthema plus ein Checkpoint-Quiz. Bestehst du das Quiz mit mindestens 70%, schaltest du den nächsten Raum frei. So baust du Schritt für Schritt Wortschatz, Grammatik und Sprachgefühl auf.",
    aEN: "You learn in themed rooms: each room has three lessons on an everyday topic plus a checkpoint quiz. Score at least 70% on the quiz and the next room unlocks. Step by step, you build vocabulary, grammar, and a feel for the language.",
  },
  {
    qDE: "Welche Niveaus deckt DeutschPilot ab?",
    qEN: "Which levels does DeutschPilot cover?",
    aDE: "Aktuell A1 bis C1 nach dem Gemeinsamen Europäischen Referenzrahmen (GER). Jedes Niveau hat sechs Themenräume sowie separate Übungskurse für Hören, Lesen, Sprechen und Schreiben.",
    aEN: "Currently A1 through C1 on the Common European Framework of Reference (CEFR). Each level has six themed rooms plus separate practice courses for listening, reading, speaking, and writing.",
  },
  {
    qDE: "Ist DeutschPilot kostenlos?",
    qEN: "Is DeutschPilot free?",
    aDE: "Die Registrierung ist kostenlos und du kannst direkt mit Lektionen und dem Einstufungstest starten. Für Live-Unterricht mit Lehrer:innen und Retreats gelten separate Preise, die du auf der Kurs-Seite findest.",
    aEN: "Signing up is free, and you can start lessons and the placement test right away. Live classes with teachers and retreats have separate pricing, listed on the courses page.",
  },
  {
    qDE: "Wie finde ich mein Niveau?",
    qEN: "How do I find my level?",
    aDE: "Nutze unseren kostenlosen Einstufungstest. Er ordnet dich einem GER-Niveau zu, sodass du direkt in den passenden Themenräumen startest, statt bei A1 von vorn zu beginnen, wenn du schon weiter bist.",
    aEN: "Use our free placement test. It maps you to a CEFR level so you start directly in the right rooms, instead of beginning at A1 again if you're already further along.",
  },
  {
    qDE: "Bekomme ich ein Zertifikat?",
    qEN: "Do I get a certificate?",
    aDE: "Ja — nach Abschluss aller Räume eines Niveaus erhältst du ein Zertifikat, das deinen Fortschritt bis zu diesem GER-Niveau bestätigt.",
    aEN: "Yes — after completing all rooms in a level, you receive a certificate confirming your progress up to that CEFR level.",
  },
  {
    qDE: "Kann ich auch ohne Vorkenntnisse anfangen?",
    qEN: "Can I start with zero prior knowledge?",
    aDE: "Absolut. A1 ist für absolute Anfänger:innen konzipiert und beginnt bei Begrüßungen und den Grundlagen — keine Vorkenntnisse nötig.",
    aEN: "Absolutely. A1 is designed for absolute beginners and starts with greetings and the basics — no prior knowledge required.",
  },
  {
    qDE: "Hilft DeutschPilot bei einem Integrationskurs oder einer Prüfung?",
    qEN: "Does DeutschPilot help with an Integrationskurs or an exam?",
    aDE: "Die Themenräume und Übungskurse decken die gleichen GER-Niveaus wie Integrationskurse und offizielle Prüfungen (z. B. Goethe, telc, DTZ) ab. Mehr Prüfungsdetails findest du im Magazin.",
    aEN: "The themed rooms and practice courses cover the same CEFR levels as Integrationskurse and official exams (e.g. Goethe, telc, DTZ). More exam details are in the magazine.",
  },
  {
    qDE: "Was ist der Unterschied zwischen Räumen und Übungskursen?",
    qEN: "What's the difference between rooms and practice courses?",
    aDE: "Räume vermitteln neuen Stoff zu einem Alltagsthema (z. B. Wohnen, Arbeit). Übungskurse trainieren gezielt eine Fertigkeit — Hören, Lesen, Sprechen oder Schreiben — mit zusätzlichen Aufgaben.",
    aEN: "Rooms teach new material around an everyday topic (e.g. housing, work). Practice courses drill one specific skill — listening, reading, speaking, or writing — with additional exercises.",
  },
  {
    qDE: "Kann ich mit Google anmelden?",
    qEN: "Can I sign in with Google?",
    aDE: "Ja, du kannst dich mit deinem Google-Konto registrieren oder anmelden — eine Alternative zur E-Mail-und-Passwort-Anmeldung.",
    aEN: "Yes, you can sign up or sign in with your Google account — an alternative to email-and-password sign-in.",
  },
  {
    qDE: "Wie lange dauert es, Deutsch zu lernen?",
    qEN: "How long does it take to learn German?",
    aDE: "Das hängt von deinem Ziel-Niveau und deiner Lernzeit ab. Eine ausführliche Einschätzung je GER-Niveau findest du im Magazin-Artikel „Wie lange dauert es, Deutsch zu lernen?“.",
    aEN: "It depends on your target level and how much time you invest. A detailed breakdown by CEFR level is in the magazine article \"How long does it take to learn German?\".",
  },
];

export default function FaqPage({ params }: { params: { locale: string } }) {
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

  const de = locale === "de";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: de ? f.qDE : f.qEN,
      acceptedAnswer: { "@type": "Answer", text: de ? f.aDE : f.aEN },
    })),
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">FAQ</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
              {de ? "Häufige Fragen" : "Frequently Asked Questions"}
            </h1>
            <p className="text-[#C9D2DE] text-base max-w-xl mx-auto">
              {de
                ? "Alles, was du über Niveaus, Räume, Zertifikate und den Einstieg bei DeutschPilot wissen musst."
                : "Everything you need to know about levels, rooms, certificates, and getting started with DeutschPilot."}
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/10 bg-[#0B1B33]/50 open:border-[#CEA66F]/30 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 text-white font-medium">
                  {de ? f.qDE : f.qEN}
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/30 transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-6 pb-5 text-sm text-[#C9D2DE] leading-relaxed">
                  {de ? f.aDE : f.aEN}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-[#CEA66F]/25 bg-[#CEA66F]/8 text-center">
            <h2 className="text-lg font-serif font-bold text-white mb-1.5">
              {de ? "Noch Fragen?" : "Still have questions?"}
            </h2>
            <p className="text-sm text-white/50 mb-4">
              {de ? "Wir helfen dir gerne persönlich weiter." : "We're happy to help you personally."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
            >
              {de ? "Kontakt aufnehmen" : "Get in touch"} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
