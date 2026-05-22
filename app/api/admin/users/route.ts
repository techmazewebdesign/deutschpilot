import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const snapshot = await getAdminDb().collection("users").orderBy("createdAt", "desc").get();
    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
    }));
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[admin/users GET]", err);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { uid, role, disabled } = await req.json();
    if (!uid) return NextResponse.json({ error: "Missing uid." }, { status: 400 });

    if (role !== undefined) {
      await getAdminAuth().setCustomUserClaims(uid, { role });
      await getAdminDb().doc(`users/${uid}`).update({ role });
    }
    if (disabled !== undefined) {
      await getAdminAuth().updateUser(uid, { disabled });
      await getAdminDb().doc(`users/${uid}`).update({ disabled });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/users PATCH]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: "Missing uid." }, { status: 400 });

    await getAdminAuth().deleteUser(uid);
    await getAdminDb().doc(`users/${uid}`).delete();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/users DELETE]", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
