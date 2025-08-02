import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function POST(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params; // coaching request id
    const body = await request.json();
    const { assignmentId } = body;

    // Get coaching request
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

    // Only trainer can remove assignments
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Find the training plan assignment
    let assignment;

    if (assignmentId) {
      // If specific assignment ID is provided
      assignment = await prisma.assignedTrainingPlan.findUnique({
        where: {
          id: assignmentId,
          clientId: coachingRequest.clientId,
        },
        include: {
          originalPlan: true,
        },
      });
    } else {
      // Otherwise find the active assignment
      assignment = await prisma.assignedTrainingPlan.findFirst({
        where: {
          clientId: coachingRequest.clientId,
          status: "active",
        },
        include: {
          originalPlan: true,
        },
      });
    }

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "No active training plan found" },
        { status: 404 }
      );
    }

    // Deactivate the assignment
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate the assignment
      const updatedAssignment = await tx.assignedTrainingPlan.update({
        where: { id: assignment.id },
        data: {
          status: "abandoned", // Mark as abandoned
        },
        include: {
          originalPlan: true,
          client: {
            include: {
              clientProfile: true,
            },
          },
        },
      });

      // Update client count for the plan
      const planActiveCount = await tx.assignedTrainingPlan.count({
        where: {
          originalPlanId: assignment.originalPlanId,
          status: "active",
        },
      });

      await tx.trainingPlan.update({
        where: { id: assignment.originalPlanId },
        data: { clientCount: planActiveCount },
      });

      return updatedAssignment;
    });

    return NextResponse.json({
      success: true,
      message: "Training plan removed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error removing training plan:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to remove training plan",
      },
      { status: 500 }
    );
  }
}