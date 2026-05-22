import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DAILY_MESSAGE_LIMIT = 20;

const SYSTEM_PROMPT = `You are an expert German language tutor named "DeutschPilot AI". You help learners from A1 to C1 level.

Your personality:
- Warm, encouraging, and patient
- Clear and concise — avoid lengthy explanations unless asked
- You mix German and English naturally based on the learner's level
- For A1/A2 learners: mostly English explanations, German examples
- For B1+ learners: more German, English only when needed

What you do:
- Correct German sentences with clear explanations of WHY
- Give targeted grammar explanations
- Run vocabulary tests and exercises
- Practice conversational German
- Give level-appropriate exercises (A1–C1)
- Provide encouragement when learners get things right

Format rules:
- Use **bold** for important words or corrections
- Use bullet points for lists
- Keep responses concise (2–4 paragraphs max unless doing an exercise)
- Always end with a question or next step to keep engagement going`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Rate limit: 20 messages per day per user
  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const { data: usageRow } = await supabase
    .from("ai_trainer_usage")
    .select("message_count")
    .eq("user_id", session.user.id)
    .eq("date", today)
    .single();

  const currentCount = usageRow?.message_count ?? 0;
  if (currentCount >= DAILY_MESSAGE_LIMIT) {
    return new Response(
      JSON.stringify({ error: "daily_limit_reached", limit: DAILY_MESSAGE_LIMIT }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Increment usage count (upsert)
  await supabase.from("ai_trainer_usage").upsert(
    { user_id: session.user.id, date: today, message_count: currentCount + 1 },
    { onConflict: "user_id,date" }
  );

  const { messages, locale, userLevel } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return new Response("Invalid request", { status: 400 });
  }

  const systemWithContext = `${SYSTEM_PROMPT}

Current learner context:
- UI language: ${locale === "de" ? "German" : "English"}
- German level: ${userLevel ?? "A1"}
- Respond in: ${locale === "de" ? "German first, then English if clarification is needed" : "English primarily, with German examples"}`;

  const anthropicMessages = messages
    .filter((m: { role: string; text: string }) => m.role === "user" || m.role === "assistant")
    .map((m: { role: string; text: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.text,
    }));

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemWithContext,
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
