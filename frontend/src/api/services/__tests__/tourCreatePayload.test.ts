import { describe, expect, it } from "vitest";

import { buildCreateTourFormData } from "../tourCreatePayload";

describe("buildCreateTourFormData", () => {
  it("serializes create-tour data into the backend contract", () => {
    const formData = buildCreateTourFormData({
      basicInfo: {
        tourName: "Da Nang Explorer",
        shortDescription: "Short",
        longDescription: "Long",
        seoTitle: "SEO",
        seoDescription: "SEO Description",
        status: "1",
      },
      thumbnail: null,
      images: [],
      vietnameseTranslation: {
        tourName: "Da Nang Explorer",
        shortDescription: "Mo ta ngan",
        longDescription: "Mo ta dai",
        seoTitle: "SEO VI",
        seoDescription: "SEO Mo ta",
      },
      englishTranslation: {
        tourName: "Da Nang Explorer EN",
        shortDescription: "Short EN",
        longDescription: "Long EN",
        seoTitle: "SEO EN",
        seoDescription: "SEO Description EN",
      },
      classifications: [
        {
          name: "Standard",
          description: "Package",
          price: "1000",
          salePrice: "800",
          durationDays: "3",
        },
      ],
      dayPlans: [
        [
          {
            dayNumber: "1",
            title: "Arrival",
            description: "Welcome",
            activities: [
              {
                activityType: "0",
                title: "City walk",
                description: "Explore",
                note: "Bring shoes",
                estimatedCost: "120",
                isOptional: false,
                startTime: "08:00",
                endTime: "10:00",
              },
            ],
          },
        ],
      ],
      insurances: [
        [
          {
            insuranceName: "Travel Care",
            insuranceType: "1",
            insuranceProvider: "Provider",
            coverageDescription: "Full",
            coverageAmount: "5000",
            coverageFee: "150",
            isOptional: false,
            note: "Important",
          },
        ],
      ],
      selectedPricingPolicyId: "pricing-1",
      selectedDepositPolicyId: "deposit-1",
      selectedCancellationPolicyId: "cancel-1",
      selectedVisaPolicyId: "visa-1",
    });

    expect(formData.get("tourName")).toBe("Da Nang Explorer");
    expect(formData.get("pricingPolicyId")).toBe("pricing-1");
    expect(formData.get("depositPolicyId")).toBe("deposit-1");
    expect(formData.get("cancellationPolicyId")).toBe("cancel-1");
    expect(formData.get("visaPolicyId")).toBe("visa-1");
    expect(formData.get("ecoDescription")).toBeNull();
    expect(formData.get("classifications[0].name")).toBeNull();

    const translations = JSON.parse(String(formData.get("translations")));
    expect(translations.vi.tourName).toBe("Da Nang Explorer");
    expect(translations.en.tourName).toBe("Da Nang Explorer EN");

    const classifications = JSON.parse(String(formData.get("classifications")));
    expect(classifications).toEqual([
      {
        name: "Standard",
        description: "Package",
        adultPrice: 1000,
        childPrice: 800,
        infantPrice: 0,
        numberOfDay: 3,
        numberOfNight: 2,
        plans: [
          {
            dayNumber: 1,
            title: "Arrival",
            description: "Welcome",
            activities: [
              {
                activityType: "0",
                title: "City walk",
                description: "Explore",
                note: "Bring shoes",
                estimatedCost: 120,
                isOptional: false,
                startTime: "08:00",
                endTime: "10:00",
                routes: [],
                accommodation: null,
              },
            ],
          },
        ],
        insurances: [
          {
            insuranceName: "Travel Care",
            insuranceType: "1",
            insuranceProvider: "Provider",
            coverageDescription: "Full",
            coverageAmount: 5000,
            coverageFee: 150,
            isOptional: false,
            note: "Important",
          },
        ],
      },
    ]);
  });
});
