import {
  buildTourTranslationsPayload,
  type TourTranslationFormValues,
} from "./tourTranslations";

interface BasicInfoPayload {
  tourName: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
}

// Bilingual input types for nested entities
interface ClassificationPayloadInput {
  name: string;
  enName: string;
  description: string;
  enDescription: string;
  basePrice: string;
  durationDays: string;
}

interface ActivityPayloadInput {
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
}

interface DayPlanPayloadInput {
  dayNumber: string;
  title: string;
  enTitle: string;
  description: string;
  enDescription: string;
  activities: ActivityPayloadInput[];
}

interface InsurancePayloadInput {
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

interface AccommodationPayloadInput {
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

interface LocationPayloadInput {
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

interface TransportationPayloadInput {
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

interface CreateTourPayloadOptions {
  basicInfo: BasicInfoPayload;
  thumbnail: File | null;
  images: File[];
  vietnameseTranslation: TourTranslationFormValues;
  englishTranslation: TourTranslationFormValues;
  classifications: ClassificationPayloadInput[];
  dayPlans: DayPlanPayloadInput[][];
  insurances: InsurancePayloadInput[][];
  accommodations?: AccommodationPayloadInput[];
  locations?: LocationPayloadInput[];
  transportations?: TransportationPayloadInput[];
  selectedPricingPolicyId?: string;
  selectedDepositPolicyId?: string;
  selectedCancellationPolicyId?: string;
  selectedVisaPolicyId?: string;
}

const parseDecimal = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseIntValue = (value: string, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

// ── Nested translation helpers ─────────────────────────────────────────

// Builds { vi: {...}, en?: {...} } — en is omitted if empty
const buildClassificationTranslations = (
  viName: string,
  viDesc: string,
  enName: string,
  enDesc: string,
): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {
    vi: { name: viName, description: viDesc },
  };
  if (enName.trim().length > 0 || enDesc.trim().length > 0) {
    result.en = { name: enName, description: enDesc };
  }
  return result;
};

const buildDayPlanTranslations = (
  viTitle: string,
  viDesc: string,
  enTitle: string,
  enDesc: string,
): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {
    vi: { title: viTitle, description: viDesc },
  };
  if (enTitle.trim().length > 0 || enDesc.trim().length > 0) {
    result.en = { title: enTitle, description: enDesc };
  }
  return result;
};

const buildActivityTranslations = (
  viTitle: string,
  viDesc: string,
  viNote: string,
  enTitle: string,
  enDesc: string,
  enNote: string,
): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {
    vi: { title: viTitle, description: viDesc, note: viNote },
  };
  if (
    enTitle.trim().length > 0 ||
    enDesc.trim().length > 0 ||
    enNote.trim().length > 0
  ) {
    result.en = { title: enTitle, description: enDesc, note: enNote };
  }
  return result;
};

const buildInsuranceTranslations = (
  viName: string,
  viDesc: string,
  enName: string,
  enDesc: string,
): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {
    vi: { name: viName, description: viDesc },
  };
  if (enName.trim().length > 0 || enDesc.trim().length > 0) {
    result.en = { name: enName, description: enDesc };
  }
  return result;
};

// ── Classification payload builder ──────────────────────────────────

const buildClassificationsPayload = (
  classifications: ClassificationPayloadInput[],
  dayPlans: DayPlanPayloadInput[][],
  insurances: InsurancePayloadInput[][],
) => {
  return classifications.map((classification, classificationIndex) => {
    const numberOfDay = Math.max(parseIntValue(classification.durationDays, 1), 1);
    const basePrice = parseDecimal(classification.basePrice, 0);

    return {
      name: classification.name,
      description: classification.description,
      basePrice,
      numberOfDay,
      numberOfNight: Math.max(numberOfDay - 1, 0),
      translations: buildClassificationTranslations(
        classification.name,
        classification.description,
        classification.enName,
        classification.enDescription,
      ),
      plans: (dayPlans[classificationIndex] ?? []).map((dayPlan) => ({
        dayNumber: Math.max(parseIntValue(dayPlan.dayNumber, 1), 1),
        title: dayPlan.title,
        description: toOptionalString(dayPlan.description),
        translations: buildDayPlanTranslations(
          dayPlan.title,
          dayPlan.description,
          dayPlan.enTitle,
          dayPlan.enDescription,
        ),
        activities: dayPlan.activities.map((activity) => ({
          activityType: activity.activityType,
          title: activity.title,
          description: toOptionalString(activity.description),
          note: toOptionalString(activity.note),
          estimatedCost: parseDecimal(activity.estimatedCost, 0),
          isOptional: activity.isOptional,
          startTime: toOptionalString(activity.startTime),
          endTime: toOptionalString(activity.endTime),
          routes: [],
          accommodation: null,
          translations: buildActivityTranslations(
            activity.title,
            activity.description,
            activity.note,
            activity.enTitle,
            activity.enDescription,
            activity.enNote,
          ),
        })),
      })),
      insurances: (insurances[classificationIndex] ?? []).map((insurance) => ({
        insuranceName: insurance.insuranceName,
        insuranceType: insurance.insuranceType,
        insuranceProvider: insurance.insuranceProvider,
        coverageDescription: insurance.coverageDescription,
        coverageAmount: parseDecimal(insurance.coverageAmount, 0),
        coverageFee: parseDecimal(insurance.coverageFee, 0),
        isOptional: insurance.isOptional,
        note: toOptionalString(insurance.note),
        translations: buildInsuranceTranslations(
          insurance.insuranceName,
          insurance.coverageDescription,
          insurance.enInsuranceName,
          insurance.enCoverageDescription,
        ),
      })),
    };
  });
};

// ── Accommodation / Location / Transportation payload builders ──────────

const buildAccommodationsPayload = (
  accommodations: AccommodationPayloadInput[],
) =>
  accommodations.map((acc) => ({
    accommodationName: acc.accommodationName,
    address: acc.address,
    contactPhone: acc.contactPhone,
    checkInTime: toOptionalString(acc.checkInTime),
    checkOutTime: toOptionalString(acc.checkOutTime),
    note: toOptionalString(acc.note),
    translations: {
      vi: {
        accommodationName: acc.accommodationName,
        address: acc.address,
        note: acc.note ?? "",
      },
      ...(acc.enAccommodationName.trim().length > 0 ||
      acc.enAddress.trim().length > 0 ||
      (acc.enNote ?? "").trim().length > 0
        ? {
            en: {
              accommodationName: acc.enAccommodationName,
              address: acc.enAddress,
              note: acc.enNote ?? "",
            },
          }
        : {}),
    },
  }));

const buildLocationsPayload = (locations: LocationPayloadInput[]) =>
  locations.map((loc) => ({
    locationName: loc.locationName,
    locationType: loc.type,
    description: loc.description,
    city: loc.city,
    country: loc.country,
    entranceFee: parseDecimal(loc.entranceFee, 0),
    address: loc.address,
    translations: {
      vi: {
        locationName: loc.locationName,
        locationDescription: loc.description,
        city: loc.city,
        country: loc.country,
        address: loc.address,
      },
      ...(loc.enLocationName.trim().length > 0 ||
      loc.enDescription.trim().length > 0 ||
      loc.enCity.trim().length > 0 ||
      loc.enCountry.trim().length > 0 ||
      loc.enAddress.trim().length > 0
        ? {
            en: {
              locationName: loc.enLocationName,
              locationDescription: loc.enDescription,
              city: loc.enCity,
              country: loc.enCountry,
              address: loc.enAddress,
            },
          }
        : {}),
    },
  }));

const buildTransportationsPayload = (
  transportations: TransportationPayloadInput[],
) =>
  transportations.map((tr) => ({
    fromLocationName: tr.fromLocation,
    toLocationName: tr.toLocation,
    transportationType: tr.transportationType,
    transportationName: tr.transportationName,
    durationMinutes: parseIntValue(tr.durationMinutes, 0),
    pricingType: tr.pricingType,
    price: parseDecimal(tr.price, 0),
    requiresIndividualTicket: tr.requiresIndividualTicket,
    ticketInfo: toOptionalString(tr.ticketInfo),
    note: toOptionalString(tr.note),
    translations: {
      vi: {
        fromLocationName: tr.fromLocation,
        toLocationName: tr.toLocation,
        transportationType: tr.transportationType,
        transportationName: tr.transportationName,
        ticketInfo: tr.ticketInfo ?? "",
        note: tr.note ?? "",
      },
      ...(tr.enFromLocation.trim().length > 0 ||
      tr.enToLocation.trim().length > 0 ||
      tr.enTransportationType.trim().length > 0 ||
      tr.enTransportationName.trim().length > 0 ||
      (tr.enTicketInfo ?? "").trim().length > 0 ||
      (tr.enNote ?? "").trim().length > 0
        ? {
            en: {
              fromLocationName: tr.enFromLocation,
              toLocationName: tr.enToLocation,
              transportationType: tr.enTransportationType,
              transportationName: tr.enTransportationName,
              ticketInfo: tr.enTicketInfo ?? "",
              note: tr.enNote ?? "",
            },
          }
        : {}),
    },
  }));

// ── Main export ─────────────────────────────────────────────────────

export const buildCreateTourFormData = ({
  basicInfo,
  thumbnail,
  images,
  vietnameseTranslation,
  englishTranslation,
  classifications,
  dayPlans,
  insurances,
  accommodations = [],
  locations = [],
  transportations = [],
  selectedPricingPolicyId,
  selectedDepositPolicyId,
  selectedCancellationPolicyId,
  selectedVisaPolicyId,
}: CreateTourPayloadOptions) => {
  const formData = new FormData();

  formData.append("tourName", basicInfo.tourName);
  formData.append("shortDescription", basicInfo.shortDescription);
  formData.append("longDescription", basicInfo.longDescription);
  formData.append("seoTitle", basicInfo.seoTitle);
  formData.append("seoDescription", basicInfo.seoDescription);
  formData.append("status", basicInfo.status);

  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  images.forEach((image) => {
    formData.append("images", image);
  });

  if (selectedPricingPolicyId) {
    formData.append("pricingPolicyId", selectedPricingPolicyId);
  }

  if (selectedDepositPolicyId) {
    formData.append("depositPolicyId", selectedDepositPolicyId);
  }

  if (selectedCancellationPolicyId) {
    formData.append("cancellationPolicyId", selectedCancellationPolicyId);
  }

  if (selectedVisaPolicyId) {
    formData.append("visaPolicyId", selectedVisaPolicyId);
  }

  const translationsPayload = buildTourTranslationsPayload(
    vietnameseTranslation,
    englishTranslation,
  );
  formData.append("translations", JSON.stringify(translationsPayload));

  const classificationsPayload = buildClassificationsPayload(
    classifications,
    dayPlans,
    insurances,
  );

  if (classificationsPayload.length > 0) {
    formData.append("classifications", JSON.stringify(classificationsPayload));
  }

  if (accommodations.length > 0) {
    const accommodationsPayload = buildAccommodationsPayload(accommodations);
    formData.append("accommodations", JSON.stringify(accommodationsPayload));
  }

  if (locations.length > 0) {
    const locationsPayload = buildLocationsPayload(locations);
    formData.append("locations", JSON.stringify(locationsPayload));
  }

  if (transportations.length > 0) {
    const transportationsPayload = buildTransportationsPayload(transportations);
    formData.append("transportations", JSON.stringify(transportationsPayload));
  }

  return formData;
};
