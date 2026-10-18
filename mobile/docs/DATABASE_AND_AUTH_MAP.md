# DeutschPilot native database and authentication map

The native app reuses DeutschPilot's existing Firebase Authentication project and Firebase UID. It does not create a second identity system.

- Firebase Authentication owns credentials, verification, recovery, and identity.
- The production Next.js server exposes only public Firebase client configuration at `/api/mobile-config`.
- The authenticated `/api/account/delete` route accepts a verified Firebase bearer token from native clients and retains the same Supabase, Firestore, Stripe, and Firebase deletion order documented in the root `docs/DATABASE_AND_AUTH_MAP.md`.
- AsyncStorage owns offline lesson completion, XP, streak, selected level, daily goal/count, and vocabulary review due dates under `deutschpilot:progress:v1`, plus theme preference under `deutschpilot:theme`. These are device-scoped, not a cloud profile. Clearing local progress does not delete the cloud account.
- New native account data must use the existing Firebase UID and must be added to the root deletion map before release.

Important native files are `src/firebase.ts`, `src/auth.ts`, `src/progress.ts`, `src/content.ts`, and `App.tsx`. The website's root `tsconfig.json` excludes `mobile/` because the Next.js website and Expo app deliberately use different React runtimes; each workspace runs its own type-check.

Environment variable names only: `EXPO_PUBLIC_API_BASE_URL`. Firebase Admin, Supabase service-role, and Stripe secrets remain server-only and must never enter the native bundle.

Do not change the Firebase project, bundle ID `de.deutschpilot.app`, authentication providers, ownership keys, billing authority, or deletion behavior without Roozbeh's explicit approval.

## 18 October 2026 upgrade

No new cloud collection, ownership key or credential system. The progress loader migrates the existing local payload. Reset clears the learning-progress key (including preferences and review history) and retains theme. Cloud account deletion retains its existing backend semantics and does not claim to wipe device-local study history. Users can separately clear that history in Account. The local profile is shared by users of this device and is not advertised as account-synchronized. Bundled content is public project material with sources in `src/data/content-sources.json`; it contains no learner records.
