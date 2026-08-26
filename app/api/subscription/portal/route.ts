import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { createCustomerPortalSession } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const sb = createAdminSupabaseClient();
  const { data } = await sb.from("platform_subscriptions").select("stripe_customer_id")
    .eq("user_id", session.user.id).maybeSingle();
  if (!data?.stripe_customer_id) return NextResponse.json({ error: "No billing account found." }, { status: 404 });
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (process.env.NODE_ENV === "production" && !configuredOrigin) {
    return NextResponse.json({ error: "Application URL is not configured." }, { status: 503 });
  }
  const origin = (configuredOrigin || new URL(req.url).origin).replace(/\/+$/, "");
  const locale = req.headers.get("referer")?.includes("/en/") ? "en" : "de";
  const portal = await createCustomerPortalSession(data.stripe_customer_id, `${origin}/${locale}/profile`);
  return NextResponse.json({ url: portal.url });
}
