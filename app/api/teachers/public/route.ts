import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6"), 20);

  const supabase = createAdminSupabaseClient();

  const { data: teachers, error } = await supabase
    .from("teacher_profiles")
    .select("user_id, full_name, bio, teaches_levels")
    .limit(limit);

  if (error) return NextResponse.json({ teachers: [] });

  // Get active class counts
  const teacherIds = (teachers ?? []).map((t) => t.user_id);
  const classCounts: Record<string, number> = {};
  if (teacherIds.length > 0) {
    const { data: cls } = await supabase
      .from("live_classes")
      .select("teacher_id")
      .in("teacher_id", teacherIds)
      .eq("status", "active");
    (cls ?? []).forEach((r: { teacher_id: string }) => {
      classCounts[r.teacher_id] = (classCounts[r.teacher_id] ?? 0) + 1;
    });
  }

  const result = (teachers ?? []).map((t) => ({
    ...t,
    activeClasses: classCounts[t.user_id] ?? 0,
  }));

  return NextResponse.json({ teachers: result });
}
