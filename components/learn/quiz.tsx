"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import {
  CheckCircle2, XCircle, Loader2, RotateCcw,
  ArrowRight, Trophy, Zap, Target, Sparkles, PenLine, Mic, Square, Play, Pause,
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
  const de = locale === "de";
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
        setFeedback(
          de
            ? "Du hast heute dein Tageslimit an KI-Nachrichten erreicht. Komm morgen wieder! 🌟"
            : "You've reached your daily AI message limit. Come back tomorrow! 🌟"
        );
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
      setFeedback(
        de
          ? "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut."
          : "Sorry, something went wrong. Please try again."
      );
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
        placeholder={de ? "Schreib deine Antwort auf Deutsch…" : "Write your response in German…"}
        className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all resize-none disabled:opacity-70"
      />

      {!requested && (
        <button
          onClick={getFeedback}
          disabled={!text.trim() || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="h-4 w-4" />
          {de ? "KI-Feedback erhalten" : "Get AI feedback"}
        </button>
      )}

      {requested && (
        <div className="rounded-xl border border-[#E0B873]/25 bg-[#E0B873]/8 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#E0B873]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E0B873]/70">
              {de ? "KI-Feedback" : "AI Feedback"}
            </span>
          </div>
          <p className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed">
            {feedback || (
              <span className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-[#E0B873]/50 animate-bounce inline-block"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            )}
          </p>
        </div>
      )}

      {requested && !loading && sampleAnswer && (
        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1.5">
            {de ? "Beispielantwort" : "Sample answer"}
          </p>
          <p className="text-sm text-white/60 italic">{sampleAnswer}</p>
        </div>
      )}

      {tip && (
        <p className="text-xs text-white/35 italic">{tip}</p>
      )}

      {requested && !loading && (
        <div className="flex justify-end">
          <button
            onClick={() => onContinue(text)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
          >
            {de ? "Weiter" : "Continue"}
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
  const de = locale === "de";
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
      setPermissionError(
        de
          ? "Kein Zugriff auf das Mikrofon. Bitte erlaube den Zugriff in deinem Browser."
          : "Couldn't access your microphone. Please allow microphone access in your browser."
      );
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
      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1.5">
          {de ? "Beispielantwort" : "Model answer"}
        </p>
        <p className="text-sm text-white/60 italic">{modelAnswer}</p>
      </div>

      <div className="flex items-center gap-3">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
          >
            <Mic className="h-4 w-4" />
            {hasRecording ? (de ? "Neu aufnehmen" : "Record again") : (de ? "Aufnehmen" : "Record")}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/90 text-white text-sm font-bold hover:bg-red-500 transition-colors"
          >
            <Square className="h-3.5 w-3.5" />
            {de ? "Stopp" : "Stop"}
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </button>
        )}

        {hasRecording && audioUrl && (
          <button
            onClick={togglePlayback}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E0B873]/30 text-[#E0B873] text-sm font-medium hover:bg-[#E0B873]/10 transition-colors"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {de ? "Anhören" : "Play back"}
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

      {permissionError && (
        <p className="text-xs text-red-300">{permissionError}</p>
      )}

      <p className="text-xs text-white/35 italic">
        {de
          ? "Deine Aufnahme wird nicht gespeichert oder hochgeladen — sie ist nur zur eigenen Übung."
          : "Your recording isn't saved or uploaded — it's just for your own practice."}
      </p>

      {tip && <p className="text-xs text-white/35 italic">{tip}</p>}

      {hasRecording && (
        <div className="flex justify-end">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
          >
            {de ? "Weiter" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Quiz ─────────────────────────────────────────────────────────────────
export function Quiz({ exercises, lessonId, courseId, userId, locale, lessonSlug, courseLevel = "A1" }: Props) {
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

  // Writing/speaking prompts have no single correct answer — any completed
  // attempt counts toward completion, since the value is in the practice
  // itself (AI feedback / self-review), not an exact match.
  const isCorrectForScoring = useCallback(
    (ex: Exercise, given: string) => {
      if (ex.type === "writing_prompt" || ex.type === "speaking_prompt") return given.trim().length > 0;
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
            const correct = isCorrectForScoring(ex, given);
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
                    {ex.type === "writing_prompt" ? (
                      <p className="text-xs text-white/50 mt-1 whitespace-pre-wrap">{given}</p>
                    ) : ex.type === "speaking_prompt" ? (
                      <p className="text-xs text-white/35 mt-1 italic">
                        {de ? "Übung abgeschlossen" : "Practice completed"}
                      </p>
                    ) : (
                      !correct && (
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
                      )
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
      <div className="flex items-center justify-between text-xs text-white/35 mb-2">
        <span>{de ? `Frage ${currentIdx + 1} von ${totalQ}` : `Question ${currentIdx + 1} of ${totalQ}`}</span>
        <div className="flex gap-1">
          {exercises.map((_, i) => {
            const ans = answers[exercises[i].id];
            const isDone = ans !== undefined && i < currentIdx;
            const isRight = isDone && isCorrectForScoring(exercises[i], ans ?? "");
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
  );

  if (isWritingPrompt) {
    return (
      <div className="space-y-5">
        {progressBar}
        <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E0B873]/50 bg-[#E0B873]/8 px-2 py-1 rounded-md">
              <PenLine className="h-3 w-3" />
              {de ? "Schreibaufgabe" : "Writing prompt"}
            </span>
          </div>
          <p className="text-base font-semibold text-white leading-relaxed mb-5">
            {current.question}
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
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E0B873]/50 bg-[#E0B873]/8 px-2 py-1 rounded-md">
              <Mic className="h-3 w-3" />
              {de ? "Sprechübung" : "Speaking prompt"}
            </span>
          </div>
          <p className="text-base font-semibold text-white leading-relaxed mb-5">
            {current.question}
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
        <div className="flex items-center justify-between text-xs text-white/35 mb-2">
          <span>{de ? `Frage ${currentIdx + 1} von ${totalQ}` : `Question ${currentIdx + 1} of ${totalQ}`}</span>
          <div className="flex gap-1">
            {exercises.map((_, i) => {
              const ans = answers[exercises[i].id];
              const isDone = ans !== undefined && i < currentIdx;
              const isRight = isDone && isCorrectForScoring(exercises[i], ans ?? "");
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
            onClick={() => next()}
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
