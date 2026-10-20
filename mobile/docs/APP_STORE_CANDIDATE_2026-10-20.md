# DeutschPilot mobile candidate — 20 October 2026

**Source candidate 1.1.0 (5), not uploaded or ready for public submission.** This supersedes the 18 October learning-only candidate notes. Existing TestFlight 1.0.0 (4) is not changed by a local build. No production deployment, live SQL migration, TestFlight distribution, public review, external message or real-user test was performed by this work.

## Added native school workflows

The native Schule tab adds authenticated role-aware owner/office/teacher/student views, classes and assignments, roster/attendance, absence reporting and review, private document requests/uploads/downloads, letters with acknowledgment and returned signed copies, app inbox, and class chat with multiple assigned teachers. Teacher absence summaries contain dates/status only, not medical reasons/files. Class chat is text only, supports history/read marks/moderation and foreground polling; it is not a private health-document channel.

Optional letter printing/sharing produces temporary PDF files and explains that acknowledgment is not a qualified electronic signature. Document uploads remain unavailable until trusted scanning/storage safeguards are configured. Backend authorization failures clear private native views; no private school snapshot is cached to disk. Network writes surface failures rather than silently reporting success.

Guest learning remains available. Account progress storage is UID-separated, guest progress is not silently assigned to a signed-in account, and school completion sync is monotonic. Only known native lessons affect native XP; web-only progress cannot create ghost lessons. Section pagination is exposed in the portal. Own progress sync follows pages and explicitly reports incomplete sync when its safety bound is reached.

Push uses explicit opt-in and backend capability checks, with generic notification text and token registration/unregistration. Offline logout still works and can leave a UID-bound cleanup retry. Native provider permission and backend configuration are not proof of delivered notifications. Physical APNs/Expo delivery and receipt testing remain pending.

The earlier native learning features remain: 105 lessons, 253 self-test questions, 684 vocabulary cards, listening using system TTS, saved review scheduling, local-calendar goals/streaks and light/dark layouts. These counts are not proof of CEFR completeness, curriculum approval or certified assessment.

## Verification recorded locally

- Mobile TypeScript check passed; all 31 native regression tests passed (the original suite retained). Additional coverage includes UID isolation, access denial clearing, chat idempotency, safe printable letters, minimal teacher summaries and paginated progress beyond 1,000 web rows plus all 105 native lessons. A page safety cap cannot report full sync.
- Legacy private-access/auth tests passed: 11 tests, including real isolated PostgreSQL RLS/service-only RPC checks and mocked revoked-token/admin self-guard behavior. Existing five release regression tests passed. Root production Next.js build passed in the coordinated parent review.
- Fresh iOS Expo export with source maps passed: `/tmp/deutschpilot-school-final-export.log`. Final map contains 722 sources; the affected npm dependency packages below are absent. Three similarly named UUID utilities belong to Expo's internal implementation, not the advisory npm UUID package. This is limited JavaScript reachability evidence.
- CocoaPods install and unsigned Release simulator build passed with the new SDK 57 modules (Xcode 26.6, iPhone 17 Pro simulator, iOS 26.5). Installed metadata is 1.1.0 (5). Native guest checks verified the School sign-in boundary, account version, wrong-answer/retry/correct/completion flow and saved progress after relaunch.
- Simulator testing found the lesson back button overlapping the Dynamic Island. A modal-local SafeAreaProvider fixed the presented screen’s insets. After rebuilding, the full back button and lesson title were visibly below the status bar; a coordinate tap returned to the dashboard. A further lesson completed for +20 XP and relaunch retained 2/28 A1 lessons, 40 XP and daily 2/5. Header evidence: `/tmp/deutschpilot-build5-safearea-header-fixed.png`; build log: `/tmp/deutschpilot-school-safearea-xcodebuild.log`; detailed steps: `/tmp/deutschpilot-build5-safearea-smoke.md`. Mobile TypeScript and all 31 regression tests passed after this bounded layout change. No signed archive, physical-device test or authenticated school end-to-end test is implied.
- `npm run check:app-store` reports **8 code/evidence checks passed, 12 release gates blocked**, including legal classification, privacy, live account/deletion, physical accessibility/offline, signing, Apple agreement/metadata and dependency review. Build metadata matching passes for 1.1.0 (5).

