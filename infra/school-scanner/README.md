# School scanner hosting preparation

Source preparation only: no host, DNS, TLS account, processor agreement, deployment, active monitoring or provider acceptance is established. Use a separately approved EU host and responsible operator. No real documents are needed for commissioning. Independent review remains unresolved; this package is not approval to release.

## Architecture and sizing

Only Caddy TCP 443 is published. ClamAV 3310 and adapter 3311 have no host mappings. The adapter joins only an internal Compose network; ClamAV additionally has an outbound network for signature updates, and Caddy an outbound network for certificate renewal. Firewall the host accordingly; never add scanner/ClamAV ports or mount the Docker socket. Caddy forwards only POST `/scan`, limits bodies to 10MB and keeps access logging disabled. Do not enable request/header/body debug logging.

Start capacity planning at **2 vCPU, 8 GiB RAM and 20 GiB SSD** for a dedicated pilot host; these are engineering allowances requiring workload/load testing, not measured throughput guarantees. ClamAV's documentation lists 3 GiB minimum and 4 GiB preferred RAM, with additional reload/update pressure. This Compose file limits ClamAV to 4 GiB, adapter and proxy to 256 MiB each. Monitor peak memory during database reloads and adjust reviewed resources before load increases. Persistent volumes contain signature databases and Caddy certificate/account data; reserve disk headroom, encrypt host storage, restrict operator access and configure bounded backup/retention for certificate state. Document bytes are streamed to ClamAV, not persisted by this adapter; external swap/crash dumps/log collection must also be controlled.

Official sources checked 20 October 2026:

- [ClamAV Docker and memory requirements](https://docs.clamav.net/manual/Installing/Docker.html).
- [ClamAV configuration and FreshClam daemon](https://docs.clamav.net/manual/Usage/Configuration.html).
- [Caddy Compose operation and persistent data](https://caddyserver.com/docs/running#docker-compose).
- [Caddy automatic HTTPS requirements](https://caddyserver.com/docs/automatic-https).
- [Caddy ACME challenge configuration](https://caddyserver.com/docs/caddyfile/directives/tls#issuers): HTTP challenge is disabled; the operator must route public TCP443 to this host for TLS-ALPN issuance and renewal. Port80 is deliberately unpublished.
- [Compose file secrets](https://docs.docker.com/compose/how-tos/use-secrets/): mounted files are not a secret vault; protect the source file and host.
- [Node TypeScript support](https://nodejs.org/api/typescript.html): this image uses Node24's built-in type stripping during compilation, without npm installation; it does not perform TypeScript type checking.

## Operator decisions before any activation

Record the target EU region/provider, contracting entity, processor/subprocessor terms and transfer assessment, security/update/incident ownership, monitored contact, controlled DNS name, TLS issuer/account approval, backup policy and host cost. Approve actual controller data/retention policy separately. Do not choose arbitrary school policies or automatically accept provider terms. Confirm a supported Docker Compose version and compatible architecture. Resolve independent acceptance through the authorised process.

Choose reviewed immutable image digests for ClamAV, Node24 and Caddy2. `operator.env.example` contains mutable demonstration tags only; it is not an approved image inventory. Record pulled image IDs/digests, vulnerability/update review and rollback versions. Rebuild after source/image updates; don't use an unattended image-updater that changes the scanner protocol or loses certificate state.

## Reviewable manual commissioning steps

These are instructions, not an installer; substitute approved paths, target and operator first. Do not run against the existing n8n service.

1. Place a dedicated source copy at `/opt/school-module`. Keep `.env`, credentials and real records outside it. The Dockerfile-specific ignore file sends only the two scanner source modules and runtime wrappers as build context.
2. Create an operator-owned `/etc/school-scanner` configuration directory and external secret file. Generate at least 32 random bytes using an approved secret manager or `openssl rand -hex 32 > /etc/school-scanner/secrets/scanner-token`; use restrictive ownership/mode (0400/0440 with a dedicated group). The nonroot Node UID1000 must be able to read the mounted file; test the host bind-mount permissions without printing it. Do not solve permission errors using public/world-readable production secrets. Configure the same token in Vercel's **server-only** `SCHOOL_SCANNER_TOKEN` after separate deployment approval; never `NEXT_PUBLIC_*`.
3. Copy the example operator file outside Git, set the explicit DNS/contact/image digests and absolute `SCANNER_TOKEN_FILE`. Keep secrets themselves out of this file. From the source root, validate without provisioning:

   ```sh
   docker compose --env-file /etc/school-scanner/operator.env -f infra/school-scanner/compose.yaml config --quiet
   docker compose --env-file /etc/school-scanner/operator.env -f infra/school-scanner/compose.yaml build adapter
   ```

4. After host/provider/TLS and activation approval, the operator may run `docker compose --env-file /etc/school-scanner/operator.env -f infra/school-scanner/compose.yaml up -d`. This starts FreshClam and may obtain TLS certificates; it is an external action requiring the decisions above. First startup can take minutes. A healthy container alone is not proof of remote TLS reachability or scanning.
5. Set the app's server-only `SCHOOL_SCANNER_URL=https://APPROVED-SCANNER-DNS/scan`, matching token, and a signature age limit at most72h. Existing uploads remain quarantined on scanner outage/rejection; no unscanned file may become clean. Verify app/processor/policy settings before enabling document collection.
6. With **synthetic** files, verify correct token+SHA256 clean PDF200/clean, wrong token403, bad hash400, EICAR200/rejected, stopped ClamAV503, and an old/future/invalid signature timestamp503. Preserve status/hash/verdict evidence only, never secret headers or document bodies. Verify TLS hostname/chain using normal verification; do not use `curl -k` for acceptance. Check only proxy443 is published and external3310/3311 are unreachable. Confirm actual browser upload/quarantine/scan/download and hold/deletion workflows separately.

## Health, failures and monitoring

The adapter healthcheck performs an authenticated synthetic byte/hash scan every60s. It includes ClamAV VERSION freshness validation; cache is at most30s. Missing/stale (>72h), future or invalid signatures, malformed replies, scanner timeout, or outage fail closed. ClamAV's own process probe does not prove freshness. Monitor adapter health/restarts/503 rate, ClamAV memory/OOM, FreshClam successful updates/signature age, disk space, certificate validity/renewal and end-to-end HTTPS probes. Alert the named operator when updates stop (suggested early-warning age24h, before the72h rejection boundary), or health becomes unhealthy. Docker does not automatically repair an unhealthy running process merely because a healthcheck fails. There is no configured external alert destination in this package.

On failure, disable collection as appropriate, preserve quarantine/ledger state and investigate signatures, network/time, resource limits and logs without content disclosure. Do not mark files clean manually, raise the freshness bound above72h, erase unknown upload reservations or run blanket cleanup. Follow `scripts/school-README.md` for fenced writer/provider-drain recovery. Credential rotation/redeploy must account for in-flight writers. Back up reviewed configuration/certificate state; signature databases can be reloaded from the trusted updater. Never use `down --volumes` on an activated service as a generic repair command.
