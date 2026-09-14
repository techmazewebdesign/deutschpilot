/** Interim FernUSG/ZFU control; this is an engineering safeguard, not legal advice. */
export type SupportedCheckoutLocale = "de" | "en";

export const GERMAN_PAID_ENROLLMENT_NOTICE =
  "Der kostenpflichtige Zugang für Anmeldungen aus Deutschland ist derzeit pausiert. Wir prüfen die erforderliche Zulassung nach dem Fernunterrichtsschutzgesetz. Kostenlose Übungen und bestehende Zugänge bleiben verfügbar. Fragen: info@deutschpilot.de";

export const GERMAN_PAID_ENROLLMENT_NOTICE_EN =
  "Paid enrollment from Germany is temporarily paused while we complete the required FernUSG/ZFU review. Free exercises and existing access remain available. Contact: info@deutschpilot.de";

export function isGermanPaidEnrollmentAllowed(): boolean {
  return process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_ALLOWED === "true"
    && Boolean(process.env.DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_APPROVAL_REFERENCE?.trim());
}

export function isGermanPaidEnrollmentBlocked(): boolean {
  return !isGermanPaidEnrollmentAllowed();
}

export function normalizeCheckoutLocale(value: unknown): SupportedCheckoutLocale | null {
  return value === "de" || value === "en" ? value : null;
}

export function localeFromReferer(referer: string | null): SupportedCheckoutLocale | null {
  const match = referer?.match(/\/(de|en)(?:\/|$)/i);
  return normalizeCheckoutLocale(match?.[1]?.toLowerCase());
}

/** The Vercel request country signal closes the English-language bypass for users in Germany. */
export function isGermanPaidEnrollmentRequest(locale: SupportedCheckoutLocale, country: string | null): boolean {
  return locale === "de" || country?.trim().toUpperCase() === "DE";
}
