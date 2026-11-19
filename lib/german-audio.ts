export type GermanSpeaker = "female" | "male";
export type GermanAudioEntry = { text: string; speaker: GermanSpeaker; voice: string; src: string };
export type GermanAudioManifest = { version: 1; entries: GermanAudioEntry[] };

export function normalizeGermanText(text: string): string {
  return text.normalize("NFC").trim().replace(/\s+/g, " ");
}

export function isGermanAudioEntry(value: unknown): value is GermanAudioEntry {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<GermanAudioEntry>;
  return typeof item.text === "string" && Boolean(normalizeGermanText(item.text))
    && (item.speaker === "female" || item.speaker === "male")
    && typeof item.voice === "string" && /^de-DE-[A-Za-z0-9-]+$/.test(item.voice)
    && typeof item.src === "string" && /^\/audio\/de\/[a-f0-9]{64}\.mp3$/.test(item.src);
}

export function parseGermanAudioManifest(value: unknown): GermanAudioManifest {
  if (!value || typeof value !== "object") throw new Error("Invalid German audio catalogue");
  const manifest = value as Partial<GermanAudioManifest>;
  if (manifest.version !== 1 || !Array.isArray(manifest.entries)
    || !manifest.entries.every(isGermanAudioEntry)) throw new Error("Invalid German audio catalogue");
  return { version: 1, entries: manifest.entries };
}

export function findGermanAudio(
  manifest: GermanAudioManifest, text: string, speaker: GermanSpeaker = "female",
): GermanAudioEntry | null {
  const normalized = normalizeGermanText(text);
  return manifest.entries.find(entry =>
    entry.speaker === speaker && normalizeGermanText(entry.text) === normalized
  ) ?? null;
}
