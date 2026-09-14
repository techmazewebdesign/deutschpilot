# DeutschPilot school-sale readiness

Status: internal sale-readiness checklist. This is not legal advice and does not establish FernUSG/ZFU compliance.

## Live state to preserve before and during a sale

- Keep the Germany paid-enrollment server hold active. It requires both an explicit production enablement flag and an approval reference to reopen.
- Do not reintroduce direct Germany checkout, Stripe Payment Links or payment buttons outside the protected API route.
- Do not describe platform records as official, state-recognised or ZFU-approved certificates.
- Do not claim guaranteed CEFR levels, exam outcomes, learning speed, jobs, visas, revenue, customers or retention without audited evidence.
- Preserve existing learner records and contracts. Do not cancel subscriptions, delete data, or change entitlements solely because of a potential sale.

## Intended buyer model to validate with counsel

The preferred buyer model is an asset sale or software/content licence where a school operates the learning programme in its own name, enrols its own learners, assigns accounts from its own roster, and carries responsibility for contracts, teaching, support, assessment and certificates.

The legal classification follows the actual service, not the label. A school buyer, B2B invoice or change of branding does not itself decide FernUSG/ZFU scope.

## Seller due-diligence checklist

### Product and technical

- [ ] Demo each learner, teacher and administrator workflow.
- [ ] Export an exact source/deployment/version inventory.
- [ ] Document hosting, domains, environment ownership, authentication, database and AI-provider dependencies.
- [ ] List all third-party licences and content-rights evidence.
- [ ] Identify every public registration, checkout and payment path, including Stripe Dashboard Payment Links.

### Contracts and customers

- [ ] Gather current terms, privacy notice, imprint, withdrawal information and checkout screenshots.
- [ ] Audit Stripe using authorised access; do not expose or copy secret keys into the data room.
- [ ] Create a privacy-minimised register of existing contracts, refunds, chargebacks and subscription status.
- [ ] Have counsel allocate historic and post-closing customer obligations explicitly in the sale agreement.

### Regulatory and claims

- [ ] Give the buyer `FERNUSG-COMPLIANCE-CHECKLIST.md` and `FERNUSG-ZFU-APPLICATION-PACK.md`.
- [ ] Obtain the buyer's intended operating model in writing.
- [ ] Require qualified German counsel review before the buyer enables paid German learner enrolment.
- [ ] Preserve the German hold through closing unless a documented decision authorises an exact configuration.

## Prohibited sale representations

- No promise of ZFU approval, FernUSG exemption, recognised credentials or guaranteed educational outcomes.
- No unverified commercial metric or claim of existing German customer volume.
- No assertion that contractual allocation eliminates regulatory responsibility.

## Required transaction-agreement topics

1. Transaction perimeter: assets, IP, domains, source code, vendor accounts, content, data and exclusions.
2. Conditions precedent: legal review, data-protection assessment and payment/customer reconciliation.
3. Historic versus future contracts, refunds, chargebacks, tax and support responsibility.
4. Migration/cutover, access control, security, records retention and incident response.
5. Buyer covenant to retain the German paid-enrollment hold pending its documented legal clearance.
6. Claim-control: no unsupported certificate, exam, CEFR or outcome marketing.

## Exit condition for this checklist

The sale is operationally ready only when the buyer has completed due diligence, the agreement has been reviewed by qualified counsel, the transfer perimeter and customer treatment are documented, and no German paid enrollment has been reopened without recorded clearance.
