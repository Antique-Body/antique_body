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
    let role = session?.user?.role || searchParams.get("role");
    let cooldowns = [];

    if (role === "client") {
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
      // Get active cooldowns (not expired) for client
      cooldowns = await prisma.coachingRequestCooldown.findMany({
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
    } else if (role === "trainer") {
      // Get trainer info
      const trainerInfo = await prisma.trainerInfo.findUnique({
        where: { userId: session.user.id },
      });
      if (!trainerInfo) {
        return NextResponse.json(
          { success: false, error: "Trainer profile not found" },
          { status: 404 }
        );
      }
      // Get active cooldowns (not expired) for trainer
      cooldowns = await prisma.coachingRequestCooldown.findMany({
        where: {
          trainerId: trainerInfo.id,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          client: true,
        },
        orderBy: { expiresAt: "asc" },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Role parameter must be 'client' or 'trainer'",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cooldowns,
    });
  } catch (error) {
    console.error("Error fetching cooldowns:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
