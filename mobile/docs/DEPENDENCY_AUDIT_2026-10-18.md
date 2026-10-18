# Mobile dependency audit — 18 October 2026

Expo doctor identified patch mismatches. `npx expo install --fix` aligned compatible SDK packages; `npm audit fix` resolved one critical transitive advisory without forcing breaking dependency changes. CocoaPods needed re-resolution after the Expo native packages changed.

After compatible fixes, npm audit reports **27 affected package records: 20 high and 7 moderate; 0 critical**. These include dependency chains and must not be interpreted as 27 independently exploitable mobile vulnerabilities.

Direct underlying advisory families observed:

- `braces <=3.0.3`: recursive-pattern stack exhaustion; current registry version and advisory list no fixed version. Reached through Metro/micromatch tooling. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- `node-forge <=1.4.0`: signature-verification issue; current registry version is 1.4.0. Reached through Expo CLI/code-signing tooling. [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv).
- `uuid <11.1.1`: v3/v5/v6 buffer checks. The inspected `xcode` consumer calls `uuid.v4()`; this narrows the observed call site but does not establish a full dependency reachability audit. [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq).
- `@grpc/grpc-js <1.13.6`: certificate-context and error-disclosure advisories through Firebase's Firestore dependency. The native app imports Firebase Authentication, not a Firestore server. Full bundle/reachability triage and an upstream-compatible upgrade remain pending. [Certificate advisory](https://github.com/advisories/GHSA-m9gg-hp2v-232j), [error-disclosure advisory](https://github.com/advisories/GHSA-f596-whhp-79r4).

npm's suggested forced solutions included old major Expo/React Native/Firebase versions. They were not applied. No audit suppression, unreviewed major transitive override or claim of a clean security audit was added. The security gate remains pending for remediation or a documented candidate-specific risk assessment.

A separate iOS Metro source-map inventory inspected 643 source entries in the current exported JavaScript bundle. None matched the four underlying advisory package families above (`braces`, `node-forge`, `uuid`, `@grpc/grpc-js`). Evidence: `verification-2026-10-18/ios-dependency-reachability.json`. This narrows the observed shipped-JavaScript exposure; it does not clear build-tool, native-SDK, server or all-path exploitability risks. The review gate remains pending.
