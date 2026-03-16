import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/home";
import type { AdminDashboard, AdminOverview } from "@/types/admin";
import { extractResult } from "@/utils/apiResponse";

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
};
