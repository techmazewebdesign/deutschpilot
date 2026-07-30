"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import type { PaidLevel } from "@/lib/entitlements";

interface Props {
  locale: string;
  level: PaidLevel;
  backHref: string;
}

const LEVEL_PRICE_EUR: Record<PaidLevel, number> = {
  A2: 349,
  B1: 399,
  B2: 449,
  C1: 499,
};

export function UpgradeWall({ locale, level, backHref }: Props) {
  const t = useTranslations("upgradeWall");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? t("checkoutStartError"));
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(t("networkError"));
      setLoading(false);
    }
  }

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-2xl w-full mx-auto">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-[#E0B873] transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("back")}
      </Link>

      <div className="rounded-2xl border border-[#E0B873]/25 bg-[#0A1E35]/70 p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E0B873]/12 border border-[#E0B873]/25 mb-5">
          <Lock className="h-6 w-6 text-[#E0B873]" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-white mb-2">
          {t("unlockLevel", { level })}
        </h1>
        <p className="text-sm text-white/50 mb-6 max-w-sm mx-auto">
          {t("paidCourseNotice")}
        </p>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 mb-4">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleBuy}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#E0B873] text-[#071424] font-bold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? t("loading")
            : t("buyLevel", { level, price: LEVEL_PRICE_EUR[level] })}
        </button>
      </div>
    </div>
  );
}
