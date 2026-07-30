"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Bot, User, Loader2, RotateCcw, Sparkles, Crown } from "lucide-react";
import type { AITrainerAccessTier } from "@/lib/aiTrainer/access";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
}

interface Props {
  locale: string;
  userName: string;
  userLevel?: string;
  accessTier: AITrainerAccessTier;
  dailyLimit: number;
  paidAccessEnabled: boolean;
  checkoutAvailable: boolean;
}

export function AITrainerClient({
  locale,
  userName,
  userLevel = "A1",
  accessTier,
  dailyLimit,
  paidAccessEnabled,
  checkoutAvailable,
}: Props) {
  const t = useTranslations("aiTrainer");
  const quickPrompts = t.raw("quickPrompts") as string[];
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: t("welcome") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [upgradeNeeded, setUpgradeNeeded] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
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

      const remainingHeader = res.headers.get("x-ai-trainer-remaining");
      if (remainingHeader !== null) setRemaining(Number(remainingHeader));

      if (res.status === 402) {
        const body = await res.json().catch(() => ({})) as {
          limit?: number;
          checkoutAvailable?: boolean;
        };
        setUpgradeNeeded(true);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: t("upgradeNeededMessage", { limit: body.limit ?? dailyLimit }),
                }
              : m,
          ),
        );
        setLoading(false);
        return;
      }

      if (res.status === 429) {
        const body = await res.json().catch(() => ({})) as { limit?: number };
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: t("dailyLimitReached", { limit: body.limit ?? dailyLimit }),
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
                text: t("errorMessage"),
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function startUpgrade() {
    if (!checkoutAvailable || checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "ai_trainer" }),
      });
      const body = await response.json() as { url?: string; error?: string };
      if (!response.ok || !body.url) {
        throw new Error(body.error ?? "Checkout unavailable");
      }
      window.location.href = body.url;
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          text: t("checkoutUnavailable"),
        },
      ]);
      setCheckoutLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function resetChat() {
    setMessages([{ id: 0, role: "assistant", text: t("welcome") }]);
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
            <h1 className="text-sm font-bold text-white">{t("title")}</h1>
            <p className="text-[10px] text-[#E0B873]/60 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
              {accessTier === "preview"
                ? t("statusPreview", { limit: dailyLimit })
                : t("statusOnline")}
            </p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("reset")}
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
          {quickPrompts.map((p) => (
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

      {paidAccessEnabled && accessTier === "preview" && (
        <div className="mx-4 lg:mx-8 mt-3 rounded-xl border border-[#E0B873]/20 bg-[#E0B873]/8 px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#E0B873] flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5" />
              DeutschPilot AI Premium
            </p>
            <p className="text-[10px] text-white/45 mt-1">
              {t("previewMessagesAvailable", { remaining: remaining ?? dailyLimit })}
            </p>
          </div>
          {checkoutAvailable && (
            <button
              type="button"
              onClick={startUpgrade}
              disabled={checkoutLoading}
              className="flex-shrink-0 rounded-lg bg-[#E0B873] px-3 py-2 text-[10px] font-bold text-[#071424] hover:bg-[#C99B50] disabled:opacity-60"
            >
              {checkoutLoading ? t("loading") : t("unlockPremium")}
            </button>
          )}
        </div>
      )}

      {upgradeNeeded && paidAccessEnabled && checkoutAvailable && (
        <div className="px-4 lg:px-8 pt-3">
          <button
            type="button"
            onClick={startUpgrade}
            disabled={checkoutLoading}
            className="w-full rounded-xl bg-[#E0B873] py-2.5 text-xs font-bold text-[#071424] hover:bg-[#C99B50] disabled:opacity-60"
          >
            {checkoutLoading ? t("openingCheckout") : t("unlockPremiumFull")}
          </button>
        </div>
      )}

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
            placeholder={t("inputPlaceholder")}
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
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
