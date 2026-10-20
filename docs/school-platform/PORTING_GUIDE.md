# Reusing the school platform in Polish School or another product

This module is a reusable source implementation, not a verified deployment or a legal certification. No Polish School application has been changed by this build. Each recipient school needs its own verified identity, configuration, data stores and operational approval.

## Reproducible source package

Run `node scripts/package-school-module.mjs --self-test --check` first. It checks the positive file allowlist and produces an inventory containing the exact Git commit, dirty flag, per-file SHA256 and file sizes. It writes no archive.

After the complete reviewed build has been committed and the worktree is clean, the owner may run:

```sh
node scripts/package-school-module.mjs --output-dir /Users/rooz/Documents/SchoolPlatform/SourcePackages
```

The command creates a source-only `.tar.gz`, external manifest and archive SHA256 beneath Documents. Existing packages are never overwritten. Archive creation is refused for a dirty worktree. The manifest deliberately marks the package as not certified or production verified. This build has not automatically created a package.

The allowlist includes school-domain source, school APIs and UI, native `School*` source, the verified lesson-progress boundary, school SQL, synthetic test source, the scanner service and these build/porting records. Host configuration, `.env` files, Firebase configuration, Apple credentials, provisioning profiles, real records, databases, build binaries, dependencies and Git metadata are excluded. Symlinks are rejected. Do not expand the allowlist to copy an entire project.

## Host integration points

These host files are intentionally not copied wholesale. Apply the integration to the receiving application's own implementation and review the resulting diff:

- `components/app/app-sidebar.tsx`, `components/dashboard-sidebar.tsx`: school entry and role-aware links.
- `components/learn/mark-complete-button.tsx`, `quiz.tsx`, `room-quiz.tsx`: verified progress save with errors/retry and explicit school-sync status.
- `app/[locale]/layout.tsx`: no global marketing trackers on an origin that can navigate into private school pages. A pathname-only gate cannot unload an already running tracker.
- `app/[locale]/privacy/page.tsx`: actual school processing, controller identity, providers, locations/transfers, retention and rights.
- Existing account-deletion endpoint: school privacy preflight, recorded retention holds, private storage cleanup, then identity deletion last. Do not silently discard school deletion errors.
- Existing learning readers and placement tests: verified server UID and service-role reads; no anonymous personal-data queries.
- `mobile/App.tsx`: native school entry, verified identity handoff, school progress flush, device notification registration and deletion integration. Existing unsynchronised history is not automatically school evidence.
- Host Firebase Admin/session and Supabase Admin adapters: server-only secrets, verified cookies or revoked-token checks, no caller-selected UID. Retain HTTPS origin checks and CSRF protections.

Dependencies include the host's React/Next.js, Firebase, Supabase, Zod and native Expo libraries used in the source. Tests use `tsx`, Playwright/Chrome and a disposable local PostgreSQL instance. The browser script's environment-specific Playwright import must be adapted to the receiving test runner; it is not a runtime application dependency.

## Adaptation checklist

1. Change school/product branding, labels, locale content, domain and support/privacy contact. Native bundle/application IDs, Apple team, EAS project and signing belong to the receiving product; none are transferred by this package.
2. Configure verified owner bootstrap and school identity. Membership is explicitly school scoped; a global teacher/admin role is not automatic access to every school or class. Assign each class's full teacher list.
3. Review all SQL in a disposable database, then apply approved service-role-only functions, private policies and indexes through the receiving deployment process. Never reuse another school's production records. Verify that anonymous and ordinary authenticated Supabase clients cannot read or mutate personal records.
4. Configure a private document bucket, bounded uploads, content sniffing, quarantine and authenticated scanner callbacks. Configure the scanner independently and test rejection, outage, hash mismatch and clean release. A synthetic clean scan in a test is not production antivirus proof.
5. The school's controller must document the applicable legal bases, additional health-data condition, specific retention rules, processor agreements, data locations/transfers and required rights workflows. Saving text in a settings form does not establish legal approval. Review minors/guardians, employment data and accessibility for the actual school.
6. Set document-category/chat retention and legal holds; schedule cleanup and audit review. Prove export pagination and deletion across more than one page. Preserve only records with an applicable obligation; do not use a blanket account-deletion refusal.
7. Configure notification service credentials, device permission, token registration, delivery tickets, receipts, invalid-token removal and operational monitoring. Notifications stay generic; private health/document content never belongs in a push payload or class chat.
8. Decide which lesson source IDs belong to the receiving product. Web events use `web:<lesson UUID>`; native sources need their own stable IDs. Self-reported practice scores are not proctored examination results or recognised certificates.
9. Run unit/auth tests, real PostgreSQL policy/transaction tests, browser role walkthroughs and native simulator checks. Repeat on physical iPhones with actual verified test accounts before release. Verify owner/office, two teachers on one class, unrelated teacher, two students and removed members. Test attendance, absence, file quarantine/release, letters, signed return, complete chat history, moderation, alerts, archive paging, export, deletion/holds and offline/retry behaviour.
10. Record exact commit, package hashes, database migrations, environment-variable names only, test evidence and unresolved deployment gates in the receiving build record. Public App Store submission, legal agreements and production deployment require their own authorised release process.

## Evidence boundaries

The source package does not include test-user credentials or live configuration. Existing browser evidence uses real UI interactions with synthetic identities and an explicitly declared test transport. Local PostgreSQL tests prove database behaviour in their disposable fixture, not remote production deployment. Email delivery, real scanner/provider connectivity, physical-device push and legal operator activation must be reverified for each school.

## Explicit record-retention policy before school activation

The receiving controller must document retention for attendance, absence reports, school letters, notifications, practice progress and audit records, in addition to each document category and class chat. The six record periods are an optional all-or-nothing configuration; blank means unconfigured, and partial entries must be completed before saving. The policy note must state the actual purpose, applicable school/state requirements and review basis. The technical input maximum is not a statement of a German legal retention period. No universal period is supplied or recommended by the module.

Sensitive uploads and illness reporting remain blocked until the complete policy, document-category periods, chat period, controller/contact and legal bases are configured. Saving those fields does not prove that the selected rules are lawful. A receiving school's legal/operator review remains an activation gate. Automatic cleanup acts only under explicitly configured policies, preserves recorded holds and protected linked records, and requires separate operational verification of file cleanup and cron execution. The browser fixtures deliberately use synthetic test periods; do not copy them into a real school's policy.

### Hosted PostgreSQL extension compatibility

Supabase installs pgcrypto in extensions, while a local PostgreSQL installation may use public. School routines must retain search_path=public,extensions. The fresh school migration includes this; existing installs must also apply supabase/migration-school-extension-path.sql. Verify bootstrap/invitations against the actual target database, not only local PostgreSQL.

## Recovery/hold transaction correction

Include `supabase/migration-school-recovery-hold-lock.sql` for existing normalized installs, after the base tables and extension-path compatibility migration. It is idempotent and grants execution only to `service_role`, using fixed `public,extensions` search path. Fresh installs include the corrected function in the base migration. Review/apply through the recipient project's authorised migration process; this build record is not permission to migrate a hosted database.

This correction serializes the operator recovery decision with preservation holds before returning a private storage path: member → document → reservation. Missing document metadata uses the reservation owner/path while retaining the existing unresolved-upload barrier. Retain the actual writer-fencing and provider-drain operating procedure; no automatic timeout clears an unknown write. Package check mode now requires the extension-path and recovery-lock supplemental migrations in its exact source inventory. No final archive or independent release approval was produced by these checks.
