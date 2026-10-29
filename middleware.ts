import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isWriteApi =
    (pathname.startsWith("/api/products") || pathname.startsWith("/api/upload")) &&
    req.method !== "GET";

  if (!isAdminPage && !isWriteApi) return NextResponse.next();

  const token = req.cookies.get("admin_token")?.value;
  const valid = token ? await verifyToken(token) : false;

  if (!valid) {
    if (isWriteApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/upload"],
};