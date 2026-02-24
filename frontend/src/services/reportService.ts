import { api, API_ENDPOINTS } from "@/api";

const reportEndpoints = API_ENDPOINTS.REPORT;

export const reportService = {
  getDashboardStatistics: async () => {
    const response = await api.get(reportEndpoints.DASHBOARD_STATISTICS);
    return response.data;
  },
  getOrderGrowthStatistics: async () => {
    const response = await api.get(reportEndpoints.ORDER_GROWTH_LINE_CHART);
    return response.data;
  },
  getTopProductStatistics: async () => {
    const response = await api.get(reportEndpoints.TOP_PRODUCT_PIE_CHART);
    return response.data;
  },
};

export default reportService;
