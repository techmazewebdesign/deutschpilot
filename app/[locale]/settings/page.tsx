"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { AppLayout } from "@/components/app/app-layout";
import { Settings as SettingsIcon, User, Lock, LogOut, CheckCircle2 } from "lucide-react";

export default function SettingsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const de = locale === "de";
  const { user, profile, loading, signOut } = useAuth();

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (profile?.fullName) setName(profile.fullName);
  }, [profile?.fullName]);

  if (!loading && !user) {
    redirect(`/${locale}/signin`);
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !firebaseAuth.currentUser) return;
    setNameError(null);
    setSavingName(true);
    setNameSaved(false);
    try {
      await updateProfile(firebaseAuth.currentUser, { displayName: name.trim() });
      const res = await fetch("/api/auth/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed");
      }
      setNameSaved(true);
    } catch {
      setNameError(de ? "Name konnte nicht gespeichert werden." : "Could not save name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handlePasswordReset() {
    if (!user?.email || resetLoading) return;
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, user.email);
      setResetSent(true);
    } catch {
      setResetSent(true);
    } finally {
      setResetLoading(false);
    }
  }

  const userName = profile?.fullName || user?.displayName || user?.email?.split("@")[0] || "Student";

  return (
    <AppLayout locale={locale} userName={userName}>
      <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-2xl w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="h-4 w-4 text-[#E0B873]" />
            <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">
              {de ? "Einstellungen" : "Settings"}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">
            {de ? "Kontoeinstellungen" : "Account Settings"}
          </h1>
        </div>

        {/* Display name */}
        <form onSubmit={handleSaveName} className="p-5 rounded-2xl bg-[#0A1E35]/70 border border-white/10 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-[#E0B873]" />
            <h2 className="text-sm font-semibold text-white">{de ? "Anzeigename" : "Display Name"}</h2>
          </div>
          {nameError && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 mb-3">{nameError}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameSaved(false); }}
              placeholder={de ? "Dein Name" : "Your name"}
              maxLength={100}
              className="flex-1 rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all"
            />
            <button
              type="submit"
              disabled={savingName || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {savingName ? (de ? "Speichert…" : "Saving…") : (de ? "Speichern" : "Save")}
            </button>
          </div>
          {nameSaved && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-300 mt-2.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> {de ? "Gespeichert." : "Saved."}
            </p>
          )}
        </form>

        {/* Email (read-only) */}
        <div className="p-5 rounded-2xl bg-[#0A1E35]/70 border border-white/10 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-white">{de ? "E-Mail" : "Email"}</span>
          </div>
          <p className="text-sm text-white/50">{user?.email}</p>
        </div>

        {/* Password reset */}
        <div className="p-5 rounded-2xl bg-[#0A1E35]/70 border border-white/10 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-[#E0B873]" />
            <h2 className="text-sm font-semibold text-white">{de ? "Passwort" : "Password"}</h2>
          </div>
          <p className="text-xs text-white/45 mb-3">
            {de
              ? "Wir senden dir einen Link zum Zurücksetzen deines Passworts per E-Mail."
              : "We'll email you a link to reset your password."}
          </p>
          {resetSent ? (
            <p className="flex items-center gap-1.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {de ? "E-Mail gesendet — bitte Posteingang prüfen." : "Email sent — please check your inbox."}
            </p>
          ) : (
            <button
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="px-5 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-medium hover:border-white/30 hover:text-white transition-colors disabled:opacity-40"
            >
              {resetLoading
                ? (de ? "Wird gesendet…" : "Sending…")
                : (de ? "Passwort-Reset senden" : "Send password reset")}
            </button>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-500/20 text-red-400/80 text-sm font-medium hover:bg-red-500/5 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" /> {de ? "Abmelden" : "Sign out"}
        </button>
      </div>
    </AppLayout>
  );
}
