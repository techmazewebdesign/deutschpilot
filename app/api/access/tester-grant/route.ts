import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { FREE_PILOT_MODE, PILOT_TRIAL_DAYS } from "@/lib/pilot";

export const runtime = "nodejs";

export async function POST() {
  if (!FREE_PILOT_MODE) {
    return NextResponse.json({ error: "The free tester pilot has ended." }, { status: 410 });
  }

  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (!session.user.emailVerified) {
    return NextResponse.json({ error: "Confirm your email before activating tester access." }, { status: 403 });
  }

  const supabase = createAdminSupabaseClient();
  const now = new Date();
  const { data: existing, error: existingError } = await supabase
    .from("access_grants")
    .select("ends_at,status")
    .eq("user_id", session.user.id)
    .eq("access_tier", "full")
    .in("status", ["pending", "active", "past_due"])
    .gt("ends_at", now.toISOString())
    .maybeSingle();

  if (existingError) {
    console.error("[tester-grant] Existing grant lookup failed:", existingError.message);
    return NextResponse.json({ error: "Tester access is temporarily unavailable." }, { status: 503 });
  }
  if (existing) {
    return NextResponse.json({ ok: true, endsAt: existing.ends_at });
  }

  const endsAt = new Date(now.getTime() + PILOT_TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("access_grants")
    .insert({
      user_id: session.user.id,
      access_tier: "full",
      access_source: "tester_trial",
      status: "active",
      ends_at: endsAt,
    })
    .select("ends_at")
    .single();

  if (error) {
    console.error("[tester-grant] Grant creation failed:", error.message);
    return NextResponse.json({ error: "Tester access could not be activated." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, endsAt: data.ends_at });
}

