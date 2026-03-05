import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { TourDto, TourVm, PaginatedResponse } from "@/types/tour";
import { extractResult, extractItems } from "@/utils/apiResponse";
import { ApiResponse } from "@/types/home";

export const tourService = {
  // Admin CRUD operations
  getAllTours: async (searchText?: string, pageNumber = 1, pageSize = 10) => {
    const params = new URLSearchParams();
    if (searchText) params.append("searchText", searchText);
    params.append("pageNumber", pageNumber.toString());
    params.append("pageSize", pageSize.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<TourVm>>>(
      `${API_ENDPOINTS.TOUR.GET_ALL}?${params.toString()}`,
    );
    return extractResult<PaginatedResponse<TourVm>>(response.data);
  },

  getTourDetail: async (id: string) => {
    const response = await api.get<ApiResponse<TourDto>>(
      API_ENDPOINTS.TOUR.GET_DETAIL(id),
    );
    return extractResult<TourDto>(response.data);
  },

  createTour: async (formData: FormData) => {
    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.TOUR.CREATE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return extractResult<string>(response.data);
  },

  updateTour: async (formData: FormData) => {
    const response = await api.put<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR.UPDATE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return extractResult<unknown>(response.data);
  },

  deleteTour: async (id: string) => {
    const response = await api.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR.DELETE(id),
    );
    return extractResult<unknown>(response.data);
  },

  // Public operations
  getPublicTourDetail: async (id: string) => {
    const response = await api.get<ApiResponse<TourDto>>(
      API_ENDPOINTS.PUBLIC_HOME.GET_TOUR_DETAIL(id),
    );
    return extractResult<TourDto>(response.data);
  },
};
