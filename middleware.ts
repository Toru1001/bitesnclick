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

  /* =========================
     ADMIN ROUTE PROTECTION
  ========================= */
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }

    const isValid = await verifyAdminSession(token);

    if (!isValid) {
      // ❗ DO NOT DELETE COOKIE HERE (causes vanishing bug)
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
  }

  /* =========================
     LOGIN PAGE PROTECTION
  ========================= */
  if (isLoginRoute && token) {
    const isValid = await verifyAdminSession(token);

    if (isValid) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    // ❗ ONLY delete cookie here (safe location)
    const response = NextResponse.next();
    response.cookies.delete("admin_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
