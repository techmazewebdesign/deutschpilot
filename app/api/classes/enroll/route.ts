/**
 * /api/classes/enroll
 * POST   — enroll student in a class
 * DELETE — unenroll
 *
 * student_id stored in class_enrollments is profiles.id (uuid), NOT Firebase UID.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findProfile } from "@/lib/profileHelper";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

/** POST /api/classes/enroll  body: { class_id } */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Login to enroll." }, { status: 401 });
  if (session.user.role === "teacher") {
    return NextResponse.json({ error: "Teachers cannot enroll as students." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const class_id = body.class_id as string | undefined;
  if (!class_id) return NextResponse.json({ error: "class_id required." }, { status: 400 });

  // Get the student's Supabase profile.id (uuid)
  const profile = await findProfile(session.user.id, session.user.email);
  if (!profile) {
    return NextResponse.json(
      { error: "Student profile not found. Please sign out and sign in again." },
      { status: 404 }
    );
  }

  const supabase = createAdminSupabaseClient();

  // Check class exists and is active
  const { data: cls } = await supabase
    .from("live_classes")
    .select("id, status, max_students")
    .eq("id", class_id)
    .single();

  if (!cls) return NextResponse.json({ error: "Class not found." }, { status: 404 });
  if (cls.status !== "active") {
    return NextResponse.json({ error: "This class is not open for enrollment." }, { status: 400 });
  }

  // Check capacity
  const { count } = await supabase
    .from("class_enrollments")
    .select("id", { count: "exact", head: true })
    .eq("class_id", class_id)
    .eq("status", "enrolled");

  if ((count ?? 0) >= cls.max_students) {
    return NextResponse.json({ error: "Class is full." }, { status: 400 });
  }

  // Upsert enrollment using profiles.id (uuid) as student_id
  const { data, error } = await supabase
    .from("class_enrollments")
    .upsert(
      { class_id, student_id: profile.id, status: "enrolled" },
      { onConflict: "class_id,student_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ enrollment: data }, { status: 201 });
}

/** DELETE /api/classes/enroll  body: { class_id } */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const class_id = body.class_id as string | undefined;
  if (!class_id) return NextResponse.json({ error: "class_id required." }, { status: 400 });

  const profile = await findProfile(session.user.id, session.user.email);
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("class_enrollments")
    .update({ status: "cancelled" })
    .eq("class_id", class_id)
    .eq("student_id", profile.id);   // ← Supabase uuid

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
