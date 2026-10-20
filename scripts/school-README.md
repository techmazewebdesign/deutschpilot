# Reusable school module — build and activation record

20 October 2026. Shared module for DeutschPilot, with later Polish School reuse intended. No Polish School source or production service was changed. Technical safeguards are implemented; this record is not legal certification or an activation approval.

## Architecture and boundaries

- Contract: `lib/school/contract.ts`. Strict domain validation: `engine.ts`. Actual persistence: `repository.ts` and `supabase/migration-school-platform.sql`.
- Normalized organization/settings, memberships, classes/assignments, attendance, absences, private documents/requests, letters/individual recipients, messages/read cursors, notifications/devices/outbox, progress, audit, invitations, deletion requests and cleanup queue. No aggregate fallback and no 8 MB school-wide hot row.
- Bounded tenant/owner/class queries; snapshots advertise `pagination` and `pageCursors`, archived sections use `section.page`, chat/audit use indexed keyset pages of100. Export streams through explicit1000-record cursor pages consumed by clients. Never treat the first page as a complete dataset.
- Domain service computes entity changes, then service-only PostgreSQL transaction rechecks current membership, role, class and recipient scope and touched revisions. Relevant membership/class rows are locked to prevent revocation races. Transient conflicts/deadlocks retry up to4; unrelated students do not serialize on a school row. Progress merges use SQL OR/GREATEST. Chat sender/clientMessageId has a unique dedupe index. Letter acknowledgements and returned-file receipts update individual recipient rows, not shared letter maps.
- Firebase revocation-checked session or native bearer identity; verified email for school access/invitations. Global teacher/admin claims do not create membership. School selected by server `SCHOOL_ID`; bootstrap additionally requires verified global admin matching configured `SCHOOL_BOOTSTRAP_OWNER_UID`.
- Private files, including general/Jobcenter records, are owner/office/student only. Teachers see assigned classes, attendance, progress and minimal planned-absence summaries (student/date/status), never illness reasons or medical files. Letters redact other recipients and their receipts for students. Snapshot/export omit storage paths and hashes.

## Implemented operations

- Owner invitations/roles/active state and last-owner protection; class rosters, multiple teachers, timetable text.
- Daily register and student absence report/review. Approved absence automatically excuses absent/late entries in either operation order; actual present remains present. Review reversal recalculates overlapping approvals and preserves manual office excuses. Teachers receive generic updates and minimal advance status.
- PDF/PNG/JPEG byte-sniffed uploads bounded10 MB; quarantine first; SHA256-bound trusted scan; clean-only request/letter fulfillment and download; access audit/no-store/private storage and restrictive direct-client storage policy. Office rescan endpoint retries quarantined scans without allowing a caller-selected verdict.
- Letters, read receipts, acknowledgements and returned scanned copy. This is not QES and is not represented as sufficient for every legal form.
- Per-class text group chats with retained history for every assigned teacher, membership revocation, paging, moderation and unread cursors. No sensitive attachments in chat. Generic class notifications coalesce unread messages per recipient/class, with no push on notification.read.
- In-app notices, due-date reminders and optional generic push outbox. Pending rows claimed with leases/SKIP LOCKED; current recipient/device ownership and unread status checked again immediately before sending. Provider ticket means acceptance; receipt means downstream push-service receipt, not proof the phone displayed/read it. Ambiguous transport outcomes become unknown and are not automatically resent.
- Own-account metadata export with explicit cursor completion. Native/web progress uses one account identity, monotonic completion/best self-reported score, verified lesson labels from shipped native content/canonical web rows. Guest history does not silently become authenticated history.
- Permanent deletion integration before legacy profile/identity writes. Last owner and explicit file holds create review requests. Otherwise membership is disabled, storage cleanup is retryable, then own records/assignments/recipient maps/device tokens are removed. Authored chat text is cleared and identifiers receive fresh random pseudonyms; known UID/email/composite audit targets are redacted. This does not promise automatic removal of all third-party mentions or legally held school records. A revoked-checked authenticated account can delete after an email change; email verification remains required for school reads. Cookie deletion requires same-origin; a verified bearer selects its own identity and never mixes with a cookie account.

## Retention and health safeguards

