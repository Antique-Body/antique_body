import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/trainers-marketplace",
  "/trainers-marketplace/:path*",
  "/contact",
];
const AUTH_PATHS = ["/auth/reset-password"];

function isPageNavigation(request) {
  return request.headers.get("accept")?.includes("text/html");
}

// Check if user exists in database via existing /me API endpoint
async function checkUserExistsInDB(request) {
  try {
    const url = new URL("/api/users/me", request.url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    // If user exists and is found, status will be 200
    // If user doesn't exist, status will be 404
    // If not authenticated, status will be 401
    return response.status === 200;
  } catch (error) {
    console.error("[middleware] Error checking user in DB:", error);
    return false;
  }
}

// Check if request is part of OAuth callback flow
function isOAuthCallback(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Check for OAuth callback URLs
  if (pathname.includes("/api/auth/callback/")) {
    return true;
  }

  // Check for OAuth state or code parameters
  if (searchParams.has("code") || searchParams.has("state")) {
    return true;
  }

  return false;
}

// Check if request might be coming right after OAuth callback
function isPostOAuthRedirect(request) {
  const referer = request.headers.get("referer");

  // If referer contains OAuth callback URL, this might be post-OAuth redirect
  if (referer && referer.includes("/api/auth/callback/")) {
    return true;
  }

  return false;
}

// Check if user has NextAuth session cookies (even if JWT token is not ready yet)
function hasSessionCookies(request) {
  const cookies = request.headers.get("cookie") || "";

  // Check for NextAuth session cookies
  const hasSessionToken =
    cookies.includes("next-auth.session-token") ||
    cookies.includes("__Secure-next-auth.session-token");
  const hasCallbackUrl =
    cookies.includes("next-auth.callback-url") ||
    cookies.includes("__Secure-next-auth.callback-url");

  return hasSessionToken || hasCallbackUrl;
}

function getRedirectUrl(role, token, pathname) {
  if (!role) return pathname === "/select-role" ? null : "/select-role";

  const config = {
    client: {
      profile: token.clientProfile,
      personal: "/client/personal-details",
      allowed: [
        "/client/dashboard",
        "/client/dashboard/trainwithcoach",
        "/client/dashboard/overview",
        "/client/dashboard/upcoming-trainings",
        "/client/dashboard/trainings",
        "/client/dashboard/progress",
        "/client/dashboard/messages",
        "/client/dashboard/nutrition",
        "/client/dashboard/health",
        "/client/edit-profile",
      ],
      fallback: "/client/dashboard",
    },
    trainer: {
      profile: token.trainerProfile,
      personal: "/trainer/personal-details",
      allowed: [
        "/trainer/dashboard",
        "/trainer/dashboard/newclients",
        "/trainer/dashboard/clients",
        "/trainer/dashboard/upcoming-trainings",
        "/trainer/dashboard/messages",
        "/trainer/dashboard/plans",
        "/trainer/dashboard/exercises",
        "/trainer/dashboard/meals",
        "/trainer/edit-profile",
      ],
      fallback: "/trainer/dashboard",
    },
  }[role];

  if (!config) return "/select-role";
  if (!config.profile)
    return pathname === config.personal ? null : config.personal;
  return config.allowed.includes(pathname) ? null : config.fallback;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Skip user existence check during OAuth flow
  const isOAuthFlow = isOAuthCallback(request);
  const isPostOAuth = isPostOAuthRedirect(request);

  if (isPageNavigation(request)) {
    console.log("[middleware] Page navigation:", {
      pathname,
      hasToken: !!token,
      tokenId: token?.id,
      tokenEmail: token?.email,
      tokenRole: token?.role,
      isOAuthFlow,
      isPostOAuth,
      hasSessionCookies: hasSessionCookies(request),
      referer: request.headers.get("referer"),
    });
  }

  // 1. Public paths uvijek pusti
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // 1.1. /select-role je dostupno samo prijavljenima bez role
  if (pathname === "/select-role") {
    if (!token) {
      //  If this might be post-OAuth redirect and has session cookies, allow access
      if (isPostOAuth && hasSessionCookies(request)) {
        console.log(
          "[middleware] Post-OAuth redirect with session cookies detected, allowing access to /select-role"
        );
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Check if user exists in database - but only for fully authenticated users
    // Skip this check if user is in the middle of OAuth flow
    if (token.sub && token.email && !isOAuthFlow) {
      const userExists = await checkUserExistsInDB(request);
      if (!userExists) {
        console.log("[middleware] User not found in DB, redirecting to login");
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }

    if (token.role) {
      // Ako ima rolu, šalji ga na dashboard
      let redirectUrl = "/";
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
    // Ako je prijavljen i nema rolu, pusti daljefefeef
    return NextResponse.next();
  }

  // 2. Ako nema tokena, redirect na login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2.0. Check if user exists in database - but only for fully authenticated users
  // Skip this check if user is in the middle of OAuth flow or doesn't have email yet
  if (token.sub && token.email && !isOAuthFlow) {
    const userExists = await checkUserExistsInDB(request);
    if (!userExists) {
      console.log("[middleware] User not found in DB, redirecting to login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 2.1. Ako je logiran i pokušava na /auth/login ili /auth/register, redirectaj ga na dashboard/personal-details
  if (["/auth/login", "/auth/register"].includes(pathname)) {
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
    console.log("[middleware] Auth page access while logged in:", {
      pathname,
      token,
      redirectUrl,
    });
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 3. Auth paths uvijek pusti (ali ako je logiran, redirect na dashboard/personal-details)
  if (AUTH_PATHS.includes(pathname)) {
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

  // 4. Provjeri treba li usera redirectati na neku onboarding/dashboard stranicu
  const redirect = getRedirectUrl(token.role, token, pathname, request.url);
  if (redirect) {
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Sve osim API ruta, statike, slika i favicon-a
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
