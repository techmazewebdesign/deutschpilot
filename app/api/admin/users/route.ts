import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { isConfiguredSalesEmail } from "@/lib/sales-training";

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
      createAdminSupabaseClient().from("profiles").select("firebase_uid, email, full_name, role, german_level, sales_team, created_at"),
    ]);
    if (profilesResult.error) throw new Error(profilesResult.error.message);

    const profiles = profilesResult.data ?? [];
    const byUid = new Map(profiles.filter((p) => p.firebase_uid).map((p) => [p.firebase_uid, p]));
    const byEmail = new Map(profiles.filter((p) => p.email).map((p) => [String(p.email).toLowerCase(), p]));
    const users = authResult.users.map((authUser) => {
      const profile = byUid.get(authUser.uid) ?? byEmail.get((authUser.email ?? "").toLowerCase());
      const role = ROLES.has(profile?.role) ? profile?.role : ROLES.has(String(authUser.customClaims?.role)) ? String(authUser.customClaims?.role) : "student";
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
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[admin/users GET]", err);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  try {
    const { uid, role, disabled, salesTeam } = await req.json();
    if (!uid) return NextResponse.json({ error: "Missing uid." }, { status: 400 });
    const authUser = await getAdminAuth().getUser(uid);
    const supabase = createAdminSupabaseClient();

    if (role !== undefined) {
      if (!ROLES.has(role)) return NextResponse.json({ error: "Invalid role." }, { status: 400 });
      await getAdminAuth().setCustomUserClaims(uid, { ...(authUser.customClaims ?? {}), role });
      const query = supabase.from("profiles").update({ role, updated_at: new Date().toISOString() });
      const { error } = authUser.email
        ? await query.or(`firebase_uid.eq.${uid},email.eq.${authUser.email}`)
        : await query.eq("firebase_uid", uid);
      if (error) throw new Error(error.message);
    }
    if (disabled !== undefined) {
      if (typeof disabled !== "boolean") return NextResponse.json({ error: "disabled must be a boolean." }, { status: 400 });
      await getAdminAuth().updateUser(uid, { disabled });
    }
    if (salesTeam !== undefined) {
      if (typeof salesTeam !== "boolean") return NextResponse.json({ error: "salesTeam must be a boolean." }, { status: 400 });
      const query = supabase.from("profiles").update({ sales_team: salesTeam, updated_at: new Date().toISOString() });
      const { error } = authUser.email
        ? await query.or(`firebase_uid.eq.${uid},email.eq.${authUser.email}`)
        : await query.eq("firebase_uid", uid);
      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/users PATCH]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: "Missing uid." }, { status: 400 });
    const authUser = await getAdminAuth().getUser(uid);
    await getAdminAuth().deleteUser(uid);
    const query = createAdminSupabaseClient().from("profiles").delete();
    const { error } = authUser.email
      ? await query.or(`firebase_uid.eq.${uid},email.eq.${authUser.email}`)
      : await query.eq("firebase_uid", uid);
    if (error) console.error("[admin/users DELETE profile]", error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/users DELETE]", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
