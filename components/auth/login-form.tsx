"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

interface Props {
  locale: string;
}

function firebaseError(code: string, de: boolean): string {
  const map: Record<string, [string, string]> = {
    "auth/invalid-credential": ["E-Mail oder Passwort falsch.", "Incorrect email or password."],
    "auth/wrong-password": ["E-Mail oder Passwort falsch.", "Incorrect email or password."],
    "auth/user-not-found": ["Kein Konto gefunden.", "No account found."],
    "auth/user-disabled": ["Dieses Konto ist deaktiviert.", "This account has been disabled."],
    "auth/too-many-requests": ["Zu viele Versuche. Bitte warte kurz.", "Too many attempts. Please wait."],
    "auth/invalid-email": ["Bitte eine gültige E-Mail eingeben.", "Please enter a valid email address."],
  };
  const entry = map[code];
  if (entry) return de ? entry[0] : entry[1];
  return de ? "E-Mail oder Passwort falsch." : "Incorrect email or password.";
}

export function LoginForm({ locale }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();
  const de = locale === "de";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = cred.user;

      if (!user.emailVerified) {
        router.push(`/${locale}/verify-email`);
        return;
      }

      const idToken = await user.getIdToken(true);
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionRes.ok) {
        setError(de ? "Sitzung konnte nicht erstellt werden." : "Session could not be created.");
        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(firebaseError(code, de));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">{t("login")}</h1>
        <p className="text-[#C9D2DE] text-sm">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/signup`} className="text-[#E0B873] hover:underline">
            {t("register")}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            autoComplete="current-password"
            className={inputClass}
            placeholder="••••••••"
          />
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
          {t("login")}
        </button>
      </form>

      <p className="text-center text-xs text-white/30 mt-6 pb-4">
        © {new Date().getFullYear()} DeutschPilot
      </p>
    </div>
  );
}
