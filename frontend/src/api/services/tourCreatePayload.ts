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

interface ClassificationPayloadInput {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  durationDays: string;
}

interface ActivityPayloadInput {
  activityType: string;
  title: string;
  description: string;
  note: string;
  estimatedCost: string;
  isOptional: boolean;
  startTime: string;
  endTime: string;
}

interface DayPlanPayloadInput {
  dayNumber: string;
  title: string;
  description: string;
  activities: ActivityPayloadInput[];
}

interface InsurancePayloadInput {
  insuranceName: string;
  insuranceType: string;
  insuranceProvider: string;
  coverageDescription: string;
  coverageAmount: string;
  coverageFee: string;
  isOptional: boolean;
  note: string;
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

const buildClassificationsPayload = (
  classifications: ClassificationPayloadInput[],
  dayPlans: DayPlanPayloadInput[][],
  insurances: InsurancePayloadInput[][],
) => {
  return classifications.map((classification, classificationIndex) => {
    const numberOfDay = Math.max(parseIntValue(classification.durationDays, 1), 1);
    const adultPrice = parseDecimal(classification.price, 0);
    const childPrice = parseDecimal(
      classification.salePrice || classification.price,
      adultPrice,
    );

    return {
      name: classification.name,
      description: classification.description,
      adultPrice,
      childPrice,
      infantPrice: 0,
      numberOfDay,
      numberOfNight: Math.max(numberOfDay - 1, 0),
      plans: (dayPlans[classificationIndex] ?? []).map((dayPlan) => ({
        dayNumber: Math.max(parseIntValue(dayPlan.dayNumber, 1), 1),
        title: dayPlan.title,
        description: toOptionalString(dayPlan.description),
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
      })),
    };
  });
};

export const buildCreateTourFormData = ({
  basicInfo,
  thumbnail,
  images,
  vietnameseTranslation,
  englishTranslation,
  classifications,
  dayPlans,
  insurances,
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

  return formData;
};
