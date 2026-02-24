import { api, API_ENDPOINTS } from "@/api";

const inventoryEndpoints = API_ENDPOINTS.INVENTORY;

export const inventoryService = {
  getAllInventoryItems: () => api.get(inventoryEndpoints.GET_ALL),
  getHistories: () => api.get(inventoryEndpoints.GET_HISTORIES),
  getAllReservations: () => api.get(inventoryEndpoints.GET_ALL_RESERVATIONS),
  getLocations: () => api.get(inventoryEndpoints.GET_LOCATIONS),
  createInventoryItem: (payload: unknown) =>
    api.post(inventoryEndpoints.CREATE, payload),
  updateInventoryItem: (id: string, payload: unknown) =>
    api.put(inventoryEndpoints.UPDATE(id), payload),
  deleteInventoryItem: (id: string) =>
    api.delete(inventoryEndpoints.DELETE(id)),
  increaseStock: (id: string, payload: unknown) =>
    api.put(inventoryEndpoints.INCREASE_STOCK(id), payload),
  decreaseStock: (id: string, payload: unknown) =>
    api.put(inventoryEndpoints.DECREASE_STOCK(id), payload),
};

export default inventoryService;
