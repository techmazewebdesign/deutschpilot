import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import {
  gradeLegacyPlacement,
  legacyLearningClient,
  requireQuery,
} from "@/lib/legacyLearningAccess";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const reader = req.body?.getReader();
  if (!reader) return NextResponse.json({ error: "JSON required." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    length += chunk.value.byteLength;
    if (length > 4096) {
      await reader.cancel();
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    chunks.push(chunk.value);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(raw);
    if (!input || Array.isArray(input) || typeof input !== "object") throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const headers = { "Cache-Control": "no-store" };
  try {
    if (
      input.action === "submit" &&
      Object.keys(input).every((k) => ["action", "answers"].includes(k))
    ) {
      let result;
      try {
        result = gradeLegacyPlacement(input.answers);
      } catch {
        return NextResponse.json({ error: "Answer all ten questions." }, { status: 400 });
      }
      const db = await legacyLearningClient(session.user.id);
      const saved = requireQuery(
        await db
          .from("placement_tests")
          .insert({
            user_id: session.user.id,
            score: result.score,
            level_result: result.level,
            answers: result.answers,
          })
          .select("id")
          .single()
      );
      if (!saved.data?.id) throw new Error("Placement not saved");
      return NextResponse.json(
        {
          testId: saved.data.id,
          score: result.score,
          level: result.level,
          assessment: "informal_placement",
        },
        { headers }
      );
    }
    if (
      input.action === "saveLevel" &&
      typeof input.testId === "string" &&
      /^[a-f0-9-]{36}$/i.test(input.testId) &&
      Object.keys(input).every((k) => ["action", "testId"].includes(k))
    ) {
      const db = await legacyLearningClient(session.user.id);
      const saved = requireQuery(
        await db
          .from("placement_tests")
          .select("level_result")
          .eq("id", input.testId)
          .eq("user_id", session.user.id)
          .maybeSingle()
      );
      if (!saved.data || !["A1", "A2", "B1", "B2"].includes(saved.data.level_result))
        return NextResponse.json({ error: "Your saved test was not found." }, { status: 404 });
      const updated = requireQuery(
        await db
          .from("profiles")
          .update({ german_level: saved.data.level_result })
          .eq("firebase_uid", session.user.id)
          .select("id")
          .maybeSingle()
      );
      if (!updated.data)
        return NextResponse.json(
          { error: "Your profile must be linked before updating your level." },
          { status: 409 }
        );
      return NextResponse.json({ saved: true }, { headers });
    }
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Placement could not be saved. Please retry." },
      { status: 503 }
    );
  }
}
