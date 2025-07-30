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

    // Get assigned nutrition plans
    const assignedPlans = await prisma.dietPlanAssignment.findMany({
      where: {
        clientId: coachingRequest.clientId,
      },
      include: {
        nutritionPlan: true,
        assignedBy: {
          include: {
            trainerProfile: true,
          },
        },
        dailyLogs: {
          orderBy: {
            date: 'desc',
          },
          take: 7, // Last 7 days
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { success: true, data: assignedPlans },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assigned nutrition plans:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}