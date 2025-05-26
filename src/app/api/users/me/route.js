import { userService } from "@/app/api/users/services";
import { auth, isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userService.findUserById(session.user.id);
    const user = await userService.findUserById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 },
    );
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
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
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
    return NextResponse.json(
      { error: "An error occurred while updating user data" },
      { status: 500 },
    );
  }
}
