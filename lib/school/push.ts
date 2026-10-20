import { randomUUID } from "node:crypto";
import type { SchoolState } from "./engine";
export function pushStillAuthorized(
  s: SchoolState,
  p: NonNullable<SchoolState["pushDeliveries"]>[number]
) {
  const n = s.notifications.find((x) => x.id === p.notificationId);
  return (
    !!n &&
    (s.devices || []).some(
      (d) =>
        d.token === p.token &&
        d.userId === n.userId &&
        s.members.some((m) => m.id === n.userId && m.active)
    )
  );
}
export function claimPushBatch(s: SchoolState) {
  s.pushDeliveries ??= [];
  for (const n of s.notifications)
    for (const d of s.devices || [])
      if (
        n.userId === d.userId &&
        n.createdAt >= d.registeredAt &&
        s.members.some((m) => m.id === d.userId && m.active) &&
        !s.pushDeliveries.some((p) => p.notificationId === n.id && p.token === d.token)
      )
        s.pushDeliveries.push({
          id: randomUUID(),
          notificationId: n.id,
          token: d.token,
          status: "pending",
          attempts: 0,
          updatedAt: new Date().toISOString(),
        });
  for (const p of s.pushDeliveries) {
    if (!pushStillAuthorized(s, p)) p.status = "failed";
    if (p.status === "sending" && Date.parse(p.updatedAt) < Date.now() - 60000)
      p.status = "unknown";
  }
  const batch = s.pushDeliveries
    .filter((p) => p.status === "pending" && p.attempts < 3 && pushStillAuthorized(s, p))
    .slice(0, 50);
  for (const p of batch) {
    p.status = "sending";
    p.attempts++;
    p.updatedAt = new Date().toISOString();
  }
  return batch;
}
/** Unknown transport outcome is NOT retried automatically; provider acceptance is not phone delivery. */
export function finishPushAttempt(
  s: SchoolState,
  id: string,
  result: { ticketId?: string; rejected?: boolean; unknown?: boolean }
) {
  const p = s.pushDeliveries?.find((x) => x.id === id);
  if (!p) return;
  p.status = result.ticketId
    ? "ticket"
    : result.unknown
      ? "unknown"
      : result.rejected
        ? "failed"
        : "failed";
  p.ticketId = result.ticketId;
  p.updatedAt = new Date().toISOString();
}
export function applyPushReceipt(s: SchoolState, ticketId: string, status: "ok" | "error") {
  for (const p of s.pushDeliveries || [])
    if (p.status === "ticket" && p.ticketId === ticketId)
      p.status = status === "ok" ? "delivered" : "failed";
}
