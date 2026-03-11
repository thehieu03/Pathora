export const formatDisplayDate = (
  dateValue: string | null,
  locale: string,
  fallback: string,
): string => {
  if (!dateValue) {
    return fallback;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString(locale || "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateRange = (
  startDate: string,
  endDate: string,
  locale: string,
  fallback: string,
): string => {
  if (!startDate || !endDate) {
    return fallback;
  }

  const formattedStart = formatDisplayDate(startDate, locale, fallback);
  const formattedEnd = formatDisplayDate(endDate, locale, fallback);

  if (formattedStart === fallback || formattedEnd === fallback) {
    return fallback;
  }

  return `${formattedStart} - ${formattedEnd}`;
};

export const formatBudgetUsd = (
  value: number,
  locale: string,
): string => {
  return new Intl.NumberFormat(locale || "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatParticipantsLabel = (
  value: number,
  singularLabel: string,
  pluralLabel: string,
): string => {
  return `${value} ${value === 1 ? singularLabel : pluralLabel}`;
};

export const mapValidationErrorCodeToMessageKey = (
  code: string,
): string => {
  const map: Record<string, string> = {
    destinationRequired: "customTourRequest.validation.destinationRequired",
    startDateRequired: "customTourRequest.validation.startDateRequired",
    startDateInvalid: "customTourRequest.validation.startDateInvalid",
    endDateRequired: "customTourRequest.validation.endDateRequired",
    endDateInvalid: "customTourRequest.validation.endDateInvalid",
    endDateBeforeStartDate:
      "customTourRequest.validation.endDateBeforeStartDate",
    participantsRequired: "customTourRequest.validation.participantsRequired",
    participantsInvalid: "customTourRequest.validation.participantsInvalid",
    budgetRequired: "customTourRequest.validation.budgetRequired",
    budgetInvalid: "customTourRequest.validation.budgetInvalid",
  };

  return map[code] ?? "customTourRequest.validation.default";
};
