"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Users, Video, ArrowRight } from "lucide-react";

type TeacherCard = {
  user_id: string; full_name: string; bio: string | null;
  teaches_levels: string[] | null; activeClasses: number;
};

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300",
  A2: "bg-blue-500/15 text-blue-300",
  B1: "bg-violet-500/15 text-violet-300",
  B2: "bg-amber-500/15 text-amber-300",
};

export function TeachersPreviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";
  const [teachers, setTeachers] = useState<TeacherCard[]>([]);

  useEffect(() => {
    fetch("/api/teachers/public?limit=6")
      .then((r) => r.json())
      .then((d) => setTeachers(d.teachers ?? []))
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="bg-[#071424] py-20 lg:py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#E0B873] uppercase mb-2">Our Teachers</p>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white">Learn with Real Teachers</h2>
          </div>
          <Link href={`/${locale}/teachers`} className="flex items-center gap-1.5 text-sm text-[#E0B873]/70 hover:text-[#E0B873] transition-colors font-medium whitespace-nowrap">
            All teachers <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {teachers.length === 0 ? (
          <motion.div
            className="text-center py-16 rounded-2xl border border-white/8 bg-[#0A1E35]/40"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Users className="h-10 w-10 mx-auto text-white/15 mb-3" />
            <p className="text-white/35">Our teachers will be listed here soon.</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((teacher, i) => {
              const levels = teacher.teaches_levels ?? ["A1", "A2"];
              const initials = teacher.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <motion.div
                  key={teacher.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="group rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 transition-colors p-5 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-[#E0B873]/20 border border-[#E0B873]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#E0B873]">{initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm group-hover:text-[#E0B873] transition-colors">{teacher.full_name}</p>
                      <div className="flex gap-1 mt-0.5">
                        {levels.map((lvl) => <span key={lvl} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${levelColors[lvl] ?? "bg-white/10 text-white/40"}`}>{lvl}</span>)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed line-clamp-2 flex-1">
                    {teacher.bio ?? "Experienced German teacher offering live sessions for beginners and intermediate learners."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-white/30"><Video className="h-3 w-3" />{teacher.activeClasses} active</span>
                    <Link href={`/${locale}/classes`} className="text-xs font-semibold text-[#E0B873] hover:text-[#C99B50] transition-colors">View Classes →</Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
