import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { legacyLearningClient, requireQuery } from "@/lib/legacyLearningAccess";
import { User, Mail, GraduationCap, Lock, BookOpen } from "lucide-react";
import { DeleteAccountCard } from "@/components/account/delete-account-card";

export default async function ProfilePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "profile" });

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const supabase = await legacyLearningClient(session.user.id);
  const userId = session.user.id;

  // Fetch profile data
  const [profileRes, placementRes, progressRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, german_level")
      .eq("firebase_uid", userId)
      .maybeSingle(),
    supabase
      .from("placement_tests")
      .select("level_result, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("student_progress").select("id").eq("user_id", userId),
  ]);

  [profileRes, placementRes, progressRes].forEach(requireQuery);
  const profile = profileRes.data;
  const placement = placementRes.data;
  const totalCompleted = progressRes.data?.length ?? 0;

  const name =
    profile?.full_name ?? session.user.name ?? session.user.email?.split("@")[0] ?? "Student";
  const email = session.user.email ?? "";
  const level = placement?.level_result ?? profile?.german_level ?? "A1";

  const levelColors: Record<string, string> = {
    A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };

  return (
    <AppLayout locale={locale} userName={name}>
      <div className="mx-auto w-full max-w-2xl px-5 py-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-[#E0B873]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E0B873]/70">
              {t("label")}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">{t("heading")}</h1>
        </div>

        {/* Avatar + name */}
        <div className="mb-8 flex items-center gap-5 rounded-2xl border border-white/10 bg-[#0A1E35]/70 p-5">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#E0B873]/40 bg-[#E0B873]/20">
            <span className="text-2xl font-bold text-[#E0B873]">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{name}</p>
            <p className="text-sm text-white/45">{email}</p>
          </div>
        </div>

        {/* Info cards */}
        <div className="mb-8 space-y-3">
          <div className="border-white/8 flex items-center gap-4 rounded-xl border bg-[#0A1E35]/50 p-4">
            <Mail className="h-4 w-4 flex-shrink-0 text-[#E0B873]" />
            <div>
              <p className="mb-0.5 text-[10px] uppercase tracking-widest text-white/35">
                {t("email")}
              </p>
              <p className="text-sm text-white">{email}</p>
            </div>
          </div>

          <div className="border-white/8 flex items-center gap-4 rounded-xl border bg-[#0A1E35]/50 p-4">
            <GraduationCap className="h-4 w-4 flex-shrink-0 text-[#E0B873]" />
            <div className="flex-1">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-white/35">
                {t("germanLevel")}
              </p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${levelColors[level] ?? levelColors.A1}`}
              >
                {level}
              </span>
            </div>
            <a
              href={`/${locale}/placement-test`}
              className="text-xs text-[#E0B873]/60 transition-colors hover:text-[#E0B873]"
            >
              {t("retest")}
            </a>
          </div>

          <div className="border-white/8 flex items-center gap-4 rounded-xl border bg-[#0A1E35]/50 p-4">
            <BookOpen className="h-4 w-4 flex-shrink-0 text-[#E0B873]" />
            <div>
              <p className="mb-0.5 text-[10px] uppercase tracking-widest text-white/35">
                {t("completedExercises")}
              </p>
              <p className="text-sm font-semibold text-white">{totalCompleted}</p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white/3 border-white/6 flex items-center gap-3 rounded-2xl border p-4">
          <Lock className="h-4 w-4 flex-shrink-0 text-white/30" />
          <div className="flex-1">
            <p className="text-xs text-white/50">{t("changePasswordHint")}</p>
          </div>
          <a
            href={`/${locale}/login`}
            className="flex-shrink-0 whitespace-nowrap text-xs text-[#E0B873]/70 transition-colors hover:text-[#E0B873]"
          >
            {t("goToLogin")}
          </a>
        </div>
        <DeleteAccountCard locale={locale} />
      </div>
    </AppLayout>
  );
}
