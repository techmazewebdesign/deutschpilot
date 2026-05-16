import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Email not sent.");
    return { success: false, error: "Missing API key" };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "DeutschPilot <noreply@deutschpilot.de>",
      to,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
