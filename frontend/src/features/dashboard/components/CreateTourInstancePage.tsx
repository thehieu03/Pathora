"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Icon, CollapsibleSection } from "@/components/ui";
import {
  CreateTourInstancePayload,
  tourInstanceService,
} from "@/api/services/tourInstanceService";
import { tourService } from "@/api/services/tourService";
import { handleApiError } from "@/utils/apiResponse";
import { DynamicPricingDto, ImageDto, SearchTourVm, TourClassificationDto, TourDto } from "@/types/tour";

type DynamicTierForm = {
  minParticipants: string;
  maxParticipants: string;
  pricePerPerson: string;
};

type FormState = {
  tourId: string;
  classificationId: string;
  title: string;
  instanceType: string;
  startDate: string;
  endDate: string;
  minParticipation: string;
  maxParticipation: string;
  basePrice: string;
  depositPerPerson: string;
  location: string;
  confirmationDeadline: string;
  includedServices: string[];
  guideName: string;
  guideAvatarUrl: string;
  guideLanguages: string[];
  guideExperience: string;
  thumbnailUrl: string;
  imageUrls: string[];
  dynamicPricing: DynamicTierForm[];
};

const INITIAL_FORM: FormState = {
  tourId: "",
  classificationId: "",
  title: "",
  instanceType: "2",
  startDate: "",
  endDate: "",
  minParticipation: "",
  maxParticipation: "",
  basePrice: "",
  depositPerPerson: "",
  location: "",
  confirmationDeadline: "",
  includedServices: [],
  guideName: "",
  guideAvatarUrl: "",
  guideLanguages: [],
  guideExperience: "",
  thumbnailUrl: "",
  imageUrls: [],
  dynamicPricing: [],
};

const toImageDto = (publicURL: string): ImageDto => ({
  fileId: null,
  originalFileName: null,
  fileName: null,
  publicURL,
});

const createSchema = yup.object({
  tourId: yup.string().required("Tour is required"),
  classificationId: yup.string().required("Classification is required"),
  title: yup.string().trim().required("Title is required"),
  instanceType: yup
    .number()
    .typeError("Instance type is required")
    .oneOf([1, 2], "Instance type must be Private or Public")
    .required("Instance type is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup
    .string()
    .required("End date is required")
    .test("after-start", "End date must be after start date", function (value) {
      const { startDate } = this.parent as { startDate: string };
      if (!value || !startDate) return true;
      return new Date(value).getTime() > new Date(startDate).getTime();
    }),
  minParticipation: yup
    .number()
    .typeError("Minimum participants is required")
    .min(0, "Minimum participants cannot be negative")
    .required("Minimum participants is required"),
  maxParticipation: yup
    .number()
    .typeError("Maximum participants is required")
    .moreThan(0, "Maximum participants must be greater than 0")
    .test(
      "max-gte-min",
      "Maximum participants must be greater than or equal to minimum",
      function (value) {
        const { minParticipation } = this.parent as { minParticipation: number };
        if (value == null || minParticipation == null) return true;
        return value >= minParticipation;
      },
    )
    .required("Maximum participants is required"),
  basePrice: yup
    .number()
    .typeError("Base price is required")
    .min(0, "Base price cannot be negative")
    .required("Base price is required"),
  depositPerPerson: yup
    .number()
    .typeError("Deposit per person is required")
    .min(0, "Deposit per person cannot be negative")
    .required("Deposit per person is required"),
});

const normalizeDynamicPricing = (
  tiers: DynamicTierForm[],
): { data: DynamicPricingDto[]; error?: string } => {
  const normalized = tiers
    .map((tier) => ({
      minParticipants: Number(tier.minParticipants || 0),
      maxParticipants: Number(tier.maxParticipants || 0),
      pricePerPerson: Number(tier.pricePerPerson || 0),
    }))
    .filter(
      (tier) =>
        tier.minParticipants > 0 ||
        tier.maxParticipants > 0 ||
        tier.pricePerPerson > 0,
    );

  for (const tier of normalized) {
    if (tier.minParticipants <= 0) {
      return {
        data: [],
        error: "Dynamic pricing min participants must be greater than 0",
      };
    }

    if (tier.maxParticipants < tier.minParticipants) {
      return {
        data: [],
        error:
          "Dynamic pricing max participants must be greater than or equal to min",
      };
    }

    if (tier.pricePerPerson < 0) {
      return {
        data: [],
        error: "Dynamic pricing price per person cannot be negative",
      };
    }
  }

  const ordered = [...normalized].sort((left, right) => {
    if (left.minParticipants !== right.minParticipants) {
      return left.minParticipants - right.minParticipants;
    }

    return left.maxParticipants - right.maxParticipants;
  });

  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index].minParticipants <= ordered[index - 1].maxParticipants) {
      return {
        data: [],
        error: "Dynamic pricing ranges must not overlap",
      };
    }
  }

  return { data: normalized };
};

