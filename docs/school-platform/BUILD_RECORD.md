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
| Real PostgreSQL browser walkthrough | **37 passed, 0 failed**, 16 screenshots, zero uncaught browser errors; `docs/verification-school-2026-10-20/browser-db-results.json`, timestamp `2026-10-20T17:52:23.682Z` | Actual UI plus normalized SQL reads/transactions; explicit synthetic identities and intercepted HTTP; file bytes and scanner verdicts are declared fixtures |
| Earlier browser walkthrough | **27 passed, 0 failed**; `browser-results.json` | Real Chrome UI with synthetic in-memory domain transport; historical evidence, not database/provider proof |
| Web progress/auth boundary | **9 passed**; `tests/learning-progress.test.ts` | Verified-identity/origin path, strict bounded payloads, canonical lesson/course relation, no caller UID, save failure and honest pending school sync |
| Real scanner adapter | **4/4 passed**; `scanner-results.json` | Isolated actual ClamAV engine accepted harmless PDF, rejected benign EICAR bytes, denied bad authorization and rejected hash mismatch; no deployed school-storage/provider claim |
| Normalized SQL suite | **12 passed** reported by release lead after the final SQL batch; actual PostgreSQL workflow, concurrency and capacity tests in `tests/school/normalized-postgres.test.ts` | Includes indexed 100,000-message history, bounded keyset pages, parallel students, monotonic progress, idempotence, revocation and lifecycle cases; attach the final command log during release verification |
| Legacy private access | Actual disposable PostgreSQL and auth/ownership tests | Anonymous/ordinary authenticated personal-data access denied; final command logs belong to release verification, not a claim of remote production policy state |
| Native candidate | **31 passing tests reported by native worker**, final artifact/check log pending release-lead integration | Candidate/export/simulator evidence does not prove signed IPA delivery, physical-device operation or TestFlight update |
| Static checks | Full root TypeScript and scoped web ESLint passed after final policy UI integration | Repeat required after any later source change |
| Source packager | `--self-test --check` passed | Source allowlist/hashes only; archive creation requires final clean reviewed commit and explicit Documents destination |

The 37-step database-backed browser run exercised UI bootstrap, invitation creation, multiple teacher assignments, blank/partial/full policy configuration, attendance, student illness/absence, private PDF quarantine and fixture scan release, letters and signed return, notification read state, both teachers' complete paged class history and moderation, unrelated/revoked-user denial, active-session revocation clearing private UI, 1,005-record archive loading, complete paginated own export, held deletion request, UI hold release and real SQL erasure after synthetic file cleanup, German mobile layout, tracker-free public-to-school navigation and signup invitation guidance without creating an account.

The final run used only school `browser-db-99182068-ee2b-48df-9691-5d27a624c1c2` in local Docker container `deutschpilot-school-test-20261020`; it did not truncate another school's fixtures. Browser policy values are synthetic test inputs, not legal retention recommendations.

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