There are no inferred German legal retention periods. Owner settings require a documented controller policy note, per-category file periods, chat period and per-record attendance/absence/letter/notification/progress/audit periods before sensitive processing can be enabled. Applicable Article6 and Article9 grounds, school/state obligations, operator and privacy contact must be documented by the actual controller.

Expired health records are hidden at configured expiry while physical cleanup is pending; explicitly held linked context is preserved with restricted access. Files expire immediately for download. Indexed bounded record/file/chat cleanup preserves explicit holds and retained linked files. Failed object deletion remains in a durable queue. Notification removal includes its outbox and letter removal includes recipient receipts. Missing policies never trigger guessed mass deletion. Maintenance must be scheduled and reviewed by the operator.

## APIs

- GET `/api/school`: redacted snapshot. POST: strict `SchoolAction` union. Cookie writes require exact same Origin; verified bearer is supported.
- POST `/api/school/documents`: multipart file,title,category, optional absenceId/letterId/requestId. GET `?id`: authenticated private clean binary. POST `/api/school/documents/scan?id`: office-only rescan.
- `section.page`, `chat.history`, `audit.list`, `data.export` expose bounded explicit cursors. Owner audit contains actor/action/target/time and minimal attendance trace, no document contents or tokens.
- POST `/api/school/notifications`: scheduler secret only; generic reminders and optional push. POST `/api/school/maintenance`: separate job secret and configured maintenance owner; dry-run default, `?execute=true` performs a bounded cleanup batch.

## Activation — not performed

1. Review/apply the normalized migration and separate legacy privacy hardening migration in the correct project after backup. Local SQL proof is not production schema compatibility proof. No production migration/deployment ran.
2. Configure Firebase admin, Supabase service role, `SCHOOL_ID`, bootstrap owner. Set actual controller/operator/privacy/legal/retention policy. Complete controller/processor/state-school review, transfer assessment and DPIA screening where applicable; no checkbox certifies these.
3. Deploy updated ClamAV plus `scripts/school-scanner.ts` behind HTTPS. App uses `SCHOOL_SCANNER_URL`/`SCHOOL_SCANNER_TOKEN`; scanner uses `CLAMAV_HOST`, optional ports. VERSION database age must be valid/not future and at most72h (operator can lower); cached health30s still rechecks age. Freshclam monitoring is required. Missing/stale scanner fails closed.
4. Configure `SCHOOL_JOBS_CRON_SECRET`, `SCHOOL_MAINTENANCE_OWNER_UID`, real scheduled reminders/maintenance and monitoring. Dry-run counts are per bounded batch, not totals. Repeat successful batches until queues drain. Never expose scheduler credentials to clients.
5. For requested closed-app push, configure EAS/APNs device capability and permission, `EXPO_ACCESS_TOKEN`, `SCHOOL_PUSH_ENABLED=true`, `SCHOOL_PUSH_CRON_SECRET`; verify physical-device delivery. No real pushes were sent during backend tests.
6. Run read-only `scripts/school-check-activation.ts`. It requires actual review/processor/retention/scheduler references and provider configuration. It reports technical gaps; it does not verify legal conclusions or replace device/operator acceptance.
7. Complete authenticated production-like staging/device acceptance, restore/backup checks and an independent security review before publishing or making a sales-ready claim.

## Safe import and reuse

No application reads the former pilot aggregate. If one was activated elsewhere, stop writes and take an encrypted backup; `scripts/school-import-aggregate.ts` is dry-run by default and requires exact school matching, explicit confirmation, opt-in write environment and an empty normalized target. Import is transactional, preserves IDs/history/receipts, disables sensitive processing for controller review and never replays old push attempts. Verify counts/permissions before retiring the backup. Polish School reuse must add the migration/API/auth adapter, deletion integration, private storage/scanner, explicit school policy and both clients; this module is not an autonomous legal template.

## Verification evidence

- Domain workflows and HTTP/auth/body-limit helpers, scanner VERSION health, verified progress labels and actual deletion route mocks have passing automated assertions. Exact final counts are reported by the test runner and parent build record.
- Actual isolated PostgreSQL17 tests exercise normalized workflow transactions, direct SQL role/scope denial, recipient confidentiality, document quarantine/scan/holds, outbox leases/token reassignment, reminders, privacy cleanup, parallel attendance, SQL monotonic progress and concurrent chat dedupe/revocation.
- Synthetic100,000-message history exceeded the former8 MB limit; EXPLAIN ANALYZE used `school_chat_history_idx`, returned100 rows and measured sub-millisecond query execution in the isolated test container. This is a targeted query proof, not whole-product load certification or a production SLA.
- Fresh browser walkthroughs use synthetic actors and real PostgreSQL domain/repository transactions through intercepted browser transport; they do not bypass authentication in production routes or prove physical-device/APNs behavior.

