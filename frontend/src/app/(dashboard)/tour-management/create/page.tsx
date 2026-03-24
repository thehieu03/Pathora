"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icon";
import SearchableSelect from "@/components/ui/SearchableSelect";
import TourImageUpload from "@/components/ui/TourImageUpload";
import LanguageTabs, {
  type SupportedLanguage,
} from "@/components/ui/LanguageTabs";
import { tourService } from "@/api/services/tourService";
import { pricingPolicyService } from "@/api/services/pricingPolicyService";
import { depositPolicyService } from "@/api/services/depositPolicyService";
import { cancellationPolicyService } from "@/api/services/cancellationPolicyService";
import { visaPolicyService } from "@/api/services/visaPolicyService";
import { buildCreateTourFormData } from "@/api/services/tourCreatePayload";
import type { PricingPolicy } from "@/types/pricingPolicy";
import type { DepositPolicy } from "@/types/depositPolicy";
import type { CancellationPolicy } from "@/types/cancellationPolicy";
import type { VisaPolicy } from "@/types/visaPolicy";
import { handleApiError } from "@/utils/apiResponse";

/* ── Types ──────────────────────────────────────────────────── */
interface ClassificationForm {
  name: string;
  enName: string;
  description: string;
  enDescription: string;
  price: string;
  salePrice: string;
  durationDays: string;
}

interface ActivityForm {
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
  linkToResources: string[];
}

interface DayPlanForm {
  dayNumber: string;
  title: string;
  enTitle: string;
  description: string;
  enDescription: string;
  activities: ActivityForm[];
}

interface InsuranceForm {
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
  { value: "0" },
  { value: "1" },
  { value: "2" },
  { value: "3" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
  { value: "7" },
  { value: "8" },
  { value: "9" },
  { value: "99" },
];

const INSURANCE_TYPE_OPTIONS = [
  { value: "0" },
  { value: "1" },
  { value: "2" },
  { value: "3" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
];

const WIZARD_STEPS = [
  { key: "basic", label: "", icon: "heroicons:information-circle" },
  { key: "packages", label: "", icon: "heroicons:cube" },
  { key: "itineraries", label: "", icon: "heroicons:calendar-days" },
  {
    key: "accommodations",
    label: "",
    icon: "heroicons:home-modern",
  },
  { key: "locations", label: "", icon: "heroicons:map-pin" },
  { key: "transportation", label: "", icon: "heroicons:truck" },
  { key: "services", label: "", icon: "heroicons:wrench-screwdriver" },
  { key: "insurance", label: "", icon: "heroicons:shield-check" },
];

/* ── Sidebar ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "", icon: "heroicons:squares-2x2", href: "/dashboard" },
  { label: "", icon: "heroicons:globe-alt", href: "/tour-management" },
  {
    label: "",
    icon: "heroicons:calendar-days",
    href: "/tour-instances",
  },
  {
    label: "",
    icon: "heroicons:ticket",
    href: "/dashboard/bookings",
  },
  {
    label: "",
    icon: "heroicons:credit-card",
    href: "/dashboard/payments",
  },
  {
    label: "",
    icon: "heroicons:user-group",
    href: "/dashboard/customers",
  },
  {
    label: "",
    icon: "heroicons:shield-check",
    href: "/dashboard/insurance",
  },
  {
    label: "",
    icon: "heroicons:document-check",
    href: "/dashboard/visa",
  },
  {
    label: "",
    icon: "heroicons:clipboard-document-list",
    href: "/dashboard/policies",
  },
  {
    label: "",
    icon: "heroicons:cog-6-tooth",
    href: "/dashboard/settings",
  },
];

function Sidebar({ open, onClose, navItems }: { open: boolean; onClose: () => void; navItems: Array<{ label: string; icon: string; href: string }> }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "max-lg:-translate-x-full"
      }`}>
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-700/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm font-bold">
            P
          </div>
          <span className="text-lg font-semibold">Pathora Admin</span>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="lg:hidden text-slate-400 hover:text-white">
          <Icon icon="heroicons:x-mark" className="size-5" />
        </button>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.label === navItems[1]?.label
                ? "bg-orange-500 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}>
            <Icon icon={item.icon} className="size-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-700/50 p-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg">
          <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{navItems[navItems.length - 1]?.label}</p>
            <p className="text-xs text-slate-400 truncate">{navItems[navItems.length - 1]?.label}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Empty form factories ───────────────────────────────────── */
const emptyClassification = (): ClassificationForm => ({
  name: "",
  enName: "",
  description: "",
  enDescription: "",
  price: "",
  salePrice: "",
  durationDays: "",
});

const emptyActivity = (): ActivityForm => ({
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
  linkToResources: [""],
});

const emptyDayPlan = (): DayPlanForm => ({
  dayNumber: "1",
  title: "",
  enTitle: "",
  description: "",
  enDescription: "",
  activities: [],
});

const emptyInsurance = (): InsuranceForm => ({
  insuranceName: "",
  enInsuranceName: "",
  insuranceType: "1",
  insuranceProvider: "",
  coverageDescription: "",
  enCoverageDescription: "",
  coverageAmount: "",
  coverageFee: "",
  isOptional: false,
  note: "",
  enNote: "",
});

const emptyService = (): ServiceForm => ({
  serviceName: "",
  pricingType: "",
  price: "",
  salePrice: "",
  email: "",
  contactNumber: "",
});

const emptyAccommodation = (): AccommodationForm => ({
  accommodationName: "",
  enAccommodationName: "",
  address: "",
  enAddress: "",
  contactPhone: "",
  checkInTime: "",
  checkOutTime: "",
  note: "",
  enNote: "",
});

const emptyLocation = (): LocationForm => ({
  locationName: "",
  enLocationName: "",
  type: "",
  enType: "",
  description: "",
  enDescription: "",
  city: "",
  enCity: "",
  country: "",
  enCountry: "",
  entranceFee: "",
  address: "",
  enAddress: "",
});

const emptyTransportation = (): TransportationForm => ({
  fromLocation: "",
  enFromLocation: "",
  toLocation: "",
  enToLocation: "",
  transportationType: "",
  enTransportationType: "",
  transportationName: "",
  enTransportationName: "",
  durationMinutes: "",
  pricingType: "",
  price: "",
  requiresIndividualTicket: false,
  ticketInfo: "",
  enTicketInfo: "",
  note: "",
  enNote: "",
});

/* ══════════════════════════════════════════════════════════════
   Create Tour Page — Multi-step Wizard (9 Steps)
   ══════════════════════════════════════════════════════════════ */
export default function CreateTourPage() {
  const { t } = useTranslation();
  const router = useRouter();

  /* ── i18n ──────────────────────────────────────────────────── */
  const navItems = [
    { icon: "heroicons:squares-2x2", href: "/dashboard" },
    { icon: "heroicons:globe-alt", href: "/tour-management" },
    { icon: "heroicons:calendar-days", href: "/tour-instances" },
    { icon: "heroicons:ticket", href: "/dashboard/bookings" },
    { icon: "heroicons:credit-card", href: "/dashboard/payments" },
    { icon: "heroicons:user-group", href: "/dashboard/customers" },
    { icon: "heroicons:shield-check", href: "/dashboard/insurance" },
    { icon: "heroicons:document-check", href: "/dashboard/visa" },
    { icon: "heroicons:clipboard-document-list", href: "/dashboard/policies" },
    { icon: "heroicons:cog-6-tooth", href: "/dashboard/settings" },
  ];
  const navLabels = [
    t("tourAdmin.nav.dashboard"),
    t("tourAdmin.nav.tours"),
    t("tourAdmin.nav.tourInstances"),
    t("tourAdmin.nav.bookings"),
    t("tourAdmin.nav.payments"),
    t("tourAdmin.nav.customers"),
    t("tourAdmin.nav.insurance"),
    t("tourAdmin.nav.visaApplications"),
    t("tourAdmin.nav.policies"),
    t("tourAdmin.nav.settings"),
  ];
  const navWithLabels = navItems.map((item, i) => ({ ...item, label: navLabels[i] }));

  const wizardStepLabels = [
    t("tourAdmin.steps.basic"),
    t("tourAdmin.steps.packages"),
    t("tourAdmin.steps.itineraries"),
    t("tourAdmin.steps.accommodations"),
    t("tourAdmin.steps.locations"),
    t("tourAdmin.steps.transportation"),
    t("tourAdmin.steps.services"),
    t("tourAdmin.steps.insurance"),
  ];

  const activityTypes = [
    t("tourAdmin.activityTypes.0"),
    t("tourAdmin.activityTypes.1"),
    t("tourAdmin.activityTypes.2"),
    t("tourAdmin.activityTypes.3"),
    t("tourAdmin.activityTypes.4"),
    t("tourAdmin.activityTypes.5"),
    t("tourAdmin.activityTypes.6"),
    t("tourAdmin.activityTypes.7"),
    t("tourAdmin.activityTypes.8"),
    t("tourAdmin.activityTypes.9"),
    t("tourAdmin.activityTypes.99"),
  ];

  const insuranceTypes = [
    t("tourAdmin.insuranceTypes.0"),
    t("tourAdmin.insuranceTypes.1"),
    t("tourAdmin.insuranceTypes.2"),
    t("tourAdmin.insuranceTypes.3"),
    t("tourAdmin.insuranceTypes.4"),
    t("tourAdmin.insuranceTypes.5"),
    t("tourAdmin.insuranceTypes.6"),
  ];

  /* ── Layout state ─────────────────────────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Wizard state ─────────────────────────────────────────── */
  const [currentStep, setCurrentStep] = useState(0);
  const [maxNavigableStep, setMaxNavigableStep] = useState(0);
  const [saving, setSaving] = useState(false);

  /* ── Step 1: Basic Info ───────────────────────────────────── */
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

  /* ── Step 2: Classifications ──────────────────────────────── */
  const [classifications, setClassifications] = useState<ClassificationForm[]>([
    emptyClassification(),
  ]);

  /* ── Step 3: Day Plans (per classification) ───────────────── */
  const [dayPlans, setDayPlans] = useState<DayPlanForm[][]>([[]]);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);

  /* ── Step 8: Insurance (per classification) ───────────────── */
  const [insurances, setInsurances] = useState<InsuranceForm[][]>([[]]);

  /* ── Step 7: Services ─────────────────────────────────────── */
  const [services, setServices] = useState<ServiceForm[]>([emptyService()]);

  /* ── Step 4: Accommodations ───────────────────────────────── */
  const [accommodations, setAccommodations] = useState<AccommodationForm[]>([
    emptyAccommodation(),
  ]);

  /* ── Step 5: Locations ────────────────────────────────────── */
  const [locations, setLocations] = useState<LocationForm[]>([emptyLocation()]);

  /* ── Step 6: Transportation ───────────────────────────────── */
  const [transportations, setTransportations] = useState<TransportationForm[]>([
    emptyTransportation(),
  ]);

  /* ── Policies ──────────────────────────────────────────── */
  const [pricingPolicies, setPricingPolicies] = useState<PricingPolicy[]>([]);
  const [depositPolicies, setDepositPolicies] = useState<DepositPolicy[]>([]);
  const [cancellationPolicies, setCancellationPolicies] = useState<CancellationPolicy[]>([]);
  const [visaPolicies, setVisaPolicies] = useState<VisaPolicy[]>([]);
  const [selectedPricingPolicyId, setSelectedPricingPolicyId] = useState<string>("");
  const [selectedDepositPolicyId, setSelectedDepositPolicyId] = useState<string>("");
  const [selectedCancellationPolicyId, setSelectedCancellationPolicyId] = useState<string>("");
  const [selectedVisaPolicyId, setSelectedVisaPolicyId] = useState<string>("");

  /* ── Validation ───────────────────────────────────────────── */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbnailError, setThumbnailError] = useState<string>();
  const [imagesError, setImagesError] = useState<string>();

