"use client";

import { useEffect, useRef, useState } from "react";
import {
  findGermanAudio, normalizeGermanText, parseGermanAudioManifest,
  type GermanAudioEntry, type GermanAudioManifest, type GermanSpeaker,
} from "@/lib/german-audio";

let catalogue: Promise<GermanAudioManifest> | undefined;
function loadCatalogue() {
  catalogue ??= fetch("/audio/de/manifest.json", { cache: "no-store" })
    .then(async response => {
      if (!response.ok) throw new Error("Audio catalogue unavailable");
      return parseGermanAudioManifest(await response.json());
    })
    .catch(() => ({ version: 1 as const, entries: [] }));
  return catalogue;
}

export function GermanAudio({
  text, locale, label, speaker = "female",
}: { text: string; locale: string; label?: string; speaker?: GermanSpeaker }) {
  const [entry, setEntry] = useState<GermanAudioEntry | null>(null);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const de = locale === "de";

  useEffect(() => {
    let active = true;
    setEntry(null);
    setFailed(false);
    void loadCatalogue().then(manifest => {
      if (active) setEntry(findGermanAudio(manifest, text, speaker));
    });
    return () => { active = false; };
  }, [text, speaker]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => { audio?.pause(); };
  }, [entry?.src]);

  // Only offer playback when an actual generated recording is available.
  if (!entry || normalizeGermanText(entry.text) !== normalizeGermanText(text) || entry.speaker !== speaker) return null;
  return (
    <div className="my-3 rounded-xl border border-[#E0B873]/20 bg-[#0A1E35]/70 p-3">
      <p className="mb-2 text-xs text-white/60">
        {label ?? (de ? "Deutsche Aussprache anhören" : "Listen to German pronunciation")}
      </p>
      <audio key={entry.src} ref={audioRef} controls preload="none" src={entry.src}
        aria-label={label ?? (de ? "Deutsche Aussprache" : "German pronunciation")}
        className="w-full" onError={() => setFailed(true)} />
      <label className="mt-2 flex items-center gap-2 text-xs text-white/60">
        {de ? "Tempo" : "Speed"}
        <select defaultValue="1" key={entry.src} className="rounded bg-[#071424] p-1"
          onChange={event => {
            if (audioRef.current) audioRef.current.playbackRate = Number(event.target.value);
          }}>
          <option value="0.75">0.75×</option>
          <option value="1">1×</option>
        </select>
      </label>
      <p className="mt-2 text-[10px] text-white/40">
        {de ? "KI-generierte deutsche Stimme" : "AI-generated German voice"}
      </p>
      {failed && <p role="alert" className="mt-2 text-xs text-amber-200">
        {de ? "Audio ist gerade nicht verfügbar. Bitte später erneut versuchen." : "Audio is unavailable. Please try again later."}
      </p>}
    </div>
  );
}
