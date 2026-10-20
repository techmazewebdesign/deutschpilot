/** Explicit offline import; dry-run default. No application uses the aggregate afterwards. */
import { readFile } from "node:fs/promises";
import { createAdminSupabaseClient } from "../lib/supabaseAdmin";
async function main() {
  const value = (flag: string) => process.argv[process.argv.indexOf(flag) + 1];
  const input = value("--input"),
    school = value("--school-id");
  if (
    !input ||
    !school ||
    !process.argv.includes("--input") ||
    !process.argv.includes("--school-id")
  )
    throw new Error("Required --input LOCAL_BACKUP.json --school-id EXPECTED_ID; dry-run default");
  const raw = JSON.parse(await readFile(input, "utf8"));
  const state = raw.state || raw;
  if (state.schoolId !== school || !Array.isArray(state.members))
    throw new Error("Backup school ID/shape mismatch");
  const counts = Object.fromEntries(
    Object.entries(state)
      .filter(([, v]) => Array.isArray(v))
      .map(([k, v]) => [k, (v as unknown[]).length])
  );
  if (!process.argv.includes("--apply")) {
    process.stdout.write(
      JSON.stringify(
        {
          mode: "dry-run",
          schoolId: school,
          counts,
          notes: [
            "No writes performed",
            "Apply requires empty normalized target",
            "Uploads disabled for controller review",
            "Old push attempts never replayed",
          ],
        },
        null,
        2
      ) + "\n"
    );
  } else {
    if (
      process.env.SCHOOL_IMPORT_ALLOW_WRITE !== "yes" ||
      value("--confirm") !== "IMPORT SCHOOL BACKUP"
    )
      throw new Error(
        'Explicit SCHOOL_IMPORT_ALLOW_WRITE=yes and --confirm "IMPORT SCHOOL BACKUP" required'
      );
    const { data, error } = await createAdminSupabaseClient().rpc("school_import_aggregate", {
      p_school: school,
      p_state: state,
      p_confirmation: "IMPORT SCHOOL BACKUP",
    });
    if (error)
      throw new Error(
        "Import rejected. Target may already exist; no automatic overwrite. Review server diagnostics securely."
      );
    process.stdout.write(
      JSON.stringify({ mode: "imported", schoolId: school, counts: data }) + "\n"
    );
  }
}
void main().catch(() => {
  process.stderr.write(
    "School import failed; review configuration and backup locally. No automatic overwrite.\n"
  );
  process.exitCode = 1;
});
