import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppLayout } from "@/components/app/app-layout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { User, Mail, GraduationCap, Lock, BookOpen } from "lucide-react";

export default async function ProfilePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const de = locale === "de";

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const supabase = createServerSupabaseClient();
  const userId = session.user.id;

  // Fetch profile data
  const [profileRes, placementRes, progressRes] = await Promise.all([
    supabase.from("profiles").select("full_name, german_level").eq("user_id", userId).single(),
    supabase.from("placement_tests").select("level, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("student_progress").select("id").eq("user_id", userId),
  ]);

  const profile = profileRes.data;
  const placement = placementRes.data;
  const totalCompleted = progressRes.data?.length ?? 0;

  const name = profile?.full_name ?? session.user.name ?? session.user.email?.split("@")[0] ?? "Student";
  const email = session.user.email ?? "";
  const level = placement?.level ?? profile?.german_level ?? "A1";

  const levelColors: Record<string, string> = {
    A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    A2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    B1: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    B2: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    C1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };

  return (
    <AppLayout locale={locale} userName={name}>
      <div className="px-5 lg:px-8 py-6 lg:py-8 max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-[#E0B873]" />
            <span className="text-xs font-semibold text-[#E0B873]/70 uppercase tracking-[0.2em]">
              {de ? "Profil" : "Profile"}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">
            {de ? "Dein Profil" : "Your Profile"}
          </h1>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl bg-[#0A1E35]/70 border border-white/10">
          <div className="h-16 w-16 rounded-full bg-[#E0B873]/20 border-2 border-[#E0B873]/40 flex items-center justify-center flex-shrink-0">
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
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0A1E35]/50 border border-white/8">
            <Mail className="h-4 w-4 text-[#E0B873] flex-shrink-0" />
            <div>
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">
                {de ? "E-Mail" : "Email"}
              </p>
              <p className="text-sm text-white">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0A1E35]/50 border border-white/8">
            <GraduationCap className="h-4 w-4 text-[#E0B873] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">
                {de ? "Deutschniveau" : "German Level"}
              </p>
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${levelColors[level] ?? levelColors.A1}`}>
                {level}
              </span>
            </div>
            <a
              href={`/${locale}/placement`}
              className="text-xs text-[#E0B873]/60 hover:text-[#E0B873] transition-colors"
            >
              {de ? "Neu testen" : "Retest"}
            </a>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0A1E35]/50 border border-white/8">
            <BookOpen className="h-4 w-4 text-[#E0B873] flex-shrink-0" />
            <div>
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">
                {de ? "Abgeschlossene Übungen" : "Completed Exercises"}
              </p>
              <p className="text-sm text-white font-semibold">{totalCompleted}</p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="p-4 rounded-2xl bg-white/3 border border-white/6 flex items-center gap-3">
          <Lock className="h-4 w-4 text-white/30 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-white/50">
              {de
                ? "Passwort ändern: Nutze die Firebase-E-Mail zum Zurücksetzen."
                : "To change your password, use the password reset email from the login page."}
            </p>
          </div>
          <a
            href={`/${locale}/login`}
            className="text-xs text-[#E0B873]/70 hover:text-[#E0B873] transition-colors whitespace-nowrap flex-shrink-0"
          >
            {de ? "Zum Login" : "Go to login"}
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
