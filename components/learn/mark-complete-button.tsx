"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  saveLearningProgress,
  learningProgressNotice,
  type SchoolSyncStatus,
} from "@/lib/learningProgressClient";
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
  const [error, setError] = useState("");
  const [schoolSync, setSchoolSync] = useState<SchoolSyncStatus | null>(null);

  async function handleMarkComplete() {
    if (completed && schoolSync !== "pending") return;
    setLoading(true);
    setError("");
    try {
      const result = await saveLearningProgress({ lessonId, courseId, score: 0, completed: true });
      setCompleted(true);
      setSchoolSync(result.schoolSync);
      router.refresh();
    } catch (e) {
      setError(
        locale === "de"
          ? "Lernfortschritt konnte nicht gespeichert werden. Bitte anmelden und erneut versuchen."
          : "Your progress could not be saved. Please sign in and retry."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      {schoolSync && (
        <p role="status" className="text-sm text-white/70">
          {learningProgressNotice(schoolSync, locale)}
        </p>
      )}
      {schoolSync === "pending" && (
        <button
          onClick={handleMarkComplete}
          disabled={loading}
          className="text-sm text-[#E0B873] underline"
        >
          {locale === "de" ? "Schulsynchronisierung erneut versuchen" : "Retry school sync"}
        </button>
      )}
      <div className="flex flex-wrap gap-3">
        {/* Mark complete */}
        <button
          onClick={handleMarkComplete}
          disabled={loading || completed}
          className={`flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors
          ${
            completed
              ? "cursor-default border border-[#E0B873]/30 bg-[#E0B873]/15 text-[#E0B873]"
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
            className="flex items-center gap-2 rounded-md border border-[#E0B873]/30 px-5 py-2.5 text-sm font-medium text-[#E0B873] transition-colors hover:bg-[#E0B873]/10"
          >
            {t("goToExercises")}
          </a>
        )}

        {/* Next lesson */}
        {nextLessonSlug && (
          <a
            href={`/${locale}/lessons/${nextLessonSlug}`}
            className="flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            {t("nextLesson")} →
          </a>
        )}
      </div>
    </div>
  );
}
