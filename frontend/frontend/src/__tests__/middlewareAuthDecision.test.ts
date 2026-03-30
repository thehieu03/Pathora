import { describe, expect, it } from "vitest";

import {
  getPortalGuardRedirectPath,
  hasValidAuthSession,
  isPublicPath,
} from "../middleware";

const validJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiIjo0MTAyNDQ0ODAwfQ.signature";
const expiredJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjF9.signature";

describe("middleware auth decisions", () => {
  it("allows authenticated sessions with non-expired access token", () => {
    expect(hasValidAuthSession(validJwt, null)).toBe(true);
  });

  it("rejects sessions with expired access token", () => {
    expect(hasValidAuthSession(expiredJwt, "1")).toBe(false);
  });

  it("supports legacy auth_status fallback when access token is missing", () => {
    expect(hasValidAuthSession(null, "1")).toBe(true);
    expect(hasValidAuthSession(undefined, "true")).toBe(true);
  });

  it("rejects unauthenticated sessions when both access token and auth_status are missing", () => {
    expect(hasValidAuthSession(null, null)).toBe(false);
    expect(hasValidAuthSession("", "")).toBe(false);
  });

  it("flags private route /custom-tour-request as protected", () => {
    expect(isPublicPath("/custom-tour-request")).toBe(false);
    expect(isPublicPath("/tours")).toBe(true);
  });

  it("redirects user portal away from admin prefixes", () => {
    expect(getPortalGuardRedirectPath("/dashboard", "user")).toBe("/home");
    expect(getPortalGuardRedirectPath("/admin/custom-tour-requests", "user")).toBe(
      "/home",
    );
  });

  it("redirects admin portal away from user private prefixes", () => {
    expect(getPortalGuardRedirectPath("/custom-tour-request", "admin")).toBe(
      "/dashboard",
    );
    expect(
      getPortalGuardRedirectPath("/my-custom-tour-requests/req-1", "admin"),
    ).toBe("/dashboard");
  });

  it("keeps migration-safe behavior when auth_portal is missing", () => {
    expect(getPortalGuardRedirectPath("/dashboard", null)).toBeNull();
    expect(getPortalGuardRedirectPath("/custom-tour-request", undefined)).toBeNull();
  });
});
