# DeutschPilot Android release

Native package `de.deutschpilot.app`; candidate version **1.1.0 (5)**. The Android version matches the existing iOS candidate but has its own signing identity and Google Play review gates.

## Build

Use an installed JDK 21 and Android SDK. Keep the worker count bounded on this machine.

```sh
cd mobile/android
./gradlew :app:bundleRelease :app:assembleRelease --max-workers=1 --no-daemon
```

Release intentionally fails without all four private environment variables or Gradle properties:

- `DEUTSCHPILOT_UPLOAD_STORE_FILE`: absolute path to the existing upload keystore
- `DEUTSCHPILOT_UPLOAD_STORE_PASSWORD`
- `DEUTSCHPILOT_UPLOAD_KEY_ALIAS`
- `DEUTSCHPILOT_UPLOAD_KEY_PASSWORD`

Never commit the key or passwords. Never use an Android Debug certificate as an upload identity. Preserve an existing Play upload key rather than generating a replacement. If the app is new, creation and custody of its upload key is a separate coordinated operator action.

A local **unsigned, non-uploadable** candidate can be built using `-Pdeutschpilot.allowUnsignedCandidate=true`. It is for inspection only. A release APK can be copied and signed with the local Android debug certificate strictly for local installation testing; it must be labelled as such and never uploaded to Play.

Use `scripts/android-build.sh unsigned` for the bounded arm64 inspection candidate (one worker, 1536 MB heap, in-process Kotlin). The default `signed` mode fails closed without private credentials. `scripts/android-audit.py path/to/artifact` checks SHA-256, ABI ELF headers and each native load-segment alignment without extracting files.

The main manifest disables Android backup and cleartext traffic. DocumentPicker uses Android's document provider; legacy broad storage permissions and overlay access are blocked. Debug builds retain the development-only overlay/cleartext configuration.

## Remaining service gates

Google sign-in needs a web OAuth client ID and an Android OAuth registration for the exact package/certificate. Android push needs its Firebase Android application configuration and real-device verification. No push/OAuth success is implied by compilation. School APIs are still pointed at the current default backend; hosting and sensitive-data activation are separate from the native package build.

Before Play upload: organization verification, upload signing, privacy/deletion links, Data safety, content rating, screenshots, physical-device/offline/accessibility QA and actual operator disclosures must be verified. No purchase/subscription checkout may be exposed without the applicable Play billing integration.
