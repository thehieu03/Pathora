"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { customTourRequestService } from "@/services/customTourRequestService";
import type {
  CustomTourRequest,
  CustomTourRequestStatus,
  CustomTourReviewDecision,
} from "@/types/customTourRequest";

interface AdminReviewPanelProps {
  requestId: string;
  currentStatus: CustomTourRequestStatus;
  onReviewSuccess: (request: CustomTourRequest) => void;
}

export function AdminReviewPanel({
  requestId,
  currentStatus,
  onReviewSuccess,
}: AdminReviewPanelProps) {
  const { t } = useTranslation();
  const [adminNote, setAdminNote] = useState("");
  const [loadingDecision, setLoadingDecision] = useState<CustomTourReviewDecision | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitReview = async (decision: CustomTourReviewDecision) => {
    if (decision === "rejected" && !adminNote.trim()) {
      setErrorMessage(
        t(
          "customTourRequest.admin.review.rejectNoteRequired",
          "Admin note is required when rejecting a request.",
        ),
      );
      return;
    }

    setLoadingDecision(decision);
    setErrorMessage("");
    setSuccessMessage("");

    const response = await customTourRequestService.reviewRequest(requestId, {
      decision,
      adminNote: adminNote.trim() || null,
    });

    if (!response.success || !response.data) {
      setErrorMessage(
        t(
          "customTourRequest.admin.review.actionError",
          "Unable to update request status.",
        ),
      );
      setLoadingDecision(null);
      return;
    }

    setSuccessMessage(
      t(
        "customTourRequest.admin.review.actionSuccess",
        "Request status has been updated.",
      ),
    );
    onReviewSuccess(response.data);
    setLoadingDecision(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">
        {t("customTourRequest.admin.review.title", "Review Action")}
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        {t(
          "customTourRequest.admin.review.subtitle",
          "Approve or reject this request. Rejecting requires an admin note.",
        )}
      </p>

      {currentStatus !== "pending" && (
        <p className="mt-3 text-sm text-slate-600">
          {t(
            "customTourRequest.admin.review.alreadyReviewed",
            "This request is already reviewed. You can still leave a new note and re-submit.",
          )}
        </p>
      )}

      <div className="mt-4">
        <label
          htmlFor="adminNote"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {t("customTourRequest.labels.adminNote", "Admin Note")}
        </label>
        <textarea
          id="adminNote"
          name="adminNote"
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      {errorMessage && (
        <p className="mt-3 text-sm text-rose-600">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mt-3 text-sm text-emerald-600">{successMessage}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => submitReview("approved")}
          disabled={Boolean(loadingDecision)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loadingDecision === "approved" && (
            <span
              className="w-4 h-4 border-2 border-white/70 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
          )}
          {t("customTourRequest.status.approved", "Approved")}
        </button>

        <button
          type="button"
          onClick={() => submitReview("rejected")}
          disabled={Boolean(loadingDecision)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loadingDecision === "rejected" && (
            <span
              className="w-4 h-4 border-2 border-white/70 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
          )}
          {t("customTourRequest.status.rejected", "Rejected")}
        </button>
      </div>
    </div>
  );
}
