"use client";

import { motion } from "framer-motion";

interface Props {
  value: number; // 0–100
  label?: string;
  color?: string;
  height?: number;
}

export function AnimatedProgress({ value, label, color = "#E0B873", height = 6 }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/50">{label}</span>
          <span className="text-xs font-semibold text-white/70">{clamped}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden bg-white/8"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}
