import { describe, expect, it } from "vitest";

import {
  ADMIN_DEFAULT_PATH,
  isAdminRoutePath,
  isSafeNextPath,
  resolveLoginDestination,
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

describe("isSafeNextPath", () => {
  it("returns true for valid internal paths", () => {
    expect(isSafeNextPath("/tours/custom")).toBe(true);
    expect(isSafeNextPath("/dashboard")).toBe(true);
    expect(isSafeNextPath("/home?foo=bar")).toBe(true);
  });

  it("returns false for null or undefined", () => {
    expect(isSafeNextPath(null)).toBe(false);
    expect(isSafeNextPath(undefined)).toBe(false);
  });

  it("returns false for paths not starting with /", () => {
    expect(isSafeNextPath("tours/custom")).toBe(false);
    expect(isSafeNextPath("")).toBe(false);
  });

  it("returns false for external URLs", () => {
    expect(isSafeNextPath("https://evil.com")).toBe(false);
    expect(isSafeNextPath("http://evil.com/path")).toBe(false);
  });

  it("returns false for paths with dangerous characters", () => {
    expect(isSafeNextPath("/tours/custom\nalert(1)")).toBe(false);
    expect(isSafeNextPath("/tours/custom\0")).toBe(false);
  });
});

describe("resolveLoginDestination", () => {
  it("prioritizes valid next for non-admin users", () => {
    const result = resolveLoginDestination({
      next: "/tours/custom",
      portal: "user",
    });
    expect(result).toBe("/tours/custom");
  });

  it("falls back to defaultPath when next is invalid", () => {
    const result = resolveLoginDestination({
      next: "https://evil.com",
      defaultPath: "/home",
      portal: "user",
    });
    expect(result).toBe("/home");
  });

  it("ignores next for admin portal", () => {
    const result = resolveLoginDestination({
      next: "/tours/custom",
      portal: "admin",
    });
    expect(result).toBe(ADMIN_DEFAULT_PATH);
  });

  it("ignores next for admin roles", () => {
    const result = resolveLoginDestination({
      next: "/tours/custom",
      roles: [{ type: 9, id: "r1", name: "Admin" }],
    });
    expect(result).toBe(ADMIN_DEFAULT_PATH);
  });

  it("falls back to user default when no next or defaultPath", () => {
    const result = resolveLoginDestination({ portal: "user" });
    expect(result).toBe(USER_DEFAULT_PATH);
  });
});
