import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { normalizeLanguageForApi } from "@/api/languageHeader";
import {
  DynamicPricingDto,
  PaginatedResponse,
  TourClassificationDto,
  TourDto,
  TourVm,
  SearchTourVm,
} from "@/types/tour";
import { extractResult } from "@/utils/apiResponse";
import { ApiResponse } from "@/types/home";

const normalizeClassification = (
  classification: TourClassificationDto,
): TourClassificationDto => {
  const derivedPrice = classification.price ?? classification.adultPrice ?? 0;
  const derivedSalePrice =
    classification.salePrice ?? classification.childPrice ?? derivedPrice;
  const durationDays = classification.durationDays ?? classification.numberOfDay ?? 0;

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

const buildPublicTourDetailUrl = (id: string, language?: string) => {
  const baseUrl = API_ENDPOINTS.PUBLIC_HOME.GET_TOUR_DETAIL(id);
  if (!language) {
    return baseUrl;
  }

  const normalizedLanguage = normalizeLanguageForApi(language);
  return `${baseUrl}?lang=${normalizedLanguage}`;
};

export const tourService = {
  getAllTours: async (
    searchText?: string,
    pageNumber = 1,
    pageSize = 10,
    language?: string,
  ) => {
    const normalizedLanguage = normalizeLanguageForApi(language);
    const url = API_ENDPOINTS.PUBLIC_HOME.GET_ALL_TOURS({
      searchText,
      page: pageNumber,
      pageSize,
      lang: normalizedLanguage,
    });

    const response = await api.get<ApiResponse<PaginatedResponse<SearchTourVm>>>(url);
    const result = extractResult<PaginatedResponse<SearchTourVm>>(response.data);
    return {
      total: result?.total ?? 0,
      data: result?.data ?? [],
    };
  },

  getTourDetail: async (id: string) => {
    const response = await api.get<ApiResponse<TourDto>>(
      API_ENDPOINTS.TOUR.GET_DETAIL(id),
    );

    const result = extractResult<TourDto>(response.data);
    return result ? normalizeTourDetail(result) : null;
  },

  getClassificationPricingTiers: async (classificationId: string) => {
    const response = await api.get<ApiResponse<DynamicPricingDto[]>>(
      API_ENDPOINTS.TOUR.GET_CLASSIFICATION_PRICING_TIERS(classificationId),
    );

    return extractResult<DynamicPricingDto[]>(response.data) ?? [];
  },

  upsertClassificationPricingTiers: async (
    classificationId: string,
    tiers: DynamicPricingDto[],
  ) => {
    const response = await api.put<ApiResponse<unknown>>(
      API_ENDPOINTS.TOUR.UPSERT_CLASSIFICATION_PRICING_TIERS(classificationId),
      tiers,
    );

    return extractResult<unknown>(response.data);
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

  getPublicTourDetail: async (id: string, language?: string) => {
    const response = await api.get<ApiResponse<TourDto>>(
      buildPublicTourDetailUrl(id, language),
    );
    return extractResult<TourDto>(response.data);
  },
};
