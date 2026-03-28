"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Icon, CollapsibleSection } from "@/components/ui";
import {
  CreateTourInstancePayload,
  tourInstanceService,
} from "@/api/services/tourInstanceService";
import { tourService } from "@/api/services/tourService";
import { userService } from "@/api/services/userService";
import { handleApiError } from "@/utils/apiResponse";
import { SearchTourVm, TourClassificationDto, TourDto, UserInfo } from "@/types/tour";

type FormState = {
  tourId: string;
  classificationId: string;
  title: string;
  instanceType: string;
  startDate: string;
  endDate: string;
  maxParticipation: string;
  basePrice: string;
  location: string;
  confirmationDeadline: string;
  includedServices: string[];
  guideUserIds: string[];
  managerUserIds: string[];
};

const INITIAL_FORM: FormState = {
  tourId: "",
  classificationId: "",
  title: "",
  instanceType: "1",
  startDate: "",
  endDate: "",
  maxParticipation: "",
  basePrice: "",
  location: "",
  confirmationDeadline: "",
  includedServices: [],
  guideUserIds: [],
  managerUserIds: [],
};

// ─── Wizard Step Constants ────────────────────────────────────────────────────
const SELECT_TOUR_STEP = 0;
const INSTANCE_DETAILS_STEP = 1;

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
                className={`h-px w-8 transition-colors ${
                  isCompleted ? "bg-emerald-500" : "bg-stone-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── SelectTourStep ────────────────────────────────────────────────────────────
interface SelectTourStepProps {
  form: FormState;
  errors: Record<string, string>;
  inputClassName: string;
  t: ReturnType<typeof useTranslation>["t"];
  tours: SearchTourVm[];
  tourDetail: TourDto | null;
  loadingTour: boolean;
  loading: boolean;
  loadError: string | null;
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
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
  inputClassName,
  t,
  updateField,
  setReloadToken,
  onNext,
  onCancel,
}: SelectTourStepProps) {
  const canProceed = Boolean(form.tourId && form.classificationId);

  return (
    <div className="space-y-6">
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
              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 active:scale-98 whitespace-nowrap"
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
              <option value="">
                {t("tourInstance.selectPackageTour", "Select a package tour...")}
              </option>
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
            <option value="">
              {t("tourInstance.selectClassification", "Select a classification...")}
            </option>
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

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 active:scale-98"
        >
          {t("tourInstance.cancel", "Cancel")}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled-opacity-50 active:scale-98"
        >
          {t("tourInstance.wizard.next", "Next")}
          <Icon icon="heroicons:arrow-right" className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ─── ManagerUserChip ─────────────────────────────────────────────────────────
interface ManagerChipProps {
  user: UserInfo;
  onRemove: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

function ManagerChip({ user, onRemove, t }: ManagerChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt=""
          className="size-5 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <Icon icon="heroicons:user" className="size-3" />
      )}
      <span className="max-w-24 truncate">
        {user.fullName || user.username || user.email}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 flex size-3.5 items-center justify-center rounded-full text-orange-500 hover:text-orange-700"
      >
        <Icon icon="heroicons:x-mark" className="size-3" />
      </button>
    </span>
  );
}

// ─── InstanceDetailsStep ───────────────────────────────────────────────────────
interface InstanceDetailsStepProps {
  form: FormState;
  errors: Record<string, string>;
  inputClassName: string;
  t: ReturnType<typeof useTranslation>["t"];
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  allUsers: UserInfo[];
  submitting: boolean;
  selectedClassification: TourClassificationDto | null;
  onSubmit: () => void;
  onPrevious: () => void;
  appendListItem: (field: "includedServices") => void;
  removeListItem: (field: "includedServices", index: number) => void;
  updateListItem: (
    field: "includedServices",
    index: number,
    value: string,
  ) => void;
}

function InstanceDetailsStep({
  form,
  errors,
  inputClassName,
  t,
  updateField,
  allUsers,
  submitting,
  selectedClassification,
  onSubmit,
  onPrevious,
  appendListItem,
  removeListItem,
  updateListItem,
}: InstanceDetailsStepProps) {
  const guides = useMemo(
    () => allUsers.filter((u) => !u.isDeleted),
    [allUsers],
  );

  const selectedGuides = useMemo(
    () => guides.filter((u) => form.guideUserIds.includes(u.id)),
    [guides, form.guideUserIds],
  );
  const selectedManagers = useMemo(
    () => guides.filter((u) => form.managerUserIds.includes(u.id)),
    [guides, form.managerUserIds],
  );

  const toggleUser = (
    userId: string,
    field: "guideUserIds" | "managerUserIds",
  ) => {
    const current = form[field];
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    updateField(field, next);
  };

  return (
    <div className="space-y-5">
      {/* Classification summary */}
      {selectedClassification && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)]">
          {t(
            "tourInstance.form.selectedClassification",
            "Selected classification",
          )}
          : <strong>{selectedClassification.name}</strong>
          {selectedClassification.basePrice != null && (
            <span className="ml-2 text-emerald-600">
              —{" "}
              {t("tourInstance.form.classificationBasePrice", "Base Price")}:{" "}
              {Number(selectedClassification.basePrice).toLocaleString("vi-VN")} VND
            </span>
          )}
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
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700">
              {t("tourInstance.instanceType", "Tour Instance Type")} *
            </label>
            <select
              className={inputClassName}
              value={form.instanceType}
              onChange={(event) =>
                updateField("instanceType", event.target.value)
              }
            >
              <option value="1">
                {t("tourInstance.private", "Private")}
              </option>
              <option value="2">
                {t("tourInstance.public", "Public")}
              </option>
            </select>
            {errors.instanceType && (
              <p className="text-xs text-red-600">{errors.instanceType}</p>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Schedule & Pricing */}
      <CollapsibleSection
        title={t(
          "tourInstance.wizard.section.scheduleAndPricing",
          "Schedule & Pricing",
        )}
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
                onChange={(event) =>
                  updateField("startDate", event.target.value)
                }
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
                onChange={(event) =>
                  updateField("endDate", event.target.value)
                }
              />
              {errors.endDate && (
                <p className="text-xs text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
                <p className="text-xs text-red-600">
                  {errors.maxParticipation}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.form.basePrice", "Base Price (Snapshot)")} *
              </label>
              <input
                type="number"
                min={0}
                className={inputClassName}
                value={form.basePrice}
                onChange={(event) =>
                  updateField("basePrice", event.target.value)
                }
              />
              <p className="text-xs text-stone-400">
                {t(
                  "tourInstance.form.basePriceHint",
                  "Snapshot from classification. Can be overridden for special departures.",
                )}
              </p>
              {errors.basePrice && (
                <p className="text-xs text-red-600">{errors.basePrice}</p>
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
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder={t(
                  "tourInstance.form.locationPlaceholder",
                  "Ex: Ha Long",
                )}
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

      {/* Guides */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.guides", "Guides")}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {selectedGuides.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedGuides.map((guide) => (
                <ManagerChip
                  key={guide.id}
                  user={guide}
                  onRemove={() => toggleUser(guide.id, "guideUserIds")}
                  t={t}
                />
              ))}
            </div>
          )}
          <select
            className={inputClassName}
            value=""
            onChange={(e) => {
              if (e.target.value) toggleUser(e.target.value, "guideUserIds");
              e.target.value = "";
            }}
          >
            <option value="">
              {t("tourInstance.form.addGuide", "+ Add guide")}
            </option>
            {guides
              .filter((u) => !form.guideUserIds.includes(u.id))
              .map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.fullName || guide.username || guide.email}
                </option>
              ))}
          </select>
        </div>
      </CollapsibleSection>

      {/* Managers */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.managers", "Managers")}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {selectedManagers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedManagers.map((mgr) => (
                <ManagerChip
                  key={mgr.id}
                  user={mgr}
                  onRemove={() => toggleUser(mgr.id, "managerUserIds")}
                  t={t}
                />
              ))}
            </div>
          )}
          <select
            className={inputClassName}
            value=""
            onChange={(e) => {
              if (e.target.value)
                toggleUser(e.target.value, "managerUserIds");
              e.target.value = "";
            }}
          >
            <option value="">
              {t("tourInstance.form.addManager", "+ Add manager")}
            </option>
            {guides
              .filter((u) => !form.managerUserIds.includes(u.id))
              .map((mgr) => (
                <option key={mgr.id} value={mgr.id}>
                  {mgr.fullName || mgr.username || mgr.email}
                </option>
              ))}
          </select>
        </div>
      </CollapsibleSection>

      {/* Included Services */}
      <CollapsibleSection
        title={t("tourInstance.wizard.section.services", "Included Services")}
        defaultOpen={false}
      >
        <div className="space-y-2">
          {form.includedServices.map((service, index) => (
            <div key={`svc-${index}`} className="flex items-center gap-2">
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
                className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 whitespace-nowrap"
              >
                {t("common.remove", "Remove")}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendListItem("includedServices")}
            className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50"
          >
            + {t("tourInstance.form.addService", "Add service")}
          </button>
        </div>
      </CollapsibleSection>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100"
        >
          <Icon icon="heroicons:arrow-left" className="size-4" />
          {t("tourInstance.wizard.previous", "Previous")}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled-opacity-60"
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

// ─── Main Component ─────────────────────────────────────────────────────────
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
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reloadToken, setReloadToken] = useState(0);
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);

  const selectedTour = useMemo(
    () => tours.find((tour) => tour.id === form.tourId) ?? null,
    [form.tourId, tours],
  );

  const selectedClassification = useMemo(
    () =>
      tourDetail?.classifications?.find(
        (c) => c.id === form.classificationId,
      ) ?? null,
    [form.classificationId, tourDetail],
  );

  // Fetch tours
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

  // Fetch all users for guide/manager selection
  const fetchUsers = useCallback(async () => {
    try {
      const users = await userService.getAll(undefined, 1, 100);
      setAllUsers(users ?? []);
    } catch (error: unknown) {
      console.error("Failed to fetch users:", error);
      setAllUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchTours();
    fetchUsers();
  }, [fetchTours, fetchUsers]);

  // Load tour detail when tour selected
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
            if (next.location.trim() === "" && detail.location) {
              next.location = detail.location;
            }
            if (
              next.includedServices.length === 0 &&
              detail.includedServices?.length > 0
            ) {
              next.includedServices = detail.includedServices;
            }
          }

          return next;
        });
      } catch (error: unknown) {
        const handledError = handleApiError(error);
        console.error(
          "Failed to fetch tour detail:",
          handledError.message,
        );
        toast.error(
          t("toast.failedToLoadTourDetails", "Failed to load tour details"),
        );
      } finally {
        setLoadingTour(false);
      }
    };

    loadTourDetail();
  }, [form.tourId, t]);

  // Auto-fill basePrice and title when classification selected
  useEffect(() => {
    if (!selectedClassification) return;

    setForm((current) => {
      const next = { ...current };
      const fallbackPrice =
        selectedClassification.basePrice ?? selectedClassification.price ?? 0;

      if (!next.title.trim()) {
        next.title = `${selectedTour?.tourName ?? "Tour"} - ${
          selectedClassification.name
        }`;
      }

      if (next.basePrice === "" || next.basePrice === "0") {
        next.basePrice = fallbackPrice > 0 ? String(fallbackPrice) : "";
      }

      return next;
    });
  }, [selectedClassification, selectedTour?.tourName]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field as string]) return current;
      const next = { ...current };
      delete next[field as string];
      return next;
    });
  };

  const appendListItem = (field: "includedServices") => {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  };

  const removeListItem = (
    field: "includedServices",
    index: number,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (
    field: "includedServices",
    index: number,
    value: string,
  ) => {
    setForm((current) => {
      const items = [...current[field]];
      items[index] = value;
      return { ...current, [field]: items };
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!form.title.trim())
      newErrors.title = t("tourInstance.validation.titleRequired", "Title is required");
    if (!form.startDate)
      newErrors.startDate = t(
        "tourInstance.validation.startDateRequired",
        "Start date is required",
      );
    if (!form.endDate)
      newErrors.endDate = t(
        "tourInstance.validation.endDateRequired",
        "End date is required",
      );
    if (!form.maxParticipation || Number(form.maxParticipation) <= 0)
      newErrors.maxParticipation = t(
        "tourInstance.validation.maxParticipantsRequired",
        "Maximum participants must be greater than 0",
      );
    if (form.basePrice === "" || form.basePrice === null || form.basePrice === undefined)
      newErrors.basePrice = t(
        "tourInstance.validation.basePriceRequired",
        "Base price is required",
      );
    else if (Number(form.basePrice) < 0)
      newErrors.basePrice = t(
        "tourInstance.validation.basePriceNonNegative",
        "Base price must be 0 or greater",
      );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);

      const payload: CreateTourInstancePayload = {
        tourId: form.tourId,
        classificationId: form.classificationId,
        title: form.title.trim(),
        instanceType: Number(form.instanceType),
        startDate: form.startDate,
        endDate: form.endDate,
        maxParticipation: Number(form.maxParticipation),
        basePrice: Number(form.basePrice),
        location: form.location.trim() || undefined,
        confirmationDeadline: form.confirmationDeadline || undefined,
        includedServices: form.includedServices
          .map((s) => s.trim())
          .filter(Boolean),
        guideUserIds: form.guideUserIds,
        managerUserIds: form.managerUserIds,
      };

      await tourInstanceService.createInstance(payload);
      toast.success(
        t("tourInstance.created", "Tour instance created successfully!"),
      );
      router.push("/tour-instances");
    } catch (error: unknown) {
      const handledError = handleApiError(error);
      console.error(
        "Failed to create tour instance:",
        handledError.message,
      );
      toast.error(
        t("tourInstance.createError", "Failed to create tour instance"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

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
            form={form}
            errors={errors}
            tours={tours}
            tourDetail={tourDetail}
            loadingTour={loadingTour}
            loading={loading}
            loadError={loadError}
            updateField={updateField}
            setReloadToken={setReloadToken}
            onNext={() => setCurrentStep(INSTANCE_DETAILS_STEP)}
            onCancel={() => router.push("/tour-instances")}
            inputClassName={inputClassName}
            t={t}
          />
        ) : (
          <InstanceDetailsStep
            form={form}
            errors={errors}
            allUsers={allUsers}
            submitting={submitting}
            selectedClassification={selectedClassification}
            onSubmit={handleSubmit}
            onPrevious={() => setCurrentStep(SELECT_TOUR_STEP)}
            appendListItem={appendListItem}
            removeListItem={removeListItem}
            updateListItem={updateListItem}
            updateField={updateField}
            inputClassName={inputClassName}
            t={t}
          />
        )}
      </div>
    </main>
  );
}
