import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { trainerId, note } = await request.json();

    if (!trainerId) {
      return NextResponse.json(
        { success: false, error: "Trainer ID is required" },
        { status: 400 }
      );
    }

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
      include: { clientProfile: true },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { success: false, error: "Client profile not found" },
        { status: 404 }
      );
    }

    // Get trainer info
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { id: trainerId },
      include: { trainerProfile: true },
    });

    if (!trainerInfo) {
      return NextResponse.json(
        { success: false, error: "Trainer not found" },
        { status: 404 }
      );
    }

    // Check if there's an active cooldown for this client-trainer pair
    const activeCooldown = await prisma.coachingRequestCooldown.findUnique({
      where: {
        clientId_trainerId: {
          clientId: clientInfo.id,
          trainerId: trainerId,
        },
      },
    });

    if (activeCooldown && activeCooldown.expiresAt > new Date()) {
      const timeRemaining = Math.ceil(
        (activeCooldown.expiresAt - new Date()) / (1000 * 60 * 60)
      );
      return NextResponse.json(
        {
          success: false,
          error: `You cannot request this trainer for another ${timeRemaining} hours due to a recent removal`,
        },
        { status: 429 }
      );
    }

    // Check if request already exists
    const existingRequest = await prisma.coachingRequest.findUnique({
      where: {
        clientId_trainerId: {
          clientId: clientInfo.id,
          trainerId: trainerId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: "Request already exists" },
        { status: 409 }
      );
    }

    // Check if client has reached the maximum number of requests
    const activeRequestsCount = await prisma.coachingRequest.count({
      where: {
        clientId: clientInfo.id,
        status: "pending",
      },
    });

    if (activeRequestsCount >= 5) {
      return NextResponse.json(
        { success: false, error: "Maximum number of requests reached" },
        { status: 400 }
      );
    }

    // Create the coaching request
    const coachingRequest = await prisma.coachingRequest.create({
      data: {
        clientId: clientInfo.id,
        trainerId: trainerId,
        note: note || null,
        status: "pending",
      },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        trainer: {
          include: {
            trainerProfile: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: coachingRequest,
    });
  } catch (error) {
    console.error("Error creating coaching request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.error("No session found");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // 'client' or 'trainer'
    const status = searchParams.get("status"); // filter by status

    let requests = [];

    if (role === "client") {
      // Get client's requests
      const clientInfo = await prisma.clientInfo.findUnique({
        where: { userId: session.user.id },
      });

      if (!clientInfo) {
        console.error("Client profile not found for user:", session.user.id);
        return NextResponse.json(
          { success: false, error: "Client profile not found" },
          { status: 404 }
        );
      }

      const whereClause = {
        clientId: clientInfo.id,
        ...(status && { status: status }),
      };

      requests = await prisma.coachingRequest.findMany({
        where: whereClause,
        include: {
          trainer: {
            include: {
              trainerProfile: {
                include: {
                  location: true,
                  specialties: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "trainer") {
      // Get trainer's requests
      const trainerInfo = await prisma.trainerInfo.findUnique({
        where: { userId: session.user.id },
      });

      if (!trainerInfo) {
        console.error("Trainer profile not found for user:", session.user.id);
        return NextResponse.json(
          { success: false, error: "Trainer profile not found" },
          { status: 404 }
        );
      }

      const whereClause = {
        trainerId: trainerInfo.id,
        ...(status && { status: status }),
      };

      requests = await prisma.coachingRequest.findMany({
        where: whereClause,
        include: {
          client: {
            include: {
              clientProfile: {
                include: {
                  location: true,
                  languages: true,
                  preferredActivities: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Role parameter is required (client or trainer)",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching coaching requests:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
