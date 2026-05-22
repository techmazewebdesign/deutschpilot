"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

interface Props {
  locale: string;
  registerLabel: string;
}

type Role = "student" | "teacher";
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

function firebaseError(code: string, de: boolean): string {
  const map: Record<string, [string, string]> = {
    "auth/email-already-in-use": ["Diese E-Mail ist bereits registriert.", "This email is already registered."],
    "auth/weak-password": ["Passwort muss mindestens 6 Zeichen haben.", "Password must be at least 6 characters."],
    "auth/invalid-email": ["Bitte eine gültige E-Mail eingeben.", "Please enter a valid email address."],
    "auth/invalid-credential": ["Ungültige Anmeldedaten.", "Invalid credentials."],
    "auth/user-not-found": ["Kein Konto mit dieser E-Mail gefunden.", "No account found with this email."],
    "auth/too-many-requests": ["Zu viele Versuche. Bitte warte kurz.", "Too many attempts. Please wait."],
    "auth/network-request-failed": ["Netzwerkfehler. Bitte Verbindung prüfen.", "Network error. Please check your connection."],
    "auth/internal-error": ["Interner Fehler. Bitte erneut versuchen.", "Internal error. Please try again."],
    "auth/configuration-not-found": ["Firebase-Konfiguration fehlt.", "Firebase configuration missing."],
  };
  const entry = map[code];
  if (entry) return de ? entry[0] : entry[1];
  return de ? `Fehler: ${code}` : `Error: ${code}`;
}

export function SignupFormClient({ locale, registerLabel }: Props) {
  const router = useRouter();
  const de = locale === "de";

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
      setError(de ? "Passwörter stimmen nicht überein." : "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError(de ? "Passwort muss mindestens 6 Zeichen haben." : "Password must be at least 6 characters.");
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
        setError(
          de
            ? "Profil konnte nicht erstellt werden. Bitte Seite neu laden und erneut versuchen."
            : "Could not create your profile. Please reload and try again."
        );
        setLoading(false);
        return;
      }

      if (!roleRes.ok) {
        console.error("[signup] set-role failed:", roleData);
        // Show the specific server error so it's visible during debugging
        const serverMsg = roleData.detail ?? roleData.error ?? "Profile creation failed.";
        setError(
          de
            ? `Fehler beim Erstellen des Profils: ${serverMsg}`
            : `Profile creation failed: ${serverMsg}`
        );
        setLoading(false);
        return;
      }

      console.log("[signup] ✓ Profile created  uid=" + user.uid + "  role=" + roleData.role);

      // Step 3: Force-refresh the token so custom claims are available immediately
      await user.getIdToken(true);

      // Step 4: Send email verification
      await sendEmailVerification(user, {
        url: `${window.location.origin}/${locale}/verify-email`,
      }).catch((e) => console.warn("[signup] sendEmailVerification failed (non-blocking):", e));

      console.log("[signup] ✓ Signup complete — redirecting to verify-email");
      router.push(`/${locale}/verify-email`);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("[signup] Unexpected error:", error);
      const code = error.code ?? "";
      setError(firebaseError(code, de));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {/* Role selection */}
      <div>
        <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
          {de ? "Ich bin…" : "I am a…"}
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
              {r === "student"
                ? de ? "Lernender" : "Student"
                : de ? "Lehrer" : "Teacher"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
          {de ? "Vollständiger Name" : "Full name"}
        </label>
        <input
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder={de ? "Dein Name" : "Your name"}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-1.5">
          {de ? "E-Mail" : "Email"}
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
          {de ? "Passwort" : "Password"}
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
          {de ? "Passwort bestätigen" : "Confirm password"}
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
            {de ? "Aktuelles Deutsch-Niveau" : "Current German level"}
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
        {loading
          ? (de ? "Konto wird erstellt…" : "Creating account…")
          : registerLabel}
      </button>
    </form>
  );
}
