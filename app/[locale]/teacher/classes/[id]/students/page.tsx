import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
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

  const supabase = createServerSupabaseClient();

  // Fetch class — verify teacher owns it (unless admin)
  const { data: cls } = await supabase
    .from("live_classes")
    .select("id, title, level, teacher_id, start_time, status")
    .eq("id", id)
    .single();

  if (!cls) redirect(`/${locale}/teacher/dashboard`);
  if (session.user.role === "teacher" && cls.teacher_id !== session.user.id) {
    redirect(`/${locale}/teacher/dashboard`);
  }

  // Fetch enrollments
  const { data: enrollments } = await supabase
    .from("class_enrollments")
    .select("id, student_id, status, created_at")
    .eq("class_id", id)
    .order("created_at", { ascending: true });

  const rows = enrollments ?? [];

  const statusColor = (s: string) => ({
    enrolled: "bg-emerald-500/15 text-emerald-300",
    attended: "bg-blue-500/15 text-blue-300",
    cancelled: "bg-red-500/15 text-red-300",
  }[s] ?? "bg-white/10 text-white/50");

  return (
    <div className="min-h-screen bg-[#071424] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/teacher/dashboard`}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-6">
          <span className="text-xs font-bold text-[#E0B873] bg-[#E0B873]/10 px-2 py-0.5 rounded-full">{cls.level}</span>
          <h1 className="text-2xl font-serif font-bold text-white mt-2">{cls.title}</h1>
          <p className="text-sm text-white/40 mt-1">
            {new Date(cls.start_time).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {new Date(cls.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0A1E35]/70 overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-white/8">
            <Users className="h-4 w-4 text-[#E0B873]" />
            <span className="text-sm font-semibold text-white">Enrolled Students</span>
            <span className="ml-auto text-xs text-white/40">{rows.length} total</span>
          </div>

          {rows.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-10 w-10 mx-auto text-white/20 mb-3" />
              <p className="text-sm text-white/40">No students enrolled yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {rows.map((row, i) => (
                <div key={row.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="h-8 w-8 rounded-full bg-[#E0B873]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#E0B873]">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 font-mono truncate text-xs">{row.student_id}</p>
                    <p className="text-xs text-white/30">
                      Enrolled {new Date(row.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor(row.status)}`}>
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
