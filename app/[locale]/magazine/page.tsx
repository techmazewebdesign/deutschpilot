import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { BookOpen, Bell, PenLine } from "lucide-react";

export default function MagazinePage({ params }: { params: { locale: string } }) {
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

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-[#E0B873]" />,
      de: { title: "Lernartikel", body: "Tiefgehende Artikel zu Grammatik, Vokabeln und Kultur – geschrieben für echte Lernende." },
      en: { title: "Learning Articles", body: "In-depth articles on grammar, vocabulary, and culture — written for real learners." },
    },
    {
      icon: <PenLine className="h-6 w-6 text-[#E0B873]" />,
      de: { title: "Lernertipps", body: "Praktische Strategien von Sprachlernern, die es geschafft haben." },
      en: { title: "Learner Tips", body: "Practical strategies from language learners who made it." },
    },
    {
      icon: <Bell className="h-6 w-6 text-[#E0B873]" />,
      de: { title: "Benachrichtigt werden", body: "Werde als Erste/r informiert, wenn neue Artikel erscheinen." },
      en: { title: "Get Notified", body: "Be first to know when new articles go live." },
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#E0B873] uppercase mb-4">
            {de ? "Demnächst" : "Coming Soon"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-5">
            {de ? "DeutschPilot Magazin" : "DeutschPilot Magazine"}
          </h1>
          <p className="text-[#C9D2DE] max-w-xl mx-auto mb-14 leading-relaxed">
            {de
              ? "Unser Magazin ist noch in Arbeit. Wir erstellen gerade hochwertige Inhalte, die deinen Lernweg begleiten."
              : "Our magazine is still in the works. We're crafting quality content to support your learning journey."}
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-14 text-left">
            {features.map((f) => (
              <div key={f.en.title} className="bg-[#0A1E35]/70 border border-white/10 rounded-2xl p-6">
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{de ? f.de.title : f.en.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{de ? f.de.body : f.en.body}</p>
              </div>
            ))}
          </div>

          <a
            href="mailto:hello@deutschpilot.com"
            className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
          >
            {de ? "Benachrichtigung anfragen" : "Request to be notified"}
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
