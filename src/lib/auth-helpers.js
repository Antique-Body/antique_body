import { auth } from "../../auth";

export async function isAuthenticated(request) {
  const session = await auth(request);
  if (!session) return { authenticated: false };
  return { authenticated: true, user: session.user };
}

export async function hasRole(request, allowedRoles) {
  const { authenticated, user } = await isAuthenticated(request);
  if (!authenticated)
    return { authorized: false, message: "Not authenticated" };
  if (!user?.role)
    return { authorized: false, message: "User has no role assigned" };
  if (allowedRoles.includes(user.role)) return { authorized: true, user };
  return {
    authorized: false,
    message: "You don't have permission to access this resource",
  };
}
