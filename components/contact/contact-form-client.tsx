"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  locale: string;
}

export function ContactFormClient({ locale }: Props) {
  const t = useTranslations("contact");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CEA66F]/50 transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          source: `${locale}/contact`,
        }),
      });
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON */
      }
      if (!res.ok) {
        setError(data.error ?? t("form.errorSend"));
        return;
      }
      const analyticsWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
      analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
      analyticsWindow.dataLayer.push({
        event: "generate_lead",
        form_name: "contact_form",
        lead_type: "contact",
        language: locale,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError(t("form.errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-400/10 border border-green-400/30">
          <span className="text-green-400 text-xl">✓</span>
        </div>
        <p className="text-white font-semibold text-lg mb-1">
          {t("form.successTitle")}
        </p>
        <p className="text-[#C9D2DE] text-sm">
          {t("form.successMessage")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          {t("form.nameLabel")}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder={t("form.namePlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          {t("form.emailLabel")}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          {t("form.messageLabel")}
        </label>
        <textarea
          rows={5}
          required
          minLength={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder={t("form.messagePlaceholder")}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D9B173] text-[#071424] font-semibold py-2.5 rounded-md hover:bg-[#B98A4E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t("form.sendingButton") : t("form.sendButton")}
      </button>
    </form>
  );
}
