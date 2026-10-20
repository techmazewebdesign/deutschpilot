# DeutschPilot school platform - reusable build record

Updated: 20 October 2026. Product owner: Rooz / Desivo. First intended prospect: BSB school, Bremen; its exact legal entity and school type remain unverified. Planned later reuse: Polish School. This record describes source, tested behaviour and activation gates. It is not legal certification, production deployment or an executed sale.

## Scope and release boundary

Build the missing school system before sale: school-owner, office, teacher and student roles; multiple teachers per class; class membership; attendance and absence; private supporting documents; document requests; letters, receipt acknowledgements and returned signed copies; class conversations; notifications; shared practice progress; web and native daily school workflows. Keep all sales sending paused.

- Working source: `/Users/rooz/Documents/Codex/2026-10-18/deutschpilot-release`.
- Starting commit: `28494b3e043d23e9660e044102e794d2866c3551`. The release lead records the final reviewed candidate commit and package hashes after source freeze.
- Original dirty website checkout and Polish School source remain untouched.
- Existing TestFlight `1.0.0 (4)` predates this implementation. A new source/export or simulator build is not a new installed TestFlight binary.
- No production SQL migration, deployment, public App Store submission, sales email or real student-document processing was performed as part of the local implementation/test evidence below.

## Current architecture

The earlier single-school JSONB aggregate pilot was replaced. The active repository stores indexed per-entity records, class assignments, letter recipients, notification delivery state and audit events in normalized PostgreSQL tables. There is no active 8 MB school-wide aggregate persistence path.

- `lib/school/contract.ts`: canonical actions, role-scoped snapshots, pagination, policies and web/native types.
- `lib/school/engine.ts`: validation and role/workflow rules. Hidden UI controls are never the permission boundary.
- `lib/school/repository.ts` and `server.ts`: verified identity, school-selected storage, bounded reads, optimistic per-record transactions and retry handling.
- `supabase/migration-school-platform.sql`: service-role-only functions, private table policies, class/tenant checks, per-record revisions, keyset history/archive/export, retention, privacy cleanup and notification outbox.
- `lib/school/documents.ts`: bounded typed uploads, exact-byte hashing, quarantine and authenticated private downloads. Storage paths/hash metadata are not exposed to ordinary clients.
- `scripts/school-scanner.ts`: operator-managed scanner adapter. Missing/stale signatures, authorization failure, mismatched hashes or unavailable scanning fail closed.
- `components/school/` and `app/[locale]/school/`: responsive English/German school workspace, accessible forms, error/retry/empty states and explicit limited-page counts.
- `mobile/src/School*` and `mobile/App.tsx`: native school workflows, account-scoped progress/device state and host-app navigation/identity integration.
- `app/api/learning/progress/route.ts` and `lib/learningProgressClient.ts`: verified server UID, canonical lesson/course validation, monotonic account progress and school mirroring. New web events use `web:<lesson UUID>`; practice scores are self-reported, not examination evidence.
- `supabase/migration-legacy-private-access.sql` and legacy access adapters: service-only personal-data access and server-derived ownership. Local migration tests do not prove that remote production policies have been applied.

## Permission and privacy decisions

The deployment chooses its school on the server. Clients cannot select arbitrary school IDs. Global Firebase staff/admin claims do not grant school membership. Email-bound, expiring invitations assign active school roles; new public accounts cannot grant themselves teacher or office access.

Multiple assigned teachers share their class history. Removal/revocation prevents subsequent scoped API access. The web UI clears loaded private state on authentication/scope denial and resets caches on actor changes. Teachers receive necessary absence dates/status, not health reasons or private documents. Private uploads are separated from class conversations.

Private files remain unavailable until the trusted scanner has accepted the exact bytes. Acknowledgements and uploaded handwritten copies are not qualified electronic signatures. A Jobcenter category stores a private document; it is not an official Jobcenter connection or submission.

Global Google Tag Manager, its no-script iframe and Vercel Analytics are removed from this school candidate, including public pages. A public-to-school SPA navigation must not carry previously loaded marketing trackers into private screens. See `docs/verification-school-2026-10-20/browser-tracker-policy.md`.

