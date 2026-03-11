import type {
  CustomTourInterest,
  CustomTourRequestStatus,
} from "@/types/customTourRequest";

export interface InterestOption {
  value: CustomTourInterest;
  labelKey: string;
  defaultLabel: string;
}

export const TRAVEL_INTEREST_OPTIONS: InterestOption[] = [
  {
    value: "adventure",
    labelKey: "customTourRequest.interests.adventure",
    defaultLabel: "Adventure",
  },
  {
    value: "culture_history",
    labelKey: "customTourRequest.interests.cultureHistory",
    defaultLabel: "Culture & History",
  },
  {
    value: "nature_wildlife",
    labelKey: "customTourRequest.interests.natureWildlife",
    defaultLabel: "Nature & Wildlife",
  },
  {
    value: "food_culinary",
    labelKey: "customTourRequest.interests.foodCulinary",
    defaultLabel: "Food & Culinary",
  },
  {
    value: "relaxation_wellness",
    labelKey: "customTourRequest.interests.relaxationWellness",
    defaultLabel: "Relaxation & Wellness",
  },
];

export const STATUS_STYLE_MAP: Record<
  CustomTourRequestStatus,
  { badge: string; dot: string; labelKey: string; defaultLabel: string }
> = {
  pending: {
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    labelKey: "customTourRequest.status.pending",
    defaultLabel: "Pending",
  },
  approved: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    labelKey: "customTourRequest.status.approved",
    defaultLabel: "Approved",
  },
  rejected: {
    badge: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
    labelKey: "customTourRequest.status.rejected",
    defaultLabel: "Rejected",
  },
};
