import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { DrivingTheoryClient, type DrivingQuestion } from "@/components/driving-theory/driving-theory-client";
import { hasPlatformSubscription } from "@/lib/entitlements";
import { AppLayout } from "@/components/app/app-layout";
import { UpgradeWall } from "@/components/learn/upgrade-wall";

export const dynamic = "force-dynamic";

const CLASSES = ["A", "B"] as const;

export function generateMetadata({ params }: { params: { locale: string; class: string } }): Metadata {
  const de = params.locale === "de";
  const cls = params.class.toUpperCase();
  return {
    title: de
      ? `Führerschein Theorie üben (Klasse ${cls}) | DeutschPilot`
      : `Practice German Driving Theory (Class ${cls}) | DeutschPilot`,
    description: de
      ? `Essenzielle Verkehrsregeln zum Üben für Klasse ${cls} mit DeutschPilot All Access.`
      : `Essential traffic-law questions for Class ${cls} with DeutschPilot All Access.`,
  };
}

export default async function DrivingTheoryClassPage({
  params,
}: {
  params: { locale: string; class: string };
}) {
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

  const licenseClass = params.class.toUpperCase();
  if (!CLASSES.includes(licenseClass as (typeof CLASSES)[number])) notFound();

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);
  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";
  if (!(await hasPlatformSubscription(session.user.id, session.user.role))) {
    return <AppLayout locale={locale} userName={userName}><UpgradeWall locale={locale} level="A2" backHref={`/${locale}/driving-theory`} /></AppLayout>;
  }

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("driving_theory_questions")
    .select("id, category, question_de, question_en, options_de, options_en, correct_answer_de, correct_answer_en, explanation_de, explanation_en")
    .eq("license_class", licenseClass)
    .order("order_index");

  const questions = (data ?? []) as DrivingQuestion[];

  return (
    <>
      <Navigation />
      <DrivingTheoryClient questions={questions} locale={locale} licenseClass={licenseClass} isGuest={false} />
      <Footer />
    </>
  );
}
