"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Icon } from "@/components/ui";
import {
  CreateTourInstancePayload,
  tourInstanceService,
} from "@/api/services/tourInstanceService";
import { tourService } from "@/api/services/tourService";
import { DynamicPricingDto, ImageDto, TourDto, TourVm } from "@/types/tour";

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
  sellingPrice: string;
  operatingCost: string;
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
  sellingPrice: "",
  operatingCost: "",
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
  sellingPrice: yup
    .number()
    .typeError("Selling price is required")
    .min(0, "Selling price cannot be negative")
    .required("Selling price is required"),
  operatingCost: yup
    .number()
    .typeError("Operating cost is required")
    .min(0, "Operating cost cannot be negative")
    .required("Operating cost is required"),
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

export function CreateTourInstancePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [tours, setTours] = useState<TourVm[]>([]);
  const [tourDetail, setTourDetail] = useState<TourDto | null>(null);
  const [loadingTour, setLoadingTour] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const result = await tourService.getAllTours(undefined, 1, 100);
      setTours(result?.data ?? []);
    } catch (error) {
      console.error("Failed to fetch tours", error);
      toast.error(t("tourInstance.fetchError", "Failed to load tour instances"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

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
        setForm((current) => ({ ...current, classificationId: "" }));
      } catch (error) {
        console.error("Failed to fetch tour detail", error);
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
      const fallbackPrice = selectedClassification.price ?? 0;
      const adultPrice = selectedClassification.adultPrice ?? fallbackPrice;
      const childPrice = selectedClassification.childPrice ?? adultPrice;
      const infantPrice = selectedClassification.infantPrice ?? 0;

      if (!next.title.trim()) {
        next.title = `${selectedTour?.tourName ?? "Tour"} - ${selectedClassification.name}`;
      }

      if (!next.basePrice) {
        next.basePrice = adultPrice.toString();
      }

      if (!next.sellingPrice) {
        next.sellingPrice = childPrice.toString();
      }

      if (!next.operatingCost) {
        next.operatingCost = infantPrice.toString();
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
        sellingPrice: Number(form.sellingPrice),
        operatingCost: Number(form.operatingCost),
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
        sellingPrice: Number(form.sellingPrice),
        operatingCost: Number(form.operatingCost),
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
    } catch (error) {
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

      console.error("Failed to create tour instance", error);
      toast.error(t("tourInstance.createError", "Failed to create tour instance"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {t("tourInstance.createTitle", "Create Tour Instance")}
            </h1>
            <p className="text-sm text-slate-500">
              {t(
                "tourInstance.createSubtitle",
                "Create a scheduled tour from a package template",
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/tour-instances")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              {t("tourInstance.cancel", "Cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
              <Icon icon="heroicons:check" className="size-4" />
              {submitting
                ? t("tourInstance.creating", "Creating...")
                : t("tourInstance.createAction", "Create instance")}
            </button>
          </div>
        </header>

        <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {t(
            "tourInstance.createInfo",
            "A Tour Instance is a scheduled occurrence with specific dates, capacity, and pricing.",
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-bold text-slate-900">
              {t("tourInstance.form.basicInfo", "Basic information")}
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("tourInstance.packageTour", "Package Tour")} *
              </label>
              <select
                className={inputClassName}
                value={form.tourId}
                onChange={(event) => updateField("tourId", event.target.value)}>
                <option value="">{t("tourInstance.selectPackageTour", "Select a package tour...")}</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.tourName}
                  </option>
                ))}
              </select>
              {errors.tourId && <p className="text-xs text-red-600">{errors.tourId}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("tourInstance.packageClassification", "Package Classification")} *
              </label>
              <select
                className={inputClassName}
                value={form.classificationId}
                disabled={!tourDetail || loadingTour}
                onChange={(event) =>
                  updateField("classificationId", event.target.value)
                }>
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
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
              <label className="text-sm font-semibold text-slate-700">
                {t("tourInstance.instanceType", "Tour Instance Type")} *
              </label>
              <select
                className={inputClassName}
                value={form.instanceType}
                onChange={(event) => updateField("instanceType", event.target.value)}>
                <option value="1">{t("tourInstance.private", "Private")}</option>
                <option value="2">{t("tourInstance.public", "Public")}</option>
              </select>
              {errors.instanceType && (
                <p className="text-xs text-red-600">{errors.instanceType}</p>
              )}
            </div>
          </div>

          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-bold text-slate-900">
              {t("tourInstance.form.scheduleAndCapacity", "Schedule and capacity")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
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
                <label className="text-sm font-semibold text-slate-700">
                  {t("tourInstance.endDate", "End Date")} *
                </label>
                <input
                  type="date"
                  className={inputClassName}
                  value={form.endDate}
                  onChange={(event) => updateField("endDate", event.target.value)}
                />
                {errors.endDate && <p className="text-xs text-red-600">{errors.endDate}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
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
                <label className="text-sm font-semibold text-slate-700">
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
                <label className="text-sm font-semibold text-slate-700">
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
                <label className="text-sm font-semibold text-slate-700">
                  {t("tourInstance.form.sellingPrice", "Selling price")} *
                </label>
                <input
                  type="number"
                  min={0}
                  className={inputClassName}
                  value={form.sellingPrice}
                  onChange={(event) => updateField("sellingPrice", event.target.value)}
                />
                {errors.sellingPrice && (
                  <p className="text-xs text-red-600">{errors.sellingPrice}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("tourInstance.form.operatingCost", "Operating cost")} *
                </label>
                <input
                  type="number"
                  min={0}
                  className={inputClassName}
                  value={form.operatingCost}
                  onChange={(event) =>
                    updateField("operatingCost", event.target.value)
                  }
                />
                {errors.operatingCost && (
                  <p className="text-xs text-red-600">{errors.operatingCost}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
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
                <label className="text-sm font-semibold text-slate-700">
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
                <label className="text-sm font-semibold text-slate-700">
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
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.includedServices", "Included Services")}
          </h2>
          <div className="mt-4 space-y-2">
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
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
                  {t("common.remove", "Remove")}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendListItem("includedServices")}
              className="rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">
              + {t("tourInstance.form.addService", "Add service")}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.guide", "Guide")}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
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

          <div className="mt-4 space-y-2">
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
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
                  {t("common.remove", "Remove")}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendListItem("guideLanguages")}
              className="rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">
              + {t("tourInstance.form.addLanguage", "Add language")}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.form.media", "Media")}
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
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
                <p className="text-xs text-slate-500">{thumbnailFile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
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
                <p className="text-xs text-slate-500">
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
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
                  {t("common.remove", "Remove")}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendListItem("imageUrls")}
              className="rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">
              + {t("tourInstance.form.addImage", "Add image")}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-bold text-slate-900">
            {t("tourInstance.dynamicPricing", "Dynamic Pricing")}
          </h2>
          <div className="mt-4 space-y-3">
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
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
                  {t("common.remove", "Remove")}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTier}
              className="rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">
              + {t("tourInstance.form.addPricingTier", "Add pricing tier")}
            </button>
            {errors.dynamicPricing && (
              <p className="text-xs text-red-600">{errors.dynamicPricing}</p>
            )}
          </div>
        </section>

        {selectedClassification && (
          <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {t("tourInstance.form.selectedClassification", "Selected classification")}: {" "}
            <strong>{selectedClassification.name}</strong>
          </section>
        )}
      </div>
    </main>
  );
}
