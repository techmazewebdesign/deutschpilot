import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { AppLayout } from "@/components/app/app-layout";
import { VocabularyClient, type VocabWord } from "@/components/vocabulary/vocabulary-client";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const de = params.locale === "de";
  return { title: de ? "Vokabular | DeutschPilot" : "Vocabulary | DeutschPilot" };
}

export default async function VocabularyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/signin`);

  const supabase = createServerSupabaseClient();
  const userName = session.user.name ?? session.user.email?.split("@")[0] ?? "Student";

  const { data } = await supabase
    .from("vocabulary_words")
    .select("id, level, category, word_de, word_en, example_de, example_en")
    .order("level")
    .order("order_index");

  const words = (data ?? []) as VocabWord[];

  return (
    <AppLayout locale={locale} userName={userName}>
      <VocabularyClient words={words} locale={locale} />
    </AppLayout>
  );
}
