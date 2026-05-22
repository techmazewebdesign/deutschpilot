"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Video, CalendarDays, Clock, ArrowRight } from "lucide-react";

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

type PublicClass = {
  id: string; title: string; level: string; teacher_name: string;
  start_time: string; duration_minutes: number;
};

export function LiveClassesPreviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";
  const [classes, setClasses] = useState<PublicClass[]>([]);

  useEffect(() => {
    fetch("/api/classes/public?limit=6")
      .then((r) => r.json())
      .then((d) => setClasses(d.classes ?? []))
      .catch(() => {});
  }, []);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

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
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#E0B873] uppercase mb-2">Live Classes</p>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white">Upcoming Sessions</h2>
          </div>
          <Link href={`/${locale}/classes`} className="flex items-center gap-1.5 text-sm text-[#E0B873]/70 hover:text-[#E0B873] transition-colors font-medium whitespace-nowrap">
            View all classes <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {classes.length === 0 ? (
          <motion.div
            className="text-center py-16 rounded-2xl border border-white/8 bg-[#0A1E35]/40"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Video className="h-10 w-10 mx-auto text-white/15 mb-3" />
            <p className="text-white/35">Live classes will appear here soon.</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group rounded-2xl border border-white/10 bg-[#0A1E35]/70 hover:border-[#E0B873]/30 transition-colors overflow-hidden"
              >
                <div className="h-0.5 w-full bg-gradient-to-r from-[#E0B873] to-[#C99B50]" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${levelColors[cls.level] ?? levelColors.A1}`}>{cls.level}</span>
                  </div>
                  <p className="text-sm font-serif font-bold text-white group-hover:text-[#E0B873] transition-colors leading-snug">{cls.title}</p>
                  <p className="text-xs text-white/40">By {cls.teacher_name}</p>
                  <div className="text-xs text-white/40 space-y-1">
                    <div className="flex items-center gap-1.5"><CalendarDays className="h-3 w-3" />{fmtDate(cls.start_time)}</div>
                    <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{fmtTime(cls.start_time)} · {cls.duration_minutes} min</div>
                  </div>
                  <Link href={`/${locale}/classes`} className="block text-center text-xs font-semibold text-[#E0B873] hover:text-[#C99B50] transition-colors pt-1">
                    View Class →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
