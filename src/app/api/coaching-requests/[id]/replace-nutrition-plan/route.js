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
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Missing planId" },
        { status: 400 }
      );
    }

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

    // Only trainer can replace
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get nutrition plan
    const nutritionPlan = await prisma.nutritionPlan.findUnique({
      where: { id: planId },
    });

    if (!nutritionPlan) {
      return NextResponse.json(
        { success: false, error: "Nutrition plan not found" },
        { status: 404 }
      );
    }

    // Verify trainer owns the nutrition plan
    if (nutritionPlan.trainerInfoId !== coachingRequest.trainerId) {
      return NextResponse.json(
        { success: false, error: "You can only assign your own nutrition plans" },
        { status: 403 }
      );
    }

    // Use transaction to replace the existing plan
    const result = await prisma.$transaction(async (tx) => {
      // Find and deactivate existing active nutrition plan
      const existingAssignment = await tx.dietPlanAssignment.findFirst({
        where: {
          clientId: coachingRequest.clientId,
          isActive: true,
        },
      });

      if (existingAssignment) {
        await tx.dietPlanAssignment.update({
          where: { id: existingAssignment.id },
          data: {
            isActive: false,
          },
        });

        // Update client count for the old plan
        const oldPlanActiveCount = await tx.dietPlanAssignment.count({
          where: {
            nutritionPlanId: existingAssignment.nutritionPlanId,
            isActive: true,
          },
        });

        await tx.nutritionPlan.update({
          where: { id: existingAssignment.nutritionPlanId },
          data: { clientCount: oldPlanActiveCount },
        });
      }

      // Create new assignment
      const newAssignment = await tx.dietPlanAssignment.create({
        data: {
          clientId: coachingRequest.clientId,
          nutritionPlanId: nutritionPlan.id,
          assignedById: coachingRequest.trainerId,
          startDate: new Date(),
          isActive: true,
        },
        include: {
          nutritionPlan: true,
          client: {
            include: {
              clientProfile: true,
            },
          },
          assignedBy: {
            include: {
              trainerProfile: true,
            },
          },
        },
      });

      // Update client count for the new plan
      const newPlanActiveCount = await tx.dietPlanAssignment.count({
        where: {
          nutritionPlanId: nutritionPlan.id,
          isActive: true,
        },
      });

      await tx.nutritionPlan.update({
        where: { id: nutritionPlan.id },
        data: { clientCount: newPlanActiveCount },
      });

      return newAssignment;
    });

    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error replacing nutrition plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}