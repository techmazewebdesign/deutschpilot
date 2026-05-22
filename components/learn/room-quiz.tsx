"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Trophy,
  Award,
} from "lucide-react";

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

export function RoomCheckpointQuiz({
  exercises,
  courseId,
  quizLessonId,
  userId,
  locale,
  roomSlug,
}: Props) {
  const de = locale === "de";
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

    const pct =
      exercises.length > 0 ? Math.round((correct / exercises.length) * 100) : 0;
    setScore(pct);
    setSubmitted(true);

    const supabase = createClient();
    await supabase.from("student_progress").upsert(
      {
        user_id: userId,
        lesson_id: quizLessonId,
        course_id: courseId,
        score: pct,
        completed: pct >= PASS_PCT,
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
        <p>{de ? "Keine Fragen verfügbar." : "No questions available."}</p>
      </div>
    );
  }

  if (submitted) {
    const correctCount = Math.round((score / 100) * exercises.length);
    const passed = score >= PASS_PCT;

    return (
      <div className="space-y-6">
        <div
          className={`rounded-2xl border p-8 text-center ${
            passed
              ? "border-[#E0B873]/30 bg-gradient-to-b from-[#E0B873]/10 to-[#E0B873]/5"
              : "border-red-500/30 bg-gradient-to-b from-red-500/10 to-red-500/5"
          }`}
        >
          <div className="flex items-center justify-center mb-4">
            {passed ? (
              <Trophy className="h-14 w-14 text-[#E0B873]" />
            ) : (
              <XCircle className="h-14 w-14 text-red-400" />
            )}
          </div>
          <div
            className={`text-6xl font-black mb-2 ${
              passed ? "text-[#E0B873]" : "text-red-400"
            }`}
          >
            {score}%
          </div>
          <p className="text-white/60 text-sm mb-1">
            {de ? "Dein Ergebnis" : "Your Result"}
          </p>
          <p className="text-white font-semibold text-lg">
            {correctCount} {de ? "von" : "of"} {exercises.length}{" "}
            {de ? "richtig" : "correct"}
          </p>
          {passed ? (
            <p className="text-[#E0B873] text-sm mt-3">
              {de
                ? "Herzlichen Glückwunsch! Du hast den Checkpoint bestanden."
                : "Congratulations! You passed the checkpoint."}
            </p>
          ) : (
            <p className="text-red-300 text-sm mt-3">
              {de
                ? `Du brauchst ${PASS_PCT}% zum Bestehen. Versuche es nochmal!`
                : `You need ${PASS_PCT}% to pass. Try again!`}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {exercises.map((ex, idx) => {
            const given = answers[ex.id] ?? "";
            const isCorrect =
              given.trim().toLowerCase() ===
              ex.correct_answer.trim().toLowerCase();
            return (
              <div
                key={ex.id}
                className={`rounded-xl border p-5 ${
                  isCorrect
                    ? "border-[#E0B873]/20 bg-[#E0B873]/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-[#E0B873] flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium text-white">
                    Q{idx + 1}. {ex.question}
                  </p>
                </div>
                {!isCorrect && (
                  <div className="ml-8 space-y-1">
                    <p className="text-xs text-red-300">
                      {de ? "Deine Antwort:" : "Your answer:"}{" "}
                      <span className="font-medium">{given || "–"}</span>
                    </p>
                    <p className="text-xs text-[#E0B873]">
                      {de ? "Richtige Antwort:" : "Correct answer:"}{" "}
                      <span className="font-medium">{ex.correct_answer}</span>
                    </p>
                  </div>
                )}
                {ex.explanation && (
                  <p className="ml-8 text-xs text-white/35 mt-1.5">
                    {ex.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            {de ? "Nochmal versuchen" : "Try again"}
          </button>
          <Link
            href={`/${locale}/rooms/${roomSlug}`}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#E0B873]/30 text-[#E0B873] hover:bg-[#E0B873]/10 transition-colors"
          >
            {de ? "Zurück zum Raum" : "Back to Room"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {exercises.map((ex, idx) => (
        <div
          key={ex.id}
          className="bg-[#0A1E35]/70 border border-white/8 rounded-xl p-6"
        >
          <p className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-wider mb-3">
            {idx + 1} / {exercises.length}
          </p>
          <p className="text-sm font-semibold text-white mb-4">{ex.question}</p>

          {ex.type === "multiple_choice" && Array.isArray(ex.options) ? (
            <div className="space-y-2">
              {ex.options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(ex.id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    answers[ex.id] === opt
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
              placeholder={de ? "Deine Antwort..." : "Your answer..."}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={saving || Object.keys(answers).length < exercises.length}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#E0B873] text-[#071424] font-semibold hover:bg-[#C99B50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        <Award className="h-4 w-4" />
        {de ? "Quiz abgeben" : "Submit Quiz"}
      </button>
    </div>
  );
}
