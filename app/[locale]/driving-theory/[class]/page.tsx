import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { DrivingTheoryClient, type DrivingQuestion } from "@/components/driving-theory/driving-theory-client";

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
      ? `Essenzielle Verkehrsregeln zum Üben für Klasse ${cls}. Kostenlos, kein Konto nötig.`
      : `Essential traffic-law questions to practice for Class ${cls}. Free, no account needed.`,
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
  const isGuest = !session?.user;

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
      <DrivingTheoryClient questions={questions} locale={locale} licenseClass={licenseClass} isGuest={isGuest} />
      <Footer />
    </>
  );
}
