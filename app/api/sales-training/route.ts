import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
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
  const ref = getAdminDb().doc(`salesTrainingProgress/${session.user.id}_${video.id}`);
  const existing = await ref.get();
  const data: Record<string, unknown> = {
    userId: session.user.id,
    userEmail: session.user.email,
    videoId: video.id,
    positionSeconds,
    percent: completed ? 100 : percent,
    status: completed ? "completed" : positionSeconds > 0 ? "in_progress" : "assigned",
    lastViewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (!existing.exists) data.openedAt = FieldValue.serverTimestamp();
  if (body.event === "dismissed") data.dismissedAt = FieldValue.serverTimestamp();
  if (completed) data.completedAt = FieldValue.serverTimestamp();
  await ref.set(data, { merge: true });

  return NextResponse.json({ ok: true, positionSeconds, percent: completed ? 100 : percent, status: data.status });
}
