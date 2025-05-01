import { NextResponse } from "next/server";
import { isAuthenticated } from "@/middleware/auth";
import { validateRoleUpdate } from "@/middleware/validation";
import { userService } from "@/services/users";

export async function PATCH(request) {
  try {
    const { authenticated, user } = await isAuthenticated(request);

    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received data:", data);

    // Validate the input
    const validation = validateRoleUpdate(data);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    try {
      // Pretpostavljamo da userService ima metodu za nalaženje korisnika po email-u
      // Ako nema, morate dodati takvu metodu u userService
      const dbUser = await userService.findUserByEmail(data.email);

      if (!dbUser) {
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 404 }
        );
      }

      // Sada koristimo ID iz baze za ažuriranje
      const updatedUser = await userService.updateUserRole(
        dbUser.id,
        data.role
      );

      return NextResponse.json({
        message: "Role updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Service error details:", error);

      if (error.message === "User not found" || error.code === "P2025") {
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: "Service error",
          details: error.message || "Unknown error in service",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      {
        error: "An error occurred while updating role",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
