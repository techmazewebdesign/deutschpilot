import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

const articles = [
  { slug: "1", de: { title: "10 Tipps für schnelles Deutsch lernen", category: "Lerntipps" }, en: { title: "10 Tips for Learning German Fast", category: "Learning Tips" } },
  { slug: "2", de: { title: "Die besten Apps für Deutschlerner", category: "Ressourcen" }, en: { title: "The Best Apps for German Learners", category: "Resources" } },
  { slug: "3", de: { title: "Grammatik ohne Stress: Ein Leitfaden", category: "Grammatik" }, en: { title: "Grammar Without Stress: A Guide", category: "Grammar" } },
];

export default function MagazinePage({ params }: { params: { locale: string } }) {
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

  const heading = locale === "de" ? "Magazin" : "Magazine";
  const subheading = locale === "de" ? "Tipps, Guides & Inspiration" : "Tips, guides & inspiration";

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{subheading}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white">{heading}</h1>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const a = locale === "de" ? article.de : article.en;
              return (
                <div key={article.slug} className="bg-[#0B1B33]/50 border border-white/10 rounded-xl overflow-hidden hover:border-[#CEA66F]/30 transition-colors group">
                  <div className="h-40 bg-gradient-to-br from-[#1B3150] to-[#0B1B33]" />
                  <div className="p-5">
                    <span className="text-[10px] font-medium tracking-wider text-[#CEA66F] uppercase">{a.category}</span>
                    <h2 className="text-white font-semibold mt-2 mb-3 group-hover:text-[#CEA66F] transition-colors">{a.title}</h2>
                    <Link href={`/${locale}/magazine` as any} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                      {locale === "de" ? "Weiterlesen →" : "Read more →"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
