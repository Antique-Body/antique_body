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

    // 4. Provjera pristupa specifičnim dashboard rutama
    if (userRole) {
        for (const [role, url] of Object.entries(dashboardUrls)) {
            if (pathname.startsWith(url) && userRole !== role) {
                return NextResponse.redirect(new URL(dashboardUrls[userRole] || "/select-role", request.url));
            }
        }
    }

    // Dozvoli pristup traženoj ruti
    return NextResponse.next();
}

// Konfiguracija za middleware - uhvati SVE rute
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
