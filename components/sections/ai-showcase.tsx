"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Sparkles, Zap, Shield, Brain, ChevronRight, Bot, User } from "lucide-react";

const FEATURES = [
  { icon: MessageSquare, title: "Real-Time Conversation", desc: "Practice natural German dialogue with instant corrections and feedback." },
  { icon: Zap, title: "Smart Corrections", desc: "Get grammar, vocabulary, and pronunciation tips tailored to your level." },
  { icon: Brain, title: "Adaptive Learning", desc: "The AI adjusts difficulty and topics based on your progress and weak spots." },
  { icon: Shield, title: "Safe Environment", desc: "Make mistakes freely — no judgment, just constructive guidance." },
];

const CHAT_PREVIEW = [
  { sender: "user", text: "Wie sagt man 'Nice to meet you' auf Deutsch?" },
  { sender: "ai", text: "Man sagt 'Freut mich, Sie kennenzulernen.' Oder informeller: 'Freut mich!' Möchtest du die Aussprache üben?" },
  { sender: "user", text: "Ja, bitte. Und wie fragt man nach dem Namen?" },
  { sender: "ai", text: "'Wie heißen Sie?' (formell) oder 'Wie heißt du?' (informell). Soll ich ein kleines Rollenspiel starten?" },
];

export function AIShowcaseSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#CEA66F]/30 bg-[#CEA66F]/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-[#CEA66F] uppercase mb-4">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
            Your Personal AI German Trainer
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto">
            Available 24/7 to practice conversations, correct mistakes, and guide you through every room — like having a private tutor in your pocket.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Features */}
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-[#0A1E35]/50 border border-white/8 rounded-2xl p-5 hover:border-[#CEA66F]/15 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-[#CEA66F]/10 border border-[#CEA66F]/20 flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4 text-[#CEA66F]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Chat Preview */}
          <div className="relative">
            <div className="absolute -inset-4 bg-[#CEA66F]/3 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0B1E35]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/8">
                <div className="h-8 w-8 rounded-full bg-[#CEA66F]/15 flex items-center justify-center border border-[#CEA66F]/25">
                  <Bot className="h-4 w-4 text-[#CEA66F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">DeutschPilot AI</p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {CHAT_PREVIEW.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === "ai"
                          ? "bg-[#CEA66F]/15 border border-[#CEA66F]/25"
                          : "bg-white/8 border border-white/10"
                      }`}
                    >
                      {msg.sender === "ai" ? (
                        <Bot className="h-3.5 w-3.5 text-[#CEA66F]" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-white/50" />
                      )}
                    </div>
                    <div
                      className={`rounded-xl px-3 py-2 max-w-[80%] text-xs leading-relaxed ${
                        msg.sender === "ai"
                          ? "bg-white/5 border border-white/8 text-white/80"
                          : "bg-[#CEA66F]/10 border border-[#CEA66F]/15 text-white/90"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                <p className="text-[11px] text-white/30">Type a message...</p>
                <Link
                  href={`/${locale}/ai-trainer`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#CEA66F] hover:text-[#D9B173] transition-colors"
                >
                  Open AI Trainer <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
