import { NextResponse } from "next/server";

import { userService } from "@/services/users";

// Get a user by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await userService.findUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// Update a user by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const user = await userService.updateUser(id, body);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete a user by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await userService.deleteUser(id);
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
