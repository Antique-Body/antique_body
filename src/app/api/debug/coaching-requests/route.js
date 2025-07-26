import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's role and info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        trainerInfo: true,
        clientInfo: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let coachingRequests = [];
    let conversations = [];

    if (user.role === "trainer" && user.trainerInfo) {
      coachingRequests = await prisma.coachingRequest.findMany({
        where: {
          trainerId: user.trainerInfo.id,
        },
        include: {
          client: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  phone: true,
                },
              },
              clientProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      conversations = await prisma.conversation.findMany({
        where: {
          trainerId: user.trainerInfo.id,
        },
      });
    } else if (user.role === "client" && user.clientInfo) {
      coachingRequests = await prisma.coachingRequest.findMany({
        where: {
          clientId: user.clientInfo.id,
        },
        include: {
          trainer: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  phone: true,
                },
              },
              trainerProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      conversations = await prisma.conversation.findMany({
        where: {
          clientId: user.clientInfo.id,
        },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        role: user.role,
        trainerInfoId: user.trainerInfo?.id,
        clientInfoId: user.clientInfo?.id,
      },
      coachingRequests,
      conversations,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: error.message },
      { status: 500 }
    );
  }
} 