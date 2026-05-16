import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

const content: Record<string, { title: string; subtitle: string; body: string; cta: string; levels: string[] }> = {
  de: {
    title: "Dein Niveau bestimmen",
    subtitle: "Kostenloser Einstufungstest",
    body: "Finde in wenigen Minuten heraus, welches Kursniveau zu dir passt. Unser Test deckt alle CEFR-Niveaus von A1 bis C1 ab.",
    cta: "Test starten",
    levels: ["A1 – Anfänger", "A2 – Grundlagen", "B1 – Mittelstufe", "B2 – Fortgeschritten", "C1 – Kompetent"],
  },
  en: {
    title: "Determine Your Level",
    subtitle: "Free placement test",
    body: "Find out which course level suits you in just a few minutes. Our test covers all CEFR levels from A1 to C1.",
    cta: "Start test",
    levels: ["A1 – Beginner", "A2 – Basics", "B1 – Intermediate", "B2 – Advanced", "C1 – Competent"],
  },
};

export default function PlacementTestPage({ params }: { params: { locale: string } }) {
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{c.subtitle}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">{c.title}</h1>
            <p className="text-[#C9D2DE] max-w-lg mx-auto">{c.body}</p>
          </div>

          <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-8 mb-8">
            <ul className="space-y-3">
              {c.levels.map((level) => (
                <li key={level} className="flex items-center gap-3 text-[#C9D2DE]">
                  <span className="h-6 w-6 rounded-full border border-[#CEA66F]/40 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-[#CEA66F]" />
                  </span>
                  {level}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Link href={`/${locale}/signup` as any} className="inline-block bg-[#D9B173] text-[#071424] font-semibold px-10 py-3 rounded-md hover:bg-[#B98A4E] transition-colors text-lg">
              {c.cta}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
