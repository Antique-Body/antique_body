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
    console.log(`[Middleware] Checking user existence at: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    console.log(
      `[Middleware] /api/users/me response status: ${response.status}`
    );
    const exists = response.status === 200;
    console.log(`[Middleware] User exists in DB: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`[Middleware] Error checking user existence:`, error);
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

  console.log(`[Middleware] OAuth callback check:`, {
    pathname,
    hasCode: searchParams.has("code"),
    hasState: searchParams.has("state"),
    isCallback,
  });

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

  console.log(`[Middleware] Dashboard redirect:`, {
    role: token.role,
    clientProfile: token.clientProfile,
    trainerProfile: token.trainerProfile,
    redirect,
  });

  return redirect;
}

function getOnboardingRedirect(role, token, pathname) {
  console.log(`[Middleware] Onboarding redirect check:`, {
    role,
    pathname,
    clientProfile: token.clientProfile,
    trainerProfile: token.trainerProfile,
  });

  if (!role) {
    const redirect = pathname === "/select-role" ? null : "/select-role";
    console.log(`[Middleware] No role - redirect: ${redirect}`);
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
        "/trainer/dashboard/plans/:id/track",
        "/trainer/dashboard/exercises",
        "/trainer/dashboard/meals",
        "/trainer/edit-profile",
        "/trainer/dashboard/clients/:id/plans/:planId",
      ],
      fallback: "/trainer/dashboard",
    },
  }[role];

  if (!config) {
    console.log(
      `[Middleware] No config for role ${role} - redirecting to /select-role`
    );
    return "/select-role";
  }

  if (!config.profile) {
    const redirect = pathname === config.personal ? null : config.personal;
    console.log(
      `[Middleware] No profile for role ${role} - redirect: ${redirect}`
    );
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
  console.log(`[Middleware] Path allowed: ${isAllowed}, redirect: ${redirect}`);
  return redirect;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const { searchParams } = request.nextUrl;

  // Comprehensive debugging
  console.log("=== MIDDLEWARE DEBUG START ===");
  console.log(`[Middleware] Path: ${pathname}`);
  console.log(`[Middleware] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[Middleware] URL: ${request.url}`);
  console.log(`[Middleware] Method: ${request.method}`);
  console.log(
    `[Middleware] Search params:`,
    Object.fromEntries(searchParams.entries())
  );

  // Debug headers
  const cookieHeader = request.headers.get("cookie");
  console.log(`[Middleware] Cookie header exists: ${!!cookieHeader}`);
  if (cookieHeader) {
    console.log(`[Middleware] Cookie header length: ${cookieHeader.length}`);
    console.log(
      `[Middleware] Cookie header preview: ${cookieHeader.substring(0, 100)}...`
    );
  }

  // Debug environment variables
  console.log(`[Middleware] AUTH_SECRET exists: ${!!process.env.AUTH_SECRET}`);
  console.log(
    `[Middleware] AUTH_SECRET length: ${process.env.AUTH_SECRET?.length || 0}`
  );
  console.log(`[Middleware] NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
  console.log(`[Middleware] NEXTAUTH_SECRET: ${!!process.env.NEXTAUTH_SECRET}`);
  console.log(`[Middleware] Request origin: ${request.nextUrl.origin}`);
  console.log(
    `[Middleware] URL mismatch: ${process.env.NEXTAUTH_URL !== request.nextUrl.origin}`
  );

  // Set correct NEXTAUTH_URL if it doesn't match
  if (process.env.NEXTAUTH_URL !== request.nextUrl.origin) {
    console.log(`[Middleware] Fixing NEXTAUTH_URL mismatch`);
    process.env.NEXTAUTH_URL = request.nextUrl.origin;
  }

  try {
    // Debug cookie details
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      console.log(`[Middleware] All cookies:`, cookies);

      // Look for NextAuth cookies
      const nextAuthCookies = cookies.filter((c) => c.startsWith("next-auth."));
      console.log(`[Middleware] NextAuth cookies:`, nextAuthCookies);

      // Look for AuthJS cookies
      const authjsCookies = cookies.filter((c) => c.includes("authjs."));
      console.log(`[Middleware] AuthJS cookies:`, authjsCookies);

      // Check for session token specifically
      const sessionTokenCookie = cookies.find((c) =>
        c.includes("session-token")
      );
      if (sessionTokenCookie) {
        console.log(
          `[Middleware] Session token cookie found:`,
          sessionTokenCookie.substring(0, 50) + "..."
        );
      }
    }

    // Try to get token with different approaches
    let token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // If no token, try with explicit cookie name
    if (!token) {
      console.log(`[Middleware] Trying with explicit cookie name...`);
      const sessionToken =
        request.cookies.get("__Secure-authjs.session-token") ||
        request.cookies.get("authjs.session-token");

      if (sessionToken) {
        console.log(
          `[Middleware] Found session token cookie: ${sessionToken.name}`
        );
        console.log(
          `[Middleware] Session token value: ${sessionToken.value.substring(0, 50)}...`
        );
        try {
          token = await getToken({
            req: request,
            secret: process.env.AUTH_SECRET,
            secureCookie: true,
          });
        } catch (error) {
          console.error(`[Middleware] Error decoding token:`, error);
        }
      } else {
        console.log(`[Middleware] No session token cookie found`);
      }
    }

    console.log(`[Middleware] Token obtained successfully: ${!!token}`);
    if (token) {
      console.log(`[Middleware] Token details:`, {
        id: token.id,
        role: token.role,
        email: token.email,
        sub: token.sub,
        iat: token.iat,
        exp: token.exp,
      });
    } else {
      console.log(`[Middleware] No token found`);

      // Try with different secret
      console.log(`[Middleware] Trying with NEXTAUTH_SECRET...`);
      const tokenWithNextAuthSecret = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      console.log(
        `[Middleware] Token with NEXTAUTH_SECRET: ${!!tokenWithNextAuthSecret}`
      );
    }

    const isOAuthFlow = isOAuthCallback(request);
    console.log(`[Middleware] Is OAuth callback: ${isOAuthFlow}`);

    // 1. Public paths
    if (PUBLIC_PATHS.includes(pathname)) {
      console.log(`[Middleware] Public path - allowing access`);
      console.log("=== MIDDLEWARE DEBUG END ===");
      return NextResponse.next();
    }

    // 2. /select-role
    if (pathname === "/select-role") {
      console.log(`[Middleware] Processing /select-role`);
      if (!token) {
        console.log(`[Middleware] No token - redirecting to login`);
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      if (token.sub && token.email && !isOAuthFlow) {
        console.log(`[Middleware] Checking if user exists in DB`);
        const userExists = await checkUserExistsInDB(request);
        console.log(`[Middleware] User exists in DB: ${userExists}`);
        if (!userExists) {
          console.log(`[Middleware] User not in DB - redirecting to login`);
          return NextResponse.redirect(new URL("/auth/login", request.url));
        }
      }
      if (token.role) {
        const redirect = getDashboardRedirect(token);
        console.log(
          `[Middleware] User has role ${token.role} - redirecting to ${redirect}`
        );
        return NextResponse.redirect(new URL(redirect, request.url));
      }
      console.log(`[Middleware] No role - allowing access to /select-role`);
      return NextResponse.next();
    }

    // 3. Not logged in
    if (!token) {
      console.log(`[Middleware] No token - redirecting to login`);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 4. User must exist in DB
    if (token.sub && token.email && !isOAuthFlow) {
      console.log(
        `[Middleware] Checking if user exists in DB for protected route`
      );
      const userExists = await checkUserExistsInDB(request);
      console.log(`[Middleware] User exists in DB: ${userExists}`);
      if (!userExists) {
        console.log(`[Middleware] User not in DB - redirecting to login`);
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }

    // 5. Auth pages
    if (["/auth/login", "/auth/register", ...AUTH_PATHS].includes(pathname)) {
      const redirect = getDashboardRedirect(token);
      console.log(
        `[Middleware] User on auth page - redirecting to ${redirect}`
      );
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    // 6. Onboarding/dashboard redirect
    const onboardingRedirect = getOnboardingRedirect(
      token.role,
      token,
      pathname
    );
    if (onboardingRedirect) {
      console.log(
        `[Middleware] Onboarding redirect needed: ${onboardingRedirect}`
      );
      return NextResponse.redirect(new URL(onboardingRedirect, request.url));
    }

    console.log(`[Middleware] All checks passed - allowing access`);
    console.log("=== MIDDLEWARE DEBUG END ===");

    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Error:`, error);
    console.log(`[Middleware] Falling back to login redirect`);
    console.log("=== MIDDLEWARE DEBUG END (ERROR) ===");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    // All except API routes, static files, images and favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
