"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

interface Props {
  locale: string;
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

export function SignupForm({ locale }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();

  function firebaseError(code: string): string {
    const map: Record<string, string> = {
      "auth/email-already-in-use": t("errorEmailInUse"),
      "auth/weak-password": t("errorWeakPassword"),
      "auth/invalid-email": t("errorInvalidEmail"),
    };
    return map[code] ?? t("errorTryAgain");
  }

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all";
  const selectClass =
    "w-full rounded-md bg-[#0A2A50] border border-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#E0B873]/50 transition-all appearance-none cursor-pointer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    setError("");

    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = cred.user;

      await updateProfile(user, { displayName: fullName });

      const idToken = await user.getIdToken();
      const roleRes = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          name: fullName,
          role: "student",
          level: level || null,
          goal: goal || null,
        }),
      });

      if (!roleRes.ok) {
        await user.delete();
        setError(t("accountCreateFailed"));
        return;
      }

      await sendEmailVerification(user, {
        url: `${window.location.origin}/${locale}/verify-email`,
      });

      router.push(`/${locale}/verify-email`);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(firebaseError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">{t("register")}</h1>
        <p className="text-[#C9D2DE] text-sm">
          {t("hasAccount")}{" "}
          <Link href={`/${locale}/login`} className="text-[#E0B873] hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
            {t("name")}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            className={inputClass}
            placeholder={t("fullNamePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputClass}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
            {t("password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
            {t("germanLevel")}
          </label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
            <option value="" disabled>{t("germanLevelPlaceholder")}</option>
            {LEVELS.map((l) => (
              <option key={l} value={l} className="bg-[#0A2A50]">{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
            {t("learningGoal")}
          </label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={selectClass}>
            <option value="" disabled>{t("learningGoalPlaceholder")}</option>
            {(["exam", "work", "university", "daily", "visa", "conversation"] as const).map((g) => (
              <option key={g} value={g} className="bg-[#0A2A50]">{t(`goals.${g}`)}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E0B873] text-[#05101E] font-semibold py-3 rounded-md hover:bg-[#C99B50] transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("register")}
        </button>
      </form>

      <p className="text-center text-xs text-white/30 mt-6 pb-4">
        © {new Date().getFullYear()} DeutschPilot
      </p>
    </div>
  );
}