## Explicit data-lifecycle policy

The controller must configure the six record periods together: attendance, absence reports, letters, notifications, practice progress and audit records. The policy note documents actual purpose, applicable school/state requirements and review basis. Blank means unconfigured; partial entries cannot silently replace a saved complete policy. No universal German retention period is supplied. Input maxima are technical bounds, not legal recommendations.

Document-category and class-chat periods are also explicit. Health-related workflows remain blocked without the full record policy, policy note, document-category/chat rules, controller/contact and legal bases. Routine cleanup is unavailable in the owner UI without a complete record policy. Recorded holds and protected linked records are preserved. Actual scheduled operation, provider cleanup and legal suitability remain deployment/operator checks.

Export follows keyset pages; the web interface labels partial exports and offers continuation when its explicit safety bound is reached. Privacy requests, holds, private-file cleanup and account identity deletion are separate stages. School cleanup must precede the host identity's permanent deletion; do not silently ignore school cleanup errors.

## Verification evidence

| Check | Current evidence | Boundary |
|---|---|---|
| Real PostgreSQL browser walkthrough | **37 passed, 0 failed**, 16 screenshots, zero uncaught browser errors; `docs/verification-school-2026-10-20/browser-db-results.json`, timestamp `2026-10-20T18:13:34.672Z` | Actual UI plus normalized SQL reads/transactions; explicit synthetic identities and intercepted HTTP; file bytes and scanner verdicts are declared fixtures |
| Earlier browser walkthrough | **27 passed, 0 failed**; `browser-results.json` | Real Chrome UI with synthetic in-memory domain transport; historical evidence, not database/provider proof |
| Web progress/auth boundary | **9 passed**; `tests/learning-progress.test.ts` | Verified-identity/origin path, strict bounded payloads, canonical lesson/course relation, no caller UID, save failure and honest pending school sync |
| Real scanner adapter | **4/4 passed**; `scanner-results.json` | Isolated actual ClamAV engine accepted harmless PDF, rejected benign EICAR bytes, denied bad authorization and rejected hash mismatch; no deployed school-storage/provider claim |
| Normalized SQL suite | **12 passed** reported by release lead after the final SQL batch; actual PostgreSQL workflow, concurrency and capacity tests in `tests/school/normalized-postgres.test.ts` | Includes indexed 100,000-message history, bounded keyset pages, parallel students, monotonic progress, idempotence, revocation and lifecycle cases; attach the final command log during release verification |
| Legacy private access | Actual disposable PostgreSQL and auth/ownership tests | Anonymous/ordinary authenticated personal-data access denied; final command logs belong to release verification, not a claim of remote production policy state |
| Native candidate | **31 passing tests reported by native worker**, final artifact/check log pending release-lead integration | Candidate/export/simulator evidence does not prove signed IPA delivery, physical-device operation or TestFlight update |
| Static checks | Full root TypeScript and scoped web ESLint passed after final policy UI integration | Repeat required after any later source change |
| Source packager | `--self-test --check` passed | Source allowlist/hashes only; archive creation requires final clean reviewed commit and explicit Documents destination |

The 37-step database-backed browser run exercised UI bootstrap, invitation creation, multiple teacher assignments, blank/partial/full policy configuration, attendance, student illness/absence, private PDF quarantine and fixture scan release, letters and signed return, notification read state, both teachers' complete paged class history and moderation, unrelated/revoked-user denial, active-session revocation clearing private UI, 1,005-record archive loading, complete paginated own export, held deletion request, UI hold release and real SQL erasure after synthetic file cleanup, German mobile layout, tracker-free public-to-school navigation and signup invitation guidance without creating an account.

The final run used only school `browser-db-ff62bedb-8743-4bcb-9f5d-a1a5eee013f9` in local Docker container `deutschpilot-school-test-20261020`; it did not truncate another school's fixtures. Browser policy values are synthetic test inputs, not legal retention recommendations.

## Release and operator gates

