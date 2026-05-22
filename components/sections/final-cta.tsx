"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";

  return (
    <section className="bg-[#071424] py-20 lg:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1E35] to-[#0A1628] border border-[#CEA66F]/15 p-10 lg:p-16 text-center">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#CEA66F]/8 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CEA66F]/30 bg-[#CEA66F]/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-[#CEA66F] uppercase mb-5">
              <Sparkles className="h-3 w-3" />
              Start Learning Today
            </div>

            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-white mb-4 max-w-3xl mx-auto leading-tight">
              Ready for Your German Journey?
            </h2>
            <p className="text-white/45 max-w-xl mx-auto mb-8">
              Join thousands of learners who are already making real progress with DeutschPilot. Your first room is waiting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link href={`/${locale}/signup`}>
                <Button
                  size="lg"
                  className="bg-[#D9B173] text-[#071424] hover:bg-[#B98A4E] font-semibold rounded-md px-8"
                >
                  Start Your Journey <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link href={`/${locale}/placement-test`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#C9D2DE]/30 text-[#C9D2DE] hover:bg-white/5 hover:border-[#CEA66F]/50 rounded-md px-7"
                >
                  Determine Your Level
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/30">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[#CEA66F]" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[#CEA66F]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-[#CEA66F]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
