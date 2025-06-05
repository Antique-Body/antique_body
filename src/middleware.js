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

function getRedirectUrl(role, token, pathname, url) {
  if (!role) return pathname === "/select-role" ? null : "/select-role";
  if (role === "client") {
    if (!token.clientProfile)
      return pathname === "/client/personal-details"
        ? null
        : "/client/personal-details";
    return pathname === "/client/dashboard" ? null : "/client/dashboard";
  }
  if (role === "trainer") {
    if (!token.trainerProfile)
      return pathname === "/trainer/personal-details"
        ? null
        : "/trainer/personal-details";
    return pathname === "/trainer/dashboard" ? null : "/trainer/dashboard";
  }
  return null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  console.log(token, "token");

  // Log samo za page navigacije
  if (isPageNavigation(request)) {
    // console.log("token u middleware:", token, "pathname:", pathname);
  }

  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  if (AUTH_PATHS.includes(pathname) && token?.role) {
    const redirect = getRedirectUrl(token.role, token, pathname, request.url);
    if (redirect) return NextResponse.redirect(new URL(redirect, request.url));
    return NextResponse.next();
  }

  if (AUTH_PATHS.includes(pathname)) return NextResponse.next();

  if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));

  const redirect = getRedirectUrl(token.role, token, pathname, request.url);
  if (redirect) return NextResponse.redirect(new URL(redirect, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Sve osim API ruta, statike, slika i favicon-a
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
