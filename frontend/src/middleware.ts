import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: Auth temporarily disabled for development
  // const authStatus = request.cookies.get("auth_status")?.value;

  // // Define public paths that don't depend on the matcher's exclusion alone
  // // (Optional, but good for explicit safety)
  // const isAuthPage =
  //   request.nextUrl.pathname.startsWith("/login") ||
  //   request.nextUrl.pathname.startsWith("/register") ||
  //   request.nextUrl.pathname.startsWith("/forgot-password");

  // // If not authenticated and not on an auth page, redirect to login
  // if (!authStatus && !isAuthPage) {
  //   const loginUrl = new URL("/login", request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // // If authenticated and on an auth page, redirect to dashboard
  // if (authStatus && isAuthPage) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     * - forgot-password
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password).*)",
  ],
};
