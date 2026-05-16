import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { CoursesSection } from "@/components/sections/courses";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { StudentJourneySection } from "@/components/sections/student-journey";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { RetreatsSection } from "@/components/sections/retreats";
import { CommunitySection } from "@/components/sections/community";
import { CTASection } from "@/components/sections/cta";
import { Footer } from "@/components/footer";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <HowItWorksSection />
      <StudentJourneySection />
      <TestimonialsSection />
      <RetreatsSection />
      <CommunitySection />
      <CTASection />
      <Footer />
    </main>
  );
}
