"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, Headphones, PenTool, Mic, ChevronRight, CheckCircle2,
  XCircle, Clock, Sparkles, Play, Square, RotateCcw,
} from "lucide-react";

export type MockExamData = {
  level: string;
  locale: string;
  reading: { passageTitle: string; passageText: string; question: string; options: string[]; correctAnswer: string }[];
  listening: { audioUrl: string; audioTitle: string; question: string; options: string[]; correctAnswer: string }[];
  writing: { prompt: string; tip: string | null } | null;
  speaking: { prompt: string; tip: string | null } | null;
};

type Step = "intro" | "reading" | "listening" | "writing" | "speaking" | "report";

const ESTIMATED_MINUTES = { reading: 15, listening: 12, writing: 20, speaking: 5 };

export function MockExamClient({ data, isGuest = false }: { data: MockExamData; isGuest?: boolean }) {
  const de = data.locale === "de";
  const [step, setStep] = useState<Step>("intro");

  const [readingAnswers, setReadingAnswers] = useState<Record<number, string>>({});
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, string>>({});
  const [writingCompleted, setWritingCompleted] = useState(false);
  const [speakingCompleted, setSpeakingCompleted] = useState(false);

  const readingScore = data.reading.filter((r, i) => readingAnswers[i] === r.correctAnswer).length;
  const listeningScore = data.listening.filter((l, i) => listeningAnswers[i] === l.correctAnswer).length;
  const objectiveTotal = data.reading.length + data.listening.length;
  const objectiveCorrect = readingScore + listeningScore;
  const objectivePct = objectiveTotal > 0 ? Math.round((objectiveCorrect / objectiveTotal) * 100) : 0;

  // Group reading questions by passage so a shared text only renders once.
  const readingByPassage = useMemo(() => {
    const groups: { passageTitle: string; passageText: string; items: { q: typeof data.reading[number]; index: number }[] }[] = [];
    data.reading.forEach((r, index) => {
      let group = groups.find((g) => g.passageTitle === r.passageTitle);
      if (!group) {
        group = { passageTitle: r.passageTitle, passageText: r.passageText, items: [] };
        groups.push(group);
      }
      group.items.push({ q: r, index });
    });
    return groups;
  }, [data.reading]);

  const sectionOrder: Step[] = ["reading", "listening", "writing", "speaking", "report"];
  function next() {
    const currentIndex = sectionOrder.indexOf(step === "intro" ? "reading" : step);
    const nextStep = step === "intro" ? "reading" : sectionOrder[currentIndex + 1];
    if (nextStep) setStep(nextStep);
  }

  const backHref = `/${data.locale}/rooms?level=${data.level}`;

  return (
    <main className="min-h-screen bg-[#071424] py-10 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-[#E0B873] transition-colors mb-6"
        >
          {de ? "Zurück" : "Back"}
        </Link>

        {step === "intro" && <IntroScreen data={data} de={de} isGuest={isGuest} onStart={next} />}
        {step === "reading" && (
          <ReadingSection
            de={de}
            groups={readingByPassage}
            answers={readingAnswers}
            onAnswer={(i, v) => setReadingAnswers((prev) => ({ ...prev, [i]: v }))}
            onNext={next}
          />
        )}
        {step === "listening" && (
          <ListeningSection
            de={de}
            items={data.listening}
            answers={listeningAnswers}
            onAnswer={(i, v) => setListeningAnswers((prev) => ({ ...prev, [i]: v }))}
            onNext={next}
          />
        )}
        {step === "writing" && (
          <WritingSection
            de={de}
            writing={data.writing}
            locale={data.locale}
            level={data.level}
            onDone={() => { setWritingCompleted(true); next(); }}
          />
        )}
        {step === "speaking" && (
          <SpeakingSection
            de={de}
            speaking={data.speaking}
            onDone={() => { setSpeakingCompleted(true); next(); }}
          />
        )}
        {step === "report" && (
          <ReportScreen
            de={de}
            level={data.level}
            locale={data.locale}
            readingScore={readingScore}
            readingTotal={data.reading.length}
            listeningScore={listeningScore}
            listeningTotal={data.listening.length}
            objectivePct={objectivePct}
            writingCompleted={writingCompleted}
            speakingCompleted={speakingCompleted}
          />
        )}
      </div>
    </main>
  );
}

