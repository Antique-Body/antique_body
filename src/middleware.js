import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Definiranje ruta i uloga
    const publicRoutes = ["/", "/auth/login", "/auth/register"];
    const protectedPrefixes = [
        "/user-dashboard",
        "/trainer-registration",
        "/trainer/personal-details",
        "/trainer/dashboard",
        "/client/personal-details",
        "/client/dashboard",
        "/admin-dashboard",
    ];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isRoleSelectionRoute = pathname === "/select-role";
    const userRole = token?.role?.toLowerCase();
    const dashboardUrls = {
        trainer: "/trainer/personal-details",
        client: "/client/personal-details",
        admin: "/admin-dashboard",
        user: "/user-dashboard",
    };

    // Provjeri je li ruta pod nekim zaštićenim prefiksom
    const matchesProtectedPrefix = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

    // Provjeri je li ruta jedna od poznatih ruta
    const isKnownRoute = isPublicRoute || isRoleSelectionRoute || matchesProtectedPrefix;

    // Rukovanje nepostojecim rutama - ako ruta nije poznata
    if (!isKnownRoute) {
        // Ako korisnik ima ulogu, preusmeri na odgovarajući dashboard
        if (userRole && dashboardUrls[userRole]) {
            return NextResponse.redirect(new URL(dashboardUrls[userRole], request.url));
        }
        // Ako korisnik nije prijavljen, preusmeri na početnu stranicu
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 1. Korisnik nije autentificiran
    if (!token) {
        return isPublicRoute ? NextResponse.next() : NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 2. Korisnik je autentificiran ali pokušava pristupiti javnim rutama ili odabiru uloge
    if (userRole && (isPublicRoute || isRoleSelectionRoute)) {
        const dashboardUrl = dashboardUrls[userRole];
        if (dashboardUrl) {
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
    }

    // 3. Korisnik nema ulogu, a pokušava pristupiti zaštićenim rutama
    if (!userRole && !isPublicRoute && !isRoleSelectionRoute) {
        return NextResponse.redirect(new URL("/select-role", request.url));
    }
    return NextResponse.next();
  }

  if (userRole === "user") {
    const hasPreferences = token?.hasCompletedTrainingSetup;
    const targetPath = hasPreferences ? "/user/dashboard" : "/user/training-setup";
    
    // Allow access to both training-setup and dashboard for users
    if (pathname.startsWith("/user/")) {
      return NextResponse.next();
    }
    
    // Redirect to appropriate path if not already there
    if (pathname !== targetPath) {
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
    return NextResponse.next();
  }

  // Check if the request is for email verification
  if (pathname.startsWith('/api/email-verification')) {
    // Let the request continue to the API route
    return NextResponse.next();
  }

  // Default fallback
  return NextResponse.next();
}

// Configure middleware to run on all routes except static files and API routes
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
