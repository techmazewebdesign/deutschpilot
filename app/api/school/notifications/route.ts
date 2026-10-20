import { timingSafeEqual } from "node:crypto";
import { errorResponse, privateHeaders, pushConfigured, repositoryRpc } from "@/lib/school/server";
import { SchoolError } from "@/lib/school/engine";
export const dynamic = "force-dynamic";
type Ticket = { id: string; token: string; lease: string; ticketId?: string };
export async function POST(request: Request) {
  try {
    const secret = process.env.SCHOOL_JOBS_CRON_SECRET || process.env.SCHOOL_PUSH_CRON_SECRET;
    const supplied = Buffer.from(request.headers.get("authorization") || "");
    const expected = Buffer.from(`Bearer ${secret}`);
    if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected))
      throw new SchoolError("FORBIDDEN", "Forbidden");
    const reminders = await repositoryRpc<number>("school_reminders", {});
    if (!pushConfigured())
      return Response.json(
        { remindersCreated: reminders, pushDisabled: true },
        { headers: privateHeaders }
      );
    const batch = await repositoryRpc<Ticket[]>("school_push_claim", {});
    let accepted = 0;
    for (const p of batch) {
      if (!(await repositoryRpc<boolean>("school_push_authorized", { p_id: p.id }))) {
        await repositoryRpc("school_push_finish", {
          p_id: p.id,
          p_lease: p.lease,
          p_result: { status: "failed" },
        });
        continue;
      }
      let result: Record<string, unknown> = { status: "unknown" };
      try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: p.token,
            title: "School update",
            body: "Open your secure school dashboard for details.",
            data: { type: "school_update" },
            sound: "default",
          }),
          signal: AbortSignal.timeout(10000),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data?.status === "ok" && typeof data.data.id === "string") {
            result = { status: "ticket", ticketId: data.data.id };
            accepted++;
          } else result = { status: "failed" };
        }
      } catch {
        /* Ambiguous transmission remains unknown, never automatically retried. */
      }
      await repositoryRpc("school_push_finish", { p_id: p.id, p_lease: p.lease, p_result: result });
    }
    const tickets = await repositoryRpc<Ticket[]>("school_push_receipts", {});
    if (tickets.length)
      try {
        const r = await fetch("https://exp.host/--/api/v2/push/getReceipts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: tickets.map((t) => t.ticketId) }),
          signal: AbortSignal.timeout(10000),
        });
        if (r.ok) {
          const data = await r.json();
          for (const t of tickets) {
            const receipt = data.data?.[t.ticketId || ""];
            if (receipt?.status === "ok" || receipt?.status === "error")
              await repositoryRpc("school_push_receipt_apply", {
                p_id: t.id,
                p_status: receipt.status === "ok" ? "delivered" : "failed",
              });
          }
        }
      } catch {
        /* Provider receipt retry next scheduled run. */
      }
    return Response.json(
      { acceptedTickets: accepted, remindersCreated: reminders, deviceDisplayed: false },
      { headers: privateHeaders }
    );
  } catch (e) {
    return errorResponse(e);
  }
}
