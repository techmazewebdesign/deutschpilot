# School candidate: global tracking disabled

The shared locale layout intentionally loads neither Google Tag Manager (including its no-script iframe) nor Vercel Analytics. This applies to public pages as well as authenticated school routes in this candidate. There is no environment flag to re-enable them.

Reason: a tracker executed on a public page remains able to inspect the same origin after client-side navigation into a private school workspace. Pathname-only conditional rendering would not unload already-executed code. School letters, class conversations and medical-document metadata must not enter that environment.

Verification: the browser walkthrough observes outgoing requests throughout actual public/privacy-to-school Next.js navigation, checks school HTML for tracker embeds, and requires zero GTM, Google Analytics or Vercel Insights requests. Authentication and necessary first-party application scripts remain enabled. No production deployment or tracking-account changes were performed.

Future public marketing analytics require a separately assessed deployment/consent boundary; this candidate makes no consent or certification claim.
