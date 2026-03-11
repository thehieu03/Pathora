import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { middleware } from "../../middleware";

type CookieBag = Record<string, string>;

const buildRequest = (path: string, cookies: CookieBag = {}): NextRequest => {
  const url = new URL(path, "http://localhost:3000");

  return {
    url: url.toString(),
    nextUrl: url,
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value ? { name, value } : undefined;
      },
    },
  } as unknown as NextRequest;
};

describe("middleware auth routing", () => {
  it("redirects unauthenticated protected route to login entry", () => {
    const response = middleware(buildRequest("/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/home?login=true",
    );
  });

  it("redirects non-admin from admin route to home", () => {
    const response = middleware(
      buildRequest("/dashboard", {
        auth_status: "1",
        auth_portal: "user",
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/home");
  });

  it("redirects authenticated admin from root to dashboard", () => {
    const response = middleware(
      buildRequest("/", {
        auth_status: "1",
        auth_portal: "admin",
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/dashboard",
    );
  });

  it("redirects authenticated admin away from login entry", () => {
    const response = middleware(
      buildRequest("/home?login=true", {
        auth_status: "1",
        auth_portal: "admin",
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/dashboard",
    );
  });

  it("keeps public paths accessible", () => {
    const response = middleware(buildRequest("/about"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
