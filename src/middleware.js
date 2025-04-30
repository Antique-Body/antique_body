import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  const userRole = token?.role?.toLowerCase();

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

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

  // 4. Role-based routing
  if (userRole === "trainer") {
    if (pathname !== "/trainer/dashboard") {
      return NextResponse.redirect(new URL("/trainer/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (userRole === "client") {
    if (pathname !== "/client/dashboard") {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (userRole === "user") {
    const hasPreferences = token?.hasCompletedTrainingSetup;
    const targetPath = hasPreferences ? "/user/dashboard" : "/user/training-setup";

    if (pathname !== targetPath) {
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
    return NextResponse.next();
  }

  // Default fallback
  return NextResponse.next();
}

// Configure middleware to run on all routes except static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
