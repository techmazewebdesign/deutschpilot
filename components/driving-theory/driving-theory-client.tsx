"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, ChevronRight, CheckCircle2, XCircle, RotateCcw, AlertTriangle } from "lucide-react";

export type DrivingQuestion = {
  id: string;
  category: string;
  question_de: string;
  question_en: string;
  options_de: string[];
  options_en: string[];
  correct_answer_de: string;
  correct_answer_en: string;
  explanation_de: string | null;
  explanation_en: string | null;
};

export function DrivingTheoryClient({
  questions, locale, licenseClass = "B", isGuest = false,
}: { questions: DrivingQuestion[]; locale: string; licenseClass?: string; isGuest?: boolean }) {
  const t = useTranslations("drivingTheory");
  const de = locale === "de";
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const categories = useMemo(
    () => Array.from(new Set(questions.map((q) => q.category))),
    [questions]
  );
  const q = questions[index];
  const finished = started && index >= questions.length;

  function selectOption(opt: string) {
    if (revealed) return;
    setSelected(opt);
  }

  function checkAnswer() {
    if (!selected || !q) return;
    const correct = de ? q.correct_answer_de : q.correct_answer_en;
    setResults((prev) => [...prev, selected === correct]);
    setRevealed(true);
  }

  function nextQuestion() {
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setResults([]);
    setStarted(true);
  }

  function handleStartClick() {
    if (isGuest) {
      router.push(`/${locale}/signup`);
      return;
    }
    restart();
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#071424] py-20 px-4 text-center">
        <p className="text-white/40">{t("noQuestionsYet")}</p>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-[#071424] py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0B873]/12 border border-[#E0B873]/25 mb-6">
            <Car className="h-6 w-6 text-[#E0B873]" />
          </div>
          <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">
            {t("licenseClass", { licenseClass })}
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-5">
            {t("practiceDrivingTheory")}
          </h1>
          <p className="text-[#C9D2DE] max-w-lg mx-auto mb-8 leading-relaxed">
            {t("questionsIntro", { count: questions.length })}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((c) => (
              <span key={c} className="text-xs text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                {c}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/8 p-5 mb-8 text-left flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              {t("officialCatalogNotice")}
            </p>
          </div>

          <button
            onClick={handleStartClick}
            className="inline-flex items-center gap-2 bg-[#E0B873] text-[#071424] font-bold px-8 py-3.5 rounded-xl hover:bg-[#C99B50] transition-colors"
          >
            {isGuest
              ? t("signUpFreeStart")
              : t("startPracticing")}
            <ChevronRight className="h-4 w-4" />
          </button>
          {isGuest && (
            <p className="text-xs text-white/30 text-center mt-3">
              {t("freeTakesMinute")}
            </p>
          )}
        </div>
      </main>
    );
  }

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    const pct = Math.round((correctCount / results.length) * 100);
    return (
      <main className="min-h-screen bg-[#071424] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className={`h-14 w-14 mx-auto rounded-2xl flex items-center justify-center mb-5 ${pct >= 70 ? "bg-emerald-500/12 border border-emerald-500/25" : "bg-amber-500/12 border border-amber-500/25"}`}>
            {pct >= 70 ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <XCircle className="h-6 w-6 text-amber-400" />}
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            {t("result")}
          </h1>
          <p className="text-white/50 mb-8">
            {correctCount}/{results.length} {t("correct")} ({pct}%)
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E0B873] text-[#071424] font-bold hover:bg-[#C99B50] transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> {t("practiceAgain")}
            </button>
            <Link
              href={`/${locale}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/70 font-medium hover:border-white/30 hover:text-white transition-colors"
            >
              {t("backHome")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const question = de ? q.question_de : q.question_en;
  const options = de ? q.options_de : q.options_en;
  const correct = de ? q.correct_answer_de : q.correct_answer_en;
  const explanation = de ? q.explanation_de : q.explanation_en;

  return (
    <main className="min-h-screen bg-[#071424] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-wider">{q.category}</span>
          <span className="text-xs text-white/30">{index + 1}/{questions.length}</span>
        </div>

        <h2 className="text-lg font-semibold text-white mb-5 leading-snug">{question}</h2>

        <div className="space-y-2 mb-6">
          {options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrectOpt = revealed && opt === correct;
            const isWrongSelected = revealed && isSelected && opt !== correct;
            return (
              <button
                key={opt}
                onClick={() => selectOption(opt)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  isCorrectOpt
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                    : isWrongSelected
                    ? "border-red-500/50 bg-red-500/10 text-red-300"
                    : isSelected
                    ? "border-[#E0B873]/60 bg-[#E0B873]/10 text-[#E0B873]"
                    : "border-white/10 text-white/60 hover:border-white/25"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {revealed && explanation && (
          <div className="rounded-xl border border-white/8 bg-[#0A1E35]/50 p-4 mb-6">
            <p className="text-xs text-white/50 leading-relaxed">{explanation}</p>
          </div>
        )}

        {!revealed ? (
          <button
            onClick={checkAnswer}
            disabled={!selected}
            className="w-full bg-[#E0B873] text-[#071424] font-bold py-3 rounded-xl hover:bg-[#C99B50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("checkAnswer")}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="w-full flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-bold py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
          >
            {index + 1 < questions.length ? t("nextQuestion") : t("seeResult")}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </main>
  );
}