## Native configuration and recovery

The initial SDK 57 prebuild command used the new clean default and removed generated iOS files before failing on a configuration path inside that folder. Tracked baseline iOS files and the original ignored `.xcode.env.local` were restored, and the existing public Firebase plist was verified byte-identical. No replacement identity or credential was invented. Subsequent generation used `prebuild --platform ios --no-clean --no-install`.

The public Firebase client plist now has a durable `mobile/config/GoogleService-Info.plist` source with an explicit gitignore exception. It remains product-specific and must not be copied to another school's application or published in a sales source package. Bundle ID, team, scheme and existing inputs were preserved. iOS native and Expo versions are 1.1.0 (5); Android Expo configuration is 5, but Android native regeneration/build is pending and its native build metadata remains unchanged. No Android binary claim is made.

CocoaPods artifacts reused from the existing local checkout were verified against exact-version official Maven SHA-1 manifests. Initial compilation overlapped creation of the new pagination module and Metro failed to discover it; a cleared-cache export succeeded, followed by an incremental native rebuild. The previous signed IPA was preserved, not replaced with this simulator candidate.

## Dependency review remains open

A scoped compatible Firestore transitive override updates `@grpc/grpc-js` to 1.13.6; a real local unary client/server echo check passed. No forced Expo/React Native/Firebase downgrade or major UUID override was applied. Post-fix production-omission audit still reports **24 affected dependency records: 16 high, 8 moderate, zero critical**; these include propagated dependency records, not 24 distinct exploit paths.

Remaining families are build/tooling transitive paths: braces <=3.0.3 ([advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) and node-forge <=1.4.0 ([advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv)) have no published patched version in the reviewed advisories; UUID <11.1.1 ([advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq)) has fixes 11.1.1/12.0.1/13.0.1, while the existing xcode caller uses v4 rather than the affected output-buffer APIs. gRPC fixes include 1.13.6 or 1.14.5 ([advisory](https://github.com/advisories/GHSA-m9gg-hp2v-232j), [advisory](https://github.com/advisories/GHSA-f596-whhp-79r4)). Absence from the shipped JS map does not clear native SDK, server, build-worker or all runtime risks. Dependency release approval remains blocked.

## Before any school sale or release

Configure and test the actual deployed API, normalized school/private-access migrations, scanner/storage and notification providers. Use disposable test identities to exercise student, teacher, office and owner flows on web and native, including revocation, network loss, files/letters, attendance, full privacy deletion and pagination. Complete physical iPhone/iPad, accessibility, offline/relaunch and signed distribution validation.

School-specific operator/controller details, processing agreements, sensitive-data legal bases, retention, notices and German legal classification require documented review; implementation is not legal certification or permission to operate in Germany. See the updated privacy inventory. Current App Store evidence gates must be reviewed rather than marked complete from source presence. Product-specific Firebase credentials, real data and signing material are excluded from reusable sales/porting packages.

## Current activation continuation

See [Native activation checkpoint](NATIVE_ACTIVATION_2026-10-20.md). Fresh TypeScript, all 31 regressions, SDK compatibility and iOS Hermes export pass. The current audit remains 16 high / 8 moderate records; no safe supported dependency remedy was available. Actual existing-profile archive failed because the DeutschPilot provisioning profiles lack Push Notifications/`aps-environment`; no signed IPA was produced. Parent-observed accepted Apple agreements remove the stale pending-agreement concern, but do not clear profile, API, provider, physical-device, legal or independent-review gates. TestFlight is unchanged.