  /* ── Fetch Policies ──────────────────────────────────────────── */
  const policiesFetched = useRef(false);
  useEffect(() => {
    if (policiesFetched.current) return;
    policiesFetched.current = true;

    const fetchPolicies = async () => {
      try {
        const [ppRes, dpRes, cpRes, vpRes] = await Promise.all([
          pricingPolicyService.getAll(),
          depositPolicyService.getAll(),
          cancellationPolicyService.getAll(),
          visaPolicyService.getAll(),
        ]);
        if (ppRes.success && ppRes.data) setPricingPolicies(ppRes.data);
        if (dpRes.success && dpRes.data) setDepositPolicies(dpRes.data);
        if (cpRes.success && cpRes.data) setCancellationPolicies(cpRes.data);
        if (vpRes.success && vpRes.data) setVisaPolicies(vpRes.data);
      } catch (err) {
        console.error("Failed to fetch policies:", err);
      }
    };
    fetchPolicies();
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!basicInfo.tourName.trim())
        newErrors.tourName = t("tourAdmin.required", "Required");
      if (!basicInfo.shortDescription.trim())
        newErrors.shortDescription = t("tourAdmin.required", "Required");
      if (thumbnailError) newErrors.thumbnail = thumbnailError;
      if (imagesError) newErrors.images = imagesError;
    }

    if (step === 1) {
      if (classifications.length === 0) {
        newErrors.classifications = t("tourAdmin.validation.atLeastOnePackage", "At least one package is required.");
      }
      classifications.forEach((cls, i) => {
        if (!cls.name.trim())
          newErrors[`cls_${i}_name`] = t("tourAdmin.required", "Required");
        if (!cls.enName.trim())
          newErrors[`cls_${i}_enName`] = t("tourAdmin.required", "Required");
        if (!cls.description.trim())
          newErrors[`cls_${i}_description`] = t("tourAdmin.required", "Required");
        if (!cls.enDescription.trim())
          newErrors[`cls_${i}_enDescription`] = t("tourAdmin.required", "Required");
        if (!cls.durationDays || Number(cls.durationDays) <= 0)
          newErrors[`cls_${i}_duration`] = t(
            "tourAdmin.invalidDuration",
            "Invalid duration",
          );
        const price = Number(cls.price);
        if (!cls.price.trim() || isNaN(price) || price < 0)
          newErrors[`cls_${i}_price`] = t(
            "tourAdmin.validation.invalidPrice",
            "Invalid price",
          );
      });
    }

    if (step === 2) {
      const plans = dayPlans[ci] ?? [];
      if (plans.length === 0) {
        newErrors.dayPlans = t("tourAdmin.validation.atLeastOneDayPlan", "At least one day plan is required.");
      }
      plans.forEach((plan, i) => {
        if (!plan.title.trim())
          newErrors[`plan_${i}_title`] = t("tourAdmin.required", "Required");
        if (!plan.enTitle.trim())
          newErrors[`plan_${i}_enTitle`] = t("tourAdmin.required", "Required");
        if (!plan.description.trim())
          newErrors[`plan_${i}_description`] = t("tourAdmin.required", "Required");
        if (!plan.enDescription.trim())
          newErrors[`plan_${i}_enDescription`] = t("tourAdmin.required", "Required");
      });
    }

    if (step === 3) {
      accommodations.forEach((acc, i) => {
        if (!acc.accommodationName.trim())
          newErrors[`acc_${i}_name`] = t("tourAdmin.required", "Required");
        if (!acc.enAccommodationName.trim())
          newErrors[`acc_${i}_enName`] = t("tourAdmin.required", "Required");
        if (!acc.address.trim())
          newErrors[`acc_${i}_address`] = t("tourAdmin.required", "Required");
      });
    }

    if (step === 4) {
      locations.forEach((loc, i) => {
        if (!loc.locationName.trim())
          newErrors[`loc_${i}_name`] = t("tourAdmin.required", "Required");
        if (!loc.enLocationName.trim())
          newErrors[`loc_${i}_enName`] = t("tourAdmin.required", "Required");
        if (!loc.city.trim())
          newErrors[`loc_${i}_city`] = t("tourAdmin.required", "Required");
        if (!loc.country.trim())
          newErrors[`loc_${i}_country`] = t("tourAdmin.required", "Required");
      });
    }

    if (step === 5) {
      transportations.forEach((tr, i) => {
        if (!tr.transportationType.trim())
          newErrors[`tr_${i}_type`] = t("tourAdmin.required", "Required");
        if (!tr.enTransportationType.trim())
          newErrors[`tr_${i}_enType`] = t("tourAdmin.required", "Required");
        if (!tr.fromLocation.trim())
          newErrors[`tr_${i}_from`] = t("tourAdmin.required", "Required");
        if (!tr.enFromLocation.trim())
          newErrors[`tr_${i}_enFrom`] = t("tourAdmin.required", "Required");
        if (!tr.toLocation.trim())
          newErrors[`tr_${i}_to`] = t("tourAdmin.required", "Required");
        if (!tr.enToLocation.trim())
          newErrors[`tr_${i}_enTo`] = t("tourAdmin.required", "Required");
        const price = Number(tr.price);
        if (!tr.price.trim() || isNaN(price) || price < 0)
          newErrors[`tr_${i}_price`] = t(
            "tourAdmin.validation.invalidPrice",
            "Invalid price",
          );
      });
    }

    if (step === 6) {
      services.forEach((svc, i) => {
        if (!svc.serviceName.trim())
          newErrors[`svc_${i}_name`] = t("tourAdmin.required", "Required");
        if (!svc.pricingType.trim())
          newErrors[`svc_${i}_pricingType`] = t("tourAdmin.required", "Required");
      });
    }

