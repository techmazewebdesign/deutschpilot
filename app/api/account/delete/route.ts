import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { checkMutationOrigin, deleteSchoolAccountData } from "@/lib/school/server";
import { SchoolError } from "@/lib/school/engine";
import { stripe } from "@/lib/stripe";

const CONFIRMATION = "DELETE MY DEUTSCHPILOT ACCOUNT";
const OPTIONAL_SCHEMA_ERRORS = new Set(["42P01", "42703", "PGRST205"]);

function isOptionalSchemaError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    OPTIONAL_SCHEMA_ERRORS.has(error.code ?? "") ||
    /schema cache|does not exist/i.test(error.message ?? "")
  );
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const mobileClaims = bearer
    ? await getAdminAuth()
        .verifyIdToken(bearer, true)
        .catch(() => null)
    : null;
  const bearerUser = mobileClaims
    ? {
        id: mobileClaims.uid,
        email: mobileClaims.email ?? "",
        name: typeof mobileClaims.name === "string" ? mobileClaims.name : "",
        role:
          mobileClaims.role === "admin" || mobileClaims.role === "teacher"
            ? mobileClaims.role
            : "student",
        emailVerified: mobileClaims.email_verified ?? false,
      }
    : null;
  const user = bearer ? bearerUser : session?.user;
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!mobileClaims) {
    try {
      checkMutationOrigin(request);
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }
  if (user.role === "admin") {
    return NextResponse.json(
      { error: "Transfer the administrator role before deleting this account." },
      { status: 409 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { confirmation?: string };
  if (body.confirmation !== CONFIRMATION) {
    return NextResponse.json({ error: "Deletion confirmation does not match." }, { status: 400 });
  }

  const uid = user.id;
  const supabase = createAdminSupabaseClient();

  try {
    await deleteSchoolAccountData({
      id: uid,
      email: user.email,
      name: user.name,
      verified: true, // Identity was revoked-checked above; email verification is not a deletion prerequisite.
      admin: user.role === "admin",
    });
    const entitlement = await supabase
      .from("ai_trainer_entitlements")
      .select("stripe_subscription_id, status")
      .eq("user_id", uid)
      .maybeSingle();
    if (entitlement.error && !isOptionalSchemaError(entitlement.error)) throw entitlement.error;
    if (
      entitlement.data?.stripe_subscription_id &&
      ["active", "past_due"].includes(entitlement.data.status)
    ) {
      if (!process.env.STRIPE_SECRET_KEY)
        throw new Error("Active subscription cancellation is not configured.");
      await stripe.subscriptions.cancel(entitlement.data.stripe_subscription_id);
    }

    let profileId: string | null = null;
    const profileLookup = await supabase
      .from("profiles")
      .select("id")
      .eq("firebase_uid", uid)
      .maybeSingle();
    if (profileLookup.error && !isOptionalSchemaError(profileLookup.error))
      throw profileLookup.error;
    profileId = profileLookup.data?.id ? String(profileLookup.data.id) : null;

    const uidDeletes = [
      ["student_room_progress", "user_id"],
      ["student_task_progress", "user_id"],
      ["student_progress", "user_id"],
      ["placement_tests", "user_id"],
      ["purchases", "user_id"],
      ["ai_trainer_usage", "user_id"],
      ["sales_training_progress", "firebase_uid"],
      ["teacher_profiles", "user_id"],
      ["magazine_comments", "user_id"],
    ] as const;

    for (const [table, column] of uidDeletes) {
      const result = await supabase.from(table).delete().eq(column, uid);
      if (result.error && !isOptionalSchemaError(result.error)) throw result.error;
    }

    if (profileId) {
      for (const column of ["student_profile_id", "student_id"] as const) {
        const result = await supabase.from("class_enrollments").delete().eq(column, profileId);
        if (result.error && !isOptionalSchemaError(result.error)) throw result.error;
      }
    }
    const legacyEnrollment = await supabase
      .from("class_enrollments")
      .delete()
      .eq("student_id", uid);
    // A migrated student_id is UUID; attempting the legacy Firebase UID then
    // produces 22P02 and is safe to skip after the profile-ID deletion above.
    if (
      legacyEnrollment.error &&
      legacyEnrollment.error.code !== "22P02" &&
      !isOptionalSchemaError(legacyEnrollment.error)
    ) {
      throw legacyEnrollment.error;
    }

    const entitlementDelete = await supabase
      .from("ai_trainer_entitlements")
      .delete()
      .eq("user_id", uid);
    if (entitlementDelete.error && !isOptionalSchemaError(entitlementDelete.error))
      throw entitlementDelete.error;

    const profileByUid = await supabase.from("profiles").delete().eq("firebase_uid", uid);
    if (profileByUid.error && !isOptionalSchemaError(profileByUid.error)) throw profileByUid.error;
    if (!profileId) {
      const legacyProfile = await supabase.from("profiles").delete().eq("id", uid);
      if (legacyProfile.error && !isOptionalSchemaError(legacyProfile.error))
        throw legacyProfile.error;
    }

    await getAdminDb().doc(`users/${uid}`).delete();
    await getAdminAuth().deleteUser(uid);

    const response = NextResponse.json({ deleted: true });
    response.cookies.set("__session", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    if (error instanceof SchoolError)
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    console.error("[account/delete] failed");
    return NextResponse.json(
      { error: "Account deletion could not be completed. Please retry or contact support." },
      { status: 503 }
    );
  }
}
