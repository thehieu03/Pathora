import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  ApiResponse,
  FeaturedTour,
  FeaturedTourResponse,
  HomeStats,
  LatestTourResponse,
  LatestTour,
  SearchTour,
  TrendingDestinationResponse,
  TrendingDestination,
  TopAttractionResponse,
  TopAttraction,
  HomeStatsResponse,
  TopReviewResponse,
  TopReview,
  SearchTourResponse,
} from "@/types/home";
import { TourInstanceVm, PaginatedResponse } from "@/types/tour";
import { extractItems, extractResult } from "@/utils/apiResponse";

export const homeService = {
  getFeaturedTours: async (limit = 8) => {
    const response = await api.get<FeaturedTourResponse>(
      API_ENDPOINTS.PUBLIC_HOME.GET_FEATURED_TOURS(limit)
    );
    return extractItems<FeaturedTour>(response.data);
  },

  getLatestTours: async (limit = 6) => {
    const response = await api.get<LatestTourResponse>(
      API_ENDPOINTS.PUBLIC_HOME.GET_LATEST_TOURS(limit)
    );
    return extractItems<LatestTour>(response.data);
  },

  getTrendingDestinations: async (limit = 6) => {
    const response = await api.get<TrendingDestinationResponse>(
      API_ENDPOINTS.PUBLIC_HOME.GET_TRENDING_DESTINATIONS(limit)
    );
    return extractItems<TrendingDestination>(response.data);
  },

  getTopAttractions: async (limit = 8) => {
    const response = await api.get<TopAttractionResponse>(
      API_ENDPOINTS.PUBLIC_HOME.GET_TOP_ATTRACTIONS(limit)
    );
    return extractItems<TopAttraction>(response.data);
  },

  getHomeStats: async () => {
    const response = await api.get<HomeStatsResponse>(
      API_ENDPOINTS.PUBLIC_HOME.GET_HOME_STATS
    );
    return extractResult<HomeStats>(response.data);
  },

  getTopReviews: async (limit = 6) => {
    const response = await api.get<TopReviewResponse>(
      API_ENDPOINTS.PUBLIC_HOME.GET_TOP_REVIEWS(limit)
    );
    return extractItems<TopReview>(response.data);
  },

  searchTours: async (params?: {
    destination?: string;
    classification?: string;
    date?: string;
    people?: number;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await api.get<SearchTourResponse>(
      API_ENDPOINTS.PUBLIC_HOME.SEARCH_TOURS(params)
    );
    return extractResult<{ total: number; data: SearchTour[] }>(response.data);
  },

  getDestinations: async () => {
    const response = await api.get<ApiResponse<string[]>>(
      API_ENDPOINTS.PUBLIC_HOME.GET_DESTINATIONS
    );
    return extractItems<string>(response.data);
  },

  getAvailablePublicInstances: async (
    destination?: string,
    page = 1,
    pageSize = 6,
  ) => {
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await api.get<
      ApiResponse<PaginatedResponse<TourInstanceVm>>
    >(`${API_ENDPOINTS.PUBLIC_TOUR_INSTANCE.GET_AVAILABLE}?${params.toString()}`);
    return extractResult<PaginatedResponse<TourInstanceVm>>(response.data);
  },

  getPublicInstanceDetail: async (id: string) => {
    const response = await api.get<ApiResponse<TourInstanceVm>>(
      API_ENDPOINTS.PUBLIC_TOUR_INSTANCE.GET_DETAIL(id)
    );
    return extractResult<TourInstanceVm>(response.data);
  },
};
