import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { Video, Bot, BookOpen, Globe } from "lucide-react";

export default function OnlineAcademyPage({ params }: { params: { locale: string } }) {
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
      icon: <Video className="h-6 w-6 text-[#E0B873]" />,
      de: { title: "Live-Klassen", body: "Interaktive Sessions mit erfahrenen Lehrern – zu Zeiten, die zu dir passen." },
      en: { title: "Live Classes", body: "Interactive sessions with experienced teachers — at times that work for you." },
    },
    {
      icon: <Bot className="h-6 w-6 text-[#E0B873]" />,
      de: { title: "KI-Sprachbegleiter", body: "Übe jederzeit mit unserem KI-Trainer und bekomme sofortiges Feedback." },
      en: { title: "AI Language Companion", body: "Practice any time with our AI Trainer and get instant feedback." },
    },
    {
      icon: <BookOpen className="h-6 w-6 text-[#E0B873]" />,
      de: { title: "Strukturierte Kurse", body: "Von A1 bis C1 – aufeinander aufbauende Kurse mit klarem Lehrplan." },
      en: { title: "Structured Courses", body: "From A1 to C1 — progressive courses with a clear curriculum." },
    },
    {
      icon: <Globe className="h-6 w-6 text-[#E0B873]" />,
      de: { title: "Globale Community", body: "Lerne mit Menschen aus aller Welt, die dieselben Sprachziele haben." },
      en: { title: "Global Community", body: "Learn alongside people from around the world with the same language goals." },
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
            {de ? "Online Akademie" : "Online Academy"}
          </h1>
          <p className="text-[#C9D2DE] max-w-xl mx-auto mb-14 leading-relaxed">
            {de
              ? "Die vollständige Online-Akademie mit Live-Klassen und persönlicher Betreuung befindet sich im Aufbau. Die Kurse und der KI-Trainer sind bereits jetzt verfügbar."
              : "The full online academy with live classes and personal coaching is under development. Courses and the AI Trainer are already available."}
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-14 text-left">
            {features.map((f) => (
              <div key={f.en.title} className="bg-[#0A1E35]/70 border border-white/10 rounded-2xl p-6">
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{de ? f.de.title : f.en.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{de ? f.de.body : f.en.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/courses`}
              className="inline-block bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
            >
              {de ? "Zu den Kursen" : "Browse Courses"}
            </Link>
            <a
              href="mailto:hello@deutschpilot.com"
              className="inline-block border border-white/20 text-white/70 font-semibold px-8 py-3 rounded-xl hover:border-white/40 hover:text-white transition-colors"
            >
              {de ? "Benachrichtigung anfragen" : "Request to be notified"}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
