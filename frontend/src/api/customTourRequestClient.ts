import type { AxiosResponse } from "axios";

import { API_ENDPOINTS } from "./endpoints";
import { api } from "./axiosInstance";
import type {
  CustomTourRequestListFilters,
  CustomTourRequestPayload,
  CustomTourRequestReviewPayload,
} from "../types/customTourRequest";

const buildAdminFiltersQuery = (filters?: CustomTourRequestListFilters): string => {
  const params = new URLSearchParams();

  if (!filters) {
    return "";
  }

  if (filters.keyword) {
    params.append("keyword", filters.keyword);
  }

  if (filters.status && filters.status !== "all") {
    params.append("status", filters.status);
  }

  if (filters.fromDate) {
    params.append("fromDate", filters.fromDate);
  }

  if (filters.toDate) {
    params.append("toDate", filters.toDate);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const customTourRequestClient = {
  createPublic: (payload: CustomTourRequestPayload): Promise<AxiosResponse<unknown>> => {
    return api.post(API_ENDPOINTS.PUBLIC_TOUR_REQUEST.CREATE, payload);
  },

  getMy: (): Promise<AxiosResponse<unknown>> => {
    return api.get(API_ENDPOINTS.PUBLIC_TOUR_REQUEST.GET_MY);
  },

  getPublicDetail: (id: string): Promise<AxiosResponse<unknown>> => {
    return api.get(API_ENDPOINTS.PUBLIC_TOUR_REQUEST.GET_DETAIL(id));
  },

  getAdminList: (filters?: CustomTourRequestListFilters): Promise<AxiosResponse<unknown>> => {
    const query = buildAdminFiltersQuery(filters);
    return api.get(`${API_ENDPOINTS.TOUR_REQUEST.GET_ALL}${query}`);
  },

  review: (
    id: string,
    payload: CustomTourRequestReviewPayload,
  ): Promise<AxiosResponse<unknown>> => {
    return api.patch(API_ENDPOINTS.TOUR_REQUEST.REVIEW(id), payload);
  },
};
