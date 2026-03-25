import { describe, expect, it } from "vitest";

import { buildCreateTourFormData, buildServicesPayload } from "../tourCreatePayload";

describe("buildCreateTourFormData", () => {
  // =========================================================================
  // Helper function edge cases
  // =========================================================================

  describe("base price parsing", () => {
    // TC-FE06: basePrice is mapped directly to payload basePrice
    it("maps classification basePrice into payload", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [
          {
            name: "Standard",
            enName: "",
            description: "Desc VI",
            enDescription: "",
            basePrice: "1000",
            durationDays: "3",
          },
        ],
        dayPlans: [[]],
        insurances: [[]],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      const classifications = JSON.parse(String(formData.get("classifications")));
      expect(classifications[0].basePrice).toBe(1000);
      expect(classifications[0].adultPrice).toBeUndefined();
      expect(classifications[0].childPrice).toBeUndefined();
      expect(classifications[0].infantPrice).toBeUndefined();
    });

    // TC-FE07: NumberOfDay must be at least 1
    it("defaults NumberOfDay to 1 when less than 1", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [
          {
            name: "Standard",
            enName: "",
            description: "",
            enDescription: "",
            basePrice: "500",
            durationDays: "0", // less than 1
          },
        ],
        dayPlans: [[]],
        insurances: [[]],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      const classifications = JSON.parse(String(formData.get("classifications")));
      expect(classifications[0].numberOfDay).toBe(1);
      expect(classifications[0].numberOfNight).toBe(0);
    });

    // TC-FE08: NumberOfNight equals NumberOfDay - 1
    it("calculates NumberOfNight as NumberOfDay minus 1", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [
          {
            name: "Standard",
            enName: "",
            description: "",
            enDescription: "",
            basePrice: "1000",
            durationDays: "5",
          },
        ],
        dayPlans: [[]],
        insurances: [[]],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      const classifications = JSON.parse(String(formData.get("classifications")));
      expect(classifications[0].numberOfDay).toBe(5);
      expect(classifications[0].numberOfNight).toBe(4);
    });
  });

  // =========================================================================
  // Policy IDs
  // =========================================================================

  describe("policy IDs are appended when provided", () => {
    // TC-FE09: All four policy IDs appended to FormData
    it("appends all four policy IDs when provided", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        selectedPricingPolicyId: "policy-pricing-1",
        selectedDepositPolicyId: "policy-deposit-1",
        selectedCancellationPolicyId: "policy-cancel-1",
        selectedVisaPolicyId: "policy-visa-1",
        accommodations: [],
        locations: [],
        transportations: [],
      });

      expect(formData.get("pricingPolicyId")).toBe("policy-pricing-1");
      expect(formData.get("depositPolicyId")).toBe("policy-deposit-1");
      expect(formData.get("cancellationPolicyId")).toBe("policy-cancel-1");
      expect(formData.get("visaPolicyId")).toBe("policy-visa-1");
    });

    // TC-FE10: Policy IDs omitted when not provided
    it("omits policy IDs from FormData when not provided", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      expect(formData.get("pricingPolicyId")).toBeNull();
      expect(formData.get("depositPolicyId")).toBeNull();
      expect(formData.get("cancellationPolicyId")).toBeNull();
      expect(formData.get("visaPolicyId")).toBeNull();
    });
  });

  // =========================================================================
  // Empty classifications
  // =========================================================================

  describe("empty classifications handling", () => {
    // TC-FE11: Empty classifications array omits classifications field
    it("omits classifications field when array is empty", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      expect(formData.get("classifications")).toBeNull();
    });

    // TC-FE12: Basic fields always appended as strings
    it("appends all basic string fields to FormData", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "My Tour",
          shortDescription: "Short desc",
          longDescription: "Long desc here",
          seoTitle: "SEO Title",
          seoDescription: "SEO Desc",
          status: "2",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      expect(formData.get("tourName")).toBe("My Tour");
      expect(formData.get("shortDescription")).toBe("Short desc");
      expect(formData.get("longDescription")).toBe("Long desc here");
      expect(formData.get("seoTitle")).toBe("SEO Title");
      expect(formData.get("seoDescription")).toBe("SEO Desc");
      expect(formData.get("status")).toBe("2");
    });

    // TC-FE13: Images appended as individual files
    it("appends multiple images as separate fields", () => {
      const file1 = new File(["content1"], "img1.jpg", { type: "image/jpeg" });
      const file2 = new File(["content2"], "img2.jpg", { type: "image/jpeg" });

      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [file1, file2],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      const imageCount = formData.getAll("images").length;
      expect(imageCount).toBe(2);
    });
  });

  // =========================================================================
  // Existing bilingual nested translations tests (TC-FE14 onwards)
  // =========================================================================

  describe("bilingual nested translations", () => {
    it("serializes bilingual classification and nested plan/activity/insurance translations", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Da Nang Explorer",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "SEO",
          seoDescription: "SEO Desc",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "Da Nang Explorer VI",
          shortDescription: "Mo ta VI",
          longDescription: "Mo ta dai VI",
          seoTitle: "SEO VI",
          seoDescription: "SEO Mo ta VI",
        },
        englishTranslation: {
          tourName: "Da Nang Explorer EN",
          shortDescription: "Short EN",
          longDescription: "Long EN",
          seoTitle: "SEO EN",
          seoDescription: "SEO Desc EN",
        },
        classifications: [
          {
            name: "Standard",
            enName: "Standard Package EN",
            description: "Package VI",
            enDescription: "Package EN",
            basePrice: "1000",
            durationDays: "3",
          },
        ],
        dayPlans: [
          [
            {
              dayNumber: "1",
              title: "Day 1 VI",
              enTitle: "Day 1 EN",
              description: "Desc VI",
              enDescription: "Desc EN",
              activities: [
                {
                  activityType: "0",
                  title: "Activity VI",
                  enTitle: "Activity EN",
                  description: "Act Desc VI",
                  enDescription: "Act Desc EN",
                  note: "Note VI",
                  enNote: "Note EN",
                  estimatedCost: "120",
                  isOptional: false,
                  startTime: "08:00",
                  endTime: "10:00",
                  routes: [],
                },
              ],
            },
          ],
        ],
        insurances: [
          [
            {
              insuranceName: "Insurance VI",
              enInsuranceName: "Insurance EN",
              insuranceType: "1",
              insuranceProvider: "Provider",
              coverageDescription: "Cov VI",
              enCoverageDescription: "Cov EN",
              coverageAmount: "5000",
              coverageFee: "150",
              isOptional: false,
              note: "Note VI",
              enNote: "Note EN",
            },
          ],
        ],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      const translations = JSON.parse(String(formData.get("translations")));
      expect(translations.vi.tourName).toBe("Da Nang Explorer VI");
      expect(translations.en.tourName).toBe("Da Nang Explorer EN");

      const classifications = JSON.parse(String(formData.get("classifications")));
      expect(classifications[0].name).toBe("Standard");
      expect(classifications[0].description).toBe("Package VI");
      expect(classifications[0].translations.vi).toEqual({ name: "Standard", description: "Package VI" });
      expect(classifications[0].translations.en).toEqual({ name: "Standard Package EN", description: "Package EN" });

      expect(classifications[0].plans[0].title).toBe("Day 1 VI");
      expect(classifications[0].plans[0].translations.vi).toEqual({ title: "Day 1 VI", description: "Desc VI" });
      expect(classifications[0].plans[0].translations.en).toEqual({ title: "Day 1 EN", description: "Desc EN" });

      expect(classifications[0].plans[0].activities[0].title).toBe("Activity VI");
      expect(classifications[0].plans[0].activities[0].translations.vi).toEqual({
        title: "Activity VI",
        description: "Act Desc VI",
        note: "Note VI",
      });
      expect(classifications[0].plans[0].activities[0].translations.en).toEqual({
        title: "Activity EN",
        description: "Act Desc EN",
        note: "Note EN",
      });

      expect(classifications[0].insurances[0].insuranceName).toBe("Insurance VI");
      expect(classifications[0].insurances[0].translations.vi).toEqual({
        name: "Insurance VI",
        description: "Cov VI",
      });
      expect(classifications[0].insurances[0].translations.en).toEqual({
        name: "Insurance EN",
        description: "Cov EN",
      });
    });

    it("omits English translation block when English fields are empty", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour VI",
          shortDescription: "Short VI",
          longDescription: "Long VI",
          seoTitle: "SEO VI",
          seoDescription: "SEO Desc VI",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "Tour VI",
          shortDescription: "Short VI",
          longDescription: "Long VI",
          seoTitle: "SEO VI",
          seoDescription: "SEO VI",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [
          {
            name: "Cls VI",
            enName: "",
            description: "Desc VI",
            enDescription: "",
            basePrice: "500",
            durationDays: "2",
          },
        ],
        dayPlans: [[{
          dayNumber: "1",
          title: "Day VI",
          enTitle: "",
          description: "Day Desc VI",
          enDescription: "",
          activities: [{
            activityType: "0",
            title: "Act VI",
            enTitle: "",
            description: "Act Desc VI",
            enDescription: "",
            note: "",
            enNote: "",
            estimatedCost: "50",
            isOptional: false,
            startTime: "",
            endTime: "",
            routes: [],
          }],
        }]],
        insurances: [[{
          insuranceName: "Ins VI",
          enInsuranceName: "",
          insuranceType: "1",
          insuranceProvider: "Prov",
          coverageDescription: "Cov VI",
          enCoverageDescription: "",
          coverageAmount: "1000",
          coverageFee: "50",
          isOptional: false,
          note: "",
          enNote: "",
        }]],
      });

      const translations = JSON.parse(String(formData.get("translations")));
      expect(translations.vi.tourName).toBe("Tour VI");
      expect(translations.en).toBeUndefined();

      const classifications = JSON.parse(String(formData.get("classifications")));
      expect(classifications[0].translations.vi).toEqual({ name: "Cls VI", description: "Desc VI" });
      expect(classifications[0].translations.en).toBeUndefined();

      expect(classifications[0].plans[0].translations.vi).toEqual({ title: "Day VI", description: "Day Desc VI" });
      expect(classifications[0].plans[0].translations.en).toBeUndefined();

      expect(classifications[0].plans[0].activities[0].translations.vi).toEqual({
        title: "Act VI",
        description: "Act Desc VI",
        note: "",
      });
      expect(classifications[0].plans[0].activities[0].translations.en).toBeUndefined();

      expect(classifications[0].insurances[0].translations.vi).toEqual({
        name: "Ins VI",
        description: "Cov VI",
      });
      expect(classifications[0].insurances[0].translations.en).toBeUndefined();
    });

    it("serializes accommodations, locations, and transportations with translations", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "SEO",
          seoDescription: "SEO Desc",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "Tour VI",
          shortDescription: "Short VI",
          longDescription: "Long VI",
          seoTitle: "SEO VI",
          seoDescription: "SEO Desc VI",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        accommodations: [{
          accommodationName: "Hotel VI",
          enAccommodationName: "Hotel EN",
          address: "Address VI",
          enAddress: "Address EN",
          contactPhone: "123456",
          checkInTime: "14:00",
          checkOutTime: "12:00",
          note: "Note VI",
          enNote: "Note EN",
        }],
        locations: [{
          locationName: "Location VI",
          enLocationName: "Location EN",
          type: "Museum",
          enType: "Museum EN",
          description: "Desc VI",
          enDescription: "Desc EN",
          city: "Hanoi VI",
          enCity: "Hanoi EN",
          country: "Vietnam",
          enCountry: "",
          entranceFee: "50",
          address: "Addr VI",
          enAddress: "Addr EN",
        }],
        transportations: [{
          fromLocation: "From VI",
          enFromLocation: "From EN",
          toLocation: "To VI",
          enToLocation: "To EN",
          transportationType: "Bus VI",
          enTransportationType: "Bus EN",
          transportationName: "Name VI",
          enTransportationName: "Name EN",
          durationMinutes: "120",
          pricingType: "Per person",
          price: "50",
          requiresIndividualTicket: false,
          ticketInfo: "Info VI",
          enTicketInfo: "Info EN",
          note: "Note VI",
          enNote: "Note EN",
        }],
      });

      const accommodations = JSON.parse(String(formData.get("accommodations")));
      expect(accommodations[0].accommodationName).toBe("Hotel VI");
      expect(accommodations[0].translations.vi).toEqual({
        accommodationName: "Hotel VI",
        address: "Address VI",
        note: "Note VI",
      });
      expect(accommodations[0].translations.en).toEqual({
        accommodationName: "Hotel EN",
        address: "Address EN",
        note: "Note EN",
      });

      const locations = JSON.parse(String(formData.get("locations")));
      expect(locations[0].locationName).toBe("Location VI");
      expect(locations[0].translations.vi).toEqual({
        locationName: "Location VI",
        locationDescription: "Desc VI",
        city: "Hanoi VI",
        country: "Vietnam",
        address: "Addr VI",
      });
      expect(locations[0].translations.en).toEqual({
        locationName: "Location EN",
        locationDescription: "Desc EN",
        city: "Hanoi EN",
        country: "",
        address: "Addr EN",
      });

      const transportations = JSON.parse(String(formData.get("transportations")));
      expect(transportations[0].fromLocationName).toBe("From VI");
      expect(transportations[0].translations.vi).toEqual({
        fromLocationName: "From VI",
        toLocationName: "To VI",
        transportationType: "Bus VI",
        transportationName: "Name VI",
        ticketInfo: "Info VI",
        note: "Note VI",
      });
      expect(transportations[0].translations.en).toEqual({
        fromLocationName: "From EN",
        toLocationName: "To EN",
        transportationType: "Bus EN",
        transportationName: "Name EN",
        ticketInfo: "Info EN",
        note: "Note EN",
      });
    });
  });

  describe("services payload", () => {
    // TC-FE15: Services are appended as JSON when provided
    it("appends services as JSON when services are provided", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        services: [
          {
            serviceName: "Guide Service",
            pricingType: "0",
            price: "100",
            salePrice: "80",
            email: "guide@example.com",
            contactNumber: "123456",
          },
        ],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      const services = JSON.parse(String(formData.get("services")));
      expect(services).toHaveLength(1);
      expect(services[0].serviceName).toBe("Guide Service");
      expect(services[0].pricingType).toBe("0");
      expect(services[0].price).toBe(100);
      expect(services[0].salePrice).toBe(80);
      expect(services[0].email).toBe("guide@example.com");
      expect(services[0].contactNumber).toBe("123456");
    });

    // TC-FE16: Services with empty serviceName are filtered out
    it("filters out services with empty serviceName", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        services: [
          {
            serviceName: "",
            pricingType: "0",
            price: "100",
            salePrice: "",
            email: "",
            contactNumber: "",
          },
          {
            serviceName: "Valid Service",
            pricingType: "1",
            price: "50",
            salePrice: "",
            email: "",
            contactNumber: "",
          },
        ],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      const services = JSON.parse(String(formData.get("services")));
      expect(services).toHaveLength(1);
      expect(services[0].serviceName).toBe("Valid Service");
    });

    // TC-FE17: Services omitted from FormData when array is empty
    it("omits services field when array is empty", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        services: [],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      expect(formData.get("services")).toBeNull();
    });

    // TC-FE18: Services omitted when all entries have empty serviceName
    it("omits services field when all services have empty serviceName", () => {
      const formData = buildCreateTourFormData({
        basicInfo: {
          tourName: "Tour",
          shortDescription: "Short",
          longDescription: "Long",
          seoTitle: "",
          seoDescription: "",
          status: "1",
        },
        thumbnail: null,
        images: [],
        vietnameseTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        englishTranslation: {
          tourName: "",
          shortDescription: "",
          longDescription: "",
          seoTitle: "",
          seoDescription: "",
        },
        classifications: [],
        dayPlans: [],
        insurances: [],
        services: [
          {
            serviceName: "",
            pricingType: "",
            price: "",
            salePrice: "",
            email: "",
            contactNumber: "",
          },
        ],
        accommodations: [],
        locations: [],
        transportations: [],
      });

      expect(formData.get("services")).toBeNull();
    });
  });

  // Direct unit tests for buildServicesPayload
  describe("buildServicesPayload", () => {
    // TC-FE19: Filters out empty services, maps optional fields correctly
    it("maps service fields and filters empty names", () => {
      const result = buildServicesPayload([
        {
          serviceName: "Guide",
          pricingType: "0",
          price: "200",
          salePrice: "150",
          email: "guide@test.com",
          contactNumber: "999",
        },
      ]);
      expect(result[0].serviceName).toBe("Guide");
      expect(result[0].pricingType).toBe("0");
      expect(result[0].price).toBe(200);
      expect(result[0].salePrice).toBe(150);
      expect(result[0].email).toBe("guide@test.com");
      expect(result[0].contactNumber).toBe("999");
    });

    // TC-FE20: Empty optional fields become null
    it("converts empty optional fields to null", () => {
      const result = buildServicesPayload([
        {
          serviceName: "Guide",
          pricingType: "",
          price: "",
          salePrice: "",
          email: "",
          contactNumber: "",
        },
      ]);
      expect(result[0].pricingType).toBeNull();
      expect(result[0].price).toBe(0);
      expect(result[0].salePrice).toBe(0);
      expect(result[0].email).toBeNull();
      expect(result[0].contactNumber).toBeNull();
    });
  });
});
