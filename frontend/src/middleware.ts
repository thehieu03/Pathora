import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isJwtExpired } from "./utils/jwt";
import {
  ADMIN_DEFAULT_PATH,
  USER_DEFAULT_PATH,
  isAdminRoutePath,
  isUserPrivateRoutePath,
  normalizePortal,
} from "./utils/postLoginRouting";

export const isPublicPath = (pathname: string): boolean => {
  return (
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/tours") ||
    pathname.startsWith("/tour-detail") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/visa") ||
    pathname.startsWith("/policies") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/auth/callback")
  );
};

export const hasValidAuthSession = (
  accessToken: string | null | undefined,
  authStatus: string | null | undefined,
  nowMs = Date.now(),
): boolean => {
  const token = accessToken?.trim();
  if (token) {
    return !isJwtExpired(token, nowMs);
  }

  const normalizedAuthStatus = authStatus?.trim().toLowerCase();
  return normalizedAuthStatus === "1" || normalizedAuthStatus === "true";
};

export const getPortalGuardRedirectPath = (
  pathname: string,
  portal: string | null | undefined,
): string | null => {
  const normalizedPortal = normalizePortal(portal);
  if (!normalizedPortal) {
    return null;
  }

  if (normalizedPortal === "user" && isAdminRoutePath(pathname)) {
    return USER_DEFAULT_PATH;
  }

  if (normalizedPortal === "admin" && isUserPrivateRoutePath(pathname)) {
    return ADMIN_DEFAULT_PATH;
  }

  return null;
};

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const authStatus = request.cookies.get("auth_status")?.value;
  const authPortal = request.cookies.get("auth_portal")?.value;
  const pathname = request.nextUrl.pathname;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasValidAuthSession(accessToken, authStatus)) {
    const loginUrl = new URL("/home", request.url);
    loginUrl.searchParams.set("login", "true");
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("auth_status");
    response.cookies.delete("auth_portal");
    return response;
  }

  const redirectPath = getPortalGuardRedirectPath(pathname, authPortal);
  if (redirectPath) {
    const redirectUrl = new URL(redirectPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
