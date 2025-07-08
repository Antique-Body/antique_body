import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // 'client' or 'trainer'

    if (role !== "client") {
      return NextResponse.json(
        {
          success: false,
          error: "Role parameter must be 'client'",
        },
        { status: 400 }
      );
    }

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { success: false, error: "Client profile not found" },
        { status: 404 }
      );
    }

    // Get active cooldowns (not expired)
    const activeCooldowns = await prisma.coachingRequestCooldown.findMany({
      where: {
        clientId: clientInfo.id,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        trainer: {
          include: {
            trainerProfile: true,
          },
        },
      },
      orderBy: { expiresAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: activeCooldowns,
    });
  } catch (error) {
    console.error("Error fetching cooldowns:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
