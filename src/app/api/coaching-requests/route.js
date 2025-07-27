import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// Simple HTML escape function to prevent XSS
function escapeHtml(str) {
  if (!str) return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

    // Wrap all DB operations in a transaction for atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Get client info
      const clientInfo = await prisma.clientInfo.findUnique({
        where: { userId: session.user.id },
        include: { clientProfile: true },
      });
      if (!clientInfo) {
        return {
          error: {
            success: false,
            error: "Client profile not found",
            status: 404,
          },
        };
      }

      // Get trainer info
      const trainerInfo = await prisma.trainerInfo.findUnique({
        where: { id: trainerId },
        include: { trainerProfile: true },
      });
      if (!trainerInfo) {
        return {
          error: { success: false, error: "Trainer not found", status: 404 },
        };
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
        return {
          error: {
            success: false,
            error: `You cannot request this trainer for another ${timeRemaining} hours due to a recent removal`,
            status: 429,
          },
        };
      }

      // Check if request already exists
      const existingRequest = await prisma.coachingRequest.findFirst({
        where: {
          clientId: clientInfo.id,
          trainerId: trainerId,
        },
      });
      if (existingRequest) {
        return {
          error: {
            success: false,
            error: "Request already exists",
            status: 409,
          },
        };
      }

      // Check if client has reached the maximum number of requests
      const activeRequestsCount = await prisma.coachingRequest.count({
        where: {
          clientId: clientInfo.id,
          status: "pending",
        },
      });
      if (activeRequestsCount >= 5) {
        return {
          error: {
            success: false,
            error: "Maximum number of requests reached",
            status: 400,
          },
        };
      }

      // Create the coaching request
      const coachingRequest = await prisma.coachingRequest.create({
        data: {
          clientId: clientInfo.id,
          trainerId: trainerId,
          note: note ? escapeHtml(note) : null,
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
      return { coachingRequest };
    });

    if (result.error) {
      return NextResponse.json(result.error, { status: result.error.status });
    }

    return NextResponse.json({
      success: true,
      data: result.coachingRequest,
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
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search"); // search query for client/trainer name
    const skip = (page - 1) * limit;

    let requests = [];
    let totalCount = 0;

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

      totalCount = await prisma.coachingRequest.count({ where: whereClause });
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
        skip,
        take: limit,
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

      // Base where clause for trainer requests
      let whereClause = {
        trainerId: trainerInfo.id,
        ...(status && { status: status }),
      };

      // If search is provided, add client name search condition
      if (search && search.trim() !== "") {
        const searchTerms = search.toLowerCase().split(" ");

        whereClause = {
          ...whereClause,
          client: {
            clientProfile: {
              OR: [
                ...searchTerms.map((term) => ({
                  OR: [
                    { firstName: { contains: term } },
                    { lastName: { contains: term } },
                  ],
                })),
              ],
            },
          },
        };
      }

      totalCount = await prisma.coachingRequest.count({ where: whereClause });
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
        skip,
        take: limit,
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
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching coaching requests:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
