import React from "react";
import {
  LandingHeader,
  HeroSection,
  LatestToursSection,
  FeaturedTripsSection,
  StatsSection,
  TrendingDestinationsSection,
  TopAttractionsSection,
  ReviewsSection,
  CTASection,
  WhyChooseSection,
  TrustedBrandsSection,
  LandingFooter,
} from "@/components/partials/landing";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="bg-white min-h-screen overflow-x-hidden">
      {/* Fixed nav sits on top of the hero */}
      <div className="relative">
        <LandingHeader />
        <HeroSection />
      </div>

      {/* Main content sections */}
      <div className="flex flex-col gap-16 py-16">
        <LatestToursSection />
        <FeaturedTripsSection />
      </div>

      <StatsSection />

      <div className="flex flex-col gap-16 py-16">
        <TrendingDestinationsSection />
        <TopAttractionsSection />
      </div>

      <ReviewsSection />
      <CTASection />
      <WhyChooseSection />
      <TrustedBrandsSection />
      <LandingFooter />
    </main>
  );
}