// ── Intro ────────────────────────────────────────────────────────────────────
function IntroScreen({
  data, de, isGuest, onStart,
}: { data: MockExamData; de: boolean; isGuest: boolean; onStart: () => void }) {
  const router = useRouter();
  const totalMin = ESTIMATED_MINUTES.reading + ESTIMATED_MINUTES.listening + ESTIMATED_MINUTES.writing + ESTIMATED_MINUTES.speaking;

  function handleStartClick() {
    if (isGuest) {
      router.push(`/${data.locale}/signup`);
      return;
    }
    onStart();
  }
  const sections = [
    { icon: BookOpen, titleDE: "Lesen", titleEN: "Reading", n: data.reading.length, minutes: ESTIMATED_MINUTES.reading },
    { icon: Headphones, titleDE: "Hören", titleEN: "Listening", n: data.listening.length, minutes: ESTIMATED_MINUTES.listening },
    { icon: PenTool, titleDE: "Schreiben", titleEN: "Writing", n: data.writing ? 1 : 0, minutes: ESTIMATED_MINUTES.writing },
    { icon: Mic, titleDE: "Sprechen", titleEN: "Speaking", n: data.speaking ? 1 : 0, minutes: ESTIMATED_MINUTES.speaking },
  ];

  return (
    <div>
      <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">
        {de ? "Abschlusstest" : "Final check"}
      </p>
      <h1 className="text-3xl font-serif font-bold text-white mb-3">
        {de ? `${data.level} Modellprüfung` : `${data.level} Mock Exam`}
      </h1>
      <p className="text-sm text-white/50 mb-8 leading-relaxed">
        {de
          ? "Simuliert die echte Prüfungsstruktur (wie Goethe/telc): Lesen, Hören, Schreiben und Sprechen. Am Ende bekommst du eine ehrliche Einschätzung, ob du bereit für die echte Prüfung bist."
          : "Simulates the real exam structure (like Goethe/telc): Reading, Listening, Writing, and Speaking. At the end you'll get an honest readiness assessment before the real exam."}
      </p>

      <div className="space-y-3 mb-8">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.titleEN} className="flex items-center gap-4 rounded-xl border border-white/8 bg-[#0A1E35]/50 p-4">
              <div className="h-10 w-10 rounded-xl bg-[#CEA66F]/12 border border-[#CEA66F]/25 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4.5 w-4.5 text-[#CEA66F]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{de ? s.titleDE : s.titleEN}</p>
                <p className="text-xs text-white/35">{s.n} {de ? "Aufgabe(n)" : "task(s)"}</p>
              </div>
              <span className="text-xs text-white/30 flex items-center gap-1">
                <Clock className="h-3 w-3" /> ~{s.minutes} min
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/30 mb-6 flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" /> {de ? `Gesamtdauer ca. ${totalMin} Minuten` : `Total time ~${totalMin} minutes`}
      </p>

      <button
        onClick={handleStartClick}
        className="w-full flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-bold py-3.5 rounded-xl hover:bg-[#C99B50] transition-colors"
      >
        {isGuest
          ? (de ? "Kostenlos registrieren & starten" : "Sign up free & start")
          : (de ? "Modellprüfung starten" : "Start Mock Exam")}
        <ChevronRight className="h-4 w-4" />
      </button>
      {isGuest && (
        <p className="text-xs text-white/30 text-center mt-3">
          {de ? "Kostenlos, dauert nur eine Minute." : "Free, takes only a minute."}
        </p>
      )}
    </div>
  );
}

