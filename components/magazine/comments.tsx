"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

type Comment = { id: string; author_name: string; body: string; created_at: string };

export function MagazineComments({ slug, locale }: { slug: string; locale: string }) {
  const de = locale === "de";
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/magazine/${slug}/comments`);
      const data = (await res.json()) as { comments?: Comment[] };
      setComments(data.comments ?? []);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/magazine/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text.trim() }),
      });
      const data = (await res.json()) as { comment?: Comment; error?: string };
      if (!res.ok || !data.comment) {
        setError(data.error ?? (de ? "Kommentar konnte nicht gesendet werden." : "Could not post comment."));
        setSubmitting(false);
        return;
      }
      setComments((prev) => [...prev, data.comment as Comment]);
      setText("");
    } catch {
      setError(de ? "Netzwerkfehler." : "Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-14 pt-10 border-t border-white/8">
      <h2 className="text-lg font-serif font-bold text-white mb-5 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-[#E0B873]" />
        {de ? "Diskussion" : "Discussion"} {comments.length > 0 && `(${comments.length})`}
      </h2>

      {loading ? (
        <p className="text-sm text-white/30">{de ? "Lädt…" : "Loading…"}</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.length === 0 && (
            <p className="text-sm text-white/35">
              {de ? "Noch keine Kommentare. Sei der/die Erste!" : "No comments yet. Be the first!"}
            </p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-white/8 bg-[#0A1E35]/40 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold text-white">{c.author_name}</span>
                <span className="text-xs text-white/25">
                  {new Date(c.created_at).toLocaleDateString(de ? "de-DE" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      {!authLoading && user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3">{error}</p>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder={de ? "Schreib einen Kommentar…" : "Write a comment…"}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#E0B873]/50 transition-all resize-none"
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="px-5 py-2.5 rounded-xl bg-[#E0B873] text-[#071424] text-sm font-bold hover:bg-[#C99B50] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (de ? "Wird gesendet…" : "Posting…") : (de ? "Kommentieren" : "Post comment")}
          </button>
        </form>
      ) : !authLoading ? (
        <p className="text-sm text-white/40">
          <Link href={`/${locale}/signin`} className="text-[#E0B873] hover:underline">
            {de ? "Melde dich an" : "Sign in"}
          </Link>{" "}
          {de ? "um mitzudiskutieren." : "to join the discussion."}
        </p>
      ) : null}
    </div>
  );
}
