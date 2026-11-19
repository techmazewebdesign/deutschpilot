# German audio integration

Status: preparatory playback code deployed inactive on 19 November 2026 at the owner's request. Google billing, credentials and real audio verification remain pending; this is not an active native-voice feature.

Approved German recordings are generated offline and stored as immutable MP3 files in public/audio/de. Students replay the saved files without making a Google generation request. No provider key or speech-generation endpoint is exposed to browsers. Missing catalogue entries show no playback control.

Vocabulary words, example sentences and speaking model answers use the shared GermanAudio player. Controls offer normal and 0.75 playback speed. Audio is labelled as AI-generated. Existing mock-exam audio is unchanged.

Run tests: npx tsx --test tests/german-audio.test.ts
Run dry trial: npx tsx scripts/generate-german-audio.ts --source scripts/german-voice-samples.json
Generate after Google setup: set GOOGLE_CLOUD_PROJECT=deutschpilot-be999 and supply GOOGLE_TTS_ACCESS_TOKEN or GOOGLE_TTS_API_KEY through the local shell environment. Add --generate to the dry-trial command. Never commit credentials.

The generator selects available German WaveNet male/female voices, deduplicates approved text, caches by exact synthesis request and publishes the manifest only after all recordings exist. Its local 8000-character ledger is conservative and counts attempted requests before sending. It is not an account-wide Google billing cap; other projects and tools can consume the shared free allowance. Do not run concurrent generators in one checkout.

Before release: complete the provider setup, generate actual course vocabulary and approved conversation text, listen to recordings for native pronunciation and intonation, verify slow playback and navigation in the browser, run type checking and production build, then deploy. No pronunciation scoring or live voice conversation is included in this initial playback change.

## Verification on 19 November 2026

Six catalogue and generator tests pass. TypeScript, changed-file ESLint, whitespace checks and the Next.js production build pass. The build reports missing Firebase environment configuration in this checkout; authenticated browser behavior must still be checked with the deployed runtime configuration. Google returned a Billing required dialog when activation was attempted for deutschpilot-be999. No real audio has been generated. The owner subsequently authorized deploying the preparatory code while leaving Google billing disabled.

## Inactive production deployment

Deployed commit 7880759 to https://www.deutschpilot.de using Vercel deployment dpl_3URLqabaBPJPLQsMdEVNz4SGKUrv. The cloud production build passed. The staged sign-in page rendered without browser errors. After promotion, the live home page, sign-in page and empty audio catalogue returned HTTP 200; unauthenticated vocabulary access redirected to sign-in. The live audio manifest contains no recordings, so playback controls stay hidden. No Google billing setup or generation request was performed.
