"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Icon } from "@/components/ui";
import { tourRequestService } from "@/api/services/tourRequestService";
import { useDebounce } from "@/hooks/useDebounce";
import {
  TOUR_REQUEST_STATUS_MAP,
  normalizeTourRequestStatus,
  type TourRequestStatus,
  type TourRequestVm,
} from "@/types/tourRequest";
import { handleApiError } from "@/utils/apiResponse";
import { TourRequestAdminLayout } from "./TourRequestAdminLayout";

const PAGE_SIZE = 10;

const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString();
};

const formatBudget = (value: number): string => {
  if (!value || value <= 0) {
    return "-";
  }

  return `${new Intl.NumberFormat("en-US").format(value)} USD`;
};

const formatTravelDate = (startDate: string, endDate: string): string => {
  const normalizedStartDate = formatDate(startDate);
  const normalizedEndDate = formatDate(endDate);

  if (!normalizedEndDate || normalizedStartDate === normalizedEndDate) {
    return normalizedStartDate;
  }

  return `${normalizedStartDate} - ${normalizedEndDate}`;
};

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const normalizedStatus = normalizeTourRequestStatus(status);
  const statusMeta = TOUR_REQUEST_STATUS_MAP[normalizedStatus];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
    >
      <span className={`h-2 w-2 rounded-full ${statusMeta.dotClassName}`} />
      {t(statusMeta.labelKey)}
    </span>
  );
};

export function TourRequestListPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [requests, setRequests] = useState<TourRequestVm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<TourRequestStatus | "All">("All");
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  }, [totalItems]);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await tourRequestService.getAllTourRequests({
        status,
        searchText: debouncedSearchText,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        pageNumber: currentPage,
        pageSize: PAGE_SIZE,
      });

      setRequests(result.data);
      setTotalItems(result.total);
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(
        t(apiError.message, {
          defaultValue: t("tourRequest.toast.loadAdminRequestsError"),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchText, fromDate, status, t, toDate]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  return (
    <TourRequestAdminLayout
      title={t("tourRequest.page.adminRequests.title")}
      subtitle={t("tourRequest.page.adminRequests.subtitle")}
    >
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("tourRequest.filters.status")}
              </label>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as TourRequestStatus | "All");
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="All">{t("tourRequest.filters.allStatuses")}</option>
                <option value="Pending">{t("tourRequest.status.pending")}</option>
                <option value="Approved">{t("tourRequest.status.approved")}</option>
                <option value="Rejected">{t("tourRequest.status.rejected")}</option>
                <option value="Cancelled">{t("tourRequest.status.cancelled")}</option>
              </select>
            </div>

            <div className="xl:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("tourRequest.filters.search")}
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                placeholder={t("tourRequest.filters.search")}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("tourRequest.filters.fromDate")}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("tourRequest.filters.toDate")}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(event) => {
                  setToDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.index")}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.destination")}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.travelDate")}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.participants")}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.budget")}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.status")}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.createdOn")}
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">
                    {t("tourRequest.admin.table.actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`tour-request-row-skeleton-${index}`}>
                      <td colSpan={8} className="px-4 py-3">
                        <div className="h-8 animate-pulse rounded bg-slate-100" />
                      </td>
                    </tr>
                  ))
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                      No tour requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((request, index) => (
                    <tr
                      key={request.id}
                      className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/tour-requests/${request.id}`)}
                    >
                      <td className="px-4 py-3 text-slate-700">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {request.destination}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatTravelDate(request.startDate, request.endDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {request.numberOfParticipants}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatBudget(request.budgetPerPersonUsd)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatDate(request.createdOnUtc)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/dashboard/tour-requests/${request.id}`);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Icon icon="heroicons:eye" className="size-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && requests.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <p className="text-sm text-slate-600">
                {currentPage}/{totalPages}
              </p>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </TourRequestAdminLayout>
  );
}


