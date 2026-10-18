"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import type { PaidLevel } from "@/lib/entitlements";
import { useNativePlatform } from "@/hooks/use-native-platform";

interface Props {
  locale: string;
  level: PaidLevel;
  backHref: string;
}

export function UpgradeWall({ locale, level, backHref }: Props) {
  const t = useTranslations("upgradeWall");
  const platform = useNativePlatform();
  const isIos = platform === "ios";

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

        {isIos ? (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">{t("iosPurchaseUnavailable")}</p>
        ) : platform !== null ? <><p className="mb-5 text-sm leading-relaxed text-white/60">{locale === "de" ? "Der aktuelle Testzugang ist kostenlos. Es werden keine Zahlungsdaten erfasst. Prüfe deine verfügbaren Zugänge im Konto." : "The current tester pilot is free. No payment details are collected. Check the access options available for your account."}</p><Link href={`/${locale}/subscription`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#E0B873] px-6 py-3 font-semibold text-[#071424]">{locale === "de" ? "Zugänge ansehen" : "View access options"}</Link></> : null}

      </div>
    </div>
  );
}
