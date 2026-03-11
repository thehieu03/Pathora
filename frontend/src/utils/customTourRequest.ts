import { extractItems, extractResult } from "./apiResponse";
import type {
  CustomTourInterest,
  CustomTourRequest,
  CustomTourRequestStatus,
} from "../types/customTourRequest";

const INTEREST_SET: Set<CustomTourInterest> = new Set([
  "adventure",
  "culture_history",
  "nature_wildlife",
  "food_culinary",
  "relaxation_wellness",
]);

const toSafeRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as Record<string, unknown>;
};

const toNullableString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toStringOrFallback = (value: unknown, fallback: string): string => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return fallback;
};

const toPositiveNumber = (value: unknown, fallback = 0): number => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return fallback;
  }

  return numeric;
};

const normalizeStatus = (value: unknown): CustomTourRequestStatus => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized.includes("approve")) {
      return "approved";
    }
    if (normalized.includes("reject")) {
      return "rejected";
    }
    if (normalized.includes("pending")) {
      return "pending";
    }
  }

  const numeric = Number(value);
  if (numeric === 1) {
    return "approved";
  }
  if (numeric === 2) {
    return "rejected";
  }

  return "pending";
};

const normalizeInterest = (value: unknown): CustomTourInterest | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[&]/g, " and ")
    .replace(/[^a-z]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const aliasMap: Record<string, CustomTourInterest> = {
    adventure: "adventure",
    culture_history: "culture_history",
    culture_and_history: "culture_history",
    nature_wildlife: "nature_wildlife",
    nature_and_wildlife: "nature_wildlife",
    food_culinary: "food_culinary",
    food_and_culinary: "food_culinary",
    relaxation_wellness: "relaxation_wellness",
    relaxation_and_wellness: "relaxation_wellness",
  };

  const mapped = aliasMap[normalized];
  return mapped && INTEREST_SET.has(mapped) ? mapped : null;
};

const normalizeInterests = (value: unknown): CustomTourInterest[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const mapped = value
    .map((interest) => normalizeInterest(interest))
    .filter((interest): interest is CustomTourInterest => Boolean(interest));

  return Array.from(new Set(mapped));
};

export const normalizeCustomTourRequest = (
  payload: unknown,
): CustomTourRequest | null => {
  const data = toSafeRecord(payload);

  const id =
    toNullableString(data.id) ??
    toNullableString(data.requestId) ??
    toNullableString(data.tourRequestId);

  if (!id) {
    return null;
  }

  const requestCode =
    toNullableString(data.requestCode) ??
    toNullableString(data.code) ??
    `REQ-${id.slice(0, 8).toUpperCase()}`;

  return {
    id,
    requestCode,
    destination: toStringOrFallback(data.destination, ""),
    startDate: toStringOrFallback(data.startDate, ""),
    endDate: toStringOrFallback(data.endDate, ""),
    numberOfParticipants: toPositiveNumber(
      data.numberOfParticipants ?? data.participants,
      1,
    ),
    budgetPerPersonUsd: toPositiveNumber(
      data.budgetPerPersonUsd ?? data.budgetPerPerson,
      0,
    ),
    travelInterests: normalizeInterests(
      data.travelInterests ?? data.interests ?? data.travelPreference,
    ),
    preferredAccommodation: toNullableString(data.preferredAccommodation),
    transportationPreference: toNullableString(data.transportationPreference),
    specialRequests: toNullableString(
      data.specialRequests ?? data.specialRequirements,
    ),
    status: normalizeStatus(data.status),
    adminNote: toNullableString(data.adminNote),
    createdOnUtc:
      toNullableString(data.createdOnUtc) ??
      toNullableString(data.createdAt) ??
      null,
    reviewedOnUtc:
      toNullableString(data.reviewedOnUtc) ??
      toNullableString(data.reviewedAt) ??
      null,
  };
};

export const normalizeCustomTourRequestList = (
  payload: unknown,
): CustomTourRequest[] => {
  const directItems = extractItems<unknown>(payload);
  if (directItems.length > 0) {
    return directItems
      .map((item) => normalizeCustomTourRequest(item))
      .filter((item): item is CustomTourRequest => Boolean(item));
  }

  const extracted = extractResult<unknown>(payload);
  if (Array.isArray(extracted)) {
    return extracted
      .map((item) => normalizeCustomTourRequest(item))
      .filter((item): item is CustomTourRequest => Boolean(item));
  }

  const record = toSafeRecord(extracted);
  if (Array.isArray(record.items)) {
    return record.items
      .map((item) => normalizeCustomTourRequest(item))
      .filter((item): item is CustomTourRequest => Boolean(item));
  }

  return [];
};
