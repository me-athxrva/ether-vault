import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith("/issuer/dashboard")) {
      return NextResponse.redirect(new URL("/issuer/login", req.url));
    }

    if (pathname.startsWith("/recipient/dashboard")) {
      return NextResponse.redirect(new URL("/recipient/login", req.url));
    }

    return NextResponse.next();
  }

  // 🔁 Logged in → block login pages
  if (token && pathname.startsWith("/issuer/login")) {
    return NextResponse.redirect(new URL("/issuer/dashboard", req.url));
  }

  if (token && pathname.startsWith("/recipient/login")) {
    return NextResponse.redirect(new URL("/recipient/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/issuer/login/:path*",
    "/issuer/dashboard/:path*",
    "/recipient/login/:path*",
    "/recipient/dashboard/:path*",
  ],
};
