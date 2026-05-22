/**
 * /api/teacher/classes
 * POST — create a live class
 * GET  — list this teacher's classes
 *
 * teacher_id stored in live_classes is profiles.id (uuid), NOT Firebase UID.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findProfile } from "@/lib/profileHelper";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/** POST /api/teacher/classes — create a new live class */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "teacher" && session.user.role !== "admin") {
    return NextResponse.json({ error: "Only teachers can create classes." }, { status: 403 });
  }

  // Look up Supabase profile to get the uuid that goes into teacher_id
  const profile = await findProfile(session.user.id, session.user.email);
  if (!profile) {
    return NextResponse.json(
      { error: "Teacher profile not found. Please sign out and sign in again." },
      { status: 404 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { title, description, level, start_time, duration_minutes, max_students, meet_url, status } = body as Record<string, unknown>;

  if (!title || !start_time) {
    return NextResponse.json({ error: "title and start_time are required." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  const teacherName = profile.full_name || session.user.email.split("@")[0];

  const { data, error } = await supabase
    .from("live_classes")
    .insert({
      title,
      description: description ?? null,
      level: level ?? "A1",
      teacher_id: profile.id,        // ← Supabase uuid, NOT Firebase UID
      teacher_name: teacherName,
      start_time,
      duration_minutes: duration_minutes ?? 60,
      max_students: max_students ?? 10,
      meet_url: meet_url ?? null,
      status: status ?? "draft",
    })
    .select()
    .single();

  if (error) {
    console.error("[teacher/classes POST] insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ class: data }, { status: 201 });
}

/** GET /api/teacher/classes — list this teacher's classes */
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "teacher" && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminSupabaseClient();

  if (session.user.role === "admin") {
    const { data, error } = await supabase
      .from("live_classes")
      .select("*")
      .order("start_time", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ classes: data });
  }

  // Teacher: look up profile.id to filter by teacher_id
  const profile = await findProfile(session.user.id, session.user.email);
  if (!profile) {
    return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("live_classes")
    .select("*")
    .eq("teacher_id", profile.id)   // ← filter by Supabase uuid
    .order("start_time", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ classes: data });
}
