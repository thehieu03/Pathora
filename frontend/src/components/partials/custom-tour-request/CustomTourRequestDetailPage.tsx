"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Icon from "@/components/ui/Icon";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { customTourRequestService } from "@/api/services/customTourRequestService";
import type { CustomTourRequest } from "@/types/customTourRequest";

import { TRAVEL_INTEREST_OPTIONS } from "./constants";
import { CustomTourRequestStatusBadge } from "./CustomTourRequestStatusBadge";
import { formatBudgetUsd, formatDisplayDate } from "./formatters";

export function CustomTourRequestDetailPage() {
  const { t, i18n } = useTranslation();
  const languageKey = i18n.resolvedLanguage || i18n.language;
  const params = useParams();
  const requestId = params.id as string;

  const [request, setRequest] = useState<CustomTourRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getInterestLabel = (interest: string): string => {
    const option = TRAVEL_INTEREST_OPTIONS.find((item) => item.value === interest);
    if (!option) {
      return interest;
    }

    return t(option.labelKey, option.defaultLabel);
  };

  useEffect(() => {
    if (!requestId) {
      return;
    }

    let cancelled = false;

    const doLoad = async () => {
      setLoading(true);
      setErrorMessage("");

      const response = await customTourRequestService.getPublicRequestDetail(requestId);
      if (cancelled) return;

      if (!response.success || !response.data) {
        setErrorMessage(
          t(
            "customTourRequest.detail.loadError",
            "Unable to load request details.",
          ),
        );
        setLoading(false);
        return;
      }

      setRequest(response.data);
      setLoading(false);
    };

    void doLoad();
    return () => {
      cancelled = true;
    };
  }, [requestId, t, languageKey]);

  const handleRetry = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    setErrorMessage("");

    const response = await customTourRequestService.getPublicRequestDetail(requestId);
    if (!response.success || !response.data) {
      setErrorMessage(
        t(
          "customTourRequest.detail.loadError",
          "Unable to load request details.",
        ),
      );
      setLoading(false);
      return;
    }

    setRequest(response.data);
    setLoading(false);
  }, [requestId, t]);

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          href="/my-custom-tour-requests"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
          {t("customTourRequest.detail.back", "Back to My Requests")}
        </Link>

        {loading && (
          <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-10 flex justify-center">
            <span
              className="w-6 h-6 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin"
              aria-hidden="true"
            />
          </div>
        )}

        {!loading && errorMessage && (
          <div className="mt-5 bg-white border border-rose-200 rounded-2xl p-5">
            <p className="text-sm text-rose-700">{errorMessage}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-300 text-rose-700 text-sm hover:bg-rose-50"
            >
              {t("customTourRequest.actions.retry", "Retry")}
            </button>
          </div>
        )}

        {!loading && !errorMessage && request && (
          <div className="mt-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {t("customTourRequest.labels.requestCode", "Request Code")}
                  </p>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {request.requestCode}
                  </h1>
                </div>
                <CustomTourRequestStatusBadge status={request.status} />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">
                    {t("customTourRequest.fields.destination", "Destination")}
                  </p>
                  <p className="text-slate-900 font-medium">{request.destination}</p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t("customTourRequest.labels.submittedOn", "Submitted on")}
                  </p>
                  <p className="text-slate-900 font-medium">
                    {formatDisplayDate(
                      request.createdOnUtc,
                      languageKey,
                      t("common.noData", "No data"),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t("customTourRequest.fields.startDate", "Start Date")}
                  </p>
                  <p className="text-slate-900 font-medium">
                    {formatDisplayDate(
                      request.startDate,
                      languageKey,
                      t("common.noData", "No data"),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t("customTourRequest.fields.endDate", "End Date")}
                  </p>
                  <p className="text-slate-900 font-medium">
                    {formatDisplayDate(
                      request.endDate,
                      languageKey,
                      t("common.noData", "No data"),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t(
                      "customTourRequest.fields.numberOfParticipants",
                      "Number of Participants",
                    )}
                  </p>
                  <p className="text-slate-900 font-medium">
                    {request.numberOfParticipants}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t(
                      "customTourRequest.fields.budgetPerPersonUsd",
                      "Budget per person (USD)",
                    )}
                  </p>
                  <p className="text-slate-900 font-medium">
                    {formatBudgetUsd(request.budgetPerPersonUsd, languageKey)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-3">
                {t("customTourRequest.labels.preferences", "Preferences")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">
                    {t(
                      "customTourRequest.fields.travelInterests",
                      "Travel Interests",
                    )}
                  </p>
                    <p className="text-slate-900 font-medium">
                    {request.travelInterests.length > 0
                      ? request.travelInterests.map(getInterestLabel).join(", ")
                      : t("common.noData", "No data")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t(
                      "customTourRequest.fields.preferredAccommodation",
                      "Preferred Accommodation",
                    )}
                  </p>
                  <p className="text-slate-900 font-medium">
                    {request.preferredAccommodation ?? t("common.noData", "No data")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t(
                      "customTourRequest.fields.transportationPreference",
                      "Transportation Preference",
                    )}
                  </p>
                  <p className="text-slate-900 font-medium">
                    {request.transportationPreference ?? t("common.noData", "No data")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">
                    {t(
                      "customTourRequest.fields.specialRequests",
                      "Special Requests / Requirements",
                    )}
                  </p>
                  <p className="text-slate-900 font-medium whitespace-pre-wrap">
                    {request.specialRequests ?? t("common.noData", "No data")}
                  </p>
                </div>
              </div>

              {request.adminNote && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-slate-500 text-xs">
                    {t("customTourRequest.labels.adminNote", "Admin Note")}
                  </p>
                  <p className="text-slate-900 mt-1 whitespace-pre-wrap">
                    {request.adminNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <LandingFooter />
    </div>
  );
}
