import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/auth/")) return NextResponse.next();

  const hasSession = req.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token") && !!c.value
  );
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
