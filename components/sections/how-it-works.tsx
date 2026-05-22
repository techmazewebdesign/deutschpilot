"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Brain, Video, Trophy } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    step: "01",
    title: "Choose Your Level",
    description: "Take a quick placement test or pick your level. We have structured rooms from A1 to C1.",
  },
  {
    icon: Brain,
    step: "02",
    title: "Learn with AI",
    description: "Practice vocabulary, grammar, and conversation with your personal AI Trainer — anytime, anywhere.",
  },
  {
    icon: Video,
    step: "03",
    title: "Join Live Classes",
    description: "Book a live session with a real German teacher via Google Meet and accelerate your progress.",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Track Progress",
    description: "Complete exercises, earn streaks, and watch your level badge grow as you advance.",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-[#071424] py-20 lg:py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#E0B873] uppercase mb-2">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white">Start Learning in 4 Steps</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="relative flex flex-col gap-4 p-6 rounded-2xl border border-white/8 bg-[#0A1E35]/50 hover:border-[#E0B873]/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-[#E0B873]/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-[#E0B873]" />
                </div>
                <span className="text-3xl font-bold text-white/5">{step.step}</span>
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
