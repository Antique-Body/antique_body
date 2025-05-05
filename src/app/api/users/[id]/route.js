import { NextResponse } from "next/server";

import { isAuthenticated, hasRole } from "@/middleware/auth";
import { validateUserUpdate } from "@/middleware/validation";
import { userService } from "@/services/users";

// Get a user by ID
export async function GET(request, { params }) {
    try {
        // Check if user is authenticated and has appropriate role
        const roleCheck = await hasRole(request, ["ADMIN"]);

        if (!roleCheck.authorized) {
            return NextResponse.json({ error: roleCheck.message }, { status: 401 });
        }

        const userId = params.id;

        try {
            // Get user using the service
            const user = await userService.getUserById(userId);

            return NextResponse.json(user);
        } catch (error) {
            if (error.message === "User not found") {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            throw error;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "An error occurred while fetching user" }, { status: 500 });
    }
}

// Update a user by ID
export async function PATCH(request, { params }) {
    try {
        // Check if user is authenticated and has appropriate role
        const roleCheck = await hasRole(request, ["ADMIN"]);

        if (!roleCheck.authorized) {
            return NextResponse.json({ error: roleCheck.message }, { status: 401 });
        }

        const userId = params.id;
        const data = await request.json();

        // Validate the input
        const validation = validateUserUpdate(data);

        if (!validation.valid) {
            return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
        }

        try {
            // Update user using the service
            const updatedUser = await userService.updateUserProfile(userId, data);

            return NextResponse.json({
                message: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            if (error.message === "User not found") {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            if (error.message === "Email already in use") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            throw error;
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "An error occurred while updating user" }, { status: 500 });
    }
}

// Delete a user by ID
export async function DELETE(request, { params }) {
    try {
        // Check if user is authenticated and has appropriate role
        const roleCheck = await hasRole(request, ["ADMIN"]);

        if (!roleCheck.authorized) {
            return NextResponse.json({ error: roleCheck.message }, { status: 401 });
        }

        const userId = params.id;

        try {
            // Delete user using the service
            await userService.deleteUser(userId);

            return NextResponse.json({
                message: "User deleted successfully",
            });
        } catch (error) {
            if (error.message === "User not found") {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            throw error;
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "An error occurred while deleting user" }, { status: 500 });
    }
}
