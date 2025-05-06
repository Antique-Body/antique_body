import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;
    const userRole = token?.role?.toLowerCase();

    // Public routes that don't require authentication
    const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/reset-password", "/auth/verify-email"];

    // Check if the current path starts with any of the public paths
    const isPublicRoute = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}?`));

    // Handle routes for verification and reset password that have query parameters
    if (pathname.startsWith("/auth/reset-password") || pathname.startsWith("/auth/verify-email")) {
        return NextResponse.next();
    }

    // 1. Handle public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // 2. Handle unauthenticated users
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 3. Handle users without a role
    if (!userRole) {
        if (pathname !== "/select-role") {
            return NextResponse.redirect(new URL("/select-role", request.url));
        }
        return NextResponse.next();
    }

    // Define valid routes for each role
    const validRoutes = {
        trainer: ["/trainer/dashboard"],
        client: ["/client/dashboard"],
        user: ["/user/dashboard", "/user/training-setup"]
    };

    // Check if the current path is valid for the user's role
    const isValidRoute = validRoutes[userRole]?.some(route => pathname.startsWith(route));

    // If the route is not valid, let the catch-all route handle it
    if (!isValidRoute) {
        return NextResponse.next();
    }

    // If we get here, the route is valid for the user's role
    return NextResponse.next();
}

// Configure middleware to run on all routes except static files and API routes
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};
