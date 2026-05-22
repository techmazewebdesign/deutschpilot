import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/sections/hero";
import { LevelJourneySection } from "@/components/sections/level-journey";
import { RoomShowcaseSection } from "@/components/sections/room-showcase";
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Navigation />
      <HeroSection />
      <LevelJourneySection />
      <RoomShowcaseSection />
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
