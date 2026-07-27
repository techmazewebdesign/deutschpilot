"use client";

import { useParams } from "next/navigation";
import { BookOpen, Brain, Headphones, Award, PenTool, Users } from "lucide-react";

const FACTS = [
  {
    icon: BookOpen,
    titleDE: "30 Themenräume, A1 bis C1",
    titleEN: "30 themed rooms, A1 to C1",
    descDE: "Sechs Räume pro Niveau, jeder mit drei Lektionen und einem Checkpoint-Quiz.",
    descEN: "Six rooms per level, each with three lessons and a checkpoint quiz.",
  },
  {
    icon: Headphones,
    titleDE: "Alle vier Fertigkeiten",
    titleEN: "All four skills",
    descDE: "Eigene Übungskurse für Hören, Lesen, Schreiben und Sprechen auf jedem Niveau.",
    descEN: "Dedicated practice courses for listening, reading, writing, and speaking at every level.",
  },
  {
    icon: Brain,
    titleDE: "KI-Feedback beim Schreiben",
    titleEN: "AI feedback on your writing",
    descDE: "Schreibaufgaben werden von unserem KI-Trainer bewertet — mit konkretem, niveaugerechtem Feedback.",
    descEN: "Writing exercises are reviewed by our AI trainer — with concrete, level-appropriate feedback.",
  },
  {
    icon: Award,
    titleDE: "70% zum Freischalten",
    titleEN: "70% to unlock the next room",
    descDE: "Checkpoint-Quizze stellen sicher, dass du den Stoff wirklich beherrschst, bevor es weitergeht.",
    descEN: "Checkpoint quizzes make sure you've actually got it before you move on.",
  },
  {
    icon: PenTool,
    titleDE: "24 Grammatik- & Kulturguides",
    titleEN: "24 grammar & culture guides",
    descDE: "Vom Konjunktiv II bis zu deutschen Redewendungen — im kostenlosen Magazin.",
    descEN: "From Konjunktiv II to German idioms — free in the Magazine.",
  },
  {
    icon: Users,
    titleDE: "Kostenloser Start",
    titleEN: "Free to start",
    descDE: "Das komplette A1-Niveau ist kostenlos. Registrieren mit E-Mail oder Google in Sekunden.",
    descEN: "The entire A1 level is free. Sign up with email or Google in seconds.",
  },
];

export function WhyDeutschPilotSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";
  const de = locale === "de";

  return (
    <section className="bg-[#071424] py-20 lg:py-24 border-t border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-wider text-[#CEA66F] uppercase mb-2">
            {de ? "Was du wirklich bekommst" : "What you actually get"}
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            {de ? "Warum DeutschPilot" : "Why DeutschPilot"}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.titleEN}
                className="rounded-2xl border border-white/8 bg-[#0A1E35]/50 p-6 hover:border-[#CEA66F]/25 transition-colors"
              >
                <div className="h-11 w-11 rounded-xl bg-[#CEA66F]/12 border border-[#CEA66F]/25 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#CEA66F]" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  {de ? fact.titleDE : fact.titleEN}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {de ? fact.descDE : fact.descEN}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
