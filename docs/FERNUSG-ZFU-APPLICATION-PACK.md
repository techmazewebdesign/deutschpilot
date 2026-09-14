# DeutschPilot FernUSG/ZFU application pack

Date: 2026-09-14
Status: preparation complete; not a legal opinion or an application submission.

## Submission summary for counsel/ZFU

DeutschPilot is operated by PLUCO GROUP SP. Z O.O. and offers German-language learning content online. The current product includes structured A1–C1 themed rooms, asynchronous lessons and learning materials, exercises, checkpoint quizzes with progression rules, learner progress records, AI-supported feedback, optional live classes, and platform completion records. The product is marketed in German and English at `www.deutschpilot.de`.

New paid enrollment for Germany is paused in production pending classification. Existing access and free practice remain available. The current source evidence indicates that the paid all-access offering may satisfy each FernUSG element identified in the ZFU response; counsel/ZFU must determine the legal classification and the correct course of action.

## Product evidence index

| Subject | Evidence |
|---|---|
| Contract and provider | `app/[locale]/terms/page.tsx`, `messages/de.json` `terms`, `app/[locale]/impressum/page.tsx` |
| Paid all-access checkout | `app/api/checkout/create-session/route.ts`, `lib/stripe.ts`, `components/subscription/subscription-card.tsx` |
| Course and lesson structure | `app/[locale]/rooms`, `app/[locale]/lessons`, `app/[locale]/courses`, `supabase/schema-courses.sql` |
| Asynchronous learning materials | `supabase/seed-*.sql`, `app/[locale]/exercises`, `app/[locale]/rooms` |
| AI feedback/Q&A | `app/[locale]/ai-trainer`, `app/api/ai-trainer/route.ts`, `lib/aiTrainer/provider.ts` |
| Tests and progress control | `components/learn/quiz.tsx`, `components/learn/room-quiz.tsx`, `components/learn/mark-complete-button.tsx`, `lib/learningRooms.ts` |
| Certificates | `app/[locale]/certificates/page.tsx`, `components/sections/certificate.tsx` |
| Live classes | `app/[locale]/classes`, `app/api/classes/enroll/route.ts`, `app/api/teacher/classes` |
| German market targeting | `messages/de.json`, `/de` routes, public domain and marketing copy |
| Interim German enrollment hold | `lib/fernusg.ts`, `app/api/checkout/create-session/route.ts` |

## Questions for qualified German counsel/ZFU

1. Does the current paid all-access offer constitute a Fernlehrgang requiring ZFU approval under FernUSG?
2. Are AI Trainer feedback, progression gates, platform completion records, and optional live classes one offer or separate regulated offers?
3. Does the location of a participant in Germany make the English-language flow subject to the same treatment?
4. What contract, withdrawal, information and marketing requirements apply while approval is pending?
5. What action is required for existing Germany-based paid customers and any historic contracts?
6. Which wording is permitted for GER alignment, mock exams, platform records and live teaching?

## Attachments to assemble before submission

- Current AGB, privacy notice, imprint and withdrawal information.
- Full pricing catalogue and screenshots of every checkout/payment path.
- Curriculum overview for A1–C1, learning objectives and sample materials.
- Screenshots/video of lessons, quiz pass thresholds, unlocking, feedback, progress and certificate flow.
- AI Trainer system description, limitations, support/escalation process and data handling.
- Live-class programme, teacher roles/qualifications, booking/enrolment and support terms.
- German and English landing pages, ads, emails and certificate templates.
- Corporate registration/provider details for PLUCO GROUP SP. Z O.O.
- Existing-customer register aggregated by country, status, date, product and contract terms; exclude unnecessary personal data from the initial package.

## Reopening control

Do not set the two production reopening variables until the decision is documented here or in a linked counsel/ZFU record:

1. `DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_ALLOWED=true`
2. `DEUTSCHPILOT_GERMAN_PAID_ENROLLMENT_APPROVAL_REFERENCE=<decision reference>`

Record the decision date, decision maker, exact approved offering/configuration, scope, conditions, review date and owner.

## Payment-channel audit status

The application source has one active checkout route: `/api/checkout/create-session`. It is protected. `createLevelCheckoutSession` and `createAITrainerCheckoutSession` are dormant helpers with no current route caller. A Stripe Dashboard review is still required for active Payment Links, direct payment links, subscriptions and customer records because production Stripe secrets are not available in this workspace and no Stripe dashboard connection is present.
