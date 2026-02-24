import { api, API_ENDPOINTS } from "@/api";

const notificationEndpoints = API_ENDPOINTS.NOTIFICATION;

export const notificationService = {
  getAll: () => api.get(notificationEndpoints.GET_ALL),
  getTop10Unread: () => api.get(notificationEndpoints.GET_TOP_10_UNREAD),
  getUnreadCount: () => api.get(notificationEndpoints.GET_COUNT_UNREAD),
  markAsRead: (ids: string[]) =>
    api.patch(notificationEndpoints.MARK_AS_READ, { ids }),
};

export default notificationService;
