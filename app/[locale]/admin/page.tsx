import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "@/lib/session";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { AppLayout } from "@/components/app/app-layout";
import { UsersTable } from "@/components/admin/users-table";
import {
  Shield, Users, ArrowLeft, BookOpen,
  GraduationCap, BarChart2, CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  const session = await getServerSession();
  if (!session) redirect(`/${locale}/signin`);
  if (session.user.role === "teacher") redirect(`/${locale}/teacher`);
  if (session.user.role !== "admin") redirect(`/${locale}/rooms`);

  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = createServerSupabaseClient();

  // Real stats from Supabase
  const [coursesRes, lessonsRes, progressRes, placementRes] = await Promise.all([
    supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("lessons").select("id", { count: "exact", head: true }).lt("order_index", 99),
    supabase.from("student_progress").select("user_id, completed").eq("completed", true),
    supabase.from("placement_tests").select("id", { count: "exact", head: true }),
  ]);

  const totalCourses = coursesRes.count ?? 0;
  const totalLessons = lessonsRes.count ?? 0;
  const completedRows = progressRes.data ?? [];
  const uniqueActiveUsers = new Set(completedRows.map((r) => r.user_id)).size;
  const totalCompletions = completedRows.length;
  const totalPlacements = placementRes.count ?? 0;

  const card = "bg-[#0A1E35]/70 backdrop-blur-sm border border-white/8 rounded-2xl";

  return (
    <AppLayout locale={locale} userName={session.user.name} userLevel="admin">
      <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-6xl w-full mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white">
                {t("dashboardTitle")}
              </h1>
              <p className="text-xs text-white/40">
                {t("dashboardSubtitle")}
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("backToDashboard")}
          </Link>
        </div>

        {/* Real platform stats */}
        <section>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
            {t("platformOverview")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: BookOpen, value: totalCourses, label: t("statCourses"), sub: t("statCoursesSub") },
              { icon: GraduationCap, value: totalLessons, label: t("statLessons"), sub: t("statLessonsSub") },
              { icon: Users, value: uniqueActiveUsers, label: t("statActiveLearners"), sub: t("statActiveLearnersSub") },
              { icon: CheckCircle2, value: totalCompletions, label: t("statCompletions"), sub: t("statCompletionsSub") },
              { icon: BarChart2, value: totalPlacements, label: t("statPlacements"), sub: t("statPlacementsSub") },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`${card} p-4`}>
                  <Icon className="h-4 w-4 text-[#E0B873] mb-2" />
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/50">{s.label}</p>
                  <p className="text-[10px] text-white/25">{s.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Users section */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Users className="h-4 w-4 text-[#E0B873]" />
            <h2 className="text-base font-semibold text-white">
              {t("userManagement")}
            </h2>
          </div>
          <UsersTable locale={locale} currentUserId={session.user.id} />
        </section>

        {/* Notes */}
        <section className={`${card} p-5`}>
          <h3 className="text-sm font-semibold text-white mb-3">
            {t("notesTitle")}
          </h3>
          <ul className="space-y-1.5 text-xs text-white/45">
            <li>• {t("noteRoleChange")}</li>
            <li>• {t("noteDisabled")}</li>
            <li>• {t("noteDeleted")}</li>
            <li>• {t("noteOwnAccount")}</li>
            <li>• {t("noteDataSource")}</li>
          </ul>
        </section>

      </div>
    </AppLayout>
  );
}
