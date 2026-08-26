"use client";

import { useState } from "react";

type Props = {
  locale: string;
  status: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};

export function SubscriptionCard({ locale, status, cancelAtPeriodEnd, currentPeriodEnd }: Props) {
  const de = locale === "de";
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const active = status === "active" || status === "trialing";
  const endDate = currentPeriodEnd ? new Date(currentPeriodEnd).toLocaleDateString(de ? "de-DE" : "en-GB") : null;

  async function subscribe() {
    setBusy(true); setMessage(null);
    const response = await fetch("/api/checkout/create-session", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: "A2", withdrawalConsent: consent }),
    });
    const body = await response.json() as { url?: string; error?: string };
    if (response.ok && body.url) window.location.href = body.url;
    else { setMessage(body.error ?? "Could not start checkout."); setBusy(false); }
  }

  async function openPortal() {
    setBusy(true); setMessage(null);
    const response = await fetch("/api/subscription/portal", { method: "POST" });
    const body = await response.json() as { url?: string; error?: string };
    if (response.ok && body.url) window.location.href = body.url;
    else { setMessage(body.error ?? "Could not open billing."); setBusy(false); }
  }

  async function cancel() {
    const confirmed = window.confirm(de
      ? "Jetzt zum Ende des bezahlten Zeitraums kündigen?"
      : "Cancel at the end of the paid billing period?");
    if (!confirmed) return;
    setBusy(true); setMessage(null);
    const response = await fetch("/api/subscription/cancel", { method: "POST" });
    const body = await response.json() as { error?: string; currentPeriodEnd?: string | null };
    if (response.ok) window.location.reload();
    else { setMessage(body.error ?? "Cancellation failed."); setBusy(false); }
  }

  return (
    <section className="mb-8 rounded-2xl border border-[#E0B873]/20 bg-[#0A1E35]/70 p-5">
      <h2 className="mb-2 text-lg font-semibold text-white">{de ? "All-Access-Abonnement" : "All-access subscription"}</h2>
      {active ? (
        <>
          <p className="mb-4 text-sm text-white/55">
            {cancelAtPeriodEnd
              ? (de ? `Gekündigt – Zugang bis ${endDate ?? "Periodenende"}.` : `Canceled – access until ${endDate ?? "period end"}.`)
              : (de ? `Aktiv – nächste Verlängerung ${endDate ?? "monatlich"}.` : `Active – next renewal ${endDate ?? "monthly"}.`)}
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={openPortal} disabled={busy} className="rounded-lg bg-[#E0B873] px-4 py-2 text-sm font-semibold text-[#071424] disabled:opacity-50">
              {de ? "Rechnungen & Zahlung" : "Invoices & payment"}
            </button>
            {!cancelAtPeriodEnd && <button type="button" onClick={cancel} disabled={busy} className="rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-300 disabled:opacity-50">
              {de ? "Jetzt kündigen" : "Cancel now"}
            </button>}
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm text-white/55">{de ? "Alle Niveaus A1–C1, Übungen, Prüfungsvorbereitung und KI-Trainer für 15 € pro Monat." : "All A1–C1 levels, exercises, exam preparation and AI trainer for €15 per month."}</p>
          <label className="mb-4 flex items-start gap-3 text-xs text-white/55">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5" />
            <span>{de ? "Ich verlange sofortigen digitalen Zugang und akzeptiere AGB, Widerrufsbelehrung und Datenschutz." : "I request immediate digital access and accept the terms, withdrawal notice and privacy policy."}</span>
          </label>
          <button type="button" onClick={subscribe} disabled={busy || !consent} className="rounded-lg bg-[#E0B873] px-5 py-2.5 text-sm font-bold text-[#071424] disabled:opacity-50">
            {de ? "Für 15 € / Monat abonnieren" : "Subscribe for €15 / month"}
          </button>
        </>
      )}
      {message && <p className="mt-3 text-sm text-red-300">{message}</p>}
    </section>
  );
}