    if (step === 7) {
      // Insurance is optional, but if provided, validate required fields
      const insurancesForClass = insurances[ci] ?? [];
      insurancesForClass.forEach((ins, i) => {
        if (ins.insuranceName.trim() || ins.enInsuranceName.trim()) {
          if (!ins.insuranceName.trim())
            newErrors[`ins_${i}_name`] = t("tourAdmin.required", "Required");
          if (!ins.enInsuranceName.trim())
            newErrors[`ins_${i}_enName`] = t("tourAdmin.required", "Required");
          if (!ins.coverageDescription.trim())
            newErrors[`ins_${i}_coverage`] = t("tourAdmin.required", "Required");
          if (!ins.enCoverageDescription.trim())
            newErrors[`ins_${i}_enCoverage`] = t("tourAdmin.required", "Required");
          const amount = Number(ins.coverageAmount);
          if (!ins.coverageAmount.trim() || isNaN(amount) || amount <= 0)
            newErrors[`ins_${i}_amount`] = t(
              "tourAdmin.validation.invalidCoverageAmount",
              "Invalid coverage amount",
            );
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      setThumbnailError(undefined);
      setImagesError(undefined);
      const nextStep = Math.min(currentStep + 1, WIZARD_STEPS.length - 1);
      setCurrentStep(nextStep);
      setMaxNavigableStep((max) => Math.max(max, nextStep));
    }
  };

  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  /* ── Classification CRUD ──────────────────────────────────── */
  const addClassification = () => {
    setClassifications((prev) => [...prev, emptyClassification()]);
    setDayPlans((prev) => [...prev, []]);
    setInsurances((prev) => [...prev, []]);
  };

  const removeClassification = (index: number) => {
    if (classifications.length <= 1) return;
    setClassifications((prev) => prev.filter((_, i) => i !== index));
    setDayPlans((prev) => prev.filter((_, i) => i !== index));
    setInsurances((prev) => prev.filter((_, i) => i !== index));
  };

  const updateClassification = (
    index: number,
    field: keyof ClassificationForm,
    value: string,
  ) => {
    setClassifications((prev) =>
      prev.map((cls, i) => (i === index ? { ...cls, [field]: value } : cls)),
    );
  };

  /* ── Day Plan CRUD ────────────────────────────────────────── */
  const addDayPlan = (clsIndex: number) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? [
              ...plans,
              {
                ...emptyDayPlan(),
                dayNumber: String(plans.length + 1),
              },
            ]
          : plans,
      ),
    );
  };

  const removeDayPlan = (clsIndex: number, dayIndex: number) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex ? plans.filter((_, j) => j !== dayIndex) : plans,
      ),
    );
  };

  const updateDayPlan = (
    clsIndex: number,
    dayIndex: number,
    field: keyof DayPlanForm,
    value: string,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? plans.map((day, j) =>
              j === dayIndex ? { ...day, [field]: value } : day,
            )
          : plans,
      ),
    );
  };

  /* ── Activity CRUD ────────────────────────────────────────── */
  const addActivity = (clsIndex: number, dayIndex: number) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? plans.map((day, j) =>
              j === dayIndex
                ? { ...day, activities: [...day.activities, emptyActivity()] }
                : day,
            )
          : plans,
      ),
    );
  };

  const removeActivity = (
    clsIndex: number,
    dayIndex: number,
    actIndex: number,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? plans.map((day, j) =>
              j === dayIndex
                ? {
                    ...day,
                    activities: day.activities.filter((_, k) => k !== actIndex),
                  }
                : day,
            )
          : plans,
      ),
    );
  };

  const updateActivity = (
    clsIndex: number,
    dayIndex: number,
    actIndex: number,
    field: keyof ActivityForm,
    value: string | boolean,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? plans.map((day, j) =>
              j === dayIndex
                ? {
                    ...day,
                    activities: day.activities.map((act, k) =>
                      k === actIndex ? { ...act, [field]: value } : act,
                    ),
                  }
                : day,
            )
          : plans,
      ),
    );
  };

  /* ── Insurance CRUD ───────────────────────────────────────── */
  const addInsurance = (clsIndex: number) => {
    setInsurances((prev) =>
      prev.map((insList, i) =>
        i === clsIndex ? [...insList, emptyInsurance()] : insList,
      ),
    );
  };

  const removeInsurance = (clsIndex: number, insIndex: number) => {
    setInsurances((prev) =>
      prev.map((insList, i) =>
        i === clsIndex ? insList.filter((_, j) => j !== insIndex) : insList,
      ),
    );
  };

  const updateInsurance = (
    clsIndex: number,
    insIndex: number,
    field: keyof InsuranceForm,
    value: string | boolean,
  ) => {
    setInsurances((prev) =>
      prev.map((insList, i) =>
        i === clsIndex
          ? insList.map((ins, j) =>
              j === insIndex ? { ...ins, [field]: value } : ins,
            )
          : insList,
      ),
    );
  };

  /* ── Link to Resources CRUD ─────────────────────────────────── */
  const addLinkToResource = (
    clsIndex: number,
    dayIndex: number,
    actIndex: number,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? plans.map((day, j) =>
              j === dayIndex
                ? {
                    ...day,
                    activities: day.activities.map((act, k) =>
                      k === actIndex
                        ? {
                            ...act,
                            linkToResources: [...act.linkToResources, ""],
                          }
                        : act,
                    ),
                  }
                : day,
            )
          : plans,
      ),
    );
  };

  const updateLinkToResource = (
    clsIndex: number,
    dayIndex: number,
    actIndex: number,
    linkIndex: number,
    value: string,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? plans.map((day, j) =>
              j === dayIndex
                ? {
                    ...day,
                    activities: day.activities.map((act, k) =>
                      k === actIndex
                        ? {
                            ...act,
                            linkToResources: act.linkToResources.map(
                              (link, l) => (l === linkIndex ? value : link),
                            ),
                          }
                        : act,
                    ),
                  }
                : day,
            )
          : plans,
      ),
    );
  };

  const removeLinkToResource = (
    clsIndex: number,
    dayIndex: number,
    actIndex: number,
    linkIndex: number,
  ) => {
    setDayPlans((prev) =>
      prev.map((plans, i) =>
        i === clsIndex
          ? plans.map((day, j) =>
              j === dayIndex
                ? {
                    ...day,
                    activities: day.activities.map((act, k) =>
                      k === actIndex
                        ? {
                            ...act,
                            linkToResources: act.linkToResources.filter(
                              (_, l) => l !== linkIndex,
                            ),
                          }
                        : act,
                    ),
                  }
                : day,
            )
          : plans,
      ),
    );
  };

  /* ── Service CRUD ─────────────────────────────────────────── */
  const addService = () => {
    setServices((prev) => [...prev, emptyService()]);
  };

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateService = (
    index: number,
    field: keyof ServiceForm,
    value: string,
  ) => {
    setServices((prev) =>
      prev.map((svc, i) => (i === index ? { ...svc, [field]: value } : svc)),
    );
  };

  /* ── Accommodation CRUD ───────────────────────────────────── */
  const addAccommodation = () => {
    setAccommodations((prev) => [...prev, emptyAccommodation()]);
  };

  const removeAccommodation = (index: number) => {
    setAccommodations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAccommodation = (
    index: number,
    field: keyof AccommodationForm,
    value: string,
  ) => {
    setAccommodations((prev) =>
      prev.map((acc, i) => (i === index ? { ...acc, [field]: value } : acc)),
    );
  };

  /* ── Location CRUD ────────────────────────────────────────── */
  const addLocation = () => {
    setLocations((prev) => [...prev, emptyLocation()]);
  };

  const removeLocation = (index: number) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLocation = (
    index: number,
    field: keyof LocationForm,
    value: string,
  ) => {
    setLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, [field]: value } : loc)),
    );
  };

  /* ── Transportation CRUD ──────────────────────────────────── */
  const addTransportation = () => {
    setTransportations((prev) => [...prev, emptyTransportation()]);
  };

  const removeTransportation = (index: number) => {
    setTransportations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTransportation = (
    index: number,
    field: keyof TransportationForm,
    value: string | boolean,
  ) => {
    setTransportations((prev) =>
      prev.map((tr, i) => (i === index ? { ...tr, [field]: value } : tr)),
    );
  };

  /* ── Submit ───────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setSaving(true);
      const formData = buildCreateTourFormData({
        basicInfo,
        thumbnail,
        images,
        vietnameseTranslation: {
          tourName: basicInfo.tourName,
          shortDescription: basicInfo.shortDescription,
          longDescription: basicInfo.longDescription,
          seoTitle: basicInfo.seoTitle,
          seoDescription: basicInfo.seoDescription,
        },
        englishTranslation: enTranslation,
        classifications,
        dayPlans,
        insurances,
        accommodations,
        locations,
        transportations,
        selectedPricingPolicyId,
        selectedDepositPolicyId,
        selectedCancellationPolicyId,
        selectedVisaPolicyId,
      });

      await tourService.createTour(formData);
      toast.success(t("tourAdmin.createSuccess", "Tour created successfully!"));
      router.push("/tour-management");
    } catch (error: unknown) {
      const handledError = handleApiError(error);
      console.error("Failed to create tour:", handledError.message);
      toast.error(t("tourAdmin.createError", "Failed to create tour"));
    } finally {
      setSaving(false);
    }
  };

  /* ══════════════════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════════════════ */
  const ci = selectedPackageIndex;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} navItems={navWithLabels} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400">
                <Icon icon="heroicons:bars-3" className="size-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("tourAdmin.createPage.title")}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("tourAdmin.createPage.stepOf", { current: currentStep + 1, total: WIZARD_STEPS.length })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/tour-management")}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                {t("tourAdmin.createPage.cancel")}
              </button>
              <button
                onClick={() => {
                  toast.info(
                    t("toast.draftNotImplemented", "Draft saving not yet implemented"),
                  );
                }}
                className="px-4 py-2 text-sm font-medium border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                {t("tourAdmin.createPage.saveDraft")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2">
                {saving && (
                  <Icon
                    icon="heroicons:arrow-path"
                    className="size-4 animate-spin"
                  />
                )}
                {t("tourAdmin.createPage.publishTour")}
              </button>
            </div>
          </div>
        </header>

        {/* Stepper */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {WIZARD_STEPS.map((step, i) => (
              <React.Fragment key={step.key}>
                {i > 0 && (
                  <div
                    className={`hidden sm:block h-px w-6 shrink-0 ${
                      i <= currentStep
                        ? "bg-orange-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (i <= maxNavigableStep) setCurrentStep(i);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                    i === currentStep
                      ? "bg-orange-500 text-white"
                      : i < currentStep
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-500/30"
                        : i <= maxNavigableStep
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-500/30"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                  }`}
                  disabled={i > maxNavigableStep}>
                  {i < currentStep ? (
                    <Icon icon="heroicons:check" className="size-3.5" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{wizardStepLabels[i]}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 max-w-5xl">
          {/* ── Step 1: Basic Info ───────────────────────────── */}
          {currentStep === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {t("tourAdmin.basicInfo.sectionTitle")}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t("tourAdmin.basicInfo.sectionSubtitle")}
              </p>

              {/* Language Tabs */}
              <div className="mb-5">
                <LanguageTabs
                  activeLanguage={activeLang}
                  onChange={setActiveLang}
                />
                <p className="text-xs text-slate-400 mt-2">
                  {t("tourAdmin.langTabs.translationHint")}
                </p>
              </div>

              {/* ── Vietnamese Content ── */}
              {activeLang === "vi" && (
                <div className="space-y-5">
                  {/* Tour Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.tourName")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={basicInfo.tourName}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          tourName: e.target.value,
                        }))
                      }
                      placeholder={t("placeholder.enterTourName")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />
                    {errors.tourName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.tourName}
                      </p>
                    )}
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.shortDescription")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={basicInfo.shortDescription}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          shortDescription: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder={t("placeholder.briefTourDescription")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    />
                    {errors.shortDescription && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Long Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.longDescription")}
                    </label>
                    <textarea
                      value={basicInfo.longDescription}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          longDescription: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder={t("placeholder.detailedTourDescription")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>

                  {/* SEO Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.seoTitle")}
                    </label>
                    <input
                      type="text"
                      value={basicInfo.seoTitle}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          seoTitle: e.target.value,
                        }))
                      }
                      placeholder={t("placeholder.seoOptimizedTitle")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* SEO Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.seoDescription")}
                    </label>
                    <textarea
                      value={basicInfo.seoDescription}
                      onChange={(e) =>
                        setBasicInfo((prev) => ({
                          ...prev,
                          seoDescription: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder={t("placeholder.seoOptimizedDescription")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>

                  <TourImageUpload
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                    images={images}
                    setImages={setImages}
                    t={t}
                    thumbnailError={thumbnailError}
                    imagesError={imagesError}
                    onThumbnailError={setThumbnailError}
                    onImagesError={setImagesError}
                  />
                </div>
              )}

              {/* ── English Content ── */}
              {activeLang === "en" && (
                <div className="space-y-5">
                  {/* Tour Name EN */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.tourName")} (EN)
                    </label>
                    <input
                      type="text"
                      value={enTranslation.tourName}
                      onChange={(e) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          tourName: e.target.value,
                        }))
                      }
                      placeholder={t("placeholder.enterTourNameEn")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* Short Description EN */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.shortDescription")} (EN)
                    </label>
                    <textarea
                      value={enTranslation.shortDescription}
                      onChange={(e) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          shortDescription: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder={t("placeholder.briefDescEn")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>

                  {/* Long Description EN */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.longDescription")} (EN)
                    </label>
                    <textarea
                      value={enTranslation.longDescription}
                      onChange={(e) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          longDescription: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder={t("placeholder.detailedDescEn")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>

                  {/* SEO Title EN */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.seoTitle")} (EN)
                    </label>
                    <input
                      type="text"
                      value={enTranslation.seoTitle}
                      onChange={(e) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          seoTitle: e.target.value,
                        }))
                      }
                      placeholder={t("placeholder.seoOptimizedTitle")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* SEO Description EN */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {t("tourAdmin.basicInfo.seoDescription")} (EN)
                    </label>
                    <textarea
                      value={enTranslation.seoDescription}
                      onChange={(e) =>
                        setEnTranslation((prev) => ({
                          ...prev,
                          seoDescription: e.target.value,
                        }))
                      }
                      rows={2}
                      placeholder={t("placeholder.seoOptimizedDescription")}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ── Policy Selectors ──────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 mt-6">
                {/* Pricing Policy */}
                <SearchableSelect
                  label={t("tourAdmin.basicInfo.pricingPolicy")}
                  placeholder={t("tourAdmin.basicInfo.searchPricingPolicy")}
                  value={selectedPricingPolicyId}
                  onChange={setSelectedPricingPolicyId}
                  options={pricingPolicies.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                />

                {/* Deposit Policy */}
                <SearchableSelect
                  label={t("tourAdmin.basicInfo.depositPolicy")}
                  placeholder={t("tourAdmin.basicInfo.searchDepositPolicy")}
                  value={selectedDepositPolicyId}
                  onChange={setSelectedDepositPolicyId}
                  options={depositPolicies.map((p) => ({
                    value: p.id,
                    label: `${p.tourScopeName} - ${p.depositTypeName} ${p.depositValue}${p.depositType === 2 ? "%" : ""}`,
                  }))}
                />

                {/* Cancellation Policy */}
                <SearchableSelect
                  label={t("tourAdmin.basicInfo.cancellationPolicy")}
                  placeholder={t("tourAdmin.basicInfo.searchCancellationPolicy")}
                  value={selectedCancellationPolicyId}
                  onChange={setSelectedCancellationPolicyId}
                  options={cancellationPolicies.map((p) => ({
                    value: p.id,
                    label: `${p.policyCode} (${p.tourScopeName}, ${p.tiers.length} tier${p.tiers.length !== 1 ? "s" : ""})`,
                  }))}
                />

                {/* Visa Policy */}
                <SearchableSelect
                  label={t("tourAdmin.basicInfo.visaPolicy")}
                  placeholder={t("tourAdmin.basicInfo.searchVisaPolicy")}
                  value={selectedVisaPolicyId}
                  onChange={setSelectedVisaPolicyId}
                  options={visaPolicies.map((p) => ({
                    value: p.id,
                    label: `${p.region} (${p.processingDays} days processing)`,
                  }))}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Packages ─────────────────────────────── */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {t("tourAdmin.packages.sectionTitle")}
                </h2>
                <button
                  type="button"
                  onClick={addClassification}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  {t("tourAdmin.buttons.addPackage")}
                </button>
              </div>
              <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                <Icon
                  icon="heroicons:information-circle"
                  className="size-4 text-blue-500 shrink-0"
                />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  {t("tourAdmin.packages.infoBanner")}
                </p>
              </div>

              <div className="space-y-4">
                {classifications.map((cls, clsI) => (
                  <div
                    key={clsI}
                    className="border border-stone-200 dark:border-stone-700 rounded-2xl p-5 relative overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                          {clsI + 1}
                        </div>
                        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                          {cls.name || cls.enName
                            ? `${cls.name || ""}${cls.name && cls.enName ? " / " : ""}${cls.enName || ""}`
                            : t("tourAdmin.review.untitled")}
                        </h3>
                      </div>
                      {classifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeClassification(clsI)}
                          aria-label={t("tourAdmin.packages.removePackage")}
                          className="text-stone-400 hover:text-red-500 transition-colors">
                          <Icon icon="heroicons:trash" className="size-4" />
                        </button>
                      )}
                    </div>

                    {/* Duration — shared field */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                        {t("tourAdmin.packages.durationDays")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={cls.durationDays}
                        onChange={(e) =>
                          updateClassification(clsI, "durationDays", e.target.value)
                        }
                        placeholder={t("tourAdmin.packages.placeholderDuration")}
                        className="w-full md:w-48 px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      />
                      {errors[`cls_${clsI}_duration`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`cls_${clsI}_duration`]}</p>
                      )}
                    </div>

                    {/* Adult Price / Child Price */}
                    <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                          {t("tourAdmin.packages.adultPrice")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cls.price}
                          onChange={(e) => updateClassification(clsI, "price", e.target.value)}
                          placeholder={t("tourAdmin.packages.placeholderAdultPrice")}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                        {errors[`cls_${clsI}_price`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`cls_${clsI}_price`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                          {t("tourAdmin.packages.childPrice")} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={cls.salePrice}
                          onChange={(e) => updateClassification(clsI, "salePrice", e.target.value)}
                          placeholder={t("tourAdmin.packages.placeholderChildPrice")}
                          className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                        {errors[`cls_${clsI}_salePrice`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`cls_${clsI}_salePrice`]}</p>
                        )}
                      </div>
                    </div>

                    {/* VI / EN parallel columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ── VI Column ── */}
                      <div className="space-y-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">🇻🇳</span>
                          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide">
                            Tiếng Việt
                          </span>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                            {t("tourAdmin.packages.packageType")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={cls.name}
                            onChange={(e) => updateClassification(clsI, "name", e.target.value)}
                            placeholder={t("tourAdmin.packages.placeholderPackageType")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                          {errors[`cls_${clsI}_name`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`cls_${clsI}_name`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                            {t("tourAdmin.packages.description")}
                          </label>
                          <textarea
                            value={cls.description}
                            onChange={(e) => updateClassification(clsI, "description", e.target.value)}
                            rows={3}
                            placeholder={t("tourAdmin.packages.placeholderDescription")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                          />
                          {errors[`cls_${clsI}_description`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`cls_${clsI}_description`]}</p>
                          )}
                        </div>
                      </div>

                      {/* ── EN Column ── */}
                      <div className="space-y-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">🇬🇧</span>
                          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide">
                            English
                          </span>
                          <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500">
                            (Tùy chọn)
                          </span>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                            {t("tourAdmin.packages.packageType")} / Type
                          </label>
                          <input
                            type="text"
                            value={cls.enName}
                            onChange={(e) => updateClassification(clsI, "enName", e.target.value)}
                            placeholder="e.g. Standard, Premium, Luxury"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                          {errors[`cls_${clsI}_enName`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`cls_${clsI}_enName`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                            {t("tourAdmin.packages.description")} / Description
                          </label>
                          <textarea
                            value={cls.enDescription}
                            onChange={(e) => updateClassification(clsI, "enDescription", e.target.value)}
                            rows={3}
                            placeholder="Describe what this package includes..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                          />
                          {errors[`cls_${clsI}_enDescription`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`cls_${clsI}_enDescription`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Itineraries ──────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Package Selector */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                  {t("tourAdmin.itineraries.selectPackageTitle")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {t("tourAdmin.itineraries.selectPackageSubtitle")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {classifications.map((cls, i) => {
                    const daysProcessed = (dayPlans[i] ?? []).length;
                    const totalDays = Number(cls.durationDays) || 0;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedPackageIndex(i)}
                        className={`flex-1 min-w-45 p-4 rounded-xl border-2 text-left transition-all ${
                          selectedPackageIndex === i
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-semibold ${
                              selectedPackageIndex === i
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-slate-700 dark:text-slate-300"
                            }`}>
                            {t("tourAdmin.packages.packageNumber", { number: i + 1 })}
                          </span>
                          {selectedPackageIndex === i && (
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                              <Icon
                                icon="heroicons:check"
                                className="size-3 text-white"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-900 dark:text-white">
                          {activeLang === "vi" ? (cls.name || t("tourAdmin.packages.packageType")) : (cls.enName || cls.name || t("tourAdmin.packages.packageType"))}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t("tourAdmin.itineraries.daysProcessed", { processed: daysProcessed, total: totalDays })}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Itinerary Editor */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {t("tourAdmin.itineraries.itineraryForPackage", { number: ci + 1 })}
                  </h2>
                  <button
                    type="button"
                    onClick={() => addDayPlan(ci)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <Icon icon="heroicons:plus" className="size-4" />
                    {t("tourAdmin.buttons.addDay")}
                  </button>
                </div>

                {(dayPlans[ci] ?? []).length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Icon
                      icon="heroicons:calendar-days"
                      className="size-10 mx-auto mb-3 opacity-40"
                    />
                    <p className="text-sm">
                      {t("tourAdmin.itineraries.noDaysYet")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(dayPlans[ci] ?? []).map((day, di) => (
                      <div
                        key={di}
                        className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        {/* Day Header — Orange */}
                        <div className="bg-orange-500 px-4 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {day.dayNumber}
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateDayPlan(ci, di, "title", e.target.value)}
                              placeholder={t("tourAdmin.itineraries.placeholderDayTitle", { number: day.dayNumber })}
                              className="flex-1 px-2 py-1 text-sm bg-white/10 text-white rounded border border-white/20 placeholder:text-white/60 focus:ring-2 focus:ring-white/30 outline-none"
                            />
                            <input
                              type="text"
                              value={day.enTitle}
                              onChange={(e) => updateDayPlan(ci, di, "enTitle", e.target.value)}
                              placeholder="Day title EN..."
                              className="flex-1 px-2 py-1 text-sm bg-white/5 text-white/70 rounded border border-white/10 placeholder:text-white/30 focus:ring-2 focus:ring-white/20 outline-none"
                            />
                          </div>
                          {(errors[`plan_${di}_title`] || errors[`plan_${di}_enTitle`]) && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors[`plan_${di}_title`] || errors[`plan_${di}_enTitle`]}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => removeDayPlan(ci, di)}
                            aria-label={t("tourAdmin.itineraries.removeDay")}
                            className="text-white/70 hover:text-white transition-colors">
                            <Icon icon="heroicons:x-mark" className="size-5" />
                          </button>
                        </div>

                        {/* Day Body */}
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="space-y-1">
                              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
                                🇻🇳 {t("tourAdmin.itineraries.dayDescription")} (VI)
                              </span>
                              <textarea
                                value={day.description}
                                onChange={(e) => updateDayPlan(ci, di, "description", e.target.value)}
                                rows={2}
                                placeholder={t("tourAdmin.itineraries.placeholderOverview")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
                                🇬🇧 Description (EN)
                              </span>
                              <textarea
                                value={day.enDescription}
                                onChange={(e) => updateDayPlan(ci, di, "enDescription", e.target.value)}
                                rows={2}
                                placeholder="Day description in English..."
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                              />
                              {(errors[`plan_${di}_description`] || errors[`plan_${di}_enDescription`]) && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors[`plan_${di}_description`] || errors[`plan_${di}_enDescription`]}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Activities Section */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {t("tourAdmin.itineraries.activities")}
                              </span>
                              <button
                                type="button"
                                onClick={() => addActivity(ci, di)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                                <Icon
                                  icon="heroicons:plus"
                                  className="size-3"
                                />
                                {t("tourAdmin.buttons.addActivity")}
                              </button>
                            </div>

                            {day.activities.length === 0 && (
                              <p className="text-xs text-slate-400 text-center py-4">
                                {t("tourAdmin.itineraries.noActivitiesYet")}
                              </p>
                            )}

                            {day.activities.map((act, ai) => (
                              <div
                                key={ai}
                                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-3 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    {t("tourAdmin.itineraries.activityNumber", { number: ai + 1 })}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeActivity(ci, di, ai)}
                                    aria-label={t("tourAdmin.itineraries.removeActivity")}
                                    className="text-red-400 hover:text-red-600 transition-colors">
                                    <Icon
                                      icon="heroicons:trash"
                                      className="size-3.5"
                                    />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                  {/* Activity Type */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                      {t("tourAdmin.itineraries.activityType")}{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                      value={act.activityType}
                                      onChange={(e) =>
                                        updateActivity(
                                          ci,
                                          di,
                                          ai,
                                          "activityType",
                                          e.target.value,
                                        )
                                      }
                                      aria-label={t("tourAdmin.itineraries.activityType")}
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition">
                                      {ACTIVITY_TYPE_OPTIONS.map((opt, idx) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}>
                                          {activityTypes[idx]}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Start Time */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                      {t("tourAdmin.itineraries.startTime")}
                                    </label>
                                    <input
                                      type="text"
                                      value={act.startTime}
                                      onChange={(e) =>
                                        updateActivity(
                                          ci,
                                          di,
                                          ai,
                                          "startTime",
                                          e.target.value,
                                        )
                                      }
                                      placeholder={t("tourAdmin.itineraries.startTime")}
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>

                                  {/* End Time */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                      {t("tourAdmin.itineraries.endTime")}
                                    </label>
                                    <input
                                      type="text"
                                      value={act.endTime}
                                      onChange={(e) =>
                                        updateActivity(
                                          ci,
                                          di,
                                          ai,
                                          "endTime",
                                          e.target.value,
                                        )
                                      }
                                      placeholder={t("placeholder.endTime")}
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>
                                </div>

                                {/* Title — VI / EN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                                      <span>🇻🇳</span>
                                      <span>{t("tourAdmin.itineraries.title")} (VI)</span>
                                      <span className="text-red-500">*</span>
                                    </div>
                                    <input
                                      type="text"
                                      value={act.title}
                                      onChange={(e) => updateActivity(ci, di, ai, "title", e.target.value)}
                                      placeholder={t("tourAdmin.itineraries.placeholderActivityTitle")}
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
                                      🇬🇧 Title (EN)
                                    </span>
                                    <input
                                      type="text"
                                      value={act.enTitle}
                                      onChange={(e) => updateActivity(ci, di, ai, "enTitle", e.target.value)}
                                      placeholder="Activity title in English..."
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>
                                </div>

                                {/* Description — VI / EN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div className="space-y-1">
                                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                      🇻🇳 {t("tourAdmin.itineraries.description")} (VI)
                                    </span>
                                    <textarea
                                      value={act.description}
                                      onChange={(e) => updateActivity(ci, di, ai, "description", e.target.value)}
                                      rows={2}
                                      placeholder={t("tourAdmin.itineraries.placeholderDescribeActivity")}
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                      🇬🇧 Description (EN)
                                    </span>
                                    <textarea
                                      value={act.enDescription}
                                      onChange={(e) => updateActivity(ci, di, ai, "enDescription", e.target.value)}
                                      rows={2}
                                      placeholder="Activity description in English..."
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                                    />
                                  </div>
                                </div>

                                {/* Note — VI / EN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div className="space-y-1">
                                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                      🇻🇳 {t("tourAdmin.itineraries.note")} (VI)
                                    </span>
                                    <input
                                      type="text"
                                      value={act.note}
                                      onChange={(e) => updateActivity(ci, di, ai, "note", e.target.value)}
                                      placeholder={t("tourAdmin.itineraries.placeholderAdditionalNotes")}
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                      🇬🇧 Note (EN)
                                    </span>
                                    <input
                                      type="text"
                                      value={act.enNote}
                                      onChange={(e) => updateActivity(ci, di, ai, "enNote", e.target.value)}
                                      placeholder="Additional notes in English..."
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>
                                </div>

                                {/* Link to Resources */}
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    {t("tourAdmin.itineraries.linkToResources")}
                                  </label>
                                  <div className="space-y-2">
                                    {act.linkToResources.map((link, li) => (
                                      <div
                                        key={li}
                                        className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={link}
                                          onChange={(e) =>
                                            updateLinkToResource(
                                              ci,
                                              di,
                                              ai,
                                              li,
                                              e.target.value,
                                            )
                                          }
                                          placeholder={t("tourAdmin.itineraries.placeholderHttps")}
                                          className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                        />
                                        {act.linkToResources.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeLinkToResource(
                                                ci,
                                                di,
                                                ai,
                                                li,
                                              )
                                            }
                                            aria-label="Remove link"
                                            className="text-red-400 hover:text-red-600 transition-colors p-1">
                                            <Icon
                                              icon="heroicons:x-mark"
                                              className="size-4"
                                            />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addLinkToResource(ci, di, ai)
                                      }
                                      className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                                      <Icon
                                        icon="heroicons:plus"
                                        className="size-3"
                                      />
                                      {t("tourAdmin.buttons.addLink")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 4: Accommodations ──────────────────────── */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="heroicons:home-modern"
                    className="size-5 text-orange-500"
                  />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {t("tourAdmin.accommodations.sectionTitle")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addAccommodation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  {t("tourAdmin.buttons.addAccommodation")}
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t("tourAdmin.accommodations.infoBanner")}
              </p>

              <div className="space-y-4">
                {accommodations.map((acc, accI) => (
                  <div
                    key={accI}
                    className="border border-stone-200 dark:border-stone-700 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("tourAdmin.accommodations.accommodationNumber", { number: accI + 1 })}
                      </h3>
                      {accommodations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAccommodation(accI)}
                          aria-label={t("tourAdmin.accommodations.removeAccommodation")}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Icon icon="heroicons:trash" className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* Accommodation Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("tourAdmin.accommodations.accommodationName")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>VN</span>
                              <span className="font-medium text-stone-500">Name (VI)</span>
                            </div>
                            <input
                              type="text"
                              value={acc.accommodationName}
                              onChange={(e) =>
                                updateAccommodation(
                                  accI,
                                  "accommodationName",
                                  e.target.value,
                                )
                              }
                              placeholder={t("tourAdmin.accommodations.placeholderAccommodationName")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                            {errors[`acc_${accI}_name`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`acc_${accI}_name`]}</p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>EN</span>
                              <span className="font-medium text-stone-500">Name (EN)</span>
                            </div>
                            <input
                              type="text"
                              value={acc.enAccommodationName}
                              onChange={(e) =>
                                updateAccommodation(
                                  accI,
                                  "enAccommodationName",
                                  e.target.value,
                                )
                              }
                              placeholder={t("tourAdmin.accommodations.placeholderAccommodationName")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                            {errors[`acc_${accI}_enName`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`acc_${accI}_enName`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("tourAdmin.accommodations.address")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>VN</span>
                              <span className="font-medium text-stone-500">Address (VI)</span>
                            </div>
                            <input
                              type="text"
                              value={acc.address}
                              onChange={(e) =>
                                updateAccommodation(accI, "address", e.target.value)
                              }
                              placeholder={t("tourAdmin.accommodations.placeholderAddress")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                            {errors[`acc_${accI}_address`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`acc_${accI}_address`]}</p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>EN</span>
                              <span className="font-medium text-stone-500">Address (EN)</span>
                            </div>
                            <input
                              type="text"
                              value={acc.enAddress}
                              onChange={(e) =>
                                updateAccommodation(accI, "enAddress", e.target.value)
                              }
                              placeholder={t("tourAdmin.accommodations.placeholderAddress")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Contact Phone + Check-in Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.accommodations.contactPhone")}
                          </label>
                          <input
                            type="text"
                            value={acc.contactPhone}
                            onChange={(e) =>
                              updateAccommodation(
                                accI,
                                "contactPhone",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.accommodations.placeholderPhone")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.accommodations.checkInTime")}
                          </label>
                          <input
                            type="text"
                            value={acc.checkInTime}
                            onChange={(e) =>
                              updateAccommodation(
                                accI,
                                "checkInTime",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.accommodations.placeholderCheckIn")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Check-out Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.accommodations.checkOutTime")}
                          </label>
                          <input
                            type="text"
                            value={acc.checkOutTime}
                            onChange={(e) =>
                              updateAccommodation(
                                accI,
                                "checkOutTime",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.accommodations.placeholderCheckOut")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Note */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("tourAdmin.accommodations.note")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>VN</span>
                              <span className="font-medium text-stone-500">Note (VI)</span>
                            </div>
                            <textarea
                              value={acc.note}
                              onChange={(e) =>
                                updateAccommodation(accI, "note", e.target.value)
                              }
                              rows={3}
                              placeholder={t("tourAdmin.accommodations.placeholderAdditionalInfo")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>EN</span>
                              <span className="font-medium text-stone-500">Note (EN)</span>
                            </div>
                            <textarea
                              value={acc.enNote}
                              onChange={(e) =>
                                updateAccommodation(accI, "enNote", e.target.value)
                              }
                              rows={3}
                              placeholder={t("tourAdmin.accommodations.placeholderAdditionalInfo")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 5: Locations ────────────────────────────── */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="heroicons:map-pin"
                    className="size-5 text-orange-500"
                  />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {t("tourAdmin.locations.sectionTitle")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addLocation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  {t("tourAdmin.buttons.addLocation")}
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t("tourAdmin.locations.infoBanner")}
              </p>

              <div className="space-y-4">
                {locations.map((loc, locI) => (
                  <div
                    key={locI}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t("tourAdmin.locations.locationNumber", { number: locI + 1 })}
                      </h3>
                      {locations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLocation(locI)}
                          aria-label={t("tourAdmin.locations.removeLocation")}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Icon icon="heroicons:trash" className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* Location Name + Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.locations.locationName")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>VN</span>
                                <span className="font-medium text-stone-500">Name (VI)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.locationName}
                                onChange={(e) =>
                                  updateLocation(
                                    locI,
                                    "locationName",
                                    e.target.value,
                                  )
                                }
                                placeholder={t("tourAdmin.locations.placeholderLocationName")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>EN</span>
                                <span className="font-medium text-stone-500">Name (EN)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.enLocationName}
                                onChange={(e) =>
                                  updateLocation(
                                    locI,
                                    "enLocationName",
                                    e.target.value,
                                  )
                                }
                                placeholder={t("tourAdmin.locations.placeholderLocationName")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                              {errors[`loc_${locI}_name`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`loc_${locI}_name`]}</p>
                              )}
                              {errors[`loc_${locI}_enName`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`loc_${locI}_enName`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.locations.type")}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>VN</span>
                                <span className="font-medium text-stone-500">Type (VI)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.type}
                                onChange={(e) =>
                                  updateLocation(locI, "type", e.target.value)
                                }
                                placeholder={t("tourAdmin.locations.placeholderType")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>EN</span>
                                <span className="font-medium text-stone-500">Type (EN)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.enType}
                                onChange={(e) =>
                                  updateLocation(locI, "enType", e.target.value)
                                }
                                placeholder={t("tourAdmin.locations.placeholderType")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("tourAdmin.locations.description")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>VN</span>
                              <span className="font-medium text-stone-500">Description (VI)</span>
                            </div>
                            <textarea
                              value={loc.description}
                              onChange={(e) =>
                                updateLocation(locI, "description", e.target.value)
                              }
                              rows={2}
                              placeholder={t("tourAdmin.locations.placeholderDescription")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>EN</span>
                              <span className="font-medium text-stone-500">Description (EN)</span>
                            </div>
                            <textarea
                              value={loc.enDescription}
                              onChange={(e) =>
                                updateLocation(locI, "enDescription", e.target.value)
                              }
                              rows={2}
                              placeholder={t("tourAdmin.locations.placeholderDescription")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                            />
                          </div>
                        </div>
                      </div>
                      {/* City + Country + Entrance Fee */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.locations.city")}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>VN</span>
                                <span className="font-medium text-stone-500">City (VI)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.city}
                                onChange={(e) =>
                                  updateLocation(locI, "city", e.target.value)
                                }
                                placeholder={t("tourAdmin.locations.placeholderCity")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>EN</span>
                                <span className="font-medium text-stone-500">City (EN)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.enCity}
                                onChange={(e) =>
                                  updateLocation(locI, "enCity", e.target.value)
                                }
                                placeholder={t("tourAdmin.locations.placeholderCity")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                              {errors[`loc_${locI}_city`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`loc_${locI}_city`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.locations.country")}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>VN</span>
                                <span className="font-medium text-stone-500">Country (VI)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.country}
                                onChange={(e) =>
                                  updateLocation(locI, "country", e.target.value)
                                }
                                placeholder={t("tourAdmin.locations.placeholderCountry")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>EN</span>
                                <span className="font-medium text-stone-500">Country (EN)</span>
                              </div>
                              <input
                                type="text"
                                value={loc.enCountry}
                                onChange={(e) =>
                                  updateLocation(locI, "enCountry", e.target.value)
                                }
                                placeholder={t("tourAdmin.locations.placeholderCountry")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                              {errors[`loc_${locI}_country`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`loc_${locI}_country`]}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.locations.entranceFee")}
                          </label>
                          <input
                            type="number"
                            value={loc.entranceFee}
                            onChange={(e) =>
                              updateLocation(
                                locI,
                                "entranceFee",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.locations.placeholderEntranceFee")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("tourAdmin.locations.address")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>VN</span>
                              <span className="font-medium text-stone-500">Address (VI)</span>
                            </div>
                            <input
                              type="text"
                              value={loc.address}
                              onChange={(e) =>
                                updateLocation(locI, "address", e.target.value)
                              }
                              placeholder={t("tourAdmin.locations.placeholderAddress")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>EN</span>
                              <span className="font-medium text-stone-500">Address (EN)</span>
                            </div>
                            <input
                              type="text"
                              value={loc.enAddress}
                              onChange={(e) =>
                                updateLocation(locI, "enAddress", e.target.value)
                              }
                              placeholder={t("tourAdmin.locations.placeholderAddress")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 6: Transportation ──────────────────────── */}
          {currentStep === 5 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="heroicons:truck"
                    className="size-5 text-orange-500"
                  />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {t("tourAdmin.transportation.sectionTitle")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addTransportation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  {t("tourAdmin.buttons.addRoute")}
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t("tourAdmin.transportation.infoBanner")}
              </p>

              <div className="space-y-4">
                {transportations.map((tr, trI) => (
                  <div
                    key={trI}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {trI + 1}
                        </div>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t("tourAdmin.transportation.routeNumber", { number: trI + 1 })}
                        </h3>
                      </div>
                      {transportations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTransportation(trI)}
                          aria-label={t("tourAdmin.transportation.removeRoute")}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Icon icon="heroicons:trash" className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* From + To + Transportation Type */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.fromLocation")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={tr.fromLocation}
                            onChange={(e) =>
                              updateTransportation(
                                trI,
                                "fromLocation",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.transportation.placeholderFrom")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                          {errors[`tr_${trI}_from`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`tr_${trI}_from`]}</p>
                          )}
                          {errors[`tr_${trI}_enFrom`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`tr_${trI}_enFrom`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.toLocation")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={tr.toLocation}
                            onChange={(e) =>
                              updateTransportation(
                                trI,
                                "toLocation",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.transportation.placeholderTo")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                          {errors[`tr_${trI}_to`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`tr_${trI}_to`]}</p>
                          )}
                          {errors[`tr_${trI}_enTo`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`tr_${trI}_enTo`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.transportationType")}
                          </label>
                          <input
                            type="text"
                            value={tr.transportationType}
                            onChange={(e) =>
                              updateTransportation(
                                trI,
                                "transportationType",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.transportation.placeholderTransportationType")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                          {errors[`tr_${trI}_type`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`tr_${trI}_type`]}</p>
                          )}
                          {errors[`tr_${trI}_enType`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`tr_${trI}_enType`]}</p>
                          )}
                        </div>
                      </div>
                      {/* Transportation Name + Duration + Pricing Type */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.transportationName")}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>VN</span>
                                <span className="font-medium text-stone-500">Name (VI)</span>
                              </div>
                              <input
                                type="text"
                                value={tr.transportationName}
                                onChange={(e) =>
                                  updateTransportation(
                                    trI,
                                    "transportationName",
                                    e.target.value,
                                  )
                                }
                                placeholder={t("tourAdmin.transportation.placeholderTransportationName")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>EN</span>
                                <span className="font-medium text-stone-500">Name (EN)</span>
                              </div>
                              <input
                                type="text"
                                value={tr.enTransportationName}
                                onChange={(e) =>
                                  updateTransportation(
                                    trI,
                                    "enTransportationName",
                                    e.target.value,
                                  )
                                }
                                placeholder={t("tourAdmin.transportation.placeholderTransportationName")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.durationMinutes")}
                          </label>
                          <input
                            type="number"
                            value={tr.durationMinutes}
                            onChange={(e) =>
                              updateTransportation(
                                trI,
                                "durationMinutes",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.transportation.placeholderDuration")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.pricingType")}
                          </label>
                          <input
                            type="text"
                            value={tr.pricingType}
                            onChange={(e) =>
                              updateTransportation(
                                trI,
                                "pricingType",
                                e.target.value,
                              )
                            }
                            placeholder={t("tourAdmin.transportation.placeholderPricingType")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Price + Requires Ticket + Ticket Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.price")}
                          </label>
                          <input
                            type="number"
                            value={tr.price}
                            onChange={(e) =>
                              updateTransportation(trI, "price", e.target.value)
                            }
                            placeholder={t("tourAdmin.transportation.placeholderPrice")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                          {errors[`tr_${trI}_price`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`tr_${trI}_price`]}</p>
                          )}
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 self-end pb-2">
                          <input
                            type="checkbox"
                            checked={tr.requiresIndividualTicket}
                            onChange={(e) =>
                              updateTransportation(
                                trI,
                                "requiresIndividualTicket",
                                e.target.checked,
                              )
                            }
                            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                          />
                          {t("tourAdmin.transportation.requiresIndividualTicket")}
                        </label>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t("tourAdmin.transportation.ticketInfo")}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>VN</span>
                                <span className="font-medium text-stone-500">Ticket Info (VI)</span>
                              </div>
                              <input
                                type="text"
                                value={tr.ticketInfo}
                                onChange={(e) =>
                                  updateTransportation(
                                    trI,
                                    "ticketInfo",
                                    e.target.value,
                                  )
                                }
                                placeholder={t("tourAdmin.transportation.placeholderTicketInfo")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span>EN</span>
                                <span className="font-medium text-stone-500">Ticket Info (EN)</span>
                              </div>
                              <input
                                type="text"
                                value={tr.enTicketInfo}
                                onChange={(e) =>
                                  updateTransportation(
                                    trI,
                                    "enTicketInfo",
                                    e.target.value,
                                  )
                                }
                                placeholder={t("tourAdmin.transportation.placeholderTicketInfo")}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Note */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t("tourAdmin.transportation.note")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>VN</span>
                              <span className="font-medium text-stone-500">Note (VI)</span>
                            </div>
                            <textarea
                              value={tr.note}
                              onChange={(e) =>
                                updateTransportation(trI, "note", e.target.value)
                              }
                              rows={2}
                              placeholder={t("tourAdmin.transportation.placeholderNote")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>EN</span>
                              <span className="font-medium text-stone-500">Note (EN)</span>
                            </div>
                            <textarea
                              value={tr.enNote}
                              onChange={(e) =>
                                updateTransportation(trI, "enNote", e.target.value)
                              }
                              rows={2}
                              placeholder={t("tourAdmin.transportation.placeholderNote")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 7: Services (placeholder) ───────────────── */}
          {currentStep === 6 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="text-center py-12 text-slate-400">
                <Icon
                  icon="heroicons:wrench-screwdriver"
                  className="size-10 mx-auto mb-3 opacity-40"
                />
                <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t("tourAdmin.services.sectionTitle")}
                </h2>
                <p className="text-sm">
                  {t("tourAdmin.services.notAvailable")}
                </p>
              </div>
            </div>
          )}

          {/* ── Step 8: Insurance ────────────────────────────── */}
          {currentStep === 7 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-1">
                <Icon
                  icon="heroicons:shield-check"
                  className="size-5 text-orange-500"
                />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {t("tourAdmin.insurance.sectionTitle")}
                </h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {t("tourAdmin.insurance.sectionSubtitle")}
              </p>

              <div className="space-y-5">
                {classifications.map((cls, clsI) => (
                  <div key={clsI}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {activeLang === "vi" ? (cls.name || t("tourAdmin.packages.packageNumber", { number: clsI + 1 })) : (cls.enName || cls.name || t("tourAdmin.packages.packageNumber", { number: clsI + 1 }))}
                      </h3>
                      <button
                        type="button"
                        onClick={() => addInsurance(clsI)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                        <Icon icon="heroicons:plus" className="size-4" />
                        {t("tourAdmin.buttons.addInsurance")}
                      </button>
                    </div>

                    {(insurances[clsI] ?? []).length === 0 ? (
                      <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg py-6 text-center">
                        <p className="text-sm text-slate-400">
                          {t("tourAdmin.insurance.noInsuranceYet")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(insurances[clsI] ?? []).map((ins, ii) => (
                          <div
                            key={ii}
                            className="flex items-start justify-between border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-slate-900 dark:text-white">
                                  {activeLang === "vi" ? (ins.insuranceName || t("tourAdmin.review.untitled")) : (ins.enInsuranceName || ins.insuranceName || t("tourAdmin.review.untitled"))}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                                  {insuranceTypes[Number(ins.insuranceType)] || insuranceTypes[1]}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t("tourAdmin.insurance.coverage")}: ${ins.coverageAmount || "0"} &bull;
                                {t("tourAdmin.insurance.durationOfTour")}
                                {ins.coverageFee
                                  ? ` • ${t("tourAdmin.insurance.fee")}: $${ins.coverageFee}`
                                  : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <span className="text-sm font-semibold text-orange-500 whitespace-nowrap">
                                ${ins.coverageFee || "0"}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeInsurance(clsI, ii)}
                                aria-label={t("tourAdmin.buttons.addInsurance")}
                                className="text-red-400 hover:text-red-600 transition-colors">
                                <Icon
                                  icon="heroicons:trash"
                                  className="size-4"
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Editing panel for selected insurance */}
              {classifications.map((cls, clsI) =>
                (insurances[clsI] ?? []).map((ins, ii) => (
                  <div
                    key={`edit-${clsI}-${ii}`}
                    className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                    <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
                      {t("tourAdmin.insurance.editInsurance", {
                        insuranceName: activeLang === "vi" ? (ins.insuranceName || t("tourAdmin.review.untitled")) : (ins.enInsuranceName || ins.insuranceName || t("tourAdmin.review.untitled")),
                        packageName: activeLang === "vi" ? (cls.name || t("tourAdmin.packages.packageNumber", { number: clsI + 1 })) : (cls.enName || cls.name || t("tourAdmin.packages.packageNumber", { number: clsI + 1 })),
                      })}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {t("tourAdmin.insurance.insuranceName")}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>VN</span>
                              <span className="font-medium text-stone-500">Name (VI)</span>
                            </div>
                            <input
                              type="text"
                              value={ins.insuranceName}
                              onChange={(e) =>
                                updateInsurance(
                                  clsI,
                                  ii,
                                  "insuranceName",
                                  e.target.value,
                                )
                              }
                              placeholder={t("tourAdmin.insurance.insuranceName")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>EN</span>
                              <span className="font-medium text-stone-500">Name (EN)</span>
                            </div>
                            <input
                              type="text"
                              value={ins.enInsuranceName}
                              onChange={(e) =>
                                updateInsurance(
                                  clsI,
                                  ii,
                                  "enInsuranceName",
                                  e.target.value,
                                )
                              }
                              placeholder={t("tourAdmin.insurance.insuranceName")}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {t("tourAdmin.insurance.insuranceType")}
                        </label>
                        <select
                          value={ins.insuranceType}
                          onChange={(e) =>
                            updateInsurance(
                              clsI,
                              ii,
                              "insuranceType",
                              e.target.value,
                            )
                          }
                          aria-label={t("tourAdmin.insurance.insuranceType")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition">
                          {INSURANCE_TYPE_OPTIONS.map((opt, idx) => (
                            <option key={opt.value} value={opt.value}>
                              {insuranceTypes[idx]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {t("tourAdmin.insurance.provider")}
                        </label>
                        <input
                          type="text"
                          value={ins.insuranceProvider}
                          onChange={(e) =>
                            updateInsurance(
                              clsI,
                              ii,
                              "insuranceProvider",
                              e.target.value,
                            )
                          }
                          placeholder={t("tourAdmin.insurance.provider")}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {t("tourAdmin.insurance.coverageDescription")}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <span>VN</span>
                            <span className="font-medium text-stone-500">Coverage (VI)</span>
                          </div>
                          <textarea
                            value={ins.coverageDescription}
                            onChange={(e) =>
                              updateInsurance(
                                clsI,
                                ii,
                                "coverageDescription",
                                e.target.value,
                              )
                            }
                            rows={2}
                            placeholder={t("tourAdmin.insurance.coverageDescription")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <span>EN</span>
                            <span className="font-medium text-stone-500">Coverage (EN)</span>
                          </div>
                          <textarea
                            value={ins.enCoverageDescription}
                            onChange={(e) =>
                              updateInsurance(
                                clsI,
                                ii,
                                "enCoverageDescription",
                                e.target.value,
                              )
                            }
                            rows={2}
                            placeholder={t("tourAdmin.insurance.coverageDescription")}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {t("tourAdmin.insurance.coverageAmount")}
                        </label>
                        <input
                          type="number"
                          value={ins.coverageAmount}
                          onChange={(e) =>
                            updateInsurance(
                              clsI,
                              ii,
                              "coverageAmount",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {t("tourAdmin.insurance.coverageFee")}
                        </label>
                        <input
                          type="number"
                          value={ins.coverageFee}
                          onChange={(e) =>
                            updateInsurance(
                              clsI,
                              ii,
                              "coverageFee",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 self-end pb-2">
                        <input
                          type="checkbox"
                          checked={ins.isOptional}
                          onChange={(e) =>
                            updateInsurance(
                              clsI,
                              ii,
                              "isOptional",
                              e.target.checked,
                            )
                          }
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                        {t("tourAdmin.insurance.optional")}
                      </label>
                    </div>
                  </div>
                )),
              )}

              {/* Info banner */}
              {classifications.every(
                (_, i) => (insurances[i] ?? []).length === 0,
              ) && (
                <div className="mt-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-4 py-3">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    {t("tourAdmin.insurance.noInsuranceSelected")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Navigation Buttons ───────────────────────────── */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                currentStep === 0 ? router.push("/tour-management") : goPrev()
              }
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Icon icon="heroicons:arrow-left" className="size-4" />
              {currentStep === 0 ? t("tourAdmin.buttons.backToList") : t("tourAdmin.buttons.previous")}
            </button>

            {currentStep < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                {t("tourAdmin.buttons.next")}
                <Icon icon="heroicons:arrow-right" className="size-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    toast.info(
                      t("toast.draftNotImplemented", "Draft saving not yet implemented"),
                    );
                  }}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors disabled:opacity-50">
                  <Icon
                    icon="heroicons:clipboard-document"
                    className="size-4"
                  />
                  {t("tourAdmin.createPage.saveDraft")}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">
                  {saving && (
                    <Icon
                      icon="heroicons:arrow-path"
                      className="size-4 animate-spin"
                    />
                  )}
                  <Icon icon="heroicons:check" className="size-4" />
                  {t("tourAdmin.createPage.publishTour")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
