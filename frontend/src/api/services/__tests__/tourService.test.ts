import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AxiosInstance } from "axios";

import { normalizeTourListResponse, normalizeTourStatus, mapTourVmToSearchTour } from "../tourMappers";

describe("normalizeTourListResponse", () => {

  // =========================================================================
  // normalizeTourListResponse tests
  // =========================================================================

  it("normalizes list payload into canonical tour model", async () => {
    const result = normalizeTourListResponse({
      total: 1,
      data: [
        {
          id: "tour-1",
          tourCode: "TOUR-001",
          tourName: "Da Nang",
          shortDescription: null,
          status: "archived",
          thumbnail: {
            fileId: "thumb-1",
            originalFileName: "thumb.jpg",
            fileName: "thumb.jpg",
            publicURL: " https://cdn.pathora.test/thumb.jpg ",
          },
          createdOnUtc: "2026-03-12T10:00:00Z",
        },
      ],
    });

    expect(result.data[0]).toEqual({
      id: "tour-1",
      tourCode: "TOUR-001",
      tourName: "Da Nang",
      shortDescription: "",
      status: "Unknown",
      thumbnail: {
        fileId: "thumb-1",
        originalFileName: "thumb.jpg",
        fileName: "thumb.jpg",
        publicURL: "https://cdn.pathora.test/thumb.jpg",
      },
      createdOnUtc: "2026-03-12T10:00:00Z",
    });
  });
});

describe("normalizeTourStatus", () => {
  // TC-FE01: Normal case - valid known status
  it("normalizes known lowercase status to title case", () => {
    expect(normalizeTourStatus("active")).toBe("Active");
    expect(normalizeTourStatus("pending")).toBe("Pending");
    expect(normalizeTourStatus("draft")).toBe("Draft");
    expect(normalizeTourStatus("inactive")).toBe("Inactive");
    expect(normalizeTourStatus("rejected")).toBe("Rejected");
  });

  // TC-FE02: Case insensitivity - uppercase and mixed case
  it("handles uppercase and mixed case status strings", () => {
    expect(normalizeTourStatus("ACTIVE")).toBe("Active");
    expect(normalizeTourStatus("Pending")).toBe("Pending");
    expect(normalizeTourStatus("  ACTIVE  ")).toBe("Active");
  });

  // TC-FE03: Unknown/edge case - unknown status maps to "Unknown"
  it("returns Unknown for unrecognized status", () => {
    expect(normalizeTourStatus("archived")).toBe("Unknown");
    expect(normalizeTourStatus("published")).toBe("Unknown");
    expect(normalizeTourStatus("")).toBe("Unknown");
    expect(normalizeTourStatus(null)).toBe("Unknown");
    expect(normalizeTourStatus(undefined)).toBe("Unknown");
    expect(normalizeTourStatus("  ")).toBe("Unknown");
  });
});

describe("mapTourVmToSearchTour", () => {
  // TC-FE04: Normal case - maps all available fields
  it("maps TourVm fields to SearchTour correctly", () => {
    const tourVm = {
      id: "tour-1",
      tourCode: "TOUR-001",
      tourName: "Da Nang Beach Tour",
      shortDescription: "Beach vacation",
      status: "active",
      thumbnail: {
        fileId: "thumb-1",
        originalFileName: "thumb.jpg",
        fileName: "thumb.jpg",
        publicURL: "https://cdn.example.com/thumb.jpg",
      },
      createdOnUtc: "2026-03-23T10:00:00Z",
    };

    const result = mapTourVmToSearchTour(tourVm);

    expect(result.id).toBe("tour-1");
    expect(result.tourName).toBe("Da Nang Beach Tour");
    expect(result.thumbnail).toBe("https://cdn.example.com/thumb.jpg");
    expect(result.shortDescription).toBe("Beach vacation");
    // Fields not in TourVm default to null/0
    expect(result.location).toBeNull();
    expect(result.durationDays).toBe(0);
    expect(result.price).toBe(0);
    expect(result.salePrice).toBe(0);
    expect(result.classificationName).toBeNull();
    expect(result.rating).toBeNull();
  });

  // TC-FE05: Edge case - null thumbnail maps to null URL
  it("handles null thumbnail by mapping to null URL", () => {
    const tourVm = {
      id: "tour-1",
      tourCode: "TOUR-001",
      tourName: "Tour",
      shortDescription: "",
      status: "active",
      thumbnail: null,
      createdOnUtc: "2026-03-23T10:00:00Z",
    };

    const result = mapTourVmToSearchTour(tourVm);

    expect(result.thumbnail).toBeNull();
  });
});
