// Pricing Policy Types

export interface PricingPolicyTier {
  label: string;
  ageFrom: number;
  ageTo: number | null;
  pricePercentage: number;
}

export interface PricingPolicy {
  id: string;
  policyCode: string;
  name: string;
  tourType: number;
  tourTypeName: string;
  status: number;
  statusName: string;
  isDefault: boolean;
  tiers: PricingPolicyTier[];
  createdOnUtc: string;
  lastModifiedOnUtc: string | null;
}

export interface CreatePricingPolicyRequest {
  name: string;
  tourType: number;
  tiers: PricingPolicyTier[];
  isDefault?: boolean;
}

export interface UpdatePricingPolicyRequest {
  id: string;
  name: string;
  tourType: number;
  tiers: PricingPolicyTier[];
}

export const PricingPolicyStatusMap: Record<number, string> = {
  1: "Active",
  2: "Inactive",
};

export const TourTypeMap: Record<number, string> = {
  1: "Private",
  2: "Public",
};
