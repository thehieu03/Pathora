import { api, API_ENDPOINTS } from "@/api";

const catalogEndpoints = API_ENDPOINTS.CATALOG;

export const catalogService = {
  getAllProducts: () => api.get(catalogEndpoints.GET_ALL_PRODUCTS),
};

export default catalogService;
