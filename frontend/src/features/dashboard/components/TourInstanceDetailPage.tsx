"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Icon } from "@/components/ui";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import {
  tourInstanceService,
  UpdateTourInstancePayload,
} from "@/api/services/tourInstanceService";
import {
  DynamicPricingDto,
  ImageDto,
  NormalizedTourInstanceDto,
  TourInstanceStatusMap,
} from "@/types/tour";
import { handleApiError } from "@/utils/apiResponse";

type DynamicTierForm = {
  minParticipants: string;
  maxParticipants: string;
  pricePerPerson: string;
};

type EditForm = {
  title: string;
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

const inputClassName =
  "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

const toDateInput = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const toImageDto = (publicURL: string): ImageDto => ({
  fileId: null,
  originalFileName: null,
  fileName: null,
  publicURL,
});

const toEditForm = (data: NormalizedTourInstanceDto): EditForm => ({
  title: data.title ?? "",
  startDate: toDateInput(data.startDate),
  endDate: toDateInput(data.endDate),
  minParticipation: String(data.minParticipation ?? 0),
  maxParticipation: String(data.maxParticipation ?? 0),
  basePrice: String(data.basePrice ?? 0),
  sellingPrice: String(data.sellingPrice ?? 0),
  operatingCost: String(data.operatingCost ?? 0),
  depositPerPerson: String(data.depositPerPerson ?? 0),
  location: data.location ?? "",
  confirmationDeadline: toDateInput(data.confirmationDeadline),
  includedServices: data.includedServices ?? [],
  guideName: data.guide?.name ?? "",
  guideAvatarUrl: data.guide?.avatarUrl ?? "",
  guideLanguages: data.guide?.languages ?? [],
  guideExperience: data.guide?.experience ?? "",
  thumbnailUrl: data.thumbnail?.publicURL ?? "",
  imageUrls: (data.images ?? []).map((image) => image.publicURL ?? "").filter(Boolean),
  dynamicPricing: (data.dynamicPricing ?? []).map((tier) => ({
    minParticipants: String(tier.minParticipants),
    maxParticipants: String(tier.maxParticipants),
    pricePerPerson: String(tier.pricePerPerson),
  })),
});

const updateSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
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

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const normalized = status.trim().toLowerCase().replace(/[\s_]+/g, "");
  const config = TourInstanceStatusMap[normalized] ?? {
    label: status,
    bg: "bg-stone-100",
    text: "text-stone-700",
    dot: "bg-stone-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`size-2 rounded-full ${config.dot}`} />
      {t(`tourInstance.statusLabels.${normalized}`, config.label)}
    </span>
  );
}

const formatCurrency = (value: number): string =>
  `${new Intl.NumberFormat("vi-VN").format(value)} VND`;

type InstanceDetailDataState = "loading" | "ready" | "error";

