/**
 * /api/teacher/classes/[id]
 * Ownership check compares live_classes.teacher_id (uuid = profiles.id)
 * against the teacher's Supabase profile.id looked up by firebase_uid.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findProfile } from "@/lib/profileHelper";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

async function getTeacherProfileId(firebaseUid: string, email: string): Promise<string | null> {
  const profile = await findProfile(firebaseUid, email);
  return profile?.id ?? null;
}

/** GET /api/teacher/classes/[id] */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("live_classes").select("*").eq("id", params.id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role === "teacher") {
    const profileId = await getTeacherProfileId(session.user.id, session.user.email);
    if (data.teacher_id !== profileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json({ class: data });
}

/** PATCH /api/teacher/classes/[id] */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  const { data: existing } = await supabase
    .from("live_classes").select("teacher_id").eq("id", params.id).single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role === "teacher") {
    const profileId = await getTeacherProfileId(session.user.id, session.user.email);
    if (existing.teacher_id !== profileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const allowed = ["title","description","level","start_time","duration_minutes","max_students","meet_url","status"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const k of allowed) if (k in body) update[k] = body[k];

  const { data, error } = await supabase
    .from("live_classes").update(update).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ class: data });
}

/** DELETE /api/teacher/classes/[id] */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  const { data: existing } = await supabase
    .from("live_classes").select("teacher_id").eq("id", params.id).single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role === "teacher") {
    const profileId = await getTeacherProfileId(session.user.id, session.user.email);
    if (existing.teacher_id !== profileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { error } = await supabase.from("live_classes").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
