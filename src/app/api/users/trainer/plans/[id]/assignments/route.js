import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: planId } = await params;

    // Fetch trainerInfoId using userId
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!trainerInfo) {
      return NextResponse.json(
        { success: false, error: "Trainer info not found" },
        { status: 404 }
      );
    }

    // Try to find the plan in both training and nutrition tables
    let plan = await prisma.trainingPlan.findFirst({
      where: {
        id: planId,
        trainerInfoId: trainerInfo.id,
      },
    });

    if (!plan) {
      plan = await prisma.nutritionPlan.findFirst({
        where: {
          id: planId,
          trainerInfoId: trainerInfo.id,
        },
      });
    }

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Plan not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get all active assignments for this plan
    const assignments = await prisma.assignedTrainingPlan.findMany({
      where: {
        originalPlanId: planId,
        status: "active",
      },
      orderBy: { assignedAt: "desc" },
    });

    // Get client details for each assignment
    const formattedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        // Get client details directly
        const client = await prisma.clientInfo.findUnique({
          where: { id: assignment.clientId },
          include: {
            clientProfile: true,
          },
        });

        if (!client || !client.clientProfile) {
          return null; // Skip if no client found
        }

        // Find the coaching request (optional, for coachingRequestId)
        const coachingRequest = await prisma.coachingRequest.findFirst({
          where: {
            clientId: assignment.clientId,
            trainerId: assignment.trainerId,
            // Remove status filter to find any coaching request
          },
        });

        if (!coachingRequest) {
        }

        return {
          assignedPlanId: assignment.id,
          clientId: assignment.clientId,
          clientName: `${client.clientProfile.firstName} ${client.clientProfile.lastName}`,
          status: assignment.status,
          assignedAt: assignment.assignedAt,
          coachingRequestId: coachingRequest?.id || null,
        };
      })
    );

    // Filter out null results
    const validAssignments = formattedAssignments.filter(Boolean);

    return NextResponse.json({
      success: true,
      data: validAssignments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
