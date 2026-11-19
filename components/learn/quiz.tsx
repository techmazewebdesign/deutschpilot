"use client";
import { displayText } from "@/lib/displayText";
import { GermanAudio } from "@/components/learn/german-audio";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  saveLearningProgress,
  learningProgressNotice,
  type SchoolSyncStatus,
} from "@/lib/learningProgressClient";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  ArrowRight,
  Trophy,
  Zap,
  Target,
  Sparkles,
  PenLine,
  Mic,
  Square,
  Play,
  Pause,
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
  courseLevel?: string;
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
  const t = useTranslations("learn");
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
      <div className="flex min-h-[52px] flex-wrap gap-2 rounded-xl border border-[#E0B873]/30 bg-[#E0B873]/5 p-3">
        {chosen.length === 0 && (
          <span className="self-center px-1 text-xs text-white/20">
            {answer || t("wordOrderHint")}
          </span>
        )}
        {chosen.map((item) => (
          <button
            key={item.id}
            onClick={() => unpick(item)}
            className="rounded-lg border border-[#E0B873]/40 bg-[#E0B873]/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:border-red-500/40 hover:bg-red-500/20"
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
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-[#E0B873]/40 hover:text-white"
          >
            {item.w}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Writing-prompt exercise ────────────────────────────────────────────────────
function WritingPromptExercise({
  prompt,
  sampleAnswer,
  tip,
  locale,
  courseLevel,
  onContinue,
}: {
  prompt: string;
  sampleAnswer: string;
  tip: string | null;
  locale: string;
  courseLevel: string;
  onContinue: (text: string) => void;
}) {
  const t = useTranslations("learn");
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  async function getFeedback() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setRequested(true);
    setFeedback("");

    try {
      const res = await fetch("/api/ai-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              text: `Please act as a writing coach. The task was: "${prompt}"\n\nMy German writing:\n"""\n${text.trim()}\n"""\n\nGive me short, encouraging feedback: what's good, 1-3 corrections (grammar/vocabulary) with brief explanations, and one improved example sentence. Keep it concise.`,
            },
          ],
          locale,
          userLevel: courseLevel,
        }),
      });

      if (res.status === 429) {
        setFeedback(t("aiDailyLimitReached"));
        setLoading(false);
        return;
      }
      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setFeedback(accumulated);
      }
    } catch {
      setFeedback(t("aiFeedbackError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={requested}
        rows={5}
        placeholder={t("writingPlaceholder")}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-white/20 focus:border-[#E0B873]/50 focus:outline-none disabled:opacity-70"
      />

      {!requested && (
        <button
          onClick={getFeedback}
          disabled={!text.trim() || loading}
          className="flex items-center gap-2 rounded-xl bg-[#E0B873] px-5 py-2.5 text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Sparkles className="h-4 w-4" />
          {t("getAiFeedback")}
        </button>
      )}

      {requested && (
        <div className="bg-[#E0B873]/8 rounded-xl border border-[#E0B873]/25 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#E0B873]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E0B873]/70">
              {t("aiFeedbackLabel")}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
            {feedback || (
              <span className="flex h-5 items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block h-2 w-2 animate-bounce rounded-full bg-[#E0B873]/50"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            )}
          </p>
        </div>
      )}

      {requested && !loading && sampleAnswer && (
        <div className="bg-white/3 rounded-xl border border-white/10 p-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
            {t("sampleAnswer")}
          </p>
          <p className="text-sm italic text-white/60">{displayText(sampleAnswer)}</p>
        </div>
      )}

      {tip && <p className="text-xs italic text-white/35">{displayText(tip)}</p>}

      {requested && !loading && (
        <div className="flex justify-end">
          <button
            onClick={() => onContinue(text)}
            className="flex items-center gap-2 rounded-xl bg-[#E0B873] px-6 py-2.5 text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50]"
          >
            {t("continue")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Speaking-prompt exercise ───────────────────────────────────────────────────
// Record-and-playback for self-practice. No audio is uploaded or stored, and
// there is no automated pronunciation scoring (that would need a separate
// speech-analysis service) — this is deliberately a local self-check.
function SpeakingPromptExercise({
  prompt,
  modelAnswer,
  tip,
  locale,
  onContinue,
}: {
  prompt: string;
  modelAnswer: string;
  tip: string | null;
  locale: string;
  onContinue: () => void;
}) {
  const t = useTranslations("learn");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startRecording() {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        setHasRecording(true);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setPermissionError(t("microphoneDenied"));
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function togglePlayback() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/3 rounded-xl border border-white/10 p-4">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
          {t("modelAnswer")}
        </p>
        <p className="text-sm italic text-white/60">{displayText(modelAnswer)}</p>
        <GermanAudio text={displayText(modelAnswer)} locale={locale} />
      </div>

      <div className="flex items-center gap-3">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 rounded-xl bg-[#E0B873] px-5 py-2.5 text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50]"
          >
            <Mic className="h-4 w-4" />
            {hasRecording ? t("recordAgain") : t("record")}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-xl bg-red-500/90 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500"
          >
            <Square className="h-3.5 w-3.5" />
            {t("stop")}
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          </button>
        )}

        {hasRecording && audioUrl && (
          <button
            onClick={togglePlayback}
            className="flex items-center gap-2 rounded-xl border border-[#E0B873]/30 px-5 py-2.5 text-sm font-medium text-[#E0B873] transition-colors hover:bg-[#E0B873]/10"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {t("playBack")}
          </button>
        )}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="hidden"
        />
      )}

      {permissionError && <p className="text-xs text-red-300">{permissionError}</p>}

      <p className="text-xs italic text-white/35">{t("recordingNotSaved")}</p>

      {tip && <p className="text-xs italic text-white/35">{displayText(tip)}</p>}

      {hasRecording && (
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 rounded-xl bg-[#E0B873] px-6 py-2.5 text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50]"
          >
            {t("continue")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Quiz ─────────────────────────────────────────────────────────────────
export function Quiz({
  exercises,
  lessonId,
  courseId,
  locale,
  lessonSlug,
  courseLevel = "A1",
}: Props) {
  const t = useTranslations("learn");

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [schoolSync, setSchoolSync] = useState<SchoolSyncStatus | null>(null);
  const [score, setScore] = useState(0);

  const current = exercises[currentIdx];
  const totalQ = exercises.length;
  const currentAnswer = answers[current?.id ?? ""] ?? "";

  const checkAnswer = useCallback((given: string, expected: string) => {
    return given.trim().toLowerCase() === expected.trim().toLowerCase();
  }, []);

  // Writing/speaking prompts have no single correct answer — any completed
  // attempt counts toward completion, since the value is in the practice
  // itself (AI feedback / self-review), not an exact match.
  const isCorrectForScoring = useCallback(
    (ex: Exercise, given: string) => {
      if (ex.type === "writing_prompt" || ex.type === "speaking_prompt")
        return given.trim().length > 0;
      return checkAnswer(given, ex.correct_answer);
    },
    [checkAnswer]
  );

  function handleAnswer(val: string) {
    if (answerState !== "idle") return;
    setAnswers((prev) => ({ ...prev, [current.id]: val }));
  }

  function confirm() {
    if (!currentAnswer || answerState !== "idle") return;
    const correct = checkAnswer(currentAnswer, current.correct_answer);
    setAnswerState(correct ? "correct" : "wrong");
  }

  async function persistResult(pct: number) {
    setSaving(true);
    setSaveError("");
    setSchoolSync(null);
    try {
      const result = await saveLearningProgress({
        lessonId,
        courseId,
        score: pct,
        completed: pct >= 60,
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

  async function next(pendingAnswer?: { id: string; text: string }) {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx((i) => i + 1);
      setAnswerState("idle");
    } else {
      // Final — calculate and save. Merge in pendingAnswer directly rather
      // than reading `answers` state, since a just-set value from the same
      // tick (e.g. a writing-prompt submit) may not have re-rendered yet.
      setSaving(true);
      let correctCount = 0;
      exercises.forEach((ex) => {
        const given = pendingAnswer?.id === ex.id ? pendingAnswer.text : (answers[ex.id] ?? "");
        if (isCorrectForScoring(ex, given)) correctCount++;
      });
      const pct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
      setScore(pct);

      setDone(true);
      await persistResult(pct);
    }
  }

  function reset() {
    setCurrentIdx(0);
    setAnswers({});
    setAnswerState("idle");
    setDone(false);
    setScore(0);
    setSaveError("");
    setSchoolSync(null);
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (exercises.length === 0) {
    return (
      <div className="py-16 text-center text-white/40">
        <Target className="mx-auto mb-3 h-10 w-10 opacity-30" />
        <p className="mb-4">{t("noExercises")}</p>
        <Link
          href={`/${locale}/lessons/${lessonSlug}`}
          className="text-sm text-[#E0B873] hover:underline"
        >
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

        {/* Score hero */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-8 text-center ${
            perfect
              ? "border-[#E0B873]/40 bg-gradient-to-br from-[#E0B873]/15 to-[#E0B873]/5"
              : passed
                ? "bg-[#E0B873]/8 border-[#E0B873]/25"
                : "bg-red-500/8 border-red-500/30"
          }`}
        >
          {perfect && <div className="absolute right-4 top-4 text-2xl">🏆</div>}
          <div className={`mb-2 text-6xl font-bold ${passed ? "text-[#E0B873]" : "text-red-400"}`}>
            {score}%
          </div>
          <p className="mb-1 text-lg font-semibold text-white">
            {correctCount} / {totalQ} {t("correct")}
          </p>
          <p className={`mt-2 text-sm ${passed ? "text-[#E0B873]/80" : "text-red-300/80"}`}>
            {perfect ? t("perfectScore") : passed ? t("wellDone") : t("notQuite")}
          </p>
        </div>

        {/* Per-question review */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            {t("review")}
          </h3>
          {exercises.map((ex, idx) => {
            const given = answers[ex.id] ?? "";
            const correct = isCorrectForScoring(ex, given);
            return (
              <div
                key={ex.id}
                className={`rounded-xl border p-4 ${correct ? "border-[#E0B873]/20 bg-[#E0B873]/5" : "border-red-500/20 bg-red-500/5"}`}
              >
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#E0B873]" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-sm font-medium text-white">
                      {idx + 1}. {displayText(ex.question)}
                    </p>
                    {ex.type === "writing_prompt" ? (
                      <p className="mt-1 whitespace-pre-wrap text-xs text-white/50">{given}</p>
                    ) : ex.type === "speaking_prompt" ? (
                      <p className="mt-1 text-xs italic text-white/35">{t("practiceCompleted")}</p>
                    ) : (
                      !correct && (
                        <div className="mt-1 space-y-0.5">
                          <p className="text-xs text-red-300">
                            {t("yourAnswerLabel")}{" "}
                            <span className="font-medium">{given || "…"}</span>
                          </p>
                          <p className="text-xs text-[#E0B873]">
                            {t("correctShort")}{" "}
                            <span className="font-medium">{displayText(ex.correct_answer)}</span>
                          </p>
                        </div>
                      )
                    )}
                    {ex.explanation && (
                      <p className="mt-1.5 text-xs italic text-white/35">{displayText(ex.explanation)}</p>
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
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            {t("tryAgain")}
          </button>
          <Link
            href={`/${locale}/lessons/${lessonSlug}`}
            className="rounded-xl border border-[#E0B873]/30 px-5 py-2.5 text-sm font-medium text-[#E0B873] transition-colors hover:bg-[#E0B873]/10"
          >
            {t("backToLesson")}
          </Link>
        </div>
      </div>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  const progress = (currentIdx / totalQ) * 100;
  const isWordOrder = current.type === "word_order";
  const isMultipleChoice = current.type === "multiple_choice" && Array.isArray(current.options);
  const isWritingPrompt = current.type === "writing_prompt";
  const isSpeakingPrompt = current.type === "speaking_prompt";

  // Shuffle words for word_order type (stable per question)
  const shuffledWords = isWordOrder
    ? current.correct_answer.split(" ").sort(() => {
        // Deterministic shuffle based on question id
        const seed = current.id.charCodeAt(0) + current.id.charCodeAt(1);
        return Math.sin(seed) - 0.5;
      })
    : [];

  const progressBar = (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-white/35">
        <span>{t("questionOf", { current: currentIdx + 1, total: totalQ })}</span>
        <div className="flex gap-1">
          {exercises.map((_, i) => {
            const ans = answers[exercises[i].id];
            const isDone = ans !== undefined && i < currentIdx;
            const isRight = isDone && isCorrectForScoring(exercises[i], ans ?? "");
            return (
              <div
                key={i}
                className={`h-1.5 w-5 rounded-full transition-colors ${
                  i === currentIdx
                    ? "bg-[#E0B873]"
                    : isDone && isRight
                      ? "bg-emerald-400/70"
                      : isDone
                        ? "bg-red-400/70"
                        : "bg-white/10"
                }`}
              />
            );
          })}
        </div>
      </div>
      <div className="bg-white/8 h-1 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  if (isWritingPrompt) {
    return (
      <div className="space-y-5">
        {progressBar}
        <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="bg-[#E0B873]/8 flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E0B873]/50">
              <PenLine className="h-3 w-3" />
              {t("writingPromptLabel")}
            </span>
          </div>
          <p className="mb-5 text-base font-semibold leading-relaxed text-white">
            {displayText(current.question)}
          </p>
          <WritingPromptExercise
            key={current.id}
            prompt={current.question}
            sampleAnswer={current.correct_answer}
            tip={current.explanation}
            locale={locale}
            courseLevel={courseLevel}
            onContinue={(text) => {
              setAnswers((prev) => ({ ...prev, [current.id]: text }));
              next({ id: current.id, text });
            }}
          />
        </div>
      </div>
    );
  }

  if (isSpeakingPrompt) {
    return (
      <div className="space-y-5">
        {progressBar}
        <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="bg-[#E0B873]/8 flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E0B873]/50">
              <Mic className="h-3 w-3" />
              {t("speakingPromptLabel")}
            </span>
          </div>
          <p className="mb-5 text-base font-semibold leading-relaxed text-white">
            {displayText(current.question)}
          </p>
          <SpeakingPromptExercise
            key={current.id}
            prompt={current.question}
            modelAnswer={current.correct_answer}
            tip={current.explanation}
            locale={locale}
            onContinue={() => {
              setAnswers((prev) => ({ ...prev, [current.id]: "recorded" }));
              next({ id: current.id, text: "recorded" });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-white/35">
          <span>{t("questionOf", { current: currentIdx + 1, total: totalQ })}</span>
          <div className="flex gap-1">
            {exercises.map((_, i) => {
              const ans = answers[exercises[i].id];
              const isDone = ans !== undefined && i < currentIdx;
              const isRight = isDone && isCorrectForScoring(exercises[i], ans ?? "");
              return (
                <div
                  key={i}
                  className={`h-1.5 w-5 rounded-full transition-colors ${
                    i === currentIdx
                      ? "bg-[#E0B873]"
                      : isDone && isRight
                        ? "bg-emerald-400/70"
                        : isDone
                          ? "bg-red-400/70"
                          : "bg-white/10"
                  }`}
                />
              );
            })}
          </div>
        </div>
        <div className="bg-white/8 h-1 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E0B873] to-[#C99B50] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className={`rounded-2xl border p-6 transition-all duration-300 ${
          answerState === "correct"
            ? "bg-emerald-400/8 border-emerald-400/40"
            : answerState === "wrong"
              ? "bg-red-400/8 border-red-400/40"
              : "border-white/10 bg-[#0A1E35]/60"
        }`}
      >
        {/* Type badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className="bg-[#E0B873]/8 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E0B873]/50">
            {isWordOrder
              ? t("buildSentence")
              : isMultipleChoice
                ? t("chooseAnswer")
                : t("fillBlank")}
          </span>
        </div>

        <p className="mb-5 text-base font-semibold leading-relaxed text-white">
          {displayText(current.question)}
        </p>

        {/* Answer input by type */}
        {isMultipleChoice ? (
          <div className="space-y-2.5">
            {current.options!.map((opt) => {
              const isSelected = currentAnswer === opt;
              const isCorrectOpt =
                opt.trim().toLowerCase() === current.correct_answer.trim().toLowerCase();
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
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={answerState !== "idle"}
                  className={cls}
                >
                  {answerState !== "idle" && isCorrectOpt && (
                    <CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-400" />
                  )}
                  {answerState !== "idle" && isSelected && !isCorrectOpt && (
                    <XCircle className="mr-2 inline h-4 w-4 text-red-400" />
                  )}
                  {displayText(opt)}
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
            <div className="rounded-xl border border-[#E0B873]/30 bg-[#E0B873]/5 p-3">
              <p className="text-sm text-white">{currentAnswer}</p>
            </div>
          )
        ) : (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && answerState === "idle" && currentAnswer && confirm()
            }
            disabled={answerState !== "idle"}
            placeholder={t("answerPlaceholderEllipsis")}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-white/20 focus:border-[#E0B873]/50 focus:outline-none disabled:opacity-60"
          />
        )}

        {/* Feedback */}
        {answerState !== "idle" && (
          <div
            className={`mt-4 flex items-start gap-2.5 rounded-xl p-3.5 ${
              answerState === "correct"
                ? "border border-emerald-400/25 bg-emerald-400/10"
                : "border border-red-400/25 bg-red-400/10"
            }`}
          >
            {answerState === "correct" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
            )}
            <div>
              <p
                className={`text-sm font-semibold ${answerState === "correct" ? "text-emerald-300" : "text-red-300"}`}
              >
                {answerState === "correct"
                  ? t("correctExclaim")
                  : t("wrongAnswer", { answer: displayText(current.correct_answer) })}
              </p>
              {current.explanation && (
                <p className="mt-1 text-xs text-white/50">{displayText(current.explanation)}</p>
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
            className="flex items-center gap-2 rounded-xl bg-[#E0B873] px-6 py-2.5 text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("check")}
            <Zap className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => next()}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#E0B873] px-6 py-2.5 text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50]"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {currentIdx < totalQ - 1 ? t("next") : t("results")}
            {!saving &&
              (currentIdx < totalQ - 1 ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <Trophy className="h-4 w-4" />
              ))}
          </button>
        )}
      </div>
    </div>
  );
}
