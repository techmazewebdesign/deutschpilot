import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { Users, MessageSquare, Globe, CalendarDays, Mail } from "lucide-react";

export default async function CommunityPage({ params }: { params: { locale: string } }) {
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

  const de = locale === "de";

  const features = [
    {
      icon: MessageSquare,
      titleDE: "Sprachaustausch",
      titleEN: "Language Exchange",
      descDE: "Übe Deutsch mit Muttersprachlern und helfe anderen beim Sprachenlernen.",
      descEN: "Practice German with native speakers and help others learn their language.",
    },
    {
      icon: Users,
      titleDE: "Lerngruppen",
      titleEN: "Study Groups",
      descDE: "Schließ dich thematischen Gruppen an und lerne gemeinsam mit Gleichgesinnten.",
      descEN: "Join topic-based groups and learn together with like-minded people.",
    },
    {
      icon: CalendarDays,
      titleDE: "Live-Veranstaltungen",
      titleEN: "Live Events",
      descDE: "Nimm an Online-Workshops, Q&A-Sessions und Sprachcafés teil.",
      descEN: "Join online workshops, Q&A sessions, and language café events.",
    },
    {
      icon: Globe,
      titleDE: "Internationale Perspektiven",
      titleEN: "International Perspectives",
      descDE: "Verbinde dich mit Deutschlernenden aus verschiedenen Ländern und Kulturen.",
      descEN: "Connect with German learners from different countries and backgrounds.",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#071424]">

        {/* Hero */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(224,184,115,0.07)_0%,_transparent_60%)]" />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#E0B873]/25 bg-[#E0B873]/8">
              <Users className="h-3.5 w-3.5 text-[#E0B873]" />
              <span className="text-xs font-semibold text-[#E0B873] uppercase tracking-widest">
                {de ? "Community" : "Community"}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              {de ? "Gemeinsam lernen.\nGemeinsam wachsen." : "Learn together.\nGrow together."}
            </h1>
            <p className="text-[#C9D2DE] text-lg max-w-xl mx-auto leading-relaxed">
              {de
                ? "Die DeutschPilot-Community verbindet Lernende weltweit — zum Üben, Austauschen und gegenseitigen Motivieren."
                : "The DeutschPilot community connects learners worldwide — to practise, exchange ideas, and motivate each other."}
            </p>
          </div>
        </section>

        {/* What's coming */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em] mb-3">
              {de ? "Was dich erwartet" : "What to expect"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {de ? "Deine Lerngemeinschaft" : "Your learning community"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.titleEN} className="bg-[#0A1E35]/70 border border-white/8 rounded-2xl p-6 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#E0B873]/12 border border-[#E0B873]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-[#E0B873]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {de ? f.titleDE : f.titleEN}
                    </h3>
                    <p className="text-xs text-white/45 leading-relaxed">
                      {de ? f.descDE : f.descEN}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Coming soon CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0E2845] via-[#0A1E35] to-[#071424] p-10 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(224,184,115,0.10)_0%,_transparent_60%)]" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E0B873]/12 border border-[#E0B873]/25 mb-6 mx-auto">
                <Mail className="h-6 w-6 text-[#E0B873]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-3">
                {de ? "Community startet bald" : "Community launching soon"}
              </h2>
              <p className="text-white/50 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                {de
                  ? "Wir bauen gerade die Community auf. Schreib uns eine E-Mail, um als Erster benachrichtigt zu werden und die Gemeinschaft mitzugestalten."
                  : "We're building the community right now. Send us an email to be notified first and help shape what it becomes."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:info@deutschpilot.de?subject=Community%20Interest"
                  className="inline-flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-semibold px-7 py-3 rounded-xl hover:bg-[#C99B50] transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  {de ? "Interesse melden" : "Express Interest"}
                </a>
                <Link
                  href={`/${locale}/dashboard`}
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-medium px-7 py-3 rounded-xl hover:border-white/30 hover:text-white transition-colors text-sm"
                >
                  {de ? "Weiter lernen" : "Keep learning"}
                </Link>
              </div>
              <p className="mt-6 text-xs text-white/25">
                {de
                  ? "Oder schreib uns direkt: info@deutschpilot.de"
                  : "Or reach us directly: info@deutschpilot.de"}
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
