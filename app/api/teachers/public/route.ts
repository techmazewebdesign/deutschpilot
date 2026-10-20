import { NextRequest, NextResponse } from "next/server";
import { publicLegacyTeachers } from "@/lib/legacyLearningAccess";
export async function GET(req: NextRequest) {
  const raw = Number(new URL(req.url).searchParams.get("limit") || 6);
  const limit = Number.isSafeInteger(raw) ? Math.max(1, Math.min(raw, 20)) : 6;
  try {
    return NextResponse.json({ teachers: await publicLegacyTeachers(limit) });
  } catch {
    return NextResponse.json({ error: "Teacher directory unavailable." }, { status: 503 });
  }
}
