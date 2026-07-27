"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function RetreatWaitlistForm({ locale }: { locale: string }) {
  const de = locale === "de";
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [dates, setDates] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/retreats/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, region, dates, locale }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? (de ? "Etwas ist schiefgelaufen." : "Something went wrong."));
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError(de ? "Netzwerkfehler. Bitte erneut versuchen." : "Network error. Please try again.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-6 py-3">
        <CheckCircle2 className="h-5 w-5" />
        {de ? "Du stehst auf der Warteliste — wir melden uns!" : "You're on the waitlist — we'll be in touch!"}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto text-left space-y-3">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">{error}</p>
      )}
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={de ? "Deine E-Mail" : "Your email"}
        className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CEA66F]/50 transition-all"
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder={de ? "Wunschregion (optional)" : "Preferred region (optional)"}
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CEA66F]/50 transition-all"
        />
        <input
          type="text"
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          placeholder={de ? "Wunschtermin (optional)" : "Preferred dates (optional)"}
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CEA66F]/50 transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E0B873] text-[#072143] font-semibold px-8 py-3 rounded-xl hover:bg-[#C99B50] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (de ? "Wird gesendet…" : "Submitting…") : (de ? "Warteliste beitreten" : "Join the waitlist")}
      </button>
    </form>
  );
}
