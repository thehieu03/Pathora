import { describe, expect, it } from "vitest";

import {
  createEmptyCustomTourRequestFormValues,
  validateCustomTourRequestForm,
} from "../validation";

describe("custom tour request validation", () => {
  it("requires destination, dates, participants and budget", () => {
    const values = createEmptyCustomTourRequestFormValues();

    const errors = validateCustomTourRequestForm(values);

    expect(errors.destination).toBeDefined();
    expect(errors.startDate).toBeDefined();
    expect(errors.endDate).toBeDefined();
    expect(errors.participants).toBeDefined();
    expect(errors.budgetPerPersonUsd).toBeDefined();
  });

  it("validates end date is not before start date", () => {
    const values = {
      ...createEmptyCustomTourRequestFormValues(),
      destination: "Da Nang",
      startDate: "2026-06-20",
      endDate: "2026-06-18",
      participants: "4",
      budgetPerPersonUsd: "1200",
    };

    const errors = validateCustomTourRequestForm(values);

    expect(errors.endDate).toBeDefined();
  });

  it("accepts valid values", () => {
    const values = {
      ...createEmptyCustomTourRequestFormValues(),
      destination: "Tokyo",
      startDate: "2026-07-02",
      endDate: "2026-07-08",
      participants: "2",
      budgetPerPersonUsd: "2500",
      travelInterests: ["adventure", "food_culinary"],
      preferredAccommodation: "4-star",
      transportationPreference: "Flight",
      specialRequests: "Vegetarian meals",
    };

    const errors = validateCustomTourRequestForm(values);

    expect(errors).toEqual({});
  });
});
