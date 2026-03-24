"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui";
import { TopBar } from "@/features/dashboard/components/AdminSidebar";
import { AdminSidebar } from "@/features/dashboard/components/AdminSidebar";
import { adminTourService } from "@/services/admin/tourService";
import { buildCreateTourFormData } from "@/api/services/tourCreatePayload";
import { handleApiError } from "@/utils/apiResponse";
import type {
  DynamicPricingDto,
  TourClassificationDto,
  TourDayActivityDto,
  TourDayDto,
  TourInsuranceDto,
  TourDto,
} from "@/types/tour";

/* ══════════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════════ */

interface ClassificationForm {
  id?: string;
  name: string;
  enName: string;
  description: string;
  enDescription: string;
  durationDays: string;
  price: string;
  salePrice: string;
  plans: DayPlanForm[];
  insurances: InsuranceForm[];
  dynamicPricing: DynamicPricingDto[];
}

interface DayPlanForm {
  id?: string;
  dayNumber: string;
  title: string;
  enTitle: string;
  description: string;
  enDescription: string;
  activities: ActivityForm[];
}

interface ActivityForm {
  id?: string;
  activityType: string;
  title: string;
  enTitle: string;
  description: string;
  enDescription: string;
  note: string;
  enNote: string;
  estimatedCost: string;
  isOptional: boolean;
  startTime: string;
  endTime: string;
  routes: unknown[];
  accommodation: unknown | null;
}

interface InsuranceForm {
  id?: string;
  insuranceName: string;
  enInsuranceName: string;
  insuranceType: string;
  insuranceProvider: string;
  coverageDescription: string;
  enCoverageDescription: string;
  coverageAmount: string;
  coverageFee: string;
  isOptional: boolean;
  note: string;
  enNote: string;
}

interface AccommodationForm {
  accommodationName: string;
  enAccommodationName: string;
  address: string;
  enAddress: string;
  contactPhone: string;
  checkInTime: string;
  checkOutTime: string;
  note: string;
  enNote: string;
}

interface LocationForm {
  locationName: string;
  enLocationName: string;
  type: string;
  enType: string;
  description: string;
  enDescription: string;
  city: string;
  enCity: string;
  country: string;
  enCountry: string;
  entranceFee: string;
  address: string;
  enAddress: string;
}

interface TransportationForm {
  fromLocation: string;
  enFromLocation: string;
  toLocation: string;
  enToLocation: string;
  transportationType: string;
  enTransportationType: string;
  transportationName: string;
  enTransportationName: string;
  durationMinutes: string;
  pricingType: string;
  price: string;
  requiresIndividualTicket: boolean;
  ticketInfo: string;
  enTicketInfo: string;
  note: string;
  enNote: string;
}

