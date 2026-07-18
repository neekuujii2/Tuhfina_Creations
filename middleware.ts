import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "Tuhfinacreations@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase());

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAdminRoute = pathname.startsWith("/admin");
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isProtectedRoute = isAdminRoute || isDashboardRoute;

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // Get session token from cookies
    const sessionCookie = request.cookies.get("tuhfina.session_token")?.value
        || request.cookies.get("better-auth.session_token")?.value;

    if (!sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Decode the JWT session token to get user info
        const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "fallback-secret");
        const { payload } = await jwtVerify(sessionCookie, secret, {
            algorithms: ["HS256"],
        });

        const userEmail = (payload.email as string || "").toLowerCase();
        const userRole = payload.role as string || "USER";

        // For admin routes, check if user is admin
        if (isAdminRoute) {
            const isAdmin = ADMIN_EMAILS.includes(userEmail) || userRole === "ADMIN";
            if (!isAdmin) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }
    } catch {
        // Invalid token - redirect to login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"],
};
