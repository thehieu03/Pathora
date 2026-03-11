import type {
  CustomTourInterest,
  CustomTourRequestPayload,
} from "@/types/customTourRequest";

export interface CustomTourRequestFormValues {
  destination: string;
  startDate: string;
  endDate: string;
  participants: string;
  budgetPerPersonUsd: string;
  travelInterests: CustomTourInterest[];
  preferredAccommodation: string;
  transportationPreference: string;
  specialRequests: string;
}

export type CustomTourRequestValidationErrors = Partial<
  Record<keyof CustomTourRequestFormValues, string>
>;

const isValidDateInput = (dateValue: string): boolean => {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);
  return !Number.isNaN(date.getTime());
};

export const createEmptyCustomTourRequestFormValues = (): CustomTourRequestFormValues => {
  return {
    destination: "",
    startDate: "",
    endDate: "",
    participants: "",
    budgetPerPersonUsd: "",
    travelInterests: [],
    preferredAccommodation: "",
    transportationPreference: "",
    specialRequests: "",
  };
};

export const validateCustomTourRequestForm = (
  values: CustomTourRequestFormValues,
): CustomTourRequestValidationErrors => {
  const errors: CustomTourRequestValidationErrors = {};

  if (!values.destination.trim()) {
    errors.destination = "destinationRequired";
  }

  if (!values.startDate) {
    errors.startDate = "startDateRequired";
  } else if (!isValidDateInput(values.startDate)) {
    errors.startDate = "startDateInvalid";
  }

  if (!values.endDate) {
    errors.endDate = "endDateRequired";
  } else if (!isValidDateInput(values.endDate)) {
    errors.endDate = "endDateInvalid";
  }

  if (values.startDate && values.endDate && isValidDateInput(values.startDate) && isValidDateInput(values.endDate)) {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);
    if (end < start) {
      errors.endDate = "endDateBeforeStartDate";
    }
  }

  const participants = Number(values.participants);
  if (!values.participants.trim()) {
    errors.participants = "participantsRequired";
  } else if (!Number.isFinite(participants) || participants < 1) {
    errors.participants = "participantsInvalid";
  }

  const budget = Number(values.budgetPerPersonUsd);
  if (!values.budgetPerPersonUsd.trim()) {
    errors.budgetPerPersonUsd = "budgetRequired";
  } else if (!Number.isFinite(budget) || budget <= 0) {
    errors.budgetPerPersonUsd = "budgetInvalid";
  }

  return errors;
};

export const hasValidationErrors = (
  errors: CustomTourRequestValidationErrors,
): boolean => {
  return Object.keys(errors).length > 0;
};

export const mapFormValuesToPayload = (
  values: CustomTourRequestFormValues,
): CustomTourRequestPayload => {
  return {
    destination: values.destination.trim(),
    startDate: values.startDate,
    endDate: values.endDate,
    numberOfParticipants: Number(values.participants),
    budgetPerPersonUsd: Number(values.budgetPerPersonUsd),
    travelInterests: values.travelInterests,
    preferredAccommodation: values.preferredAccommodation.trim() || null,
    transportationPreference: values.transportationPreference.trim() || null,
    specialRequests: values.specialRequests.trim() || null,
  };
};
