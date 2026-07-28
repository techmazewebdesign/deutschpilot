import type { Metadata } from "next";
import Link from "next/link";
import { Car, Bike, ChevronRight, AlertTriangle } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    title: de
      ? "Führerschein Theorie üben | DeutschPilot"
      : "Practice German Driving Theory | DeutschPilot",
    description: de
      ? "Essenzielle Verkehrsregeln zum Üben für Klasse A (Motorrad) und Klasse B (PKW) — kostenlos, kein Konto nötig."
      : "Essential traffic-law questions to practice for Class A (motorcycle) and Class B (car) — free, no account needed.",
  };
}

const CLASSES = [
  {
    cls: "B",
    icon: Car,
    titleDE: "Klasse B — PKW",
    titleEN: "Class B — Car",
    descDE: "Der Standard-Autoführerschein.",
    descEN: "The standard car license.",
  },
  {
    cls: "A",
    icon: Bike,
    titleDE: "Klasse A — Motorrad",
    titleEN: "Class A — Motorcycle",
    descDE: "Für Motorräder ohne Leistungsbeschränkung.",
    descEN: "For motorcycles without a power restriction.",
  },
];

export default function DrivingTheoryLandingPage({ params }: { params: { locale: string } }) {
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
      <main className="min-h-screen bg-[#071424] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">
            {de ? "Theorieprüfung" : "Theory Exam"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-5">
            {de ? "Führerschein Theorie üben" : "Practice Driving Theory"}
          </h1>
          <p className="text-[#C9D2DE] max-w-lg mx-auto mb-12 leading-relaxed">
            {de
              ? "Wähle deine Führerscheinklasse und übe die wichtigsten Verkehrsregeln vor deiner echten Theorieprüfung."
              : "Choose your license class and practice the most essential traffic rules before your real theory exam."}
          </p>

          <div className="space-y-4 mb-10">
            {CLASSES.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.cls}
                  href={`/${locale}/driving-theory/${c.cls}`}
                  className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 p-6 transition-colors text-left"
                >
                  <div className="h-14 w-14 rounded-2xl border-2 border-[#E0B873]/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-[#E0B873]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-white mb-1">{de ? c.titleDE : c.titleEN}</h2>
                    <p className="text-sm text-white/45">{de ? c.descDE : c.descEN}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-[#E0B873] transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/8 p-5 text-left flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              {de
                ? "Hinweis: Dies sind eigene Übungsfragen zu wichtigen Verkehrsregeln — keine wortgetreue Wiedergabe des amtlichen Fragenkatalogs."
                : "Note: these are original practice questions on important traffic rules — not verbatim reproductions of the official question catalog."}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
