import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  const userRole = token?.role?.toLowerCase();

  // Public routes that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/reset-password", "/auth/verify-email"];

  // Check if the current path starts with any of the public paths
  const isPublicRoute = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}?`));

  // Handle routes for verification and reset password that have query parameters
  if (pathname.startsWith("/auth/reset-password") || pathname.startsWith("/auth/verify-email")) {
    return NextResponse.next();
  }

  // // 1. Handle public routes
  // if (isPublicRoute) {
  //   return NextResponse.next();
  // }

  // // 2. Handle unauthenticated users
  // if (!token) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  // // 3. Handle users without a role
  // if (!userRole) {
  //   if (pathname !== "/select-role") {
  //     return NextResponse.redirect(new URL("/select-role", request.url));
  //   }
  //   return NextResponse.next();
  // }

  // // // 4. Role-based routing
  // // if (userRole === "trainer") {
  // //   if (pathname !== "/trainer/personal-details") {
  // //     return NextResponse.redirect(new URL("/trainer/personal-details", request.url));
  // //   }
  // //   return NextResponse.next();
  // // }

  // // if (userRole === "client") {
  // //   if (pathname !== "/client/personal-details") {
  // //     return NextResponse.redirect(new URL("/client/personal-details", request.url));
  // //   }
  // //   return NextResponse.next();
  // // }

  // if (userRole === "user") {
  //   const hasPreferences = token?.hasCompletedTrainingSetup;
  //   const targetPath = hasPreferences ? "/user/dashboard" : "/user/training-setup";

  //   // Allow access to both training-setup and dashboard for users
  //   if (pathname.startsWith("/user/")) {
  //     return NextResponse.next();
  //   }

  //   // Redirect to appropriate path if not already there
  //   if (pathname !== targetPath) {
  //     return NextResponse.redirect(new URL(targetPath, request.url));
  //   }
  //   return NextResponse.next();
  // }

  // // Check if the request is for email verification
  // if (pathname.startsWith("/api/email-verification")) {
  //   // Let the request continue to the API route
  //   return NextResponse.next();
  // }

  // Default fallback
  return NextResponse.next();
}

// Configure middleware to run on all routes except static files and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
