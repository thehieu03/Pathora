export type CustomTourRequestStatus = "pending" | "approved" | "rejected";

export type CustomTourReviewDecision = "approved" | "rejected";

export type CustomTourInterest =
  | "adventure"
  | "culture_history"
  | "nature_wildlife"
  | "food_culinary"
  | "relaxation_wellness";

export interface CustomTourRequestPayload {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfParticipants: number;
  budgetPerPersonUsd: number;
  travelInterests: CustomTourInterest[];
  preferredAccommodation: string | null;
  transportationPreference: string | null;
  specialRequests: string | null;
}

export interface CustomTourRequestReviewPayload {
  decision: CustomTourReviewDecision;
  adminNote: string | null;
}

export interface CustomTourRequestListFilters {
  status?: CustomTourRequestStatus | "all";
  keyword?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CustomTourRequest {
  id: string;
  requestCode: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfParticipants: number;
  budgetPerPersonUsd: number;
  travelInterests: CustomTourInterest[];
  preferredAccommodation: string | null;
  transportationPreference: string | null;
  specialRequests: string | null;
  status: CustomTourRequestStatus;
  adminNote: string | null;
  createdOnUtc: string | null;
  reviewedOnUtc: string | null;
}
