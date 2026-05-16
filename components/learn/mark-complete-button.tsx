"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabaseClient";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  userId: string;
  lessonId: string;
  courseId: string;
  nextLessonSlug?: string | null;
  exerciseCount: number;
  locale: string;
  initialCompleted: boolean;
}

export function MarkCompleteButton({
  userId,
  lessonId,
  courseId,
  nextLessonSlug,
  exerciseCount,
  locale,
  initialCompleted,
}: Props) {
  const t = useTranslations("learn");
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function handleMarkComplete() {
    if (completed) return;
    setLoading(true);

    const supabase = createClient();
    await supabase.from("student_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

    setCompleted(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Mark complete */}
      <button
        onClick={handleMarkComplete}
        disabled={loading || completed}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors
          ${completed
            ? "bg-[#E0B873]/15 border border-[#E0B873]/30 text-[#E0B873] cursor-default"
            : "bg-[#E0B873] text-[#05101E] hover:bg-[#C99B50]"
          } disabled:opacity-60`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        {completed ? t("alreadyCompleted") : t("markComplete")}
      </button>

      {/* Go to exercises (if any) */}
      {exerciseCount > 0 && (
        <a
          href={`/${locale}/exercises/${lessonId}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium border border-[#E0B873]/30 text-[#E0B873] hover:bg-[#E0B873]/10 transition-colors"
        >
          {t("goToExercises")}
        </a>
      )}

      {/* Next lesson */}
      {nextLessonSlug && (
        <a
          href={`/${locale}/lessons/${nextLessonSlug}`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          {t("nextLesson")} →
        </a>
      )}
    </div>
  );
}
