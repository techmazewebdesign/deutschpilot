import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

const content: Record<string, { title: string; subtitle: string; body: string; cta: string }> = {
  de: {
    title: "Über uns",
    subtitle: "Wir sind DeutschPilot",
    body: "DeutschPilot wurde mit einer klaren Mission gegründet: Menschen auf der ganzen Welt dabei zu helfen, Deutsch schnell, effektiv und mit Freude zu lernen. Unsere erfahrenen Lehrer, innovative KI-Unterstützung und eine lebendige Community machen DeutschPilot zur Premium-Lernplattform für echte Ergebnisse.",
    cta: "Kostenlos starten",
  },
  en: {
    title: "About Us",
    subtitle: "We are DeutschPilot",
    body: "DeutschPilot was founded with a clear mission: to help people around the world learn German quickly, effectively, and with joy. Our experienced teachers, innovative AI support, and a vibrant community make DeutschPilot the premium learning platform for real results.",
    cta: "Start for free",
  },
};

export default function AboutPage({ params }: { params: { locale: string } }) {
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{c.subtitle}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">{c.title}</h1>
          </div>
          <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-8 sm:p-12 mb-10">
            <p className="text-[#C9D2DE] text-lg leading-relaxed">{c.body}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[["5+", locale === "de" ? "Jahre Erfahrung" : "Years experience"], ["1200+", locale === "de" ? "Zufriedene Teilnehmer" : "Happy students"], ["96%", locale === "de" ? "Empfehlungsrate" : "Recommendation rate"]].map(([stat, label]) => (
              <div key={stat} className="text-center bg-[#0B1B33]/50 border border-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-[#CEA66F] mb-2">{stat}</div>
                <div className="text-sm text-white/60">{label}</div>
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
