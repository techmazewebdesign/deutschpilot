"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";

interface Exercise {
  id: string;
  question: string;
  type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
}

interface Props {
  exercises: Exercise[];
  lessonId: string;
  courseId: string;
  userId: string;
  locale: string;
  lessonSlug: string;
}

export function Quiz({ exercises, lessonId, courseId, userId, locale, lessonSlug }: Props) {
  const t = useTranslations("learn");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(0);

  function handleAnswer(exerciseId: string, value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [exerciseId]: value }));
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

    // Save score to student_progress
    const supabase = createClient();
    await supabase.from("student_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        score: pct,
        completed: pct >= 60,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

    setSaving(false);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <p>{t("noExercises")}</p>
        <Link
          href={`/${locale}/lessons/${lessonSlug}` as any}
          className="mt-4 inline-block text-sm text-[#E0B873] hover:underline"
        >
          {t("backToLesson")}
        </Link>
      </div>
    );
  }

  // Results screen
  if (submitted) {
    const correctCount = Math.round((score / 100) * exercises.length);
    const passed = score >= 60;

    return (
      <div className="space-y-6">
        {/* Score card */}
        <div className={`rounded-xl border p-8 text-center ${passed ? "border-[#E0B873]/30 bg-[#E0B873]/8" : "border-red-500/30 bg-red-500/8"}`}>
          <div className={`text-5xl font-bold mb-2 ${passed ? "text-[#E0B873]" : "text-red-400"}`}>
            {score}%
          </div>
          <p className="text-white/60 text-sm mb-1">{t("yourScore")}</p>
          <p className="text-white font-medium">
            {correctCount} {t("of")} {exercises.length} {t("correct")}
          </p>
          {passed
            ? <p className="text-[#E0B873] text-sm mt-2">{locale === "de" ? "Gut gemacht! Lektion als abgeschlossen gespeichert." : "Well done! Lesson marked as completed."}</p>
            : <p className="text-red-300 text-sm mt-2">{locale === "de" ? "Versuch es nochmal – du brauchst 60% zum Bestehen." : "Try again – you need 60% to pass."}</p>
          }
        </div>

        {/* Per-question review */}
        <div className="space-y-4">
          {exercises.map((ex, idx) => {
            const given = answers[ex.id] ?? "";
            const isCorrect = given.trim().toLowerCase() === ex.correct_answer.trim().toLowerCase();
            return (
              <div key={ex.id} className={`rounded-xl border p-5 ${isCorrect ? "border-[#E0B873]/20 bg-[#E0B873]/5" : "border-red-500/20 bg-red-500/5"}`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect
                    ? <CheckCircle2 className="h-5 w-5 text-[#E0B873] flex-shrink-0 mt-0.5" />
                    : <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  }
                  <p className="text-sm font-medium text-white">Q{idx + 1}. {ex.question}</p>
                </div>
                {!isCorrect && (
                  <div className="ml-8 space-y-1">
                    <p className="text-xs text-red-300">{locale === "de" ? "Deine Antwort:" : "Your answer:"} <span className="font-medium">{given || "–"}</span></p>
                    <p className="text-xs text-[#E0B873]">{locale === "de" ? "Richtige Antwort:" : "Correct answer:"} <span className="font-medium">{ex.correct_answer}</span></p>
                  </div>
                )}
                {ex.explanation && (
                  <p className="ml-8 text-xs text-white/40 mt-2">{ex.explanation}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            {t("tryAgain")}
          </button>
          <Link
            href={`/${locale}/lessons/${lessonSlug}` as any}
            className="px-5 py-2.5 rounded-md text-sm font-medium border border-[#E0B873]/30 text-[#E0B873] hover:bg-[#E0B873]/10 transition-colors"
          >
            {t("backToLesson")}
          </Link>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="space-y-6">
      {exercises.map((ex, idx) => (
        <div key={ex.id} className="bg-[#0A2A50]/40 border border-white/8 rounded-xl p-6">
          <p className="text-xs font-medium text-[#E0B873] uppercase tracking-wider mb-3">
            {t("of").replace("{0}", String(idx + 1))} · Q{idx + 1}/{exercises.length}
          </p>
          <p className="text-sm font-semibold text-white mb-4">{ex.question}</p>

          {ex.type === "multiple_choice" && Array.isArray(ex.options) ? (
            <div className="space-y-2">
              {ex.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(ex.id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors
                    ${answers[ex.id] === opt
                      ? "border-[#E0B873] bg-[#E0B873]/15 text-white"
                      : "border-white/10 bg-white/3 text-white/70 hover:border-white/25 hover:text-white"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={answers[ex.id] ?? ""}
              onChange={(e) => handleAnswer(ex.id, e.target.value)}
              placeholder={locale === "de" ? "Deine Antwort..." : "Your answer..."}
              className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={saving || Object.keys(answers).length < exercises.length}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-[#E0B873] text-[#05101E] font-semibold hover:bg-[#C99B50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("submitAnswers")}
      </button>
    </div>
  );
}
