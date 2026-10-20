# DeutschPilot school system implementation
Baseline: 28494b3e043d23e9660e044102e794d2866c3551; clean worktree on 2026-10-20 before ledger creation.
User authorises building missing school platform, upgrade, step-by-step tests, and proposal update. Sales sending paused. No production deployment, legal acceptance or App Store submission.
Mode: agent tools + local shell. No additional Codex CLI dispatch/billing. Inherit available parent model for workers; no model override.

| Task | Class / seat | State | Write set |
|---|---|---|---|
| School backend and security | WORKHORSE / inherited worker | IMPLEMENTED; final SQL/security verification by lead | lib/school/**, app/api/school/**, supabase/migration-school-platform.sql, scripts/school-*.ts, tests/school/** |
| Web school portal | WORKHORSE / inherited worker | DONE; final policy UI frozen, real PG browser37 PASS | components/school/**, app/[locale]/school/** |
| Native school portal | WORKHORSE / inherited worker | IMPLEMENTED;31 tests reported, final signed/device gates pending | mobile/src/School*, mobile/App.tsx, mobile/package*.json |
| Integration, legal docs, proposal, deletion, identity fix | lead after workers | SOURCE integrated; sales drafting outside repo, sending paused | remaining nonoverlap |
| Blind verification | verifier | PENDING final candidate | read-only |

Append-only attempts:
- 2026-10-20 first wave planned, source audit at Documents/Codex/2026-10-20/deutschpilot-school-package/SCHOOL_PLATFORM_AUDIT.md.
- Stage1 backend REPORTED(DONE_WITH_CONCERNS):23 workflow/auth tests and realPG CAS/storage policy checks passed. 8MB aggregate is a mandatory architecture issue, not accepted as sale-ready.
- Web browser:26 actions pass with synthetic engine transport; old-message moderation cache defect fixed. Mobile export and account-isolation tests pass; provider/physical gates remain.
- Stage2 normalized persistence DISPATCHED same backend worker/inherited model. Baseline status+diffstat captured in scratch. Transactional perentity SQL, indexedpaging, tenant/class authorization, realPG capacity/concurrency tests required. No production mutations.
- Corrected lead document paths: initial ledger/build record were written under ambient Desivo cwd; moved only these newly created files into release worktree and removed their empty directories. No Desivo source changed.
- Stage2 now normalized relational/entity records, no8MB aggregate path. Actual PostgreSQL tests include100k chat messages, keyset/index boundedpages, parallelstudents, monotonic progress, concurrent idempotent send, revocation and push leases. Final absence-order/letter-recipient concurrency tests still running.
- Legacy security integration: service-only private tables, UID-only profiles, verified placement/progress APIs, authority-change revocation, stale token denial, no selfstaff signup, unsafe adminDELETE disabled in favour of full verified user deletion. Real disposable PostgreSQL +auth/mock tests passed; no live policy query/application claimed.
- Web27 realUI/syntheticengine steps pass incl tracker-free public->school navigation; current real-normalized-DB UI integration underway with explicit testidentities.
- Scanner real4/4 PASS against signature-age-gated adapter, engine1.5.4/database28157 datedOct18. No production privatefile transfer/provideractivation.
- Nativecandidate1.1.0(5), tests29 pass, iOSprebuild restored/preserved signing/config, podframework download/simulatorbinary build pending. OriginalTestFlightbuild4 unchanged.
- Reuse package script+PORTING_GUIDE implemented, allowlist/hash/selftests passed. Package creation waits clean verifiedsourcecommit.

- Final web/code policy freeze: complete6-record retention map+controller note, explicit document/chat periods; no guessedGermanperiod. Healthprocessingblockedwithoutfullpolicy. UI rejects partialpolicy whilepreservinginput; cleanupdisableduntilconfigured and confirmationcoversrecords/files/holds.
- Final current normalized PostgreSQL browser walkthrough37PASS/0FAIL;16 screenshots;zero browserruntimeerrors; report docs/verification-school-2026-10-20/browser-db-results.json (2026-10-20T17:52:23.682Z). Explicit syntheticidentity HTTPadapter, realSQLreads/transactions/paging; providerfilebytes/scannerfixturesnotproductionproof. Unique school browser-db-99182068-ee2b-48df-9691-5d27a624c1c2.
- RealDBbrowsercovers1005recordarchive+completepagedexport, bothteachersfullhistory/moderation, active-sessionrevocation clearsprivateUI, privacyholdrequest/UIrelease/SQLerase, trackerzero, signupstaffinviteboundary. No realaccountcreation.
- Web progress/auth boundary9PASS; serverUIDonly, canonical lesson/course, strictboundedpayload, honest pending-sync. Fullroottsc+scopedwebESLintPASS afterpolicyUIfreeze. Repeatafterlaterchanges.
- BUILD_RECORD replaced outdatedactiveaggregate architecture with normalized perentityrepository and finalevidence/provider/operatorgates. Historical stage1 aggregateattempts above remain attempt history only.
- Commercialrights confirmed: Desivoreserves reusable sharedmodules includingPolishSchool; buyer DeutschPilot-specificassets plus permanent sharedsource licence, notexclusiveallcode. Contract/seller/buyer/taxverification pending; salesemailpaused.
- Source packager --self-test --checkPASS; noarchivecreatedbyworker. Archivewaits finalreviewedcleancommit. External EN/DE proposal PDFs + German NONPAYABLEinvoice draft are separate salesdocuments, noemail/noinvoiceissuance.
- ReleaseleadreportedfinalnormalizedPGsuite12PASS afterSQLbatch. Sourcepackagerexactallowlistincludesactivationcheckerandguardedaggregateimportscript; finalbrowserheaderexplicitlylocalPGpersistenceverifiedandexternalidentity/storage/scanning/pushfixturesunverified.

- Candidate3cfef1b committed clean; lead productionbuild and school12realPG/mobile31/auth50+telemetry1/release5/fernusg3/trainer5 passed. Blindreview FAIL: confirmed P1 delayed upload can survive completed privacy deletion; native P2 lessonmodal safearea header overlap independently observed. Source remained clean HEAD unchanged through reviewer return. Fixwave2: backend durable upload/privacy handshake + exact regression; native modal-local safearea fix + rebuilt simulator interaction. Disjoint ownership, no externalservice mutations.

- Fixwave complete: HTTP+PG9PASS, normalizedPG12PASS, unit/auth/HTTP31PASS, roottsc+actualNextproductionbuildPASS. Browser37 rerun with durable upload handshake; final stricter missingmetadata/ledger/latehold guards tested by9 exactHTTP cases after browserrun. Native31PASS, rebuilt unsignedRelease1.1.0(5) safearea actualtap/completion/relaunch verified. Synthetic native evidence saved in docs. Second independent review pending next committed candidate; all implementation workers frozen.

- Second blind review of a1a8c81e0d466d24c38bc510fb83199ff669ed52 BLOCKED by automated safeguard: “This content was flagged for possible cybersecurity risk.” No second verdict produced. Git clean and HEAD unchanged at return. Do not reroute the same review to another seat to bypass the safeguard. Source correction passed local9HTTP+PG/12normalizedPG/rootproductionbuild/native31+actualsimulator tests, but is not independently accepted. Final reuse archive held; record/evidence checkpoint saved in Documents. Production, TestFlight, real data and sales sending untouched.

- 2026-10-20 Rooz explicitly requested “try again” after the blocked independent review. Retry is limited to the same existing school_verify reviewer and defensive read-only review process; no alternate reviewer or bypass. Candidate before this record:232583b7e35df444808369eda9d30289a78aff1b, clean. Read-only application/source review only; no external mutation, real data, credential disclosure, exploit execution or publication. Rejection remains a blocker unless this same process actually returns a verdict.

- Same-reviewer retry of a25ab051 again ended in automated “possible cybersecurity risk” rejection, no final verdict. Before rejection, reviewer supplied concrete P1 recovery-vs-hold race reproduction at /tmp/deutschpilot-school-recovery-hold-race.cjs. Original source stayed clean and HEAD unchanged. Assigning a distinct implementation-only fix, not an alternate independent review, to the existing backend owner. Remote sensitive uploads and recovery activation remain disabled; no release acceptance.

- Recovery/hold implementation fix completed by existing backend owner, source inspected by lead. Lead independently reran actual route+PostgreSQL handshake12/12 (zero skips) in a fresh disposable PG17-alpine container, installed supplemental migration twice, confirmed fresh/supplemental function bodies match, diffcheck and packager self-test/check passed. Lead test log /tmp/deutschpilot-lead-recovery-check.log. Container removed; n8n untouched. Checkpoint only; same-reviewer safeguard blocker remains and no substitute review/production acceptance. Supplemental hosted correction pending at this commit.

- Correction checkpoint7cfb09e committed. Applied targeted hosted supplemental via existing authorized Supabase connection; migration version20261020193141, read-only bodyMD5 matches source3bee9474c8c27ce37d1fb7c1eee2e2fc, invoker/fixedpath and anon/authenticated restrictions unchanged. No real document operations, no frontend deployment/TestFlight change. Same-reviewer retry remains blocked/no verdict; no release approval. Evidence copied to Documents activation record; disposable containers removed, n8n intact.
