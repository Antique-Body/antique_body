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

// Check if user exists in database via existing /me API endpoint
async function checkUserExistsInDB(request) {
  try {
    const url = `${request.nextUrl.origin}/api/users/me`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

// Check if request is part of OAuth callback flow
function isOAuthCallback(request) {
  const { pathname, searchParams } = request.nextUrl;
  return (
    pathname.includes("/api/auth/callback/") ||
    searchParams.has("code") ||
    searchParams.has("state")
  );
}

// Check if request might be coming right after OAuth callback
function isPostOAuthRedirect(request) {
  const referer = request.headers.get("referer");
  return (
    (referer && referer.includes("/api/auth/callback/")) ||
    (referer &&
      (referer.includes("accounts.google.com") ||
        referer.includes("facebook.com") ||
        referer.includes("oauth")))
  );
}

// Check if user has NextAuth session cookies (even if JWT token is not ready yet)
function hasSessionCookies(request) {
  const cookies = request.headers.get("cookie") || "";
  return (
    cookies.includes("next-auth.session-token") ||
    cookies.includes("__Secure-next-auth.session-token") ||
    cookies.includes("authjs.session-token") ||
    cookies.includes("__Secure-authjs.session-token") ||
    cookies.includes("next-auth.callback-url") ||
    cookies.includes("__Secure-next-auth.callback-url") ||
    cookies.includes("authjs.callback-url") ||
    cookies.includes("__Secure-authjs.callback-url") ||
    cookies.includes("authjs.pkce.code_verifier") ||
    cookies.includes("__Secure-authjs.pkce.code_verifier")
  );
}

function getDashboardRedirect(token) {
  if (token.role === "client") {
    return token.clientProfile
      ? "/client/dashboard"
      : "/client/personal-details";
  }
  if (token.role === "trainer") {
    return token.trainerProfile
      ? "/trainer/dashboard"
      : "/trainer/personal-details";
  }
  return "/select-role";
}

function getOnboardingRedirect(role, token, pathname) {
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
        "/trainer/dashboard/plans/training",
        "/trainer/dashboard/plans/nutrition",
        "/trainer/dashboard/plans/training/create",
        "/trainer/dashboard/plans/training/edit/:id",
        "/trainer/dashboard/plans/nutrition/create",
        "/trainer/dashboard/plans/nutrition/edit/:id",
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
  // Check if request path is allowed
  const isAllowed = config.allowed.some((allowedPath) => {
    if (allowedPath.includes(":id")) {
      // Convert allowedPath to regex, e.g. "/trainer/dashboard/plans/edit/:id" => /^\/trainer\/dashboard\/plans\/edit\/[^\/]+$/
      const regex = new RegExp(`^${allowedPath.replace(":id", "[^/]+")}$`, "i");
      return regex.test(pathname);
    }
    return allowedPath === pathname;
  });
  return isAllowed ? null : config.fallback;
}

export async function middleware(request) {
  if (process.env.NODE_ENV_TYPE === "production") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isOAuthFlow = isOAuthCallback(request);
  const isPostOAuth = isPostOAuthRedirect(request);

  // 1. Public paths
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // 2. /select-role
  if (pathname === "/select-role") {
    if (!token) {
      if (isPostOAuth || hasSessionCookies(request)) return NextResponse.next();
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (token.sub && token.email && !isOAuthFlow) {
      const userExists = await checkUserExistsInDB(request);
      if (!userExists)
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (token.role) {
      return NextResponse.redirect(
        new URL(getDashboardRedirect(token), request.url)
      );
    }
    return NextResponse.next();
  }

  // 3. Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 4. User must exist in DB
  if (token.sub && token.email && !isOAuthFlow) {
    const userExists = await checkUserExistsInDB(request);
    if (!userExists)
      return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 5. Auth pages
  if (["/auth/login", "/auth/register", ...AUTH_PATHS].includes(pathname)) {
    return NextResponse.redirect(
      new URL(getDashboardRedirect(token), request.url)
    );
  }

  // 6. Onboarding/dashboard redirect
  const onboardingRedirect = getOnboardingRedirect(token.role, token, pathname);
  if (onboardingRedirect) {
    return NextResponse.redirect(new URL(onboardingRedirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // All except API routes, static files, images and favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
