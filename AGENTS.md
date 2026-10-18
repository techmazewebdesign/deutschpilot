# Mobile app release rules for all projects in this folder

These rules apply whenever a project adds or changes an iOS or Android app.

1. Treat App Store and Play Store release as a separate product surface, not as a website packaging step.
2. If users can create accounts, provide permanent account deletion inside the app. Authenticate on the server, require explicit confirmation, delete owned data, cancel applicable subscriptions, and remove the identity last.
3. Keep an up-to-date database/authentication map. Every new user-owned table or collection must be added to account deletion before release.
4. On iOS, do not expose a third-party login unless Sign in with Apple or another guideline-compliant equivalent is fully configured and tested.
5. On iOS, do not send users to Stripe or another external checkout for digital features or content. Implement Apple in-app purchase or keep purchasing unavailable in the iOS build. Existing access may remain available after sign-in.
6. Do not submit a remote website wrapper as a finished app. The release must provide durable app-specific value and a useful degraded/offline state.
7. Before submission, verify the legal operator, privacy policy, support URL, data-retention disclosures, age rating, permission purpose strings, account-deletion path, billing path, signing identity, bundle/application ID, screenshots, and physical-device behavior.
8. Keep release checks fail-closed. Missing operator identity, provider credentials, signing, deletion coverage, native value, or billing compliance is a blocker, not a warning to ignore.
9. Never publish, purchase an account, accept paid agreements, or submit for review without Roozbeh's explicit approval.