Before any real school activation, verify controller/seller identities, actual school type and federal-state requirements, adult/minor/guardian use, legal bases including the additional health-data condition, processing agreements, subprocessors, hosting locations/transfers, exact retention rules, rights handling and operational responsibility. Complete accessibility review for the actual product/use case. Guardian accounts and qualified-signature-provider integration are not implemented by assuming them from the document workflow.

Before production release, apply reviewed migrations through the authorised process; verify real identity/authorization, private storage and scanning, signatures/age of scanner data, scheduled retention and reminders, push tickets/receipts and failure cleanup, account export/deletion, monitoring/redaction and backup/restore. Run physical iPhone tests and prepare a signed native build under the correct Apple identity. The installed TestFlight build cannot be described as updated until a newly signed candidate has been uploaded and distributed.

Existing paid German course-enrolment restrictions remain. Sale/licensing of software does not by itself establish a ZFU exemption or approve the buyer's course operation. Public App Store review and exact publication timing remain outside this build's local verification.

Official references reviewed by the release lead on 20 October 2026:
- GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/
- DSK school learning-platform guidance (published 2018): https://www.bfdi.bund.de/SharedDocs/Downloads/DE/DSK/Orientierungshilfen/OH_OnlineLernplattformen.pdf
- Qualified electronic form: https://www.gesetze-im-internet.de/bgb/__126a.html
- ZFU classification: https://zfu.de/veranstaltende/faq
- Accessibility applicability: https://www.bundesfachstelle-barrierefreiheit.de/DE/Barrierefreiheitsstaerkungsgesetz/FAQ-elektronischer-Geschaeftsverkehr/faq-elektronischer-Geschaeftsverkehr_node

## Commercial rights and Polish School reuse

Confirmed by Rooz on 20 October 2026: reserve the shared school-platform modules for Desivo reuse, including Polish School. One buyer may acquire DeutschPilot-specific brand/domain/product assets and a permanent source-code licence to shared modules for operating, customising and maintaining that product. Do not promise exclusive ownership of all shared code. Final written terms must define permitted onward transfer/sublicensing and respect third-party licences; no other product's credentials, records or accounts transfer automatically.

Defined usage rights must be drafted instead of assuming the author's copyright itself transfers (UrhG §29: https://www.gesetze-im-internet.de/urhg/__29.html). This instruction is not an executed transfer agreement.

Use `docs/school-platform/PORTING_GUIDE.md` and `scripts/package-school-module.mjs`. The allowlisted source package records exact commit, dirty flag, file SHA256 and archive SHA256. Port host auth/navigation/privacy/deletion/progress adapters deliberately; use separate school identity, private database/bucket/scanner/push configuration and a separately signed native candidate. Repeat all security, SQL, browser and physical-device checks for Polish School. A DeutschPilot test pass does not certify another application.

## Sales-document status

English/German proposal PDFs and a German non-payable draft invoice are being prepared outside the source checkout under `/Users/rooz/Documents/Desivo/DeutschPilot/Sales`. Commercial figures are indicative negotiation assumptions, not a binding quote: asking price EUR 34,900; optional support EUR 790/month for five hours, additional work EUR 100/hour; infrastructure/provider costs separate. Seller, buyer, tax treatment and final scope must be verified before issuance. No sales email or invoice issuance is authorised by this document. Sending remains paused.


## Final correction and verification wave

The first independent review rejected candidate `3cfef1b5252583562f8ec883a4ace23240349c97`: a delayed private upload could recreate bytes after account deletion completed. The corrected source uses `school_upload_reservations` and service-only begin/finish RPCs. Metadata creates a reservation atomically; a writer must acquire its lease before storage access. Reserved writes can be cancelled safely; writing/unknown outcomes block cleanup acknowledgment and completed deletion. There is no automatic expiry. Settled cancelled/revoked/expired writes enter durable cleanup. Even missing document metadata cannot discard a surviving ledger path. Cleanup approval freezes late hold changes before bytes are removed.

The manual `scripts/school-recover-upload.ts` tool defaults to read-only inspection. Recovery requires actual fencing of all possible writers/credentials and provider-drain evidence, explicit operator confirmations and active-owner authority. A note or elapsed time is not proof that a pending writer cannot resume. See `scripts/school-README.md` before activation or recovery. Pre-protocol deployments must fence/drain old writers before migrating; this new module was not deployed during this work.

