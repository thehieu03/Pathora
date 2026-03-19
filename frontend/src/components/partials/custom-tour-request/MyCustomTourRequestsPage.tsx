"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Icon from "@/components/ui/Icon";
import { LandingFooter } from "@/features/shared/components/LandingFooter";
import { LandingHeader } from "@/features/shared/components/LandingHeader";
import { customTourRequestService } from "@/api/services/customTourRequestService";
import type { CustomTourRequest } from "@/types/customTourRequest";

import { CustomTourRequestStatusBadge } from "./CustomTourRequestStatusBadge";
import {
  formatBudgetUsd,
  formatDateRange,
  formatDisplayDate,
  formatParticipantsLabel,
} from "./formatters";

export function MyCustomTourRequestsPage() {
  const { t, i18n } = useTranslation();
  const languageKey = i18n.resolvedLanguage || i18n.language;

  const [requests, setRequests] = useState<CustomTourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const response = await customTourRequestService.getMyRequests();
    if (!response.success) {
      setErrorMessage(
        t(
          "customTourRequest.myRequests.loadError",
          "Failed to load your requests.",
        ),
      );
      setLoading(false);
      return;
    }

    setRequests(response.data ?? []);
    setLoading(false);
  }, [t]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests, languageKey]);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const left = new Date(a.createdOnUtc ?? 0).getTime();
      const right = new Date(b.createdOnUtc ?? 0).getTime();
      return right - left;
    });
  }, [requests]);

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t("customTourRequest.myRequests.title", "My Custom Tour Requests")}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {t(
                "customTourRequest.myRequests.subtitle",
                "Track the status of your submitted custom tour requests.",
              )}
            </p>
          </div>
          <Link
            href="/custom-tour-request"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            {t("customTourRequest.actions.newRequest", "New Request")}
          </Link>
        </div>

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 flex items-center justify-center">
            <span
              className="w-6 h-6 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin"
              aria-hidden="true"
            />
          </div>
        )}

        {!loading && errorMessage && (
          <div className="bg-white border border-rose-200 rounded-2xl p-5">
            <p className="text-sm text-rose-700">{errorMessage}</p>
            <button
              type="button"
              onClick={loadRequests}
              className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-300 text-rose-700 text-sm hover:bg-rose-50"
            >
              {t("customTourRequest.actions.retry", "Retry")}
            </button>
          </div>
        )}

        {!loading && !errorMessage && sortedRequests.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <Icon
              icon="heroicons:clipboard-document-list"
              className="w-10 h-10 text-slate-300 mx-auto"
            />
            <p className="mt-3 text-sm text-slate-500">
              {t(
                "customTourRequest.myRequests.empty",
                "You have not submitted any custom tour requests yet.",
              )}
            </p>
          </div>
        )}

        {!loading && !errorMessage && sortedRequests.length > 0 && (
          <div className="space-y-4">
            {sortedRequests.map((request) => (
              <Link
                key={request.id}
                href={`/my-custom-tour-requests/${request.id}`}
                className="block bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      {t("customTourRequest.labels.requestCode", "Request Code")}
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {request.requestCode}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{request.destination}</p>
                  </div>
                  <CustomTourRequestStatusBadge status={request.status} />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">
                      {t("customTourRequest.labels.travelDates", "Travel Dates")}
                    </p>
                    <p className="text-slate-800 font-medium">
                      {formatDateRange(
                        request.startDate,
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
                    <p className="text-slate-800 font-medium">
                      {formatParticipantsLabel(
                        request.numberOfParticipants,
                        t("customTourRequest.labels.participant", "participant"),
                        t("customTourRequest.labels.participants", "participants"),
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">
                      {t(
                        "customTourRequest.fields.budgetPerPersonUsd",
                        "Budget per person (USD)",
                      )}
                    </p>
                    <p className="text-slate-800 font-medium">
                      {formatBudgetUsd(request.budgetPerPersonUsd, languageKey)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {t("customTourRequest.labels.submittedOn", "Submitted on")}: {" "}
                  {formatDisplayDate(
                    request.createdOnUtc,
                    languageKey,
                    t("common.noData", "No data"),
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <LandingFooter />
    </div>
  );
}
