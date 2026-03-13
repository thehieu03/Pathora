"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Icon from "@/components/ui/Icon";
import FileInput from "@/components/ui/FileInput";
import { tourService } from "@/services/tourService";

/* ── Types ──────────────────────────────────────────────────── */
interface ClassificationForm {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  durationDays: string;
}

interface ActivityForm {
  activityType: string;
  title: string;
  description: string;
  note: string;
  estimatedCost: string;
  isOptional: boolean;
  startTime: string;
  endTime: string;
  linkToResources: string[];
}

interface DayPlanForm {
  dayNumber: string;
  title: string;
  description: string;
  activities: ActivityForm[];
}

interface InsuranceForm {
  insuranceName: string;
  insuranceType: string;
  insuranceProvider: string;
  coverageDescription: string;
  coverageAmount: string;
  coverageFee: string;
  isOptional: boolean;
  note: string;
}

interface AccommodationForm {
  accommodationName: string;
  address: string;
  contactPhone: string;
  checkInTime: string;
  checkOutTime: string;
  note: string;
}

interface LocationForm {
  locationName: string;
  type: string;
  description: string;
  city: string;
  country: string;
  entranceFee: string;
  address: string;
}

interface TransportationForm {
  fromLocation: string;
  toLocation: string;
  transportationType: string;
  transportationName: string;
  durationMinutes: string;
  pricingType: string;
  price: string;
  requiresIndividualTicket: boolean;
  ticketInfo: string;
  note: string;
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
  ecoDescription: string;
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

const WIZARD_STEPS = [
  { key: "basic", label: "Basic Info", icon: "heroicons:information-circle" },
  { key: "packages", label: "Packages", icon: "heroicons:cube" },
  { key: "itineraries", label: "Itineraries", icon: "heroicons:calendar-days" },
  {
    key: "accommodations",
    label: "Accommodations",
    icon: "heroicons:home-modern",
  },
  { key: "locations", label: "Locations", icon: "heroicons:map-pin" },
  { key: "transportation", label: "Transportation", icon: "heroicons:truck" },
  { key: "services", label: "Services", icon: "heroicons:wrench-screwdriver" },
  { key: "insurance", label: "Insurance", icon: "heroicons:shield-check" },
  { key: "review", label: "Review", icon: "heroicons:check-circle" },
];

/* ── Sidebar ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Dashboard", icon: "heroicons:squares-2x2", href: "/dashboard" },
  { label: "Tours", icon: "heroicons:globe-alt", href: "/tour-management" },
  {
    label: "Tour Instances",
    icon: "heroicons:calendar-days",
    href: "/tour-instances",
  },
  {
    label: "Bookings",
    icon: "heroicons:ticket",
    href: "/dashboard/bookings",
  },
  {
    label: "Payments",
    icon: "heroicons:credit-card",
    href: "/dashboard/payments",
  },
  {
    label: "Customers",
    icon: "heroicons:user-group",
    href: "/dashboard/customers",
  },
  {
    label: "Insurance",
    icon: "heroicons:shield-check",
    href: "/dashboard/insurance",
  },
  {
    label: "Visa Applications",
    icon: "heroicons:document-check",
    href: "/dashboard/visa",
  },
  {
    label: "Policies",
    icon: "heroicons:clipboard-document-list",
    href: "/dashboard/policies",
  },
  {
    label: "Settings",
    icon: "heroicons:cog-6-tooth",
    href: "/dashboard/settings",
  },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
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
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              item.label === "Tours"
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
            <p className="text-sm font-medium truncate">Administrator</p>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

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
  linkToResources: [""],
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
  address: "",
  contactPhone: "",
  checkInTime: "",
  checkOutTime: "",
  note: "",
});

const emptyLocation = (): LocationForm => ({
  locationName: "",
  type: "",
  description: "",
  city: "",
  country: "",
  entranceFee: "",
  address: "",
});

const emptyTransportation = (): TransportationForm => ({
  fromLocation: "",
  toLocation: "",
  transportationType: "",
  transportationName: "",
  durationMinutes: "",
  pricingType: "",
  price: "",
  requiresIndividualTicket: false,
  ticketInfo: "",
  note: "",
});

/* ══════════════════════════════════════════════════════════════
   Create Tour Page — Multi-step Wizard (9 Steps)
   ══════════════════════════════════════════════════════════════ */
export default function CreateTourPage() {
  const { t } = useTranslation();
  const router = useRouter();

  /* ── Layout state ─────────────────────────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Wizard state ─────────────────────────────────────────── */
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  /* ── Step 1: Basic Info ───────────────────────────────────── */
  const [basicInfo, setBasicInfo] = useState<BasicInfoForm>({
    tourName: "",
    shortDescription: "",
    longDescription: "",
    ecoDescription: "",
    seoTitle: "",
    seoDescription: "",
    status: "3",
  });
  const [enTranslation] = useState<TranslationFields>({
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

  /* ── Validation ───────────────────────────────────────────── */
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
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
      const formData = new FormData();

      // Basic info
      formData.append("tourName", basicInfo.tourName);
      formData.append("shortDescription", basicInfo.shortDescription);
      formData.append("longDescription", basicInfo.longDescription);
      formData.append("ecoDescription", basicInfo.ecoDescription);
      formData.append("seoTitle", basicInfo.seoTitle);
      formData.append("seoDescription", basicInfo.seoDescription);
      formData.append("status", basicInfo.status);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      images.forEach((img) => formData.append("images", img));

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

      // Classifications with nested day plans, activities, and insurance
      classifications.forEach((cls, ci) => {
        const prefix = `classifications[${ci}]`;
        formData.append(`${prefix}.name`, cls.name);
        formData.append(`${prefix}.description`, cls.description);
        formData.append(`${prefix}.price`, cls.price);
        formData.append(`${prefix}.salePrice`, cls.salePrice || cls.price);
        formData.append(`${prefix}.durationDays`, cls.durationDays);

        // Day plans
        const plans = dayPlans[ci] ?? [];
        plans.forEach((day, di) => {
          const dayPrefix = `${prefix}.plans[${di}]`;
          formData.append(`${dayPrefix}.dayNumber`, day.dayNumber);
          formData.append(`${dayPrefix}.title`, day.title);
          formData.append(`${dayPrefix}.description`, day.description);

          // Activities
          day.activities.forEach((act, ai) => {
            const actPrefix = `${dayPrefix}.activities[${ai}]`;
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

        // Insurance
        const ins = insurances[ci] ?? [];
        ins.forEach((insurance, ii) => {
          const insPrefix = `${prefix}.insurances[${ii}]`;
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

      // Services
      services.forEach((svc, si) => {
        const prefix = `services[${si}]`;
        formData.append(`${prefix}.serviceName`, svc.serviceName);
        formData.append(`${prefix}.pricingType`, svc.pricingType);
        formData.append(`${prefix}.price`, svc.price || "0");
        formData.append(`${prefix}.salePrice`, svc.salePrice || "0");
        formData.append(`${prefix}.email`, svc.email);
        formData.append(`${prefix}.contactNumber`, svc.contactNumber);
      });

      // Accommodations
      accommodations.forEach((acc, ai) => {
        const prefix = `accommodations[${ai}]`;
        formData.append(`${prefix}.accommodationName`, acc.accommodationName);
        formData.append(`${prefix}.address`, acc.address);
        formData.append(`${prefix}.contactPhone`, acc.contactPhone);
        formData.append(`${prefix}.checkInTime`, acc.checkInTime);
        formData.append(`${prefix}.checkOutTime`, acc.checkOutTime);
        formData.append(`${prefix}.note`, acc.note);
      });

      // Locations
      locations.forEach((loc, li) => {
        const prefix = `locations[${li}]`;
        formData.append(`${prefix}.locationName`, loc.locationName);
        formData.append(`${prefix}.type`, loc.type);
        formData.append(`${prefix}.description`, loc.description);
        formData.append(`${prefix}.city`, loc.city);
        formData.append(`${prefix}.country`, loc.country);
        formData.append(`${prefix}.entranceFee`, loc.entranceFee || "0");
        formData.append(`${prefix}.address`, loc.address);
      });

      // Transportations
      transportations.forEach((tr, ti) => {
        const prefix = `transportations[${ti}]`;
        formData.append(`${prefix}.fromLocation`, tr.fromLocation);
        formData.append(`${prefix}.toLocation`, tr.toLocation);
        formData.append(`${prefix}.transportationType`, tr.transportationType);
        formData.append(`${prefix}.transportationName`, tr.transportationName);
        formData.append(`${prefix}.durationMinutes`, tr.durationMinutes || "0");
        formData.append(`${prefix}.pricingType`, tr.pricingType);
        formData.append(`${prefix}.price`, tr.price || "0");
        formData.append(
          `${prefix}.requiresIndividualTicket`,
          String(tr.requiresIndividualTicket),
        );
        formData.append(`${prefix}.ticketInfo`, tr.ticketInfo);
        formData.append(`${prefix}.note`, tr.note);
      });

      await tourService.createTour(formData);
      toast.success(t("tourAdmin.createSuccess", "Tour created successfully!"));
      router.push("/tour-management");
    } catch (error) {
      console.error("Failed to create tour:", error);
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

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                  Create New Package Tour
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Step {currentStep + 1} of {WIZARD_STEPS.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/tour-management")}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.info("Draft saving not yet implemented");
                }}
                className="px-4 py-2 text-sm font-medium border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                Save Draft
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
                Publish Tour
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
                    if (i < currentStep) setCurrentStep(i);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                    i === currentStep
                      ? "bg-orange-500 text-white"
                      : i < currentStep
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}>
                  {i < currentStep ? (
                    <Icon icon="heroicons:check" className="size-3.5" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
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
                Basic Tour Information
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Fill in the basic details for this package tour
              </p>

              <div className="space-y-5">
                {/* Tour Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Tour Name <span className="text-red-500">*</span>
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
                    placeholder="Enter tour name"
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
                    Short Description <span className="text-red-500">*</span>
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
                    placeholder="Brief tour description for listings"
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
                    Long Description
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
                    placeholder="Detailed tour description"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* ECO Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    ECO Description
                  </label>
                  <textarea
                    value={basicInfo.ecoDescription}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        ecoDescription: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Environmental & sustainability information"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* SEO Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    SEO Title
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
                    placeholder="SEO-optimized title for search engines"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Thumbnail File
                    </label>
                    <FileInput
                      name="thumbnail"
                      onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                    />
                    {thumbnail && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Selected: {thumbnail.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Gallery Images
                    </label>
                    <FileInput
                      name="images"
                      multiple
                      onChange={(e) =>
                        setImages(Array.from(e.target.files ?? []))
                      }
                    />
                    {images.length > 0 && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Selected: {images.length} file(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Packages ─────────────────────────────── */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Package Classifications
                </h2>
                <button
                  type="button"
                  onClick={addClassification}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  Add Package
                </button>
              </div>
              <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                <Icon
                  icon="heroicons:information-circle"
                  className="size-4 text-blue-500 shrink-0"
                />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Each package will have its own itinerary. Prices are
                  auto-calculated from resources.
                </p>
              </div>

              <div className="space-y-4">
                {classifications.map((cls, clsI) => (
                  <div
                    key={clsI}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Package #{clsI + 1}
                      </h3>
                      {classifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeClassification(clsI)}
                          aria-label="Remove package"
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Icon icon="heroicons:trash" className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Package Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cls.name}
                          onChange={(e) =>
                            updateClassification(clsI, "name", e.target.value)
                          }
                          placeholder="e.g. Standard, Luxury, Premium"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                        {errors[`cls_${clsI}_name`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`cls_${clsI}_name`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Duration (Days){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={cls.durationDays}
                          onChange={(e) =>
                            updateClassification(
                              clsI,
                              "durationDays",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. 5"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                        {errors[`cls_${clsI}_duration`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`cls_${clsI}_duration`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={cls.description}
                        onChange={(e) =>
                          updateClassification(
                            clsI,
                            "description",
                            e.target.value,
                          )
                        }
                        rows={2}
                        placeholder="Describe what this package includes"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                      />
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
                  Select Package to Edit Itinerary
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Choose a package classification to manage its day-by-day
                  itinerary
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
                            Package #{i + 1}
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
                          {cls.name || "Unnamed"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {totalDays} days, {daysProcessed} days processed
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
                    Itinerary for Package #{ci + 1}
                  </h2>
                  <button
                    type="button"
                    onClick={() => addDayPlan(ci)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <Icon icon="heroicons:plus" className="size-4" />
                    Add Day
                  </button>
                </div>

                {(dayPlans[ci] ?? []).length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Icon
                      icon="heroicons:calendar-days"
                      className="size-10 mx-auto mb-3 opacity-40"
                    />
                    <p className="text-sm">
                      No days added yet. Click &quot;Add Day&quot; to start
                      building the itinerary.
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
                          <div className="flex-1 flex items-center gap-3">
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) =>
                                updateDayPlan(ci, di, "title", e.target.value)
                              }
                              placeholder={`Day ${day.dayNumber} title`}
                              className="flex-1 px-2 py-1 text-sm bg-white/10 text-white rounded border border-white/20 placeholder:text-white/60 focus:ring-2 focus:ring-white/30 outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDayPlan(ci, di)}
                            aria-label="Remove day"
                            className="text-white/70 hover:text-white transition-colors">
                            <Icon icon="heroicons:x-mark" className="size-5" />
                          </button>
                        </div>

                        {/* Day Body */}
                        <div className="p-4">
                          <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                              Day Description
                            </label>
                            <textarea
                              value={day.description}
                              onChange={(e) =>
                                updateDayPlan(
                                  ci,
                                  di,
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows={2}
                              placeholder="Overview of activities for this day"
                              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                            />
                          </div>

                          {/* Activities Section */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Activities
                              </span>
                              <button
                                type="button"
                                onClick={() => addActivity(ci, di)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                                <Icon
                                  icon="heroicons:plus"
                                  className="size-3"
                                />
                                Add Activity
                              </button>
                            </div>

                            {day.activities.length === 0 && (
                              <p className="text-xs text-slate-400 text-center py-4">
                                No activities yet
                              </p>
                            )}

                            {day.activities.map((act, ai) => (
                              <div
                                key={ai}
                                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-3 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    Activity #{ai + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeActivity(ci, di, ai)}
                                    aria-label="Remove activity"
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
                                      Activity Type{" "}
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
                                      aria-label="Activity type"
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition">
                                      {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Start Time */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                      Start Time
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
                                      placeholder="09:00"
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>

                                  {/* End Time */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                      End Time
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
                                      placeholder="12:00"
                                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    />
                                  </div>
                                </div>

                                {/* Title */}
                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Title{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={act.title}
                                    onChange={(e) =>
                                      updateActivity(
                                        ci,
                                        di,
                                        ai,
                                        "title",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Activity title"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                  />
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    value={act.description}
                                    onChange={(e) =>
                                      updateActivity(
                                        ci,
                                        di,
                                        ai,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    rows={2}
                                    placeholder="Describe this activity"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                                  />
                                </div>

                                {/* Note */}
                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Note
                                  </label>
                                  <input
                                    type="text"
                                    value={act.note}
                                    onChange={(e) =>
                                      updateActivity(
                                        ci,
                                        di,
                                        ai,
                                        "note",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Any additional notes"
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                  />
                                </div>

                                {/* Link to Resources */}
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Link to Resources (Optional)
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
                                          placeholder="https://..."
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
                                      Add link
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
                    Accommodations
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addAccommodation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  Add Accommodation
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Shared resource pool. Link to activities in Itinerary step.
              </p>

              <div className="space-y-4">
                {accommodations.map((acc, accI) => (
                  <div
                    key={accI}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Accommodation #{accI + 1}
                      </h3>
                      {accommodations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAccommodation(accI)}
                          aria-label="Remove accommodation"
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Icon icon="heroicons:trash" className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* Accommodation Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Accommodation Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
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
                          placeholder="Hotel Metropole Hanoi"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Address
                        </label>
                        <input
                          type="text"
                          value={acc.address}
                          onChange={(e) =>
                            updateAccommodation(accI, "address", e.target.value)
                          }
                          placeholder="15 Ngo Quyen Street, Hoan Kiem District, Hanoi"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      {/* Contact Phone + Check-in Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Contact Phone
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
                            placeholder="+84 24 3826 6919"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Check-in Time
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
                            placeholder="14:00"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Check-out Time */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Check-out Time
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
                            placeholder="12:00"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Note */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Note
                        </label>
                        <textarea
                          value={acc.note}
                          onChange={(e) =>
                            updateAccommodation(accI, "note", e.target.value)
                          }
                          rows={3}
                          placeholder="Additional information, amenities, special requirements..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                        />
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
                    Locations / Attractions
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addLocation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  Add Location
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Shared resource pool. Link to activities in Itinerary step.
              </p>

              <div className="space-y-4">
                {locations.map((loc, locI) => (
                  <div
                    key={locI}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Location #{locI + 1}
                      </h3>
                      {locations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLocation(locI)}
                          aria-label="Remove location"
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
                            Location Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
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
                            placeholder="Temple of Literature"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Type
                          </label>
                          <input
                            type="text"
                            value={loc.type}
                            onChange={(e) =>
                              updateLocation(locI, "type", e.target.value)
                            }
                            placeholder="Temple, Museum..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Description
                        </label>
                        <textarea
                          value={loc.description}
                          onChange={(e) =>
                            updateLocation(locI, "description", e.target.value)
                          }
                          rows={2}
                          placeholder="Location description..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                        />
                      </div>
                      {/* City + Country + Entrance Fee */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={loc.city}
                            onChange={(e) =>
                              updateLocation(locI, "city", e.target.value)
                            }
                            placeholder="Hanoi"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Country
                          </label>
                          <input
                            type="text"
                            value={loc.country}
                            onChange={(e) =>
                              updateLocation(locI, "country", e.target.value)
                            }
                            placeholder="Vietnam"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Entrance Fee
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
                            placeholder="30000"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Address
                        </label>
                        <input
                          type="text"
                          value={loc.address}
                          onChange={(e) =>
                            updateLocation(locI, "address", e.target.value)
                          }
                          placeholder="Full address..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
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
                    Transportation Routes
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addTransportation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Icon icon="heroicons:plus" className="size-4" />
                  Add Route
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Shared resource pool. Link to activities in Itinerary step.
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
                          Route #{trI + 1}
                        </h3>
                      </div>
                      {transportations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTransportation(trI)}
                          aria-label="Remove route"
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
                            From Location{" "}
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
                            placeholder="Hanoi"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            To Location <span className="text-red-500">*</span>
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
                            placeholder="Halong Bay"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Transportation Type
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
                            placeholder="Bus, Flight, Car..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Transportation Name + Duration + Pricing Type */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Transportation Name
                          </label>
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
                            placeholder="Vietnam Airlines..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Duration (minutes)
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
                            placeholder="0"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Pricing Type
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
                            placeholder="Per person, Fixed..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Price + Requires Ticket + Ticket Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            value={tr.price}
                            onChange={(e) =>
                              updateTransportation(trI, "price", e.target.value)
                            }
                            placeholder="Optional"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
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
                          Requires Individual Ticket
                        </label>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Ticket Info
                          </label>
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
                            placeholder="Booking reference..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>
                      {/* Note */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Note
                        </label>
                        <textarea
                          value={tr.note}
                          onChange={(e) =>
                            updateTransportation(trI, "note", e.target.value)
                          }
                          rows={2}
                          placeholder="Air-conditioned vehicle..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                        />
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
                  Other Services
                </h2>
                <p className="text-sm">
                  Configuration for services will be available soon.
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
                  Insurance Packages
                </h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Select insurance packages available for this tour (filtered by
                classification)
              </p>

              <div className="space-y-5">
                {classifications.map((cls, clsI) => (
                  <div key={clsI}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {cls.name || `Package #${clsI + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => addInsurance(clsI)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                        <Icon icon="heroicons:plus" className="size-4" />
                        Add Insurance
                      </button>
                    </div>

                    {(insurances[clsI] ?? []).length === 0 ? (
                      <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg py-6 text-center">
                        <p className="text-sm text-slate-400">
                          No insurance added. Click &quot;Add Insurance&quot; to
                          create one.
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
                                  {ins.insuranceName || "Untitled"}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                                  {INSURANCE_TYPE_OPTIONS.find(
                                    (o) => o.value === ins.insuranceType,
                                  )?.label ?? "Travel"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Coverage: ${ins.coverageAmount || "0"} &bull;
                                Duration of tour
                                {ins.coverageFee
                                  ? ` • Fee: $${ins.coverageFee}`
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
                                aria-label="Remove insurance"
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
                      Edit: {ins.insuranceName || `Insurance #${ii + 1}`} —{" "}
                      {cls.name || `Package #${clsI + 1}`}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Name
                        </label>
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
                          placeholder="Insurance name"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Type
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
                          aria-label="Insurance type"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition">
                          {INSURANCE_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Provider
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
                          placeholder="Provider name"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Coverage Description
                      </label>
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
                        placeholder="Describe coverage"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Coverage ($)
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
                          Fee ($)
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
                        Optional
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
                    No insurance selected. Consider adding insurance packages
                    for customer protection.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 9: Review ───────────────────────────────── */}
          {currentStep === 8 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Icon
                  icon="heroicons:check-circle"
                  className="size-5 text-green-600"
                />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Review Tour Package
                </h2>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Basic Information
                  </h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-1.5">
                    <p className="text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Code:
                      </span>{" "}
                      <span className="text-slate-900 dark:text-white">
                        Auto-generated after creation
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Name:
                      </span>{" "}
                      <span className="text-slate-900 dark:text-white">
                        {basicInfo.tourName || "N/A"}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Short Description:
                      </span>{" "}
                      <span className="text-slate-900 dark:text-white">
                        {basicInfo.shortDescription || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Package Classifications */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Package Classifications
                  </h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                      {classifications.length} package(s) defined
                    </p>
                    <div className="space-y-1">
                      {classifications.map((cls, i) => (
                        <p
                          key={i}
                          className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">#{i + 1}:</span>{" "}
                          {cls.name || "Unnamed"} – {cls.durationDays || 0} days
                          – {(dayPlans[i] ?? []).length} itinerary days
                          generated
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Resources
                  </h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Accommodations:
                        </span>{" "}
                        <span className="text-slate-900 dark:text-white">
                          {
                            accommodations.filter(
                              (a) => a.accommodationName.trim() !== "",
                            ).length
                          }
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Locations:
                        </span>{" "}
                        <span className="text-slate-900 dark:text-white">
                          {
                            locations.filter(
                              (l) => l.locationName.trim() !== "",
                            ).length
                          }
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Routes:
                        </span>{" "}
                        <span className="text-slate-900 dark:text-white">
                          {
                            transportations.filter(
                              (t) => t.fromLocation.trim() !== "",
                            ).length
                          }
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Services:
                        </span>{" "}
                        <span className="text-slate-900 dark:text-white">
                          {
                            services.filter((s) => s.serviceName.trim() !== "")
                              .length
                          }
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Insurance Packages */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Insurance Packages
                  </h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    {classifications.every(
                      (_, i) => (insurances[i] ?? []).length === 0,
                    ) ? (
                      <p className="text-sm text-slate-400">
                        No insurance packages selected
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {classifications.map((cls, clsI) =>
                          (insurances[clsI] ?? []).map((ins, ii) => (
                            <p
                              key={`${clsI}-${ii}`}
                              className="text-sm text-slate-600 dark:text-slate-400">
                              {ins.insuranceName || "Untitled"} ({cls.name}) —
                              Coverage: ${ins.coverageAmount || "0"}, Fee: $
                              {ins.coverageFee || "0"}
                            </p>
                          )),
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Note banner */}
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-4 py-3">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <span className="font-semibold">Note:</span> Package prices
                    will be automatically calculated from linked accommodations,
                    locations, routes, and services based on each itinerary.
                  </p>
                </div>
              </div>
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
              {currentStep === 0 ? "Back to List" : "Previous"}
            </button>

            {currentStep < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Next
                <Icon icon="heroicons:arrow-right" className="size-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors disabled:opacity-50">
                  <Icon
                    icon="heroicons:clipboard-document"
                    className="size-4"
                  />
                  Save Draft
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
                  Publish Tour
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
