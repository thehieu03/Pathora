import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/home";
import type { AdminDashboard, AdminOverview } from "@/types/admin";
import { extractResult } from "@/utils/apiResponse";

export interface AdminBooking {
  id: string | number;
  customerName?: string;
  customer?: string;
  tourName?: string;
  tour?: string;
  departureDate?: string;
  departure?: string;
  amount?: number;
  status: string;
}

export const adminService = {
  getOverview: async () => {
    const response = await api.get<ApiResponse<AdminOverview>>(
      API_ENDPOINTS.ADMIN.GET_OVERVIEW,
    );

    return extractResult<AdminOverview>(response.data);
  },

  getDashboard: async () => {
    const response = await api.get<ApiResponse<AdminDashboard>>(
      API_ENDPOINTS.ADMIN.GET_DASHBOARD,
    );

    return extractResult<AdminDashboard>(response.data);
  },

  getBookings: async (): Promise<AdminBooking[]> => {
    const response = await api.get(API_ENDPOINTS.BOOKING.GET_LIST);
    const items = (response.data as { items?: AdminBooking[] }).items;
    return Array.isArray(items) ? items : [];
  },
};
