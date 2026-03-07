"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { LandingHeader } from "../shared/LandingHeader";
import { LandingFooter } from "../shared/LandingFooter";

export function CustomTourPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <LandingHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#05073c] via-[#1a1c5e] to-[#05073c] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#fa8b02] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#eb662b] rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
            <span className="text-sm">
              {t("landing.customTour.backToHome", "Back to Home")}
            </span>
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {t("landing.customTour.title", "Custom Tour Request")}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t(
              "landing.customTour.subtitle",
              "Design your perfect journey — tell us your preferences and we'll craft a personalized tour just for you.",
            )}
          </p>
        </div>
      </section>

      {/* Coming Soon Placeholder */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-12">
          <Icon
            icon="heroicons:sparkles"
            className="w-16 h-16 text-[#fa8b02] mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t("landing.customTour.comingSoon", "Coming Soon")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {t(
              "landing.customTour.comingSoonDesc",
              "Our custom tour request form is being finalized. Check back soon to create your dream itinerary.",
            )}
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
