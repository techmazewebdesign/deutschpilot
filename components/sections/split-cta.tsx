"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, MessageSquare, Video, GraduationCap, Users, Edit2 } from "lucide-react";

export function SplitCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  return (
    <section ref={ref} className="bg-[#071424] py-20 lg:py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white">
            Who are you?
          </h2>
          <p className="text-white/45 mt-2 text-sm">Choose your path and get started today.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Student */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-[#E0B873]/20 bg-gradient-to-br from-[#0D2040] to-[#081628] p-7 flex flex-col gap-5"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#E0B873]/15 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5 text-[#E0B873]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-1">For Students</h3>
              <p className="text-xs text-white/40">Everything you need to learn German.</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { icon: BookOpen, text: "Learn step by step with structured rooms" },
                { icon: MessageSquare, text: "Practice anytime with the AI Trainer" },
                { icon: Video, text: "Join live classes with real teachers" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-white/60">
                  <item.icon className="h-3.5 w-3.5 text-[#E0B873] flex-shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/signup`}
              className="mt-auto block text-center bg-[#E0B873] text-[#071424] font-bold text-sm py-3 rounded-xl hover:bg-[#C99B50] transition-colors"
            >
              Create Student Account
            </Link>
          </motion.div>

          {/* Teacher */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D2040] to-[#081628] p-7 flex flex-col gap-5"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-4">
                <GraduationCap className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-1">For Teachers</h3>
              <p className="text-xs text-white/40">Manage your classes and grow your students.</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { icon: Edit2, text: "Create and publish live classes easily" },
                { icon: Users, text: "Manage enrolled students per class" },
                { icon: Video, text: "Add Google Meet links — students join in one click" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-white/60">
                  <item.icon className="h-3.5 w-3.5 text-blue-300 flex-shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/signup?role=teacher`}
              className="mt-auto block text-center border border-white/20 text-white font-bold text-sm py-3 rounded-xl hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              Create Teacher Account
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
