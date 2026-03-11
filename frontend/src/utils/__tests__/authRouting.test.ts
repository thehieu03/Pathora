import { describe, expect, it } from "vitest";

import {
  ADMIN_DEFAULT_PATH,
  isAdminRoutePath,
  resolvePostLoginPath,
  USER_DEFAULT_PATH,
} from "../authRouting";

describe("authRouting", () => {
  it("prefers backend defaultPath when available", () => {
    const result = resolvePostLoginPath({
      defaultPath: "/dashboard/tour-management",
      portal: "admin",
    });

    expect(result).toBe("/dashboard/tour-management");
  });

  it("routes admin portal to admin default path", () => {
    const result = resolvePostLoginPath({ portal: "admin" });
    expect(result).toBe(ADMIN_DEFAULT_PATH);
  });

  it("routes admin role types to admin default path", () => {
    const result = resolvePostLoginPath({
      roles: [{ type: 9, id: "r1", name: "Admin" }],
    });

    expect(result).toBe(ADMIN_DEFAULT_PATH);
  });

  it("falls back to user default path", () => {
    const result = resolvePostLoginPath({ portal: "user" });
    expect(result).toBe(USER_DEFAULT_PATH);
  });

  it("identifies admin route prefixes", () => {
    expect(isAdminRoutePath("/dashboard")).toBe(true);
    expect(isAdminRoutePath("/tour-management/abc/edit")).toBe(true);
    expect(isAdminRoutePath("/home")).toBe(false);
  });
});
