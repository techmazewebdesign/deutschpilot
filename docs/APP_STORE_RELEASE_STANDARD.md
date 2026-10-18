# DeutschPilot App Store release status

Run `npm run check:app-store` before creating an archive or uploading a build.

## Implemented safeguards

- A signed-in user can permanently delete the account from Profile with typed confirmation.
- The server derives identity from the verified Firebase session, cancels an active Stripe subscription, removes account-owned Supabase and Firestore data, and deletes Firebase Authentication last.
- Google sign-in is hidden in the native iOS runtime until Sign in with Apple is configured.
- Stripe purchase controls are hidden in the native iOS runtime. Existing entitlements remain usable.
- `mobile/` is now the store application: a standalone Expo/React Native product with bundled lessons, quizzes, vocabulary, German pronunciation, native haptics, and offline progress.
- The former Capacitor project has been changed to a separate legacy-preview identifier and no longer loads the production website through `server.url`.

## Release blockers that code cannot honestly clear yet

- Apple Developer Program organization enrollment, agreements, certificates, provisioning, App Store Connect record, privacy labels, screenshots, review notes, and physical-device testing are not complete.
- If paid digital access will be sold inside iOS, StoreKit/in-app purchase must be implemented and verified. The current safeguard only disables purchasing.
- Sign in with Apple must be implemented before Google sign-in can be restored to iOS.

Do not mark the app App-Store-ready while any blocker remains.

## Current preparation audit — 18 October 2026

The native application was upgraded locally. The current evidence and blockers are in `mobile/docs/APP_STORE_CANDIDATE_2026-10-18.md`; the fail-closed checklist is `mobile/scripts/release-evidence.json`. Historical enrollment and provider notes above are not current verification. The recovered legal case documents record a hold pending classification, not a located approval. No submission or publication was performed. Do not deploy this older root checkout: its web checkout lacks the Germany enrollment hold documented in the recovered compliance source.
