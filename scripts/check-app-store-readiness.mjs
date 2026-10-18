import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

const root = process.cwd();
const read = (path) => readFileSync(`${root}/${path}`, "utf8");
const failures = [];
const passes = [];

function requireFile(path, label) {
  if (existsSync(`${root}/${path}`)) passes.push(label);
  else failures.push(`${label}: missing ${path}`);
}

function requireText(path, text, label) {
  if (existsSync(`${root}/${path}`) && read(path).includes(text)) passes.push(label);
  else failures.push(`${label}: expected ${text} in ${path}`);
}

requireFile("app/api/account/delete/route.ts", "authenticated account-deletion route");
requireFile("components/account/delete-account-card.tsx", "in-app account-deletion UI");
requireText("components/auth/google-signin-button.tsx", 'platform === "ios"', "iOS third-party-login gate");
requireText("components/learn/upgrade-wall.tsx", 'platform === "ios"', "iOS course-purchase gate");
requireText("components/app/ai-trainer-client.tsx", 'platform !== "ios"', "iOS AI-purchase gate");
requireText("mobile/app.json", '"bundleIdentifier": "de.deutschpilot.app"', "stable iOS bundle identifier");
requireFile("mobile/App.tsx", "standalone React Native application");
requireFile("mobile/src/progress.ts", "offline native progress");
if (/server:\s*\{[\s\S]*?url:/m.test(read("capacitor.config.ts"))) failures.push("legacy Capacitor configuration still loads a remote website");
else passes.push("legacy remote-wrapper path disabled");

if (!process.env.APPLE_TEAM_ID) failures.push("Apple signing identity: APPLE_TEAM_ID is not present for this release check");
else passes.push("Apple signing identity supplied");

console.log(`PASS (${passes.length})`);
for (const item of passes) console.log(`  ✓ ${item}`);
if (failures.length) {
  console.error(`BLOCKED (${failures.length})`);
  for (const item of failures) console.error(`  ✗ ${item}`);
  process.exitCode = 1;
} else {
  console.log("READY FOR MANUAL APP STORE REVIEW");
}
