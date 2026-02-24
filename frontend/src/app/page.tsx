import React from "react";
import LandingHeader from "@/components/partials/landing/LandingHeader";
import HeroSection from "@/components/partials/landing/HeroSection";
import LatestToursSection from "@/components/partials/landing/LatestToursSection";
import FeaturedTripsSection from "@/components/partials/landing/FeaturedTripsSection";
import StatsSection from "@/components/partials/landing/StatsSection";
import {
  TrendingDestinationsSection,
  TopAttractionsSection,
} from "@/components/partials/landing/DestinationsSection";
import ReviewsSection from "@/components/partials/landing/ReviewsSection";
import {
  CTASection,
  WhyChooseSection,
  TrustedBrandsSection,
} from "@/components/partials/landing/BottomSections";
import LandingFooter from "@/components/partials/landing/LandingFooter";

export default function Home() {
  return (
    <main className="bg-white min-h-screen overflow-x-hidden">
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
