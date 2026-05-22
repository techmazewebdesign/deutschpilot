"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import {
  CheckCircle2, XCircle, Loader2, RotateCcw,
  ArrowRight, Trophy, Zap, Target,
} from "lucide-react";

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

type AnswerState = "idle" | "correct" | "wrong";

// ── Word-order exercise ───────────────────────────────────────────────────────
function WordOrderExercise({
  words,
  answer,
  onAnswer,
}: {
  words: string[];
  answer: string;
  onAnswer: (val: string) => void;
}) {
  const [bank, setBank] = useState<{ w: string; id: number }[]>(
    words.map((w, i) => ({ w, id: i }))
  );
  const [chosen, setChosen] = useState<{ w: string; id: number }[]>([]);

  function pick(item: { w: string; id: number }) {
    setBank((b) => b.filter((x) => x.id !== item.id));
    const next = [...chosen, item];
    setChosen(next);
    onAnswer(next.map((x) => x.w).join(" "));
  }

  function unpick(item: { w: string; id: number }) {
    setChosen((c) => c.filter((x) => x.id !== item.id));
    setBank((b) => [...b, item]);
    const next = chosen.filter((x) => x.id !== item.id);
    onAnswer(next.map((x) => x.w).join(" "));
  }

  return (
    <div className="space-y-4">
      {/* Answer area */}
      <div className="min-h-[52px] flex flex-wrap gap-2 p-3 rounded-xl border border-[#E0B873]/30 bg-[#E0B873]/5">
        {chosen.length === 0 && (
          <span className="text-xs text-white/20 self-center px-1">
            {answer || "Tap words below to build the sentence…"}
          </span>
        )}
        {chosen.map((item) => (
          <button
            key={item.id}
            onClick={() => unpick(item)}
            className="px-3 py-1.5 rounded-lg bg-[#E0B873]/20 border border-[#E0B873]/40 text-sm text-white font-medium hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
          >
            {item.w}
          </button>
        ))}
      </div>
      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {bank.map((item) => (
          <button
            key={item.id}
            onClick={() => pick(item)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-sm text-white/80 hover:border-[#E0B873]/40 hover:text-white transition-colors"
          >
            {item.w}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Quiz ─────────────────────────────────────────────────────────────────
export function Quiz({ exercises, lessonId, courseId, userId, locale, lessonSlug }: Props) {
  const t = useTranslations("learn");
  const de = locale === "de";

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const current = exercises[currentIdx];
  const totalQ = exercises.length;
  const currentAnswer = answers[current?.id ?? ""] ?? "";

  const checkAnswer = useCallback((given: string, expected: string) => {
    return given.trim().toLowerCase() === expected.trim().toLowerCase();
  }, []);

  function handleAnswer(val: string) {
    if (answerState !== "idle") return;
    setAnswers((prev) => ({ ...prev, [current.id]: val }));
  }

  function confirm() {
    if (!currentAnswer || answerState !== "idle") return;
    const correct = checkAnswer(currentAnswer, current.correct_answer);
    setAnswerState(correct ? "correct" : "wrong");
  }

  async function next() {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx((i) => i + 1);
      setAnswerState("idle");
    } else {
      // Final — calculate and save
      setSaving(true);
      let correctCount = 0;
      exercises.forEach((ex) => {
        if (checkAnswer(answers[ex.id] ?? "", ex.correct_answer)) correctCount++;
      });
      const pct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
      setScore(pct);

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
      setDone(true);
    }
  }

  function reset() {
    setCurrentIdx(0);
    setAnswers({});
    setAnswerState("idle");
    setDone(false);
    setScore(0);
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (exercises.length === 0) {
    return (
      <div className="text-center py-16 text-white/40">
        <Target className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="mb-4">{t("noExercises")}</p>
        <Link href={`/${locale}/lessons/${lessonSlug}`} className="text-sm text-[#E0B873] hover:underline">
          {t("backToLesson")}
        </Link>
      </div>
    );
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (done) {
    const correctCount = Math.round((score / 100) * totalQ);
    const passed = score >= 60;
    const perfect = score === 100;

    return (
      <div className="space-y-6">
        {/* Score hero */}
        <div className={`relative overflow-hidden rounded-2xl border p-8 text-center ${
          perfect ? "border-[#E0B873]/40 bg-gradient-to-br from-[#E0B873]/15 to-[#E0B873]/5"
          : passed ? "border-[#E0B873]/25 bg-[#E0B873]/8"
          : "border-red-500/30 bg-red-500/8"
        }`}>
          {perfect && (
            <div className="absolute top-4 right-4 text-2xl">🏆</div>
          )}
          <div className={`text-6xl font-bold mb-2 ${passed ? "text-[#E0B873]" : "text-red-400"}`}>
            {score}%
          </div>
          <p className="text-white font-semibold text-lg mb-1">
            {correctCount} / {totalQ} {de ? "richtig" : "correct"}
          </p>
          <p className={`text-sm mt-2 ${passed ? "text-[#E0B873]/80" : "text-red-300/80"}`}>
            {perfect
              ? (de ? "Perfekt! Ausgezeichnete Arbeit! 🎉" : "Perfect score! Outstanding work! 🎉")
              : passed
              ? (de ? "Gut gemacht! Lektion abgeschlossen." : "Well done! Lesson completed.")
              : (de ? "Nicht ganz – du brauchst 60% zum Bestehen. Versuch es nochmal!" : "Not quite – you need 60% to pass. Try again!")}
          </p>
        </div>

        {/* Per-question review */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            {de ? "Überprüfung" : "Review"}
          </h3>
          {exercises.map((ex, idx) => {
            const given = answers[ex.id] ?? "";
            const correct = checkAnswer(given, ex.correct_answer);
            return (
              <div key={ex.id} className={`rounded-xl border p-4 ${correct ? "border-[#E0B873]/20 bg-[#E0B873]/5" : "border-red-500/20 bg-red-500/5"}`}>
                <div className="flex items-start gap-3">
                  {correct
                    ? <CheckCircle2 className="h-4 w-4 text-[#E0B873] flex-shrink-0 mt-0.5" />
                    : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white mb-1">
                      {idx + 1}. {ex.question}
                    </p>
                    {!correct && (
                      <div className="space-y-0.5 mt-1">
                        <p className="text-xs text-red-300">
                          {de ? "Deine Antwort: " : "Your answer: "}
                          <span className="font-medium">{given || "–"}</span>
                        </p>
                        <p className="text-xs text-[#E0B873]">
                          {de ? "Richtig: " : "Correct: "}
                          <span className="font-medium">{ex.correct_answer}</span>
                        </p>
                      </div>
                    )}
                    {ex.explanation && (
                      <p className="text-xs text-white/35 mt-1.5 italic">{ex.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            {t("tryAgain")}
          </button>
          <Link
            href={`/${locale}/lessons/${lessonSlug}`}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#E0B873]/30 text-[#E0B873] hover:bg-[#E0B873]/10 transition-colors"
          >
            {t("backToLesson")}
          </Link>
        </div>
      </div>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  const progress = ((currentIdx) / totalQ) * 100;
  const isWordOrder = current.type === "word_order";
  const isMultipleChoice = current.type === "multiple_choice" && Array.isArray(current.options);

  // Shuffle words for word_order type (stable per question)
  const shuffledWords = isWordOrder
    ? current.correct_answer.split(" ").sort(() => {
        // Deterministic shuffle based on question id
        const seed = current.id.charCodeAt(0) + current.id.charCodeAt(1);
        return Math.sin(seed) - 0.5;
      })
    : [];

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-white/35 mb-2">
          <span>{de ? `Frage ${currentIdx + 1} von ${totalQ}` : `Question ${currentIdx + 1} of ${totalQ}`}</span>
          <div className="flex gap-1">
            {exercises.map((_, i) => {
              const ans = answers[exercises[i].id];
              const isDone = ans !== undefined && i < currentIdx;
              const isRight = isDone && checkAnswer(ans, exercises[i].correct_answer);
              return (
                <div key={i} className={`h-1.5 w-5 rounded-full transition-colors ${
                  i === currentIdx ? "bg-[#E0B873]" :
                  isDone && isRight ? "bg-emerald-400/70" :
                  isDone ? "bg-red-400/70" :
                  "bg-white/10"
                }`} />
              );
            })}
          </div>
        </div>
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 ${
        answerState === "correct" ? "border-emerald-400/40 bg-emerald-400/8" :
        answerState === "wrong" ? "border-red-400/40 bg-red-400/8" :
        "border-white/10 bg-[#0A1E35]/60"
      }`}>
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E0B873]/50 bg-[#E0B873]/8 px-2 py-1 rounded-md">
            {isWordOrder
              ? (de ? "Satz bauen" : "Build the sentence")
              : isMultipleChoice
              ? (de ? "Wähle die Antwort" : "Choose the answer")
              : (de ? "Lücke füllen" : "Fill in the blank")}
          </span>
        </div>

        <p className="text-base font-semibold text-white leading-relaxed mb-5">
          {current.question}
        </p>

        {/* Answer input by type */}
        {isMultipleChoice ? (
          <div className="space-y-2.5">
            {current.options!.map((opt) => {
              const isSelected = currentAnswer === opt;
              const isCorrectOpt = opt.trim().toLowerCase() === current.correct_answer.trim().toLowerCase();
              let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
              if (answerState === "idle") {
                cls += isSelected
                  ? "border-[#E0B873] bg-[#E0B873]/15 text-white"
                  : "border-white/10 bg-white/3 text-white/70 hover:border-white/25 hover:text-white";
              } else {
                if (isCorrectOpt) cls += "border-emerald-400/60 bg-emerald-400/12 text-emerald-300";
                else if (isSelected) cls += "border-red-400/60 bg-red-400/12 text-red-300";
                else cls += "border-white/6 bg-white/2 text-white/30";
              }
              return (
                <button key={opt} onClick={() => handleAnswer(opt)} disabled={answerState !== "idle"} className={cls}>
                  {answerState !== "idle" && isCorrectOpt && <CheckCircle2 className="h-4 w-4 inline mr-2 text-emerald-400" />}
                  {answerState !== "idle" && isSelected && !isCorrectOpt && <XCircle className="h-4 w-4 inline mr-2 text-red-400" />}
                  {opt}
                </button>
              );
            })}
          </div>
        ) : isWordOrder ? (
          answerState === "idle" ? (
            <WordOrderExercise
              words={shuffledWords}
              answer={currentAnswer}
              onAnswer={handleAnswer}
            />
          ) : (
            <div className="p-3 rounded-xl border border-[#E0B873]/30 bg-[#E0B873]/5">
              <p className="text-sm text-white">{currentAnswer}</p>
            </div>
          )
        ) : (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && answerState === "idle" && currentAnswer && confirm()}
            disabled={answerState !== "idle"}
            placeholder={de ? "Deine Antwort…" : "Your answer…"}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all disabled:opacity-60"
          />
        )}

        {/* Feedback */}
        {answerState !== "idle" && (
          <div className={`mt-4 flex items-start gap-2.5 p-3.5 rounded-xl ${
            answerState === "correct" ? "bg-emerald-400/10 border border-emerald-400/25" : "bg-red-400/10 border border-red-400/25"
          }`}>
            {answerState === "correct"
              ? <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            }
            <div>
              <p className={`text-sm font-semibold ${answerState === "correct" ? "text-emerald-300" : "text-red-300"}`}>
                {answerState === "correct"
                  ? (de ? "Richtig! 🎉" : "Correct! 🎉")
                  : (de ? `Falsch. Richtige Antwort: "${current.correct_answer}"` : `Wrong. Correct answer: "${current.correct_answer}"`)}
              </p>
              {current.explanation && (
                <p className="text-xs text-white/50 mt-1">{current.explanation}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        {answerState === "idle" ? (
          <button
            onClick={confirm}
            disabled={!currentAnswer}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {de ? "Überprüfen" : "Check"}
            <Zap className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={next}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {currentIdx < totalQ - 1
              ? (de ? "Weiter" : "Next")
              : (de ? "Ergebnis" : "Results")}
            {!saving && (currentIdx < totalQ - 1 ? <ArrowRight className="h-4 w-4" /> : <Trophy className="h-4 w-4" />)}
          </button>
        )}
      </div>
    </div>
  );
}
