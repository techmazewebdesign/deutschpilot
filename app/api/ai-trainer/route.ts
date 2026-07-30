import { auth } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { getAITrainerAccess } from "@/lib/aiTrainer/access";
import {
  generateTrainerReply,
  normalizeTrainerMessages,
} from "@/lib/aiTrainer/provider";

export const runtime = "nodejs";

function jsonError(
  status: number,
  body: Record<string, unknown>,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return jsonError(401, { error: "unauthorized" });
  }

  let requestBody: {
    messages?: unknown;
    locale?: string;
    userLevel?: string;
  };
  try {
    requestBody = await req.json();
  } catch {
    return jsonError(400, { error: "invalid_json" });
  }

  const messages = normalizeTrainerMessages(requestBody.messages);
  if (!messages.length || messages.at(-1)?.role !== "user") {
    return jsonError(400, { error: "invalid_messages" });
  }

  const access = await getAITrainerAccess(session.user);
  const today = new Date().toISOString().slice(0, 10);

  let supabase;
  try {
    supabase = createAdminSupabaseClient();
  } catch (error) {
    console.error("[ai-trainer] Usage store unavailable:", error instanceof Error ? error.message : String(error));
    return jsonError(503, { error: "trainer_temporarily_unavailable" });
  }

  const { data: usageRows, error: usageError } = await supabase.rpc(
    "consume_ai_trainer_message",
    {
      p_user_id: session.user.id,
      p_date: today,
      p_limit: access.dailyLimit,
    },
  );

  if (usageError) {
    console.error("[ai-trainer] Usage update failed:", usageError.message);
    return jsonError(503, { error: "trainer_temporarily_unavailable" });
  }

  const usage = Array.isArray(usageRows) ? usageRows[0] : usageRows;
  const allowed = Boolean(usage?.allowed);
  const messageCount = Number(usage?.message_count ?? 0);
  if (!allowed) {
    if (access.tier === "preview" && access.paidAccessEnabled) {
      return jsonError(402, {
        error: "upgrade_required",
        limit: access.dailyLimit,
        checkoutAvailable: access.checkoutAvailable,
      });
    }
    return jsonError(429, {
      error: "daily_limit_reached",
      limit: access.dailyLimit,
    });
  }

  const result = await generateTrainerReply({
    messages,
    locale: requestBody.locale,
    userLevel: requestBody.userLevel,
  });

  return new Response(result.text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-AI-Trainer-Provider": result.provider,
      "X-AI-Trainer-Paid-Fallback": "disabled",
      "X-AI-Trainer-Remaining": String(Math.max(0, access.dailyLimit - messageCount)),
      "X-AI-Trainer-Access-Tier": access.tier,
    },
  });
}
