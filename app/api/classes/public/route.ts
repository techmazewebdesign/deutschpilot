import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6"), 20);

  const supabase = createAdminSupabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("live_classes")
    .select("id, title, level, teacher_name, start_time, duration_minutes")
    .eq("status", "active")
    .gte("start_time", now)
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) return NextResponse.json({ classes: [] });
  return NextResponse.json({ classes: data ?? [] });
}
