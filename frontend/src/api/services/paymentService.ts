import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/home";
import { extractResult } from "@/utils/apiResponse";

export interface GetQrPayload {
  note: string;
  amount: number;
}

export interface CreateTransactionPayload {
  bookingId: string;
  type: "Deposit" | "FullPayment" | "Refund";
  amount: number;
  paymentMethod: "Cash" | "BankTransfer" | "Card" | "Momo" | "VnPay";
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
    const response = await api.post<ApiResponse<PaymentTransaction>>(
      API_ENDPOINTS.PAYMENT.CREATE_TRANSACTION,
      payload,
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
