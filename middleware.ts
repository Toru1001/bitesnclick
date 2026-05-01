import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyAdminSession(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, secret, { algorithms: ["HS256"] });
        return true;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isAdminRoute = path.startsWith("/admin");
    const isLoginRoute = path === "/login/admin";

    const token = request.cookies.get("admin_session")?.value;

    if (isAdminRoute) {
        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = "/login/admin";
            return NextResponse.redirect(url);
        }

        const isValid = await verifyAdminSession(token);
        if (!isValid) {
            const url = request.nextUrl.clone();
            url.pathname = "/login/admin";
            const response = NextResponse.redirect(url);
            response.cookies.delete("admin_session");
            return response;
        }
    }

    if (isLoginRoute && token) {
        const isValid = await verifyAdminSession(token);
        if (isValid) {
            const url = request.nextUrl.clone();
            url.pathname = "/admin/dashboard";
            return NextResponse.redirect(url);
        }
        const response = NextResponse.next();
        response.cookies.delete("admin_session");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
