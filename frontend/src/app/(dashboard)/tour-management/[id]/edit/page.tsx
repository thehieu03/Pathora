"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import TextInput from "@/components/ui/TextInput";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import FileInput from "@/components/ui/FileInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import LanguageTabs, {
  type SupportedLanguage,
} from "@/components/ui/LanguageTabs";
import { tourService } from "@/services/tourService";
import { TourDto, TourStatusMap } from "@/types/tour";

/* ── Types (mirrored from create page) ──────────────────────── */
interface ClassificationForm {
  id?: string;
  name: string;
  description: string;
  price: string;
  salePrice: string;
  durationDays: string;
}

interface ActivityForm {
  id?: string;
  activityType: string;
  title: string;
  description: string;
  note: string;
  estimatedCost: string;
  isOptional: boolean;
  startTime: string;
  endTime: string;
}

interface DayPlanForm {
  id?: string;
  dayNumber: string;
  title: string;
  description: string;
  activities: ActivityForm[];
}

interface InsuranceForm {
  id?: string;
  insuranceName: string;
  insuranceType: string;
  insuranceProvider: string;
  coverageDescription: string;
  coverageAmount: string;
  coverageFee: string;
  isOptional: boolean;
  note: string;
}

interface BasicInfoForm {
  tourName: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
}

interface TranslationFields {
  tourName: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
}

/* ── Constants ──────────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: "1", label: "Active" },
  { value: "2", label: "Inactive" },
  { value: "3", label: "Pending" },
  { value: "4", label: "Rejected" },
];

const ACTIVITY_TYPE_OPTIONS = [
  { value: "0", label: "Sightseeing" },
  { value: "1", label: "Dining" },
  { value: "2", label: "Shopping" },
  { value: "3", label: "Adventure" },
  { value: "4", label: "Relaxation" },
  { value: "5", label: "Cultural" },
  { value: "6", label: "Entertainment" },
  { value: "7", label: "Transportation" },
  { value: "8", label: "Accommodation" },
  { value: "9", label: "Free Time" },
  { value: "99", label: "Other" },
];

const INSURANCE_TYPE_OPTIONS = [
  { value: "0", label: "None" },
  { value: "1", label: "Travel" },
  { value: "2", label: "Health" },
  { value: "3", label: "Trip Cancellation" },
  { value: "4", label: "Baggage Loss" },
  { value: "5", label: "Personal Liability" },
  { value: "6", label: "Adventure Sports" },
];

const STEPS = [
  { key: "basic", icon: "heroicons:information-circle" },
  { key: "classifications", icon: "heroicons:tag" },
  { key: "dayPlans", icon: "heroicons:calendar-days" },
  { key: "insurance", icon: "heroicons:shield-check" },
];

/* ── Empty form factories ───────────────────────────────────── */
const emptyClassification = (): ClassificationForm => ({
  name: "",
  description: "",
  price: "",
  salePrice: "",
  durationDays: "",
});

const emptyActivity = (): ActivityForm => ({
  activityType: "0",
  title: "",
  description: "",
  note: "",
  estimatedCost: "",
  isOptional: false,
  startTime: "",
  endTime: "",
});

const emptyDayPlan = (): DayPlanForm => ({
  dayNumber: "1",
  title: "",
  description: "",
  activities: [],
});

const emptyInsurance = (): InsuranceForm => ({
  insuranceName: "",
  insuranceType: "1",
  insuranceProvider: "",
  coverageDescription: "",
  coverageAmount: "",
  coverageFee: "",
  isOptional: false,
  note: "",
});

/* ══════════════════════════════════════════════════════════════
   Edit Tour Page — Pre-populated Multi-step Wizard
   ══════════════════════════════════════════════════════════════ */
