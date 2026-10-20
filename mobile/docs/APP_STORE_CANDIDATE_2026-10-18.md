# DeutschPilot mobile candidate — 18 October 2026

Historical record: superseded by [20 October candidate notes](APP_STORE_CANDIDATE_2026-10-20.md), version 1.1.0 (5). The statements below describe the earlier candidate only.

Status: substantial local upgrade; **not ready for submission or publication**. No App Store upload, review submission, production deployment, payment activation, authority filing or external message was made during this work.

## Implemented

- Native daily learning compass, persistent A1–C1 selection, selectable daily goal and honest per-level progress.
- 105 lessons (8 starter + 97 imported), 253 self-test questions (8 starter + 245 imported), and 684 vocabulary cards after term/level deduplication.
- Existing website lesson text and answer keys converted into native text sections and quiz controls. No WebView, SQL execution, or live content/database migration.
- Word search in German/English/by topic; ten-card due-first review sessions; remember/again ratings; saved review intervals.
- Level-specific self-tests and five-question listening rounds with finite results. Listening is system TTS, not speech recognition or a certified exam.
- Local-calendar streaks, stale-streak display fix, daily activity count, replay without duplicate lesson XP, validated storage migration, serialized writes, explicit save/load/reset failures.
- Larger controls and text, iPhone safe areas, tablet maximum content width, light/dark support, reading/self-test lesson stages, checked answers and retry feedback.
- Google sign-in hidden on iOS until an equivalent Apple-compliant provider is fully configured and tested. Existing Firebase/email identity and deletion backend preserved.
- Visible support, privacy, terms and operator links.
- Expo/native build numbers aligned to the local candidate value 4. Apple acceptance or availability of this number has not been verified.
- Expo-compatible patch updates and a non-breaking npm audit fix; CocoaPods synchronized afterward.
- Evidence-based release check: a Team ID alone can no longer produce an App-Store-ready result.

## Evidence and limits

Run from `mobile/`:

```
npm run sync:content
npm run check
TZ=Europe/Berlin npm test
npx expo export --platform ios --platform android
npx expo-doctor
npm run check:app-store
```

The regression suite covers content/answer linkage, data migration/sanitization, local-calendar/DST activity, no duplicate XP, review scheduling, storage failures, and existing authentication helper behavior. Mocked auth tests are not live provider/deletion tests.

A local Release simulator build was compiled and the app launched on the existing iOS 26.5 simulator. Manual UI checks exercised a lesson through wrong answer, retry, completion and dashboard update (20 XP, next lesson), and a vocabulary review through reveal, rating and next card. Full VoiceOver, Dynamic Type, small-phone, iPad, airplane-mode and physical-device testing are not established by those checks. Exact final verification results and logs are recorded in `docs/verification-2026-10-18/`.

## Source/content caveats

See `src/data/content-sources.json`. A legacy A1 family lesson seed is excluded because of inconsistent source data; one checkpoint answer mismatch is recorded and excluded. Lesson counts are not proof of complete CEFR coverage or language-quality review. No official certificates or Goethe/telc affiliation are claimed.

The importer operates on this local project's own seeds. Current web production content/entitlement parity is not established. Teacher/live-class, AI feedback, writing/speaking assessment, full mock exams, community, certificates, synchronized web progress and commercial access are not implemented as native parity features in this upgrade. Bringing these over requires exact backend/source identification, legal scope and appropriate tests.

## Remaining gates

- Product-specific legal classification/territories, operator details and prior ZFU correspondence (recovered earlier records show a hold, not approval).
- Current source-lineage reconciliation: the earlier web Germany checkout restriction is absent from this older local root checkout. Do not deploy it as a legal/commercial release.
- Language/curriculum, translation, assessment and rights review.
- Live account creation, verification, recovery and complete account deletion using an explicitly disposable test identity.
- Privacy notice, App Store privacy labels, SDK manifests/retention and seller identity review. The native manifest's empty collected-data list does not establish that optional Firebase account data is uncollected.
- Dependency advisory triage; compatible fixes removed the critical advisory, but upstream high/moderate advisories remain. See the dependency audit report.
- Physical iPhone/iPad, accessibility, offline/relaunch and network-loss QA.
- Current Apple membership, agreement state, matching bundle record, reviewer access, metadata, screenshots and age rating.
- Distribution-signed archive and validation for the exact final candidate.

`npm run check:app-store` intentionally remains blocked until current evidence references are supplied and reviewed. No checklist entry was marked verified from source-code presence or historical notes alone.

## Repository handling

The repository already contained many uncommitted changes and the entire mobile directory was untracked at the start. Existing work was preserved. No bulk commit, reset, branch checkout, source deployment, authentication-provider change or billing change was performed.

Expo doctor after patch alignment: 20/21 checks passed. Its remaining check warns that app.json native settings are not automatically synchronized because native projects are present. This project retains the native projects; no destructive prebuild regeneration or warning suppression was performed. Bundle IDs and candidate build/version settings were checked manually, but complete native-configuration review remains part of the signing/release gate.

Public privacy/terms/contact/imprint routes returned HTTP 200 with matching page titles; this is reachability evidence only. The mobile privacy data inventory is in `docs/PRIVACY_DATA_INVENTORY.md`.
