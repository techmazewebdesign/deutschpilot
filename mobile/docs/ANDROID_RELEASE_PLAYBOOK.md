# Android release playbook

This is the repeatable path for DeutschPilot and the other Expo/React Native apps.

## 1. App identity

- Set a permanent Android package in `app.json` (`android.package`).
- Keep the package stable after the first release.
- Set the app name, icon, version, and URL scheme before generating native files.

## 2. Generate native Android once

```sh
npx expo prebuild --platform android
```

Commit the generated `android/` project after reviewing it. Do not regenerate it casually after applying manual native changes.

## 3. Firebase and Google sign-in

For Firebase-backed apps, download the Android Firebase configuration from the same Firebase project and place it at the location declared by the Expo config. Register the exact Android package and SHA-1/SHA-256 fingerprints in Firebase before testing Google sign-in. Keep iOS and Android configuration files separate.

## 4. Verification ladder

Run the checks in this order:

```sh
npm run check
npm test
npx expo export --platform android
./android/gradlew -p android assembleRelease
```

The first three checks are source and bundle checks. The Gradle step is the APK/AAB build check and requires a JDK. Device testing additionally requires an Android emulator or a USB-debuggable device.

## 5. Distribution

- Use an unsigned/local release only for engineering checks.
- Use EAS or Android Studio with a protected signing key for internal distribution.
- Use an AAB for Google Play production and an APK for direct internal testing.
- Store signing credentials outside the repository and record the package, version, build number, Firebase project, and release channel in the release notes.

## 6. Reuse for other apps

Copy this workflow, not the generated credentials. For each app, change only the identity values, Firebase project configuration, branding assets, and app-specific permissions. Keep the same verification ladder and release checklist.
