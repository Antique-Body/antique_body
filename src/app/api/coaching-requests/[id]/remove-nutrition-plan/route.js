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

    // Find the diet plan assignment
    let assignment;

    if (assignmentId) {
      // If specific assignment ID is provided
      assignment = await prisma.dietPlanAssignment.findUnique({
        where: {
          id: assignmentId,
          clientId: coachingRequest.clientId,
        },
        include: {
          nutritionPlan: true,
        },
      });
    } else {
      // Otherwise find the active assignment
      assignment = await prisma.dietPlanAssignment.findFirst({
        where: {
          clientId: coachingRequest.clientId,
          isActive: true,
        },
        include: {
          nutritionPlan: true,
        },
      });
    }

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "No active nutrition plan found" },
        { status: 404 }
      );
    }

    // Deactivate the assignment
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate the assignment
      const updatedAssignment = await tx.dietPlanAssignment.update({
        where: { id: assignment.id },
        data: {
          isActive: false,
          status: "abandoned", // Using a valid enum value from DietPlanAssignmentStatus
        },
        include: {
          nutritionPlan: true,
          client: {
            include: {
              clientProfile: true,
            },
          },
        },
      });

      // Update client count for the plan
      const planActiveCount = await tx.dietPlanAssignment.count({
        where: {
          nutritionPlanId: assignment.nutritionPlanId,
          isActive: true,
        },
      });

      await tx.nutritionPlan.update({
        where: { id: assignment.nutritionPlanId },
        data: { clientCount: planActiveCount },
      });

      return updatedAssignment;
    });

    return NextResponse.json({
      success: true,
      message: "Nutrition plan removed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error removing nutrition plan:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to remove nutrition plan",
      },
      { status: 500 }
    );
  }
}
