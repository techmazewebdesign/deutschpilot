import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { auth } from "@/lib/auth";
import { isPlaceholderLocale } from "@/i18n";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import { Lock, CheckCircle2, ChevronRight, Star, Zap, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

type LevelKey = "A1" | "A2" | "B1" | "B2" | "C1";

const LEVELS: {
  key: LevelKey;
  nameDE: string;
  nameEN: string;
  descDE: string;
  descEN: string;
  rooms: number;
  color: string;
  active: boolean;
}[] = [
  {
    key: "A1", nameDE: "Anfänger", nameEN: "Beginner", rooms: 6,
    descDE: "Grundlegende Sätze und Ausdrücke für alltägliche Situationen.",
    descEN: "Basic phrases and expressions for everyday situations.",
    color: "#22c55e", active: true,
  },
  {
    key: "A2", nameDE: "Grundlegende Kenntnisse", nameEN: "Elementary", rooms: 6,
    descDE: "Einfache Kommunikation zu vertrauten Themen und Routineaufgaben.",
    descEN: "Simple communication on familiar topics and routine tasks.",
    color: "#84cc16", active: true,
  },
  {
    key: "B1", nameDE: "Mittelstufe", nameEN: "Intermediate", rooms: 6,
    descDE: "Hauptpunkte zu klaren Standardthemen verstehen und ausdrücken.",
    descEN: "Understand main points on clear standard topics and express them.",
    color: "#E0B873", active: false,
  },
  {
    key: "B2", nameDE: "Gehobene Mittelstufe", nameEN: "Upper Intermediate", rooms: 6,
    descDE: "Komplexe Texte verstehen und spontan kommunizieren.",
    descEN: "Understand complex texts and communicate spontaneously.",
    color: "#f97316", active: false,
  },
  {
    key: "C1", nameDE: "Fortgeschritten", nameEN: "Advanced", rooms: 6,
    descDE: "Komplexe, anspruchsvolle Texte verstehen und flüssig sprechen.",
    descEN: "Understand complex demanding texts and speak fluently.",
    color: "#a855f7", active: false,
  },
];

export default async function LevelsPage({ params }: { params: { locale: string } }) {
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

  // Public page: guests see the roadmap with the public site shell and a
  // sign-up CTA; logged-in users get the app shell with their progress context.
  const session = await auth();
  const isGuest = !session?.user;

  const de = locale === "de";

  const content = (
      <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-4xl w-full mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em] mb-2">
            {de ? "Dein Lernweg" : "Your Learning Path"}
          </p>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {de ? "Sprachniveaus" : "Language Levels"}
          </h1>
          <p className="text-sm text-white/45 max-w-xl">
            {de
              ? "Dein strukturierter Weg von A1 bis C1 – jeder Schritt bringt dich näher zur Fließendigkeit."
              : "Your structured path from A1 to C1 – every step brings you closer to fluency."}
          </p>
        </div>

        {/* Journey connector */}
        <div className="space-y-4">
          {LEVELS.map((level, i) => (
            <div key={level.key} className="relative">
              {/* Connector line */}
              {i < LEVELS.length - 1 && (
                <div className="absolute left-8 top-full h-4 w-px bg-white/10 z-10" />
              )}

              <div className={`relative overflow-hidden rounded-2xl border transition-all ${
                level.active
                  ? "border-white/12 bg-[#0A1E35]/70 hover:border-[#E0B873]/20 backdrop-blur-sm"
                  : "border-white/6 bg-[#0A1E35]/30 opacity-60"
              }`}>
                {/* Active glow */}
                {level.active && (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(224,184,115,0.04)_0%,_transparent_50%)]" />
                )}

                <div className="relative flex items-start gap-5 p-6">
                  {/* Level badge */}
                  <div className={`flex-shrink-0 h-16 w-16 rounded-2xl flex flex-col items-center justify-center border-2 ${
                    level.active
                      ? "border-current shadow-lg"
                      : "border-white/10"
                  }`} style={{ borderColor: level.active ? level.color : undefined }}>
                    {level.active ? (
                      <>
                        <span className="text-xl font-black leading-none" style={{ color: level.color }}>
                          {level.key}
                        </span>
                        <Star className="h-3 w-3 mt-0.5" style={{ color: level.color }} />
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 text-white/25 mb-0.5" />
                        <span className="text-xs font-bold text-white/25">{level.key}</span>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-base font-bold text-white">{level.key}</h2>
                          <span className="text-xs text-white/40">·</span>
                          <span className="text-sm font-medium text-white/60">
                            {de ? level.nameDE : level.nameEN}
                          </span>
                          {level.active && (
                            <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ background: `${level.color}20`, color: level.color }}>
                              {de ? "Verfügbar" : "Available"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/45 max-w-lg">
                          {de ? level.descDE : level.descEN}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-xs text-white/35">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{level.rooms} {de ? "Räume" : "rooms"}</span>
                          </div>
                          {level.active && (
                            <div className="flex items-center gap-1.5 text-xs text-white/35">
                              <Zap className="h-3.5 w-3.5" />
                              <span>{de ? "Zertifikat inklusive" : "Certificate included"}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {level.active ? (
                        <Link href={`/${locale}/rooms`}
                          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                          style={{ background: `${level.color}18`, color: level.color, border: `1px solid ${level.color}30` }}>
                          {de ? "Erkunden" : "Explore"} <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white/25 border border-white/8">
                          <Lock className="h-3.5 w-3.5" />
                          {de ? "Bald verfügbar" : "Coming soon"}
                        </div>
                      )}
                    </div>

                    {/* Skills checklist for active levels */}
                    {level.active && (
                      <div className="mt-4 grid grid-cols-2 gap-1.5">
                        {(de
                          ? ["Hören", "Lesen", "Sprechen", "Schreiben"]
                          : ["Listening", "Reading", "Speaking", "Writing"]
                        ).map((skill) => (
                          <div key={skill} className="flex items-center gap-2 text-xs text-white/50">
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: level.color }} />
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guest sign-up CTA */}
        {isGuest && (
          <div className="mt-8 p-6 rounded-2xl border border-[#E0B873]/25 bg-[#E0B873]/8 text-center">
            <h2 className="text-lg font-serif font-bold text-white mb-1.5">
              {de ? "Bereit anzufangen?" : "Ready to get started?"}
            </h2>
            <p className="text-sm text-white/50 mb-4 max-w-md mx-auto">
              {de
                ? "Erstelle ein kostenloses Konto, um Lektionen zu starten und deinen Fortschritt zu speichern."
                : "Create a free account to start lessons and save your progress."}
            </p>
            <Link
              href={`/${locale}/signup`}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
            >
              {de ? "Kostenlos starten" : "Start for free"} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* CEFR note */}
        <div className="mt-8 p-4 rounded-2xl bg-white/3 border border-white/6 text-center">
          <p className="text-xs text-white/30">
            {de
              ? "Alle Niveaus entsprechen dem Gemeinsamen Europäischen Referenzrahmen (GER / CEFR)."
              : "All levels align with the Common European Framework of Reference for Languages (CEFR)."}
          </p>
        </div>
      </div>
  );

  if (!session?.user) {
    return (
      <>
        <Navigation />
        <main className="bg-[#071424] min-h-screen">{content}</main>
        <Footer />
      </>
    );
  }

  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";
  return (
    <AppLayout locale={locale} userName={userName}>
      {content}
    </AppLayout>
  );
}
