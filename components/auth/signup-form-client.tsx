"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { GoogleSigninButton } from "@/components/auth/google-signin-button";

interface Props {
  locale: string;
  registerLabel: string;
}

type SignupPlan = "standard" | "tester_trial";
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export function SignupFormClient({ locale, registerLabel }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();

  function firebaseError(code: string): string {
    const map: Record<string, string> = {
      "auth/email-already-in-use": t("errorEmailInUse"),
      "auth/weak-password": t("errorWeakPassword"),
      "auth/invalid-email": t("errorInvalidEmail"),
      "auth/invalid-credential": t("errorInvalidCredentialsGeneric"),
      "auth/user-not-found": t("errorNoAccountEmail"),
      "auth/too-many-requests": t("errorTooManyRequests"),
      "auth/network-request-failed": t("errorNetworkFailed"),
      "auth/internal-error": t("errorInternal"),
      "auth/configuration-not-found": t("errorConfigMissing"),
    };
    return map[code] ?? t("errorWithCode", { code });
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const role = "student" as const;
  const [level, setLevel] = useState("A1");
  const [plan, setPlan] = useState<SignupPlan>("standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CEA66F]/50 transition-all";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("errorWeakPassword"));
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Firebase user
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = cred.user;
      console.log("[signup] Firebase user created:", user.uid);

      await updateProfile(user, { displayName: name });

      // Step 2: Get ID token and call set-role to create the Supabase profile + set custom claims
      const idToken = await user.getIdToken(true);
      console.log("[signup] Calling /api/auth/set-role  role=" + role);

      const roleRes = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          fullName: name,
          email,
          role,
          germanLevel: role === "student" ? level : null,
        }),
      });

      // Always try to parse the response as JSON
      let roleData: { ok?: boolean; role?: string; error?: string; detail?: string } = {};
      try {
        roleData = await roleRes.json();
      } catch {
        console.error("[signup] set-role response was not valid JSON. Status:", roleRes.status);
        setError(t("profileCreateFailedReload"));
        setLoading(false);
        return;
      }

      if (!roleRes.ok) {
        console.error("[signup] set-role failed:", roleData);
        // Show the specific server error so it's visible during debugging
        const serverMsg = roleData.detail ?? roleData.error ?? t("profileCreationFailedFallback");
        setError(t("profileCreateFailedDetail", { msg: serverMsg }));
        setLoading(false);
        return;
      }

      console.log("[signup] ✓ Profile created  uid=" + user.uid + "  role=" + roleData.role);

      // Step 3: Force-refresh the token so custom claims are available immediately
      await user.getIdToken(true);

      // Step 4: Send email verification. Non-blocking (the account already
      // exists), but the verify-email page must know when the send failed so
      // it doesn't claim an email is on its way — the user needs to hit Resend.
      let sendFailed = false;
      try {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/${locale}/verify-email`,
        });
      } catch (e) {
        sendFailed = true;
        console.warn("[signup] sendEmailVerification failed (non-blocking):", e);
      }

      console.log("[signup] ✓ Signup complete: redirecting to verify-email");
      const params = new URLSearchParams();
      if (sendFailed) params.set("sent", "0");
      if (plan === "tester_trial") params.set("plan", "tester_trial");
      const query = params.toString();
      router.push(`/${locale}/verify-email${query ? `?${query}` : ""}`);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("[signup] Unexpected error:", error);
      const code = error.code ?? "";
      setError(firebaseError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="rounded-md border border-[#CEA66F]/30 bg-[#CEA66F]/10 p-4 text-sm text-white/80">
          <p>
            {locale === "de"
              ? "Erstellen Sie ein persönliches Konto. Der Zugriff als Lehrkraft oder Schulmitarbeiter wird nach der E-Mail-Bestätigung ausschließlich durch eine Einladung Ihrer Schule vergeben."
              : "Create a personal account. Teacher and school staff access is assigned only through your school’s invitation after email verification."}
          </p>
          <Link href={`/${locale}/school`} className="mt-2 inline-block text-[#E0B873] underline">
            {locale === "de"
              ? "Bereits eingeladen? Schulbereich öffnen"
              : "Already invited? Open your school workspace"}
          </Link>
        </div>

        <div>
          <label
            htmlFor="signup-name"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60"
          >
            {t("fullNameLabel")}
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder={t("fullNamePlaceholder")}
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60"
          >
            {t("email")}
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60"
          >
            {t("password")}
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60"
          >
            {t("confirmPassword")}
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {role === "student" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
              {t("currentGermanLevel")}
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`rounded-md border py-2 text-xs font-semibold transition-all ${
                    level === l
                      ? "border-[#CEA66F] bg-[#CEA66F] text-[#071424]"
                      : "bg-white/3 border-white/10 text-white/50 hover:border-white/25"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {role === "student" && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">
              {locale === "de" ? "Zugangsplan" : "Access plan"}
            </p>
            <button
              type="button"
              onClick={() => setPlan("standard")}
              className={`w-full rounded-md border px-4 py-3 text-left transition-all ${plan === "standard" ? "border-[#CEA66F]/60 bg-[#CEA66F]/10" : "bg-white/3 border-white/10"}`}
            >
              <span className="block text-sm font-semibold text-white">
                {locale === "de" ? "Standardzugang: kostenlos" : "Standard access: free"}
              </span>
              <span className="mt-1 block text-xs text-white/45">
                {locale === "de"
                  ? "Begrenzter Zugang. Keine Bankkarte erforderlich."
                  : "Limited access. No bank card required."}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPlan("tester_trial")}
              className={`w-full rounded-md border px-4 py-3 text-left transition-all ${plan === "tester_trial" ? "border-[#CEA66F]/60 bg-[#CEA66F]/10" : "bg-white/3 border-white/10"}`}
            >
              <span className="block text-sm font-semibold text-white">
                {locale === "de"
                  ? "Testzugang: 3 Monate voller Zugang"
                  : "Tester access: 3 months full access"}
              </span>
              <span className="mt-1 block text-xs text-white/45">
                {locale === "de"
                  ? "Nach der E-Mail-Bestätigung wird der volle Zugang automatisch für 90 Tage aktiviert. Während der Pilotphase keine Karte, Zahlung oder Abonnement."
                  : "After email confirmation, full access is activated automatically for 90 days. No card, charge, or subscription during the pilot."}
              </span>
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-md bg-[#D9B173] py-3 font-semibold text-[#071424] transition-colors hover:bg-[#B98A4E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t("creatingAccount") : registerLabel}
        </button>
      </form>

      <GoogleSigninButton locale={locale} variant="signup" />
    </>
  );
}
