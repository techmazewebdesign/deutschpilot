/**
 * POST /api/retreats/waitlist
 *
 * Public, unauthenticated. Captures interest in future language
 * retreats (email + optional preferred region/dates) so there's a
 * real lead list once actual retreats are scheduled.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, region, dates, locale } = body as {
    email?: string; region?: string; dates?: string; locale?: string;
  };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const sb = createAdminSupabaseClient();
  const { error } = await sb.from("retreat_waitlist").insert({
    email: email.trim().toLowerCase(),
    preferred_region: region?.trim() || null,
    preferred_dates: dates?.trim() || null,
    locale: locale === "de" ? "de" : "en",
  });

  if (error) {
    console.error("[retreats/waitlist] insert failed:", error.message);
    return NextResponse.json({ error: "Could not join the waitlist. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
