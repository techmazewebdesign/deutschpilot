/**
 * POST /api/auth/update-name
 * Body: { fullName: string }
 * Requires a signed-in session. Syncs the display name to the
 * Supabase profile (Firebase displayName is updated client-side).
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  if (!fullName || fullName.length > 100) {
    return NextResponse.json({ error: "Name must be between 1 and 100 characters." }, { status: 400 });
  }

  const sb = createAdminSupabaseClient();
  const { error } = await sb
    .from("profiles")
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq("firebase_uid", session.user.id);

  if (error) {
    console.error("[update-name] Failed:", error.message);
    return NextResponse.json({ error: "Could not update name." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
