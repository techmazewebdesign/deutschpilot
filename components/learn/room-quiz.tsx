"use client";
import { displayText } from "@/lib/displayText";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  saveLearningProgress,
  learningProgressNotice,
  type SchoolSyncStatus,
} from "@/lib/learningProgressClient";
import { CheckCircle2, XCircle, Loader2, RotateCcw, Trophy, Award } from "lucide-react";

interface CheckpointExercise {
  id: string;
  question: string;
  type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
}

interface Props {
  exercises: CheckpointExercise[];
  courseId: string;
  quizLessonId: string;
  userId: string;
  locale: string;
  roomSlug: string;
}

const PASS_PCT = 70;

export function RoomCheckpointQuiz({ exercises, courseId, quizLessonId, locale, roomSlug }: Props) {
  const t = useTranslations("learn");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(0);
  const [saveError, setSaveError] = useState("");
  const [schoolSync, setSchoolSync] = useState<SchoolSyncStatus | null>(null);

  function handleAnswer(exerciseId: string, value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [exerciseId]: value }));
  }

  async function persistResult(pct: number) {
    setSaving(true);
    setSaveError("");
    setSchoolSync(null);
    try {
      const result = await saveLearningProgress({
        lessonId: quizLessonId,
        courseId,
        score: pct,
        completed: pct >= PASS_PCT,
      });
      setSchoolSync(result.schoolSync);
    } catch {
      setSaveError(
        locale === "de"
          ? "Ihr Ergebnis wurde nicht gespeichert. Bitte anmelden und erneut versuchen."
          : "Your result was not saved. Please sign in and retry."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    let correct = 0;
    exercises.forEach((ex) => {
      const given = (answers[ex.id] ?? "").trim().toLowerCase();
      const expected = ex.correct_answer.trim().toLowerCase();
      if (given === expected) correct++;
    });

    const pct = exercises.length > 0 ? Math.round((correct / exercises.length) * 100) : 0;
    setScore(pct);
    setSubmitted(true);

    await persistResult(pct);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setSaveError("");
    setSchoolSync(null);
  }

  if (exercises.length === 0) {
    return (
      <div className="py-12 text-center text-white/40">
        <p>{t("noQuestionsAvailable")}</p>
      </div>
    );
  }

  if (submitted) {
    const correctCount = Math.round((score / 100) * exercises.length);
    const passed = score >= PASS_PCT;

    return (
      <div className="space-y-6">
        {saving && (
          <p role="status" className="text-sm text-white/70">
            {locale === "de" ? "Ergebnis wird gespeichert…" : "Saving result…"}
          </p>
        )}
        {saveError && (
          <p role="alert" className="text-sm text-red-300">
            {saveError}
          </p>
        )}
        {schoolSync && (
          <p role="status" className="text-sm text-white/70">
            {learningProgressNotice(schoolSync, locale)}
          </p>
        )}
        {(saveError || schoolSync === "pending") && (
          <button
            disabled={saving}
            onClick={() => void persistResult(score)}
            className="text-sm text-[#E0B873] underline"
          >
            {locale === "de" ? "Speichern erneut versuchen" : "Retry saving"}
          </button>
        )}

        <div
          className={`rounded-2xl border p-8 text-center ${
            passed
              ? "border-[#E0B873]/30 bg-gradient-to-b from-[#E0B873]/10 to-[#E0B873]/5"
              : "border-red-500/30 bg-gradient-to-b from-red-500/10 to-red-500/5"
          }`}
        >
          <div className="mb-4 flex items-center justify-center">
            {passed ? (
              <Trophy className="h-14 w-14 text-[#E0B873]" />
            ) : (
              <XCircle className="h-14 w-14 text-red-400" />
            )}
          </div>
          <div className={`mb-2 text-6xl font-black ${passed ? "text-[#E0B873]" : "text-red-400"}`}>
            {score}%
          </div>
          <p className="mb-1 text-sm text-white/60">{t("yourResult")}</p>
          <p className="text-lg font-semibold text-white">
            {correctCount} {t("of")} {exercises.length} {t("correct")}
          </p>
          {passed ? (
            <p className="mt-3 text-sm text-[#E0B873]">{t("checkpointPassed")}</p>
          ) : (
            <p className="mt-3 text-sm text-red-300">{t("checkpointFailed", { pct: PASS_PCT })}</p>
          )}
        </div>

        <div className="space-y-3">
          {exercises.map((ex, idx) => {
            const given = answers[ex.id] ?? "";
            const isCorrect = given.trim().toLowerCase() === ex.correct_answer.trim().toLowerCase();
            return (
              <div
                key={ex.id}
                className={`rounded-xl border p-5 ${
                  isCorrect
                    ? "border-[#E0B873]/20 bg-[#E0B873]/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="mb-2 flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#E0B873]" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                  )}
                  <p className="text-sm font-medium text-white">
                    Q{idx + 1}. {displayText(ex.question)}
                  </p>
                </div>
                {!isCorrect && (
                  <div className="ml-8 space-y-1">
                    <p className="text-xs text-red-300">
                      {t("yourAnswerColon")} <span className="font-medium">{given || "…"}</span>
                    </p>
                    <p className="text-xs text-[#E0B873]">
                      {t("correctAnswerColon")}{" "}
                      <span className="font-medium">{displayText(ex.correct_answer)}</span>
                    </p>
                  </div>
                )}
                {ex.explanation && (
                  <p className="ml-8 mt-1.5 text-xs text-white/35">{displayText(ex.explanation)}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            {t("tryAgain")}
          </button>
          <Link
            href={`/${locale}/rooms/${roomSlug}`}
            className="rounded-xl border border-[#E0B873]/30 px-5 py-2.5 text-sm font-medium text-[#E0B873] transition-colors hover:bg-[#E0B873]/10"
          >
            {t("backToRoom")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {exercises.map((ex, idx) => (
        <div key={ex.id} className="border-white/8 rounded-xl border bg-[#0A1E35]/70 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#E0B873]/70">
            {idx + 1} / {exercises.length}
          </p>
          <p className="mb-4 text-sm font-semibold text-white">{displayText(ex.question)}</p>

          {ex.type === "multiple_choice" && Array.isArray(ex.options) ? (
            <div className="space-y-2">
              {ex.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(ex.id, opt)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    answers[ex.id] === opt
                      ? "border-[#E0B873] bg-[#E0B873]/15 text-white"
                      : "bg-white/3 border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {displayText(opt)}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={answers[ex.id] ?? ""}
              onChange={(e) => handleAnswer(ex.id, e.target.value)}
              placeholder={t("yourAnswerPlaceholder")}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-all placeholder:text-white/20 focus:border-[#E0B873]/50 focus:outline-none"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={saving || Object.keys(answers).length < exercises.length}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0B873] px-8 py-3 font-semibold text-[#071424] transition-colors hover:bg-[#C99B50] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        <Award className="h-4 w-4" />
        {t("submitQuiz")}
      </button>
    </div>
  );
}
