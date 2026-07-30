"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

type Role = "student" | "teacher";
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
  const [role, setRole] = useState<Role>("student");
  const [level, setLevel] = useState("A1");
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

      console.log("[signup] ✓ Signup complete — redirecting to verify-email");
      router.push(`/${locale}/verify-email${sendFailed ? "?sent=0" : ""}`);
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
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {/* Role selection */}
      <div>
        <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
          {t("iAmA")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(["student", "teacher"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2.5 rounded-md text-sm font-medium border transition-all ${
                role === r
                  ? "bg-[#CEA66F]/15 border-[#CEA66F]/60 text-[#CEA66F]"
                  : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {r === "student" ? t("roleStudent") : t("roleTeacher")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
          {t("fullNameLabel")}
        </label>
        <input
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
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
          {t("email")}
        </label>
        <input
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
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
          {t("password")}
        </label>
        <input
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
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
          {t("confirmPassword")}
        </label>
        <input
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
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
            {t("currentGermanLevel")}
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`py-2 rounded-md text-xs font-semibold border transition-all ${
                  level === l
                    ? "bg-[#CEA66F] border-[#CEA66F] text-[#071424]"
                    : "bg-white/3 border-white/10 text-white/50 hover:border-white/25"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D9B173] text-[#071424] font-semibold py-3 rounded-md hover:bg-[#B98A4E] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t("creatingAccount") : registerLabel}
      </button>
    </form>

    <GoogleSigninButton locale={locale} variant="signup" />
    </>
  );
}
