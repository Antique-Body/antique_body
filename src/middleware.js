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

    // // 1. Public paths: svi mogu pristupiti
    // if (PUBLIC_PATHS.includes(pathname)) {
    //     return NextResponse.next();
    // }

    // // 2. Ako korisnik ima token i rolu i pokušava na /auth/login ili /auth/register, redirectaj ga na dashboard
    // if (AUTH_PATHS.includes(pathname) && token?.role) {
    //     const dashboardPath = `/${token.role.toLowerCase()}/dashboard`;
    //     return NextResponse.redirect(new URL(dashboardPath, request.url));
    // }

    // // 3. Auth paths: svi mogu pristupiti ako nisu prijavljeni
    // if (AUTH_PATHS.includes(pathname)) {
    //     return NextResponse.next();
    // }

    // // 4. Ako nema token, redirect na login
    // if (!token) {
    //     return NextResponse.redirect(new URL("/auth/login", request.url));
    // }

    // // 5. Ako nema rolu, pusti samo na /select-role, inače redirect na /select-role
    // const userRole = token.role?.toLowerCase();
    // if (!userRole) {
    //     if (pathname === "/select-role") {
    //         return NextResponse.next();
    //     }
    //     return NextResponse.redirect(new URL("/select-role", request.url));
    // }

    // // 6. Ako ima rolu i nije na svom dashboardu, redirectaj ga na dashboard
    // const dashboardPath = `/${userRole}/dashboard`;
    // if (pathname !== dashboardPath) {
    //     return NextResponse.redirect(new URL(dashboardPath, request.url));
    // }

    // 7. Ako je već na svom dashboardu, pusti ga
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Sve osim API ruta, statike, slika i favicon-a
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
