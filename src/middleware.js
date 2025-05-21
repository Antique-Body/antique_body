import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
  ];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Special handling for select-role page
  if (pathname === "/select-role") {
    // If user already has a role, redirect to appropriate dashboard
    if (token.role) {
      const rolePaths = {
        trainer: "/trainer/dashboard",
        client: "/client/dashboard",
        user: "/user/dashboard",
      };
      const targetPath = rolePaths[token.role.toLowerCase()];
      if (targetPath) {
        return NextResponse.redirect(new URL(targetPath, request.url));
      }
    }
    // If no role, allow access to select-role page
    return NextResponse.next();
  }

  // Handle role-based access for other pages
  const userRole = token.role?.toLowerCase();
  if (!userRole) {
    return NextResponse.redirect(new URL("/select-role", request.url));
  }

  // Role-based routing
  const rolePaths = {
    trainer: "/trainer/dashboard",
    client: "/client/dashboard",
    user: "/user/dashboard",
  };

  const targetPath = rolePaths[userRole];
  if (targetPath && !pathname.startsWith(targetPath)) {
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
