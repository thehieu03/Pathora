import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ApiResponse } from "@/types/home";
import {
  DynamicPricingDto,
  DynamicPricingResolutionDto,
  ImageDto,
  NormalizedTourInstanceDto,
  NormalizedTourInstanceVm,
  PaginatedResponse,
  TourInstanceDto,
  TourInstanceGuideDto,
  TourInstanceStats,
  TourInstanceVm,
} from "@/types/tour";
import { extractResult } from "@/utils/apiResponse";

interface BaseTourInstancePayload {
  title: string;
  startDate: string;
  endDate: string;
  minParticipation: number;
  maxParticipation: number;
  basePrice: number;
  sellingPrice: number;
  operatingCost: number;
  depositPerPerson: number;
  location?: string;
  confirmationDeadline?: string;
  includedServices?: string[];
  guide?: TourInstanceGuideDto;
  dynamicPricing?: DynamicPricingDto[];
  thumbnail?: ImageDto | null;
  images?: ImageDto[];
}

export interface CreateTourInstancePayload extends BaseTourInstancePayload {
  tourId: string;
  classificationId: string;
  instanceType: string | number;
}

export interface UpdateTourInstancePayload extends BaseTourInstancePayload {
  id: string;
}

const normalizeStatus = (status: string): string =>
  status.trim().toLowerCase().replace(/[\s_]+/g, "");

const normalizeStringArray = (values?: string[]): string[] =>
  (values ?? []).map((value) => value.trim()).filter(Boolean);

const normalizeGuide = (
  guide?: TourInstanceGuideDto,
): TourInstanceGuideDto | undefined => {
  if (!guide) {
    return undefined;
  }

  const name = guide.name?.trim();
  if (!name) {
    return undefined;
  }

  return {
    name,
    avatarUrl: guide.avatarUrl?.trim() || null,
    languages: normalizeStringArray(guide.languages),
    experience: guide.experience?.trim() || null,
  };
};

const stripOptionalFields = <T extends Record<string, unknown>>(payload: T): T =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return true;
    }),
  ) as T;

const normalizeInstanceVm = (item: TourInstanceVm): NormalizedTourInstanceVm => {
  const registeredParticipants = item.currentParticipation ?? 0;
  const price = item.basePrice ?? item.sellingPrice ?? 0;

  return {
    ...item,
    location: item.location ?? null,
    images: item.images ?? [],
    currentParticipation: registeredParticipants,
    basePrice: item.basePrice ?? price,
    sellingPrice: item.sellingPrice ?? price,
    depositPerPerson: item.depositPerPerson ?? 0,
    status: normalizeStatus(item.status),
    registeredParticipants,
    price,
  };
};

const normalizeInstanceDetail = (
  item: TourInstanceDto,
): NormalizedTourInstanceDto => {
  const registeredParticipants = item.currentParticipation ?? 0;
  const basePrice = item.basePrice ?? 0;
  const sellingPrice = item.sellingPrice ?? basePrice;

  return {
    ...item,
    location: item.location ?? null,
    images: item.images ?? [],
    currentParticipation: registeredParticipants,
    maxParticipation: item.maxParticipation ?? 0,
    minParticipation: item.minParticipation ?? 0,
    basePrice,
    sellingPrice,
    operatingCost: item.operatingCost ?? 0,
    depositPerPerson: item.depositPerPerson ?? 0,
    includedServices: item.includedServices ?? [],
    dynamicPricing: item.dynamicPricing ?? [],
    guide: item.guide
      ? {
          ...item.guide,
          languages: item.guide.languages ?? [],
          experience: item.guide.experience ?? null,
        }
      : null,
    status: normalizeStatus(item.status),
    registeredParticipants,
    price: basePrice,
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
    const payload = stripOptionalFields({
      ...data,
      location: data.location?.trim(),
      confirmationDeadline: data.confirmationDeadline || undefined,
      includedServices: normalizeStringArray(data.includedServices),
      guide: normalizeGuide(data.guide),
      dynamicPricing:
        data.dynamicPricing && data.dynamicPricing.length > 0
          ? data.dynamicPricing
          : undefined,
      thumbnail: data.thumbnail ?? undefined,
      images: data.images && data.images.length > 0 ? data.images : undefined,
    });

    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.TOUR_INSTANCE.CREATE,
      payload,
    );
    return extractResult<string>(response.data);
  },

  updateInstance: async (data: UpdateTourInstancePayload) => {
    const payload = stripOptionalFields({
      ...data,
      location: data.location?.trim(),
      confirmationDeadline: data.confirmationDeadline || undefined,
      includedServices: normalizeStringArray(data.includedServices),
      guide: normalizeGuide(data.guide),
      dynamicPricing:
        data.dynamicPricing && data.dynamicPricing.length > 0
          ? data.dynamicPricing
          : undefined,
      thumbnail: data.thumbnail ?? undefined,
      images: data.images && data.images.length > 0 ? data.images : undefined,
    });

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
