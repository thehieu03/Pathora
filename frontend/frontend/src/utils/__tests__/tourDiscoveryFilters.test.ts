import { describe, expect, it } from "vitest";

import {
  areTourDiscoveryFiltersEqual,
  buildTourDiscoverySearchParams,
  parseTourDiscoveryFilters,
} from "../tourDiscoveryFilters";

describe("tourDiscoveryFilters", () => {
  it("hydrates filters from query params", () => {
    const params = new URLSearchParams(
      "destination=Da%20Nang&classification=VIP&date=2026-05-01&people=4&minPrice=2000000&maxPrice=5000000&minDays=4&maxDays=7&page=3&view=instances",
    );

    const parsed = parseTourDiscoveryFilters(params);

    expect(parsed).toEqual({
      destination: "Da Nang",
      classification: "VIP",
      date: "2026-05-01",
      people: 4,
      minPrice: 2000000,
      maxPrice: 5000000,
      minDays: 4,
      maxDays: 7,
      page: 3,
      view: "instances",
    });
  });

  it("uses scheduled tab as instances fallback", () => {
    const params = new URLSearchParams("tab=scheduled");

    const parsed = parseTourDiscoveryFilters(params);

    expect(parsed.view).toBe("instances");
  });

  it("serializes applied filters for URL sync", () => {
    const params = buildTourDiscoverySearchParams({
      destination: "Ha Noi",
      classification: "Premium Tour",
      date: "",
      people: 2,
      minPrice: 1000000,
      maxPrice: 3000000,
      minDays: 1,
      maxDays: 3,
      page: 2,
      view: "tours",
    });

    expect(params.toString()).toBe(
      "destination=Ha+Noi&classification=Premium+Tour&people=2&minPrice=1000000&maxPrice=3000000&minDays=1&maxDays=3&page=2",
    );
  });

  it("detects equality for pagination-preserving sync", () => {
    const a = parseTourDiscoveryFilters(
      new URLSearchParams("destination=Hue&page=2"),
    );
    const b = parseTourDiscoveryFilters(
      new URLSearchParams("destination=Hue&page=2"),
    );

    expect(areTourDiscoveryFiltersEqual(a, b)).toBe(true);
  });
});