export default function TourInstanceDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [dataState, setDataState] = useState<InstanceDetailDataState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<NormalizedTourInstanceDto | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const participantRatio = useMemo(() => {
    if (!data || data.maxParticipation <= 0) return 0;
    return Math.min(
      100,
      Math.round((data.currentParticipation / data.maxParticipation) * 100),
    );
  }, [data]);

  const loadData = useCallback(async () => {
    try {
      setDataState("loading");
      setErrorMessage(null);
      const detail = await tourInstanceService.getInstanceDetail(id);
      setData(detail);
      setForm(detail ? toEditForm(detail) : null);
      setDataState("ready");
    } catch (error: unknown) {
      const apiError = handleApiError(error);
      toast.error(apiError.message || t("tourInstance.fetchError", "Failed to load tour instance details"));
      setData(null);
      setForm(null);
      setDataState("error");
      setErrorMessage(apiError.message);
    }
  }, [id, t]);

  useEffect(() => {
    let active = true;
    const doLoad = async () => {
      try {
        setDataState("loading");
        setErrorMessage(null);
        const detail = await tourInstanceService.getInstanceDetail(id);
        if (!active) return;
        setData(detail);
        setForm(detail ? toEditForm(detail) : null);
        setDataState("ready");
      } catch (error: unknown) {
        if (!active) return;
        const apiError = handleApiError(error);
        toast.error(apiError.message || t("tourInstance.fetchError", "Failed to load tour instance details"));
        setData(null);
        setForm(null);
        setDataState("error");
        setErrorMessage(apiError.message);
      }
    };
    void doLoad();
    return () => { active = false; };
  }, [id, t, reloadToken]);

  const updateField = <K extends keyof EditForm>(field: K, value: EditForm[K]) => {
    setForm((current) => (current ? { ...current, [field]: value } : current));
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
      if (!current) return current;
      const items = [...current[field]];
      items[index] = value;
      return { ...current, [field]: items };
    });
  };

  const appendListItem = (
    field: "includedServices" | "guideLanguages" | "imageUrls",
  ) => {
    setForm((current) => {
      if (!current) return current;
      return { ...current, [field]: [...current[field], ""] };
    });
  };

  const removeListItem = (
    field: "includedServices" | "guideLanguages" | "imageUrls",
    index: number,
  ) => {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const updateTier = (index: number, field: keyof DynamicTierForm, value: string) => {
    setForm((current) => {
      if (!current) return current;
      const tiers = [...current.dynamicPricing];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...current, dynamicPricing: tiers };
    });
  };

  const addTier = () => {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        dynamicPricing: [
          ...current.dynamicPricing,
          { minParticipants: "", maxParticipants: "", pricePerPerson: "" },
        ],
      };
    });
  };

  const removeTier = (index: number) => {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        dynamicPricing: current.dynamicPricing.filter(
          (_, tierIndex) => tierIndex !== index,
        ),
      };
    });
  };

  const handleCancelEdit = () => {
    if (!data) return;
    setForm(toEditForm(data));
    setErrors({});
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!data || !form) return;

    try {
      setErrors({});

      const payloadForValidation = {
        ...form,
        minParticipation: Number(form.minParticipation),
        maxParticipation: Number(form.maxParticipation),
        basePrice: Number(form.basePrice),
        sellingPrice: Number(form.sellingPrice),
        operatingCost: Number(form.operatingCost),
        depositPerPerson: Number(form.depositPerPerson),
      };

      await updateSchema.validate(payloadForValidation, { abortEarly: false });

      const dynamicPricing = normalizeDynamicPricing(form.dynamicPricing);
      if (dynamicPricing.error) {
        setErrors((current) => ({
          ...current,
          dynamicPricing: dynamicPricing.error as string,
        }));
        return;
      }

      setSaving(true);

      const includedServices = form.includedServices
        .map((service) => service.trim())
        .filter(Boolean);
      const guideLanguages = form.guideLanguages
        .map((language) => language.trim())
        .filter(Boolean);
      const imageUrls = form.imageUrls.map((url) => url.trim()).filter(Boolean);

      const payload: UpdateTourInstancePayload = {
        id: data.id,
        title: form.title.trim(),
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

      await tourInstanceService.updateInstance(payload);
      toast.success(t("tourInstance.updated", "Tour instance updated successfully!"));

      await loadData();
      setIsEditing(false);
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

      const apiError = handleApiError(error);
      toast.error(apiError.message || "Failed to update tour instance");
    } finally {
      setSaving(false);
    }
  };

  if (dataState === "loading") {
    return (
      <main className="min-h-screen bg-stone-50 p-6 md:p-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <SkeletonCard />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard lines={6} />
            <SkeletonCard lines={6} />
          </div>
        </div>
      </main>
    );
  }

  if (dataState === "error" || !data || !form) {
    return (
      <main className="min-h-screen bg-stone-50 p-6 md:p-8">
        <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-stone-200 bg-white p-8 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <Icon
            icon="heroicons:exclamation-circle"
            className="mx-auto mb-2 size-10 text-stone-400"
          />
          <p className="text-base font-semibold text-stone-900">
            {dataState === "error"
              ? t("tourInstance.form.error.title", "Could not load tour instance")
              : t("tourInstance.notFound", "Tour instance not found")}
          </p>
          {dataState === "error" && errorMessage && (
            <p className="text-sm text-stone-500 mt-2">{errorMessage}</p>
          )}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setReloadToken((v) => v + 1)}
              className="px-3 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-colors"
            >
              {t("common.retry", "Retry")}
            </button>
            <Link
              href="/tour-instances"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 active:-translate-y-[1px] transition-all">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {t("tourInstance.backToInstances", "Back to Tour Instances")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 p-6 md:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-[2.5rem] border border-stone-200 bg-white p-4 md:p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => router.push("/tour-instances")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-stone-900 active:-translate-y-[1px] transition-all">
                <Icon icon="heroicons:arrow-left" className="size-4" />
                {t("tourInstance.backToInstances", "Back to Tour Instances")}
              </button>
              <h1 className="text-xl font-bold tracking-tight text-stone-900">{data.title}</h1>
              <p className="text-sm text-stone-500">
                {data.tourName} &bull; {data.tourInstanceCode}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={data.status} />
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 active:scale-[0.98] transition-all">
                  <Icon icon="heroicons:pencil-square" className="size-4" />
                  {t("tourInstance.edit", "Edit")}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all">
                    {t("tourInstance.cancel", "Cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] transition-all">
                    <Icon icon="heroicons:check" className="size-4" />
                    {saving ? t("common.saving", "Saving...") : t("common.save", "Save")}
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {!isEditing ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-[2.5rem] border border-stone-200 bg-white p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  {t("tourInstance.participants", "Participants")}
                </p>
                <p className="mt-2 text-2xl font-bold text-stone-900">
                  {data.currentParticipation}/{data.maxParticipation}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${participantRatio}%` }}
                  />
                </div>
              </article>
              <article className="rounded-[2.5rem] border border-stone-200 bg-white p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  {t("tourInstance.basePrice", "Base Price")}
                </p>
                <p className="mt-2 text-xl font-bold text-orange-500">
                  {formatCurrency(data.basePrice)}
                </p>
              </article>
              <article className="rounded-[2.5rem] border border-stone-200 bg-white p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  {t("tourInstance.form.sellingPrice", "Selling price")}
                </p>
                <p className="mt-2 text-xl font-bold text-orange-500">
                  {formatCurrency(data.sellingPrice)}
                </p>
              </article>
              <article className="rounded-[2.5rem] border border-stone-200 bg-white p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  {t("tourInstance.form.depositPerPerson", "Deposit per person")}
                </p>
                <p className="mt-2 text-xl font-bold text-orange-500">
                  {formatCurrency(data.depositPerPerson)}
                </p>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <h2 className="text-base font-bold text-stone-900">
                  {t("tourInstance.tourInformation", "Tour Information")}
                </h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.form.title", "Title")}</dt>
                    <dd className="font-semibold text-stone-900">{data.title}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.tourInstanceCode", "Tour Instance Code")}</dt>
                    <dd className="font-semibold text-stone-900">{data.tourInstanceCode}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.instanceType", "Tour Instance Type")}</dt>
                    <dd className="font-semibold text-stone-900">{data.instanceType}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.classification", "Classification")}</dt>
                    <dd className="font-semibold text-stone-900">{data.classificationName}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.location", "Location")}</dt>
                    <dd className="font-semibold text-stone-900">{data.location || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.startDate", "Start Date")}</dt>
                    <dd className="font-semibold text-stone-900">{toDateInput(data.startDate)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.endDate", "End Date")}</dt>
                    <dd className="font-semibold text-stone-900">{toDateInput(data.endDate)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.form.minParticipation", "Minimum participants")}</dt>
                    <dd className="font-semibold text-stone-900">{data.minParticipation}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.maxParticipants", "Maximum Participants")}</dt>
                    <dd className="font-semibold text-stone-900">{data.maxParticipation}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.form.currentParticipation", "Current participants")}</dt>
                    <dd className="font-semibold text-stone-900">{data.currentParticipation}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.form.operatingCost", "Operating cost")}</dt>
                    <dd className="font-semibold text-stone-900">{formatCurrency(data.operatingCost)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt className="text-stone-500">{t("tourInstance.confirmationDeadline", "Confirmation Deadline")}</dt>
                    <dd className="font-semibold text-stone-900">{toDateInput(data.confirmationDeadline) || "—"}</dd>
                  </div>
                  {data.cancellationReason && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-stone-500">{t("tourInstance.form.cancellationReason", "Cancellation reason")}</dt>
                      <dd className="text-right font-semibold text-stone-700">{data.cancellationReason}</dd>
                    </div>
                  )}
                </dl>
              </article>

              <article className="rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                <h2 className="text-base font-bold text-stone-900">
                  {t("tourInstance.tourGuide", "Tour Guide")}
                </h2>
                {data.guide ? (
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="font-semibold text-stone-900">{data.guide.name}</p>
                    <p className="text-stone-600">
                      {t("tourInstance.languages", "Languages")}: {" "}
                      {data.guide.languages.join(", ") || "—"}
                    </p>
                    <p className="text-stone-600">
                      {t("tourInstance.experience", "Experience")}: {" "}
                      {data.guide.experience || "—"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-stone-500">
                    {t("tourInstance.noGuide", "No guide assigned")}
                  </p>
                )}

                <h3 className="mt-6 text-sm font-bold text-stone-900">
                  {t("tourInstance.includedServices", "Included Services")}
                </h3>
                {data.includedServices.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {data.includedServices.map((service) => (
                      <li
                        key={service}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                        {service}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-stone-500">—</p>
                )}
              </article>
            </section>

            <section className="rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <h2 className="text-base font-bold text-stone-900">
                {t("tourInstance.dynamicPricing", "Dynamic Pricing")}
              </h2>
              {data.dynamicPricing.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-200 text-left text-stone-500">
                        <th className="px-2 py-2">{t("tourInstance.form.minParticipants", "Min participants")}</th>
                        <th className="px-2 py-2">{t("tourInstance.form.maxParticipants", "Max participants")}</th>
                        <th className="px-2 py-2">{t("tourInstance.form.pricePerPerson", "Price per person")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.dynamicPricing.map((tier, index) => (
                        <tr key={`${tier.minParticipants}-${tier.maxParticipants}-${index}`} className="border-b border-stone-100">
                          <td className="px-2 py-2 text-stone-700">{tier.minParticipants}</td>
                          <td className="px-2 py-2 text-stone-700">{tier.maxParticipants}</td>
                          <td className="px-2 py-2 font-semibold text-orange-500">
                            {formatCurrency(tier.pricePerPerson)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone-500">—</p>
              )}
            </section>

            <section className="rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <h2 className="text-base font-bold text-stone-900">
                {t("tourInstance.form.media", "Media")}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.images.length > 0 ? (
                  data.images.map((image, index) => (
                    <div
                      key={`${image.publicURL}-${index}`}
                      className="overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                      {image.publicURL ? (
                        <img
                          src={image.publicURL}
                          alt={`${data.title} image ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-36 items-center justify-center text-stone-400">
                          <Icon icon="heroicons:photo" className="size-6" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-500">—</p>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="space-y-6 rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <h2 className="text-base font-bold text-stone-900">
              {t("tourInstance.form.editInformation", "Edit tour instance")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">
                  {t("tourInstance.form.title", "Title")} *
                </label>
                <input
                  className={inputClassName}
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                />
                {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">
                  {t("tourInstance.location", "Location")}
                </label>
                <input
                  className={inputClassName}
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                />
              </div>
            </div>

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
                {errors.endDate && <p className="text-xs text-red-600">{errors.endDate}</p>}
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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">
                {t("tourInstance.includedServices", "Included Services")}
              </label>
              <div className="space-y-2">
                {form.includedServices.map((service, index) => (
                  <div key={`service-${index}`} className="flex items-center gap-2">
                    <input
                      className={inputClassName}
                      value={service}
                      onChange={(event) =>
                        updateListItem("includedServices", index, event.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem("includedServices", index)}
                      className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all">
                      {t("common.remove", "Remove")}
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendListItem("includedServices")}
                  className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all">
                  + {t("tourInstance.form.addService", "Add service")}
                </button>
              </div>
            </div>

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
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all">
                    {t("common.remove", "Remove")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendListItem("guideLanguages")}
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all">
                + {t("tourInstance.form.addLanguage", "Add language")}
              </button>
            </div>

            <div className="space-y-2">
              <input
                className={inputClassName}
                value={form.thumbnailUrl}
                onChange={(event) => updateField("thumbnailUrl", event.target.value)}
                placeholder={t("tourInstance.form.thumbnailUrl", "Thumbnail URL")}
              />
              {form.imageUrls.map((url, index) => (
                <div key={`image-${index}`} className="flex items-center gap-2">
                  <input
                    className={inputClassName}
                    value={url}
                    onChange={(event) =>
                      updateListItem("imageUrls", index, event.target.value)
                    }
                    placeholder={t("tourInstance.form.imageUrl", "Image URL")}
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem("imageUrls", index)}
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all">
                    {t("common.remove", "Remove")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendListItem("imageUrls")}
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all">
                + {t("tourInstance.form.addImage", "Add image")}
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-stone-700">
                {t("tourInstance.dynamicPricing", "Dynamic Pricing")}
              </h3>
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
                    className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 active:scale-[0.98] transition-all">
                    {t("common.remove", "Remove")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTier}
                className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 active:scale-[0.98] transition-all">
                + {t("tourInstance.form.addPricingTier", "Add pricing tier")}
              </button>
              {errors.dynamicPricing && (
                <p className="text-xs text-red-600">{errors.dynamicPricing}</p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}


