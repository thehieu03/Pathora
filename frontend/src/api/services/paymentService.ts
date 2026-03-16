import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/home";
import { extractResult } from "@/utils/apiResponse";

export interface GetQrPayload {
  note: string;
  amount: number;
}

// Backend enums (matching C# enums)
export enum TransactionTypeEnum {
  Deposit = 1,
  FullPayment = 2,
  Refund = 3,
}

export enum PaymentMethodEnum {
  Cash = 1,
  BankTransfer = 2,
  Card = 3,
  Momo = 4,
  VnPay = 5,
}

export enum TransactionStatusEnum {
  Pending = 1,
  Processing = 2,
  Completed = 3,
  Failed = 4,
  Refunded = 5,
  Cancelled = 6,
}

// Frontend-facing string types for developer convenience
export type TransactionTypeString = "Deposit" | "FullPayment" | "Refund";
export type PaymentMethodString = "Cash" | "BankTransfer" | "Card" | "Momo" | "VnPay";

// Convert string to enum integer for API
const toTransactionType = (type: TransactionTypeString): number => TransactionTypeEnum[type];
const toPaymentMethod = (method: PaymentMethodString): number => PaymentMethodEnum[method];

export interface CreateTransactionPayload {
  bookingId: string;
  type: TransactionTypeString;
  amount: number;
  paymentMethod: PaymentMethodString;
  paymentNote: string;
  createdBy: string;
  expirationMinutes?: number;
}

export interface PaymentTransaction {
  id: string;
  transactionCode: string;
  bookingId: string;
  type: "Deposit" | "FullPayment" | "Refund";
  status: "Pending" | "Processing" | "Completed" | "Failed" | "Refunded" | "Cancelled";
  amount: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentMethod: string;
  createdAt: string;
  expiredAt?: string;
  paidAt?: string;
  completedAt?: string;
  qrCodeUrl?: string;
  paymentNote?: string;
  senderName?: string;
  senderAccountNumber?: string;
  beneficiaryBank?: string;
}

export const paymentService = {
  getQr: async (payload: GetQrPayload) => {
    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.PAYMENT.GET_QR,
      payload,
    );

    return extractResult<string>(response.data);
  },

  createTransaction: async (payload: CreateTransactionPayload) => {
    // Convert string enums to integers for backend
    const apiPayload = {
      ...payload,
      type: toTransactionType(payload.type),
      paymentMethod: toPaymentMethod(payload.paymentMethod),
    };

    const response = await api.post<ApiResponse<PaymentTransaction>>(
      API_ENDPOINTS.PAYMENT.CREATE_TRANSACTION,
      apiPayload,
    );

    return extractResult<PaymentTransaction>(response.data);
  },

  getTransaction: async (transactionCode: string) => {
    const response = await api.get<ApiResponse<PaymentTransaction>>(
      API_ENDPOINTS.PAYMENT.GET_TRANSACTION(transactionCode),
    );

    return extractResult<PaymentTransaction>(response.data);
  },

  expireTransaction: async (transactionCode: string) => {
    const response = await api.post<ApiResponse<PaymentTransaction>>(
      API_ENDPOINTS.PAYMENT.EXPIRE_TRANSACTION(transactionCode),
    );

    return extractResult<PaymentTransaction>(response.data);
  },
};
