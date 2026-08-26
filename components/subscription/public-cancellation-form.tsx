"use client";

import { FormEvent, useState } from "react";

export function PublicCancellationForm({ locale }: { locale: string }) {
  const de = locale === "de";
  const [email, setEmail] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setResult(null);
    const response = await fetch("/api/subscription/public-cancel", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, subscriptionId }),
    });
    const body = await response.json() as { error?: string; receivedAt?: string; effectiveAt?: string | null };
    if (response.ok) {
      const date = body.effectiveAt ? new Date(body.effectiveAt).toLocaleDateString(de ? "de-DE" : "en-GB") : "";
      setResult({ ok: true, text: de ? `Kündigung ist eingegangen. Vertragsende: ${date}. Eine Bestätigung wird per E-Mail versandt.` : `Cancellation received. Contract end: ${date}. Confirmation will be sent by email.` });
    } else setResult({ ok: false, text: body.error ?? "Cancellation failed." });
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-6">
      <label className="block text-sm text-white/70">{de ? "E-Mail-Adresse des Abrechnungskontos" : "Billing account email"}
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#071424] px-4 py-3 text-white" />
      </label>
      <label className="block text-sm text-white/70">{de ? "Abonnement-Referenz (sub_…)" : "Subscription reference (sub_…)"}
        <input required value={subscriptionId} onChange={(e) => setSubscriptionId(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-[#071424] px-4 py-3 text-white" />
      </label>
      <p className="text-xs text-white/45">{de ? "Die Referenz findest du im Stripe-Abrechnungsportal oder auf deiner Rechnung. Die Kündigung wirkt zum Ende des bereits bezahlten Monats; außerordentliche gesetzliche Rechte bleiben unberührt." : "Find the reference in the Stripe billing portal or on your invoice. Cancellation takes effect at the end of the paid month; statutory extraordinary rights remain unaffected."}</p>
      <button disabled={busy} className="rounded-lg bg-[#E0B873] px-5 py-3 font-bold text-[#071424] disabled:opacity-50">{de ? "Jetzt kündigen" : "Cancel now"}</button>
      {result && <p role="status" className={result.ok ? "text-emerald-300" : "text-red-300"}>{result.text}</p>}
    </form>
  );
}
