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
  it("redirects unauthenticated protected route to login entry with next", () => {
    const response = middleware(buildRequest("/dashboard"));

    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/home?login=true");
    expect(location).toContain("next=%2Fdashboard");
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

  it("allows authenticated admin to access /tour-requests", () => {
    const response = middleware(
      buildRequest("/tour-requests", {
        auth_status: "1",
        auth_portal: "admin",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated non-admin from /tour-requests to home", () => {
    const response = middleware(
      buildRequest("/tour-requests", {
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

  describe("/tours/custom protection", () => {
    it("redirects unauthenticated /tours/custom to login with next parameter", () => {
      const response = middleware(buildRequest("/tours/custom"));

      expect(response.status).toBe(307);
      const location = response.headers.get("location");
      expect(location).toContain("/home?login=true");
      expect(location).toContain("next=%2Ftours%2Fcustom");
    });

    it("preserves query parameters in next parameter", () => {
      const response = middleware(buildRequest("/tours/custom?foo=bar&baz=qux"));

      expect(response.status).toBe(307);
      const location = response.headers.get("location");
      expect(location).toContain("next=%2Ftours%2Fcustom%3Ffoo%3Dbar%26baz%3Dqux");
    });

    it("allows authenticated users to access /tours/custom", () => {
      const response = middleware(
        buildRequest("/tours/custom", {
          auth_status: "1",
          auth_portal: "user",
        }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    });

    it("allows authenticated admin to access /tours/custom", () => {
      const response = middleware(
        buildRequest("/tours/custom", {
          auth_status: "1",
          auth_portal: "admin",
        }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    });
  });
});
