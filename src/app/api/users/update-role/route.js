import { NextResponse } from "next/server";

import { userService } from "@/app/api/users/services";
import { isAuthenticated } from "@/lib/auth";
import { validateRoleUpdate } from "@/middleware/validation";

export async function PATCH(request) {
  try {
    const { authenticated, user } = await isAuthenticated(request);

    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();

    // Validacija
    const validation = validateRoleUpdate(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    try {
      const updatedUser = await userService.updateUserRole(
        { id: data.userId },
        data.role,
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
        { error: "Failed to update role", details: error.message },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while processing the request",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
