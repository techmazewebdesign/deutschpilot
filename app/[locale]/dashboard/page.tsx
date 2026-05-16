import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

const content: Record<string, { title: string; subtitle: string; body: string; cta: string }> = {
  de: { title: "Dashboard", subtitle: "Dein Lernbereich", body: "Melde dich an, um auf dein persönliches Dashboard zuzugreifen und deinen Lernfortschritt zu verfolgen.", cta: "Anmelden" },
  en: { title: "Dashboard", subtitle: "Your learning area", body: "Sign in to access your personal dashboard and track your learning progress.", cta: "Sign in" },
};

export default function DashboardPage({ params }: { params: { locale: string } }) {
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#CEA66F]/30 bg-[#CEA66F]/10 mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-[#CEA66F]" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{c.subtitle}</p>
          <h1 className="text-4xl font-serif font-bold text-white mb-4">{c.title}</h1>
          <p className="text-[#C9D2DE] mb-8 max-w-sm mx-auto">{c.body}</p>
          <Link href={`/${locale}/login` as any} className="inline-block bg-[#D9B173] text-[#071424] font-semibold px-8 py-3 rounded-md hover:bg-[#B98A4E] transition-colors">
            {c.cta}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
