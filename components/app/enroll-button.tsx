"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Props {
  classId: string;
  locale: string;
  isLoggedIn: boolean;
  isTeacher: boolean;
  isEnrolled: boolean;
  isFull: boolean;
}

export function EnrollButton({ classId, locale, isLoggedIn, isTeacher, isEnrolled, isFull }: Props) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [error, setError] = useState("");
  const router = useRouter();

  if (isTeacher) return null;

  if (!isLoggedIn) {
    return (
      <Link
        href={`/${locale}/signin`}
        className="w-full flex items-center justify-center gap-2 border border-[#E0B873]/40 text-[#E0B873] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#E0B873]/10 transition-colors"
      >
        Login to Enroll
      </Link>
    );
  }

  if (enrolled) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
        <CheckCircle2 className="h-4 w-4" /> You&apos;re enrolled!
      </div>
    );
  }

  if (isFull) {
    return (
      <span className="w-full flex items-center justify-center text-sm text-white/30 font-medium py-2.5">
        Class is full
      </span>
    );
  }

  async function handleEnroll() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/classes/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id: classId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Enrollment failed");
      setEnrolled(true);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#E0B873] text-[#071424] font-bold text-sm py-2.5 rounded-xl hover:bg-[#C99B50] transition-colors disabled:opacity-60"
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enrolling…</> : "Enroll Now"}
      </button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
