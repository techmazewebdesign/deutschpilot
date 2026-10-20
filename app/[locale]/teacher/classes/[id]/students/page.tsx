import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabaseAdmin";
import { findProfile } from "@/lib/profileHelper";
import { ArrowLeft, Users, Mail, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClassStudentsPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);
  if (session.user.role !== "teacher" && session.user.role !== "admin") {
    redirect(`/${locale}/student/dashboard`);
  }

  const profile = await findProfile(session.user.id);
  if (session.user.role === "teacher" && !profile)
    throw new Error("Teacher profile is unavailable. Contact school support.");
  const supabase = createAdminSupabaseClient();

  // Fetch class — verify teacher owns it (unless admin)
  const { data: cls, error: classError } = await supabase
    .from("live_classes")
    .select("id, title, level, teacher_id, start_time, status")
    .eq("id", id)
    .single();

  if (classError && classError.code !== "PGRST116")
    throw new Error("Class could not be loaded. Please retry.");
  if (!cls) redirect(`/${locale}/teacher/dashboard`);
  if (session.user.role === "teacher" && cls.teacher_id !== profile?.id) {
    redirect(`/${locale}/teacher/dashboard`);
  }

  // Fetch enrollments
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("class_enrollments")
    .select("id, student_id, status, created_at")
    .eq("class_id", id)
    .order("created_at", { ascending: true });

  if (enrollmentError) throw new Error("Class enrolments could not be loaded. Please retry.");
  const rows = enrollments ?? [];

  const statusColor = (s: string) =>
    ({
      enrolled: "bg-emerald-500/15 text-emerald-300",
      attended: "bg-blue-500/15 text-blue-300",
      cancelled: "bg-red-500/15 text-red-300",
    })[s] ?? "bg-white/10 text-white/50";

  return (
    <div className="min-h-screen bg-[#071424] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/${locale}/teacher/dashboard`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-6">
          <span className="rounded-full bg-[#E0B873]/10 px-2 py-0.5 text-xs font-bold text-[#E0B873]">
            {cls.level}
          </span>
          <h1 className="mt-2 font-serif text-2xl font-bold text-white">{cls.title}</h1>
          <p className="mt-1 text-sm text-white/40">
            {new Date(cls.start_time).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {new Date(cls.start_time).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A1E35]/70">
          <div className="border-white/8 flex items-center gap-2 border-b p-5">
            <Users className="h-4 w-4 text-[#E0B873]" />
            <span className="text-sm font-semibold text-white">Enrolled Students</span>
            <span className="ml-auto text-xs text-white/40">{rows.length} total</span>
          </div>

          {rows.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-white/20" />
              <p className="text-sm text-white/40">No students enrolled yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {rows.map((row, i) => (
                <div key={row.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E0B873]/15">
                    <span className="text-xs font-bold text-[#E0B873]">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm text-xs text-white/70">
                      {row.student_id}
                    </p>
                    <p className="text-xs text-white/30">
                      Enrolled {new Date(row.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColor(row.status)}`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
