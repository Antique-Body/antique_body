import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { userService } from "@/app/api/users/services";

export async function GET() {
  try {
    const session = await auth();
    console.log("[users/me][GET] session:", session);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userService.findUserById(session.user.id);

    console.log("[users/me] user:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    console.log("[users/me][PATCH] session:", session);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();

    // Validate update data
    const { validateUserUpdate } = await import("@/middleware/validation");
    const validation = validateUserUpdate(data);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    try {
      // Update user using the service
      const updatedUser = await userService.updateUserProfile(
        session.user.id,
        data
      );

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
      { status: 500 }
    );
  }
}
