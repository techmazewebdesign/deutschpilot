import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { PLACEHOLDER_LOCALES } from "@/i18n";

const content: Record<string, { title: string; subtitle: string; name: string; email: string; message: string; send: string }> = {
  de: { title: "Kontakt", subtitle: "Wir freuen uns von dir zu hören", name: "Name", email: "E-Mail", message: "Nachricht", send: "Senden" },
  en: { title: "Contact", subtitle: "We'd love to hear from you", name: "Name", email: "Email", message: "Message", send: "Send" },
};

export default function ContactPage({ params }: { params: { locale: string } }) {
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">{c.subtitle}</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white">{c.title}</h1>
          </div>

          <div className="bg-[#0B1B33]/50 border border-white/10 rounded-xl p-8">
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{c.name}</label>
                <input type="text" className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CEA66F]/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{c.email}</label>
                <input type="email" className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CEA66F]/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">{c.message}</label>
                <textarea rows={5} className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CEA66F]/50 transition-colors resize-none" />
              </div>
              <button type="submit" className="w-full bg-[#D9B173] text-[#071424] font-semibold py-2.5 rounded-md hover:bg-[#B98A4E] transition-colors">
                {c.send}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
