import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import Link from "next/link";
import type { Metadata } from "next";
import { AppLayout } from "@/components/app/app-layout";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import {
  Lock,
  ChevronRight,
  BookOpen,
  Users,
  Globe,
  ShoppingBag,
  Award,
  MapPin,
  Stethoscope,
  Clock,
  CheckCircle2,
  FlaskConical,
  Briefcase,
  Home,
  PartyPopper,
  MessageSquare,
  Newspaper,
  Leaf,
  GraduationCap,
  Building2,
  Heart,
  Landmark,
  Palette,
  TrendingUp,
  Languages,
  Microscope,
  BookMarked,
  Handshake,
  Scale,
  Brain,
  Megaphone,
} from "lucide-react";
import { isPaidLevel, hasLevelAccess } from "@/lib/entitlements";
import { UpgradeWall } from "@/components/learn/upgrade-wall";
import { pageAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    alternates: pageAlternates(params.locale, "/rooms"),
    title: de
      ? "Lernräume: Deutsch lernen Thema für Thema | DeutschPilot"
      : "Learning Rooms: Learn German Topic by Topic | DeutschPilot",
    description: de
      ? "Themenräume mit Lektionen, Übungen und Checkpoint-Quiz: von Begrüßungen (A1) bis Feste & Kultur (A2). Schalte Raum für Raum frei."
      : "Themed rooms with lessons, exercises, and checkpoint quizzes: from Greetings (A1) to Celebrations & Culture (A2). Unlock room by room.",
  };
}

const LEVELS_ORDER = ["A1", "A2", "B1", "B2", "C1"] as const;
type Level = (typeof LEVELS_ORDER)[number];

// Rooms defined per level — currently only A1 is fully built
const ROOM_META: Record<
  Level,
  {
    slug: string;
    icon: React.ElementType;
    titleDE: string;
    titleEN: string;
    descDE: string;
    descEN: string;
  }[]
