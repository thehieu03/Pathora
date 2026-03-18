// Cancellation Policy Types

export interface CancellationPolicy {
  id: string;
  policyCode: string;
  tourScope: number;
  tourScopeName: string;
  minDaysBeforeDeparture: number;
  maxDaysBeforeDeparture: number;
  penaltyPercentage: number;
  applyOn: string;
  status: number;
  statusName: string;
  createdBy?: string;
  lastModifiedBy?: string;
  createdOnUtc: string;
  lastModifiedOnUtc: string | null;
}

export interface CreateCancellationPolicyRequest {
  tourScope: number;
  minDaysBeforeDeparture: number;
  maxDaysBeforeDeparture: number;
  penaltyPercentage: number;
  applyOn?: string;
}

export interface UpdateCancellationPolicyRequest {
  id: string;
  tourScope: number;
  minDaysBeforeDeparture: number;
  maxDaysBeforeDeparture: number;
  penaltyPercentage: number;
  applyOn?: string;
  status?: number;
}

export const TourScopeMap: Record<number, string> = {
  1: "Domestic",
  2: "International",
};

export const CancellationPolicyStatusMap: Record<number, string> = {
  1: "Active",
  2: "Inactive",
};

export const ApplyOnMap: Record<string, string> = {
  "FullAmount": "Full Amount",
  "DepositOnly": "Deposit Only",
};
