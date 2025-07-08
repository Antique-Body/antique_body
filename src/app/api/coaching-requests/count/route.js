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

    // Early validation of role parameter
    if (role !== "client" && role !== "trainer") {
      return NextResponse.json(
        {
          success: false,
          error: "Role parameter is required (client or trainer)",
        },
        { status: 400 }
      );
    }

    let counts = {};

    if (role === "trainer") {
      // Get trainer's request counts
      const trainerInfo = await prisma.trainerInfo.findUnique({
        where: { userId: session.user.id },
      });

      if (!trainerInfo) {
        return NextResponse.json(
          { success: false, error: "Trainer profile not found" },
          { status: 404 }
        );
      }

      // Get pending requests count
      const pendingCount = await prisma.coachingRequest.count({
        where: {
          trainerId: trainerInfo.id,
          status: "pending",
        },
      });

      // Get accepted clients count
      const acceptedCount = await prisma.coachingRequest.count({
        where: {
          trainerId: trainerInfo.id,
          status: "accepted",
        },
      });

      counts = {
        newClients: pendingCount,
        clients: acceptedCount,
      };
    } else if (role === "client") {
      // Get client's request counts
      const clientInfo = await prisma.clientInfo.findUnique({
        where: { userId: session.user.id },
      });

      if (!clientInfo) {
        return NextResponse.json(
          { success: false, error: "Client profile not found" },
          { status: 404 }
        );
      }

      const pendingCount = await prisma.coachingRequest.count({
        where: {
          clientId: clientInfo.id,
          status: "pending",
        },
      });

      counts = {
        trainwithcoach: pendingCount,
      };
    }

    return NextResponse.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Error fetching coaching request counts:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