Final correction checks: actual HTTP handler plus real local PostgreSQL **9/9 passed** (delayed write, reserved cancellation, ambiguous late object, crash/no expiry, recovery authorization, revocation, retention, normal upload/deletion, missing metadata and late hold); normalized PostgreSQL **12/12 passed**; school unit/auth/HTTP/deletion **31 passed** with the 21 database cases explicitly skipped in that separate command and run independently. Logs are in `tests/school/evidence/`. Root TypeScript and the actual production Next.js build passed after the route correction. Build warnings include existing lint/deprecation and absent local admin credentials; a successful build is not live-provider authentication proof.

The final database-backed browser run again passed **37/37** including actual upload begin/store/finish before fixture scanning. Its timestamp is `2026-10-20T18:13:34.672Z`; the last stricter missing-metadata/finalization edge guards were added afterward and covered by the final 9 HTTP/database tests. Provider bytes, identities and scan verdicts in the browser remain synthetic.

Native **1.1.0 (5)**: all **31** tests and TypeScript passed. Unsigned Release simulator compilation, installation and guest School sign-in boundary passed. Actual lesson wrong-answer/retry/completion and relaunch persistence were exercised. A discovered Dynamic Island/header overlap was corrected with a modal-local safe-area provider; the rebuilt binary verified visible Back tap, a further completed lesson and relaunch persistence (2 lessons/40 XP). Evidence copies are in `docs/verification-school-2026-10-20/native-*`. Authenticated native school workflows, physical devices, APNs, signing and TestFlight delivery remain separate release gates.

Second independent source review of code commit `a1a8c81e0d466d24c38bc510fb83199ff669ed52` was blocked by an automated safeguard citing “possible cybersecurity risk”; it produced no final code verdict. The first review remains FAIL for the earlier candidate; the correction has local test evidence, not completed independent verification. The source worktree remained clean and HEAD unchanged through the blocked review. No alternative reviewer was dispatched to bypass that safeguard.

Status: **TESTED LOCAL CHECKPOINT — INDEPENDENT REVIEW BLOCKED — NOT A RELEASE APPROVAL**. The required review workflow (`/Users/rooz/.agents/skills/fable-foreman/SKILL.md`) states “The verifier is required for every accepted change”. Therefore the final reusable release archive is held; the source remains preserved in the Git checkpoint, with instructions and evidence copied to Documents. Resolve independent verification through an authorised review process before accepting/porting this candidate. All provider, physical-device, privacy/legal and distribution gates also remain. No deployment, live migration, sales sending or invoice issuance is established by these local checks.

## Hosted activation checkpoint - 20 October 2026

The isolated preview is deployed at https://deutschpilot-3t640hu5u-techmazewebdesigns-projects.vercel.app (Vercel deployment dpl_AQYhjLHDiEUK1UjXjayxpmRvg4n5, web source 7559e2e). Production domain and TestFlight remain unchanged. Direct deployment avoids publishing shared source into the public GitHub repository.

The connected EU Supabase project now contains 22 normalized school tables, all with RLS and no anon/authenticated table SELECT or function EXECUTE access. The school-private bucket is private. Existing learning tables and the legacy-private-access migration were left unchanged.

The first hosted RPC check exposed pgcrypto installed in Supabase's extensions schema, while local PostgreSQL used public. The fresh migration now sets a fixed public,extensions lookup path; migration-school-extension-path.sql corrects already-installed school routines without changing non-school routines. Apply this compatibility migration when reusing the module in Polish School.

Thirteen subsequent hosted RPC checks passed using disposable synthetic trusted identities: bootstrap, invitations, two-teacher class/chat, denied nonmember and escalation, attendance, absence approval, letters/read/acknowledgement, notifications, monotonic progress, disabled sensitive uploads and tenant cleanup. This tests real remote storage/RPCs, not Firebase/browser sign-in, file scanning or physical push receipt. Evidence is in Documents/Desivo/School Platform/Activation/2026-10-20/REMOTE_DATABASE_CHECKS.json.

