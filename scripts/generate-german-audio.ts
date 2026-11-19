import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { resolve, join } from "node:path";
import { normalizeGermanText, parseGermanAudioManifest, type GermanAudioEntry, type GermanSpeaker } from "../lib/german-audio";

async function main() {
  const args = process.argv.slice(2);
  const option = (name: string) => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1]; };
  const source = option("--source");
  if (!source) throw new Error("Supply --source with an approved German text JSON file.");
  const raw: unknown = JSON.parse(await readFile(resolve(source), "utf8"));
  if (!Array.isArray(raw) || !raw.length) throw new Error("Source must be a nonempty array.");
  const seen = new Set<string>();
  const samples: { text: string; speaker: GermanSpeaker }[] = [];
  for (const item of raw) {
    if (!item || typeof item.text !== "string" || !normalizeGermanText(item.text)
      || Buffer.byteLength(item.text, "utf8") > 4000
      || (item.speaker !== undefined && item.speaker !== "female" && item.speaker !== "male")) {
      throw new Error("Invalid source entry. Use German text, at most 4000 UTF-8 bytes, and female/male speaker.");
    }
    const text = normalizeGermanText(item.text);
    const speaker = item.speaker ?? "female";
    const key = JSON.stringify([text, speaker]);
    if (!seen.has(key)) { seen.add(key); samples.push({ text, speaker }); }
  }
  const characters = samples.reduce((total, sample) => total + Array.from(sample.text).length, 0);
  const limit = 8000;
  if (characters > limit) throw new Error("Source exceeds the 8000-character trial limit.");
  console.log(JSON.stringify({ mode: args.includes("--generate") ? "generate" : "dry-run", entries: samples.length, characters, trialLimit: limit }));
  if (!args.includes("--generate")) return;

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project || !/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(project)) throw new Error("Set the confirmed GOOGLE_CLOUD_PROJECT.");
  const headers: Record<string, string> = { "Content-Type": "application/json", "x-goog-user-project": project };
  if (process.env.GOOGLE_TTS_API_KEY) headers["x-goog-api-key"] = process.env.GOOGLE_TTS_API_KEY;
  else {
    let token = process.env.GOOGLE_TTS_ACCESS_TOKEN;
    if (!token) {
      try { token = execFileSync("gcloud", ["auth", "print-access-token"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
      catch { throw new Error("Google speech authentication is not configured. No audio generated."); }
    }
    headers.Authorization = "Bearer " + token;
  }
  async function google(path: string, body?: unknown): Promise<any> {
    const response = await fetch("https://texttospeech.googleapis.com/v1/" + path, {
      method: body ? "POST" : "GET", headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) throw new Error("Google TTS HTTP " + response.status + ". Check billing, API activation and credentials. No automatic retry.");
    return response.json();
  }
  const listed = await google("voices?languageCode=de-DE");
  if (!Array.isArray(listed.voices)) throw new Error("Invalid voice list.");
  const chosen: Record<string, string> = {};
  for (const speaker of Array.from(new Set(samples.map(sample => sample.speaker)))) {
    const gender = speaker === "female" ? "FEMALE" : "MALE";
    const voice = listed.voices.filter((v: any) => typeof v.name === "string" && /^de-DE-Wavenet-[A-Z]+$/.test(v.name) && v.ssmlGender === gender)
      .sort((a: any, b: any) => a.name.localeCompare(b.name))[0];
    if (!voice) throw new Error("No suitable German WaveNet voice. No speech generated.");
    chosen[speaker] = voice.name;
  }
  const output = resolve("public/audio/de");
  await mkdir(output, { recursive: true });
  const manifestFile = join(output, "manifest.json");
  let manifest = { version: 1 as const, entries: [] as GermanAudioEntry[] };
  try { manifest = parseGermanAudioManifest(JSON.parse(await readFile(manifestFile, "utf8"))); }
  catch (error: any) { if (error.code !== "ENOENT") throw error; }
  const ledgerFile = resolve(".german-voice-trial-usage.json");
  let attemptedCharacters = 0;
  try { attemptedCharacters = JSON.parse(await readFile(ledgerFile, "utf8")).attemptedCharacters; }
  catch (error: any) { if (error.code !== "ENOENT") throw error; }
  if (!Number.isSafeInteger(attemptedCharacters) || attemptedCharacters < 0) throw new Error("Invalid local usage ledger.");
  for (const sample of samples) {
    const voice = chosen[sample.speaker];
    const request = { input: { text: sample.text }, voice: { languageCode: "de-DE", name: voice }, audioConfig: { audioEncoding: "MP3" } };
    const hash = createHash("sha256").update(JSON.stringify(request)).digest("hex");
    const filename = join(output, hash + ".mp3");
    let exists = false;
    try { await access(filename); exists = true; } catch (error: any) { if (error.code !== "ENOENT") throw error; }
    if (!exists) {
      attemptedCharacters += Array.from(sample.text).length;
      if (attemptedCharacters > limit) throw new Error("Local trial generation limit reached.");
      await writeFile(ledgerFile, JSON.stringify({ attemptedCharacters }), { mode: 0o600 });
      const result = await google("text:synthesize", request);
      if (typeof result.audioContent !== "string" || !result.audioContent) throw new Error("Google returned no audio.");
      const temp = filename + ".tmp";
      await writeFile(temp, Buffer.from(result.audioContent, "base64"));
      await rename(temp, filename);
    }
    manifest.entries = manifest.entries.filter(entry => !(normalizeGermanText(entry.text) === sample.text && entry.speaker === sample.speaker));
    manifest.entries.push({ ...sample, voice, src: "/audio/de/" + hash + ".mp3" });
    console.log((exists ? "Reused " : "Generated ") + voice + " recording");
  }
  const temporaryManifest = manifestFile + ".tmp";
  await writeFile(temporaryManifest, JSON.stringify(manifest, null, 2) + "\n");
  await rename(temporaryManifest, manifestFile);
  console.log("Catalogue published locally. Listening review is still required before deployment.");
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Audio generation failed"); process.exitCode = 1; });
