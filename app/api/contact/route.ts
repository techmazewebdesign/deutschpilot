import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactFormEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  email: z.string().email("Please provide a valid email address."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(5000),
  source: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Invalid form data.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { name, email, message, source } = parsed.data;

  const result = await sendContactFormEmail({ name, email, message, source });

  if (!result.ok) {
    console.error("[contact] Email send failed:", result.error);
    return NextResponse.json(
      { error: "Sorry, your message could not be sent. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
