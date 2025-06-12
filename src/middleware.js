import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/contact",
  "/trainers-marketplace",
  "/auth/reset-password",
];
const AUTH_PATHS = ["/auth/login", "/auth/register"];

function isPageNavigation(request) {
  return request.headers.get("accept")?.includes("text/html");
}

function getRedirectUrl(role, token, pathname, _url) {
  if (!role) return pathname === "/select-role" ? null : "/select-role";
  if (role === "client") {
    if (!token.clientProfile)
      return pathname === "/client/personal-details"
        ? null
        : "/client/personal-details";
    return pathname === "/client/dashboard" ? null : "/client/dashboard";
  }
  if (role === "trainer") {
    const allowedTrainerPaths = [
      "/trainer/dashboard",
      "/trainer/dashboard/newclients",
      "/trainer/edit-profile",
    ];
    if (!token.trainerProfile) {
      if (
        pathname === "/trainer/personal-details" ||
        pathname === "/trainer/edit-profile"
      ) {
        return null;
      }
      return "/trainer/personal-details";
    }
    // Ako ima profil, pusti samo dozvoljene rute
    if (!allowedTrainerPaths.includes(pathname)) {
      return "/trainer/dashboard";
    }
    return null;
  }
  return null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (isPageNavigation(request)) {
    // console.log("token u middleware:", token, "pathname:", pathname);
  }

  // 1. Public paths uvijek pusti
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // 2. Auth paths uvijek pusti (login, register, reset-password)
  if (AUTH_PATHS.includes(pathname)) {
    if (token) {
      let redirectUrl = "/select-role";
      if (token.role === "client") {
        redirectUrl = token.clientProfile
          ? "/client/dashboard"
          : "/client/personal-details";
      } else if (token.role === "trainer") {
        redirectUrl = token.trainerProfile
          ? "/trainer/dashboard"
          : "/trainer/personal-details";
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // 3. Ako nema tokena ili nema role, redirect na login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 4. Provjeri treba li usera redirectati na neku onboarding/dashboard stranicu
  const redirect = getRedirectUrl(token.role, token, pathname, request.url);
  if (redirect) {
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  // 5. Sve ok, pusti dalje
  console.log(
    "[middleware] Sve OK, dopuštam prolaz na:",
    pathname,
    "token:",
    token
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Sve osim API ruta, statike, slika i favicon-a
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