> = {
  A1: [
    {
      slug: "greetings",
      icon: Users,
      titleDE: "Begrüßungen & Vorstellungen",
      titleEN: "Greetings & Introductions",
      descDE: "Erste Kontakte knüpfen, sich vorstellen, grüßen.",
      descEN: "Make first contacts, introduce yourself, greet others.",
    },
    {
      slug: "numbers-time",
      icon: Clock,
      titleDE: "Zahlen, Zeit & Datum",
      titleEN: "Numbers, Time & Dates",
      descDE: "Zahlen, Uhrzeit, Datum und Wochentage auf Deutsch.",
      descEN: "Numbers, clock time, dates, and days of the week.",
    },
    {
      slug: "a1-family-life",
      icon: Users,
      titleDE: "Familie & Persönliches Leben",
      titleEN: "Family & Personal Life",
      descDE: "Familie beschreiben, Hobbys und persönliche Informationen teilen.",
      descEN: "Describe family, share hobbies and personal information.",
    },
    {
      slug: "a1-shopping",
      icon: ShoppingBag,
      titleDE: "Einkaufen & Alltag",
      titleEN: "Shopping & Daily Needs",
      descDE: "Im Supermarkt, Preise verstehen, nach Produkten fragen.",
      descEN: "At the supermarket, understand prices, ask for products.",
    },
    {
      slug: "a1-food-restaurants",
      icon: MapPin,
      titleDE: "Essen & Restaurants",
      titleEN: "Food & Restaurants",
      descDE: "Mahlzeiten benennen, im Restaurant bestellen, über Vorlieben sprechen.",
      descEN: "Name meals, order in a restaurant, talk about food preferences.",
    },
    {
      slug: "a1-getting-around",
      icon: Stethoscope,
      titleDE: "Unterwegs in der Stadt",
      titleEN: "Getting Around",
      descDE: "Nach dem Weg fragen, öffentliche Verkehrsmittel nutzen, Reisen planen.",
      descEN: "Ask for directions, use public transport, and plan a trip.",
    },
  ],
  A2: [
    {
      slug: "daily-routines-a2",
      icon: Clock,
      titleDE: "Alltag & Tagesablauf",
      titleEN: "Daily Life & Routines",
      descDE: "Reflexive und trennbare Verben, Häufigkeit und präzise Zeitangaben.",
      descEN: "Reflexive and separable verbs, frequency, and precise time expressions.",
    },
    {
      slug: "travel-transport-a2",
      icon: MapPin,
      titleDE: "Reisen & Verkehr",
      titleEN: "Travel & Transport",
      descDE: "Tickets kaufen, im Perfekt von Reisen erzählen, Probleme unterwegs lösen.",
      descEN: "Buy tickets, tell travel stories in the Perfekt, solve problems on the road.",
    },
    {
      slug: "health-body-a2",
      icon: Stethoscope,
      titleDE: "Gesundheit & Körper",
      titleEN: "Health & Body",
      descDE: "Beschwerden beschreiben, beim Arzt sprechen, Ratschläge mit dem Imperativ.",
      descEN: "Describe symptoms, talk at the doctor's, give advice with the imperative.",
    },
    {
      slug: "work-career-a2",
      icon: Briefcase,
      titleDE: "Arbeit & Beruf",
      titleEN: "Work & Career",
      descDE: "Über den Job sprechen, Gründe mit weil und dass, Telefon und E-Mail.",
      descEN: "Talk about your job, give reasons with weil and dass, phone and email.",
    },
    {
      slug: "living-together-a2",
      icon: Home,
      titleDE: "Wohnen & Zusammenleben",
      titleEN: "Housing & Living Together",
      descDE: "Wohnungssuche, Wechselpräpositionen und Vergleiche mit dem Komparativ.",
      descEN: "Flat hunting, two-way prepositions, and comparisons with the comparative.",
    },
    {
      slug: "celebrations-culture-a2",
      icon: PartyPopper,
      titleDE: "Feste & Kultur",
      titleEN: "Celebrations & Culture",
      descDE: "Deutsche Feste, Einladungen zu- und absagen, erzählen mit war und hatte.",
      descEN: "German holidays, accepting and declining invitations, stories with war and hatte.",
    },
  ],
  B1: [
    {
      slug: "opinions-discussions-b1",
      icon: MessageSquare,
      titleDE: "Meinungen & Diskussionen",
      titleEN: "Opinions & Discussions",
      descDE: "Meinungen äußern, höflich widersprechen und Argumente mit Konnektoren verbinden.",
      descEN: "State opinions, disagree politely, and connect arguments with connectors.",
    },
    {
      slug: "media-news-b1",
      icon: Newspaper,
      titleDE: "Medien & Nachrichten",
      titleEN: "Media & News",
      descDE: "Nachrichtensprache verstehen, indirekte Rede und das Passiv meistern.",
      descEN: "Understand news language, master reported speech and the passive voice.",
    },
    {
      slug: "environment-b1",
      icon: Leaf,
      titleDE: "Umwelt & Nachhaltigkeit",
      titleEN: "Environment & Sustainability",
      descDE: "Umweltthemen diskutieren, wenn-Sätze und Prognosen mit dem Futur.",
      descEN: "Discuss environmental topics, wenn-clauses, and predictions with the future tense.",
    },
    {
      slug: "education-b1",
      icon: GraduationCap,
      titleDE: "Bildung & Weiterbildung",
      titleEN: "Education & Training",
      descDE: "Der deutsche Bildungsweg, Infinitiv mit zu und Kursangebote verstehen.",
      descEN: "The German education path, Infinitiv mit zu, and understanding course offers.",
    },
    {
      slug: "bureaucracy-b1",
      icon: Building2,
      titleDE: "Behörden & Formalitäten",
      titleEN: "Bureaucracy & Formalities",
      descDE: "Anmeldung, Behördenbriefe verstehen und höfliche Anfragen im Konjunktiv II.",
      descEN: "Registration, understanding official letters, and polite requests in Konjunktiv II.",
    },
    {
      slug: "society-relationships-b1",
      icon: Heart,
      titleDE: "Beziehungen & Gesellschaft",
      titleEN: "Relationships & Society",
      descDE: "Relativsätze, Small-Talk-Kultur und Gefühle differenziert ausdrücken.",
      descEN: "Relative clauses, small-talk culture, and expressing feelings precisely.",
    },
  ],
  B2: [
    {
      slug: "work-applications-b2",
      icon: Briefcase,
      titleDE: "Arbeitswelt & Bewerbung",
      titleEN: "Work & Applications",
      descDE:
        "Überzeugende Bewerbungen, formelle Korrespondenz und souveräne Vorstellungsgespräche.",
      descEN: "Convincing applications, formal correspondence, and confident job interviews.",
    },
    {
      slug: "science-technology-b2",
      icon: FlaskConical,
      titleDE: "Wissenschaft & Technik",
      titleEN: "Science & Technology",
      descDE: "Nominalstil, Passiv mit Modalverben und Prozesse präzise beschreiben.",
      descEN: "Nominal style, passive with modal verbs, and describing processes precisely.",
    },
    {
      slug: "politics-society-b2",
      icon: Landmark,
      titleDE: "Politik & Gesellschaft",
      titleEN: "Politics & Society",
      descDE: "Gekonnt debattieren, Konjunktiv I erkennen und das politische System verstehen.",
      descEN: "Debate skillfully, recognize Konjunktiv I, and understand the political system.",
    },
    {
      slug: "arts-culture-b2",
      icon: Palette,
      titleDE: "Kunst & Kultur",
      titleEN: "Arts & Culture",
      descDE: "Rezensionen schreiben, Partizipialattribute entpacken, Kulturszene entdecken.",
      descEN: "Write reviews, unpack participle attributes, discover the culture scene.",
    },
    {
      slug: "economy-consumption-b2",
      icon: TrendingUp,
      titleDE: "Wirtschaft & Konsum",
      titleEN: "Economy & Consumption",
      descDE: "Wirtschaftssprache, zweiteilige Konnektoren und die Konsumdebatte.",
      descEN: "Economic language, two-part connectors, and the consumption debate.",
    },
    {
      slug: "language-identity-b2",
      icon: Languages,
      titleDE: "Sprache & Identität",
      titleEN: "Language & Identity",
      descDE: "Echte Redewendungen, Registerwechsel und Mehrsprachigkeit als Stärke.",
      descEN: "Real idioms, register switching, and multilingualism as a strength.",
    },
  ],
  C1: [
    {
      slug: "science-research-c1",
      icon: Microscope,
      titleDE: "Wissenschaft & Forschung",
      titleEN: "Science & Research",
      descDE:
        "Akademischer Nominalstil, vorsichtige Formulierungen und Quellenarbeit auf hohem Niveau.",
      descEN: "Academic nominal style, hedged claims, and source work at an advanced level.",
    },
    {
      slug: "literature-style-analysis-c1",
      icon: BookMarked,
      titleDE: "Literatur & Stilanalyse",
      titleEN: "Literature & Stylistic Analysis",
      descDE:
        "Stilmittel erkennen, Erzählperspektiven analysieren und eine Textinterpretation verfassen.",
      descEN:
        "Recognize stylistic devices, analyze narrative perspective, and write a text interpretation.",
    },
    {
      slug: "business-negotiation-c1",
      icon: Handshake,
      titleDE: "Wirtschaft & Verhandlung",
      titleEN: "Business & Negotiation",
      descDE:
        "Verhandlungssprache, Konjunktiv I in Geschäftsberichten und diplomatischer Widerspruch.",
      descEN:
        "Negotiation language, Konjunktiv I in business reporting, and diplomatic disagreement.",
    },
    {
      slug: "law-administration-c1",
      icon: Scale,
      titleDE: "Recht & Verwaltung",
      titleEN: "Law & Administration",
      descDE: "Amtsdeutsch verstehen, Verträge lesen und formell Widerspruch einlegen.",
      descEN: "Understand official German, read contracts, and file a formal objection.",
    },
    {
      slug: "philosophy-abstraction-c1",
      icon: Brain,
      titleDE: "Philosophie & Abstraktion",
      titleEN: "Philosophy & Abstract Thought",
      descDE: "Abstrakte Nominalphrasen, philosophische Argumentation und präzises Vokabular.",
      descEN: "Abstract noun phrases, philosophical argumentation, and precise vocabulary.",
    },
    {
      slug: "rhetoric-debate-c1",
      icon: Megaphone,
      titleDE: "Rhetorik & Debattieren",
      titleEN: "Rhetoric & Debate",
      descDE: "Debattenstruktur, Gegenargumente und rhetorische Strategien meistern.",
      descEN: "Master debate structure, counter-arguments, and rhetorical strategies.",
    },
  ],
};

