import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authStatus = request.cookies.get("auth_status")?.value;

  const isPublicPath =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/home") ||
    request.nextUrl.pathname.startsWith("/tours") ||
    request.nextUrl.pathname.startsWith("/tour-detail") ||
    request.nextUrl.pathname.startsWith("/about") ||
    request.nextUrl.pathname.startsWith("/visa") ||
    request.nextUrl.pathname.startsWith("/policies") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/auth/callback");

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!authStatus) {
    const loginUrl = new URL("/home", request.url);
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
