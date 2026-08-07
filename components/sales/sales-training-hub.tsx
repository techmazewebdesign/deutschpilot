"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock3, Download, Film, ListVideo, Play, RotateCcw, X } from "lucide-react";

type Chapter = { id: string; titleDe: string; titleEn: string; startSeconds: number };
type VideoRecord = {
  id: string;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  videoUrl: string;
  posterUrl: string;
  powerpointUrl?: string;
  durationSeconds: number;
  required: boolean;
  autoOpen: boolean;
  chapters: Chapter[];
};
type Progress = {
  videoId: string;
  positionSeconds: number;
  percent: number;
  status: "assigned" | "in_progress" | "completed";
  lastViewedAt: string | null;
};
type TrainingResponse = { salesTeam: boolean; videos: VideoRecord[]; progress: Record<string, Progress> };

const emptyResponse: TrainingResponse = { salesTeam: false, videos: [], progress: {} };

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function SalesTrainingHub({ locale, mode = "dashboard" }: { locale: string; mode?: "dashboard" | "library" }) {
  const de = locale === "de";
  const pathname = usePathname();
  const isDashboard = pathname.endsWith("/admin") || pathname.endsWith("/student/dashboard") || pathname.endsWith("/teacher/dashboard");
  const [data, setData] = useState<TrainingResponse>(emptyResponse);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoRecord | null>(null);
  const [startAt, setStartAt] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSynced = useRef(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sales-training", { cache: "no-store" })
      .then((res) => res.json())
      .then((result: TrainingResponse) => {
        if (cancelled) return;
        setData(result);
        if (mode === "dashboard" && isDashboard && result.salesTeam) {
          const next = result.videos.find((video) => {
            const progress = result.progress[video.id];
            const hiddenThisSession = sessionStorage.getItem(`sales-training-dismissed:${video.id}`) === "1";
            return video.autoOpen && progress?.status !== "completed" && !hiddenThisSession;
          });
          if (next) {
            setStartAt(result.progress[next.id]?.positionSeconds ?? 0);
            setActiveVideo(next);
          }
        }
      })
      .catch(() => setData(emptyResponse))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [isDashboard, mode]);

  async function saveProgress(video: VideoRecord, event: "progress" | "dismissed" | "completed", positionSeconds: number) {
    const res = await fetch("/api/sales-training", {
      method: "PATCH",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: video.id, event, positionSeconds }),
    });
    if (!res.ok) return;
    const update = await res.json();
    setData((current) => ({
      ...current,
      progress: {
        ...current.progress,
        [video.id]: {
          videoId: video.id,
          positionSeconds: update.positionSeconds,
          percent: update.percent,
          status: update.status,
          lastViewedAt: new Date().toISOString(),
        },
      },
    }));
  }

  function openVideo(video: VideoRecord, seconds?: number) {
    lastSynced.current = 0;
    setStartAt(seconds ?? data.progress[video.id]?.positionSeconds ?? 0);
    setActiveVideo(video);
  }

  function closeVideo() {
    if (!activeVideo) return;
    const current = videoRef.current?.currentTime ?? startAt;
    sessionStorage.setItem(`sales-training-dismissed:${activeVideo.id}`, "1");
    void saveProgress(activeVideo, "dismissed", current);
    setActiveVideo(null);
  }

  const completedCount = useMemo(
    () => data.videos.filter((video) => data.progress[video.id]?.status === "completed").length,
    [data],
  );

  if (loading || !data.salesTeam || (mode === "dashboard" && !isDashboard)) return null;

  return (
    <>
      {mode === "dashboard" ? (
        <section className="px-4 sm:px-6 lg:px-8 pt-6 max-w-6xl w-full mx-auto">
          <div className="rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-[#0B2B46] to-[#071829] p-5 sm:p-6 shadow-xl shadow-cyan-950/20">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-cyan-400/15 border border-cyan-300/20 flex items-center justify-center flex-shrink-0">
                <ListVideo className="h-6 w-6 text-cyan-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-[0.2em]">
                    {de ? "Sales Training" : "Sales training"}
                  </p>
                  <span className="text-[10px] text-white/45 border border-white/10 rounded-full px-2 py-0.5">
                    {completedCount}/{data.videos.length} {de ? "abgeschlossen" : "completed"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mt-1">
                  {de ? "Deine Präsentationsvideos" : "Your presentation videos"}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  {de ? "Setze dein Pflichtvideo fort oder öffne jederzeit ein einzelnes Verkaufsthema." : "Continue your required video or replay any sales topic at any time."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.videos[0] && (
                  <button onClick={() => openVideo(data.videos[0])} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-[#061B31] hover:bg-cyan-200 transition-colors">
                    <Play className="h-4 w-4 fill-current" />
                    {data.progress[data.videos[0].id]?.positionSeconds ? (de ? "Fortsetzen" : "Continue") : (de ? "Video starten" : "Start video")}
                  </button>
                )}
                <Link href={`/${locale}/sales/presentations`} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                  <Film className="h-4 w-4" /> {de ? "Alle Videos" : "All videos"}
                </Link>
              </div>
            </div>
            {data.videos[0] && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-[11px] text-white/40 mb-1.5">
                  <span>{de ? "Dein Fortschritt" : "Your progress"}</span>
                  <span>{data.progress[data.videos[0].id]?.percent ?? 0}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${data.progress[data.videos[0].id]?.percent ?? 0}%` }} />
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-[0.22em]">Sales Enablement</p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">{de ? "Präsentationsvideos" : "Presentation videos"}</h1>
            <p className="text-sm text-white/45 mt-2 max-w-2xl">
              {de ? "Hier bleiben alle dir zugewiesenen Präsentationsvideos mit Fortschritt und Themenliste gespeichert." : "Every assigned presentation video remains available here with progress and a topic list."}
            </p>
          </div>
          <div className="grid gap-5">
            {data.videos.map((video) => {
              const progress = data.progress[video.id];
              const title = de ? video.titleDe : video.titleEn;
              return (
                <article key={video.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A1E35]/75">
                  <div className="grid lg:grid-cols-[380px_1fr]">
                    <button onClick={() => openVideo(video)} className="group relative aspect-video lg:aspect-auto min-h-[220px] overflow-hidden bg-black text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={video.posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute left-5 bottom-5 h-12 w-12 rounded-full bg-cyan-300 text-[#061B31] flex items-center justify-center shadow-lg"><Play className="h-5 w-5 fill-current ml-0.5" /></span>
                      <span className="absolute right-4 bottom-4 rounded-full bg-black/65 px-2 py-1 text-xs text-white">{formatTime(video.durationSeconds)}</span>
                    </button>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {video.required && <span className="rounded-full bg-amber-400/10 border border-amber-300/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">{de ? "Pflicht" : "Required"}</span>}
                            {progress?.status === "completed" && <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> {de ? "Abgeschlossen" : "Completed"}</span>}
                          </div>
                          <h2 className="text-xl font-semibold text-white">{title}</h2>
                          <p className="text-sm text-white/45 mt-2">{de ? video.descriptionDe : video.descriptionEn}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button onClick={() => openVideo(video)} className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-[#061B31] hover:bg-cyan-200 transition-colors">
                          {progress?.positionSeconds ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                          {progress?.positionSeconds ? `${de ? "Fortsetzen bei" : "Continue at"} ${formatTime(progress.positionSeconds)}` : (de ? "Abspielen" : "Play")}
                        </button>
                        {video.powerpointUrl && <a href={video.powerpointUrl} download className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 hover:text-white hover:bg-white/5"><Download className="h-4 w-4" /> PowerPoint</a>}
                      </div>
                      <div className="mt-5">
                        <div className="flex justify-between text-[11px] text-white/40 mb-1.5"><span>{de ? "Fortschritt" : "Progress"}</span><span>{progress?.percent ?? 0}%</span></div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-cyan-300 rounded-full" style={{ width: `${progress?.percent ?? 0}%` }} /></div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/8 p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3"><Clock3 className="h-4 w-4 text-cyan-300" /><h3 className="text-sm font-semibold text-white">{de ? "Themen direkt abspielen" : "Play a topic directly"}</h3></div>
                    <div className="flex flex-wrap gap-2">
                      {video.chapters.map((chapter) => <button key={chapter.id} onClick={() => openVideo(video, chapter.startSeconds)} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/60 hover:border-cyan-300/30 hover:text-cyan-200 transition-colors"><span className="text-white/30 mr-1.5">{formatTime(chapter.startSeconds)}</span>{de ? chapter.titleDe : chapter.titleEn}</button>)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={de ? activeVideo.titleDe : activeVideo.titleEn}>
          <div className="w-full max-w-6xl max-h-[94vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#061522] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#061522]/95 px-4 sm:px-6 py-4 backdrop-blur">
              <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">DeutschPilot Sales Training</p><h2 className="truncate text-base sm:text-lg font-semibold text-white">{de ? activeVideo.titleDe : activeVideo.titleEn}</h2></div>
              <button onClick={closeVideo} className="flex-shrink-0 rounded-full border border-white/10 p-2 text-white/60 hover:bg-white/5 hover:text-white" aria-label={de ? "Video schließen" : "Close video"}><X className="h-5 w-5" /></button>
            </div>
            <video
              ref={videoRef}
              className="w-full bg-black aspect-video"
              src={activeVideo.videoUrl}
              poster={activeVideo.posterUrl}
              controls
              autoPlay
              playsInline
              onLoadedMetadata={(event) => { event.currentTarget.currentTime = Math.min(startAt, Math.max(0, event.currentTarget.duration - 1)); }}
              onTimeUpdate={(event) => { const current = event.currentTarget.currentTime; if (current - lastSynced.current >= 10) { lastSynced.current = current; void saveProgress(activeVideo, "progress", current); } }}
              onPause={(event) => { if (!event.currentTarget.ended) void saveProgress(activeVideo, "progress", event.currentTarget.currentTime); }}
              onEnded={() => void saveProgress(activeVideo, "completed", activeVideo.durationSeconds)}
            >
              <track kind="captions" src="/training/deutschpilot-sales/annekatrin-sales-playbook-de.vtt" srcLang="de" label="Deutsch" />
            </video>
            <div className="p-4 sm:p-6">
              <p className="text-sm text-white/50">{de ? "Schließe das Video jederzeit. Dein Fortschritt bleibt gespeichert und das Video bleibt in deinem Dashboard verfügbar." : "Close the video at any time. Your progress is saved and the video remains available in your dashboard."}</p>
              <div className="mt-4 flex flex-wrap gap-2">{activeVideo.chapters.map((chapter) => <button key={chapter.id} onClick={() => { if (videoRef.current) { videoRef.current.currentTime = chapter.startSeconds; void videoRef.current.play(); } }} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-cyan-200 hover:border-cyan-300/30"><span className="text-white/30 mr-1.5">{formatTime(chapter.startSeconds)}</span>{de ? chapter.titleDe : chapter.titleEn}</button>)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
