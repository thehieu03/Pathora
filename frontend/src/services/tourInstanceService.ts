import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  TourInstanceDto,
  TourInstanceVm,
  TourInstanceStats,
  PaginatedResponse,
} from "@/types/tour";
import { extractResult } from "@/utils/apiResponse";
import { ApiResponse } from "@/types/home";

export const tourInstanceService = {
  getAllInstances: async (
    searchText?: string,
    status?: string,
    pageNumber = 1,
    pageSize = 10,
  ) => {
    const params = new URLSearchParams();
    if (searchText) params.append("searchText", searchText);
    if (status && status !== "all") params.append("status", status);
    params.append("pageNumber", pageNumber.toString());
    params.append("pageSize", pageSize.toString());

    const response = await api.get<
      ApiResponse<PaginatedResponse<TourInstanceVm>>
    >(`${API_ENDPOINTS.TOUR_INSTANCE.GET_ALL}?${params.toString()}`);
    return extractResult<PaginatedResponse<TourInstanceVm>>(response.data);
  },

  getInstanceDetail: async (id: string) => {
    const response = await api.get<ApiResponse<TourInstanceDto>>(
      API_ENDPOINTS.TOUR_INSTANCE.GET_DETAIL(id),
    );
    return extractResult<TourInstanceDto>(response.data);
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<TourInstanceStats>>(
      `${API_ENDPOINTS.TOUR_INSTANCE.GET_ALL}stats`,
    );
    return extractResult<TourInstanceStats>(response.data);
  },

  createInstance: async (data: {
    tourId: string;
    classificationId: string;
    instanceType: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
  }) => {
    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.TOUR_INSTANCE.CREATE,
      data,
    );
    return extractResult<string>(response.data);
  },

  updateInstance: async (
    id: string,
    data: {
      startDate: string;
      endDate: string;
      maxParticipants: number;
      instanceType: string;
    },
  ) => {
    const response = await api.put<ApiResponse<string>>(
      API_ENDPOINTS.TOUR_INSTANCE.UPDATE(id),
      data,
    );
    return extractResult<string>(response.data);
  },

  deleteInstance: async (id: string) => {
    const response = await api.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR_INSTANCE.DELETE(id),
    );
    return extractResult<unknown>(response.data);
  },

  changeStatus: async (id: string, status: string) => {
    const response = await api.put<ApiResponse<string>>(
      `${API_ENDPOINTS.TOUR_INSTANCE.GET_ALL}${id}/status`,
      { id, newStatus: status },
    );
    return extractResult<string>(response.data);
  },
};
