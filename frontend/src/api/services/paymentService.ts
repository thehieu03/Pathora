import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/home";
import { extractResult } from "@/utils/apiResponse";

export interface GetQrPayload {
  note: string;
  amount: number;
}

export const paymentService = {
  getQr: async (payload: GetQrPayload) => {
    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.PAYMENT.GET_QR,
      payload,
    );

    return extractResult<string>(response.data);
  },
};
