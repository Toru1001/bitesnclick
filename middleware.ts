import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isAdminRoute = path.startsWith("/admin");
    const isLoginRoute = path === "/login/admin";

    const adminSession = request.cookies.get("admin_session")?.value;

    if (isAdminRoute && !adminSession) {
        return NextResponse.redirect(new URL("/login/admin", request.url));
    }

    if (isLoginRoute && adminSession) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login/admin"],
};
