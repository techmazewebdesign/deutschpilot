import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { AppLayout } from "@/components/app/app-layout";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { Award } from "lucide-react";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return { title: de ? "Zertifikate | DeutschPilot" : "Certificates | DeutschPilot" };
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

export default async function CertificatesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const de = locale === "de";

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = await legacyLearningClient(session.user.id);
  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";

  const [coursesRes, progressRes] = await Promise.all([
    supabase.from("courses").select("id, level").eq("is_published", true),
    supabase.from("student_progress").select("lesson_id, completed").eq("user_id", session.user.id),
  ]);

  [coursesRes, progressRes].forEach(requireQuery);
  const courses = (coursesRes.data ?? []) as { id: string; level: string }[];
  const progress = (progressRes.data ?? []) as { lesson_id: string; completed: boolean }[];

  const courseIds = courses.map((c) => c.id);
  const { data: lessonsData } = courseIds.length
    ? requireQuery(
        await supabase.from("lessons").select("id, course_id").in("course_id", courseIds)
      )
    : { data: [] };
  const lessons = (lessonsData ?? []) as { id: string; course_id: string }[];

  const completedLessonIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
  const courseById = new Map(courses.map((c) => [c.id, c]));

  const lessonsByLevel: Record<string, number> = {};
  const completedByLevel: Record<string, number> = {};
  for (const level of LEVELS) {
    lessonsByLevel[level] = 0;
    completedByLevel[level] = 0;
  }

  for (const lesson of lessons) {
    const course = courseById.get(lesson.course_id);
    if (!course || !LEVELS.includes(course.level as (typeof LEVELS)[number])) continue;
    lessonsByLevel[course.level] += 1;
    if (completedLessonIds.has(lesson.id)) completedByLevel[course.level] += 1;
  }

  const earnedLevels = LEVELS.filter(
    (level) => lessonsByLevel[level] > 0 && completedByLevel[level] === lessonsByLevel[level]
  );
  const nextLevel = LEVELS.find(
    (level) => lessonsByLevel[level] > 0 && completedByLevel[level] < lessonsByLevel[level]
  );

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="mx-auto w-full max-w-3xl px-5 py-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Award className="h-4 w-4 text-[#E0B873]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E0B873]/70">
              {de ? "Zertifikate" : "Certificates"}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            {de ? "Deine Zertifikate" : "Your Certificates"}
          </h1>
        </div>

        {earnedLevels.length === 0 ? (
          <div className="border-white/8 rounded-2xl border bg-[#0A1E35]/50 p-8 text-center">
            <Award className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="mb-1 text-sm text-white/45">
              {de ? "Noch kein Zertifikat verdient." : "No certificate earned yet."}
            </p>
            <p className="text-xs text-white/30">
              {nextLevel
                ? de
                  ? `Schließe alle Lektionen in ${nextLevel} ab, um dein erstes Zertifikat zu erhalten.`
                  : `Complete every lesson in ${nextLevel} to earn your first certificate.`
                : de
                  ? "Beginne mit einem Niveau, um Fortschritte zu sammeln."
                  : "Start a level to begin earning progress."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {earnedLevels.map((level) => (
              <CertificateCard key={level} level={level} userName={userName} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
