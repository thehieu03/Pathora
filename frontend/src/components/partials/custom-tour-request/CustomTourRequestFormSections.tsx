import { useTranslation } from "react-i18next";

import {
  formatBudgetUsd,
  formatDateRange,
  formatParticipantsLabel,
} from "./formatters";
import { TravelInterestsSelector } from "./TravelInterestsSelector";
import type {
  CustomTourRequestFormValues,
  CustomTourRequestValidationErrors,
} from "./validation";
import type { CustomTourInterest } from "@/types/customTourRequest";

type FieldName = keyof CustomTourRequestFormValues;

interface CommonSectionProps {
  values: CustomTourRequestFormValues;
  errors: CustomTourRequestValidationErrors;
  languageKey: string;
  disabled: boolean;
  showError: (field: FieldName) => boolean;
  getErrorMessage: (field: FieldName) => string;
  onFieldChange: (field: FieldName, value: string) => void;
  onFieldBlur: (field: FieldName) => void;
  onToggleInterest: (interest: CustomTourInterest) => void;
}

function FieldError({ show, message }: { show: boolean; message: string }) {
  if (!show || !message) {
    return null;
  }

  return <p className="text-xs text-rose-600 mt-1">{message}</p>;
}

export function DestinationAndDatesSection({
  values,
  languageKey,
  disabled,
  showError,
  getErrorMessage,
  onFieldChange,
  onFieldBlur,
}: Omit<CommonSectionProps, "onToggleInterest" | "errors"> & {
  errors: CustomTourRequestValidationErrors;
}) {
  const { t } = useTranslation();

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        {t(
          "customTourRequest.sections.destinationDates.title",
          "Destination & Travel Dates",
        )}
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">
        {t(
          "customTourRequest.sections.destinationDates.subtitle",
          "Tell us where and when you want to travel.",
        )}
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {t("customTourRequest.fields.destination", "Destination")}
          </label>
          <input
            id="destination"
            name="destination"
            type="text"
            value={values.destination}
            onChange={(event) => onFieldChange("destination", event.target.value)}
            onBlur={() => onFieldBlur("destination")}
            aria-invalid={showError("destination")}
            disabled={disabled}
            placeholder={t(
              "customTourRequest.placeholders.destination",
              "e.g. Japan, Italy, Bali",
            )}
            className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
              showError("destination")
                ? "border-rose-500"
                : "border-slate-300 focus:border-orange-500"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          />
          <FieldError
            show={showError("destination")}
            message={getErrorMessage("destination")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t("customTourRequest.fields.startDate", "Start Date")}
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={values.startDate}
              onChange={(event) => onFieldChange("startDate", event.target.value)}
              onBlur={() => onFieldBlur("startDate")}
              aria-invalid={showError("startDate")}
              disabled={disabled}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                showError("startDate")
                  ? "border-rose-500"
                  : "border-slate-300 focus:border-orange-500"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            <FieldError
              show={showError("startDate")}
              message={getErrorMessage("startDate")}
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t("customTourRequest.fields.endDate", "End Date")}
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={values.endDate}
              onChange={(event) => onFieldChange("endDate", event.target.value)}
              onBlur={() => onFieldBlur("endDate")}
              aria-invalid={showError("endDate")}
              disabled={disabled}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                showError("endDate")
                  ? "border-rose-500"
                  : "border-slate-300 focus:border-orange-500"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            <FieldError
              show={showError("endDate")}
              message={getErrorMessage("endDate")}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {t("customTourRequest.labels.travelWindow", "Travel window")}: {" "}
          {formatDateRange(
            values.startDate,
            values.endDate,
            languageKey,
            t("common.noData", "No data"),
          )}
        </p>
      </div>
    </section>
  );
}

