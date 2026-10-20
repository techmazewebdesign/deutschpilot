import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { isConfiguredSalesEmail } from "@/lib/sales-training";

export const dynamic = "force-dynamic";

const ROLES = new Set(["student", "teacher", "admin"]);

async function requireAdmin() {
  const session = await getServerSession();
  return session?.user.role === "admin" ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  try {
    const [authResult, profilesResult] = await Promise.all([
      getAdminAuth().listUsers(1000),
      createAdminSupabaseClient()
        .from("profiles")
        .select("firebase_uid, email, full_name, role, german_level, sales_team, created_at"),
    ]);
    if (profilesResult.error) throw new Error(profilesResult.error.message);

    const profiles = profilesResult.data ?? [];
    const byUid = new Map(profiles.filter((p) => p.firebase_uid).map((p) => [p.firebase_uid, p]));
    const users = authResult.users.map((authUser) => {
      const profile = byUid.get(authUser.uid);
      const role = ROLES.has(String(authUser.customClaims?.role))
        ? String(authUser.customClaims?.role)
        : "student";
      return {
        uid: authUser.uid,
        name: profile?.full_name || authUser.displayName || "",
        email: authUser.email ?? profile?.email ?? "",
        role,
        level: profile?.german_level ?? null,
        createdAt: profile?.created_at ?? authUser.metadata.creationTime ?? null,
        emailVerified: authUser.emailVerified,
        disabled: authUser.disabled,
        salesTeam: profile?.sales_team === true || isConfiguredSalesEmail(authUser.email ?? ""),
      };
    });
    users.sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
    return NextResponse.json({ users }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[admin/users GET]", err);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > 2048)
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    const input = JSON.parse(raw);
    if (
      !input ||
      Array.isArray(input) ||
      typeof input !== "object" ||
      Object.keys(input).some((k) => !["uid", "role", "disabled", "salesTeam"].includes(k))
    )
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    const { uid, role, disabled, salesTeam } = input;
    if (
      typeof uid !== "string" ||
      !uid.length ||
      uid.length > 128 ||
      (role !== undefined && !ROLES.has(role)) ||
      (disabled !== undefined && typeof disabled !== "boolean") ||
      (salesTeam !== undefined && typeof salesTeam !== "boolean")
    )
      return NextResponse.json({ error: "Invalid update." }, { status: 400 });
    if (uid === session.user.id && ((role !== undefined && role !== "admin") || disabled === true))
      return NextResponse.json(
        { error: "You cannot demote or disable your own administrator account." },
        { status: 409 }
      );
    const auth = getAdminAuth();
    const target = await auth.getUser(uid);
    if (role !== undefined || disabled !== undefined) {
      // Revoke first so a revocation outage never leaves a changed role with old valid sessions.
      await auth.revokeRefreshTokens(uid);
      if (role !== undefined)
        await auth.setCustomUserClaims(uid, { ...(target.customClaims || {}), role });
      if (disabled !== undefined) await auth.updateUser(uid, { disabled });
      // Also invalidate tokens minted concurrently during the change.
      await auth.revokeRefreshTokens(uid);
    }
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (role !== undefined) updates.role = role;
    if (salesTeam !== undefined) updates.sales_team = salesTeam;
    if (role !== undefined || salesTeam !== undefined) {
      const { error } = await createAdminSupabaseClient()
        .from("profiles")
        .update(updates)
        .eq("firebase_uid", uid);
      if (error) throw new Error("Profile update unavailable");
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Update failed. Please retry." }, { status: 503 });
  }
}
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  if (body.uid === session.user.id)
    return NextResponse.json(
      { error: "You cannot delete your own administrator account here." },
      { status: 409 }
    );
  return NextResponse.json(
    {
      error:
        "Use access suspension here. Permanent deletion must follow the account privacy workflow, including school retention and file cleanup.",
    },
    { status: 409 }
  );
}