// ─── Wizard Step Constants ────────────────────────────────────────────────────
const SELECT_TOUR_STEP = 0;
const INSTANCE_DETAILS_STEP = 1;

// ─── Shared Props ─────────────────────────────────────────────────────────────
interface SharedProps {
  form: FormState;
  errors: Record<string, string>;
  inputClassName: string;
  t: ReturnType<typeof useTranslation>["t"];
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  setThumbnailFile: React.Dispatch<React.SetStateAction<File | null>>;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  thumbnailFile: File | null;
  imageFiles: File[];
}

// ─── Step Indicator ────────────────────────────────────────────────────────────
interface StepIndicatorProps {
  currentStep: number;
  t: ReturnType<typeof useTranslation>["t"];
}

function StepIndicator({ currentStep, t }: StepIndicatorProps) {
  const steps = [
    { num: 1, label: t("tourInstance.wizard.step1", "Select Tour") },
    { num: 2, label: t("tourInstance.wizard.step2", "Instance Details") },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.num - 1;
        const isCompleted = currentStep > step.num - 1;
        return (
          <React.Fragment key={step.num}>
            <div className="flex items-center gap-2">
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-orange-500 text-white"
                      : "bg-stone-200 text-stone-500"
                }`}
              >
                {isCompleted ? (
                  <Icon icon="heroicons:check" className="size-4" />
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-orange-600" : isCompleted ? "text-emerald-600" : "text-stone-400"
                }`}
              >
                {t("tourInstance.wizard.step", "Step")} {step.num}: {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 transition-colors ${isCompleted ? "bg-emerald-500" : "bg-stone-200"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── SelectTourStep ────────────────────────────────────────────────────────────
interface SelectTourStepProps extends SharedProps {
  tours: SearchTourVm[];
  tourDetail: TourDto | null;
  loadingTour: boolean;
  loading: boolean;
  loadError: string | null;
  setReloadToken: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
  onCancel: () => void;
}

function SelectTourStep({
  form,
  errors,
  tours,
  tourDetail,
  loadingTour,
  loading,
  loadError,
  setReloadToken,
  inputClassName,
  t,
  updateField,
  onNext,
  onCancel,
}: SelectTourStepProps) {
  const canProceed = Boolean(form.tourId && form.classificationId);

  return (
    <div className="space-y-6">
      {/* Tour selection card */}
      <div className="space-y-6 rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <h2 className="text-base font-bold text-stone-900">
          {t("tourInstance.wizard.step1", "Step 1: Select Tour")}
        </h2>

        {loadError && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <div>
              <p className="text-sm font-semibold text-red-800">{loadError}</p>
            </div>
            <button
              onClick={() => setReloadToken((v) => v + 1)}
              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 active:scale-[0.98] transition-colors whitespace-nowrap"
            >
              {t("common.retry", "Retry")}
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-stone-700">
            {t("tourInstance.packageTour", "Package Tour")} *
          </label>
          {loading && !loadError ? (
            <div className="space-y-2">
              <div className="skeleton h-10 w-full rounded-xl" />
              <div className="skeleton h-10 w-full rounded-xl" />
            </div>
          ) : (
            <select
              className={inputClassName}
              value={form.tourId}
              disabled={!!loadError}
              onChange={(event) => updateField("tourId", event.target.value)}
            >
              <option value="">{t("tourInstance.selectPackageTour", "Select a package tour...")}</option>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.tourName}
                </option>
              ))}
            </select>
          )}
          {errors.tourId && <p className="text-xs text-red-600">{errors.tourId}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-stone-700">
            {t("tourInstance.packageClassification", "Package Classification")} *
          </label>
          <select
            className={inputClassName}
            value={form.classificationId}
            disabled={!tourDetail || loadingTour}
            onChange={(event) => updateField("classificationId", event.target.value)}
          >
            <option value="">{t("tourInstance.selectClassification", "Select a classification...")}</option>
            {(tourDetail?.classifications ?? []).map((classification) => (
              <option key={classification.id} value={classification.id}>
                {classification.name}
              </option>
            ))}
          </select>
          {errors.classificationId && (
            <p className="text-xs text-red-600">{errors.classificationId}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all"
        >
          {t("tourInstance.cancel", "Cancel")}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] transition-all"
        >
          {t("tourInstance.wizard.next", "Next")}
          <Icon icon="heroicons:arrow-right" className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ─── InstanceDetailsStep ───────────────────────────────────────────────────────
interface InstanceDetailsStepProps extends SharedProps {
  tourDetail: TourDto | null;
  submitting: boolean;
  onSubmit: () => void;
  onPrevious: () => void;
  selectedClassification: TourClassificationDto | null;
  updateListItem: (
    field: "includedServices" | "guideLanguages" | "imageUrls",
    index: number,
    value: string,
  ) => void;
  appendListItem: (field: "includedServices" | "guideLanguages" | "imageUrls") => void;
  removeListItem: (
    field: "includedServices" | "guideLanguages" | "imageUrls",
    index: number,
  ) => void;
  updateTier: (index: number, field: keyof DynamicTierForm, value: string) => void;
  addTier: () => void;
  removeTier: (index: number) => void;
}

function InstanceDetailsStep({
  form,
  errors,
  inputClassName,
  t,
  updateField,
  setThumbnailFile,
  setImageFiles,
  thumbnailFile,
  imageFiles,
  selectedClassification,
  submitting,
  onSubmit,
  onPrevious,
  updateListItem,
  appendListItem,
  removeListItem,
  updateTier,
  addTier,
  removeTier,
}: InstanceDetailsStepProps) {
  return (
    <div className="space-y-5">
      {/* Classification summary banner */}
      {selectedClassification && (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)]">
          {t("tourInstance.form.selectedClassification", "Selected classification")}:{" "}
          <strong>{selectedClassification.name}</strong>
        </div>
      )}

      {/* Basic Info */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.basicInfo", "Basic Information")}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">
              {t("tourInstance.form.title", "Title")} *
            </label>
            <input
              className={inputClassName}
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder={t(
                "tourInstance.form.titlePlaceholder",
                "Ex: Ha Long 3N2D - June Departure",
              )}
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">
              {t("tourInstance.instanceType", "Tour Instance Type")} *
            </label>
            <select
              className={inputClassName}
              value={form.instanceType}
              onChange={(event) => updateField("instanceType", event.target.value)}
            >
              <option value="1">{t("tourInstance.private", "Private")}</option>
              <option value="2">{t("tourInstance.public", "Public")}</option>
            </select>
            {errors.instanceType && (
              <p className="text-xs text-red-600">{errors.instanceType}</p>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Schedule & Pricing */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.scheduleAndPricing", "Schedule & Pricing")}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.startDate", "Start Date")} *
              </label>
              <input
                type="date"
                className={inputClassName}
                value={form.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
              />
              {errors.startDate && (
                <p className="text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.endDate", "End Date")} *
              </label>
              <input
                type="date"
                className={inputClassName}
                value={form.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
              />
              {errors.endDate && (
                <p className="text-xs text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.form.minParticipation", "Minimum participants")} *
              </label>
              <input
                type="number"
                min={0}
                className={inputClassName}
                value={form.minParticipation}
                onChange={(event) =>
                  updateField("minParticipation", event.target.value)
                }
              />
              {errors.minParticipation && (
                <p className="text-xs text-red-600">{errors.minParticipation}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.maxParticipants", "Maximum Participants")} *
              </label>
              <input
                type="number"
                min={1}
                className={inputClassName}
                value={form.maxParticipation}
                onChange={(event) =>
                  updateField("maxParticipation", event.target.value)
                }
              />
              {errors.maxParticipation && (
                <p className="text-xs text-red-600">{errors.maxParticipation}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.basePrice", "Base Price")} *
              </label>
              <input
                type="number"
                min={0}
                className={inputClassName}
                value={form.basePrice}
                onChange={(event) => updateField("basePrice", event.target.value)}
              />
              {errors.basePrice && (
                <p className="text-xs text-red-600">{errors.basePrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.form.depositPerPerson", "Deposit per person")} *
              </label>
              <input
                type="number"
                min={0}
                className={inputClassName}
                value={form.depositPerPerson}
                onChange={(event) =>
                  updateField("depositPerPerson", event.target.value)
                }
              />
              {errors.depositPerPerson && (
                <p className="text-xs text-red-600">{errors.depositPerPerson}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.location", "Location")}
              </label>
              <input
                className={inputClassName}
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder={t("tourInstance.form.locationPlaceholder", "Ex: Ha Long")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.confirmationDeadline", "Confirmation Deadline")}
              </label>
              <input
                type="date"
                className={inputClassName}
                value={form.confirmationDeadline}
                onChange={(event) =>
                  updateField("confirmationDeadline", event.target.value)
                }
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Included Services */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.services", "Included Services")}
        defaultOpen={false}
      >
        <div className="space-y-2">
          {form.includedServices.map((service, index) => (
            <div key={`service-${index}`} className="flex items-center gap-2">
              <input
                className={inputClassName}
                value={service}
                onChange={(event) =>
                  updateListItem("includedServices", index, event.target.value)
                }
                placeholder={t(
                  "tourInstance.form.includedServicesPlaceholder",
                  "Ex: Shuttle bus",
                )}
              />
              <button
                type="button"
                onClick={() => removeListItem("includedServices", index)}
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                {t("common.remove", "Remove")}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendListItem("includedServices")}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all"
          >
            + {t("tourInstance.form.addService", "Add service")}
          </button>
        </div>
      </CollapsibleSection>

      {/* Guide */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.guide", "Guide")}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClassName}
              value={form.guideName}
              onChange={(event) => updateField("guideName", event.target.value)}
              placeholder={t("tourInstance.form.guideName", "Guide name")}
            />
            <input
              className={inputClassName}
              value={form.guideAvatarUrl}
              onChange={(event) => updateField("guideAvatarUrl", event.target.value)}
              placeholder={t("tourInstance.form.guideAvatar", "Guide avatar URL")}
            />
            <input
              className={inputClassName}
              value={form.guideExperience}
              onChange={(event) =>
                updateField("guideExperience", event.target.value)
              }
              placeholder={t("tourInstance.form.guideExperience", "Guide experience")}
            />
          </div>

          <div className="space-y-2">
            {form.guideLanguages.map((language, index) => (
              <div key={`language-${index}`} className="flex items-center gap-2">
                <input
                  className={inputClassName}
                  value={language}
                  onChange={(event) =>
                    updateListItem("guideLanguages", index, event.target.value)
                  }
                  placeholder={t("tourInstance.form.guideLanguage", "Language code")}
                />
                <button
                  type="button"
                  onClick={() => removeListItem("guideLanguages", index)}
                  className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  {t("common.remove", "Remove")}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendListItem("guideLanguages")}
              className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all"
            >
              + {t("tourInstance.form.addLanguage", "Add language")}
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* Media */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.media", "Media")}
        defaultOpen={false}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">
              {t("tourInstance.form.thumbnailUpload", "Thumbnail upload")}
            </label>
            <input
              type="file"
              accept="image/*"
              className={inputClassName}
              onChange={(event) =>
                setThumbnailFile(event.target.files?.[0] ?? null)
              }
            />
            {thumbnailFile && (
              <p className="text-xs text-stone-500">{thumbnailFile.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">
              {t("tourInstance.form.imagesUpload", "Gallery upload")}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className={inputClassName}
              onChange={(event) =>
                setImageFiles(Array.from(event.target.files ?? []))
              }
            />
            {imageFiles.length > 0 && (
              <p className="text-xs text-stone-500">
                {t("tourInstance.form.filesSelected", "Files selected")}: {imageFiles.length}
              </p>
            )}
          </div>

          <input
            className={inputClassName}
            value={form.thumbnailUrl}
            onChange={(event) => updateField("thumbnailUrl", event.target.value)}
            placeholder={t("tourInstance.form.thumbnailUrl", "Thumbnail URL")}
          />

          {form.imageUrls.map((imageUrl, index) => (
            <div key={`image-${index}`} className="flex items-center gap-2">
              <input
                className={inputClassName}
                value={imageUrl}
                onChange={(event) =>
                  updateListItem("imageUrls", index, event.target.value)
                }
                placeholder={t("tourInstance.form.imageUrl", "Image URL")}
              />
              <button
                type="button"
                onClick={() => removeListItem("imageUrls", index)}
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                {t("common.remove", "Remove")}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendListItem("imageUrls")}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all"
          >
            + {t("tourInstance.form.addImage", "Add image")}
          </button>
        </div>
      </CollapsibleSection>

      {/* Dynamic Pricing */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.dynamicPricing", "Dynamic Pricing")}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {form.dynamicPricing.map((tier, index) => (
            <div key={`tier-${index}`} className="grid gap-2 md:grid-cols-4">
              <input
                type="number"
                min={1}
                className={inputClassName}
                value={tier.minParticipants}
                onChange={(event) =>
                  updateTier(index, "minParticipants", event.target.value)
                }
                placeholder={t("tourInstance.form.minParticipants", "Min participants")}
              />
              <input
                type="number"
                min={1}
                className={inputClassName}
                value={tier.maxParticipants}
                onChange={(event) =>
                  updateTier(index, "maxParticipants", event.target.value)
                }
                placeholder={t("tourInstance.form.maxParticipants", "Max participants")}
              />
              <input
                type="number"
                min={0}
                className={inputClassName}
                value={tier.pricePerPerson}
                onChange={(event) =>
                  updateTier(index, "pricePerPerson", event.target.value)
                }
                placeholder={t("tourInstance.form.pricePerPerson", "Price per person")}
              />
              <button
                type="button"
                onClick={() => removeTier(index)}
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all"
              >
                {t("common.remove", "Remove")}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTier}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all"
          >
            + {t("tourInstance.form.addPricingTier", "Add pricing tier")}
          </button>
          {errors.dynamicPricing && (
            <p className="text-xs text-red-600">{errors.dynamicPricing}</p>
          )}
        </div>
      </CollapsibleSection>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all"
        >
          <Icon icon="heroicons:arrow-left" className="size-4" />
          {t("tourInstance.wizard.previous", "Previous")}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] transition-all"
        >
          <Icon icon="heroicons:check" className="size-4" />
          {submitting
            ? t("tourInstance.creating", "Creating...")
            : t("tourInstance.createAction", "Create instance")}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CreateTourInstancePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(SELECT_TOUR_STEP);

  const [tours, setTours] = useState<SearchTourVm[]>([]);
  const [tourDetail, setTourDetail] = useState<TourDto | null>(null);
  const [loadingTour, setLoadingTour] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reloadToken, setReloadToken] = useState(0);

  const selectedTour = useMemo(
    () => tours.find((tour) => tour.id === form.tourId) ?? null,
    [form.tourId, tours],
  );

  const selectedClassification = useMemo(
    () =>
      tourDetail?.classifications?.find(
        (classification) => classification.id === form.classificationId,
      ) ?? null,
    [form.classificationId, tourDetail],
  );

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const result = await tourService.getAllTours(undefined, 1, 100);
      setTours(result?.data ?? []);
    } catch (error: unknown) {
      const handledError = handleApiError(error);
      console.error("Failed to fetch tours:", handledError.message);
      setLoadError(handledError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours, reloadToken]);

  useEffect(() => {
    if (!form.tourId) {
      setTourDetail(null);
      setForm((current) => ({ ...current, classificationId: "" }));
      return;
    }

    const loadTourDetail = async () => {
      try {
        setLoadingTour(true);
        const detail = await tourService.getTourDetail(form.tourId);
        setTourDetail(detail);
        setForm((current) => {
          const next = { ...current, classificationId: "" };

          if (detail) {
            if (!next.thumbnailUrl.trim() && detail.thumbnail?.publicURL) {
              next.thumbnailUrl = detail.thumbnail.publicURL;
            }

            if (next.imageUrls.length === 0 && detail.images?.length > 0) {
              next.imageUrls = detail.images
                .map((img) => img.publicURL)
                .filter((url): url is string => Boolean(url));
            }

            if (!next.location.trim() && detail.location) {
              next.location = detail.location;
            }

            if (next.includedServices.length === 0 && detail.includedServices?.length > 0) {
              next.includedServices = detail.includedServices;
            }
          }

          return next;
        });
      } catch (error: unknown) {
        const handledError = handleApiError(error);
        console.error("Failed to fetch tour detail:", handledError.message);
        toast.error(
          t("toast.failedToLoadTourDetails", "Failed to load tour details"),
        );
      } finally {
        setLoadingTour(false);
      }
    };

    loadTourDetail();
  }, [form.tourId, t]);

  useEffect(() => {
    if (!selectedClassification) {
      return;
    }

    setForm((current) => {
      const next = { ...current };
      const fallbackPrice = selectedClassification.basePrice ?? selectedClassification.price ?? 0;

      if (!next.title.trim()) {
        next.title = `${selectedTour?.tourName ?? "Tour"} - ${selectedClassification.name}`;
      }

      if (!next.basePrice) {
        next.basePrice = fallbackPrice.toString();
      }

      return next;
    });
  }, [selectedClassification, selectedTour?.tourName]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field as string]) return current;
      const next = { ...current };
      delete next[field as string];
      return next;
    });
  };

  const updateListItem = (
    field: "includedServices" | "guideLanguages" | "imageUrls",
    index: number,
    value: string,
  ) => {
    setForm((current) => {
      const items = [...current[field]];
      items[index] = value;
      return { ...current, [field]: items };
    });
  };

  const appendListItem = (
    field: "includedServices" | "guideLanguages" | "imageUrls",
  ) => {
    setForm((current) => ({ ...current, [field]: [...current[field], ""] }));
  };

  const removeListItem = (
    field: "includedServices" | "guideLanguages" | "imageUrls",
    index: number,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateTier = (index: number, field: keyof DynamicTierForm, value: string) => {
    setForm((current) => {
      const tiers = [...current.dynamicPricing];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...current, dynamicPricing: tiers };
    });
  };

  const addTier = () => {
    setForm((current) => ({
      ...current,
      dynamicPricing: [
        ...current.dynamicPricing,
        { minParticipants: "", maxParticipants: "", pricePerPerson: "" },
      ],
    }));
  };

  const removeTier = (index: number) => {
    setForm((current) => ({
      ...current,
      dynamicPricing: current.dynamicPricing.filter(
        (_, tierIndex) => tierIndex !== index,
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      setErrors({});

      const payloadForValidation = {
        ...form,
        instanceType: Number(form.instanceType),
        minParticipation: Number(form.minParticipation),
        maxParticipation: Number(form.maxParticipation),
        basePrice: Number(form.basePrice),
        depositPerPerson: Number(form.depositPerPerson),
      };

      await createSchema.validate(payloadForValidation, { abortEarly: false });

      const dynamicPricing = normalizeDynamicPricing(form.dynamicPricing);
      if (dynamicPricing.error) {
        setErrors((current) => ({ ...current, dynamicPricing: dynamicPricing.error as string }));
        return;
      }

      setSubmitting(true);

      const includedServices = form.includedServices
        .map((service) => service.trim())
        .filter(Boolean);
      const guideLanguages = form.guideLanguages
        .map((language) => language.trim())
        .filter(Boolean);
      const imageUrls = form.imageUrls.map((url) => url.trim()).filter(Boolean);

      const payload: CreateTourInstancePayload = {
        tourId: form.tourId,
        classificationId: form.classificationId,
        title: form.title.trim(),
        instanceType: Number(form.instanceType),
        startDate: form.startDate,
        endDate: form.endDate,
        minParticipation: Number(form.minParticipation),
        maxParticipation: Number(form.maxParticipation),
        basePrice: Number(form.basePrice),
        depositPerPerson: Number(form.depositPerPerson),
        location: form.location.trim() || undefined,
        confirmationDeadline: form.confirmationDeadline || undefined,
        includedServices: includedServices.length > 0 ? includedServices : undefined,
        guide: form.guideName.trim()
          ? {
              name: form.guideName.trim(),
              avatarUrl: form.guideAvatarUrl.trim() || null,
              languages: guideLanguages,
              experience: form.guideExperience.trim() || null,
            }
          : undefined,
        thumbnail: form.thumbnailUrl.trim()
          ? toImageDto(form.thumbnailUrl.trim())
          : undefined,
        images: imageUrls.length > 0 ? imageUrls.map((url) => toImageDto(url)) : undefined,
        dynamicPricing:
          dynamicPricing.data.length > 0 ? dynamicPricing.data : undefined,
      };

      await tourInstanceService.createInstance(payload);

      toast.success(t("tourInstance.created", "Tour instance created successfully!"));
      router.push("/tour-instances");
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        const nextErrors: Record<string, string> = {};
        for (const issue of error.inner) {
          if (issue.path && !nextErrors[issue.path]) {
            nextErrors[issue.path] = issue.message;
          }
        }
        setErrors(nextErrors);
        return;
      }

      const handledError = handleApiError(error);
      console.error("Failed to create tour instance:", handledError.message);
      toast.error(t("tourInstance.createError", "Failed to create tour instance"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  const sharedProps: SharedProps = {
    form,
    errors,
    inputClassName,
    t,
    updateField,
    setThumbnailFile,
    setImageFiles,
    thumbnailFile,
    imageFiles,
  };

  return (
    <main className="min-h-screen bg-stone-50 p-6 md:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[2.5rem] border border-stone-200 bg-white p-4 md:p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <div>
            <h1 className="text-xl font-bold text-stone-900">
              {t("tourInstance.createTitle", "Create Tour Instance")}
            </h1>
            <p className="text-sm text-stone-500">
              {t(
                "tourInstance.createSubtitle",
                "Create a scheduled tour from a package template",
              )}
            </p>
          </div>
          <StepIndicator currentStep={currentStep} t={t} />
        </header>

        {/* Info banner */}
        <section className="rounded-[2.5rem] border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          {t(
            "tourInstance.createInfo",
            "A Tour Instance is a scheduled occurrence with specific dates, capacity, and pricing.",
          )}
        </section>

        {/* Step Content */}
        {currentStep === SELECT_TOUR_STEP ? (
          <SelectTourStep
            {...sharedProps}
            tours={tours}
            tourDetail={tourDetail}
            loadingTour={loadingTour}
            loading={loading}
            loadError={loadError}
            setReloadToken={setReloadToken}
            onNext={() => setCurrentStep(INSTANCE_DETAILS_STEP)}
            onCancel={() => router.push("/tour-instances")}
          />
        ) : (
          <InstanceDetailsStep
            {...sharedProps}
            tourDetail={tourDetail}
            submitting={submitting}
            onSubmit={handleSubmit}
            onPrevious={() => setCurrentStep(SELECT_TOUR_STEP)}
            selectedClassification={selectedClassification}
            updateListItem={updateListItem}
            appendListItem={appendListItem}
            removeListItem={removeListItem}
            updateTier={updateTier}
            addTier={addTier}
            removeTier={removeTier}
          />
        )}
      </div>
    </main>
  );
}
