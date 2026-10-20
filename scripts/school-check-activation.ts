/** Read-only technical activation gate, never legal certification. Does not send emails/pushes or change records. */
import { createAdminSupabaseClient } from "../lib/supabaseAdmin";
import { emptyState, uploadsEnabled } from "../lib/school/engine";
async function main() {
  const required = [
    "SCHOOL_ID",
    "SCHOOL_BOOTSTRAP_OWNER_UID",
    "SCHOOL_JOBS_CRON_SECRET",
    "SCHOOL_MAINTENANCE_OWNER_UID",
    "SCHOOL_SCANNER_URL",
    "SCHOOL_SCANNER_TOKEN",
    "SCHOOL_CONTROLLER_LEGAL_REVIEW_REFERENCE",
    "SCHOOL_PROCESSOR_TERMS_REFERENCE",
    "SCHOOL_RETENTION_SCHEDULE_REFERENCE",
    "SCHOOL_SCHEDULED_MAINTENANCE_REFERENCE",
  ];
  const missing = required.filter((name) => !process.env[name]);
  const checks: Record<string, boolean> = {};
  if (process.env.SCHOOL_ID) {
    const { data, error } = await createAdminSupabaseClient()
      .from("school_settings")
      .select("payload")
      .eq("school_id", process.env.SCHOOL_ID)
      .eq("id", "settings")
      .maybeSingle();
    checks.normalizedSettingsAvailable = !error && !!data;
    const state = emptyState(process.env.SCHOOL_ID);
    if (data) state.settings = data.payload;
    checks.completeControllerAndRetentionPolicy = uploadsEnabled(state);
    checks.httpsScanner = process.env.SCHOOL_SCANNER_URL?.startsWith("https://") || false;
  }
  checks.pushProviderConfigured =
    process.env.SCHOOL_PUSH_ENABLED === "true" &&
    !!process.env.EXPO_ACCESS_TOKEN &&
    !!process.env.SCHOOL_PUSH_CRON_SECRET;
  const ready = missing.length === 0 && Object.values(checks).every(Boolean);
  process.stdout.write(
    JSON.stringify(
      {
        technicalActivationReady: ready,
        missingEnvironmentNames: missing,
        checks,
        legalCertification: false,
        note: "References must point to actual controller-approved legal and operating records. This checker does not verify their truth or replace counsel, device testing, backups or physical push delivery.",
      },
      null,
      2
    ) + "\n"
  );
  if (!ready) process.exitCode = 1;
}
void main().catch(() => {
  process.stderr.write(
    "Activation check unavailable. Review server configuration without exposing credentials.\n"
  );
  process.exitCode = 1;
});
