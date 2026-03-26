import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_DEFAULT_PATH,
  isAdminPortal,
  isAdminRoutePath,
  isLoginEntryPath,
  USER_DEFAULT_PATH,
} from "./utils/authRouting";

const PUBLIC_PATH_PREFIXES = [
  "/",
  "/home",
  "/tour-detail",
  "/about",
  "/visa",
  "/policies",
  "/checkout",
  "/auth/callback",
  "/tours",
  "/tours/instances",
];

// Specific public routes under /tours (with prefix matching for sub-paths)
const PUBLIC_TOURS_ROUTES = [
  "/tours", // tours list
  "/tours/instances", // public tour instances (includes /tours/instances/[id])
];

const isPublicPath = (pathname: string): boolean => {
  // Special handling for /tours/custom - requires login, not public
  if (pathname.startsWith("/tours/custom")) {
    return false;
  }

  // Check prefix matches for public paths (e.g., /about matches /about, /about/us)
  // Also handles /tours, /tours/instances via PUBLIC_PATH_PREFIXES
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

export function middleware(request: NextRequest) {
  const authStatus = request.cookies.get("auth_status")?.value;
  const accessToken = request.cookies.get("access_token")?.value;
  const authPortal = request.cookies.get("auth_portal")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const authenticated = Boolean(authStatus || accessToken);
  const adminPortal = isAdminPortal(authPortal);
  const publicPath = isPublicPath(pathname);

  if (authenticated && adminPortal && isLoginEntryPath(pathname, searchParams)) {
    return NextResponse.redirect(new URL(ADMIN_DEFAULT_PATH, request.url));
  }

  if (authenticated && !adminPortal && isAdminRoutePath(pathname)) {
    return NextResponse.redirect(new URL(USER_DEFAULT_PATH, request.url));
  }

  if (!authenticated && !publicPath) {
    const loginUrl = new URL(USER_DEFAULT_PATH, request.url);
    loginUrl.searchParams.set("login", "true");
    // Preserve the original destination so user returns after login
    const nextDestination = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    loginUrl.searchParams.set("next", nextDestination);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
