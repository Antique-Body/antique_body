import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/middleware/auth";
import { userService } from "@/services/users";

export async function GET(request) {
    try {
        const { authenticated, user } = await isAuthenticated(request);

        if (!authenticated) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

        try {
            // Get detailed user info using the service
            const userDetails = await userService.getUserById(user.id);

            return NextResponse.json(userDetails);
        } catch (error) {
            if (error.message === "User not found") {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            throw error;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "An error occurred while fetching user data" }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { authenticated, user } = await isAuthenticated(request);

        if (!authenticated) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const data = await request.json();

        // Validate update data
        const { validateUserUpdate } = await import("@/middleware/validation");
        const validation = validateUserUpdate(data);

        if (!validation.valid) {
            return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
        }

        try {
            // Update user using the service
            const updatedUser = await userService.updateUserProfile(user.id, data);

            return NextResponse.json(updatedUser);
        } catch (error) {
            if (error.message === "Email already in use") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            throw error;
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "An error occurred while updating user data" }, { status: 500 });
    }
}
