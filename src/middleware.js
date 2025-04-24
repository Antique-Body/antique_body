import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Protected routes that require authentication
  const protectedRoutes = [
    "/select-role",
    "/user-dashboard",
    "/trainer-dashboard",
    "/workout-plan",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access a protected route
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is authenticated and trying to access public routes
  if (token && isPublicRoute) {
    // Redirect based on user role
    if (token.role === "TRAINER") {
      return NextResponse.redirect(new URL("/trainer-dashboard", request.url));
    } else if (token.role === "SOLO") {
      return NextResponse.redirect(new URL("/user-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/select-role", request.url));
    }
  }

  // If user is authenticated but doesn't have a role and trying to access protected routes
  if (token && !token.role && isProtectedRoute && pathname !== "/select-role") {
    return NextResponse.redirect(new URL("/select-role", request.url));
  }

  return NextResponse.next();
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/select-role",
    "/user-dashboard/:path*",
    "/trainer-dashboard/:path*",
    "/workout-plan/:path*",
  ],
}; 