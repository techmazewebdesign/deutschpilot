# Local preparation checks — 20 October 2026

No deployment, provider purchase, active scheduler, legal acceptance or independent approval is established. The isolated Compose project was `school-scanner-smoke-20261020`; existing n8n was not inspected or modified. Local Docker reported ~8GiB available. Cached ClamAV image was amd64 under arm64 emulation; target architecture must be selected and tested separately.

Actual checks:

- `docker compose ... config --quiet`: passed with synthetic external secret and temporary localhost-only override.
- Adapter image built from restricted Docker context using Node24 type stripping; no npm/root dependency changes. Caddy's real `caddy validate --config /etc/caddy/Caddyfile` passed against the production Caddyfile with synthetic domain and network disabled.
- Compose started the real ClamAV image, adapter and Caddy. Adapter health was `healthy`. Only proxy443 was published, mapped to `127.0.0.1:18443` for this test; adapter/ClamAV had no published ports.
- Local override used Caddy's internal CA. Node's HTTPS client explicitly trusted only the copied **public** local CA certificate and verified hostname/chain. No `rejectUnauthorized:false` or `curl -k` was used. This does not verify public DNS, ACME account/issuance, external firewall or production TLS.
- HTTPS missing token403, mismatched SHA256400, other path404, synthetic PDF200/clean and EICAR200/rejected all passed. Stopping only the dedicated ClamAV test container produced HTTPS503. Secret headers/bodies were not written to evidence.
- `tsx --test tests/school/scanner-*.test.ts`: **10 passed**, including actual spawned loopback adapter stale/future/invalid-signature503 without INSTREAM, auth/hash rejection before clamd, and actual scheduler-handler authorization/policy/no-push branches.
- `node --test infra/school-jobs/run.test.mjs`: **6 passed**; disabled/dry-run/no-push defaults, explicit execution/provider approval, HTTPS origin, redirect/auth/HTML/policy failures and server-only automation header behavior. Transport was synthetic; no protected preview, provider or real school was called. No systemd unit/timer was installed or enabled.
- Root `tsc --noEmit --incremental false` passed; root school test batch **38 passed, 24 explicit database skips** (no disposable PostgreSQL was started for this infrastructure-only wave); source packager self-test/check passed. Outputs are recorded in `/tmp/school-infra-tsc.txt`, `/tmp/school-infra-all-tests.txt` and `/tmp/school-infra-package-check.txt`. No archive is generated in check mode. Exact Compose/HTTP outputs are `/tmp/school-compose-up.txt`, `/tmp/school-compose-http-results.txt`, and `/tmp/school-caddy-validate.txt`.

The local package topology and control paths are tested. Required hosted scanner, operator monitoring/alerts, processor/region/legal policy approval, immutable image review, public TLS/firewall acceptance, deployed route version, protected-target scheduler credential and actual scheduling/delivery remain separate commissioning gates. Do not label cron active or scanning production-approved from this evidence.

The dedicated smoke containers, networks and three test volumes were removed with Compose scoped to the exact project created above. Its temporary synthetic token was deleted. Final `docker ps` showed only the pre-existing n8n container. No user container or credential was inspected/modified.