export function BudgetAndPreferencesSection({
  values,
  languageKey,
  disabled,
  showError,
  getErrorMessage,
  onFieldChange,
  onFieldBlur,
  onToggleInterest,
}: CommonSectionProps) {
  const { t } = useTranslation();
  const participantsValue = Number(values.participants);
  const budgetValue = Number(values.budgetPerPersonUsd);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        {t(
          "customTourRequest.sections.budgetPreferences.title",
          "Budget & Preferences",
        )}
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">
        {t(
          "customTourRequest.sections.budgetPreferences.subtitle",
          "Set your budget and travel preferences for a better proposal.",
        )}
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="participants"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t(
                "customTourRequest.fields.numberOfParticipants",
                "Number of Participants",
              )}
            </label>
            <input
              id="participants"
              name="participants"
              type="number"
              min={1}
              step={1}
              value={values.participants}
              onChange={(event) =>
                onFieldChange("participants", event.target.value)
              }
              onBlur={() => onFieldBlur("participants")}
              aria-invalid={showError("participants")}
              disabled={disabled}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                showError("participants")
                  ? "border-rose-500"
                  : "border-slate-300 focus:border-orange-500"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            <FieldError
              show={showError("participants")}
              message={getErrorMessage("participants")}
            />
            {Number.isFinite(participantsValue) && participantsValue > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {formatParticipantsLabel(
                  participantsValue,
                  t("customTourRequest.labels.participant", "participant"),
                  t("customTourRequest.labels.participants", "participants"),
                )}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="budgetPerPersonUsd"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t(
                "customTourRequest.fields.budgetPerPersonUsd",
                "Budget per person (USD)",
              )}
            </label>
            <input
              id="budgetPerPersonUsd"
              name="budgetPerPersonUsd"
              type="number"
              min={1}
              step={1}
              value={values.budgetPerPersonUsd}
              onChange={(event) =>
                onFieldChange("budgetPerPersonUsd", event.target.value)
              }
              onBlur={() => onFieldBlur("budgetPerPersonUsd")}
              aria-invalid={showError("budgetPerPersonUsd")}
              disabled={disabled}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                showError("budgetPerPersonUsd")
                  ? "border-rose-500"
                  : "border-slate-300 focus:border-orange-500"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            <FieldError
              show={showError("budgetPerPersonUsd")}
              message={getErrorMessage("budgetPerPersonUsd")}
            />
            {Number.isFinite(budgetValue) && budgetValue > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {formatBudgetUsd(budgetValue, languageKey)}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("customTourRequest.fields.travelInterests", "Travel Interests")}
          </label>
          <TravelInterestsSelector
            selectedInterests={values.travelInterests}
            onToggle={onToggleInterest}
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="preferredAccommodation"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t(
                "customTourRequest.fields.preferredAccommodation",
                "Preferred Accommodation",
              )}
            </label>
            <input
              id="preferredAccommodation"
              name="preferredAccommodation"
              type="text"
              value={values.preferredAccommodation}
              onChange={(event) =>
                onFieldChange("preferredAccommodation", event.target.value)
              }
              onBlur={() => onFieldBlur("preferredAccommodation")}
              disabled={disabled}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 border-slate-300 focus:border-orange-500 ${
                disabled ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="transportationPreference"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t(
                "customTourRequest.fields.transportationPreference",
                "Transportation Preference",
              )}
            </label>
            <input
              id="transportationPreference"
              name="transportationPreference"
              type="text"
              value={values.transportationPreference}
              onChange={(event) =>
                onFieldChange("transportationPreference", event.target.value)
              }
              onBlur={() => onFieldBlur("transportationPreference")}
              disabled={disabled}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 border-slate-300 focus:border-orange-500 ${
                disabled ? "opacity-60 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AdditionalDetailsSection({
  values,
  disabled,
  onFieldChange,
  onFieldBlur,
}: Omit<CommonSectionProps, "errors" | "languageKey" | "showError" | "getErrorMessage" | "onToggleInterest">) {
  const { t } = useTranslation();

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        {t(
          "customTourRequest.sections.additionalDetails.title",
          "Additional Details",
        )}
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-5">
        {t(
          "customTourRequest.sections.additionalDetails.subtitle",
          "Share any special requests or requirements.",
        )}
      </p>

      <div>
        <label
          htmlFor="specialRequests"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {t(
            "customTourRequest.fields.specialRequests",
            "Special Requests / Requirements",
          )}
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          value={values.specialRequests}
          onChange={(event) => onFieldChange("specialRequests", event.target.value)}
          onBlur={() => onFieldBlur("specialRequests")}
          rows={5}
          disabled={disabled}
          className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 border-slate-300 focus:border-orange-500 ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </section>
  );
}
