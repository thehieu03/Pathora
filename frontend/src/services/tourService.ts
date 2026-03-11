import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  DynamicPricingDto,
  PaginatedResponse,
  TourClassificationDto,
  TourDto,
  TourVm,
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

export const tourService = {
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

  getPublicTourDetail: async (id: string) => {
    const response = await api.get<ApiResponse<TourDto>>(
      API_ENDPOINTS.PUBLIC_HOME.GET_TOUR_DETAIL(id),
    );
    return extractResult<TourDto>(response.data);
  },
};
