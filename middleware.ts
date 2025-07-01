// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lewati API route, Next.js internal files, dan static files (css, js, svg, dll)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // Proteksi semua route yang diawali dengan /dashboard
  if (pathname.startsWith("/dashboard")) {
    const token =
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("__Secure-authjs.session-token");

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url); // agar redirect balik
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
