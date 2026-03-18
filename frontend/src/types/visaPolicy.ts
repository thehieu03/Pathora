// Visa Policy Types

export interface VisaPolicy {
  id: string;
  region: string;
  processingDays: number;
  bufferDays: number;
  fullPaymentRequired: boolean;
  isActive: boolean;
  createdBy?: string;
  lastModifiedBy?: string;
  createdOnUtc: string;
  lastModifiedOnUtc: string | null;
}

export interface CreateVisaPolicyRequest {
  region: string;
  processingDays: number;
  bufferDays: number;
  fullPaymentRequired: boolean;
}

export interface UpdateVisaPolicyRequest {
  id: string;
  region: string;
  processingDays: number;
  bufferDays: number;
  fullPaymentRequired: boolean;
}
