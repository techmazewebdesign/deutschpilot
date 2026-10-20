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
