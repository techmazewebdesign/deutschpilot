import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { getServerSession } from "@/lib/session";
import {
  SALES_TRAINING_VIDEOS,
  getSalesTrainingProgress,
  isSalesTeamMember,
  salesTrainingVideoById,
} from "@/lib/sales-training";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isSalesTeamMember(session.user))) {
    return NextResponse.json({ salesTeam: false, videos: [], progress: {} });
  }

  const progress = await getSalesTrainingProgress(session.user.id);
  return NextResponse.json({ salesTeam: true, videos: SALES_TRAINING_VIDEOS, progress });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isSalesTeamMember(session.user))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const video = body?.videoId ? salesTrainingVideoById(String(body.videoId)) : undefined;
  if (!video) return NextResponse.json({ error: "Unknown video" }, { status: 400 });

  const requestedPosition = Number(body.positionSeconds ?? 0);
  const positionSeconds = Math.max(0, Math.min(video.durationSeconds, Number.isFinite(requestedPosition) ? requestedPosition : 0));
  const percent = Math.max(0, Math.min(100, Math.round((positionSeconds / video.durationSeconds) * 100)));
  const completed = body.event === "completed" || percent >= 95;
  const now = new Date().toISOString();
  const supabase = createAdminSupabaseClient();
  const { data: existing, error: existingError } = await supabase
    .from("sales_training_progress")
    .select("opened_at, dismissed_at, completed_at")
    .eq("firebase_uid", session.user.id)
    .eq("video_id", video.id)
    .maybeSingle();
  if (existingError) return NextResponse.json({ error: "Progress lookup failed" }, { status: 500 });

  const record = {
    firebase_uid: session.user.id,
    user_email: session.user.email,
    video_id: video.id,
    position_seconds: positionSeconds,
    percent: completed ? 100 : percent,
    status: completed ? "completed" : positionSeconds > 0 ? "in_progress" : "assigned",
    opened_at: existing?.opened_at ?? now,
    last_viewed_at: now,
    dismissed_at: body.event === "dismissed" ? now : existing?.dismissed_at ?? null,
    completed_at: completed ? now : existing?.completed_at ?? null,
    updated_at: now,
  };
  const { error } = await supabase.from("sales_training_progress").upsert(record, { onConflict: "firebase_uid,video_id" });
  if (error) {
    console.error("[sales-training PATCH]", error.message);
    return NextResponse.json({ error: "Progress update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, positionSeconds, percent: completed ? 100 : percent, status: record.status });
}
