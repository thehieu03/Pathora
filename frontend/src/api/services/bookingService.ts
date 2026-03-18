import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface RecentBooking {
  bookingId: string;
  tourName: string;
  departureDate: string;
  status: string;
  totalPrice: number;
  totalParticipants: number;
}

export const bookingService = {
  getRecentBookings: async (count = 3): Promise<RecentBooking[]> => {
    const response = await api.get(API_ENDPOINTS.BOOKING.GET_MY_RECENT, {
      params: { count },
    });
    return response.data.data ?? [];
  },
};
