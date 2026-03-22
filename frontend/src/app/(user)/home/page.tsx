import type { Metadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Discover Amazing Tours | Pathora",
  description:
    "Explore curated tour packages across Vietnam and Asia. Book guided tours, custom itineraries, and discover trending destinations with Pathora.",
  keywords: ["tours", "Vietnam travel", "Asia tours", "travel packages", "guided tours"],
  openGraph: {
    title: "Discover Amazing Tours | Pathora",
    description:
      "Explore curated tour packages across Vietnam and Asia. Book guided tours, custom itineraries, and discover trending destinations.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
import { LandingHeader } from "@/features/shared/components";
import {
  HeroSection,
  LatestToursSection,
  FeaturedTripsSection,
} from "@/features/home/components";

const StatsSection = dynamic(() =>
  import("@/features/home/components").then((m) => m.StatsSection),
);
const TrendingDestinationsSection = dynamic(() =>
  import("@/features/home/components").then(
    (m) => m.TrendingDestinationsSection,
  ),
);
const TopAttractionsSection = dynamic(() =>
  import("@/features/home/components").then((m) => m.TopAttractionsSection),
);
const ReviewsSection = dynamic(() =>
  import("@/features/home/components").then((m) => m.ReviewsSection),
);
const CTASection = dynamic(() =>
  import("@/features/home/components").then((m) => m.CTASection),
);
const WhyChooseSection = dynamic(() =>
  import("@/features/home/components").then((m) => m.WhyChooseSection),
);
const TrustedBrandsSection = dynamic(() =>
  import("@/features/home/components").then((m) => m.TrustedBrandsSection),
);
const LandingFooter = dynamic(() =>
  import("@/features/shared/components").then((m) => m.LandingFooter),
);

const SectionSkeleton = ({ className }: { className: string }) => {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto w-full max-w-7xl rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse ${className}`}
    />
  );
};

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      {/* Fixed nav sits on top of the hero */}
      <div className="relative">
        <LandingHeader />
        <HeroSection />
      </div>

      {/* Main content sections */}
      <div className="flex flex-col gap-16 py-16 bg-[#f9fafb]">
        <LatestToursSection />
        <FeaturedTripsSection />
      </div>

      <Suspense fallback={<SectionSkeleton className="h-56" />}>
        <StatsSection />
      </Suspense>

      <div className="flex flex-col gap-16 py-16 bg-[#f9fafb]">
        <Suspense fallback={<SectionSkeleton className="h-72" />}>
          <TrendingDestinationsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton className="h-72" />}>
          <TopAttractionsSection />
        </Suspense>
      </div>

      <Suspense fallback={<SectionSkeleton className="h-80" />}>
        <ReviewsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-48" />}>
        <CTASection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-64" />}>
        <WhyChooseSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-64" />}>
        <TrustedBrandsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="h-56" />}>
        <LandingFooter />
      </Suspense>
    </main>
  );
}
