import { describe, expect, it } from "vitest";

import { normalizeTourListResponse } from "../tourMappers";

describe("normalizeTourListResponse", () => {

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
