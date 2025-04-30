import { PrismaClient, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Define valid roles based on the Prisma schema
const VALID_ROLES = Object.values(UserRole);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role } = await req.json();

    if (email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate role
    const normalizedRole = role.toLowerCase();
    if (!role || !VALID_ROLES.includes(normalizedRole)) {
      return NextResponse.json({ error: "Invalid role. Must be one of: " + VALID_ROLES.join(", ") }, { status: 400 });
    }

    // Update the user's role using Prisma's type-safe update method
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: normalizedRole },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating role:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
