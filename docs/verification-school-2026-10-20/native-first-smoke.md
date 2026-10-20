# Native simulator smoke — 20 October 2026

Unsigned Release iOS build succeeded: `/tmp/deutschpilot-school-native-xcodebuild-complete.log`.
Xcode26.6, arm64 iPhone17Pro iOS26.5 simulator, dedicated device4B5721F1-0F2B-4474-A312-76EB2FC66DD3. EXPO_PUBLIC_API_BASE_URL=http://localhost:3000. Installed .app CFBundleShortVersionString1.1.0, CFBundleVersion5. No signing, real account, upload, notification permission or provider send.

Manual CUA steps and observed results:
1. Launched native app to Today guest dashboard0/28 A1,0XP.
2. Tapped SCHULE: native invited-school-account explanation and sign-in button, no private metadata. Screenshot `/tmp/deutschpilot-build5-school-guest.png`.
3. Tapped school sign-in: native email/password sheet and disabled empty submit; closed without entering credentials.
4. Account accessibility tree showed `Version 1.1.0 (5)`.
5. Today→first lesson Begrüßungen→selftest. Selected wronganswer→check→Noch nicht ganz→retry. Selected correctanswer→Richtig→Lektion abschließen+20XP. Alert+20XP; Today advances to ImCafé,1/28 A1,daily1/5. Screenshot `/tmp/deutschpilot-build5-lesson-completed.png`.
6. Terminated and relaunched using simctl; native Today retains1/28,20XP,daily1/5,nextlesson ImCafé. Screenshot `/tmp/deutschpilot-build5-relaunch-progress.png`.

Discovered layout defect: lesson full-screen modal back button overlaps status bar/Dynamic Island; AX button works but visual header is obstructed. Existing SafeAreaView at mobile/src/LearningScreens.tsx105 needs modal-local SafeAreaProvider so frame/insets resolve within presented controller. Auth and deletion are bottom-sheet modals in App.tsx; sign-in sheet did not overlap. School has no additional native Modal elements. No source changed after freeze; parent informed for bounded follow-up.

Not established: authenticated native school role workflows, private file picker/scanner roundtrip, full account deletion, actual offline networkloss, physical iPhone/iPad, VoiceOver/DynamicType, real APNs/Expo push or signed distribution. Twelve readiness evidence gates remain blocked.
