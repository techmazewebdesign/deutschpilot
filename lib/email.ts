import nodemailer from "nodemailer";

// ── Types ─────────────────────────────────────────────────────────────────────

type EmailResult = { ok: boolean; error?: string };

// ── SMTP transport ────────────────────────────────────────────────────────────

function createTransporter(): nodemailer.Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = SMTP_PORT ? parseInt(SMTP_PORT, 10) : 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function getFrom(): string {
  return (
    process.env.MAIL_FROM ??
    `DeutschPilot <${process.env.SMTP_USER ?? "info@deutschpilot.de"}>`
  );
}

// ── Base send ─────────────────────────────────────────────────────────────────

async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<EmailResult> {
  const transporter = createTransporter();
  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[email] SMTP not configured – skipping:", opts.to, opts.subject);
    }
    return { ok: false, error: "Email service is not configured." };
  }
  try {
    await transporter.sendMail({
      from: getFrom(),
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    return { ok: true };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[email] SMTP error:", err instanceof Error ? err.message : err);
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send email.",
    };
  }
}

// ── HTML template helpers ─────────────────────────────────────────────────────

function emailWrap(inner: string): string {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#071424;font-family:Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#071424;padding:40px 16px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#0A1E35;border:1px solid rgba(224,184,115,0.2);border-radius:12px;overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#0E2845,#071424);padding:24px 32px;border-bottom:1px solid rgba(224,184,115,0.1)">
  <p style="margin:0;font-size:14px;font-weight:700;letter-spacing:0.2em;color:#fff;text-transform:uppercase">DeutschPilot</p>
  <p style="margin:3px 0 0;font-size:9px;letter-spacing:0.22em;color:#E0B873;text-transform:uppercase">Sprache. Zukunft. Du.</p>
</td></tr>
<tr><td style="padding:32px">${inner}</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3)">&copy; ${new Date().getFullYear()} DeutschPilot &nbsp;&middot;&nbsp; info@deutschpilot.de</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

const heading = (s: string) =>
  `<h1 style="margin:0 0 18px;font-size:21px;color:#fff;font-weight:700;line-height:1.3">${s}</h1>`;
const para = (s: string) =>
  `<p style="margin:0 0 14px;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.65">${s}</p>`;
const otpBox = (s: string) =>
  `<div style="margin:20px 0;text-align:center"><span style="display:inline-block;font-size:30px;letter-spacing:0.5em;font-weight:700;color:#E0B873;background:rgba(224,184,115,0.1);border:1px solid rgba(224,184,115,0.25);padding:14px 28px;border-radius:8px;font-family:monospace">${s}</span></div>`;
const cta = (url: string, label: string) =>
  `<div style="margin:24px 0;text-align:center"><a href="${url}" style="display:inline-block;background:#E0B873;color:#071424;font-weight:700;font-size:14px;padding:13px 32px;border-radius:8px;text-decoration:none">${label}</a></div>`;
const muted = (s: string) =>
  `<p style="margin:14px 0 0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.5">${s}</p>`;

// ── Exported email functions ───────────────────────────────────────────────────

/**
 * Send a 6-digit email verification code to a new user.
 */
export async function sendVerificationEmail({
  to,
  name,
  code,
}: {
  to: string;
  name: string;
  code: string;
}): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: "DeutschPilot – Bestätigungscode / Confirmation code",
    text: `Hallo ${name},\n\nDein DeutschPilot-Bestätigungscode: ${code}\n\nDieser Code läuft in 15 Minuten ab.\n\nDeutschPilot`,
    html: emailWrap(
      heading("E-Mail bestätigen") +
        para(`Hallo ${name},`) +
        para("Gib diesen 6-stelligen Code auf der Bestätigungsseite ein:") +
        otpBox(code) +
        para("This code expires in 15 minutes.") +
        muted("If you did not create a DeutschPilot account, ignore this email.")
    ),
  });
}

/** @deprecated Use sendVerificationEmail */
export const sendConfirmationEmail = sendVerificationEmail;

/**
 * Send a password-reset link.
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: "DeutschPilot – Passwort zurücksetzen / Password reset",
    text: `Hallo ${name},\n\nPasswort zurücksetzen:\n${resetUrl}\n\nDieser Link läuft in 1 Stunde ab.\n\nDeutschPilot`,
    html: emailWrap(
      heading("Passwort zurücksetzen") +
        para(`Hallo ${name},`) +
        para(
          "Klicke auf den Button, um dein DeutschPilot-Passwort zurückzusetzen:"
        ) +
        cta(resetUrl, "Passwort zurücksetzen") +
        para("This link expires in 1 hour.") +
        muted(
          `If the button doesn&apos;t work, copy this link: <a href="${resetUrl}" style="color:#E0B873">${resetUrl}</a>`
        ) +
        muted(
          "If you did not request a password reset, you can safely ignore this email."
        )
    ),
  });
}

/**
 * Send a welcome email after successful email verification.
 */
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}): Promise<EmailResult> {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://deutschpilot.de";
  return sendEmail({
    to,
    subject: "Willkommen bei DeutschPilot! / Welcome to DeutschPilot!",
    text: `Hallo ${name},\n\nDeine E-Mail wurde bestätigt. Dein Lernkonto ist aktiv!\n\n${appUrl}/de/dashboard\n\nDeutschPilot`,
    html: emailWrap(
      heading("Willkommen bei DeutschPilot!") +
        para(`Hallo ${name},`) +
        para(
          "Deine E-Mail-Adresse wurde erfolgreich bestätigt. Dein Lernkonto ist jetzt aktiv!"
        ) +
        cta(`${appUrl}/de/dashboard`, "Jetzt Deutsch lernen") +
        muted("Fragen? Schreib uns: info@deutschpilot.de")
    ),
  });
}

/**
 * Forward a contact-form submission to info@deutschpilot.de.
 * Sets reply-to as the sender's email.
 */
export async function sendContactFormEmail({
  name,
  email,
  message,
  source,
}: {
  name: string;
  email: string;
  message: string;
  source?: string;
}): Promise<EmailResult> {
  const receiver =
    process.env.CONTACT_RECEIVER ??
    process.env.SMTP_USER ??
    "info@deutschpilot.de";
  const sentAt = new Date().toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
  });
  const safeMsg = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const rows = [
    `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:12px;width:80px;vertical-align:top">Name</td><td style="padding:8px 0;color:#fff;font-size:14px">${name}</td></tr>`,
    `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:12px;vertical-align:top">E-Mail</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#E0B873">${email}</a></td></tr>`,
    source
      ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:12px;vertical-align:top">Quelle</td><td style="padding:8px 0;color:#fff;font-size:14px">${source}</td></tr>`
      : "",
    `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.45);font-size:12px;vertical-align:top">Datum</td><td style="padding:8px 0;color:#fff;font-size:14px">${sentAt}</td></tr>`,
  ]
    .filter(Boolean)
    .join("");

  return sendEmail({
    to: receiver,
    replyTo: email,
    subject: `DeutschPilot Kontaktanfrage – ${name}`,
    text: `Neue Kontaktanfrage\n\nVon: ${name} <${email}>\nDatum: ${sentAt}${source ? `\nQuelle: ${source}` : ""}\n\n${message}`,
    html: emailWrap(
      heading("Neue Kontaktanfrage") +
        `<table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rows}</table>` +
        `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px 20px"><p style="margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.65;white-space:pre-wrap">${safeMsg}</p></div>`
    ),
  });
}
