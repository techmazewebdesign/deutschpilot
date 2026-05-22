"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
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
  const [levelSaved, setLevelSaved] = useState(false);
  const [resultLevel, setResultLevel] = useState("");
  const [correctCount, setCorrectCount] = useState(0);

  function handleAnswer(qId: number, value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    let correct = 0;
    QUESTIONS.forEach((q) => {
      if ((answers[q.id] ?? "") === q.answer) correct++;
    });
    const level = scoreToLevel(correct);
    setCorrectCount(correct);
    setResultLevel(level);
    setSubmitted(true);

    if (userId) {
      const supabase = createClient();
      await supabase.from("placement_tests").insert({
        user_id: userId,
        level_result: level,
        score: correct,
        answers: answers,
      });
    }
    setSaving(false);
  }

  async function handleSaveLevel() {
    if (!userId || !resultLevel) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ german_level: resultLevel }).eq("id", userId);
    setLevelSaved(true);
    setSaving(false);
  }

  if (!started) {
    return (
      <div className="bg-[#0A2A50]/50 border border-white/10 rounded-xl p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-[#E0B873]/15 border border-[#E0B873]/30 flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-[#E0B873]" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white mb-2">{t("title")}</h2>
        <p className="text-sm text-white/50 mb-2">{t("subtitle")}</p>
        <p className="text-sm text-[#C9D2DE] mb-6 max-w-md mx-auto">{t("intro")}</p>
        <button
          onClick={() => setStarted(true)}
          className="bg-[#E0B873] text-[#05101E] font-semibold px-8 py-3 rounded-md hover:bg-[#C99B50] transition-colors"
        >
          {t("start")}
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="bg-[#0A2A50]/60 border border-[#E0B873]/30 rounded-xl p-8 text-center">
          <p className="text-xs font-medium text-[#E0B873] uppercase tracking-widest mb-3">{t("result")}</p>
          <div className="text-6xl font-bold text-[#E0B873] mb-1">{resultLevel}</div>
          <p className="text-white/60 text-sm mb-1">{t("yourLevel")}</p>
          <p className="text-white/40 text-sm">
            {t("score")}: {correctCount}/{QUESTIONS.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {userId && !levelSaved && (
            <button
              onClick={handleSaveLevel}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#E0B873] text-[#05101E] font-semibold hover:bg-[#C99B50] transition-colors disabled:opacity-60"
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
              className="px-6 py-3 rounded-md border border-white/15 text-white/60 text-sm font-medium hover:text-white hover:border-white/30 transition-colors"
            >
              {t("goToDashboard")}
            </Link>
          )}

          {!userId && (
            <Link
              href={`/${locale}/signup`}
              className="px-6 py-3 rounded-md border border-[#E0B873]/30 text-[#E0B873] text-sm font-medium hover:bg-[#E0B873]/10 transition-colors"
            >
              {t("loginToSave")}
            </Link>
          )}

          <button
            onClick={() => { setSubmitted(false); setStarted(false); setAnswers({}); setLevelSaved(false); }}
            className="px-6 py-3 rounded-md border border-white/10 text-white/40 text-sm hover:text-white hover:border-white/25 transition-colors"
          >
            {t("retake")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {QUESTIONS.map((q, idx) => (
        <div key={q.id} className="bg-[#0A2A50]/40 border border-white/8 rounded-xl p-6">
          <p className="text-xs text-[#E0B873] font-medium uppercase tracking-wider mb-3">
            {t("question")} {idx + 1} {t("of")} {QUESTIONS.length}
          </p>
          <p className="text-sm font-semibold text-white mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(q.id, opt)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors
                  ${answers[q.id] === opt
                    ? "border-[#E0B873] bg-[#E0B873]/15 text-white"
                    : "border-white/10 bg-white/3 text-white/70 hover:border-white/25 hover:text-white"
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
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-[#E0B873] text-[#05101E] font-semibold hover:bg-[#C99B50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("submit")}
      </button>
    </div>
  );
}
