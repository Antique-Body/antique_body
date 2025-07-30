import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params; // coaching request id

    // Get coaching request to verify access
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: { client: true, trainer: true },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Only trainer or client can view assigned plans
    const isTrainer = coachingRequest.trainer.userId === session.user.id;
    const isClient = coachingRequest.client.userId === session.user.id;

    if (!isTrainer && !isClient) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get only inactive nutrition plans with simplified data
    const planHistory = await prisma.dietPlanAssignment.findMany({
      where: {
        clientId: coachingRequest.clientId,
        isActive: false,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        assignedAt: true,
        completedDate: true,
        nutritionPlan: {
          select: {
            title: true,
            duration: true,
            durationType: true,
          },
        },
        assignedBy: {
          select: {
            id: true,
            trainerProfile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { success: true, data: planHistory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching nutrition plan history:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