No real school/student records, external emails, production migrations or public App Store submissions were performed by this backend work.

## Upload/deletion crash-safety correction

`school_upload_reservations` is a durable private-object write barrier, not an expiring lock. Document metadata and RESERVED reservation are committed together. Before the sole storage call the server transitions it to WRITING under current member/reservation locks. A definite successful storage completion transitions to STORED before scanning. Any storage rejection/exception/timeout is conservatively UNKNOWN because remote bytes can arrive after the response; a crash leaves WRITING. Neither state has a time-based force-expiry.

Deletion/retention/revocation can cancel RESERVED before begin. WRITING/UNKNOWN cleanup is queued but its path is not eligible for successful cleanup acknowledgment, and account finalization refuses it even if an earlier storage.remove reported an absent object. A writer that finishes after cancellation settles its durable state and declines scanning; its now-stable object is then removed and acknowledged normally. Ledger/metadata removal occurs only after safe terminal cleanup. Late legal holds cannot race an already-approved cleanup queue; the existing document/hold guard serializes that decision.

**Upgrade gate:** stop and fence every old application worker and credential that can run the pre-handshake upload code; obtain storage-provider evidence that accepted writes/retries are drained or aborted before activating this migration against existing records. A migration cannot retroactively invent missing reservations for old in-flight requests. The current project was not migrated in production.

### Stuck WRITING/UNKNOWN recovery — manual incident process

1. Keep the account deletion request pending. Do not edit reservation rows, shorten a lease or acknowledge an absent object. Elapsed time is not proof that an accepted provider request cannot still write.
2. The controller/owner records an incident. Stop/terminate all potentially resumed workers and scheduled/retry processes that hold that upload; revoke/fence their upload credentials and prevent old executions from restarting. A paused HTTP response or removed public route alone is insufficient.
3. Obtain provider-side confirmation/log evidence that accepted storage requests and retries are complete, aborted or drained. Check every known request involved, not only whether the object is currently absent. If either writer fencing or provider drain cannot be established, remain blocked and escalate; do not run recovery.
4. Review legal holds and release only through the proper controller process if destruction is authorised. Recovery refuses held records. Preserve non-secret incident references for both independent confirmations.
5. Dry-run `scripts/school-recover-upload.ts --document-id DOCUMENT_UUID`. It reports ledger state only and does not change anything. Applying additionally requires `SCHOOL_UPLOAD_RECOVERY_ALLOW_WRITE=yes`, `SCHOOL_UPLOAD_WRITERS_FENCED=confirmed`, `SCHOOL_UPLOAD_PROVIDER_DRAINED=confirmed`, `--writer-fence-ref INCIDENT_REFERENCE`, `--provider-drain-ref PROVIDER_REFERENCE`, `--confirm "WRITERS FENCED AND STORAGE DRAINED"`, and `--apply`. Configured maintenance identity must be an active school owner. These attestations record a completed operating procedure; they do not technically prove a remote provider drained requests.
6. The service-only recovery RPC records the owner/evidence in audit, makes the fenced reservation terminal, queues removal, then the CLI removes the private object and acknowledges cleanup. Failed removal leaves the queue intact. Retry normal account deletion afterwards. No real recovery was executed in this build.

Regression proof: `tests/school/upload-deletion-handshake.test.ts` executes the actual HTTP POST handler, strict domain service and real disposable PostgreSQL with declared synthetic storage/auth/scanner fixtures. It pauses storage inside upload(), attempts the exact formerly failing deletion sequence, proves ACK/finalization refusal while late bytes are possible, then settles/removes/finalizes with zero orphan objects. Additional tests cover cancellation before begin, ambiguous failure plus late write, non-expiring crash state, recovery guards, revocation, retention and the successful clean-file path. This is local interleaving evidence, not verification of a live storage provider's guarantees.
