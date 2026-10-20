import { z } from "zod";

export const learningProgressPayload = z
  .object({
    lessonId: z.string().uuid(),
    courseId: z.string().uuid(),
    score: z.number().int().min(0).max(100),
    completed: z.boolean(),
  })
  .strict();
export type LearningProgressInput = z.infer<typeof learningProgressPayload>;
export type SchoolSyncStatus = "synced" | "not_member" | "not_configured" | "pending";
export type LearningProgressResult = {
  saved: true;
  schoolSync: SchoolSyncStatus;
  assessment: "self_reported_practice";
};

/** Client sends lesson results only. Identity always comes from the verified server session. */
export async function saveLearningProgress(
  input: LearningProgressInput
): Promise<LearningProgressResult> {
  const response = await fetch("/api/learning/progress", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.saved !== true)
    throw new Error(response.status === 401 ? "SIGN_IN_REQUIRED" : "PROGRESS_SAVE_FAILED");
  return data as LearningProgressResult;
}

export function learningProgressNotice(status: SchoolSyncStatus, locale: string) {
  const de = locale === "de";
  if (status === "pending")
    return de
      ? "Ihr Lernfortschritt wurde gespeichert. Die Übertragung an die Schule ist noch nicht bestätigt. Bitte erneut versuchen."
      : "Your learning progress was saved. School synchronisation is not confirmed yet. Please retry.";
  if (status === "synced")
    return de
      ? "Lernfortschritt gespeichert und mit der Schule synchronisiert. Übungsergebnisse sind selbst gemeldet und kein Prüfungsnachweis."
      : "Progress saved and synchronised with your school. Practice results are self-reported, not examination evidence.";
  return de
    ? "Lernfortschritt in Ihrem Konto gespeichert."
    : "Learning progress saved to your account.";
}

/** Dependency-injected HTTP boundary shared with tests; no credentials or server clients here. */
export function createLearningProgressHandler(deps: {
  origin: (request: Request) => void;
  identity: (
    request: Request
  ) => Promise<{ id: string; verified: boolean; email: string; name: string; admin: boolean }>;
  lessonCourse: (lessonId: string) => Promise<string | null>;
  save: (userId: string, input: LearningProgressInput) => Promise<void>;
  sync: (
    identity: { id: string; verified: boolean; email: string; name: string; admin: boolean },
    items: { lessonId: string; score: number; completed: boolean }[]
  ) => Promise<SchoolSyncStatus>;
}) {
  return async function handle(request: Request): Promise<Response> {
    const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    try {
      deps.origin(request);
      const identity = await deps.identity(request);
      if (!identity?.id || !identity.verified)
        return Response.json(
          { error: "Verified sign-in required", code: "UNAUTHENTICATED" },
          { status: 401, headers }
        );
      const reader = request.body?.getReader();
      if (!reader)
        return Response.json(
          { error: "JSON required", code: "INVALID_PAYLOAD" },
          { status: 400, headers }
        );
      const decoder = new TextDecoder();
      let body = "";
      let size = 0;
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        size += part.value.byteLength;
        if (size > 4096) {
          await reader.cancel();
          return Response.json(
            { error: "Payload too large", code: "INVALID_PAYLOAD" },
            { status: 413, headers }
          );
        }
        body += decoder.decode(part.value, { stream: true });
      }
      body += decoder.decode();
      let value: unknown;
      try {
        value = JSON.parse(body);
      } catch {
        return Response.json(
          { error: "Invalid JSON", code: "INVALID_PAYLOAD" },
          { status: 400, headers }
        );
      }
      const parsed = learningProgressPayload.safeParse(value);
      if (!parsed.success)
        return Response.json(
          { error: "Invalid learning result", code: "INVALID_PAYLOAD" },
          { status: 400, headers }
        );
      if ((await deps.lessonCourse(parsed.data.lessonId)) !== parsed.data.courseId)
        return Response.json(
          { error: "Lesson does not belong to this course", code: "LESSON_NOT_FOUND" },
          { status: 404, headers }
        );
      await deps.save(identity.id, parsed.data);
      let schoolSync: SchoolSyncStatus;
      try {
        schoolSync = await deps.sync(identity, [
          {
            lessonId: `web:${parsed.data.lessonId}`,
            score: parsed.data.score,
            completed: parsed.data.completed,
          },
        ]);
      } catch {
        schoolSync = "pending";
      }
      return Response.json(
        {
          saved: true,
          schoolSync,
          assessment: "self_reported_practice",
        } satisfies LearningProgressResult,
        { headers }
      );
    } catch (error) {
      const failure = error as { status?: number; code?: string };
      const status = failure.status === 401 || failure.status === 403 ? failure.status : 503;
      return Response.json(
        {
          error:
            status === 401
              ? "Sign-in required"
              : status === 403
                ? "Request not permitted"
                : "Progress could not be saved. Please retry.",
          code: status === 503 ? "SAVE_UNAVAILABLE" : failure.code || "FORBIDDEN",
        },
        { status, headers }
      );
    }
  };
}
