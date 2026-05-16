import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

const content: Record<string, { title: string; subtitle: string; body: string; cta: string }> = {
  de: {
    title: "Online Akademie",
    subtitle: "Lerne überall, jederzeit",
    body: "Die DeutschPilot Online Akademie bietet dir strukturierte Kurse, Live-Sessions mit erfahrenen Lehrern und KI-gestütztes Lernen – flexibel, effektiv und von überall auf der Welt zugänglich.",
    cta: "Jetzt starten",
  },
  en: {
    title: "Online Academy",
    subtitle: "Learn anywhere, anytime",
    body: "The DeutschPilot Online Academy offers you structured courses, live sessions with experienced teachers, and AI-assisted learning — flexible, effective, and accessible from anywhere in the world.",
    cta: "Start now",
  },
};

const features = [
  { icon: "🎥", de: "Live-Klassen", en: "Live Classes" },
  { icon: "🤖", de: "KI-Begleiter", en: "AI Companion" },
  { icon: "📚", de: "Strukturierte Kurse", en: "Structured Courses" },
  { icon: "🌍", de: "Globale Community", en: "Global Community" },
];

export default function OnlineAcademyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (PLACEHOLDER_LOCALES.includes(locale as any)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const c = content[locale] ?? content.en;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{c.subtitle}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">{c.title}</h1>
            <p className="text-[#C9D2DE] max-w-xl mx-auto">{c.body}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {features.map((f) => (
              <div key={f.en} className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="text-sm font-medium text-white">{locale === "de" ? f.de : f.en}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href={`/${locale}/signup` as any} className="inline-block bg-[#D9B173] text-[#071424] font-semibold px-8 py-3 rounded-md hover:bg-[#B98A4E] transition-colors">
              {c.cta}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
