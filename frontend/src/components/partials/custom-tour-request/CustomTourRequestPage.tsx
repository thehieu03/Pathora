"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import Icon from "@/components/ui/Icon";
import { LandingFooter } from "@/components/partials/shared/LandingFooter";
import { LandingHeader } from "@/components/partials/shared/LandingHeader";

import { CustomTourRequestForm } from "./CustomTourRequestForm";

export function CustomTourRequestPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader variant="solid" />

      <section className="bg-gradient-to-br from-[#05073c] via-[#1a1c5e] to-[#05073c] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-5"
          >
            <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
            {t("customTourRequest.backToTours", "Back to Tours")}
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("customTourRequest.title", "Custom Tour Request")}
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl text-sm sm:text-base">
            {t(
              "customTourRequest.subtitle",
              "Share your preferences and we will craft a personalized itinerary for your trip.",
            )}
          </p>

          <div className="mt-6">
            <Link
              href="/my-custom-tour-requests"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium transition-colors"
            >
              <Icon icon="heroicons:clipboard-document-list" className="w-4 h-4" />
              {t(
                "customTourRequest.actions.goToMyRequests",
                "Go to My Requests",
              )}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <CustomTourRequestForm />
          </div>

          <aside className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-20">
            <h2 className="text-base font-semibold text-slate-900">
              {t("customTourRequest.guide.title", "How it works")}
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-slate-600 list-decimal list-inside">
              <li>
                {t(
                  "customTourRequest.guide.step1",
                  "Submit your destination, budget, and travel preferences.",
                )}
              </li>
              <li>
                {t(
                  "customTourRequest.guide.step2",
                  "Our travel consultants review and tailor the proposal.",
                )}
              </li>
              <li>
                {t(
                  "customTourRequest.guide.step3",
                  "Track status in My Requests and receive approval updates.",
                )}
              </li>
            </ol>
          </aside>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
