"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Loader2, Trophy } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    level: "A1",
    question: 'Was bedeutet "Guten Morgen"?',
    options: ["Good morning", "Good evening", "Good night", "Goodbye"],
    answer: "Good morning",
  },
  {
    id: 2,
    level: "A1",
    question: 'Wie heißt "I am" auf Deutsch?',
    options: ["Ich bin", "Du bist", "Er ist", "Wir sind"],
    answer: "Ich bin",
  },
  {
    id: 3,
    level: "A2",
    question: 'Welchen Artikel hat das Wort "Buch"?',
    options: ["der", "die", "das", "kein Artikel"],
    answer: "das",
  },
  {
    id: 4,
    level: "A2",
    question: "Ergänze: Ich ___ gestern ins Kino gegangen.",
    options: ["bin", "habe", "war", "hatte"],
    answer: "bin",
  },
  {
    id: 5,
    level: "A2",
    question: 'Was ist das Gegenteil von "groß"?',
    options: ["klein", "reich", "jung", "laut"],
    answer: "klein",
  },
  {
    id: 6,
    level: "B1",
    question: "Ergänze: Er ___ jeden Tag Sport.",
    options: ["macht", "machst", "machen", "gemacht"],
    answer: "macht",
  },
  {
    id: 7,
    level: "B1",
    question: 'Welches Wort passt? "Ich wünschte, ich ___ mehr Zeit."',
    options: ["hätte", "habe", "hatte", "haben"],
    answer: "hätte",
  },
  {
    id: 8,
    level: "B1",
    question: 'Was bedeutet "trotzdem" auf Englisch?',
    options: ["nevertheless", "therefore", "because", "although"],
    answer: "nevertheless",
  },
  {
    id: 9,
    level: "B2",
    question: "Ergänze: Er bestand ___, dass wir pünktlich kommen.",
    options: ["darauf", "daran", "davon", "dabei"],
    answer: "darauf",
  },
  {
    id: 10,
    level: "B2",
    question: "Welcher Satz ist korrekt im Konjunktiv II?",
    options: [
      "Er hätte früher kommen sollen.",
      "Er hat früher kommen sollen gehabt.",
      "Er würde früher kommen haben sollen.",
      "Er soll früher gekommen haben werden.",
    ],
    answer: "Er hätte früher kommen sollen.",
  },
];

function scoreToLevel(score: number): string {
  if (score <= 2) return "A1";
  if (score <= 5) return "A2";
  if (score <= 8) return "B1";
  return "B2";
}

interface Props {
  locale: string;
  userId?: string;
}

export function PlacementQuiz({ locale, userId }: Props) {
  const t = useTranslations("placementTest");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [testId, setTestId] = useState("");
  const [levelSaved, setLevelSaved] = useState(false);
  const [resultLevel, setResultLevel] = useState("");
  const [correctCount, setCorrectCount] = useState(0);

  function handleAnswer(qId: number, value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      if (userId) {
        const response = await fetch("/api/learning/placement", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "submit", answers }),
        });
        const result = await response.json();
        if (!response.ok || !result.testId)
          throw new Error(
            locale === "de"
              ? "Ergebnis nicht gespeichert. Bitte erneut versuchen."
              : "Result was not saved. Please retry."
          );
        setTestId(result.testId);
        setCorrectCount(result.score);
        setResultLevel(result.level);
      } else {
        const correct = QUESTIONS.filter((q) => answers[q.id] === q.answer).length;
        setCorrectCount(correct);
        setResultLevel(scoreToLevel(correct));
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please retry.");
    } finally {
      setSaving(false);
    }
  }
  async function handleSaveLevel() {
    if (!userId || !testId) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/learning/placement", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveLevel", testId }),
      });
      const result = await response.json();
      if (!response.ok || result.saved !== true)
        throw new Error(
          locale === "de"
            ? "Sprachniveau nicht gespeichert. Bitte erneut versuchen."
            : "Level was not saved. Please retry."
        );
      setLevelSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please retry.");
    } finally {
      setSaving(false);
    }
  }

  if (!started) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0A2A50]/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#E0B873]/30 bg-[#E0B873]/15">
          <Trophy className="h-8 w-8 text-[#E0B873]" />
        </div>
        <h2 className="mb-2 font-serif text-xl font-bold text-white">{t("title")}</h2>
        <p className="mb-2 text-sm text-white/50">{t("subtitle")}</p>
        <p className="mx-auto mb-6 max-w-md text-sm text-[#C9D2DE]">{t("intro")}</p>
        <button
          onClick={() => setStarted(true)}
          className="rounded-md bg-[#E0B873] px-8 py-3 font-semibold text-[#05101E] transition-colors hover:bg-[#C99B50]"
        >
          {t("start")}
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        {!!error && (
          <p role="alert" className="text-red-300">
            {error}
          </p>
        )}
        <p className="text-sm text-white/60">
          {locale === "de"
            ? "Unverbindliche Lernorientierung, kein anerkannter Prüfungsnachweis."
            : "Informal learning guidance, not recognised examination evidence."}
        </p>
        <div className="rounded-xl border border-[#E0B873]/30 bg-[#0A2A50]/60 p-8 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#E0B873]">
            {t("result")}
          </p>
          <div className="mb-1 text-6xl font-bold text-[#E0B873]">{resultLevel}</div>
          <p className="mb-1 text-sm text-white/60">{t("yourLevel")}</p>
          <p className="text-sm text-white/40">
            {t("score")}: {correctCount}/{QUESTIONS.length}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {userId && !levelSaved && (
            <button
              onClick={handleSaveLevel}
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-[#E0B873] px-6 py-3 font-semibold text-[#05101E] transition-colors hover:bg-[#C99B50] disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("saveLevel")}
            </button>
          )}

          {levelSaved && (
            <span className="px-4 py-3 text-sm text-[#E0B873]">✓ {t("levelSaved")}</span>
          )}

          {userId && (
            <Link
              href={`/${locale}/dashboard`}
              className="rounded-md border border-white/15 px-6 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              {t("goToDashboard")}
            </Link>
          )}

          {!userId && (
            <Link
              href={`/${locale}/signup`}
              className="rounded-md border border-[#E0B873]/30 px-6 py-3 text-sm font-medium text-[#E0B873] transition-colors hover:bg-[#E0B873]/10"
            >
              {t("loginToSave")}
            </Link>
          )}

          <button
            onClick={() => {
              setSubmitted(false);
              setStarted(false);
              setAnswers({});
              setLevelSaved(false);
            }}
            className="rounded-md border border-white/10 px-6 py-3 text-sm text-white/40 transition-colors hover:border-white/25 hover:text-white"
          >
            {t("retake")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!!error && (
        <p role="alert" className="text-red-300">
          {error}
        </p>
      )}
      {QUESTIONS.map((q, idx) => (
        <div key={q.id} className="border-white/8 rounded-xl border bg-[#0A2A50]/40 p-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#E0B873]">
            {t("question")} {idx + 1} {t("of")} {QUESTIONS.length}
          </p>
          <p className="mb-4 text-sm font-semibold text-white">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(q.id, opt)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors
                  ${
                    answers[q.id] === opt
                      ? "border-[#E0B873] bg-[#E0B873]/15 text-white"
                      : "bg-white/3 border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={saving || Object.keys(answers).length < QUESTIONS.length}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#E0B873] px-8 py-3 font-semibold text-[#05101E] transition-colors hover:bg-[#C99B50] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("submit")}
      </button>
    </div>
  );
}
