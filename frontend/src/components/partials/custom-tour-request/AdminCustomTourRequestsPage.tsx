"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { customTourRequestService } from "@/api/services/customTourRequestService";
import type {
  CustomTourRequest,
  CustomTourRequestStatus,
} from "@/types/customTourRequest";

import { CustomTourRequestStatusBadge } from "./CustomTourRequestStatusBadge";
import { formatBudgetUsd, formatDisplayDate } from "./formatters";

interface AdminFilters {
  keyword: string;
  status: CustomTourRequestStatus | "all";
  fromDate: string;
  toDate: string;
}

const defaultFilters: AdminFilters = {
  keyword: "",
  status: "all",
  fromDate: "",
  toDate: "",
};

export function AdminCustomTourRequestsPage() {
  const { t, i18n } = useTranslation();
  const languageKey = i18n.resolvedLanguage || i18n.language;

  const [filters, setFilters] = useState<AdminFilters>(defaultFilters);
  const [requests, setRequests] = useState<CustomTourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const response = await customTourRequestService.getAdminRequests({
      keyword: filters.keyword || undefined,
      status: filters.status,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
    });

    if (!response.success) {
      setErrorMessage(
        t(
          "customTourRequest.admin.list.loadError",
          "Failed to load custom tour requests.",
        ),
      );
      setLoading(false);
      return;
    }

    setRequests(response.data ?? []);
    setLoading(false);
  }, [filters.fromDate, filters.keyword, filters.status, filters.toDate, t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadRequests();
    }, 250);

    return () => clearTimeout(timeout);
  }, [loadRequests, languageKey]);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const left = new Date(a.createdOnUtc ?? 0).getTime();
      const right = new Date(b.createdOnUtc ?? 0).getTime();
      return right - left;
    });
  }, [requests]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t(
                "customTourRequest.admin.list.title",
                "Custom Tour Requests",
              )}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {t(
                "customTourRequest.admin.list.subtitle",
                "Review and manage submitted custom tour requests.",
              )}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={filters.keyword}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  keyword: event.target.value,
                }))
              }
              placeholder={t(
                "customTourRequest.admin.filters.keyword",
                "Search by request code or destination",
              )}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />

            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value as CustomTourRequestStatus | "all",
                }))
              }
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="all">{t("common.all", "All")}</option>
              <option value="pending">{t("customTourRequest.status.pending", "Pending")}</option>
              <option value="approved">{t("customTourRequest.status.approved", "Approved")}</option>
              <option value="rejected">{t("customTourRequest.status.rejected", "Rejected")}</option>
            </select>

            <input
              type="date"
              value={filters.fromDate}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  fromDate: event.target.value,
                }))
              }
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />

            <input
              type="date"
              value={filters.toDate}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  toDate: event.target.value,
                }))
              }
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              className="inline-flex items-center px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              {t("common.reset", "Reset")}
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <span
                className="w-6 h-6 border-2 border-slate-300 border-t-orange-500 rounded-full animate-spin"
                aria-hidden="true"
              />
            </div>
          )}

          {!loading && errorMessage && (
            <div className="p-4">
              <p className="text-sm text-rose-700">{errorMessage}</p>
              <button
                type="button"
                onClick={loadRequests}
                className="mt-2 inline-flex items-center px-3 py-2 rounded-lg border border-rose-300 text-sm text-rose-700 hover:bg-rose-50"
              >
                {t("customTourRequest.actions.retry", "Retry")}
              </button>
            </div>
          )}

          {!loading && !errorMessage && sortedRequests.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              {t(
                "customTourRequest.admin.list.empty",
                "No requests found for current filters.",
              )}
            </div>
          )}

          {!loading && !errorMessage && sortedRequests.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="text-left px-4 py-3">{t("customTourRequest.labels.requestCode", "Request Code")}</th>
                    <th className="text-left px-4 py-3">{t("customTourRequest.fields.destination", "Destination")}</th>
                    <th className="text-left px-4 py-3">{t("customTourRequest.labels.travelDates", "Travel Dates")}</th>
                    <th className="text-left px-4 py-3">{t("customTourRequest.fields.numberOfParticipants", "Number of Participants")}</th>
                    <th className="text-left px-4 py-3">{t("customTourRequest.fields.budgetPerPersonUsd", "Budget per person (USD)")}</th>
                    <th className="text-left px-4 py-3">{t("common.status", "Status")}</th>
                    <th className="text-left px-4 py-3">{t("customTourRequest.labels.submittedOn", "Submitted on")}</th>
                    <th className="text-right px-4 py-3">{t("common.actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {sortedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{request.requestCode}</td>
                      <td className="px-4 py-3 text-slate-700">{request.destination}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatDisplayDate(
                          request.startDate,
                          languageKey,
                          t("common.noData", "No data"),
                        )}
                        {" "}-{" "}
                        {formatDisplayDate(
                          request.endDate,
                          languageKey,
                          t("common.noData", "No data"),
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{request.numberOfParticipants}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatBudgetUsd(request.budgetPerPersonUsd, languageKey)}
                      </td>
                      <td className="px-4 py-3">
                        <CustomTourRequestStatusBadge status={request.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatDisplayDate(
                          request.createdOnUtc,
                          languageKey,
                          t("common.noData", "No data"),
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/custom-tour-requests/${request.id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          {t("common.view", "View")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
