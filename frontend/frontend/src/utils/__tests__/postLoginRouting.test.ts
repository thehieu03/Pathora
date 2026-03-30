import { describe, expect, it } from "vitest";

import {
  getPortalGuardRedirectPath,
  hasValidAuthSession,
} from "../../middleware";
import {
  resolveAuthPortal,
  resolvePostLoginPath,
} from "../postLoginRouting";

describe("post-login routing contract", () => {
  it("uses backend defaultPath when provided", () => {
    expect(resolvePostLoginPath("/dashboard", "admin")).toBe("/dashboard");
    expect(resolvePostLoginPath("/home", "user")).toBe("/home");
  });

  it("falls back safely when metadata is absent", () => {
    expect(resolvePostLoginPath(null, "admin")).toBe("/dashboard");
    expect(resolvePostLoginPath(undefined, "user")).toBe("/home");
    expect(resolvePostLoginPath(undefined, undefined)).toBe("/home");
  });

  it("normalizes portal from metadata or default path", () => {
    expect(resolveAuthPortal("admin", null)).toBe("admin");
    expect(resolveAuthPortal(null, "/dashboard")).toBe("admin");
    expect(resolveAuthPortal(null, "/my-custom-tour-requests")).toBe("user");
  });

  it("keeps authenticated migration behavior when auth_portal is missing", () => {
    const validJwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiIjo0MTAyNDQ0ODAwfQ.signature";
    expect(hasValidAuthSession(validJwt, null)).toBe(true);
    expect(getPortalGuardRedirectPath("/dashboard", null)).toBeNull();
  });
});
