import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { adminService, AdminBooking } from "../adminService";

vi.mock("@/api/axiosInstance", () => {
  return {
    api: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("adminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOverview", () => {
    it("returns overview extracted from result", async () => {
      const mockOverview = {
        totalBookings: 150,
        totalRevenue: 50000000,
        pendingBookings: 12,
        confirmedBookings: 138,
      };
      vi.mocked(api.get).mockResolvedValue({
        data: { success: true, result: mockOverview },
      } as never);

      const result = await adminService.getOverview();

      expect(result).toEqual(mockOverview);
      expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.GET_OVERVIEW);
    });

    it("returns overview extracted from data field", async () => {
      const mockOverview = {
        totalBookings: 150,
        totalRevenue: 50000000,
        pendingBookings: 12,
        confirmedBookings: 138,
      };
      vi.mocked(api.get).mockResolvedValue({
        data: { success: true, data: mockOverview },
      } as never);

      const result = await adminService.getOverview();

      expect(result).toEqual(mockOverview);
    });

    it("returns null when response has no result or data", async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {},
      } as never);

      const result = await adminService.getOverview();

      expect(result).toBeNull();
    });

    it("returns null when response is null", async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: null,
      } as never);

      const result = await adminService.getOverview();

      expect(result).toBeNull();
    });
  });

  describe("getDashboard", () => {
    it("returns dashboard data extracted from result", async () => {
      const mockDashboard = {
        revenueByDay: [{ date: "2026-03-01", amount: 5000000 }],
        bookingsByStatus: { Confirmed: 50, Pending: 10, Cancelled: 5 },
        topTours: [{ tourName: "Ha Long Bay", count: 25 }],
      };
      vi.mocked(api.get).mockResolvedValue({
        data: { success: true, result: mockDashboard },
      } as never);

      const result = await adminService.getDashboard();

      expect(result).toEqual(mockDashboard);
      expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.ADMIN.GET_DASHBOARD);
    });

    it("returns dashboard data extracted from data field", async () => {
      const mockDashboard = {
        revenueByDay: [],
        bookingsByStatus: {},
        topTours: [],
      };
      vi.mocked(api.get).mockResolvedValue({
        data: { success: true, data: mockDashboard },
      } as never);

      const result = await adminService.getDashboard();

      expect(result).toEqual(mockDashboard);
    });

    it("returns null when response has no result or data", async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { success: false },
      } as never);

      const result = await adminService.getDashboard();

      expect(result).toBeNull();
    });
  });

  describe("getBookings", () => {
    it("returns bookings extracted from items.items", async () => {
      const mockBookings: AdminBooking[] = [
        { id: "bk-1", customerName: "John Doe", tourName: "Ha Long Bay", departureDate: "2026-04-01", amount: 1500000, status: "Confirmed" },
        { id: "bk-2", customerName: "Jane Doe", tourName: "Sapa Adventure", departureDate: "2026-04-10", amount: 2000000, status: "Pending" },
      ];
      vi.mocked(api.get).mockResolvedValue({
        data: { items: mockBookings },
      } as never);

      const result = await adminService.getBookings();

      expect(result).toEqual(mockBookings);
      expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKING.GET_LIST);
    });

    it("returns bookings using customer and tour fields", async () => {
      const mockBookings: AdminBooking[] = [
        { id: "bk-3", customer: "Alice", tour: "Mekong Delta", departure: "2026-05-01", amount: 1200000, status: "Confirmed" },
      ];
      vi.mocked(api.get).mockResolvedValue({
        data: { items: mockBookings },
      } as never);

      const result = await adminService.getBookings();

      expect(result).toEqual(mockBookings);
    });

    it("returns empty array when items is missing", async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {},
      } as never);

      const result = await adminService.getBookings();

      expect(result).toEqual([]);
    });

    it("returns empty array when items is not an array", async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { items: "not an array" },
      } as never);

      const result = await adminService.getBookings();

      expect(result).toEqual([]);
    });

    it("returns empty array when items is null", async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { items: null },
      } as never);

      const result = await adminService.getBookings();

      expect(result).toEqual([]);
    });
  });
});