Preview school ID and owner bootstrap UID are configured. Actual owner Google/Firebase sign-in, school initialization, class creation and chat save/reload succeeded; ten owner sections were smoke-checked. Separate teacher/student/office browser and physical-device acceptance remain pending. Scanner hosting, controller-approved legal/processor/retention records, scheduled operations, physical push tests and independent production review remain pending. Sales sending stays paused.

## Implementation correction: recovery versus preservation hold

The supplied original schedule was reproduced locally against disposable PostgreSQL 17 and a synthetic byte-storage adapter before editing source. An uncommitted `document.hold` was already applied inside its transaction; the old recovery function nevertheless returned the path. The adapter removed the bytes; the hold then committed and cleanup acknowledgement rejected. Observed baseline: `legalHold=true`, `recoverySucceededDespiteInFlightHold=true`, `privateObjectRetained=false`, `cleanupAckDeniedAfterBytesRemoved=true`. Evidence: `/tmp/school-recovery-hold-before.txt`; supplied reproducer `/tmp/deutschpilot-school-recovery-hold-race.cjs`. No hosted records were involved.

The correction obtains the target student member and document locks before the reservation lock and reads the hold under that document lock. The ledger supplies owner/path if metadata is absent. Two regression schedules use separate real PostgreSQL transactions and require an observed lock wait (`pg_stat_activity.wait_event_type=Lock`, nonempty `pg_blocking_pids`) before releasing the winning transaction. Hold first: recovery waits, then rejects `SCHOOL_RECORDS_HOLD`; synthetic bytes remain and no cleanup authorization exists. Recovery first: hold waits, then rejects `SCHOOL_DELETION_IN_PROGRESS`; only the committed recovery authorization permits byte removal/guarded acknowledgement. No deadlock occurred. Missing-metadata reviewed recovery also passed.

Validation on this correction: actual route/PG handshake **12 passed**, normalized PG workflows **12 passed** (including 100k-message indexed history), unit/auth/HTTP/deletion **31 passed**, **24 explicit PG skips** covered separately; full root TypeScript check passed. Commands used `SCHOOL_TEST_POSTGRES_CONTAINER=deutschpilot-school-test-20261020 tsx --test tests/school/upload-deletion-handshake.test.ts`, the same environment with `tests/school/normalized-postgres.test.ts`, `tsx --test tests/school/*.test.ts` without DB configuration, and `tsc --noEmit --incremental false`. Logs: `/tmp/school-recovery-hold-after.txt`, `/tmp/school-recovery-normalized.txt`, `/tmp/school-recovery-unit.txt`, `/tmp/school-recovery-tsc.txt`. Supplemental migration applied twice locally successfully; source-only packager self-test/check passed without creating an archive (`/tmp/school-recovery-package-check.txt`). No application runtime TypeScript changed; no new production build was needed for this SQL/test/operating-record correction.

Supplemental migration for existing installations: `supabase/migration-school-recovery-hold-lock.sql`. It has **not been applied remotely**. This was an implementation correction, not independent verification; the prior blocked verifier remains blocked and no alternative reviewer was attempted. Legal, provider, deployment, physical-device and independent acceptance gates remain. Only the disposable test container created for this correction is removed; the existing n8n container is untouched.

Lead follow-through: actual route/PG handshake suite independently rerun in a new disposable PG17-alpine database, **12/12 passed, no skips**; supplemental installed twice, fresh/supplemental bodies identical. Correction checkpoint 7cfb09e. Hosted migration school_recovery_preservation_hold_lock_20261020 subsequently applied (version 20261020193141), read-only installed body MD5 3bee9474c8c27ce37d1fb7c1eee2e2fc matched source and anon/authenticated EXECUTE remained false. No real file deletion or processing. Earlier “not remotely applied” above describes the implementation worker's handoff, not current deployment state. Same-reviewer retry was again safeguard-blocked; no final independent verdict. Evidence in Documents/Desivo/School Platform/Activation/2026-10-20/REVIEW_RETRY_2026-10-20.md.