export default async function RoomsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { level?: string };
}) {
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

  // Public page: guests browse the room overview (no progress, A1 view);
  // entering a room still requires signing in.
  const session = await auth();
  const isGuest = !session?.user;
  const isAdmin = session?.user?.role === "admin";

  const supabase = createServerSupabaseClient();
  const privateDb = session?.user ? await legacyLearningClient(session.user.id) : null;
  const de = locale === "de";

  // Get user's level from placement test or profile (guests default to A1)
  let userLevel: Level = "A1";
  if (session?.user) {
    const [profileRes, placementRes] = await Promise.all([
      privateDb!
        .from("profiles")
        .select("german_level")
        .eq("firebase_uid", session.user.id)
        .maybeSingle(),
      privateDb!
        .from("placement_tests")
        .select("level_result")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    requireQuery(profileRes, "rooms.profile");
    requireQuery(placementRes, "rooms.placement");
    userLevel = (placementRes.data?.level_result ?? profileRes.data?.german_level ?? "A1") as Level;
  }

  // Active tab: from query param or user's level
  const requestedLevel = searchParams?.level as Level | undefined;
  const activeLevel: Level =
    requestedLevel && LEVELS_ORDER.includes(requestedLevel as Level)
      ? (requestedLevel as Level)
      : userLevel;

  const rooms = ROOM_META[activeLevel] ?? [];
  const slugs = rooms.map((r) => r.slug);

  const levelLocked =
    !isGuest &&
    isPaidLevel(activeLevel) &&
    !(await hasLevelAccess(session!.user.id, activeLevel, session!.user.role));

  // Fetch courses + progress for the active level (guests have no progress)
  const [coursesRes, progressRes] = await Promise.all([
    slugs.length > 0
      ? supabase
          .from("courses")
          .select("id, slug, level")
          .in("slug", slugs)
          .eq("is_published", true)
      : Promise.resolve({ data: [] }),
    session?.user
      ? privateDb!
          .from("student_progress")
          .select("lesson_id, course_id, completed, score")
          .eq("user_id", session.user.id)
      : Promise.resolve({ data: [] }),
  ]);

  requireQuery(coursesRes, "rooms.courses");
  requireQuery(progressRes, "rooms.progress");
  const courses = (coursesRes.data ?? []) as { id: string; slug: string; level: string }[];
  const progress = (progressRes.data ?? []) as {
    lesson_id: string;
    course_id: string;
    completed: boolean;
    score: number;
  }[];
  const courseMap = new Map(courses.map((c) => [c.slug, c]));

  let allLessons: { id: string; course_id: string; order_index: number }[] = [];
  if (courses.length > 0) {
    const lessonCountRes = await supabase
      .from("lessons")
      .select("id, course_id, order_index")
      .in(
        "course_id",
        courses.map((c) => c.id)
      );
    requireQuery(lessonCountRes, "rooms.lessons");
    allLessons = (lessonCountRes.data ?? []) as {
      id: string;
      course_id: string;
      order_index: number;
    }[];
  }

  const quizLessonByCourse = new Map<string, string>();
  const normalLessonsByCourse = new Map<string, string[]>();
  for (const l of allLessons) {
    if (l.order_index === 99) quizLessonByCourse.set(l.course_id, l.id);
    else {
      const arr = normalLessonsByCourse.get(l.course_id) ?? [];
      arr.push(l.id);
      normalLessonsByCourse.set(l.course_id, arr);
    }
  }

  const progressByCourse = new Map<string, typeof progress>();
  for (const p of progress) {
    const arr = progressByCourse.get(p.course_id) ?? [];
    arr.push(p);
    progressByCourse.set(p.course_id, arr);
  }

  type RoomData = {
    slug: string;
    courseId: string | null;
    totalLessons: number;
    completedLessons: number;
    progressPct: number;
    quizPassed: boolean;
    quizScore: number | null;
  };

  const roomData: RoomData[] = rooms.map((meta) => {
    const course = courseMap.get(meta.slug);
    if (!course)
      return {
        slug: meta.slug,
        courseId: null,
        totalLessons: 0,
        completedLessons: 0,
        progressPct: 0,
        quizPassed: false,
        quizScore: null,
      };
    const cid = course.id;
    const normalLessons = normalLessonsByCourse.get(cid) ?? [];
    const totalLessons = normalLessons.length;
    const courseProgress = progressByCourse.get(cid) ?? [];
    const completedIds = new Set(
      courseProgress
        .filter((p) => p.completed && p.lesson_id !== quizLessonByCourse.get(cid))
        .map((p) => p.lesson_id)
    );
    const completedLessons = normalLessons.filter((id) => completedIds.has(id)).length;
    const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const quizLessonId = quizLessonByCourse.get(cid);
    const quizProgress = quizLessonId
      ? courseProgress.find((p) => p.lesson_id === quizLessonId)
      : null;
    return {
      slug: meta.slug,
      courseId: cid,
      totalLessons,
      completedLessons,
      progressPct,
      quizPassed: quizProgress?.completed ?? false,
      quizScore: quizProgress?.score ?? null,
    };
  });

  // Unlock logic: sequential — room N unlocks when room N-1 quiz is passed.
  // Admins get every room open, so they can preview/QA any content freely.
  const unlockedRooms = new Set<string>();
  if (isAdmin) {
    rooms.forEach((r) => unlockedRooms.add(r.slug));
  } else {
    if (rooms.length > 0) unlockedRooms.add(rooms[0].slug);
    for (let i = 1; i < rooms.length; i++) {
      if (roomData[i - 1].quizPassed) unlockedRooms.add(rooms[i].slug);
      else break;
    }
  }

  const levelIndexMap: Record<Level, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
  const userLevelIndex = levelIndexMap[userLevel];

  const content = (
    <div className="mx-auto w-full max-w-5xl px-5 py-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#E0B873]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E0B873]/70">
            {de ? "Lernräume" : "Learning Rooms"}
          </span>
        </div>
        <h1 className="mb-2 font-serif text-3xl font-bold text-white">
          {de ? "Lernräume" : "Learning Rooms"}
        </h1>
        <p className="max-w-xl text-sm text-white/45">
          {de
            ? "Jeder Raum ist ein Themenbereich mit Lektionen, Übungen und einem Checkpoint-Quiz."
            : "Each room is a topic area with lessons, exercises, and a checkpoint quiz."}
        </p>
      </div>

      {/* Level tab bar */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1">
        {LEVELS_ORDER.map((lvl, i) => {
          const isActive = lvl === activeLevel;
          const isUserLevel = lvl === userLevel;
          const isAccessible = isAdmin || i <= userLevelIndex;
          const hasRooms = ROOM_META[lvl].length > 0;
          return (
            <Link
              key={lvl}
              href={isAccessible && hasRooms ? `/${locale}/rooms?level=${lvl}` : "#"}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "border border-[#E0B873]/30 bg-[#E0B873]/15 text-[#E0B873]"
                  : isAccessible && hasRooms
                    ? "border-white/12 border text-white/50 hover:border-white/25 hover:text-white/80"
                    : "border-white/6 cursor-not-allowed border text-white/20"
              }`}
            >
              {lvl}
              {isUserLevel && !isActive && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E0B873]/60" />
              )}
              {(!isAccessible || !hasRooms) && <Lock className="h-2.5 w-2.5" />}
            </Link>
          );
        })}
        <Link
          href={`/${locale}/placement-test`}
          className="border-white/8 flex flex-shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-white/30 transition-colors hover:border-[#E0B873]/25 hover:text-[#E0B873]/70"
        >
          <FlaskConical className="h-3 w-3" />
          {de ? "Level-Test" : "Level test"}
        </Link>
      </div>

      {/* No rooms for this level yet */}
      {rooms.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Lock className="h-7 w-7 text-white/25" />
          </div>
          <h2 className="mb-2 font-serif text-xl font-bold text-white">
            {de ? `${activeLevel} kommt bald` : `${activeLevel} coming soon`}
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-sm text-white/40">
            {de
              ? `Wir arbeiten gerade an den ${activeLevel}-Räumen. Sie werden bald verfügbar sein.`
              : `We're currently building the ${activeLevel} rooms. They'll be available soon.`}
          </p>
          <Link
            href={`/${locale}/rooms?level=A1`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E0B873]/20 bg-[#E0B873]/10 px-5 py-2.5 text-sm font-semibold text-[#E0B873] transition-colors hover:bg-[#E0B873]/20"
          >
            {de ? "Zurück zu A1" : "Back to A1"}
          </Link>
        </div>
      ) : levelLocked ? (
        <UpgradeWall
          locale={locale}
          level={activeLevel as "A2" | "B1" | "B2" | "C1"}
          backHref={`/${locale}/levels`}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((meta, idx) => {
              const Icon = meta.icon;
              const rd = roomData[idx];
              const unlocked = unlockedRooms.has(meta.slug);
              return (
                <div
                  key={meta.slug}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
                    unlocked
                      ? "border-white/10 bg-[#0A1E35]/70 backdrop-blur-sm hover:border-[#E0B873]/25"
                      : "border-white/6 bg-[#0A1E35]/30 opacity-55"
                  }`}
                >
                  <div className="absolute right-4 top-4">
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-bold text-white/20">
                      {de ? `Raum ${idx + 1}` : `Room ${idx + 1}`}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${unlocked ? "bg-[#E0B873]/12 border border-[#E0B873]/20" : "border-white/8 border bg-white/5"}`}
                    >
                      {unlocked ? (
                        <Icon className="h-5 w-5 text-[#E0B873]" />
                      ) : (
                        <Lock className="h-5 w-5 text-white/25" />
                      )}
                    </div>
                    <h3
                      className={`mb-1.5 text-sm font-semibold leading-snug ${unlocked ? "text-white" : "text-white/35"}`}
                    >
                      {de ? meta.titleDE : meta.titleEN}
                    </h3>
                    <p className="mb-4 flex-1 text-xs leading-relaxed text-white/35">
                      {de ? meta.descDE : meta.descEN}
                    </p>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-white/35">
                        <BookOpen className="h-3 w-3" />
                        <span>
                          {rd.totalLessons || "…"} {de ? "Lektionen" : "lessons"}
                        </span>
                      </div>
                      {rd.quizPassed ? (
                        <div className="flex items-center gap-1 text-xs text-[#E0B873]/60">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>
                            {de ? `Bestanden (${rd.quizScore}%)` : `Passed (${rd.quizScore}%)`}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-white/20">
                          <Lock className="h-3 w-3" />
                          <span>{de ? "Checkpoint offen" : "Checkpoint open"}</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <div className="mb-1.5 flex items-center justify-between text-[10px] text-white/30">
                        <span>{de ? "Fortschritt" : "Progress"}</span>
                        <span>
                          {rd.completedLessons}/{rd.totalLessons || "?"}
                        </span>
                      </div>
                      <div className="bg-white/6 h-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] transition-all"
                          style={{ width: `${rd.progressPct}%` }}
                        />
                      </div>
                    </div>
                    {unlocked ? (
                      <Link
                        href={`/${locale}/rooms/${meta.slug}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E0B873]/20 bg-[#E0B873]/10 py-2.5 text-xs font-semibold text-[#E0B873] transition-colors hover:bg-[#E0B873]/20"
                      >
                        {de ? "Raum betreten" : "Enter Room"}{" "}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <div className="bg-white/3 border-white/8 flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-medium text-white/25">
                        <Lock className="h-3.5 w-3.5" />
                        {de ? "Vorherigen Raum abschließen" : "Complete previous room"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white/3 border-white/6 mt-6 flex items-start gap-3 rounded-2xl border p-4">
            <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/30" />
            <p className="text-xs text-white/35">
              {de
                ? "Räume werden sequenziell freigeschaltet. Bestehe das Checkpoint-Quiz (≥70%) um den nächsten Raum zu öffnen."
                : "Rooms unlock sequentially. Pass the checkpoint quiz (≥70%) to open the next room."}
            </p>
          </div>

          {(activeLevel === "B1" || activeLevel === "B2") && !isGuest && (
            <Link
              href={`/${locale}/mock-exam/${activeLevel}`}
              className="mt-4 flex items-center gap-4 rounded-2xl border border-[#E0B873]/20 bg-[#E0B873]/5 p-5 transition-colors hover:bg-[#E0B873]/10"
            >
              <Award className="h-8 w-8 flex-shrink-0 text-[#E0B873]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {de ? `${activeLevel} Modellprüfung` : `${activeLevel} Mock Exam`}
                </p>
                <p className="text-xs text-white/40">
                  {de
                    ? "Teste dich im echten Prüfungsformat, bevor du zur echten Prüfung gehst."
                    : "Test yourself in the real exam format before the real thing."}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/25" />
            </Link>
          )}

          {/* Guest sign-up CTA */}
          {isGuest && (
            <div className="bg-[#E0B873]/8 mt-6 rounded-2xl border border-[#E0B873]/25 p-6 text-center">
              <h2 className="mb-1.5 font-serif text-lg font-bold text-white">
                {de ? "Starte deinen ersten Raum" : "Start your first room"}
              </h2>
              <p className="mx-auto mb-4 max-w-md text-sm text-white/50">
                {de
                  ? "Erstelle ein kostenloses Konto, um Räume zu betreten und deinen Fortschritt zu speichern."
                  : "Create a free account to enter rooms and save your progress."}
              </p>
              <Link
                href={`/${locale}/signup`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E0B873] px-6 py-2.5 text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50]"
              >
                {de ? "Kostenlos starten" : "Start for free"} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!session?.user) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-[#071424]">{content}</main>
        <Footer />
      </>
    );
  }

  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";
  return (
    <AppLayout locale={locale} userName={userName} userLevel={userLevel}>
      {content}
    </AppLayout>
  );
}
