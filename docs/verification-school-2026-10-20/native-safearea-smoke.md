# Safe-area correction: native candidate 1.1.0 (5)

Only LearningScreens.tsx import and NativeLessonModal wrapper changed: SafeAreaProvider is local to the presented Modal. No quiz, completion, account or credential logic changed.

Checks: mobile npm run check PASS (/tmp/deutschpilot-safearea-tsc.log); npm test31/31PASS (/tmp/deutschpilot-safearea-tests.log); unsigned Release xcodebuild PASS (/tmp/deutschpilot-school-safearea-xcodebuild.log). Xcode26.6, arm64 iPhone17Pro simulator iOS26.5, dedicated4B5721F1-0F2B-4474-A312-76EB2FC66DD3. APIbase localhost3000. No real account or external provider action.

Real CUA steps:
1. Installed rebuilt1.1.0(5), launched existing disposable guest progress1/28,20XP.
2. Today→ImCafé. Header/backbutton entirely below DynamicIsland/statusbar in reading view. Screenshot /tmp/deutschpilot-build5-safearea-header-fixed.png.
3. Coordinate tap center of visible Backbutton returned to Today. Reopened same lesson.
4. Selftest header/backbutton also below statusbar. Selected B Ichmöchte einenKaffee,bitte→check→Richtig→Lektionabschließen+20XP. Success alert dismissed.
5. Terminated/launched via simctl. AX and screenshot confirm nextlessonUnterwegs,2/28A1,40XP,daily2/5. Screenshot /tmp/deutschpilot-build5-safearea-relaunch-progress.png.

This validates the reported simulator layout defect and guest completion/persistence only. No physical-device, iPad, authenticated native school/provider, signing, TestFlight or public-release claim. All prior legal/provider/release gates remain.
