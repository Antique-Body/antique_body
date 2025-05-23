import { isAuthenticated } from "@/middleware/auth";
import { validateRoleUpdate } from "@/middleware/validation";
import { userService } from "@/services/users";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const { authenticated, user } = await isAuthenticated(request);

    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();

    // Validate the input
    const validation = validateRoleUpdate(data);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    try {
      const updatedUser = await userService.updateUserRole(
        data.userId,
        data.role
      );

      return NextResponse.json({
        message: "Role updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to update role" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
