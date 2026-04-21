import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getRole(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req) {
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

  const role = await getRole(token);

  if (!role) {
    const res = NextResponse.redirect(
      new URL(
        pathname.startsWith("/issuer") ? "/issuer/login" : "/recipient/login",
        req.url
      )
    );
    res.cookies.delete("token");
    return res;
  }

  if (pathname.startsWith("/issuer/dashboard")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/recipient/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/issuer/login")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/issuer/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/recipient/dashboard")) {
    if (role !== "user") {
      return NextResponse.redirect(new URL("/issuer/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/recipient/login")) {
    if (role === "user") {
      return NextResponse.redirect(new URL("/recipient/dashboard", req.url));
    }
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
