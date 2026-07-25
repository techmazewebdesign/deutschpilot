import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { ContactFormClient } from "@/components/contact/contact-form-client";
import { isPlaceholderLocale } from "@/i18n";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    title: de ? "Kontakt | DeutschPilot" : "Contact | DeutschPilot",
    description: de
      ? "Fragen zu Kursen, Niveaus oder Retreats? Kontaktiere das DeutschPilot-Team."
      : "Questions about courses, levels, or retreats? Get in touch with the DeutschPilot team.",
  };
}

const headings: Record<string, { title: string; subtitle: string }> = {
  de: { title: "Kontakt", subtitle: "Wir freuen uns von dir zu hören" },
  en: { title: "Contact", subtitle: "We'd love to hear from you" },
};

export default function ContactPage({ params }: { params: { locale: string } }) {
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

  const h = headings[locale] ?? headings.en;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{h.subtitle}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white">{h.title}</h1>
          </div>

          <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-8">
            <ContactFormClient locale={locale} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
