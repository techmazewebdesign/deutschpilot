import { getTranslations } from "next-intl/server";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/sections/hero";
import { LevelJourneySection } from "@/components/sections/level-journey";
import { RoomShowcaseSection } from "@/components/sections/room-showcase";
import { WhyDeutschPilotSection } from "@/components/sections/why-deutschpilot";
import { AIShowcaseSection } from "@/components/sections/ai-showcase";
import { DailyMissionSection } from "@/components/sections/daily-mission";
import { DashboardPreviewSection } from "@/components/sections/dashboard-preview";
import { CertificateSection } from "@/components/sections/certificate";
import { FinalCTASection } from "@/components/sections/final-cta";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { LiveClassesPreviewSection } from "@/components/sections/live-classes-preview";
import { TeachersPreviewSection } from "@/components/sections/teachers-preview";
import { SplitCTASection } from "@/components/sections/split-cta";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

const BASE_URL = "https://deutschpilot.de";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "seo" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "DeutschPilot",
        url: BASE_URL,
        logo: `${BASE_URL}/Images/Deurschpilot_logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "DeutschPilot",
        url: BASE_URL,
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: locale,
      },
      {
        "@type": "Course",
        name: t("homeCourseName"),
        description: t("homeCourseDescription"),
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/${locale}/levels`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-navy-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <HeroSection />
      <LevelJourneySection />
      <RoomShowcaseSection />
      <WhyDeutschPilotSection />
      <AIShowcaseSection />
      <DailyMissionSection />
      <HowItWorksSection />
      <LiveClassesPreviewSection />
      <TeachersPreviewSection />
      <DashboardPreviewSection />
      <CertificateSection />
      <SplitCTASection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
