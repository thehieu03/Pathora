import { api } from "@/api/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  CustomTourRequest,
  CustomTourRequestPayload,
  CustomTourRequestReviewPayload,
  CustomTourRequestListFilters,
} from "@/types/customTourRequest";
import { executeApiRequest } from "./serviceExecutor";

export const customTourRequestService = {
  getMyRequests: (): Promise<ApiResponse<CustomTourRequest[]>> => {
    return executeApiRequest<CustomTourRequest[]>(() =>
      api.get("/api/custom-tour-requests/my-requests"),
    );
  },

  getMyRequestById: (id: string): Promise<ApiResponse<CustomTourRequest>> => {
    return executeApiRequest<CustomTourRequest>(() =>
      api.get(`/api/custom-tour-requests/my-requests/${id}`),
    );
  },

  getPublicRequestDetail: (id: string): Promise<ApiResponse<CustomTourRequest>> => {
    return executeApiRequest<CustomTourRequest>(() =>
      api.get(`/api/custom-tour-requests/${id}`),
    );
  },

  submitPublicRequest: (payload: CustomTourRequestPayload): Promise<ApiResponse<string>> => {
    return executeApiRequest<string>(() =>
      api.post("/api/custom-tour-requests", payload),
    );
  },

  create: (payload: CustomTourRequestPayload): Promise<ApiResponse<string>> => {
    return executeApiRequest<string>(() =>
      api.post("/api/custom-tour-requests", payload),
    );
  },

  getAdminRequests: (
    filters?: CustomTourRequestListFilters,
  ): Promise<ApiResponse<CustomTourRequest[]>> => {
    return executeApiRequest<CustomTourRequest[]>(() =>
      api.get("/api/custom-tour-requests/admin", { params: filters }),
    );
  },

  getAdminRequestById: (id: string): Promise<ApiResponse<CustomTourRequest>> => {
    return executeApiRequest<CustomTourRequest>(() =>
      api.get(`/api/custom-tour-requests/admin/${id}`),
    );
  },

  review: (
    id: string,
    payload: CustomTourRequestReviewPayload,
  ): Promise<ApiResponse<void>> => {
    return executeApiRequest<void>(() =>
      api.put(`/api/custom-tour-requests/admin/${id}/review`, payload),
    );
  },

  reviewRequest: (
    id: string,
    payload: CustomTourRequestReviewPayload,
  ): Promise<ApiResponse<void>> => {
    return executeApiRequest<void>(() =>
      api.put(`/api/custom-tour-requests/admin/${id}/review`, payload),
    );
  },
};
