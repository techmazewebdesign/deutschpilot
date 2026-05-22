import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses ALL RLS.
 * Only use server-side (API routes, server components).
 * NEVER import this in client components — it exposes SUPABASE_SERVICE_ROLE_KEY.
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  ← get from Supabase Dashboard → Settings → API → service_role (secret)
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!key) {
    throw new Error(
      "Missing env var: SUPABASE_SERVICE_ROLE_KEY\n" +
      "→ Get it from: Supabase Dashboard → Settings → API → service_role (secret key)\n" +
      "→ Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=sb_secret_..."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
