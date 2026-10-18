#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

async function fetchTable(table) {
  const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`${table} backup failed with HTTP ${response.status}`);
  return response.json();
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = process.env.SUBSCRIPTION_BACKUP_DIR ?? join(process.cwd(), "backups");
const backup = {
  generatedAt: new Date().toISOString(),
  purchases: await fetchTable("purchases"),
  accessGrants: await fetchTable("access_grants"),
};

await mkdir(outputDir, { recursive: true });
const outputPath = join(outputDir, `subscription-${stamp}.json`);
await writeFile(outputPath, JSON.stringify(backup, null, 2), { mode: 0o600 });
console.log(`Subscription backup written to ${outputPath}`);
