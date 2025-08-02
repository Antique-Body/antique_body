import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        trainerInfo: true,
        clientInfo: true,
      },
    });

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
      // Update user directly
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data,
        include: {
          trainerInfo: true,
          clientInfo: true,
        },
      });

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
