"use client";

import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { normalizeLanguageForApi } from "@/api/languageHeader";
import {
  DynamicPricingDto,
  PaginatedResponse,
  SearchTourVm,
  TourClassificationDto,
  TourDto,
  TourVm,
} from "@/types/tour";
import { extractResult } from "@/utils/apiResponse";
import { ApiResponse } from "@/types/home";

// ── Normalizers ──────────────────────────────────────────────────────────────

const normalizeClassification = (
  classification: TourClassificationDto,
): TourClassificationDto => {
  const derivedPrice = classification.price ?? classification.adultPrice ?? 0;
  const derivedSalePrice = classification.salePrice ?? derivedPrice;
  const durationDays =
    classification.durationDays ?? classification.numberOfDay ?? 0;

  return {
    ...classification,
    price: derivedPrice,
    salePrice: derivedSalePrice,
    durationDays,
    dynamicPricing: classification.dynamicPricing ?? [],
  };
};

const normalizeTourDetail = (tour: TourDto): TourDto => {
  return {
    ...tour,
    classifications: (tour.classifications ?? []).map(normalizeClassification),
  };
};

// ── Service ──────────────────────────────────────────────────────────────────

export const adminTourService = {
  /**
   * Fetch paginated list of tours for admin.
   */
  getAllTours: async (
    params?: {
      searchText?: string;
      page?: number;
      pageSize?: number;
      status?: string;
      language?: string;
    },
  ): Promise<{ total: number; data: TourVm[] }> => {
    const normalizedLanguage = normalizeLanguageForApi(params?.language);

    const sp = new URLSearchParams();
    if (params?.searchText) sp.set("searchText", params.searchText);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
    if (params?.status) sp.set("status", params.status);
    if (normalizedLanguage) sp.set("lang", normalizedLanguage);
    const qs = sp.toString();

    const url = `${API_ENDPOINTS.TOUR.GET_ALL({
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      lang: normalizedLanguage,
    })}${params?.searchText ? `&searchText=${encodeURIComponent(params.searchText)}` : ""}${
      params?.status ? `&status=${encodeURIComponent(params.status)}` : ""
    }`;

    // Try admin endpoint first, fall back to public
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<TourVm>>>(
        API_ENDPOINTS.TOUR.GET_ALL({
          searchText: params?.searchText,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
          lang: normalizedLanguage,
        }),
      );
      const result = extractResult<PaginatedResponse<TourVm>>(response.data);
      return {
        total: result?.total ?? 0,
        data: result?.data ?? [],
      };
    } catch {
      // Fallback to public endpoint for list view
      const publicResponse = await api.get<
        ApiResponse<PaginatedResponse<SearchTourVm>>
      >(
        API_ENDPOINTS.PUBLIC_HOME.GET_ALL_TOURS({
          searchText: params?.searchText,
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
          lang: normalizedLanguage,
        }),
      );
      const publicResult =
        extractResult<PaginatedResponse<SearchTourVm>>(publicResponse.data);
      return {
        total: publicResult?.total ?? 0,
        data:
          (publicResult?.data ?? []).map((t) => ({
            id: t.id,
            tourCode: t.tourCode ?? "",
            tourName: t.tourName,
            shortDescription: t.shortDescription ?? "",
            status: t.status ?? "Active",
            thumbnail: t.thumbnail
              ? { fileId: null, originalFileName: null, fileName: null, publicURL: t.thumbnail }
              : null,
            createdOnUtc: t.createdOnUtc ?? "",
          })) ?? [],
      };
    }
  },

  /**
   * Fetch full tour detail by ID (includes all classifications, plans, etc.).
   */
  getTourDetail: async (id: string): Promise<TourDto | null> => {
    const response = await api.get<ApiResponse<TourDto>>(
      API_ENDPOINTS.TOUR.GET_DETAIL(id),
    );
    const result = extractResult<TourDto>(response.data);
    return result ? normalizeTourDetail(result) : null;
  },

  /**
   * Create a new tour from FormData (multipart).
   */
  createTour: async (formData: FormData): Promise<string | null> => {
    const response = await api.post<ApiResponse<string>>(
      API_ENDPOINTS.TOUR.CREATE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return extractResult<string>(response.data);
  },

  /**
   * Update an existing tour from FormData (multipart).
   */
  updateTour: async (formData: FormData): Promise<unknown> => {
    const response = await api.put<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR.UPDATE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return extractResult<unknown>(response.data);
  },

  /**
   * Delete a tour by ID.
   */
  deleteTour: async (id: string): Promise<unknown> => {
    const response = await api.delete<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR.DELETE(id),
    );
    return extractResult<unknown>(response.data);
  },

  /**
   * Toggle tour active/inactive status.
   */
  toggleTourStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<unknown> => {
    const response = await api.patch<ApiResponse<unknown>>(
      `${API_ENDPOINTS.TOUR.GET_DETAIL(id)}/status`,
      { isActive },
    );
    return extractResult<unknown>(response.data);
  },

  /**
   * Get dynamic pricing tiers for a classification.
   */
  getClassificationPricingTiers: async (
    classificationId: string,
  ): Promise<DynamicPricingDto[]> => {
    const response = await api.get<ApiResponse<DynamicPricingDto[]>>(
      API_ENDPOINTS.TOUR.GET_CLASSIFICATION_PRICING_TIERS(classificationId),
    );
    return extractResult<DynamicPricingDto[]>(response.data) ?? [];
  },

  /**
   * Upsert (replace) dynamic pricing tiers for a classification.
   */
  upsertClassificationPricingTiers: async (
    classificationId: string,
    tiers: DynamicPricingDto[],
  ): Promise<unknown> => {
    const response = await api.put<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR.UPSERT_CLASSIFICATION_PRICING_TIERS(classificationId),
      tiers,
    );
    return extractResult<unknown>(response.data);
  },
};
