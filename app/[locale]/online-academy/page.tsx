import Link from "next/link";
import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { Video, Bot, BookOpen, Award, Newspaper, ChevronRight, Car } from "lucide-react";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    title: de ? "Online-Akademie | DeutschPilot" : "Online Academy | DeutschPilot",
    description: de
      ? "Alles an einem Ort: strukturierte Kurse von A1 bis C1, Live-Unterricht, KI-Trainer, Modellprüfungen und ein Magazin voller Sprachtipps."
      : "Everything in one place: structured A1-C1 courses, live classes, an AI trainer, mock exams, and a magazine full of language tips.",
  };
}

export default function OnlineAcademyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const de = locale === "de";

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const pillars = [
    {
      icon: BookOpen,
      href: "/levels",
      de: { title: "Strukturierte Kurse", body: "Von A1 bis C1 — 30 Themenräume mit Lektionen und Checkpoint-Quiz, Schritt für Schritt aufgebaut." },
      en: { title: "Structured Courses", body: "A1 to C1 — 30 themed rooms with lessons and checkpoint quizzes, built step by step." },
    },
    {
      icon: Video,
      href: "/classes",
      de: { title: "Live-Klassen", body: "Buche interaktive Sessions mit echten Deutschlehrer:innen — zu Zeiten, die zu dir passen." },
      en: { title: "Live Classes", body: "Book interactive sessions with real German teachers — at times that work for you." },
    },
    {
      icon: Bot,
      href: "/ai-trainer",
      de: { title: "KI-Sprachbegleiter", body: "Übe jederzeit mit unserem KI-Trainer — Korrekturen, Grammatik-Erklärungen und Gesprächsübung." },
      en: { title: "AI Language Companion", body: "Practice any time with our AI Trainer — corrections, grammar explanations, and conversation practice." },
    },
    {
      icon: Award,
      href: "/mock-exam",
      de: { title: "Modellprüfungen", body: "B1- und B2-Abschlusstests im echten Prüfungsformat, bevor du zur echten Prüfung gehst." },
      en: { title: "Mock Exams", body: "B1 and B2 final tests in the real exam format, before you sit the actual exam." },
    },
    {
      icon: Newspaper,
      href: "/magazine",
      de: { title: "Magazin", body: "Grammatik- und Kulturguides zu jedem Thema — kostenlos, für alle Niveaus." },
      en: { title: "Magazine", body: "Grammar and culture guides on every topic — free, for every level." },
    },
    {
      icon: Car,
      href: "/driving-theory",
      de: { title: "Führerschein Theorie", body: "Übe wichtige Verkehrsregeln für die Theorieprüfung (Klasse B) — kostenlos." },
      en: { title: "Driving Theory", body: "Practice essential traffic rules for the theory exam (Class B) — free." },
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#E0B873] uppercase mb-4">
            {de ? "Die Akademie" : "The Academy"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-5">
            {de ? "Alles, was du zum Deutschlernen brauchst" : "Everything you need to learn German"}
          </h1>
          <p className="text-[#C9D2DE] max-w-xl mx-auto mb-14 leading-relaxed">
            {de
              ? "Strukturierte Kurse, Live-Unterricht, ein KI-Sprachbegleiter und echte Prüfungsvorbereitung — an einem Ort, für jedes Niveau von A1 bis C1."
              : "Structured courses, live classes, an AI language companion, and real exam prep — all in one place, for every level from A1 to C1."}
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-14 text-left">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.en.title}
                  href={`/${locale}${p.href}`}
                  className="group bg-[#0A1E35]/70 border border-white/10 hover:border-[#E0B873]/30 rounded-2xl p-6 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="h-6 w-6 text-[#E0B873]" />
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#E0B873] transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{de ? p.de.title : p.en.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{de ? p.de.body : p.en.body}</p>
                </Link>
              );
            })}
          </div>

          <Link
            href={`/${locale}/signup`}
            className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
          >
            {de ? "Kostenlos starten" : "Start for free"}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
