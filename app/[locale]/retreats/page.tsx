import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { MapPin, Users, Calendar, Leaf } from "lucide-react";

export default function RetreatsPage({ params }: { params: { locale: string } }) {
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
      icon: <MapPin className="h-5 w-5 text-[#E0B873]" />,
      de: { title: "Deutschsprachige Umgebung", body: "Vollständig in Deutsch eintauchen – in einem inspirierenden Umfeld." },
      en: { title: "German-speaking environment", body: "Full immersion in German in an inspiring setting." },
    },
    {
      icon: <Calendar className="h-5 w-5 text-[#E0B873]" />,
      de: { title: "Strukturiertes Programm", body: "Tägliche Sprachstunden, Ausflüge und kulturelle Erlebnisse." },
      en: { title: "Structured programme", body: "Daily language sessions, excursions, and cultural experiences." },
    },
    {
      icon: <Users className="h-5 w-5 text-[#E0B873]" />,
      de: { title: "Kleine Gruppen", body: "Individuelle Betreuung und echte Gespräche in kleinen Gruppen." },
      en: { title: "Small groups", body: "Individual attention and real conversation in small groups." },
    },
    {
      icon: <Leaf className="h-5 w-5 text-[#E0B873]" />,
      de: { title: "Erholung inklusive", body: "Lerne und entspanne gleichzeitig – für nachhaltige Sprachfortschritte." },
      en: { title: "Relaxation included", body: "Learn and unwind at the same time — for lasting language progress." },
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
            {de ? "Deutsch-Retreats" : "German Retreats"}
          </h1>
          <p className="text-[#C9D2DE] max-w-xl mx-auto mb-14 leading-relaxed">
            {de
              ? "Wir planen intensive Sprachretreat-Programme. Trag dich in die Warteliste ein und wir informieren dich, sobald Termine feststehen."
              : "We're planning immersive language retreat programmes. Join the waitlist and we'll let you know as soon as dates are confirmed."}
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-14 text-left">
            {features.map((f) => (
              <div key={f.en.title} className="bg-[#0A1E35]/70 border border-white/10 rounded-2xl p-5 flex gap-4">
                <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{de ? f.de.title : f.en.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{de ? f.de.body : f.en.body}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="mailto:hello@deutschpilot.com"
            className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
          >
            {de ? "Warteliste beitreten" : "Join the waitlist"}
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
