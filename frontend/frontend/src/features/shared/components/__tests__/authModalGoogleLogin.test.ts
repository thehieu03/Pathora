import { describe, expect, it } from "vitest";

import { resolveApiGatewayBaseUrl } from "../../../../configs/apiGateway";

describe("AuthModal Google Login URL Construction", () => {
  it("uses configured API gateway when provided", () => {
    const apiGateway = resolveApiGatewayBaseUrl("https://api.pathora.com");
    const googleLoginUrl = `${apiGateway}/api/auth/google-login`;

    expect(googleLoginUrl).toBe("https://api.pathora.com/api/auth/google-login");
    expect(googleLoginUrl).not.toContain("undefined");
  });

  it("trims trailing slash from configured API gateway", () => {
    const apiGateway = resolveApiGatewayBaseUrl("https://api.pathora.com/");
    const googleLoginUrl = `${apiGateway}/api/auth/google-login`;

    expect(apiGateway).toBe("https://api.pathora.com");
    expect(googleLoginUrl).toBe("https://api.pathora.com/api/auth/google-login");
  });

  it("falls back to local default when API gateway is missing", () => {
    const apiGateway = resolveApiGatewayBaseUrl(undefined);
    const googleLoginUrl = `${apiGateway}/api/auth/google-login`;

    expect(apiGateway).toBe("http://localhost:5182");
    expect(googleLoginUrl).toBe("http://localhost:5182/api/auth/google-login");
  });

  it("does not use deprecated localhost:8080 fallback", () => {
    const apiGateway = resolveApiGatewayBaseUrl(undefined);
    expect(apiGateway).not.toContain("localhost:8080");
  });
});
