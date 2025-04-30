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

        // Validate the input
        const validation = validateRoleUpdate(data);

        if (!validation.valid) {
            return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
        }

        try {
            // Update user role using the service
            const updatedUser = await userService.updateUserRole(user.id, data.role);

            return NextResponse.json({
                message: "Role updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            if (error.message === "User not found") {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            throw error;
        }
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json({ error: "An error occurred while updating role" }, { status: 500 });
    }
}
