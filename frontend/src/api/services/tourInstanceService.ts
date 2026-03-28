import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ApiResponse } from "@/types/home";
import {
  DynamicPricingDto,
  DynamicPricingResolutionDto,
  NormalizedTourInstanceDto,
  NormalizedTourInstanceVm,
  PaginatedResponse,
  TourInstanceDto,
  TourInstanceStats,
  TourInstanceVm,
} from "@/types/tour";
import { extractResult } from "@/utils/apiResponse";

export interface CreateTourInstancePayload {
  tourId: string;
  classificationId: string;
  title: string;
  instanceType: number;
  startDate: string;
  endDate: string;
  maxParticipation: number;
  basePrice: number;
  location?: string;
  confirmationDeadline?: string;
  includedServices?: string[];
  guideUserIds?: string[];
  managerUserIds?: string[];
}

export interface UpdateTourInstancePayload {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  maxParticipation: number;
  basePrice: number;
  location?: string;
  confirmationDeadline?: string;
  includedServices?: string[];
  guideUserIds?: string[];
  managerUserIds?: string[];
  thumbnailUrl?: string | null;
  imageUrls?: string[];
}

const normalizeStatus = (status: string): string =>
  status.trim().toLowerCase().replace(/[\s_]+/g, "");

const normalizeStringArray = (values?: string[]): string[] =>
  (values ?? []).map((value) => value.trim()).filter(Boolean);

const normalizeInstanceVm = (item: TourInstanceVm): NormalizedTourInstanceVm => ({
  ...item,
  location: item.location ?? null,
  images: item.images ?? [],
  currentParticipation: item.currentParticipation ?? 0,
  maxParticipation: item.maxParticipation ?? 0,
  status: normalizeStatus(item.status),
  registeredParticipants: item.currentParticipation ?? 0,
});

const normalizeInstanceDetail = (
  item: TourInstanceDto,
): NormalizedTourInstanceDto => ({
  ...item,
  location: item.location ?? null,
  images: item.images ?? [],
  currentParticipation: item.currentParticipation ?? 0,
  maxParticipation: item.maxParticipation ?? 0,
  includedServices: item.includedServices ?? [],
  managers: item.managers ?? [],
  status: normalizeStatus(item.status),
  registeredParticipants: item.currentParticipation ?? 0,
});

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
    } as PaginatedResponse<NormalizedTourInstanceVm>;
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
      API_ENDPOINTS.TOUR_INSTANCE.GET_STATS,
    );
    return extractResult<TourInstanceStats>(response.data);
  },

  createInstance: async (data: CreateTourInstancePayload) => {
    const payload = {
      tourId: data.tourId,
      classificationId: data.classificationId,
      title: data.title.trim(),
      instanceType: data.instanceType,
      startDate: data.startDate,
      endDate: data.endDate,
      maxParticipation: data.maxParticipation,
      basePrice: data.basePrice,
      location: data.location?.trim() || null,
      confirmationDeadline: data.confirmationDeadline || null,
      includedServices: normalizeStringArray(data.includedServices),
      guideUserIds: data.guideUserIds ?? [],
      managerUserIds: data.managerUserIds ?? [],
    };

    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.TOUR_INSTANCE.CREATE,
      payload,
    );
    return extractResult<string>(response.data);
  },

  updateInstance: async (data: UpdateTourInstancePayload) => {
    const payload = {
      id: data.id,
      title: data.title.trim(),
      startDate: data.startDate,
      endDate: data.endDate,
      maxParticipation: data.maxParticipation,
      basePrice: data.basePrice,
      location: data.location?.trim() || null,
      confirmationDeadline: data.confirmationDeadline || null,
      includedServices: normalizeStringArray(data.includedServices),
      guideUserIds: data.guideUserIds ?? [],
      managerUserIds: data.managerUserIds ?? [],
      thumbnailUrl: data.thumbnailUrl?.trim() || null,
      imageUrls: normalizeStringArray(data.imageUrls),
    };

    const response = await api.put<ApiResponse<string>>(
      API_ENDPOINTS.TOUR_INSTANCE.UPDATE,
      payload,
    );
    return extractResult<string>(response.data);
  },

  deleteInstance: async (id: string) => {
    const response = await api.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR_INSTANCE.DELETE(id),
    );
    return extractResult<unknown>(response.data);
  },

  changeStatus: async (id: string, status: string | number) => {
    const response = await api.patch<ApiResponse<string>>(
      API_ENDPOINTS.TOUR_INSTANCE.CHANGE_STATUS(id),
      { status },
    );
    return extractResult<string>(response.data);
  },
};
