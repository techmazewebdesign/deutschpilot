import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AppLayout } from "@/components/app/app-layout";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isPlaceholderLocale } from "@/i18n";
import { Navigation } from "@/components/navigation";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Footer } from "@/components/footer";
import { AITrainerClient } from "@/components/app/ai-trainer-client";
import { getAITrainerAccess } from "@/lib/aiTrainer/access";

export const dynamic = "force-dynamic";

export default async function AITrainerPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (isPlaceholderLocale(locale)) {
    return (
      <>
        <Navigation />
        <PlaceholderPage locale={locale} />
        <Footer />
      </>
    );
  }

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const t = await getTranslations({ locale, namespace: "aiTrainer" });

  const supabase = createServerSupabaseClient();
  const [profileRes, placementRes] = await Promise.all([
    supabase.from("profiles").select("full_name, german_level").eq("id", session.user.id).single(),
    supabase.from("placement_tests").select("level_result").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(1).single(),
  ]);

  const userName = profileRes.data?.full_name ?? session.user.name ?? session.user.email?.split("@")[0] ?? t("defaultStudentName");
  const userLevel = placementRes.data?.level_result ?? profileRes.data?.german_level ?? "A1";
  const trainerAccess = await getAITrainerAccess(session.user);

  return (
    <AppLayout locale={locale} userName={userName}>
      <AITrainerClient
        locale={locale}
        userName={userName}
        userLevel={userLevel}
        accessTier={trainerAccess.tier}
        dailyLimit={trainerAccess.dailyLimit}
        paidAccessEnabled={trainerAccess.paidAccessEnabled}
        checkoutAvailable={trainerAccess.checkoutAvailable}
      />
    </AppLayout>
  );
}
