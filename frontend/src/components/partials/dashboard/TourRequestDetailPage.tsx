"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Icon } from "@/components/ui";
import { tourRequestService } from "@/services/tourRequestService";
import {
  TOUR_REQUEST_STATUS_MAP,
  normalizeTourRequestStatus,
  type TourRequestDetailDto,
} from "@/types/tourRequest";
import { handleApiError } from "@/utils/apiResponse";
import { TourRequestAdminLayout } from "./TourRequestAdminLayout";

type ReviewAction = "approve" | "reject";

const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString();
};

const formatBudget = (value: number): string => {
  if (!value || value <= 0) {
    return "-";
  }

  return `${new Intl.NumberFormat("en-US").format(value)} USD`;
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

export function TourRequestDetailPage() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const requestId = typeof params.id === "string" ? params.id : "";

  const [detail, setDetail] = useState<TourRequestDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [pendingRefreshKey, setPendingRefreshKey] = useState(0);

  const loadDetail = useCallback(async () => {
    if (!requestId) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await tourRequestService.getTourRequestDetail(requestId, {
        admin: true,
      });

      setDetail(result);
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(
        t(apiError.message, {
          defaultValue: t("tourRequest.toast.loadDetailError"),
        }),
      );
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, [requestId, t]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const normalizedStatus = useMemo(() => {
    return normalizeTourRequestStatus(detail?.status);
  }, [detail?.status]);

  const canReview = normalizedStatus === "Pending";

  const openReviewModal = (action: ReviewAction) => {
    setReviewAction(action);
    setAdminNote(detail?.adminNote ?? "");
  };

  const closeReviewModal = () => {
    setReviewAction(null);
    setAdminNote("");
  };

  const submitReview = async () => {
    if (!detail || !reviewAction) {
      return;
    }

    if (reviewAction === "reject" && !adminNote.trim()) {
      return;
    }

    setIsSubmittingReview(true);

    try {
      await tourRequestService.reviewTourRequest(detail.id, {
        status: reviewAction === "approve" ? "Approved" : "Rejected",
        adminNote: adminNote.trim() || null,
      });

      toast.success(
        reviewAction === "approve"
          ? t("tourRequest.toast.reviewApprovedSuccess")
          : t("tourRequest.toast.reviewRejectedSuccess"),
      );

      closeReviewModal();
      await loadDetail();
      setPendingRefreshKey((prev) => prev + 1);
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(
        t(apiError.message, {
          defaultValue: t("tourRequest.toast.reviewError"),
        }),
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <TourRequestAdminLayout
      title={t("tourRequest.page.adminDetail.title")}
      subtitle={t("tourRequest.page.adminRequests.subtitle")}
      pendingRefreshKey={pendingRefreshKey}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            href="/dashboard/tour-requests"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            <Icon icon="heroicons:arrow-left" className="size-4" />
            Back to list
          </Link>

          {detail && <StatusBadge status={detail.status} />}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`tour-request-detail-skeleton-${index}`}
                  className="h-7 animate-pulse rounded bg-slate-100"
                />
              ))}
            </div>
          ) : !detail ? (
            <p className="text-slate-600">No detail data available.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                <div>
                  <strong>{t("tourRequest.admin.detail.customerName")}:</strong>{" "}
                  {detail.customerName || "-"}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.customerPhone")}:</strong>{" "}
                  {detail.customerPhone || "-"}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.customerEmail")}:</strong>{" "}
                  {detail.customerEmail || "-"}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.destination")}:</strong>{" "}
                  {detail.destination}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.startDate")}:</strong>{" "}
                  {formatDate(detail.startDate)}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.endDate")}:</strong>{" "}
                  {formatDate(detail.endDate)}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.numberOfParticipants")}:</strong>{" "}
                  {detail.numberOfParticipants}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.budgetPerPerson")}:</strong>{" "}
                  {formatBudget(detail.budgetPerPersonUsd)}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.createdOn")}:</strong>{" "}
                  {formatDate(detail.createdOnUtc)}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.status")}:</strong>{" "}
                  <StatusBadge status={detail.status} />
                </div>

                <div className="md:col-span-2">
                  <strong>{t("tourRequest.admin.detail.travelInterests")}:</strong>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detail.travelInterests.length > 0 ? (
                      detail.travelInterests.map((interest) => (
                        <span
                          key={`${detail.id}-${interest}`}
                          className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {t(
                            `tourRequest.travelInterests.${interest.charAt(0).toLowerCase()}${interest.slice(1)}`,
                            {
                              defaultValue: interest,
                            },
                          )}
                        </span>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>

                <div>
                  <strong>{t("tourRequest.admin.detail.preferredAccommodation")}:</strong>{" "}
                  {detail.preferredAccommodation || "-"}
                </div>
                <div>
                  <strong>{t("tourRequest.admin.detail.transportationPreference")}:</strong>{" "}
                  {detail.transportationPreference || "-"}
                </div>
                <div className="md:col-span-2">
                  <strong>{t("tourRequest.admin.detail.specialRequests")}:</strong>{" "}
                  {detail.specialRequests || "-"}
                </div>
              </div>

              {canReview ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openReviewModal("approve")}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Icon icon="heroicons:check" className="size-4" />
                    {t("tourRequest.buttons.approve")}
                  </button>

                  <button
                    type="button"
                    onClick={() => openReviewModal("reject")}
                    className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    <Icon icon="heroicons:x-mark" className="size-4" />
                    {t("tourRequest.buttons.reject")}
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <p>
                    <strong>{t("tourRequest.admin.detail.reviewedAt")}:</strong>{" "}
                    {formatDate(detail.reviewedAt)}
                  </p>
                  <p className="mt-2">
                    <strong>{t("tourRequest.admin.detail.reviewedBy")}:</strong>{" "}
                    {detail.reviewedBy || "-"}
                  </p>
                  <p className="mt-2">
                    <strong>{t("tourRequest.admin.detail.adminNote")}:</strong>{" "}
                    {detail.adminNote || "-"}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {reviewAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {reviewAction === "approve"
                  ? t("tourRequest.admin.review.approveTitle")
                  : t("tourRequest.admin.review.rejectTitle")}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {reviewAction === "approve"
                  ? t("tourRequest.admin.review.approveDescription")
                  : t("tourRequest.admin.review.rejectDescription")}
              </p>
            </div>

            <div className="px-5 py-4">
              <label
                htmlFor="review-admin-note"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                {t("tourRequest.admin.review.adminNote")}
              </label>
              <textarea
                id="review-admin-note"
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                maxLength={2000}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />

              {reviewAction === "reject" && !adminNote.trim() && (
                <p className="mt-2 text-sm text-rose-600">
                  {t("tourRequest.admin.review.rejectionReasonRequired")}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={closeReviewModal}
                disabled={isSubmittingReview}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t("tourRequest.buttons.cancel")}
              </button>
              <button
                type="button"
                onClick={() => void submitReview()}
                disabled={
                  isSubmittingReview ||
                  (reviewAction === "reject" && !adminNote.trim())
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                  reviewAction === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isSubmittingReview && (
                  <Icon icon="heroicons:arrow-path" className="size-4 animate-spin" />
                )}
                {t("tourRequest.buttons.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </TourRequestAdminLayout>
  );
}
