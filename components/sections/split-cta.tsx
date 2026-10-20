"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { BookOpen, MessageSquare, Video, GraduationCap, Users, Edit2 } from "lucide-react";

export function SplitCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";
  const t = useTranslations("splitCta");

  return (
    <section
      ref={ref}
      className="overflow-x-hidden border-t border-white/[0.04] bg-[#071424] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl font-bold text-white lg:text-4xl">{t("title")}</h2>
          <p className="mt-2 text-sm text-white/45">{t("subtitle")}</p>
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {/* Student */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-5 rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0D2040] to-[#081628] p-7"
          >
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E0B873]/15">
                <BookOpen className="h-5 w-5 text-[#E0B873]" />
              </div>
              <h3 className="mb-1 font-serif text-xl font-bold text-white">
                {t("student.heading")}
              </h3>
              <p className="text-xs text-white/40">{t("student.subheading")}</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { icon: BookOpen, text: t("student.point1") },
                { icon: MessageSquare, text: t("student.point2") },
                { icon: Video, text: t("student.point3") },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-white/60">
                  <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-[#E0B873]" />
                  {item.text}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/signup`}
              className="mt-auto block rounded-xl bg-[#E0B873] py-3 text-center text-sm font-bold text-[#071424] transition-colors hover:bg-[#C99B50]"
            >
              {t("student.cta")}
            </Link>
          </motion.div>

          {/* Teacher */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D2040] to-[#081628] p-7"
          >
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                <GraduationCap className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="mb-1 font-serif text-xl font-bold text-white">
                {t("teacher.heading")}
              </h3>
              <p className="text-xs text-white/40">{t("teacher.subheading")}</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { icon: Edit2, text: t("teacher.point1") },
                { icon: Users, text: t("teacher.point2") },
                { icon: Video, text: t("teacher.point3") },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-white/60">
                  <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-blue-300" />
                  {item.text}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/school`}
              className="mt-auto block rounded-xl border border-white/20 py-3 text-center text-sm font-bold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              {locale === "de"
                ? "Mit Schuleinladung beitreten"
                : "Join with your school invitation"}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
