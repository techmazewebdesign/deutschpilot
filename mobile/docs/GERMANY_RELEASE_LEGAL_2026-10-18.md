# Germany release assessment — preparation, not legal clearance

Reviewed 18 October 2026. Do not publish or enable paid access based on this memo. Earlier case documents were recovered during this audit. They establish prior classification-request and compliance-preparation work, not a located approval decision. The current user does not recall where the final correspondence was saved.

## Recovered earlier case records

- [2 September classification request draft](/Users/rooz/Documents/Codex/2026-09-01/referenced-chatgpt-conversation-this-is-an-9/outputs/deutschpilot-zfu-classification-request-2026-09-02.md).
- [2 September closure report](/Users/rooz/Documents/Codex/2026-09-01/referenced-chatgpt-conversation-this-is-an-9/outputs/compliance-closure-report-2026-09-02.md), lines 23–29, records a sent classification request and a Gmail Sent record. This historical report is not current mailbox verification or proof of authority receipt/approval.
- [14 September interim compliance checklist](/Users/rooz/Documents/Codex/2026-09-01/referenced-chatgpt-conversation-this-is-an-2/work/seo-remediation/deutschpilot/docs/FERNUSG-COMPLIANCE-CHECKLIST.md) documents German paid-enrollment restrictions and requires a decision reference before reopening.
- [14 September application pack](/Users/rooz/Documents/Codex/2026-09-01/referenced-chatgpt-conversation-this-is-an-2/work/seo-remediation/deutschpilot/docs/FERNUSG-ZFU-APPLICATION-PACK.md) explicitly says preparation, not submission or legal opinion.
- [Counsel outreach draft](/Users/rooz/Documents/Codex/2026-09-14/referenced-chatgpt-conversation-this-is-an-5/outputs/deutschpilot-fernusg-counsel-outreach-draft.md) refers to a ZFU response, but the actual response or a product-specific clearance decision has not been recovered.

Important source mismatch: the older local root checkout at `/Users/rooz/Desktop/websites/deutschpilot/app/api/checkout/create-session/route.ts` does not contain the `lib/fernusg.ts` German enrollment gate described in the recovered compliance source. Do not deploy this local web checkout or infer that production remains protected. Production checkout and its source lineage were not modified or verified in this mobile task.
## What the official sources establish

The App Store Education category is not itself the German legal test for approval. [FernUSG section 1](https://www.gesetze-im-internet.de/fernusg/__1.html) defines distance instruction by the contractual paid transfer of knowledge/skills with predominantly spatial separation and supervision of learning success. Section 1(2) also provides for expressly specified application to unpaid instruction. Whether the actual DeutschPilot offer meets these conditions needs assessment of the product and its terms.

[Section 12](https://www.gesetze-im-internet.de/fernusg/__12.html) governs approval of distance-learning courses. [Section 15](https://www.gesetze-im-internet.de/fernusg/__15.html) addresses recognition of unpaid distance courses. “No subscription payments from Germany” is therefore not sufficient evidence that every German obligation disappears; it also leaves unanswered who contracts with learners, where services are offered, whether payment is indirect/bundled, and whether teacher or AI support monitors learning success. Genuine unpaid access may change the analysis, but it is not a blanket clearance.

The [BGH decision of 12 June 2025, III ZR 109/24](https://juris.bundesgerichtshof.de/cgi-bin/rechtsprechung/document.py?Art=en&Blank=1.pdf&Datum=Aktuell&Gericht=bgh&Seite=4&Sort=4096&anz=1092&nr=142531&pos=125) confirms that predominantly asynchronous teaching can meet the separation requirement and that FernUSG is not restricted to consumers. A business customer or foreign operator must not be treated as an automatic exemption. The [ZFU's official FAQ](https://zfu.de/veranstaltende/faq) describes the course documentation, materials, assessments, contract terms and operator information used in the approval process.

Apple separately requires compliance with laws where the app is available, accurate metadata, a privacy policy, review access and functioning services. Its social-login, digital-purchase and account-deletion requirements also apply. See [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) and [account deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/).

## Product facts from the local source

- Native bundle identifier: `de.deutschpilot.app`. The website imprint names PLUCO GROUP SP. Z O.O. in Warsaw; that source statement does not verify current registry details, Apple seller identity, or the contracting entity.
- The mobile learning experience works without an account and contains locally bundled material and automated self-tests.
- Firebase is used for optional identity. The current account-deletion client calls the web backend; no destructive live test was conducted.
- Native progress is device-local. Web progress and native progress are not synchronized.
- This upgrade adds no native purchasing interface. It does not change website billing, provider configuration, production availability or territorial settings.
- The web source exposes broader teacher, live-class, AI, exam, certificate, community and subscription surfaces. Their presence in source is not evidence of lawful delivery, official recognition, live availability, or suitability for native release.

## Evidence needed to close the Germany gate

1. Retrieve the earlier legal/ZFU correspondence, exact entity, product version, business model, conditions, territorial scope and outcome. Match those facts against this candidate.
2. Document separately: free native self-study; existing paid web access; teacher feedback/live classes; AI assessment; certificates/exam claims; institutional licensing. A prior result for one model may not cover another.
3. Obtain a qualified product-specific assessment or relevant authority determination covering the actual release configuration. Do not describe the app as verified, licensed, approved or legally cleared without the actual evidence.
4. Reconcile operator identity, terms, cancellation/withdrawal disclosures where applicable, GDPR/controller/processor disclosures, retention, cross-border services and minors handling.
5. Select App Store territories and commercial availability only after that evidence is reviewed. No country exclusions or price settings were changed during this work.

## Stop boundary

Local engineering and release preparation may continue. No Apple submission, external upload, production deployment, paid agreement, authority filing, purchase or user-facing legal claim is authorized by this memo. The release gate remains pending.
