"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, RotateCcw, Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
}

const QUICK_PROMPTS_DE = [
  "Korrigiere meinen Satz",
  "Gib mir eine A1-Übung",
  "Erkläre die Grammatik",
  "Übe ein Gespräch mit mir",
  "Teste meinen Wortschatz",
];

const QUICK_PROMPTS_EN = [
  "Correct my sentence",
  "Give me an A1 exercise",
  "Explain grammar",
  "Practice conversation",
  "Test my vocabulary",
];

const WELCOME_DE = `Hallo! Ich bin dein KI-Trainer für Deutsch 🎓

Ich kann dir bei Folgendem helfen:
• Sätze korrigieren und erklären
• Grammatik auf einfache Weise erklären
• Gespräche auf Deutsch üben
• Vokabular-Tests durchführen
• A1–C1 Übungen geben

Auf was möchtest du heute konzentrieren?`;

const WELCOME_EN = `Hello! I'm your AI German trainer 🎓

I can help you with:
• Correcting and explaining your sentences
• Explaining grammar in a simple way
• Practising conversations in German
• Running vocabulary tests
• Giving you A1–C1 exercises

What would you like to focus on today?`;

interface Props {
  locale: string;
  userName: string;
  userLevel?: string;
}

export function AITrainerClient({ locale, userName, userLevel = "A1" }: Props) {
  const de = locale === "de";
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: de ? WELCOME_DE : WELCOME_EN },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    // Placeholder for streaming response
    const assistantId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/ai-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((m) => m.id !== 0), // exclude welcome
          locale,
          userLevel,
        }),
      });

      if (res.status === 429) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: de
                    ? "Du hast heute dein Tageslimit von 20 Nachrichten erreicht. Komm morgen wieder! 🌟"
                    : "You've reached your daily limit of 20 messages. Come back tomorrow! 🌟",
                }
              : m
          )
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
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: accumulated } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: de
                  ? "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut."
                  : "Sorry, something went wrong. Please try again.",
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function resetChat() {
    setMessages([{ id: 0, role: "assistant", text: de ? WELCOME_DE : WELCOME_EN }]);
    setInput("");
  }

  return (
    <div className="h-[calc(100vh-0px)] lg:h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-5 lg:px-8 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E0B873]/30 to-[#E0B873]/10 border border-[#E0B873]/30 flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-[#E0B873]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">{de ? "KI-Trainer" : "AI Trainer"}</h1>
            <p className="text-[10px] text-[#E0B873]/60 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
              {de ? "Online · Bereit zu helfen" : "Online · Ready to help"}
            </p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {de ? "Neu starten" : "Reset"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-[#E0B873]/30 to-[#E0B873]/10 border border-[#E0B873]/25"
                  : "bg-white/8 border border-white/12"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-4 w-4 text-[#E0B873]" />
              ) : (
                <User className="h-4 w-4 text-white/60" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-[#0A1E35]/80 border border-white/8 text-white/85 rounded-tl-none"
                  : "bg-[#E0B873]/15 border border-[#E0B873]/25 text-white rounded-tr-none"
              }`}
            >
              {msg.text || (
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
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="flex-shrink-0 px-4 lg:px-8 pb-2 overflow-x-auto">
        <div className="flex gap-2 w-max">
          {(de ? QUICK_PROMPTS_DE : QUICK_PROMPTS_EN).map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              disabled={loading}
              className="flex-shrink-0 text-xs text-white/55 border border-white/12 rounded-full px-3 py-1.5 hover:border-[#E0B873]/30 hover:text-[#E0B873] transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 lg:px-8 py-4 border-t border-white/5">
        <div className="flex items-end gap-3 bg-[#0A1E35]/80 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#E0B873]/30 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
            rows={1}
            placeholder={
              de
                ? "Schreib eine Nachricht… (Enter zum Senden)"
                : "Type a message… (Enter to send)"
            }
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 resize-none focus:outline-none leading-relaxed max-h-32 overflow-y-auto disabled:opacity-50"
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 h-8 w-8 rounded-xl bg-[#E0B873] hover:bg-[#C99B50] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 text-[#071424] animate-spin" />
            ) : (
              <Send className="h-4 w-4 text-[#071424]" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2">
          {de
            ? "KI-Antworten können Fehler enthalten. Bitte überprüfe kritische Inhalte."
            : "AI responses may contain errors. Please verify critical content."}
        </p>
      </div>
    </div>
  );
}
