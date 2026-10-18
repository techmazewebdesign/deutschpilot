# DeutschPilot Mobile

A standalone Expo 57 / React Native app for iOS and Android. It does not use a WebView and does not load the DeutschPilot website as its interface.

Included on-device product surfaces:

- CEFR learning path and self-contained starter lessons
- German text-to-speech pronunciation
- Native haptic quiz feedback
- Vocabulary flashcards
- Offline XP, streak, and completion storage
- Existing Firebase email/password identity
- Password recovery and verification
- In-app cloud-account deletion

Local verification:

```sh
npm run check
npx expo-doctor
npx expo export --platform ios --platform android
npm run check:app-store
```

External store signing, organization enrollment, screenshots, privacy labels, physical-device QA, and StoreKit remain separate release gates.

## Current candidate preparation

See [18 October candidate status](docs/APP_STORE_CANDIDATE_2026-10-18.md), [competitor review](docs/COMPETITIVE_REVIEW_2026-10-18.md) and [recovered legal case](docs/GERMANY_RELEASE_LEGAL_2026-10-18.md). The app currently bundles 105 lessons, 253 self-test questions and 684 vocabulary cards. Run `npm run sync:content` to regenerate bundled web content. Release remains blocked pending evidence in `scripts/release-evidence.json`.
