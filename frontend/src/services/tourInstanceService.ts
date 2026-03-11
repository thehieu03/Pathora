import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  DynamicPricingDto,
  DynamicPricingResolutionDto,
  PaginatedResponse,
  TourInstanceDto,
  TourInstanceStats,
  TourInstanceVm,
} from "@/types/tour";
import { extractResult } from "@/utils/apiResponse";
import { ApiResponse } from "@/types/home";

const normalizeInstanceVm = (item: TourInstanceVm): TourInstanceVm => {
  const registeredParticipants =
    item.registeredParticipants ?? item.currentParticipation ?? 0;
  const price = item.price ?? item.basePrice ?? 0;

  return {
    ...item,
    registeredParticipants,
    currentParticipation: item.currentParticipation ?? registeredParticipants,
    price,
    basePrice: item.basePrice ?? price,
    sellingPrice: item.sellingPrice ?? item.price ?? price,
  };
};

const normalizeInstanceDetail = (item: TourInstanceDto): TourInstanceDto => {
  const registeredParticipants =
    item.registeredParticipants ?? item.currentParticipation ?? 0;
  const basePrice = item.basePrice ?? item.price ?? 0;
  const sellingPrice = item.sellingPrice ?? item.salePrice ?? basePrice;

  return {
    ...item,
    registeredParticipants,
    currentParticipation: item.currentParticipation ?? registeredParticipants,
    price: item.price ?? basePrice,
    salePrice: item.salePrice ?? sellingPrice,
    basePrice,
    sellingPrice,
    operatingCost: item.operatingCost ?? 0,
    dynamicPricing: item.dynamicPricing ?? [],
    pricingResolution: item.pricingResolution ?? null,
  };
};

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

    const response = await api.get<ApiResponse<PaginatedResponse<TourInstanceVm>>>(
      `${API_ENDPOINTS.TOUR_INSTANCE.GET_ALL}?${params.toString()}`,
    );

    const result = extractResult<PaginatedResponse<TourInstanceVm>>(response.data);
    if (!result) return null;

    return {
      ...result,
      data: (result.data ?? []).map(normalizeInstanceVm),
    };
  },

  getInstanceDetail: async (id: string) => {
    const response = await api.get<ApiResponse<TourInstanceDto>>(
      API_ENDPOINTS.TOUR_INSTANCE.GET_DETAIL(id),
    );

    const result = extractResult<TourInstanceDto>(response.data);
    return result ? normalizeInstanceDetail(result) : null;
  },

  getPricingTiers: async (id: string) => {
    const response = await api.get<ApiResponse<DynamicPricingDto[]>>(
      API_ENDPOINTS.TOUR_INSTANCE.GET_PRICING_TIERS(id),
    );
    return extractResult<DynamicPricingDto[]>(response.data) ?? [];
  },

  upsertPricingTiers: async (id: string, tiers: DynamicPricingDto[]) => {
    const response = await api.put<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR_INSTANCE.UPSERT_PRICING_TIERS(id),
      tiers,
    );
    return extractResult<unknown>(response.data);
  },

  clearPricingTiers: async (id: string) => {
    const response = await api.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR_INSTANCE.CLEAR_PRICING_TIERS(id),
    );
    return extractResult<unknown>(response.data);
  },

  resolvePricing: async (
    id: string,
    participants: number,
    options?: { publicScope?: boolean },
  ) => {
    const endpoint = options?.publicScope
      ? API_ENDPOINTS.PUBLIC_TOUR_INSTANCE.RESOLVE_PRICING(id, participants)
      : API_ENDPOINTS.TOUR_INSTANCE.RESOLVE_PRICING(id, participants);

    const response = await api.get<ApiResponse<DynamicPricingResolutionDto>>(
      endpoint,
    );

    return extractResult<DynamicPricingResolutionDto>(response.data);
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
