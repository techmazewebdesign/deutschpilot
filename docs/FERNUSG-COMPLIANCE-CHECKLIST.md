# DeutschPilot FernUSG/ZFU interim checklist

Assessment date: 2026-09-14. This is an engineering risk assessment, not legal advice. The supplied ZFU response and qualified German counsel remain authoritative for the legal classification.

## Current product inventory

| ZFU criterion | Evidence in the codebase | Assessment |
|---|---|---|
| Contract | Registration, AGB/terms page, Stripe Checkout terms consent, subscription metadata | Present |
| Payment | €15/month All-Access Stripe subscription | Present |
| Knowledge/skills | A1–C1 rooms, lessons, listening/reading/speaking/writing exercises, media and exam preparation | Present |
| Remote/self-directed learning | Authenticated dashboard, asynchronous lessons/materials, self-study exercises and quizzes | Present; likely |
| Progress control | `student_progress`, room/task progress, checkpoint pass thresholds and unlock sequencing | Present |
| Feedback/Q&A | AI Trainer, AI writing feedback, questions/contact and live classes | Present or advertised |
| Certificate claims | Certificate pages and completion-based GER-level claims | Present; wording needs review |
| German targeting | `/de` routes, German translations, German pricing/AGB/marketing, `deutschpilot.de` | Present |

## Interim control

- New paid checkout requests from the German flow and requests carrying Vercel's Germany country signal are rejected server-side with HTTP 451. This prevents an English-language bypass for users located in Germany.
- The subscription card and paid-course upgrade wall disable German purchase actions and show the same notice.
- The control is fail-closed by default. Reopening requires both `DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_ALLOWED=true` and a non-empty `DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_APPROVAL_REFERENCE` after documented ZFU approval or qualified legal review.
- Existing subscriptions, entitlements, learning progress, certificates, free A1 content, AI preview behavior, and English operations are preserved.
- Learning functionality was not deleted or renamed; its regulated-learning characteristics are documented here.

## Before reopening

- Obtain written classification from German counsel and/or submit the relevant offer to ZFU.
- Prepare provider identity, full catalogue, objectives/curriculum, sample lessons/materials/videos, support model, assessment/feedback/progress/certificate rules, pricing, AGB, withdrawal information, checkout screens, German marketing and technical flow.
- Decide whether the current path is one Fernlehrgang or multiple offerings, including AI Trainer and live-class bundles.
- Review B2C/B2B scope, German targeting, legal entity, teacher arrangements, content rights, data processing, accessibility and consumer terms.
- Qualify or remove unsupported “offizielles”, “anerkanntes”, exam-format and GER-certificate claims only after counsel review.
- Record the approval/review reference, approved configuration, effective date and owner before changing the environment flag.

## Remaining legal decisions

1. Seek ZFU approval for the current path or redesign the paid offer with counsel.
2. Decide whether AI Trainer, certificates, teacher feedback and live classes form one regulated offer or separate offers.
3. Confirm legally supportable German marketing and certificate wording.
4. Determine treatment of existing German paid users and contractual/refund obligations; no automated cancellation or data deletion was performed.
