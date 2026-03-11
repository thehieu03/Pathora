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
  "/tours",
  "/tour-detail",
  "/about",
  "/visa",
  "/policies",
  "/checkout",
  "/auth/callback",
];

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export function middleware(request: NextRequest) {
  const authStatus = request.cookies.get("auth_status")?.value;
  const authPortal = request.cookies.get("auth_portal")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const authenticated = Boolean(authStatus);
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
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