interface ServiceForm {
  serviceName: string;
  pricingType: string;
  price: string;
  salePrice: string;
  email: string;
  contactNumber: string;
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

const ACTIVITY_TYPE_OPTIONS = [
  { value: "0" }, { value: "1" }, { value: "2" }, { value: "3" },
  { value: "4" }, { value: "5" }, { value: "6" }, { value: "7" },
  { value: "8" }, { value: "9" }, { value: "99" },
];

const INSURANCE_TYPE_OPTIONS = [
  { value: "0" }, { value: "1" }, { value: "2" },
  { value: "3" }, { value: "4" }, { value: "5" }, { value: "6" },
];

const WIZARD_STEPS = [
  { key: "basic", icon: "heroicons:information-circle" },
  { key: "packages", icon: "heroicons:cube" },
  { key: "itineraries", icon: "heroicons:calendar-days" },
  { key: "accommodations", icon: "heroicons:home-modern" },
  { key: "locations", icon: "heroicons:map-pin" },
  { key: "transportation", icon: "heroicons:truck" },
  { key: "services", icon: "heroicons:wrench-screwdriver" },
  { key: "insurance", icon: "heroicons:shield-check" },
];

/* ══════════════════════════════════════════════════════════════
   Normalizers / Mappers
   ══════════════════════════════════════════════════════════════ */

const mapActivityDtoToForm = (act: TourDayActivityDto): ActivityForm => ({
  id: act.id,
  activityType: String(act.activityType ?? 0),
  title: act.title,
  enTitle: (act as Record<string, unknown>).enTitle as string ?? act.title,
  description: act.description ?? "",
  enDescription: (act as Record<string, unknown>).enDescription as string ?? "",
  note: act.note ?? "",
  enNote: (act as Record<string, unknown>).enNote as string ?? "",
  estimatedCost: act.estimatedCost != null ? String(act.estimatedCost) : "",
  isOptional: act.isOptional,
  startTime: act.startTime ?? "",
  endTime: act.endTime ?? "",
  routes: act.routes,
  accommodation: act.accommodation,
});

const mapDayDtoToForm = (day: TourDayDto): DayPlanForm => ({
  id: day.id,
  dayNumber: String(day.dayNumber ?? 1),
  title: day.title,
  enTitle: (day as Record<string, unknown>).enTitle as string ?? day.title,
  description: day.description ?? "",
  enDescription: (day as Record<string, unknown>).enDescription as string ?? "",
  activities: day.activities.map(mapActivityDtoToForm),
});

const mapInsuranceDtoToForm = (ins: TourInsuranceDto): InsuranceForm => ({
  id: ins.id,
  insuranceName: ins.insuranceName,
  enInsuranceName: (ins as Record<string, unknown>).enInsuranceName as string ?? ins.insuranceName,
  insuranceType: String(ins.insuranceType ?? 0),
  insuranceProvider: ins.insuranceProvider,
  coverageDescription: ins.coverageDescription,
  enCoverageDescription: (ins as Record<string, unknown>).enCoverageDescription as string ?? ins.coverageDescription,
  coverageAmount: String(ins.coverageAmount),
  coverageFee: String(ins.coverageFee),
  isOptional: ins.isOptional,
  note: ins.note ?? "",
  enNote: (ins as Record<string, unknown>).enNote as string ?? "",
});

const mapClassificationDtoToForm = (
  cls: TourClassificationDto,
): ClassificationForm => ({
  id: cls.id,
  name: cls.name,
  enName: (cls as Record<string, unknown>).enName as string ?? cls.name,
  description: cls.description,
  enDescription: (cls as Record<string, unknown>).enDescription as string ?? cls.description,
  durationDays: String(cls.durationDays ?? cls.numberOfDay ?? 1),
  price: String(cls.adultPrice ?? cls.price ?? 0),
  salePrice: String(cls.salePrice ?? cls.childPrice ?? cls.price ?? 0),
  plans: cls.plans.map(mapDayDtoToForm),
  insurances: cls.insurances.map(mapInsuranceDtoToForm),
  dynamicPricing: cls.dynamicPricing ?? [],
});

const mapTourDtoToForms = (
  dto: TourDto,
): {
  basicInfo: BasicInfoForm;
  translations: { vi: TranslationFields; en: TranslationFields };
  classifications: ClassificationForm[];
} => {
  const enTrans = dto.translations?.en;
  const viTrans = dto.translations?.vi;

  return {
    basicInfo: {
      tourName: dto.tourName,
      shortDescription: dto.shortDescription,
      longDescription: dto.longDescription,
      seoTitle: dto.seoTitle ?? "",
      seoDescription: dto.seoDescription ?? "",
      status: String(dto.status ?? 1),
    },
    translations: {
      vi: {
        tourName: viTrans?.tourName ?? dto.tourName,
        shortDescription: viTrans?.shortDescription ?? dto.shortDescription,
        longDescription: viTrans?.longDescription ?? dto.longDescription,
        seoTitle: viTrans?.seoTitle ?? dto.seoTitle ?? "",
        seoDescription: viTrans?.seoDescription ?? dto.seoDescription ?? "",
      },
      en: {
        tourName: enTrans?.tourName ?? "",
        shortDescription: enTrans?.shortDescription ?? "",
        longDescription: enTrans?.longDescription ?? "",
        seoTitle: enTrans?.seoTitle ?? "",
        seoDescription: enTrans?.seoDescription ?? "",
      },
    },
    classifications: dto.classifications.map(mapClassificationDtoToForm),
  };
};

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */
export default function TourEditPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const tourId = String(params?.id ?? "");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTour, setLoadingTour] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Tour data ──────────────────────────────────────────────── */
  const [tourData, setTourData] = useState<TourDto | null>(null);

  /* ── Form state ─────────────────────────────────────────────── */
  const [basicInfo, setBasicInfo] = useState<BasicInfoForm>({
    tourName: "",
    shortDescription: "",
    longDescription: "",
    seoTitle: "",
    seoDescription: "",
    status: "1",
  });

  const [viTrans, setViTrans] = useState<TranslationFields>({
    tourName: "",
    shortDescription: "",
    longDescription: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [enTrans, setEnTrans] = useState<TranslationFields>({
    tourName: "",
    shortDescription: "",
    longDescription: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  const [classifications, setClassifications] = useState<ClassificationForm[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationForm[]>([]);
  const [locations, setLocations] = useState<LocationForm[]>([]);
  const [transportations, setTransportations] = useState<TransportationForm[]>([]);
  const [services, setServices] = useState<ServiceForm[]>([]);

  const [selectedPricingPolicyId, setSelectedPricingPolicyId] = useState("");
  const [selectedDepositPolicyId, setSelectedDepositPolicyId] = useState("");
  const [selectedCancellationPolicyId, setSelectedCancellationPolicyId] = useState("");
  const [selectedVisaPolicyId, setSelectedVisaPolicyId] = useState("");

  /* ── Load tour data on mount ────────────────────────────────── */
  useEffect(() => {
    if (!tourId) {
      setLoadingTour(false);
      return;
    }

    const doLoad = async () => {
      try {
        setLoadingTour(true);
        const dto = await adminTourService.getTourDetail(tourId);
        if (!dto) {
          toast.error(t("adminTour.edit.loadError", "Failed to load tour data."));
          router.push("/tour-management");
          return;
        }

        setTourData(dto);
        const forms = mapTourDtoToForms(dto);

        setBasicInfo(forms.basicInfo);
        setViTrans(forms.translations.vi);
        setEnTrans(forms.translations.en);
        setClassifications(forms.classifications);

        if (dto.thumbnail?.publicURL) {
          setExistingThumbnailUrl(dto.thumbnail.publicURL);
        }
        if (dto.images?.length) {
          const urls = dto.images
            .filter((img) => img.publicURL)
            .map((img) => img.publicURL as string);
          setExistingImageUrls(urls);
        }
      } catch (err) {
        const handled = handleApiError(err);
        toast.error(handled.message);
        router.push("/tour-management");
      } finally {
        setLoadingTour(false);
        setLoading(false);
      }
    };

    void doLoad();
  }, [tourId, router, t]);

  /* ── Step nav ──────────────────────────────────────────────── */
  const canGoNext = currentStep < WIZARD_STEPS.length - 1;
  const canGoPrev = currentStep > 0;

  const goNext = () => { if (canGoNext) setCurrentStep((s) => s + 1); };
  const goPrev = () => { if (canGoPrev) setCurrentStep((s) => s - 1); };

  /* ── Classification helpers ─────────────────────────────────── */
  const updateClassification = useCallback(
    (
      index: number,
      field: keyof ClassificationForm,
      value: unknown,
    ) => {
      setClassifications((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    [],
  );

  const addClassification = () => {
    setClassifications((prev) => [
      ...prev,
      {
        name: "",
        enName: "",
        description: "",
        enDescription: "",
        durationDays: "1",
        price: "0",
        salePrice: "0",
        plans: [{ dayNumber: "1", title: "", enTitle: "", description: "", enDescription: "", activities: [] }],
        insurances: [],
        dynamicPricing: [],
      },
    ]);
  };

  const removeClassification = (index: number) => {
    setClassifications((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Day plan helpers ───────────────────────────────────────── */
  const updateDayPlan = useCallback(
    (clsIndex: number, dayIndex: number, field: keyof DayPlanForm, value: unknown) => {
      setClassifications((prev) => {
        const updated = [...prev];
        const cls = { ...updated[clsIndex] };
        const plans = [...cls.plans];
        plans[dayIndex] = { ...plans[dayIndex], [field]: value };
        cls.plans = plans;
        updated[clsIndex] = cls;
        return updated;
      });
    },
    [],
  );

  const addDayPlan = (clsIndex: number) => {
    const cls = classifications[clsIndex];
    const nextDay = cls.plans.length + 1;
    setClassifications((prev) => {
      const updated = [...prev];
      updated[clsIndex] = {
        ...updated[clsIndex],
        plans: [
          ...updated[clsIndex].plans,
          { dayNumber: String(nextDay), title: "", enTitle: "", description: "", enDescription: "", activities: [] },
        ],
      };
      return updated;
    });
  };

  const removeDayPlan = (clsIndex: number, dayIndex: number) => {
    setClassifications((prev) => {
      const updated = [...prev];
      const cls = { ...updated[clsIndex] };
      cls.plans = cls.plans.filter((_, i) => i !== dayIndex);
      updated[clsIndex] = cls;
      return updated;
    });
  };

  /* ── Activity helpers ───────────────────────────────────────── */
  const updateActivity = useCallback(
    (
      clsIndex: number,
      dayIndex: number,
      actIndex: number,
      field: keyof ActivityForm,
      value: unknown,
    ) => {
      setClassifications((prev) => {
        const updated = [...prev];
        const cls = { ...updated[clsIndex] };
        const plans = [...cls.plans];
        const day = { ...plans[dayIndex] };
        const activities = [...day.activities];
        activities[actIndex] = { ...activities[actIndex], [field]: value };
        day.activities = activities;
        plans[dayIndex] = day;
        cls.plans = plans;
        updated[clsIndex] = cls;
        return updated;
      });
    },
    [],
  );

  const addActivity = (clsIndex: number, dayIndex: number) => {
    setClassifications((prev) => {
      const updated = [...prev];
      const cls = { ...updated[clsIndex] };
      const plans = [...cls.plans];
      const day = { ...plans[dayIndex] };
      day.activities = [
        ...day.activities,
        {
          activityType: "0",
          title: "",
          enTitle: "",
          description: "",
          enDescription: "",
          note: "",
          enNote: "",
          estimatedCost: "",
          isOptional: false,
          startTime: "",
          endTime: "",
          routes: [],
          accommodation: null,
        },
      ];
      plans[dayIndex] = day;
      cls.plans = plans;
      updated[clsIndex] = cls;
      return updated;
    });
  };

  const removeActivity = (
    clsIndex: number,
    dayIndex: number,
    actIndex: number,
  ) => {
    setClassifications((prev) => {
      const updated = [...prev];
      const cls = { ...updated[clsIndex] };
      const plans = [...cls.plans];
      const day = { ...plans[dayIndex] };
      day.activities = day.activities.filter((_, i) => i !== actIndex);
      plans[dayIndex] = day;
      cls.plans = plans;
      updated[clsIndex] = cls;
      return updated;
    });
  };

  /* ── Insurance helpers ─────────────────────────────────────── */
  const updateInsurance = useCallback(
    (
      clsIndex: number,
      insIndex: number,
      field: keyof InsuranceForm,
      value: unknown,
    ) => {
      setClassifications((prev) => {
        const updated = [...prev];
        const cls = { ...updated[clsIndex] };
        cls.insurances = cls.insurances.map((ins, i) =>
          i === insIndex ? { ...ins, [field]: value } : ins,
        );
        updated[clsIndex] = cls;
        return updated;
      });
    },
    [],
  );

  const addInsurance = (clsIndex: number) => {
    setClassifications((prev) => {
      const updated = [...prev];
      updated[clsIndex] = {
        ...updated[clsIndex],
        insurances: [
          ...updated[clsIndex].insurances,
          {
            insuranceName: "",
            enInsuranceName: "",
            insuranceType: "0",
            insuranceProvider: "",
            coverageDescription: "",
            enCoverageDescription: "",
            coverageAmount: "0",
            coverageFee: "0",
            isOptional: true,
            note: "",
            enNote: "",
          },
        ],
      };
      return updated;
    });
  };

  const removeInsurance = (clsIndex: number, insIndex: number) => {
    setClassifications((prev) => {
      const updated = [...prev];
      updated[clsIndex] = {
        ...updated[clsIndex],
        insurances: updated[clsIndex].insurances.filter(
          (_, i) => i !== insIndex,
        ),
      };
      return updated;
    });
  };

  /* ── Accommodation helpers ─────────────────────────────────── */
  const updateAccommodation = useCallback(
    (index: number, field: keyof AccommodationForm, value: string) => {
      setAccommodations((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    [],
  );

  const addAccommodation = () => {
    setAccommodations((prev) => [
      ...prev,
      {
        accommodationName: "",
        enAccommodationName: "",
        address: "",
        enAddress: "",
        contactPhone: "",
        checkInTime: "",
        checkOutTime: "",
        note: "",
        enNote: "",
      },
    ]);
  };

  const removeAccommodation = (index: number) => {
    setAccommodations((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Location helpers ─────────────────────────────────────── */
  const updateLocation = useCallback(
    (index: number, field: keyof LocationForm, value: string) => {
      setLocations((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    [],
  );

  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      {
        locationName: "",
        enLocationName: "",
        type: "0",
        enType: "0",
        description: "",
        enDescription: "",
        city: "",
        enCity: "",
        country: "",
        enCountry: "",
        entranceFee: "0",
        address: "",
        enAddress: "",
      },
    ]);
  };

  const removeLocation = (index: number) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Transportation helpers ────────────────────────────────── */
  const updateTransportation = useCallback(
    (
      index: number,
      field: keyof TransportationForm,
      value: unknown,
    ) => {
      setTransportations((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    [],
  );

  const addTransportation = () => {
    setTransportations((prev) => [
      ...prev,
      {
        fromLocation: "",
        enFromLocation: "",
        toLocation: "",
        enToLocation: "",
        transportationType: "0",
        enTransportationType: "0",
        transportationName: "",
        enTransportationName: "",
        durationMinutes: "",
        pricingType: "0",
        price: "0",
        requiresIndividualTicket: false,
        ticketInfo: "",
        enTicketInfo: "",
        note: "",
        enNote: "",
      },
    ]);
  };

  const removeTransportation = (index: number) => {
    setTransportations((prev) => prev.filter((_, i) => i !== index));
  };

  /* ── Validation ───────────────────────────────────────────── */
  const validateBasicInfo = (): boolean => {
    const errs: Record<string, string> = {};
    if (!basicInfo.tourName.trim()) errs.tourName = t("tourAdmin.basic.tourNameRequired", "Tour name is required");
    if (!basicInfo.shortDescription.trim())
      errs.shortDescription = t("tourAdmin.basic.shortDescRequired", "Short description is required");
    if (basicInfo.shortDescription.length > 500)
      errs.shortDescription = t("tourAdmin.basic.shortDescLength", "Short description must be 500 characters or less");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePackages = (): boolean => {
    const errs: Record<string, string> = {};
    if (classifications.length === 0) {
      toast.error(t("adminTour.create.validationError", "Please add at least one package."));
      return false;
    }
    classifications.forEach((cls, i) => {
      if (!cls.name.trim()) errs[`cls_${i}_name`] = "Package name is required";
      if (!cls.description.trim())
        errs[`cls_${i}_desc`] = "Package description is required";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateBasicInfo() || !validatePackages()) return;

    setSaving(true);
    try {
      const formData = buildCreateTourFormData({
        basicInfo,
        thumbnail,
        images,
        vietnameseTranslation: viTrans,
        englishTranslation: enTrans,
        classifications: classifications.map((cls) => ({
          name: cls.name,
          enName: cls.enName,
          description: cls.description,
          enDescription: cls.enDescription,
          price: cls.price,
          salePrice: cls.salePrice,
          durationDays: cls.durationDays,
        })),
        dayPlans: classifications.map((cls) =>
          cls.plans.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            enTitle: day.enTitle,
            description: day.description,
            enDescription: day.enDescription,
            activities: day.activities.map((act) => ({
              activityType: act.activityType,
              title: act.title,
              enTitle: act.enTitle,
              description: act.description,
              enDescription: act.enDescription,
              note: act.note,
              enNote: act.enNote,
              estimatedCost: act.estimatedCost,
              isOptional: act.isOptional,
              startTime: act.startTime,
              endTime: act.endTime,
            })),
          })),
        ),
        insurances: classifications.map((cls) =>
          cls.insurances.map((ins) => ({
            insuranceName: ins.insuranceName,
            enInsuranceName: ins.enInsuranceName,
            insuranceType: ins.insuranceType,
            insuranceProvider: ins.insuranceProvider,
            coverageDescription: ins.coverageDescription,
            enCoverageDescription: ins.enCoverageDescription,
            coverageAmount: ins.coverageAmount,
            coverageFee: ins.coverageFee,
            isOptional: ins.isOptional,
            note: ins.note,
            enNote: ins.enNote,
          })),
        ),
        accommodations,
        locations,
        transportations,
        selectedPricingPolicyId,
        selectedDepositPolicyId,
        selectedCancellationPolicyId,
        selectedVisaPolicyId,
      });

      // Append tour ID for update
      formData.append("id", tourId);

      await adminTourService.updateTour(formData);
      toast.success(t("adminTour.edit.saveSuccess", "Tour updated successfully!"));
      router.push("/tour-management");
    } catch (err) {
      const handled = handleApiError(err);
      toast.error(handled.message || t("adminTour.edit.saveError", "Failed to save tour."));
    } finally {
      setSaving(false);
    }
  };

  /* ── Step label map ────────────────────────────────────────── */
  const stepLabels: Record<string, string> = {
    basic: t("adminTour.wizard.basic", "Basic Info"),
    packages: t("adminTour.wizard.packages", "Packages"),
    itineraries: t("adminTour.wizard.itineraries", "Itineraries"),
    accommodations: t("adminTour.wizard.accommodations", "Accommodations"),
    locations: t("adminTour.wizard.locations", "Locations"),
    transportation: t("adminTour.wizard.transportation", "Transportation"),
    services: t("adminTour.wizard.services", "Services"),
    insurance: t("adminTour.wizard.insurance", "Insurance"),
  };

  /* ══════════════════════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════════════════════ */
  if (loadingTour) {
    return (
      <AdminSidebar isOpen={false} onClose={() => {}}>
        <TopBar onMenuClick={() => {}} />
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
          <div className="h-8 w-48 bg-stone-200 rounded-xl animate-pulse" />
          <div className="h-32 bg-stone-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-stone-100 rounded-2xl animate-pulse" />
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TopBar
        onMenuClick={() => setSidebarOpen(true)}
        title={t("adminTour.edit.pageTitle", "Edit Tour")}
        subtitle={t("adminTour.edit.pageSubtitle", "Update tour details and content")}
      />

      <div className="max-w-[1100px] mx-auto p-6 space-y-6">
        {/* ── Wizard Steps ───────────────────────────────── */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {WIZARD_STEPS.map((step, i) => (
            <button
              key={step.key}
              type="button"
              onClick={() => setCurrentStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                i === currentStep
                  ? "bg-amber-500 text-white shadow-sm"
                  : i < currentStep
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              <Icon icon={step.icon} className="size-4" />
              {stepLabels[step.key]}
            </button>
          ))}
        </div>

        {/* ── Step content ────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            {/* ── STEP 0: Basic Info ─────────────────────── */}
            {currentStep === 0 && (
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                  {t("adminTour.wizard.basic", "Basic Information")}
                </h2>

                {/* Tour Name */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                    {t("tourAdmin.basic.tourName", "Tour Name")} *
                  </label>
                  <input
                    type="text"
                    value={basicInfo.tourName}
                    onChange={(e) =>
                      setBasicInfo((p) => ({ ...p, tourName: e.target.value }))
                    }
                    placeholder={t("tourAdmin.basic.tourNamePlaceholder", "e.g., Ha Long Bay 2D1N")}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      errors.tourName
                        ? "border-red-400 focus:ring-red-400"
                        : "border-stone-300 dark:border-slate-600 focus:ring-amber-500"
                    } dark:bg-slate-800 dark:text-white focus:ring-2 focus:border-transparent outline-none transition`}
                  />
                  {errors.tourName && (
                    <p className="text-xs text-red-500 mt-1">{errors.tourName}</p>
                  )}
                </div>

                {/* VI / EN Tabs */}
                <div>
                  <div className="flex gap-4 mb-3 border-b border-stone-200 dark:border-slate-700">
                    <button
                      type="button"
                      className="pb-2 text-sm font-medium text-amber-600 border-b-2 border-amber-500"
                    >
                      🇻🇳 Vietnamese
                    </button>
                    <button
                      type="button"
                      className="pb-2 text-sm font-medium text-stone-400 hover:text-stone-600"
                    >
                      🇬🇧 English
                    </button>
                  </div>

                  {/* Short Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      {t("tourAdmin.basic.shortDescription", "Short Description")} *
                    </label>
                    <textarea
                      value={basicInfo.shortDescription}
                      onChange={(e) =>
                        setBasicInfo((p) => ({
                          ...p,
                          shortDescription: e.target.value,
                        }))
                      }
                      rows={2}
                      maxLength={500}
                      placeholder={t("tourAdmin.basic.shortDescPlaceholder", "A brief summary shown in tour cards...")}
                      className={`w-full px-3 py-2 text-sm rounded-lg border ${
                        errors.shortDescription
                          ? "border-red-400"
                          : "border-stone-300 dark:border-slate-600 focus:ring-amber-500"
                      } dark:bg-slate-800 dark:text-white focus:ring-2 focus:border-transparent outline-none transition resize-none`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.shortDescription ? (
                        <p className="text-xs text-red-500">{errors.shortDescription}</p>
                      ) : (
                        <span />
                      )}
                      <span className="text-xs text-stone-400">
                        {basicInfo.shortDescription.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Long Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      {t("tourAdmin.basic.longDescription", "Full Description")}
                    </label>
                    <textarea
                      value={basicInfo.longDescription}
                      onChange={(e) =>
                        setBasicInfo((p) => ({
                          ...p,
                          longDescription: e.target.value,
                        }))
                      }
                      rows={5}
                      placeholder={t("tourAdmin.basic.longDescPlaceholder", "Detailed tour description...")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>

                  {/* SEO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                        {t("tourAdmin.basic.seoTitle", "SEO Title")}
                      </label>
                      <input
                        type="text"
                        value={basicInfo.seoTitle}
                        onChange={(e) =>
                          setBasicInfo((p) => ({ ...p, seoTitle: e.target.value }))
                        }
                        placeholder={t("tourAdmin.basic.seoTitlePlaceholder", "SEO title...")}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                        {t("tourAdmin.basic.seoDescription", "SEO Description")}
                      </label>
                      <input
                        type="text"
                        value={basicInfo.seoDescription}
                        onChange={(e) =>
                          setBasicInfo((p) => ({
                            ...p,
                            seoDescription: e.target.value,
                          }))
                        }
                        placeholder={t("tourAdmin.basic.seoDescPlaceholder", "SEO description...")}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                      {t("tourAdmin.basic.status", "Status")}
                    </label>
                    <select
                      value={basicInfo.status}
                      onChange={(e) =>
                        setBasicInfo((p) => ({ ...p, status: e.target.value }))
                      }
                      className="px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition cursor-pointer"
                    >
                      <option value="1">{t("tourAdmin.basic.statusActive", "Active")}</option>
                      <option value="2">{t("tourAdmin.basic.statusInactive", "Inactive")}</option>
                      <option value="3">{t("tourAdmin.basic.statusPending", "Pending")}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 1: Packages ─────────────────────────── */}
            {currentStep === 1 && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                    {t("adminTour.wizard.packages", "Packages")}
                  </h2>
                  <button
                    type="button"
                    onClick={addClassification}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <Icon icon="heroicons:plus" className="size-4" />
                    {t("tourAdmin.packages.addPackage", "Add Package")}
                  </button>
                </div>

                {classifications.length === 0 && (
                  <div className="text-center py-12 text-stone-400">
                    <Icon icon="heroicons:cube" className="size-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{t("tourAdmin.packages.noPackages", "No packages yet. Click Add Package to create one.")}</p>
                  </div>
                )}

                {classifications.map((cls, clsI) => (
                  <div
                    key={clsI}
                    className="border border-stone-200 dark:border-slate-700 rounded-xl p-4 space-y-4 bg-stone-50 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                        {t("tourAdmin.packages.package", "Package")} #{clsI + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeClassification(clsI)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Icon icon="heroicons:trash" className="size-4" />
                      </button>
                    </div>

                    {/* Name VI/EN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                          🇻🇳 {t("tourAdmin.packages.name", "Name (VI)")} *
                        </label>
                        <input
                          type="text"
                          value={cls.name}
                          onChange={(e) => updateClassification(clsI, "name", e.target.value)}
                          placeholder="Standard"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                          🇬🇧 {t("tourAdmin.packages.nameEn", "Name (EN)")}
                        </label>
                        <input
                          type="text"
                          value={cls.enName}
                          onChange={(e) => updateClassification(clsI, "enName", e.target.value)}
                          placeholder="Standard"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Description VI/EN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                          🇻🇳 {t("tourAdmin.packages.description", "Description (VI)")} *
                        </label>
                        <textarea
                          value={cls.description}
                          onChange={(e) => updateClassification(clsI, "description", e.target.value)}
                          rows={2}
                          placeholder={t("tourAdmin.packages.descPlaceholder", "Package description...")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                          🇬🇧 {t("tourAdmin.packages.descriptionEn", "Description (EN)")}
                        </label>
                        <textarea
                          value={cls.enDescription}
                          onChange={(e) => updateClassification(clsI, "enDescription", e.target.value)}
                          rows={2}
                          placeholder="Package description..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                        {t("tourAdmin.packages.durationDays", "Duration (days)")} *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={cls.durationDays}
                        onChange={(e) => updateClassification(clsI, "durationDays", e.target.value)}
                        placeholder="1"
                        className="w-32 px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    {/* Adult & Child Price */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                          {t("tourAdmin.packages.adultPrice", "Adult Price (VND)")} *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cls.price}
                          onChange={(e) => updateClassification(clsI, "price", e.target.value)}
                          placeholder={t("tourAdmin.packages.placeholderAdultPrice", "1500000")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                          {t("tourAdmin.packages.childPrice", "Child Price (VND)")}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cls.salePrice}
                          onChange={(e) => updateClassification(clsI, "salePrice", e.target.value)}
                          placeholder={t("tourAdmin.packages.placeholderChildPrice", "750000")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    {errors[`cls_${clsI}_name`] && (
                      <p className="text-xs text-red-500">{errors[`cls_${clsI}_name`]}</p>
                    )}
                    {errors[`cls_${clsI}_desc`] && (
                      <p className="text-xs text-red-500">{errors[`cls_${clsI}_desc`]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 2: Itineraries ─────────────────────── */}
            {currentStep === 2 && (
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                  {t("adminTour.wizard.itineraries", "Itineraries")}
                </h2>

                {classifications.map((cls, clsI) => (
                  <div
                    key={clsI}
                    className="border border-stone-200 dark:border-slate-700 rounded-xl p-4 bg-stone-50 dark:bg-slate-900/50"
                  >
                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-4">
                      {t("tourAdmin.packages.package", "Package")} #{clsI + 1}: {cls.name || `Package ${clsI + 1}`}
                    </h3>

                    {cls.plans.map((day, dayI) => (
                      <div
                        key={dayI}
                        className="border border-stone-200 dark:border-slate-700 rounded-lg p-3 mb-3 bg-white dark:bg-slate-800"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-amber-600">
                            {t("tourAdmin.itineraries.day", "Day")} {day.dayNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDayPlan(clsI, dayI)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Icon icon="heroicons:trash" className="size-3.5" />
                          </button>
                        </div>

                        {/* Day title VI/EN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1">🇻🇳 Title (VI)</label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateDayPlan(clsI, dayI, "title", e.target.value)}
                              placeholder="Day title..."
                              className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1">🇬🇧 Title (EN)</label>
                            <input
                              type="text"
                              value={day.enTitle}
                              onChange={(e) => updateDayPlan(clsI, dayI, "enTitle", e.target.value)}
                              placeholder="Day title..."
                              className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>

                        {/* Activities */}
                        {day.activities.map((act, actI) => (
                          <div
                            key={actI}
                            className="border border-stone-100 dark:border-slate-700 rounded-lg p-3 mb-2 bg-stone-50 dark:bg-slate-900"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-stone-500">
                                {t("tourAdmin.itineraries.activity", "Activity")} #{actI + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeActivity(clsI, dayI, actI)}
                                className="text-stone-400 hover:text-red-500 transition-colors"
                              >
                                <Icon icon="heroicons:x-mark" className="size-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-stone-500 mb-0.5">🇻🇳 Title (VI)</label>
                                <input
                                  type="text"
                                  value={act.title}
                                  onChange={(e) => updateActivity(clsI, dayI, actI, "title", e.target.value)}
                                  placeholder="Activity title..."
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-stone-500 mb-0.5">🇬🇧 Title (EN)</label>
                                <input
                                  type="text"
                                  value={act.enTitle}
                                  onChange={(e) => updateActivity(clsI, dayI, actI, "enTitle", e.target.value)}
                                  placeholder="Activity title..."
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-stone-500 mb-0.5">{t("tourAdmin.itineraries.activityType", "Activity Type")}</label>
                                <select
                                  value={act.activityType}
                                  onChange={(e) => updateActivity(clsI, dayI, actI, "activityType", e.target.value)}
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition cursor-pointer"
                                >
                                  {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.value === "0" ? "Sightseeing" : opt.value === "1" ? "Dining" : opt.value === "2" ? "Shopping" : opt.value === "3" ? "Adventure" : opt.value === "4" ? "Relaxation" : opt.value === "5" ? "Cultural" : opt.value === "6" ? "Entertainment" : opt.value === "7" ? "Transportation" : opt.value === "8" ? "Accommodation" : opt.value === "9" ? "Free Time" : "Other"}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-stone-500 mb-0.5">🇻🇳 Description (VI)</label>
                                <textarea
                                  value={act.description}
                                  onChange={(e) => updateActivity(clsI, dayI, actI, "description", e.target.value)}
                                  rows={2}
                                  placeholder="Activity description..."
                                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-xs text-stone-500 mb-0.5">
                                  <input
                                    type="checkbox"
                                    checked={act.isOptional}
                                    onChange={(e) => updateActivity(clsI, dayI, actI, "isOptional", e.target.checked)}
                                    className="rounded"
                                  />
                                  {t("tourAdmin.itineraries.optional", "Optional activity")}
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addActivity(clsI, dayI)}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                        >
                          <Icon icon="heroicons:plus" className="size-3.5" />
                          {t("tourAdmin.itineraries.addActivity", "Add Activity")}
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addDayPlan(clsI)}
                      className="mt-2 inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      <Icon icon="heroicons:plus" className="size-4" />
                      {t("tourAdmin.itineraries.addDay", "Add Day")}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 3: Accommodations ──────────────────── */}
            {currentStep === 3 && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                    {t("adminTour.wizard.accommodations", "Accommodations")}
                  </h2>
                  <button
                    type="button"
                    onClick={addAccommodation}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <Icon icon="heroicons:plus" className="size-4" />
                    {t("tourAdmin.accommodations.add", "Add Accommodation")}
                  </button>
                </div>

                {accommodations.length === 0 && (
                  <p className="text-center text-stone-400 text-sm py-8">
                    {t("tourAdmin.accommodations.empty", "No accommodations added.")}
                  </p>
                )}

                {accommodations.map((acc, i) => (
                  <div
                    key={i}
                    className="border border-stone-200 dark:border-slate-700 rounded-xl p-4 bg-stone-50 dark:bg-slate-900/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                        {t("tourAdmin.accommodations.item", "Accommodation")} #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAccommodation(i)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Icon icon="heroicons:trash" className="size-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">🇻🇳 {t("tourAdmin.accommodations.name", "Name (VI)")}</label>
                        <input
                          type="text"
                          value={acc.accommodationName}
                          onChange={(e) => updateAccommodation(i, "accommodationName", e.target.value)}
                          placeholder={t("tourAdmin.accommodations.placeholderName", "Hotel name...")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">🇬🇧 {t("tourAdmin.accommodations.nameEn", "Name (EN)")}</label>
                        <input
                          type="text"
                          value={acc.enAccommodationName}
                          onChange={(e) => updateAccommodation(i, "enAccommodationName", e.target.value)}
                          placeholder="Hotel name..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.accommodations.contactPhone", "Contact")}</label>
                        <input
                          type="text"
                          value={acc.contactPhone}
                          onChange={(e) => updateAccommodation(i, "contactPhone", e.target.value)}
                          placeholder="+84..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.accommodations.checkInTime", "Check-in")}</label>
                        <input
                          type="text"
                          value={acc.checkInTime}
                          onChange={(e) => updateAccommodation(i, "checkInTime", e.target.value)}
                          placeholder="14:00"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.accommodations.checkOutTime", "Check-out")}</label>
                        <input
                          type="text"
                          value={acc.checkOutTime}
                          onChange={(e) => updateAccommodation(i, "checkOutTime", e.target.value)}
                          placeholder="12:00"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 4: Locations ───────────────────────── */}
            {currentStep === 4 && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                    {t("adminTour.wizard.locations", "Locations")}
                  </h2>
                  <button
                    type="button"
                    onClick={addLocation}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <Icon icon="heroicons:plus" className="size-4" />
                    {t("tourAdmin.locations.add", "Add Location")}
                  </button>
                </div>

                {locations.length === 0 && (
                  <p className="text-center text-stone-400 text-sm py-8">
                    {t("tourAdmin.locations.empty", "No locations added.")}
                  </p>
                )}

                {locations.map((loc, i) => (
                  <div
                    key={i}
                    className="border border-stone-200 dark:border-slate-700 rounded-xl p-4 bg-stone-50 dark:bg-slate-900/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                        {t("tourAdmin.locations.item", "Location")} #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLocation(i)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Icon icon="heroicons:trash" className="size-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">🇻🇳 {t("tourAdmin.locations.name", "Name (VI)")}</label>
                        <input
                          type="text"
                          value={loc.locationName}
                          onChange={(e) => updateLocation(i, "locationName", e.target.value)}
                          placeholder={t("tourAdmin.locations.placeholderName", "Location name...")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">🇬🇧 {t("tourAdmin.locations.nameEn", "Name (EN)")}</label>
                        <input
                          type="text"
                          value={loc.enLocationName}
                          onChange={(e) => updateLocation(i, "enLocationName", e.target.value)}
                          placeholder="Location name..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.locations.city", "City")}</label>
                        <input
                          type="text"
                          value={loc.city}
                          onChange={(e) => updateLocation(i, "city", e.target.value)}
                          placeholder={t("tourAdmin.locations.placeholderCity", "Quảng Ninh")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.locations.country", "Country")}</label>
                        <input
                          type="text"
                          value={loc.country}
                          onChange={(e) => updateLocation(i, "country", e.target.value)}
                          placeholder="Vietnam"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 5: Transportation ───────────────────── */}
            {currentStep === 5 && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                    {t("adminTour.wizard.transportation", "Transportation")}
                  </h2>
                  <button
                    type="button"
                    onClick={addTransportation}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <Icon icon="heroicons:plus" className="size-4" />
                    {t("tourAdmin.transportation.add", "Add Transport")}
                  </button>
                </div>

                {transportations.length === 0 && (
                  <p className="text-center text-stone-400 text-sm py-8">
                    {t("tourAdmin.transportation.empty", "No transportation added.")}
                  </p>
                )}

                {transportations.map((tr, i) => (
                  <div
                    key={i}
                    className="border border-stone-200 dark:border-slate-700 rounded-xl p-4 bg-stone-50 dark:bg-slate-900/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                        {t("tourAdmin.transportation.item", "Transport")} #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTransportation(i)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Icon icon="heroicons:trash" className="size-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.transportation.from", "From")}</label>
                        <input
                          type="text"
                          value={tr.fromLocation}
                          onChange={(e) => updateTransportation(i, "fromLocation", e.target.value)}
                          placeholder="Hanoi"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.transportation.to", "To")}</label>
                        <input
                          type="text"
                          value={tr.toLocation}
                          onChange={(e) => updateTransportation(i, "toLocation", e.target.value)}
                          placeholder="Ha Long Bay"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.transportation.type", "Type")}</label>
                        <input
                          type="text"
                          value={tr.transportationType}
                          onChange={(e) => updateTransportation(i, "transportationType", e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("tourAdmin.transportation.duration", "Duration (min)")}</label>
                        <input
                          type="number"
                          value={tr.durationMinutes}
                          onChange={(e) => updateTransportation(i, "durationMinutes", e.target.value)}
                          placeholder="120"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 6: Services ─────────────────────────── */}
            {currentStep === 6 && (
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                  {t("adminTour.wizard.services", "Services")}
                </h2>
                <p className="text-sm text-stone-500">
                  {t("tourAdmin.services.comingSoon", "Service management coming soon. Services can be edited after tour creation.")}
                </p>
              </div>
            )}

            {/* ── STEP 7: Insurance ─────────────────────────── */}
            {currentStep === 7 && (
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                  {t("adminTour.wizard.insurance", "Insurance")}
                </h2>

                {classifications.map((cls, clsI) => (
                  <div
                    key={clsI}
                    className="border border-stone-200 dark:border-slate-700 rounded-xl p-4 bg-stone-50 dark:bg-slate-900/50"
                  >
                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-3">
                      {t("tourAdmin.packages.package", "Package")} #{clsI + 1}: {cls.name || `Package ${clsI + 1}`}
                    </h3>

                    {cls.insurances.map((ins, insI) => (
                      <div
                        key={insI}
                        className="border border-stone-200 dark:border-slate-700 rounded-lg p-3 mb-2 bg-white dark:bg-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-stone-500">
                            {t("tourAdmin.insurance.item", "Insurance")} #{insI + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeInsurance(clsI, insI)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Icon icon="heroicons:x-mark" className="size-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-stone-500 mb-0.5">{t("tourAdmin.insurance.name", "Name (VI)")}</label>
                            <input
                              type="text"
                              value={ins.insuranceName}
                              onChange={(e) => updateInsurance(clsI, insI, "insuranceName", e.target.value)}
                              placeholder={t("tourAdmin.insurance.placeholderName", "Insurance name...")}
                              className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-stone-500 mb-0.5">{t("tourAdmin.insurance.type", "Type")}</label>
                            <select
                              value={ins.insuranceType}
                              onChange={(e) => updateInsurance(clsI, insI, "insuranceType", e.target.value)}
                              className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition cursor-pointer"
                            >
                              <option value="0">None</option>
                              <option value="1">Travel</option>
                              <option value="2">Health</option>
                              <option value="3">Trip Cancellation</option>
                              <option value="4">Baggage Loss</option>
                              <option value="5">Personal Liability</option>
                              <option value="6">Adventure Sports</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-stone-500 mb-0.5">{t("tourAdmin.insurance.provider", "Provider")}</label>
                            <input
                              type="text"
                              value={ins.insuranceProvider}
                              onChange={(e) => updateInsurance(clsI, insI, "insuranceProvider", e.target.value)}
                              placeholder="Provider..."
                              className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-stone-500 mb-0.5">{t("tourAdmin.insurance.coverageFee", "Fee (VND)")}</label>
                            <input
                              type="number"
                              min="0"
                              value={ins.coverageFee}
                              onChange={(e) => updateInsurance(clsI, insI, "coverageFee", e.target.value)}
                              placeholder="0"
                              className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-xs text-stone-500 mb-0.5">
                              <input
                                type="checkbox"
                                checked={ins.isOptional}
                                onChange={(e) => updateInsurance(clsI, insI, "isOptional", e.target.checked)}
                                className="rounded"
                              />
                              {t("tourAdmin.insurance.optional", "Optional")}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addInsurance(clsI)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      <Icon icon="heroicons:plus" className="size-3.5" />
                      {t("tourAdmin.insurance.add", "Add Insurance")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer Navigation ─────────────────────────── */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl border border-stone-200 dark:border-slate-700 px-6 py-4 shadow-sm">
          <div className="text-sm text-stone-500">
            {t("adminTour.form.step", "Step")} {currentStep + 1} {t("adminTour.form.of", "of")} {WIZARD_STEPS.length}
          </div>
          <div className="flex items-center gap-3">
            {canGoPrev ? (
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium border border-stone-300 dark:border-slate-600 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon icon="heroicons:arrow-left" className="size-4" />
                {t("adminTour.form.previous", "Previous")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/tour-management")}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium border border-stone-300 dark:border-slate-600 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon icon="heroicons:arrow-left" className="size-4" />
                {t("common.back", "Back")}
              </button>
            )}
            {canGoNext ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                {t("adminTour.form.next", "Next")}
                <Icon icon="heroicons:arrow-right" className="size-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving && (
                    <Icon icon="heroicons:arrow-path" className="size-4 animate-spin" />
                  )}
                  <Icon icon="heroicons:check" className="size-4" />
                  {saving
                    ? t("adminTour.edit.saving", "Saving...")
                    : t("adminTour.edit.saveChanges", "Save Changes")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}