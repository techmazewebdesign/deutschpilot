/**
 * profileHelper.ts
 * Server-side only. Uses the Supabase service-role client.
 *
 * All Firebase user lookups in API routes go through here.
 * NEVER insert Firebase UID into profiles.id.
 * profiles.id is a Supabase auto-generated uuid.
 * profiles.firebase_uid is where the Firebase UID lives.
 */

import { createAdminSupabaseClient } from "./supabaseAdmin";

export type SupabaseProfile = {
  id: string;           // uuid — use this as FK in live_classes.teacher_id etc.
  firebase_uid: string; // text — Firebase UID
  email: string;
  full_name: string;
  role: string;
  german_level: string | null;
};

const PROFILE_SELECT = "id, firebase_uid, email, full_name, role, german_level";

/**
 * Find a Supabase profile by Firebase UID.
 * Falls back to email lookup if firebase_uid column returns nothing
 * (handles rows created before the firebase_uid column was added).
 */
export async function findProfile(
  firebaseUid: string,
  email?: string
): Promise<SupabaseProfile | null> {
  const sb = createAdminSupabaseClient();

  // Primary: look up by firebase_uid
  const { data: byUid, error: e1 } = await sb
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("firebase_uid", firebaseUid)
    .maybeSingle();

  if (e1) console.error("[profileHelper] firebase_uid lookup error:", e1.message);
  if (byUid) return byUid as SupabaseProfile;

  // Fallback: look up by email (handles legacy rows with no firebase_uid)
  if (email) {
    const { data: byEmail, error: e2 } = await sb
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("email", email)
      .maybeSingle();

    if (e2) console.error("[profileHelper] email lookup error:", e2.message);
    if (byEmail) {
      // Back-fill firebase_uid so future lookups are fast
      await sb
        .from("profiles")
        .update({ firebase_uid: firebaseUid })
        .eq("id", byEmail.id);
      return { ...byEmail, firebase_uid: firebaseUid } as SupabaseProfile;
    }
  }

  return null;
}

/**
 * Create a new profile row.
 * profiles.id is auto-generated uuid — do NOT pass a Firebase UID here.
 */
export async function createProfile(opts: {
  firebaseUid: string;
  email: string;
  fullName: string;
  role: "student" | "teacher" | "admin";
  germanLevel?: string | null;
}): Promise<SupabaseProfile> {
  const sb = createAdminSupabaseClient();

  const { data, error } = await sb
    .from("profiles")
    .insert({
      firebase_uid: opts.firebaseUid,
      email: opts.email,
      full_name: opts.fullName,
      role: opts.role,
      german_level: opts.role === "student" ? (opts.germanLevel ?? "A1") : null,
      // id is NOT set here — Supabase generates a uuid automatically
    })
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    throw new Error(`createProfile failed: ${error.message} (${error.code})`);
  }

  return data as SupabaseProfile;
}

/**
 * Update an existing profile (found by firebase_uid).
 */
export async function updateProfile(
  profileId: string,
  updates: Partial<Pick<SupabaseProfile, "role" | "full_name" | "german_level" | "firebase_uid">>
): Promise<void> {
  const sb = createAdminSupabaseClient();
  const { error } = await sb
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", profileId);

  if (error) {
    console.error("[profileHelper] updateProfile error:", error.message);
  }
}

/**
 * Find or create a profile. Returns the profile either way.
 * Use this in set-role to guarantee a profile always exists after signup.
 */
export async function findOrCreateProfile(opts: {
  firebaseUid: string;
  email: string;
  fullName: string;
  role: "student" | "teacher" | "admin";
  germanLevel?: string | null;
}): Promise<SupabaseProfile> {
  const existing = await findProfile(opts.firebaseUid, opts.email);

  if (existing) {
    // Update mutable fields (role, name, level may change on re-signup)
    await updateProfile(existing.id, {
      firebase_uid: opts.firebaseUid, // ensure it's set (backfill legacy rows)
      role: opts.role,
      full_name: opts.fullName,
      german_level: opts.role === "student" ? (opts.germanLevel ?? existing.german_level) : null,
    });
    return { ...existing, role: opts.role, full_name: opts.fullName };
  }

  return createProfile(opts);
}
