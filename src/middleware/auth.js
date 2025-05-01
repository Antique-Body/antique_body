import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Check if the user is authenticated
export const isAuthenticated = async (req) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { authenticated: false };
    }

    return {
        authenticated: true,
        user: session.user,
    };
};

// Check if the user has a specific role
export const hasRole = async (req, allowedRoles) => {
    const { authenticated, user } = await isAuthenticated(req);

    if (!authenticated) {
        return { authorized: false, message: "Not authenticated" };
    }

    if (!user.role) {
        return { authorized: false, message: "User has no role assigned" };
    }

    if (allowedRoles.includes(user.role)) {
        return { authorized: true, user };
    }

    return {
        authorized: false,
        message: "You don't have permission to access this resource",
    };
};
