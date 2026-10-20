import { decorateSchoolProgress } from "@/lib/school/progress-metadata";
import { apply, parseAction } from "@/lib/school/engine";
import { schoolHistory } from "@/lib/school/repository";
import { readSchoolJson } from "@/lib/school/http";
import {
  checkMutationOrigin,
  errorResponse,
  mutate,
  privateHeaders,
  readSnapshot,
  schoolIdentity,
  schoolId,
  repositoryRpc,
} from "@/lib/school/server";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const u = await schoolIdentity(request);
    return Response.json(await readSnapshot(u), { headers: privateHeaders });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(request: Request) {
  try {
    checkMutationOrigin(request);
    const u = await schoolIdentity(request);
    const input = parseAction(await readSchoolJson(request));
    if (input.action === "chat.history")
      return Response.json(
        {
          snapshot: await readSnapshot(u),
          messages: await schoolHistory(schoolId(), u, "chatMessages", input.classId, input.before),
        },
        { headers: privateHeaders }
      );
    if (input.action === "audit.list")
      return Response.json(
        {
          snapshot: await readSnapshot(u),
          auditEntries: await schoolHistory(schoolId(), u, "audit", undefined, input.before),
        },
        { headers: privateHeaders }
      );
    if (input.action === "retention.run") {
      const records = await repositoryRpc("school_repository_record_retention", {
        p_actor: u,
        p_dry_run: false,
      });
      const paths = await repositoryRpc<string[]>("school_repository_retention", { p_actor: u });
      if (paths.length) {
        const { error } = await createAdminSupabaseClient()
          .storage.from("school-private")
          .remove(paths);
        if (error)
          return Response.json(
            { error: "Expired files blocked; cleanup remains queued.", code: "CLEANUP_PENDING" },
            { status: 503, headers: privateHeaders }
          );
        await repositoryRpc("school_cleanup_ack", { p_paths: paths });
      }
      return Response.json(
        { snapshot: await readSnapshot(u), retentionBatch: paths.length, recordRetention: records },
        { headers: privateHeaders }
      );
    }
    if (input.action === "section.page") {
      const page = await repositoryRpc<{
        items: Record<string, unknown>[];
        nextCursor: string | null;
      }>("school_repository_page", {
        p_actor: u,
        p_section: input.section,
        p_before: input.before || null,
      });
      const current = await readSnapshot(u);
      const isOffice = current.actor.role === "owner" || current.actor.role === "office";
      let items = page.items.map((row) => {
        if (input.section === "absenceSummaries")
          return {
            id: row.id,
            studentId: row.studentId,
            from: row.from,
            to: row.to,
            status: row.status,
          };
        if (input.section === "documents") {
          const { storagePath, sha256, ...safe } = row;
          return safe;
        }
        if (input.section === "members")
          return { ...row, email: isOffice || row.id === u.id ? row.email : "" };
        if (input.section === "letters" && !isOffice && row.createdBy !== u.id) {
          const map = (key: string) => ({ [u.id]: (row[key] as Record<string, unknown>)?.[u.id] });
          return {
            ...row,
            studentIds: [u.id],
            readBy: map("readBy"),
            acknowledgements: map("acknowledgements"),
            returnedDocuments: map("returnedDocuments"),
          };
        }
        return row;
      });
      if (input.section === "progress")
        items = (
          await decorateSchoolProgress(
            items as unknown as import("@/lib/school/contract").SchoolProgress[]
          )
        ).items as unknown as Record<string, unknown>[];
      return Response.json(
        { snapshot: current, section: input.section, items, nextCursor: page.nextCursor },
        { headers: privateHeaders }
      );
    }
    if (input.action === "data.export")
      return Response.json(
        {
          export: await repositoryRpc("school_repository_export", {
            p_actor: u,
            p_before: input.cursor || null,
          }),
        },
        { headers: privateHeaders }
      );
    const { result } = await mutate(u, input, (s) =>
      apply(s, u, input, process.env.SCHOOL_BOOTSTRAP_OWNER_UID)
    );
    return Response.json(
      {
        snapshot: await readSnapshot(u),
        ...(result.inviteCode ? { inviteCode: result.inviteCode } : {}),
      },
      { headers: privateHeaders }
    );
  } catch (e) {
    return errorResponse(e);
  }
}
