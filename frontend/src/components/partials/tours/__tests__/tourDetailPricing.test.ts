import { describe, expect, it } from "vitest";

import {
  getAdultPrice,
  getChildPrice,
  getClassificationDays,
  getClassificationNights,
  getInfantPrice,
  getOriginalPackagePrice,
} from "../tourDetailPricing";

describe("tourDetailPricing helpers", () => {
  it("prefers new backend pricing and duration fields", () => {
    const classification = {
      adultPrice: 3500000,
      childPrice: 2800000,
      infantPrice: 100000,
      numberOfDay: 3,
      numberOfNight: 2,
      price: 0,
      salePrice: 0,
      durationDays: 0,
    };

    expect(getAdultPrice(classification)).toBe(3500000);
    expect(getChildPrice(classification)).toBe(2800000);
    expect(getInfantPrice(classification)).toBe(100000);
    expect(getClassificationDays(classification)).toBe(3);
    expect(getClassificationNights(classification)).toBe(2);
  });

  it("falls back to legacy fields when new fields are absent", () => {
    const classification = {
      price: 3200000,
      salePrice: 2800000,
      durationDays: 4,
    };

    expect(getAdultPrice(classification)).toBe(2800000);
    expect(getChildPrice(classification)).toBe(2800000);
    expect(getInfantPrice(classification)).toBe(0);
    expect(getClassificationDays(classification)).toBe(4);
    expect(getClassificationNights(classification)).toBe(3);
  });

  it("returns original package price only when greater than displayed price", () => {
    const discounted = {
      adultPrice: 2800000,
      price: 3200000,
    };
    const noDiscount = {
      adultPrice: 2800000,
      price: 2800000,
    };

    expect(getOriginalPackagePrice(discounted)).toBe(3200000);
    expect(getOriginalPackagePrice(noDiscount)).toBe(0);
  });
});
