import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "../../api/axiosInstance";
import { customTourRequestService } from "../customTourRequestService";

vi.mock("../../api/axiosInstance", () => {
  return {
    api: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
    },
  };
});

describe("customTourRequestService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits custom tour request and returns normalized response", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        result: {
          id: "req-1",
          requestCode: "CTR-1001",
          destination: "Kyoto",
          startDate: "2026-08-10",
          endDate: "2026-08-15",
          numberOfParticipants: 3,
          budgetPerPersonUsd: 1800,
          travelInterests: ["culture_history"],
          status: "Pending",
        },
      },
    } as never);

    const result = await customTourRequestService.submitPublicRequest({
      destination: "Kyoto",
      startDate: "2026-08-10",
      endDate: "2026-08-15",
      numberOfParticipants: 3,
      budgetPerPersonUsd: 1800,
      travelInterests: ["culture_history"],
      preferredAccommodation: null,
      transportationPreference: null,
      specialRequests: null,
    });

    expect(result.success).toBe(true);
    expect(result.data?.requestCode).toBe("CTR-1001");
    expect(result.data?.status).toBe("pending");
  });

  it("supports admin review action", async () => {
    vi.mocked(api.patch).mockResolvedValue({
      data: {
        result: {
          id: "req-1",
          requestCode: "CTR-1001",
          status: "Approved",
        },
      },
    } as never);

    const result = await customTourRequestService.reviewRequest("req-1", {
      decision: "approved",
      adminNote: "Looks good",
    });

    expect(vi.mocked(api.patch)).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.data?.status).toBe("approved");
  });

  it("normalizes API errors for submit flow", async () => {
    vi.mocked(api.post).mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          errors: [
            {
              code: "INVALID_DATE_RANGE",
              errorMessage: "INVALID_DATE_RANGE",
            },
          ],
        },
      },
    });

    const result = await customTourRequestService.submitPublicRequest({
      destination: "Nha Trang",
      startDate: "2026-09-15",
      endDate: "2026-09-12",
      numberOfParticipants: 2,
      budgetPerPersonUsd: 900,
      travelInterests: [],
      preferredAccommodation: null,
      transportationPreference: null,
      specialRequests: null,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("INVALID_DATE_RANGE");
  });
});
