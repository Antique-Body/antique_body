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
    const exists = response.status === 200;
    return exists;
  } catch {
    return false;
  }
}

// Check if request is part of OAuth callback flow
function isOAuthCallback(request) {
  const { pathname, searchParams } = request.nextUrl;
  const isCallback =
    pathname.includes("/api/auth/callback/") ||
    searchParams.has("code") ||
    searchParams.has("state");
  return isCallback;
}

function getDashboardRedirect(token) {
  let redirect;
  if (token.role === "client") {
    redirect = token.clientProfile
      ? "/client/dashboard"
      : "/client/personal-details";
  } else if (token.role === "trainer") {
    redirect = token.trainerProfile
      ? "/trainer/dashboard"
      : "/trainer/personal-details";
  } else {
    redirect = "/select-role";
  }
  return redirect;
}

function getOnboardingRedirect(role, token, pathname) {
  if (!role) {
    const redirect = pathname === "/select-role" ? null : "/select-role";
    return redirect;
  }

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
        "/trainer/dashboard/clients/:id",
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
        "/trainer/dashboard/clients/:id/plans/:planId",
      ],
      fallback: "/trainer/dashboard",
    },
  }[role];

  if (!config) {
    return "/select-role";
  }

  if (!config.profile) {
    const redirect = pathname === config.personal ? null : config.personal;
    return redirect;
  }

  // Check if request path is allowed
  const isAllowed = config.allowed.some((allowedPath) => {
    if (allowedPath.includes(":")) {
      // Replace all :nekiParam with [^/]+
      const regex = new RegExp(
        `^${allowedPath.replace(/:([a-zA-Z0-9_]+)/g, "[^/]+")}$`,
        "i"
      );
      return regex.test(pathname);
    }
    return allowedPath === pathname;
  });

  const redirect = isAllowed ? null : config.fallback;
  return redirect;
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

  // 1. Public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. /select-role
  if (pathname === "/select-role") {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (token.sub && token.email && !isOAuthFlow) {
      const userExists = await checkUserExistsInDB(request);
      if (!userExists) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
    if (token.role) {
      const redirect = getDashboardRedirect(token);
      return NextResponse.redirect(new URL(redirect, request.url));
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
    if (!userExists) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 5. Auth pages
  if (["/auth/login", "/auth/register", ...AUTH_PATHS].includes(pathname)) {
    const redirect = getDashboardRedirect(token);
    return NextResponse.redirect(new URL(redirect, request.url));
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
