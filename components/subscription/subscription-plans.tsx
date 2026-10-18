"use client";

import { useState } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";

export function SubscriptionPlans({ locale, initialPlan }: { locale: string; initialPlan?: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function activateTesterAccess() {
    setError(null);
    setLoading("tester_trial");
    try {
      const res = await fetch("/api/access/tester-grant", { method: "POST" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Tester access is not available yet.");
      window.location.href = `/${locale}/rooms`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tester access is not available yet.");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#071424] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E0B873]">DeutschPilot access</p>
          <h1 className="mb-3 text-3xl font-serif font-bold">Choose how you want to learn</h1>
          <p className="mx-auto max-w-2xl text-sm text-white/55">Standard access is free and limited. The current 90-day tester pilot is free and does not collect payment.</p>
        </div>

        {initialPlan === "tester_trial" && (
          <div className="mb-6 rounded-xl border border-[#E0B873]/30 bg-[#E0B873]/10 px-4 py-3 text-center text-sm text-[#F1D6A5]">
            Your email is confirmed. Continue below to activate the 90-day full-access tester trial.
          </div>
        )}
        {error && <p className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm text-red-300">{error}</p>}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/75 p-7">
            <LockKeyhole className="mb-5 h-7 w-7 text-white/60" />
            <h2 className="mb-2 text-xl font-bold">Standard access</h2>
            <p className="mb-6 text-sm text-white/55">Free signup, confirmed email, and limited learning access. No card and no subscription.</p>
            <ul className="mb-7 space-y-2 text-sm text-white/65"><li>✓ A1 learning access</li><li>✓ Email-confirmed account</li><li>✓ Login whenever you return</li></ul>
            <a href={`/${locale}/rooms`} className="block rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white/75 hover:bg-white/5">Continue with standard access</a>
          </div>

          <div className="rounded-2xl border border-[#E0B873]/35 bg-gradient-to-br from-[#0E2845] to-[#0A1E35] p-7">
            <Sparkles className="mb-5 h-7 w-7 text-[#E0B873]" />
            <h2 className="mb-2 text-xl font-bold">Full access</h2>
            <p className="mb-6 text-sm text-white/55">Unlock all student learning levels for 90 days. No card, charge, or subscription is used during the pilot.</p>
            <button onClick={activateTesterAccess} disabled={!!loading} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0B873] px-4 py-3 text-sm font-bold text-[#071424] disabled:opacity-60">
              {loading === "tester_trial" ? "Activating tester access…" : "Activate 90-day tester access"}
            </button>
            <p className="mt-5 border-t border-white/10 pt-5 text-xs text-white/35">Payment and promotion checkout are disabled for this pilot.</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-white/30">Tester access ends after 90 days and does not renew automatically.</p>
      </div>
    </div>
  );
}
