import { NextResponse } from "next/server";

import { hasRole } from "@/middleware/auth";
import { validateTrainingSetup } from "@/middleware/validation";
import { userService } from "@/services/users";

export async function POST(request) {
  try {
    // Check if user is authenticated and has trainer role
    const roleCheck = await hasRole(request, ["USER"]);

    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.message }, { status: 401 });
    }

    const data = await request.json();

    // Validate the input
    const validation = validateTrainingSetup(data);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    try {
      // Setup training profile using the service
      const updatedUser = await userService.setupTrainingProfile(
        roleCheck.user.id,
        data
      );

      return NextResponse.json({
        message: "Training profile set up successfully",
        user: updatedUser,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      throw error;
    }
  } catch (error) {
    console.error("Error setting up training profile:", error);
    return NextResponse.json(
      { error: "An error occurred while setting up training profile" },
      { status: 500 }
    );
  }
}
