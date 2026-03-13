import { describe, expect, it } from "vitest";

import { prepareApiHeaders } from "../apiSlice";

describe("apiSlice headers", () => {
  it("adds authorization and accept-language headers", () => {
    const headers = new Headers();

    const result = prepareApiHeaders(
      headers,
      "access_token=test-token; path=/",
      "en-US",
    );

    expect(result.get("Authorization")).toBe("Bearer test-token");
    expect(result.get("Accept-Language")).toBe("en");
  });

  it("defaults accept-language to en when language is unsupported", () => {
    const headers = new Headers();

    const result = prepareApiHeaders(headers, "", "fr-FR");

    expect(result.get("Authorization")).toBeNull();
    expect(result.get("Accept-Language")).toBe("en");
  });

  it("normalizes vietnamese locale to vi", () => {
    const headers = new Headers();

    const result = prepareApiHeaders(
      headers,
      "access_token=test-token; path=/",
      "vi-VN",
    );

    expect(result.get("Authorization")).toBe("Bearer test-token");
    expect(result.get("Accept-Language")).toBe("vi");
  });
});
