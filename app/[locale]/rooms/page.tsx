import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import {
  Lock, ChevronRight, BookOpen, Users, Globe, ShoppingBag,
  MapPin, Stethoscope, Clock, CheckCircle2, FlaskConical,
} from "lucide-react";

export const dynamic = "force-dynamic";

const LEVELS_ORDER = ["A1", "A2", "B1", "B2", "C1"] as const;
type Level = typeof LEVELS_ORDER[number];

// Rooms defined per level — currently only A1 is fully built
const ROOM_META: Record<Level, { slug: string; icon: React.ElementType; titleDE: string; titleEN: string; descDE: string; descEN: string }[]> = {
  A1: [
    { slug: "greetings", icon: Users, titleDE: "Begrüßungen & Vorstellungen", titleEN: "Greetings & Introductions", descDE: "Erste Kontakte knüpfen, sich vorstellen, grüßen.", descEN: "Make first contacts, introduce yourself, greet others." },
    { slug: "numbers-time", icon: Clock, titleDE: "Zahlen, Zeit & Datum", titleEN: "Numbers, Time & Dates", descDE: "Zahlen, Uhrzeit, Datum und Wochentage auf Deutsch.", descEN: "Numbers, clock time, dates, and days of the week." },
    { slug: "family-life", icon: Users, titleDE: "Familie & Persönliches Leben", titleEN: "Family & Personal Life", descDE: "Familie beschreiben, Hobbys und persönliche Informationen teilen.", descEN: "Describe family, share hobbies and personal information." },
    { slug: "shopping", icon: ShoppingBag, titleDE: "Einkaufen & Alltag", titleEN: "Shopping & Daily Needs", descDE: "Im Supermarkt, Preise verstehen, nach Produkten fragen.", descEN: "At the supermarket, understand prices, ask for products." },
    { slug: "city-transport", icon: MapPin, titleDE: "Stadt, Transport & Wegbeschreibung", titleEN: "City, Transport & Directions", descDE: "Sich in der Stadt zurechtfinden, öffentliche Verkehrsmittel nutzen.", descEN: "Navigate the city, use public transport, ask for directions." },
    { slug: "real-life", icon: Stethoscope, titleDE: "Arzt, Büro & Alltag", titleEN: "Doctor, Office & Real Life", descDE: "Beim Arzt, im Büro und in alltäglichen Situationen kommunizieren.", descEN: "Communicate at the doctor, office and everyday situations." },
  ],
  A2: [], B1: [], B2: [], C1: [],
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

  const supabase = createServerSupabaseClient();
  const de = locale === "de";

  // Get user's level from placement test or profile (guests default to A1)
  let userLevel: Level = "A1";
  if (session?.user) {
    const [profileRes, placementRes] = await Promise.all([
      supabase.from("profiles").select("german_level").eq("id", session.user.id).single(),
      supabase.from("placement_tests").select("level_result").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(1).single(),
    ]);
    userLevel = (placementRes.data?.level_result ?? profileRes.data?.german_level ?? "A1") as Level;
  }

  // Active tab: from query param or user's level
  const requestedLevel = searchParams?.level as Level | undefined;
  const activeLevel: Level = (requestedLevel && LEVELS_ORDER.includes(requestedLevel as Level)) ? requestedLevel as Level : userLevel;

  const rooms = ROOM_META[activeLevel] ?? [];
  const slugs = rooms.map((r) => r.slug);

  // Fetch courses + progress for the active level (guests have no progress)
  const [coursesRes, progressRes] = await Promise.all([
    slugs.length > 0
      ? supabase.from("courses").select("id, slug, level").in("slug", slugs)
      : Promise.resolve({ data: [] }),
    session?.user
      ? supabase.from("student_progress").select("lesson_id, course_id, completed, score").eq("user_id", session.user.id)
      : Promise.resolve({ data: [] }),
  ]);

  const courses = (coursesRes.data ?? []) as { id: string; slug: string; level: string }[];
  const progress = progressRes.data ?? [];
  const courseMap = new Map(courses.map((c) => [c.slug, c]));

  let allLessons: { id: string; course_id: string; order_index: number }[] = [];
  if (courses.length > 0) {
    const lessonCountRes = await supabase
      .from("lessons")
      .select("id, course_id, order_index")
      .in("course_id", courses.map((c) => c.id));
    allLessons = (lessonCountRes.data ?? []) as { id: string; course_id: string; order_index: number }[];
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

  type RoomData = { slug: string; courseId: string | null; totalLessons: number; completedLessons: number; progressPct: number; quizPassed: boolean; quizScore: number | null };

  const roomData: RoomData[] = rooms.map((meta) => {
    const course = courseMap.get(meta.slug);
    if (!course) return { slug: meta.slug, courseId: null, totalLessons: 0, completedLessons: 0, progressPct: 0, quizPassed: false, quizScore: null };
    const cid = course.id;
    const normalLessons = normalLessonsByCourse.get(cid) ?? [];
    const totalLessons = normalLessons.length;
    const courseProgress = progressByCourse.get(cid) ?? [];
    const completedIds = new Set(courseProgress.filter((p) => p.completed && p.lesson_id !== quizLessonByCourse.get(cid)).map((p) => p.lesson_id));
    const completedLessons = normalLessons.filter((id) => completedIds.has(id)).length;
    const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const quizLessonId = quizLessonByCourse.get(cid);
    const quizProgress = quizLessonId ? courseProgress.find((p) => p.lesson_id === quizLessonId) : null;
    return { slug: meta.slug, courseId: cid, totalLessons, completedLessons, progressPct, quizPassed: quizProgress?.completed ?? false, quizScore: quizProgress?.score ?? null };
  });

  // Unlock logic: sequential — room N unlocks when room N-1 quiz is passed
  const unlockedRooms = new Set<string>();
  if (rooms.length > 0) unlockedRooms.add(rooms[0].slug);
  for (let i = 1; i < rooms.length; i++) {
    if (roomData[i - 1].quizPassed) unlockedRooms.add(rooms[i].slug);
    else break;
  }

  const levelIndexMap: Record<Level, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
  const userLevelIndex = levelIndexMap[userLevel];

  const content = (
      <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-5xl w-full mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-[#E0B873]" />
            <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">
              {de ? "Lernräume" : "Learning Rooms"}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {de ? "Lernräume" : "Learning Rooms"}
          </h1>
          <p className="text-sm text-white/45 max-w-xl">
            {de
              ? "Jeder Raum ist ein Themenbereich mit Lektionen, Übungen und einem Checkpoint-Quiz."
              : "Each room is a topic area with lessons, exercises, and a checkpoint quiz."}
          </p>
        </div>

        {/* Level tab bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {LEVELS_ORDER.map((lvl, i) => {
            const isActive = lvl === activeLevel;
            const isUserLevel = lvl === userLevel;
            const isAccessible = i <= userLevelIndex;
            const hasRooms = ROOM_META[lvl].length > 0;
            return (
              <Link
                key={lvl}
                href={isAccessible && hasRooms ? `/${locale}/rooms?level=${lvl}` : "#"}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#E0B873]/15 text-[#E0B873] border border-[#E0B873]/30"
                    : isAccessible && hasRooms
                    ? "text-white/50 border border-white/12 hover:border-white/25 hover:text-white/80"
                    : "text-white/20 border border-white/6 cursor-not-allowed"
                }`}
              >
                {lvl}
                {isUserLevel && !isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#E0B873]/60 inline-block" />}
                {(!isAccessible || !hasRooms) && <Lock className="h-2.5 w-2.5" />}
              </Link>
            );
          })}
          <Link
            href={`/${locale}/placement-test`}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 border border-white/8 hover:border-[#E0B873]/25 hover:text-[#E0B873]/70 transition-colors"
          >
            <FlaskConical className="h-3 w-3" />
            {de ? "Level-Test" : "Level test"}
          </Link>
        </div>

        {/* No rooms for this level yet */}
        {rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6 mx-auto">
              <Lock className="h-7 w-7 text-white/25" />
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              {de ? `${activeLevel} kommt bald` : `${activeLevel} coming soon`}
            </h2>
            <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
              {de
                ? `Wir arbeiten gerade an den ${activeLevel}-Räumen. Sie werden bald verfügbar sein.`
                : `We're currently building the ${activeLevel} rooms. They'll be available soon.`}
            </p>
            <Link
              href={`/${locale}/rooms?level=A1`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E0B873]/10 border border-[#E0B873]/20 text-[#E0B873] text-sm font-semibold hover:bg-[#E0B873]/20 transition-colors"
            >
              {de ? "Zurück zu A1" : "Back to A1"}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((meta, idx) => {
                const Icon = meta.icon;
                const rd = roomData[idx];
                const unlocked = unlockedRooms.has(meta.slug);
                return (
                  <div
                    key={meta.slug}
                    className={`relative overflow-hidden rounded-2xl border transition-all flex flex-col ${
                      unlocked
                        ? "border-white/10 bg-[#0A1E35]/70 backdrop-blur-sm hover:border-[#E0B873]/25"
                        : "border-white/6 bg-[#0A1E35]/30 opacity-55"
                    }`}
                  >
                    <div className="absolute top-4 right-4">
                      <span className="text-[9px] font-bold text-white/20 bg-white/5 px-1.5 py-0.5 rounded">
                        {de ? `Raum ${idx + 1}` : `Room ${idx + 1}`}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${unlocked ? "bg-[#E0B873]/12 border border-[#E0B873]/20" : "bg-white/5 border border-white/8"}`}>
                        {unlocked ? <Icon className="h-5 w-5 text-[#E0B873]" /> : <Lock className="h-5 w-5 text-white/25" />}
                      </div>
                      <h3 className={`font-semibold text-sm leading-snug mb-1.5 ${unlocked ? "text-white" : "text-white/35"}`}>
                        {de ? meta.titleDE : meta.titleEN}
                      </h3>
                      <p className="text-xs text-white/35 leading-relaxed flex-1 mb-4">
                        {de ? meta.descDE : meta.descEN}
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 text-xs text-white/35">
                          <BookOpen className="h-3 w-3" />
                          <span>{rd.totalLessons || "—"} {de ? "Lektionen" : "lessons"}</span>
                        </div>
                        {rd.quizPassed ? (
                          <div className="flex items-center gap-1 text-xs text-[#E0B873]/60">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{de ? `Bestanden (${rd.quizScore}%)` : `Passed (${rd.quizScore}%)`}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-white/20">
                            <Lock className="h-3 w-3" />
                            <span>{de ? "Checkpoint offen" : "Checkpoint open"}</span>
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5">
                          <span>{de ? "Fortschritt" : "Progress"}</span>
                          <span>{rd.completedLessons}/{rd.totalLessons || "?"}</span>
                        </div>
                        <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] rounded-full transition-all" style={{ width: `${rd.progressPct}%` }} />
                        </div>
                      </div>
                      {unlocked ? (
                        <Link href={`/${locale}/rooms/${meta.slug}`} className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#E0B873]/10 border border-[#E0B873]/20 text-[#E0B873] text-xs font-semibold hover:bg-[#E0B873]/20 transition-colors">
                          {de ? "Raum betreten" : "Enter Room"} <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white/3 border border-white/8 text-white/25 text-xs font-medium">
                          <Lock className="h-3.5 w-3.5" />
                          {de ? "Vorherigen Raum abschließen" : "Complete previous room"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/3 border border-white/6 flex items-start gap-3">
              <Lock className="h-4 w-4 text-white/30 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/35">
                {de
                  ? "Räume werden sequenziell freigeschaltet. Bestehe das Checkpoint-Quiz (≥70%) um den nächsten Raum zu öffnen."
                  : "Rooms unlock sequentially. Pass the checkpoint quiz (≥70%) to open the next room."}
              </p>
            </div>

            {/* Guest sign-up CTA */}
            {isGuest && (
              <div className="mt-6 p-6 rounded-2xl border border-[#E0B873]/25 bg-[#E0B873]/8 text-center">
                <h2 className="text-lg font-serif font-bold text-white mb-1.5">
                  {de ? "Starte deinen ersten Raum" : "Start your first room"}
                </h2>
                <p className="text-sm text-white/50 mb-4 max-w-md mx-auto">
                  {de
                    ? "Erstelle ein kostenloses Konto, um Räume zu betreten und deinen Fortschritt zu speichern."
                    : "Create a free account to enter rooms and save your progress."}
                </p>
                <Link
                  href={`/${locale}/signup`}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
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
        <main className="bg-[#071424] min-h-screen">{content}</main>
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
