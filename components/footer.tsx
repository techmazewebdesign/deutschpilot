"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-navy-900 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gold">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-navy-900"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-white uppercase">
                  DeutschPilot
                </span>
                <span className="text-[10px] tracking-widest text-gold/80 uppercase">
                  {t("tagline")}
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/40 max-w-xs">{t("description")}</p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t("columns.courses")}</h4>
            <ul className="space-y-2">
              {["a1", "a2", "b1", "b2", "c1"].map((level) => (
                <li key={level}>
                  <Link
                    href={`/${locale}/courses`}
                    className="text-sm text-white/40 hover:text-gold transition-colors"
                  >
                    {t(`links.${level}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t("columns.company")}</h4>
            <ul className="space-y-2">
              {["about", "contact"].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${locale}/${link}`}
                    className="text-sm text-white/40 hover:text-gold transition-colors"
                  >
                    {t(`links.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t("columns.legal")}</h4>
            <ul className="space-y-2">
              {["privacy", "terms", "impressum"].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${locale}/${link}`}
                    className="text-sm text-white/40 hover:text-gold transition-colors"
                  >
                    {t(`links.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">{t("copyright", { year })}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/20">Made with care in Germany</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
