import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = []; const passes = [];
const read = path => readFileSync(resolve(root, path), 'utf8');
const check = (valid, label) => (valid ? passes : failures).push(label);
const config = JSON.parse(read('app.json')).expo;
check(config.ios.bundleIdentifier === 'de.deutschpilot.app', 'Stable iOS bundle identifier');
check(read('src/LearningScreens.tsx').includes('expo-speech'), 'Native pronunciation');
check(read('App.tsx').includes('expo-haptics'), 'Native haptic feedback');
check(read('src/progress.ts').includes('AsyncStorage'), 'Offline progress storage');
check(read('src/auth.ts').includes('/api/account/delete'), 'In-app account deletion path exists (end-to-end verification is separate)');
check(read('App.tsx').includes('Platform.OS !== "ios" && <Pressable accessibilityRole="button" onPress={google}'), 'Unverified social sign-in hidden on iOS');
check(!/server:\s*\{[\s\S]*?url:/m.test(read('../capacitor.config.ts')), 'No legacy remote WebView release configuration');
const expoBuild = config.ios.buildNumber;
const nativeInfo = read('ios/DeutschPilot/Info.plist');
check(new RegExp(`<key>CFBundleVersion</key>\\s*<string>${expoBuild}</string>`).test(nativeInfo), 'Expo and native iOS build numbers match');
const required = ['legal_operator_and_territories', 'germany_fernusg_assessment', 'content_language_and_rights_review', 'account_signup_recovery_deletion_device_test', 'privacy_policy_labels_sdk_manifest', 'billing_path_and_territories', 'iphone_ipad_accessibility_offline_qa', 'signed_archive_validation', 'apple_membership_agreements_bundle_record', 'screenshots_age_rating_support_metadata', 'reviewer_access', 'dependency_security_review'];
const evidence = JSON.parse(read('scripts/release-evidence.json'));
for (const gate of required) {
  const entry = evidence.gates?.[gate];
  check(entry?.status === 'verified' && typeof entry.evidence === 'string' && entry.evidence.length > 0 && existsSync(resolve(root, entry.evidence)), `${gate}: current evidence required`);
}
console.log(`Code/evidence checks passed: ${passes.length}`); passes.forEach(p => console.log(`  PASS ${p}`));
if (failures.length) { console.error(`RELEASE BLOCKED: ${failures.length}`); failures.forEach(p => console.error(`  BLOCKED ${p}`)); process.exitCode = 1; }
else console.log('Evidence references present. Human release review is still required. This command never submits or publishes.');
