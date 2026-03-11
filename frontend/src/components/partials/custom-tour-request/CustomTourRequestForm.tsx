"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { customTourRequestService } from "@/services/customTourRequestService";
import type { CustomTourInterest, CustomTourRequest } from "@/types/customTourRequest";
import type { Status } from "@/types";

import {
  AdditionalDetailsSection,
  BudgetAndPreferencesSection,
  DestinationAndDatesSection,
} from "./CustomTourRequestFormSections";
import { CustomTourRequestStatusBadge } from "./CustomTourRequestStatusBadge";
import { mapValidationErrorCodeToMessageKey } from "./formatters";
import {
  createEmptyCustomTourRequestFormValues,
  hasValidationErrors,
  mapFormValuesToPayload,
  validateCustomTourRequestForm,
  type CustomTourRequestFormValues,
} from "./validation";

type FieldName = keyof CustomTourRequestFormValues;

const DEFAULT_VALIDATION_FALLBACK: Record<string, string> = {
  destinationRequired: "Destination is required.",
  startDateRequired: "Start date is required.",
  startDateInvalid: "Start date is invalid.",
  endDateRequired: "End date is required.",
  endDateInvalid: "End date is invalid.",
  endDateBeforeStartDate: "End date must be on or after start date.",
  participantsRequired: "Number of participants is required.",
  participantsInvalid: "Participants must be at least 1.",
  budgetRequired: "Budget per person is required.",
  budgetInvalid: "Budget per person must be greater than 0.",
};

export function CustomTourRequestForm() {
  const { t, i18n } = useTranslation();
  const languageKey = i18n.resolvedLanguage || i18n.language;

  const [values, setValues] = useState<CustomTourRequestFormValues>(
    createEmptyCustomTourRequestFormValues(),
  );
  const [touchedFields, setTouchedFields] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<Status>("idle");
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>("");
  const [submittedRequest, setSubmittedRequest] = useState<CustomTourRequest | null>(null);

  const validateAndUpdateErrors = (nextValues: CustomTourRequestFormValues) => {
    const nextErrors = validateCustomTourRequestForm(nextValues);
    setErrors(nextErrors);
    return nextErrors;
  };

  const updateField = (field: FieldName, value: string) => {
    setValues((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (submittedOnce || touchedFields[field]) {
        validateAndUpdateErrors(next);
      }

      return next;
    });
  };

  const toggleInterest = (interest: CustomTourInterest) => {
    setValues((prev) => {
      const nextInterests = prev.travelInterests.includes(interest)
        ? prev.travelInterests.filter((item) => item !== interest)
        : [...prev.travelInterests, interest];

      const next = {
        ...prev,
        travelInterests: nextInterests,
      };

      if (submittedOnce) {
        validateAndUpdateErrors(next);
      }

      return next;
    });
  };

  const markFieldTouched = (field: FieldName) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    const nextValues = {
      ...values,
    };
    validateAndUpdateErrors(nextValues);
  };

  const getErrorMessage = (field: FieldName): string => {
    const code = errors[field];
    if (!code) {
      return "";
    }

    const messageKey = mapValidationErrorCodeToMessageKey(code);
    return t(messageKey, DEFAULT_VALIDATION_FALLBACK[code] ?? t("customTourRequest.validation.default", "Please check this field."));
  };

  const showError = (field: FieldName): boolean => {
    return Boolean(errors[field] && (submittedOnce || touchedFields[field]));
  };

  const isSubmitting = submitStatus === "loading";

  const successStatus = useMemo(() => {
    if (submittedRequest?.status) {
      return submittedRequest.status;
    }
    return "pending";
  }, [submittedRequest]);

  const resetForm = () => {
    setValues(createEmptyCustomTourRequestFormValues());
    setTouchedFields({});
    setSubmittedOnce(false);
    setErrors({});
    setSubmitStatus("idle");
    setSubmitErrorMessage("");
    setSubmittedRequest(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmittedOnce(true);
    const nextErrors = validateAndUpdateErrors(values);
    if (hasValidationErrors(nextErrors)) {
      return;
    }

    setSubmitStatus("loading");
    setSubmitErrorMessage("");

    const response = await customTourRequestService.submitPublicRequest(
      mapFormValuesToPayload(values),
    );

    if (!response.success || !response.data) {
      setSubmitStatus("error");
      setSubmitErrorMessage(
        t(
          `error_response.${response.error?.message ?? "DEFAULT_ERROR"}`,
          response.error?.message ??
            t(
              "customTourRequest.submit.errorMessage",
              "Failed to submit your request. Please try again.",
            ),
        ),
      );
      return;
    }

    setSubmittedRequest(response.data);
    setSubmitStatus("success");
  };

  if (submitStatus === "success" && submittedRequest) {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
            ✓
          </span>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {t(
                "customTourRequest.submit.successTitle",
                "Request submitted successfully",
              )}
            </h3>
            <p className="text-sm text-slate-600">
              {t(
                "customTourRequest.submit.successSubtitle",
                "Our team will review your request and contact you soon.",
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-slate-500">
              {t("customTourRequest.labels.requestCode", "Request Code")}
            </p>
            <p className="text-base font-semibold text-slate-900 mt-0.5">
              {submittedRequest.requestCode}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-slate-500">
              {t("customTourRequest.labels.currentStatus", "Current Status")}
            </p>
            <div className="mt-1">
              <CustomTourRequestStatusBadge status={successStatus} />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 p-4 text-sm text-orange-900">
          <p className="font-medium">
            {t(
              "customTourRequest.submit.nextStepsTitle",
              "Next steps",
            )}
          </p>
          <p className="mt-1">
            {t(
              "customTourRequest.submit.nextStepsDescription",
              "You can track progress in My Custom Tour Requests. We may contact you for additional details.",
            )}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/my-custom-tour-requests"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            {t("customTourRequest.actions.viewMyRequests", "View My Requests")}
          </Link>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            {t(
              "customTourRequest.actions.submitAnother",
              "Submit another request",
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {submitStatus === "error" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitErrorMessage}
        </div>
      )}

      <DestinationAndDatesSection
        values={values}
        errors={errors}
        languageKey={languageKey}
        disabled={isSubmitting}
        showError={showError}
        getErrorMessage={getErrorMessage}
        onFieldChange={updateField}
        onFieldBlur={markFieldTouched}
      />

      <BudgetAndPreferencesSection
        values={values}
        errors={errors}
        languageKey={languageKey}
        disabled={isSubmitting}
        showError={showError}
        getErrorMessage={getErrorMessage}
        onFieldChange={updateField}
        onFieldBlur={markFieldTouched}
        onToggleInterest={toggleInterest}
      />

      <AdditionalDetailsSection
        values={values}
        disabled={isSubmitting}
        onFieldChange={updateField}
        onFieldBlur={markFieldTouched}
      />

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting && (
            <span
              className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"
              aria-hidden="true"
            />
          )}
          {isSubmitting
            ? t("customTourRequest.submit.loading", "Submitting...")
            : t("customTourRequest.submit.cta", "Submit Custom Tour Request")}
        </button>
      </div>
    </form>
  );
}