export default function EditTourPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const tourId = params?.id as string;

  /* ── State ────────────────────────────────────────────────── */
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("vi");

  const [basicInfo, setBasicInfo] = useState<BasicInfoForm>({
    tourName: "",
    shortDescription: "",
    longDescription: "",
    seoTitle: "",
    seoDescription: "",
    status: "3",
  });
  const [enTranslation, setEnTranslation] = useState<TranslationFields>({
    tourName: "",
    shortDescription: "",
    longDescription: "",
    seoTitle: "",
    seoDescription: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null,
  );
  const [existingImageCount, setExistingImageCount] = useState(0);

  const [classifications, setClassifications] = useState<ClassificationForm[]>([
    emptyClassification(),
  ]);
  const [dayPlans, setDayPlans] = useState<DayPlanForm[][]>([[]]);
  const [insurances, setInsurances] = useState<InsuranceForm[][]>([[]]);

  /* ── Load existing tour data ──────────────────────────────── */
  const loadTour = useCallback(async () => {
    if (!tourId) return;
    try {
      setLoading(true);
      const tour = await tourService.getTourDetail(tourId);
      if (!tour) {
        toast.error(t("tourAdmin.notFound", "Tour not found"));
        router.push("/tour-management");
        return;
      }

      // Populate basic info
      setBasicInfo({
        tourName: tour.tourName ?? "",
        shortDescription: tour.shortDescription ?? "",
        longDescription: tour.longDescription ?? "",
        seoTitle: tour.seoTitle ?? "",
        seoDescription: tour.seoDescription ?? "",
        status: String(tour.status),
      });

      setExistingThumbnail(tour.thumbnail?.publicURL ?? null);
      setExistingImageCount(tour.images?.length ?? 0);

      // Load existing English translations if available
      if (tour.translations?.en) {
        setEnTranslation({
          tourName: tour.translations.en.tourName ?? "",
          shortDescription: tour.translations.en.shortDescription ?? "",
          longDescription: tour.translations.en.longDescription ?? "",
          seoTitle: tour.translations.en.seoTitle ?? "",
          seoDescription: tour.translations.en.seoDescription ?? "",
        });
      }

      // Populate classifications
      if (tour.classifications?.length > 0) {
        const clsForms: ClassificationForm[] = tour.classifications.map(
          (cls) => ({
            id: cls.id,
            name: cls.name ?? "",
            description: cls.description ?? "",
            price: String(cls.price ?? ""),
            salePrice: String(cls.salePrice ?? ""),
            durationDays: String(cls.durationDays ?? ""),
          }),
        );
        setClassifications(clsForms);

        // Populate day plans per classification
        const dayPlansForms: DayPlanForm[][] = tour.classifications.map((cls) =>
          (cls.plans ?? []).map((day) => ({
            id: day.id,
            dayNumber: String(day.dayNumber),
            title: day.title ?? "",
            description: day.description ?? "",
            activities: (day.activities ?? []).map((act) => ({
              id: act.id,
              activityType: String(act.activityType),
              title: act.title ?? "",
              description: act.description ?? "",
              note: act.note ?? "",
              estimatedCost: String(act.estimatedCost ?? ""),
              isOptional: act.isOptional ?? false,
              startTime: act.startTime ?? "",
              endTime: act.endTime ?? "",
            })),
          })),
        );
        setDayPlans(dayPlansForms);

        // Populate insurance per classification
        const insForms: InsuranceForm[][] = tour.classifications.map((cls) =>
          (cls.insurances ?? []).map((ins) => ({
            id: ins.id,
            insuranceName: ins.insuranceName ?? "",
            insuranceType: String(ins.insuranceType),
            insuranceProvider: ins.insuranceProvider ?? "",
            coverageDescription: ins.coverageDescription ?? "",
            coverageAmount: String(ins.coverageAmount ?? ""),
            coverageFee: String(ins.coverageFee ?? ""),
            isOptional: ins.isOptional ?? false,
            note: ins.note ?? "",
          })),
        );
        setInsurances(insForms);
      }
    } catch (error) {
      console.error("Failed to load tour:", error);
      toast.error(t("tourAdmin.loadError", "Failed to load tour"));
      router.push("/tour-management");
    } finally {
      setLoading(false);
    }
  }, [tourId, t, router]);

  useEffect(() => {
    loadTour();
  }, [loadTour]);

  /* ── Validation ───────────────────────────────────────────── */
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!basicInfo.tourName.trim())
        newErrors.tourName = t("tourAdmin.required", "Required");
      if (!basicInfo.shortDescription.trim())
        newErrors.shortDescription = t("tourAdmin.required", "Required");
    }
    if (step === 1) {
      classifications.forEach((cls, i) => {
        if (!cls.name.trim())
          newErrors[`cls_${i}_name`] = t("tourAdmin.required", "Required");
        if (!cls.price || Number(cls.price) <= 0)
          newErrors[`cls_${i}_price`] = t(
            "tourAdmin.invalidPrice",
            "Invalid price",
          );
        if (!cls.durationDays || Number(cls.durationDays) <= 0)
          newErrors[`cls_${i}_duration`] = t(
            "tourAdmin.invalidDuration",
            "Invalid duration",
          );
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStep))
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  /* ── Classification CRUD ──────────────────────────────────── */
  const addClassification = () => {
    setClassifications((prev) => [...prev, emptyClassification()]);
    setDayPlans((prev) => [...prev, []]);
    setInsurances((prev) => [...prev, []]);
  };
  const removeClassification = (i: number) => {
    if (classifications.length <= 1) return;
    setClassifications((prev) => prev.filter((_, j) => j !== i));
    setDayPlans((prev) => prev.filter((_, j) => j !== i));
    setInsurances((prev) => prev.filter((_, j) => j !== i));
  };
  const updateClassification = (
    i: number,
    field: keyof ClassificationForm,
    value: string,
  ) => {
    setClassifications((prev) =>
      prev.map((cls, j) => (j === i ? { ...cls, [field]: value } : cls)),
    );
  };

  /* ── Day Plan CRUD ────────────────────────────────────────── */
  const addDayPlan = (ci: number) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === ci
          ? [
              ...plans,
              { ...emptyDayPlan(), dayNumber: String(plans.length + 1) },
            ]
          : plans,
      ),
    );
  };
  const removeDayPlan = (ci: number, di: number) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === ci ? plans.filter((_, j) => j !== di) : plans,
      ),
    );
  };
  const updateDayPlan = (
    ci: number,
    di: number,
    field: keyof DayPlanForm,
    value: string,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === ci
          ? plans.map((day, j) => (j === di ? { ...day, [field]: value } : day))
          : plans,
      ),
    );
  };

  /* ── Activity CRUD ────────────────────────────────────────── */
  const addActivity = (ci: number, di: number) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === ci
          ? plans.map((day, j) =>
              j === di
                ? { ...day, activities: [...day.activities, emptyActivity()] }
                : day,
            )
          : plans,
      ),
    );
  };
  const removeActivity = (ci: number, di: number, ai: number) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === ci
          ? plans.map((day, j) =>
              j === di
                ? {
                    ...day,
                    activities: day.activities.filter((_, k) => k !== ai),
                  }
                : day,
            )
          : plans,
      ),
    );
  };
  const updateActivity = (
    ci: number,
    di: number,
    ai: number,
    field: keyof ActivityForm,
    value: string | boolean,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === ci
          ? plans.map((day, j) =>
              j === di
                ? {
                    ...day,
                    activities: day.activities.map((act, k) =>
                      k === ai ? { ...act, [field]: value } : act,
                    ),
                  }
                : day,
            )
          : plans,
      ),
    );
  };

  /* ── Insurance CRUD ───────────────────────────────────────── */
  const addInsurance = (ci: number) => {
    setInsurances((prev) =>
      prev.map((list, i) => (i === ci ? [...list, emptyInsurance()] : list)),
    );
  };
  const removeInsurance = (ci: number, ii: number) => {
    setInsurances((prev) =>
      prev.map((list, i) =>
        i === ci ? list.filter((_, j) => j !== ii) : list,
      ),
    );
  };
  const updateInsurance = (
    ci: number,
    ii: number,
    field: keyof InsuranceForm,
    value: string | boolean,
  ) => {
    setInsurances((prev) =>
      prev.map((list, i) =>
        i === ci
          ? list.map((ins, j) => (j === ii ? { ...ins, [field]: value } : ins))
          : list,
      ),
    );
  };

  /* ── Submit ───────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("id", tourId);
      formData.append("tourName", basicInfo.tourName);
      formData.append("shortDescription", basicInfo.shortDescription);
      formData.append("longDescription", basicInfo.longDescription);
      formData.append("seoTitle", basicInfo.seoTitle);
      formData.append("seoDescription", basicInfo.seoDescription);
      formData.append("status", basicInfo.status);

      const translationPayload: Record<
        string,
        {
          TourName: string;
          ShortDescription: string;
          LongDescription: string;
          SEOTitle?: string;
          SEODescription?: string;
        }
      > = {
        vi: {
          TourName: basicInfo.tourName,
          ShortDescription: basicInfo.shortDescription,
          LongDescription: basicInfo.longDescription,
          SEOTitle: basicInfo.seoTitle,
          SEODescription: basicInfo.seoDescription,
        },
      };

      if (
        enTranslation.tourName ||
        enTranslation.shortDescription ||
        enTranslation.longDescription
      ) {
        translationPayload.en = {
          TourName: enTranslation.tourName,
          ShortDescription: enTranslation.shortDescription,
          LongDescription: enTranslation.longDescription,
          SEOTitle: enTranslation.seoTitle,
          SEODescription: enTranslation.seoDescription,
        };
      }

      formData.append("translations", JSON.stringify(translationPayload));

      if (thumbnail) formData.append("thumbnail", thumbnail);
      images.forEach((img) => formData.append("images", img));

      classifications.forEach((cls, ci) => {
        const prefix = `classifications[${ci}]`;
        if (cls.id) formData.append(`${prefix}.id`, cls.id);
        formData.append(`${prefix}.name`, cls.name);
        formData.append(`${prefix}.description`, cls.description);
        formData.append(`${prefix}.price`, cls.price);
        formData.append(`${prefix}.salePrice`, cls.salePrice || cls.price);
        formData.append(`${prefix}.durationDays`, cls.durationDays);

        const plans = dayPlans[ci] ?? [];
        plans.forEach((day, di) => {
          const dayPrefix = `${prefix}.plans[${di}]`;
          if (day.id) formData.append(`${dayPrefix}.id`, day.id);
          formData.append(`${dayPrefix}.dayNumber`, day.dayNumber);
          formData.append(`${dayPrefix}.title`, day.title);
          formData.append(`${dayPrefix}.description`, day.description);
          day.activities.forEach((act, ai) => {
            const actPrefix = `${dayPrefix}.activities[${ai}]`;
            if (act.id) formData.append(`${actPrefix}.id`, act.id);
            formData.append(`${actPrefix}.activityType`, act.activityType);
            formData.append(`${actPrefix}.title`, act.title);
            formData.append(`${actPrefix}.description`, act.description);
            formData.append(`${actPrefix}.note`, act.note);
            formData.append(
              `${actPrefix}.estimatedCost`,
              act.estimatedCost || "0",
            );
            formData.append(`${actPrefix}.isOptional`, String(act.isOptional));
            formData.append(`${actPrefix}.startTime`, act.startTime);
            formData.append(`${actPrefix}.endTime`, act.endTime);
          });
        });

        const ins = insurances[ci] ?? [];
        ins.forEach((insurance, ii) => {
          const insPrefix = `${prefix}.insurances[${ii}]`;
          if (insurance.id) formData.append(`${insPrefix}.id`, insurance.id);
          formData.append(
            `${insPrefix}.insuranceName`,
            insurance.insuranceName,
          );
          formData.append(
            `${insPrefix}.insuranceType`,
            insurance.insuranceType,
          );
          formData.append(
            `${insPrefix}.insuranceProvider`,
            insurance.insuranceProvider,
          );
          formData.append(
            `${insPrefix}.coverageDescription`,
            insurance.coverageDescription,
          );
          formData.append(
            `${insPrefix}.coverageAmount`,
            insurance.coverageAmount || "0",
          );
          formData.append(
            `${insPrefix}.coverageFee`,
            insurance.coverageFee || "0",
          );
          formData.append(
            `${insPrefix}.isOptional`,
            String(insurance.isOptional),
          );
          formData.append(`${insPrefix}.note`, insurance.note);
        });
      });

      await tourService.updateTour(formData);
      toast.success(t("tourAdmin.updateSuccess", "Tour updated successfully!"));
      router.push("/tour-management");
    } catch (error) {
      console.error("Failed to update tour:", error);
      toast.error(t("tourAdmin.updateError", "Failed to update tour"));
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon
          icon="heroicons:arrow-path"
          className="size-8 animate-spin text-slate-400"
        />
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     Render — reuses same wizard layout as create page
     ══════════════════════════════════════════════════════════ */
  return (
    <div>
      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.key}>
              {i > 0 && (
                <div
                  className={`h-px w-8 ${i <= currentStep ? "bg-slate-900 dark:bg-slate-400" : "bg-slate-200 dark:bg-slate-700"}`}
                />
              )}
              <Button
                type="button"
                onClick={() => {
                  if (i < currentStep) setCurrentStep(i);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  i === currentStep
                    ? "bg-slate-900 text-white dark:bg-slate-600"
                    : i < currentStep
                      ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                }`}>
                <Icon icon={step.icon} className="size-4" />
                <span className="hidden sm:inline">
                  {t(`tourAdmin.step.${step.key}`, step.key)}
                </span>
                <span className="sm:hidden">{i + 1}</span>
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Step 1: Basic Info ───────────────────────────── */}
      {currentStep === 0 && (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-8">
            <Card
              title={t("tourAdmin.basicInfo", "Basic Information")}
              className="mb-5">
              <div className="mb-4">
                <LanguageTabs
                  activeLanguage={activeLang}
                  onChange={setActiveLang}
                />
                <p className="text-xs text-slate-400 mt-2">
                  {t(
                    "tourAdmin.langTabs.translationHint",
                    "Vietnamese is required. English translation is optional.",
                  )}
                </p>
              </div>

              {/* ── Vietnamese Content ── */}
              {activeLang === "vi" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <TextInput
                        label={t("tourAdmin.tourName", "Tour Name")}
                        value={basicInfo.tourName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBasicInfo((prev) => ({
                            ...prev,
                            tourName: e.target.value,
                          }))
                        }
                      />
                      {errors.tourName && (
                        <p className="text-danger-500 text-sm mt-1">
                          {errors.tourName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Textarea
                      label={t(
                        "tourAdmin.shortDescription",
                        "Short Description",
                      )}
                      value={basicInfo.shortDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          shortDescription: e.target.value,
                        }))
                      }
                      row={2}
                    />
                    {errors.shortDescription && (
                      <p className="text-danger-500 text-sm mt-1">
                        {errors.shortDescription}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Textarea
                      label={t("tourAdmin.longDescription", "Long Description")}
                      value={basicInfo.longDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          longDescription: e.target.value,
                        }))
                      }
                      row={5}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <TextInput
                      label={t("tourAdmin.seoTitle", "SEO Title")}
                      value={basicInfo.seoTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          seoTitle: e.target.value,
                        }))
                      }
                    />
                    <TextInput
                      label={t("tourAdmin.seoDescription", "SEO Description")}
                      value={basicInfo.seoDescription}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          seoDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              {/* ── English Content ── */}
              {activeLang === "en" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <TextInput
                        label={`${t("tourAdmin.tourName", "Tour Name")} (EN)`}
                        value={enTranslation.tourName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEnTranslation((prev) => ({
                            ...prev,
                            tourName: e.target.value,
                          }))
                        }
                        placeholder={t("placeholder.enterTourNameEn", "Enter tour name in English")}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                      <Textarea
                        label={`${t("tourAdmin.shortDescription", "Short Description")} (EN)`}
                        value={enTranslation.shortDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          shortDescription: e.target.value,
                        }))
                      }
                      row={2}
                       placeholder={t("placeholder.briefDescEn", "Brief tour description in English")}
                     />
                  </div>
                  <div className="mt-4">
                      <Textarea
                        label={`${t("tourAdmin.longDescription", "Long Description")} (EN)`}
                        value={enTranslation.longDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          longDescription: e.target.value,
                        }))
                      }
                      row={5}
                       placeholder={t("placeholder.detailedDescEn", "Detailed tour description in English")}
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <TextInput
                      label={`${t("tourAdmin.seoTitle", "SEO Title")} (EN)`}
                      value={enTranslation.seoTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          seoTitle: e.target.value,
                        }))
                      }
                    />
                    <TextInput
                      label={`${t("tourAdmin.seoDescription", "SEO Description")} (EN)`}
                      value={enTranslation.seoDescription}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          seoDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}

              <div className="mt-4">
                <Select
                  label={t("tourAdmin.status", "Status")}
                  value={basicInfo.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  options={STATUS_OPTIONS}
                />
              </div>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Card title={t("tourAdmin.media", "Media")} className="mb-5">
              {existingThumbnail && (
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">
                    {t("tourAdmin.currentThumbnail", "Current thumbnail")}
                  </p>
                  <div className="h-24 w-full rounded-md overflow-hidden bg-slate-100">
                    <img
                      src={existingThumbnail}
                      alt="Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  {t("tourAdmin.newThumbnail", "New Thumbnail")}
                </label>
                <FileInput name="thumbnail" onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)} />
              </div>
              {existingImageCount > 0 && (
                <p className="text-xs text-slate-500 mb-2">
                  {t("tourAdmin.existingImages", "Existing images")}:{" "}
                  {existingImageCount}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  {t("tourAdmin.newImages", "New Gallery Images")}
                </label>
                <FileInput name="images" multiple onChange={(e) => setImages(Array.from(e.target.files ?? []))} />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Step 2: Classifications ──────────────────────── */}
      {currentStep === 1 && (
        <Card
          title={t("tourAdmin.classifications", "Classifications / Packages")}
          headerSlot={
            <Button
              type="button"
              className="btn btn-dark btn-sm inline-flex items-center gap-1"
              onClick={addClassification}>
              <Icon icon="heroicons:plus" className="size-4" />
              {t("tourAdmin.addClassification", "Add")}
            </Button>
          }>
          <div className="flex flex-col gap-4">
            {classifications.map((cls, ci) => (
              <div
                key={ci}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 relative">
                {classifications.length > 1 && (
                  <Button
                    type="button"
                    className="absolute top-3 right-3 text-danger-500 hover:text-danger-700"
                    onClick={() => removeClassification(ci)}>
                    <Icon icon="heroicons:x-mark" className="size-5" />
                  </Button>
                )}
                <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  {t("tourAdmin.classification", "Classification")} #{ci + 1}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <TextInput
                      label={t("tourAdmin.name", "Name")}
                      value={cls.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateClassification(ci, "name", e.target.value)
                      }
                    />
                    {errors[`cls_${ci}_name`] && (
                      <p className="text-danger-500 text-sm mt-1">
                        {errors[`cls_${ci}_name`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <TextInput
                      type="number"
                      label={t("tourAdmin.price", "Price ($)")}
                      value={cls.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateClassification(ci, "price", e.target.value)
                      }
                    />
                    {errors[`cls_${ci}_price`] && (
                      <p className="text-danger-500 text-sm mt-1">
                        {errors[`cls_${ci}_price`]}
                      </p>
                    )}
                  </div>
                  <TextInput
                    type="number"
                    label={t("tourAdmin.salePrice", "Sale Price ($)")}
                    value={cls.salePrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateClassification(ci, "salePrice", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <TextInput
                      type="number"
                      label={t("tourAdmin.durationDays", "Duration (days)")}
                      value={cls.durationDays}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateClassification(ci, "durationDays", e.target.value)
                      }
                    />
                    {errors[`cls_${ci}_duration`] && (
                      <p className="text-danger-500 text-sm mt-1">
                        {errors[`cls_${ci}_duration`]}
                      </p>
                    )}
                  </div>
                  <Textarea
                    label={t("tourAdmin.description", "Description")}
                    value={cls.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateClassification(ci, "description", e.target.value)
                    }
                    row={1}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Step 3: Day Plans ────────────────────────────── */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-5">
          {classifications.map((cls, ci) => (
            <Card
              key={ci}
              title={`${cls.name || `Classification #${ci + 1}`} — ${t("tourAdmin.dayPlans", "Day Plans")}`}
              headerSlot={
                <Button
                  type="button"
                  className="btn btn-outline-dark btn-sm inline-flex items-center gap-1"
                  onClick={() => addDayPlan(ci)}>
                  <Icon icon="heroicons:plus" className="size-4" />
                  {t("tourAdmin.addDay", "Add Day")}
                </Button>
              }>
              {(dayPlans[ci] ?? []).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  {t("tourAdmin.noDayPlans", "No day plans yet.")}
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {(dayPlans[ci] ?? []).map((day, di) => (
                    <div
                      key={di}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="text-sm font-semibold">
                          {t("tourAdmin.day", "Day")} {day.dayNumber}
                        </h6>
                        <Button
                          type="button"
                          className="text-danger-500"
                          onClick={() => removeDayPlan(ci, di)}>
                          <Icon icon="heroicons:x-mark" className="size-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <TextInput
                          type="number"
                          label={t("tourAdmin.dayNumber", "Day #")}
                          value={day.dayNumber}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateDayPlan(ci, di, "dayNumber", e.target.value)
                          }
                        />
                        <TextInput
                          label={t("tourAdmin.dayTitle", "Title")}
                          value={day.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateDayPlan(ci, di, "title", e.target.value)
                          }
                        />
                        <TextInput
                          label={t("tourAdmin.dayDescription", "Description")}
                          value={day.description}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateDayPlan(ci, di, "description", e.target.value)
                          }
                        />
                      </div>
                      {/* Activities */}
                      <div className="ml-4 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {t("tourAdmin.activities", "Activities")}
                          </span>
                          <Button
                            type="button"
                            className="btn btn-outline-dark btn-xs inline-flex items-center gap-1"
                            onClick={() => addActivity(ci, di)}>
                            <Icon icon="heroicons:plus" className="size-3" />
                            {t("tourAdmin.addActivity", "Add")}
                          </Button>
                        </div>
                        {day.activities.length === 0 && (
                          <p className="text-xs text-slate-400 py-2">
                            {t("tourAdmin.noActivities", "No activities")}
                          </p>
                        )}
                        {day.activities.map((act, ai) => (
                          <div
                            key={ai}
                            className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-2 relative">
                            <Button
                              type="button"
                              className="absolute top-2 right-2 text-danger-500"
                              onClick={() => removeActivity(ci, di, ai)}>
                              <Icon
                                icon="heroicons:x-mark"
                                className="size-3.5"
                              />
                            </Button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                              <Select
                                label={t("tourAdmin.type", "Type")}
                                value={act.activityType}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>,
                                ) =>
                                  updateActivity(
                                    ci,
                                    di,
                                    ai,
                                    "activityType",
                                    e.target.value,
                                  )
                                }
                                options={ACTIVITY_TYPE_OPTIONS}
                              />
                              <TextInput
                                label={t("tourAdmin.actTitle", "Title")}
                                value={act.title}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateActivity(
                                    ci,
                                    di,
                                    ai,
                                    "title",
                                    e.target.value,
                                  )
                                }
                              />
                              <TextInput
                                label={t("tourAdmin.startTime", "Start")}
                                value={act.startTime}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateActivity(
                                    ci,
                                    di,
                                    ai,
                                    "startTime",
                                    e.target.value,
                                  )
                                }
                                placeholder="09:00"
                              />
                              <TextInput
                                label={t("tourAdmin.endTime", "End")}
                                value={act.endTime}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateActivity(
                                    ci,
                                    di,
                                    ai,
                                    "endTime",
                                    e.target.value,
                                  )
                                }
                                placeholder="12:00"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <TextInput
                                label={t(
                                  "tourAdmin.actDescription",
                                  "Description",
                                )}
                                value={act.description}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateActivity(
                                    ci,
                                    di,
                                    ai,
                                    "description",
                                    e.target.value,
                                  )
                                }
                              />
                              <div className="flex items-end gap-3">
                                <TextInput
                                  type="number"
                                  label={t("tourAdmin.cost", "Est. Cost ($)")}
                                  value={act.estimatedCost}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                  ) =>
                                    updateActivity(
                                      ci,
                                      di,
                                      ai,
                                      "estimatedCost",
                                      e.target.value,
                                    )
                                  }
                                />
                                <Checkbox label={t("tourAdmin.optional", "Optional")} value={act.isOptional} onChange={() => updateActivity(ci, di, ai, "isOptional", !act.isOptional)} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── Step 4: Insurance ────────────────────────────── */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-5">
          {classifications.map((cls, ci) => (
            <Card
              key={ci}
              title={`${cls.name || `Classification #${ci + 1}`} — ${t("tourAdmin.insurance", "Insurance")}`}
              headerSlot={
                <Button
                  type="button"
                  className="btn btn-outline-dark btn-sm inline-flex items-center gap-1"
                  onClick={() => addInsurance(ci)}>
                  <Icon icon="heroicons:plus" className="size-4" />
                  {t("tourAdmin.addInsurance", "Add")}
                </Button>
              }>
              {(insurances[ci] ?? []).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  {t("tourAdmin.noInsurance", "No insurance options.")}
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {(insurances[ci] ?? []).map((ins, ii) => (
                    <div
                      key={ii}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 relative">
                      <Button
                        type="button"
                        className="absolute top-3 right-3 text-danger-500"
                        onClick={() => removeInsurance(ci, ii)}>
                        <Icon icon="heroicons:x-mark" className="size-4" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <TextInput
                          label={t("tourAdmin.insuranceName", "Name")}
                          value={ins.insuranceName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateInsurance(
                              ci,
                              ii,
                              "insuranceName",
                              e.target.value,
                            )
                          }
                        />
                        <Select
                          label={t("tourAdmin.insuranceType", "Type")}
                          value={ins.insuranceType}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            updateInsurance(
                              ci,
                              ii,
                              "insuranceType",
                              e.target.value,
                            )
                          }
                          options={INSURANCE_TYPE_OPTIONS}
                        />
                        <TextInput
                          label={t("tourAdmin.provider", "Provider")}
                          value={ins.insuranceProvider}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateInsurance(
                              ci,
                              ii,
                              "insuranceProvider",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <Textarea
                          label={t(
                            "tourAdmin.coverageDesc",
                            "Coverage Description",
                          )}
                          value={ins.coverageDescription}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) =>
                            updateInsurance(
                              ci,
                              ii,
                              "coverageDescription",
                              e.target.value,
                            )
                          }
                          row={2}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        <TextInput
                          type="number"
                          label={t("tourAdmin.coverageAmount", "Coverage ($)")}
                          value={ins.coverageAmount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateInsurance(
                              ci,
                              ii,
                              "coverageAmount",
                              e.target.value,
                            )
                          }
                        />
                        <TextInput
                          type="number"
                          label={t("tourAdmin.coverageFee", "Fee ($)")}
                          value={ins.coverageFee}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateInsurance(
                              ci,
                              ii,
                              "coverageFee",
                              e.target.value,
                            )
                          }
                        />
                        <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 self-end pb-2">
                          <input
                            type="checkbox"
                            checked={ins.isOptional}
                            onChange={(e) =>
                              updateInsurance(
                                ci,
                                ii,
                                "isOptional",
                                e.target.checked,
                              )
                            }
                            className="rounded border-slate-300"
                          />
                          {t("tourAdmin.optional", "Optional")}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ── Navigation Buttons ───────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          className="btn btn-outline-dark btn-sm inline-flex items-center gap-1"
          onClick={() =>
            currentStep === 0 ? router.push("/tour-management") : goPrev()
          }>
          <Icon icon="heroicons:arrow-left" className="size-4" />
          {currentStep === 0
            ? t("tourAdmin.backToList", "Back to List")
            : t("tourAdmin.previous", "Previous")}
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            type="button"
            className="btn btn-dark btn-sm inline-flex items-center gap-1"
            onClick={goNext}>
            {t("tourAdmin.next", "Next")}
            <Icon icon="heroicons:arrow-right" className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="btn btn-dark btn-sm inline-flex items-center gap-1"
            disabled={saving}
            onClick={handleSubmit}>
            {saving && (
              <Icon
                icon="heroicons:arrow-path"
                className="size-4 animate-spin"
              />
            )}
            <Icon icon="heroicons:check" className="size-4" />
            {t("tourAdmin.updateTour", "Update Tour")}
          </Button>
        )}
      </div>
    </div>
  );
}