// ── Reading ──────────────────────────────────────────────────────────────────
function ReadingSection({
  de, groups, answers, onAnswer, onNext,
}: {
  de: boolean;
  groups: { passageTitle: string; passageText: string; items: { q: MockExamData["reading"][number]; index: number }[] }[];
  answers: Record<number, string>;
  onAnswer: (i: number, v: string) => void;
  onNext: () => void;
}) {
  const allAnswered = groups.every((g) => g.items.every((it) => answers[it.index]));

  return (
    <SectionShell icon={BookOpen} titleDE="Lesen" titleEN="Reading" de={de}>
      {groups.length === 0 ? (
        <EmptyNotice de={de} />
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.passageTitle}>
              <div
                className="prose prose-invert prose-sm max-w-none mb-4 rounded-xl border border-white/8 bg-[#0A1E35]/40 p-5
                  prose-headings:text-white prose-p:text-white/60 prose-li:text-white/55"
                dangerouslySetInnerHTML={{ __html: g.passageText }}
              />
              {g.items.map(({ q, index }) => (
                <QuestionBlock
                  key={index}
                  question={q.question}
                  options={q.options}
                  selected={answers[index]}
                  onSelect={(v) => onAnswer(index, v)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      <NextButton de={de} disabled={!allAnswered} onClick={onNext} />
    </SectionShell>
  );
}

// ── Listening ────────────────────────────────────────────────────────────────
function ListeningSection({
  de, items, answers, onAnswer, onNext,
}: {
  de: boolean;
  items: MockExamData["listening"];
  answers: Record<number, string>;
  onAnswer: (i: number, v: string) => void;
  onNext: () => void;
}) {
  const allAnswered = items.every((_, i) => answers[i]);

  return (
    <SectionShell icon={Headphones} titleDE="Hören" titleEN="Listening" de={de}>
      {items.length === 0 ? (
        <EmptyNotice de={de} />
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl border border-white/8 bg-[#0A1E35]/40 p-5">
              <p className="text-xs text-white/40 mb-2">{item.audioTitle}</p>
              <audio controls className="w-full mb-4" src={item.audioUrl} />
              <QuestionBlock
                question={item.question}
                options={item.options}
                selected={answers[index]}
                onSelect={(v) => onAnswer(index, v)}
              />
            </div>
          ))}
        </div>
      )}
      <NextButton de={de} disabled={!allAnswered} onClick={onNext} />
    </SectionShell>
  );
}

// ── Writing ──────────────────────────────────────────────────────────────────
function WritingSection({
  de, writing, locale, level, onDone,
}: {
  de: boolean;
  writing: MockExamData["writing"];
  locale: string;
  level: string;
  onDone: () => void;
}) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  async function getFeedback() {
    if (!text.trim() || loading || !writing) return;
    setLoading(true);
    setRequested(true);
    setFeedback("");
    try {
      const res = await fetch("/api/ai-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            text: `Please act as an exam-style writing evaluator for the ${level} level. The task was: "${writing.prompt}"\n\nMy German writing:\n"""\n${text.trim()}\n"""\n\nGive exam-style feedback: does this meet ${level} requirements (task fulfillment, coherence, grammar, vocabulary range)? List 2-4 concrete corrections with brief explanations, then one honest overall assessment of whether this would likely pass at ${level}.`,
          }],
          locale,
          userLevel: level,
        }),
      });
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
      setFeedback(de ? "Fehler beim Laden des Feedbacks." : "Error loading feedback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionShell icon={PenTool} titleDE="Schreiben" titleEN="Writing" de={de}>
      {!writing ? (
        <EmptyNotice de={de} />
      ) : (
        <>
          <div className="rounded-xl border border-white/8 bg-[#0A1E35]/40 p-5 mb-4">
            <p className="text-sm text-white/70 leading-relaxed">{writing.prompt}</p>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={requested}
            rows={8}
            placeholder={de ? "Schreib deine Antwort auf Deutsch…" : "Write your response in German…"}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all resize-none disabled:opacity-70 mb-4"
          />
          {!requested && (
            <button
              onClick={getFeedback}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-4"
            >
              <Sparkles className="h-4 w-4" />
              {de ? "Feedback anfordern" : "Get feedback"}
            </button>
          )}
          {feedback && (
            <div className="rounded-xl border border-[#E0B873]/20 bg-[#E0B873]/5 p-5 text-sm text-white/70 leading-relaxed whitespace-pre-wrap mb-4">
              {feedback}
            </div>
          )}
        </>
      )}
      <NextButton de={de} disabled={!!writing && !feedback} onClick={onDone} />
    </SectionShell>
  );
}

// ── Speaking ─────────────────────────────────────────────────────────────────
function SpeakingSection({ de, speaking, onDone }: { de: boolean; speaking: MockExamData["speaking"]; onDone: () => void }) {
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
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
        de ? "Kein Zugriff auf das Mikrofon. Bitte erlaube den Zugriff." : "Couldn't access your microphone. Please allow access."
      );
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <SectionShell icon={Mic} titleDE="Sprechen" titleEN="Speaking" de={de}>
      {!speaking ? (
        <EmptyNotice de={de} />
      ) : (
        <>
          <div className="rounded-xl border border-white/8 bg-[#0A1E35]/40 p-5 mb-5">
            <p className="text-sm text-white/70 leading-relaxed">{speaking.prompt}</p>
          </div>

          <p className="text-xs text-white/35 mb-4">
            {de
              ? "Sprechen ist im Selbststudium nicht automatisch bewertbar — nimm dich auf und höre dir die Aufnahme an, oder teile sie mit einer Lehrkraft für echtes Feedback."
              : "Speaking can't be auto-scored in self-study — record yourself and listen back, or share it with a teacher for real feedback."}
          </p>

          {permissionError && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 mb-4">{permissionError}</p>
          )}

          <div className="flex items-center gap-3 mb-4">
            {!recording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors"
              >
                <Mic className="h-4 w-4" /> {hasRecording ? (de ? "Erneut aufnehmen" : "Re-record") : (de ? "Aufnehmen" : "Record")}
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm font-bold"
              >
                <Square className="h-4 w-4" /> {de ? "Stopp" : "Stop"}
              </button>
            )}
          </div>

          {audioUrl && <audio controls src={audioUrl} className="w-full mb-4" />}
        </>
      )}
      <NextButton de={de} disabled={!!speaking && !hasRecording} onClick={onDone} />
    </SectionShell>
  );
}

// ── Report ───────────────────────────────────────────────────────────────────
function ReportScreen({
  de, level, locale, readingScore, readingTotal, listeningScore, listeningTotal, objectivePct, writingCompleted, speakingCompleted,
}: {
  de: boolean; level: string; locale: string;
  readingScore: number; readingTotal: number;
  listeningScore: number; listeningTotal: number;
  objectivePct: number; writingCompleted: boolean; speakingCompleted: boolean;
}) {
  // Goethe/telc-style pass mark is ~60% overall — used here only as an informal heuristic, not an official grading claim.
  const likelyReady = objectivePct >= 60;

  return (
    <div>
      <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-3">
        {de ? "Ergebnis" : "Result"}
      </p>
      <h1 className="text-3xl font-serif font-bold text-white mb-6">
        {de ? "Deine Einschätzung" : "Your readiness report"}
      </h1>

      <div className={`rounded-2xl border p-6 mb-6 text-center ${
        likelyReady ? "border-emerald-500/30 bg-emerald-500/8" : "border-amber-500/30 bg-amber-500/8"
      }`}>
        {likelyReady ? (
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
        ) : (
          <XCircle className="h-8 w-8 text-amber-400 mx-auto mb-3" />
        )}
        <p className="text-lg font-serif font-bold text-white mb-1">
          {likelyReady
            ? (de ? "Solide Grundlage für die echte Prüfung" : "Solid foundation for the real exam")
            : (de ? "Noch etwas Übung empfohlen" : "A bit more practice recommended")}
        </p>
        <p className="text-sm text-white/50">
          {de
            ? `${objectivePct}% in Lesen & Hören (Richtwert: ab 60% gilt in echten Prüfungen meist als bestanden).`
            : `${objectivePct}% on Reading & Listening (informal reference: real exams typically pass around 60%+).`}
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <ScoreRow icon={BookOpen} label={de ? "Lesen" : "Reading"} score={readingScore} total={readingTotal} />
        <ScoreRow icon={Headphones} label={de ? "Hören" : "Listening"} score={listeningScore} total={listeningTotal} />
        <CompletedRow icon={PenTool} label={de ? "Schreiben" : "Writing"} completed={writingCompleted} de={de} />
        <CompletedRow icon={Mic} label={de ? "Sprechen" : "Speaking"} completed={speakingCompleted} de={de} />
      </div>

      <p className="text-xs text-white/30 mb-6 leading-relaxed">
        {de
          ? "Hinweis: Dies ist eine Selbsteinschätzung auf Basis von Übungsaufgaben, keine offizielle Prüfungsbewertung. Schreiben und Sprechen werden nicht automatisch benotet."
          : "Note: this is a self-assessment based on practice exercises, not an official exam grade. Writing and Speaking are not auto-scored."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/${locale}/rooms?level=${level}`}
          className="flex-1 text-center px-6 py-3 rounded-xl border border-white/15 text-white/70 font-medium hover:border-white/30 hover:text-white transition-colors"
        >
          {de ? "Zurück zu den Räumen" : "Back to rooms"}
        </Link>
        <Link
          href={`/${locale}/mock-exam/${level}`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E0B873] text-[#071424] font-bold hover:bg-[#C99B50] transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> {de ? "Erneut versuchen" : "Try again"}
        </Link>
      </div>
    </div>
  );
}

// ── Shared bits ──────────────────────────────────────────────────────────────
function SectionShell({
  icon: Icon, titleDE, titleEN, de, children,
}: { icon: typeof BookOpen; titleDE: string; titleEN: string; de: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Icon className="h-4 w-4 text-[#CEA66F]" />
        <h2 className="text-xs font-semibold text-white/70 uppercase tracking-wider">{de ? titleDE : titleEN}</h2>
      </div>
      {children}
    </div>
  );
}

function QuestionBlock({
  question, options, selected, onSelect,
}: { question: string; options: string[]; selected: string | undefined; onSelect: (v: string) => void }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-white mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
              selected === opt
                ? "border-[#E0B873]/60 bg-[#E0B873]/10 text-[#E0B873]"
                : "border-white/10 text-white/60 hover:border-white/25"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoreRow({ icon: Icon, label, score, total }: { icon: typeof BookOpen; label: string; score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-[#0A1E35]/50 p-4">
      <Icon className="h-4 w-4 text-[#CEA66F] flex-shrink-0" />
      <span className="text-sm text-white flex-1">{label}</span>
      <span className="text-sm font-semibold text-[#E0B873] tabular-nums">{score}/{total} ({pct}%)</span>
    </div>
  );
}

function CompletedRow({ icon: Icon, label, completed, de }: { icon: typeof BookOpen; label: string; completed: boolean; de: boolean }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-[#0A1E35]/50 p-4">
      <Icon className="h-4 w-4 text-[#CEA66F] flex-shrink-0" />
      <span className="text-sm text-white flex-1">{label}</span>
      <span className="text-xs text-white/40">{completed ? (de ? "✓ Geübt" : "✓ Practiced") : (de ? "Übersprungen" : "Skipped")}</span>
    </div>
  );
}

function EmptyNotice({ de }: { de: boolean }) {
  return (
    <p className="text-sm text-white/40 mb-6">
      {de ? "Für diesen Abschnitt sind noch keine Inhalte verfügbar." : "No content available for this section yet."}
    </p>
  );
}

function NextButton({ de, disabled, onClick }: { de: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-bold py-3.5 rounded-xl hover:bg-[#C99B50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
    >
      {de ? "Weiter" : "Continue"} <ChevronRight className="h-4 w-4" />
    </button>
  );
}
