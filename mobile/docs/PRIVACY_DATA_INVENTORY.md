# Native data inventory — draft for privacy and App Store review

This is an engineering inventory, not a completed App Store privacy declaration or legal notice. Optional signup still counts when assessing data collection. Do not choose “Data Not Collected” merely because guest learning is available or `NSPrivacyCollectedDataTypes` is empty in the app-level manifest.

| Data / feature | Local implementation and destination | Release review required |
| --- | --- | --- |
| Email/password credentials, UID, verification/reset state | Existing Firebase Authentication via `src/auth.ts` and `src/firebase.ts`; password handled by Firebase SDK | Controller/processor, purposes, retention, account security and linked identifiers |
| Display name / email | Optional registration profile update and signed-in account display | Contact information, identity linkage, deletion and privacy wording |
| Google sign-in | Existing `src/social.ts`; hidden in iOS UI until compliant equivalent tested | SDK inventory and provider data practices still require review even when the button is hidden |
| Apple sign-in code | Existing helper is not presented in this candidate | Do not claim Apple sign-in support without provider/entitlement/device proof |
| Lesson completion, XP, last study day, streak, daily count/goal, chosen level, vocabulary review schedule | AsyncStorage `deutschpilot:progress:v1`, device-scoped | Device backup/uninstall behavior, shared-device semantics and local reset disclosure |
| Theme | AsyncStorage `deutschpilot:theme` | Preference retention; local learning reset intentionally retains appearance |
| Account deletion bearer token and typed confirmation | HTTPS request to existing `/api/account/delete`; server owns deletion of account data | Live disposable-account test, ownership proof, complete cloud deletion, processor retention and any billing effects |
| German text to speech | `expo-speech`, OS system voice | Installed-voice/offline behavior and appropriate disclosure; no microphone recording or speech scoring implemented |
| Haptics | `expo-haptics`, device feedback | No new sensor/personal-data permission requested by this feature |
| Public policies/support | External browser/mail client links | Live content, operator identity, retention statements, support availability and applicable terms |
| Learning material | Bundled project-owned text/vocabulary; no learner records in content JSON | Language quality and ownership review |

No new cloud table, service account, identity provider configuration, learner upload, analytics feature, payment interface, or production migration was added by this upgrade. This does not establish that all existing SDKs, infrastructure logs, cloud processors or website links collect no data. Inspect the final native dependency manifests and network behavior before completing privacy labels.

The present native progress model is not synchronized with account/server progress. Account deletion and local learning reset are distinct actions; document both rather than suggesting that either one automatically establishes complete end-to-end erasure.
