import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderPage } from "@/components/placeholder-page";
import { isPlaceholderLocale } from "@/i18n";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { DrivingTheoryClient, type DrivingQuestion } from "@/components/driving-theory/driving-theory-client";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return {
    title: de
      ? "Führerschein Theorie üben (Klasse B) | DeutschPilot"
      : "Practice German Driving Theory (Class B) | DeutschPilot",
    description: de
      ? "Essenzielle Verkehrsregeln zum Üben — Promillegrenzen, Vorfahrt, Geschwindigkeit, Sicherheitsabstand und mehr. Kostenlos, kein Konto nötig."
      : "Essential traffic-law questions to practice — BAC limits, right-of-way, speed limits, safe following distance, and more. Free, no account needed.",
  };
}

export default async function DrivingTheoryPage({ params }: { params: { locale: string } }) {
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

  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("driving_theory_questions")
    .select("id, category, question_de, question_en, options_de, options_en, correct_answer_de, correct_answer_en, explanation_de, explanation_en")
    .eq("license_class", "B")
    .order("order_index");

  const questions = (data ?? []) as DrivingQuestion[];

  return (
    <>
      <Navigation />
      <DrivingTheoryClient questions={questions} locale={locale} />
      <Footer />
    </>
  );
}
