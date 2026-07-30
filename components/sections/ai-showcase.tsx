"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageSquare, Sparkles, Zap, Shield, Brain, ChevronRight, Bot, User } from "lucide-react";

const FEATURE_ICONS = [MessageSquare, Zap, Brain, Shield];
const FEATURE_KEYS = ["conversation", "corrections", "adaptive", "safe"] as const;

const CHAT_PREVIEW_KEYS = [
  { sender: "user", key: "chatUser1" },
  { sender: "ai", key: "chatAi1" },
  { sender: "user", key: "chatUser2" },
  { sender: "ai", key: "chatAi2" },
] as const;

export function AIShowcaseSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";
  const t = useTranslations("aiShowcase");

  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#CEA66F]/30 bg-[#CEA66F]/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-[#CEA66F] uppercase mb-4">
            <Sparkles className="h-3 w-3" />
            {t("badge")}
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-white/45 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Features */}
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURE_KEYS.map((key, idx) => {
              const Icon = FEATURE_ICONS[idx];
              return (
                <div
                  key={key}
                  className="bg-[#0A1E35]/50 border border-white/8 rounded-2xl p-5 hover:border-[#CEA66F]/15 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-[#CEA66F]/10 border border-[#CEA66F]/20 flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4 text-[#CEA66F]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{t(`feature.${key}.title`)}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{t(`feature.${key}.desc`)}</p>
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
                  <p className="text-sm font-semibold text-white">{t("chatName")}</p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {t("online")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {CHAT_PREVIEW_KEYS.map((msg, i) => (
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
                      {t(msg.key)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                <p className="text-[11px] text-white/30">{t("typeMessage")}</p>
                <Link
                  href={`/${locale}/ai-trainer`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#CEA66F] hover:text-[#D9B173] transition-colors"
                >
                  {t("openTrainer")} <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
