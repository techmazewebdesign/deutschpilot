/**
 * GET  /api/magazine/[slug]/comments — public, returns comments for an article.
 * POST /api/magazine/[slug]/comments — requires a signed-in session.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const MAX_BODY_LENGTH = 2000;

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const sb = createAdminSupabaseClient();
  const { data, error } = await sb
    .from("magazine_comments")
    .select("id, author_name, body, created_at")
    .eq("article_slug", params.slug)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[magazine/comments] GET failed:", error.message);
    return NextResponse.json({ error: "Could not load comments." }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Please sign in to comment." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text || text.length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `Comment must be between 1 and ${MAX_BODY_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const authorName = session.user.name || session.user.email.split("@")[0] || "Anonymous";

  const sb = createAdminSupabaseClient();
  const { data, error } = await sb
    .from("magazine_comments")
    .insert({
      article_slug: params.slug,
      user_id: session.user.id,
      author_name: authorName,
      body: text,
    })
    .select("id, author_name, body, created_at")
    .single();

  if (error) {
    console.error("[magazine/comments] POST failed:", error.message);
    return NextResponse.json({ error: "Could not post comment." }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}
