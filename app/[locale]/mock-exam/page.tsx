import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    title: de
      ? "B1 & B2 Modellprüfung: Teste dich vor der echten Prüfung | DeutschPilot"
      : "B1 & B2 Mock Exam: Test yourself before the real exam | DeutschPilot",
    description: de
      ? "Simuliere die echte Goethe/telc-Prüfungsstruktur — Lesen, Hören, Schreiben, Sprechen — und erhalte eine ehrliche Einschätzung deiner Prüfungsreife."
      : "Simulate the real Goethe/telc exam structure — Reading, Listening, Writing, Speaking — and get an honest readiness assessment.",
  };
}

const LEVELS = [
  {
    level: "B1",
    descDE: "Mittelstufe — die häufigste Prüfung für Einbürgerung und Beruf.",
    descEN: "Intermediate — the most common exam for citizenship and work purposes.",
  },
  {
    level: "B2",
    descDE: "Gehobene Mittelstufe — oft für Studium und qualifizierte Berufe gefordert.",
    descEN: "Upper-intermediate — often required for university and skilled professions.",
  },
];

export default function MockExamLandingPage({ params }: { params: { locale: string } }) {
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

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">
              {de ? "Abschlusstest" : "Final check"}
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
              {de ? "Modellprüfung" : "Mock Exam"}
            </h1>
            <p className="text-[#C9D2DE] max-w-xl mx-auto">
              {de
                ? "Bevor du zur echten Prüfung gehst: teste dich mit einer Modellprüfung im echten Format — Lesen, Hören, Schreiben und Sprechen — und sieh, wo du stehst."
                : "Before you go to the real exam: test yourself with a mock exam in the real format — Reading, Listening, Writing, and Speaking — and see where you stand."}
            </p>
          </div>

          <div className="space-y-4">
            {LEVELS.map((l) => (
              <Link
                key={l.level}
                href={`/${locale}/mock-exam/${l.level}`}
                className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 p-6 transition-colors"
              >
                <div className="h-14 w-14 rounded-2xl border-2 border-[#E0B873]/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-black text-[#E0B873]">{l.level}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-white mb-1">
                    {l.level} {de ? "Modellprüfung" : "Mock Exam"}
                  </h2>
                  <p className="text-sm text-white/45">{de ? l.descDE : l.descEN}</p>
                  <p className="text-xs text-white/30 mt-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {de ? "~50 Minuten" : "~50 minutes"}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-[#E0B873] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-white/3 border border-white/6 flex items-start gap-3">
            <BookOpen className="h-4 w-4 text-white/30 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/35 leading-relaxed">
              {de
                ? "Die Modellprüfung nutzt echte Übungsinhalte aus den Lese-, Hör-, Schreib- und Sprechkursen deines Niveaus. Sie ist eine Selbsteinschätzung, keine offizielle Prüfungsbewertung."
                : "The mock exam draws on real practice content from your level's reading, listening, writing, and speaking courses. It's a self-assessment, not an official exam grade."}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
