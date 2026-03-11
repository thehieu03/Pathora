import { customTourRequestClient } from "../api/customTourRequestClient";
import type {
  CustomTourRequest,
  CustomTourRequestListFilters,
  CustomTourRequestPayload,
  CustomTourRequestReviewPayload,
} from "../types/customTourRequest";
import type { ApiResponse } from "../types/api";
import {
  normalizeCustomTourRequest,
  normalizeCustomTourRequestList,
} from "../utils/customTourRequest";
import { executeApiRequest } from "./serviceExecutor";

const INVALID_RESPONSE_ERROR = {
  code: "INVALID_RESPONSE",
  message: "INVALID_RESPONSE",
};

const toMappedEntityResponse = (
  response: ApiResponse<unknown>,
): ApiResponse<CustomTourRequest> => {
  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  const mapped = normalizeCustomTourRequest(response.data);
  if (!mapped) {
    return {
      success: false,
      error: INVALID_RESPONSE_ERROR,
    };
  }

  return {
    success: true,
    data: mapped,
  };
};

export const customTourRequestService = {
  submitPublicRequest: async (
    payload: CustomTourRequestPayload,
  ): Promise<ApiResponse<CustomTourRequest>> => {
    const response = await executeApiRequest<unknown>(() =>
      customTourRequestClient.createPublic(payload),
    );

    return toMappedEntityResponse(response);
  },

  getMyRequests: async (): Promise<ApiResponse<CustomTourRequest[]>> => {
    const response = await executeApiRequest<unknown>(() =>
      customTourRequestClient.getMy(),
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error,
      };
    }

    return {
      success: true,
      data: normalizeCustomTourRequestList(response.data),
    };
  },

  getPublicRequestDetail: async (
    id: string,
  ): Promise<ApiResponse<CustomTourRequest>> => {
    const response = await executeApiRequest<unknown>(() =>
      customTourRequestClient.getPublicDetail(id),
    );

    return toMappedEntityResponse(response);
  },

  getAdminRequests: async (
    filters?: CustomTourRequestListFilters,
  ): Promise<ApiResponse<CustomTourRequest[]>> => {
    const response = await executeApiRequest<unknown>(() =>
      customTourRequestClient.getAdminList(filters),
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error,
      };
    }

    return {
      success: true,
      data: normalizeCustomTourRequestList(response.data),
    };
  },

  reviewRequest: async (
    id: string,
    payload: CustomTourRequestReviewPayload,
  ): Promise<ApiResponse<CustomTourRequest>> => {
    const response = await executeApiRequest<unknown>(() =>
      customTourRequestClient.review(id, payload),
    );

    return toMappedEntityResponse(response);
  },
};
