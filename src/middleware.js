import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/", "/contact", "/trainers-marketplace", "/auth/reset-password"];
const AUTH_PATHS = ["/auth/login", "/auth/register"];

function isPageNavigation(request) {
    return request.headers.get("accept")?.includes("text/html");
}

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Log samo za page navigacije
    if (isPageNavigation(request)) {
        // eslint-disable-next-line no-console
        console.log("token u middleware:", token, "pathname:", pathname);
    }

    // 1. Ako nije loginovan (nema token)
    if (!token) {
        // Dozvoli pristup samo na login/register/reset-password/public
        if (PUBLIC_PATHS.includes(pathname)) {
            return NextResponse.next();
        }
        // Sve ostalo redirect na login
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 2. Ako je loginovan, ali nema role
    const userRole = token.role?.toLowerCase();
    if (!userRole) {
        // Dozvoli pristup samo na /select-role
        if (pathname === SELECT_ROLE_PATH) {
            return NextResponse.next();
        }
        // Sve ostalo redirect na /select-role
        return NextResponse.redirect(new URL(SELECT_ROLE_PATH, request.url));
    }

    // 3. Ako ima role
    const dashboardPath = `/${userRole}/personal-details`;
    if (pathname !== dashboardPath) {
        return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Ako je već na svom dashboardu, pusti ga
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Sve osim API ruta, statike, slika i favicon-a
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
