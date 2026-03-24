import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { UserInfo } from "@/types/tour";
import { extractItems } from "@/utils/apiResponse";

export const userService = {
  getAll: async (textSearch?: string, pageNumber = 1, pageSize = 100) => {
    const params = new URLSearchParams();
    if (textSearch) params.append("textSearch", textSearch);
    params.append("pageNumber", pageNumber.toString());
    params.append("pageSize", pageSize.toString());

    const response = await api.get(`${API_ENDPOINTS.USER.GET_ALL}?${params.toString()}`);
    return extractItems<UserInfo>(response.data);
  },
};
