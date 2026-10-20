# Native activation checkpoint — 20 October 2026

Candidate remains **1.1.0 (5)**, bundle `de.deutschpilot.app`, team `HYBTH9WZQ6`. No TestFlight upload, App Store submission, signing credential creation, paid build or public cutover occurred. No dependency manifest, native configuration or release-evidence gate was changed in this continuation.

## Current verification

Using Node 24.16.0 and the existing mobile installation/lockfile:

- `npm run check`: passed.
- `npm test`: 31 passed, 0 failed.
- `npx expo install --check`: dependencies are up to date for the current SDK.
- `npx expo export --platform ios --source-maps --output-dir /tmp/deutschpilot-native-export-current`: passed. Exported Hermes bundle has 722 mapped sources; no paths for npm braces, node-forge, uuid, xcode or @grpc/grpc-js. This is limited JS reachability evidence, not approval of native SDKs, dependencies, build workers or the deployed server.
- Fresh `npm audit --json`: 24 affected records (16 high, 8 moderate, 0 critical). These include propagated records, not 24 separate underlying vulnerabilities.

## Dependency disposition

| Installed package | Actual path/use | Current remedy |
| --- | --- | --- |
| braces 3.0.3 | Expo → Metro → metro-file-map → micromatch; build-time matching | Registry latest remains 3.0.3; advisory has no patched version. No compatible upgrade exists today. |
| node-forge 1.4.0 | Expo CLI and code-signing-certificates; development/build signing tooling | Registry latest remains 1.4.0; advisory has no patched version. No compatible upgrade exists today. |
| uuid 7.0.3 | Expo config plugins → xcode 3.0.1; pbxProject.js uses `uuid.v4()` without caller output buffers | Patched UUID versions include 11.1.1, 12.0.1 and 13.0.1. Upstream xcode 4.0.0 removes this dependency, but current Expo config plugins declare xcode `^3.0.1`; forcing either major lies outside that supported range. Existing v4 caller does not invoke affected v3/v5/v6 buffer APIs. No speculative major override applied. |
| @grpc/grpc-js 1.13.6 | Scoped Firestore dependency override already present | No current audit finding; retained. |

npm's suggested Expo 44.0.6 / React Native 0.72.17 downgrade is incompatible with the SDK 57 native project and is not a suitable automatic repair. Direct Expo/React Native/Google Sign-In/sharing records in the audit propagate these transitive tooling findings; no new distinct direct application runtime advisory was reported. Builds must continue to treat toolchain dependencies as a separate unresolved risk; absence from the JS map is not a blanket clearance.

Sources checked on 20 October 2026: [braces advisory and upstream references](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [forge advisory and upstream references](https://github.com/advisories/GHSA-86w9-cpqp-85rv), [UUID maintainer advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq). Installed paths and npm registry versions were checked directly.

## Actual signing attempt and blocker

Local keychain contains a valid Apple Distribution identity for PLUCO GROUP SP Z O.O. (HYBTH9WZQ6). Existing DeutschPilot App Store profile `4fd106f8-2780-4a38-854a-b6f89a2f38ab` expires 16 September 2027; existing development profile `ad6a9f8e-f394-4b59-a527-84086aeae200` expires 17 September 2027. Neither contains `aps-environment`. Current app entitlements correctly require Push Notifications.

Actual `xcodebuild archive` using the existing workspace, Release configuration, generic iOS destination and automatic signing **without** `-allowProvisioningUpdates` failed with exit 65: the existing profile “doesn't include the Push Notifications capability” and “doesn't include the aps-environment entitlement.” An initial manual selection of the existing App Store profile also confirmed missing push and additionally reported its Xcode-managed/manual selection mismatch. The automatic attempt removes that additional selection issue and confirms the real capability blocker.

No successful archive or signed IPA was generated. The capability must be enabled for this exact App ID and an appropriate profile obtained before an honest signed push-capable candidate can be produced. No entitlement was removed to conceal the blocker, and no profile/certificate was created by this work.

Parent task independently observed the signed-in Apple Developer account: current team HYBTH9WZQ6, renewal 16 September 2027, license agreement issued 14 October accepted 18 October 2026, Developer Agreement accepted 16 July 2026. This supersedes the old unverified pending-agreement concern; the agent did not accept legal terms. It does not resolve signing-profile capability or any legal/product review gate.

## API, provider and device gates

The native default remains `https://www.deutschpilot.de`; the school production API cutover has not been accepted. The protected Vercel preview cannot be used by the native bearer-only client without completing an appropriate backend deployment/access design. No Vercel bypass secret was embedded, preview protection disabled or API URL silently switched. A successful archive alone would not prove school mobile operation.

Remaining acceptance includes real school role workflows on the eventual mobile API, documents/scanner/legal configuration, jobs, Expo/APNs credentials and receipts, signed physical iPhone/iPad tests, accessibility/offline/deletion, independent review and distribution authorization. Existing TestFlight build 4 remains unchanged. Sales/proposals remain paused.

Evidence directory: `/Users/rooz/Documents/Desivo/School Platform/Activation/2026-10-20/native/` contains current audit, installed paths, check/export/archive logs, source hashes and SHA256SUMS. Source baseline at observation and app metadata are recorded in `NATIVE_STATUS.json`; concurrent server work is excluded from native acceptance.
