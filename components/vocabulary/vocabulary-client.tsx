"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Languages, ChevronLeft, ChevronRight, RotateCw, Shuffle } from "lucide-react";

export type VocabWord = {
  id: string;
  level: string;
  category: string;
  word_de: string;
  word_en: string;
  example_de: string;
  example_en: string;
};

const LEVELS = ["A1", "A2", "B1", "B2"] as const;

export function VocabularyClient({ words, locale }: { words: VocabWord[]; locale: string }) {
  const t = useTranslations("vocabulary");
  const de = locale === "de";
  const [level, setLevel] = useState<string>("A1");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filtered = useMemo(() => words.filter((w) => w.level === level), [words, level]);
  const card = filtered[index];

  function selectLevel(l: string) {
    setLevel(l);
    setIndex(0);
    setFlipped(false);
  }

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % filtered.length);
  }

  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }

  function shuffle() {
    setIndex(Math.floor(Math.random() * filtered.length));
    setFlipped(false);
  }

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-2xl w-full mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="h-4 w-4 text-[#E0B873]" />
          <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">
            {t("eyebrow")}
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">
          {t("title")}
        </h1>
      </div>

      <div className="flex gap-2 mb-6">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => selectLevel(l)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              level === l
                ? "bg-[#E0B873] text-[#05101E] border-[#E0B873]"
                : "border-white/20 text-white/60 hover:text-white hover:border-white/40"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {!card ? (
        <p className="text-sm text-white/40">{t("noWordsForLevel")}</p>
      ) : (
        <>
          <p className="text-xs text-white/30 mb-3">
            {card.category} · {index + 1}/{filtered.length}
          </p>

          <button
            onClick={() => setFlipped((f) => !f)}
            className="w-full rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 p-10 text-center transition-colors mb-5 min-h-[220px] flex flex-col items-center justify-center"
          >
            {!flipped ? (
              <p className="text-2xl font-serif font-bold text-white">{card.word_de}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-xl font-serif font-bold text-[#E0B873]">{card.word_en}</p>
                <p className="text-sm text-white/60 italic">{de ? card.example_de : card.example_en}</p>
              </div>
            )}
            <p className="text-[10px] text-white/25 uppercase tracking-widest mt-6 flex items-center gap-1.5">
              <RotateCw className="h-3 w-3" /> {t("tapToFlip")}
            </p>
          </button>

          <div className="flex items-center justify-center gap-3">
            <button onClick={prev} className="p-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={shuffle} className="p-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">
              <Shuffle className="h-4 w-4" />
            </button>
            <button onClick={next} className="p-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
