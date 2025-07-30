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

    // Only trainer can assign
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if client already has active nutrition plan
    const existing = await prisma.dietPlanAssignment.findFirst({
      where: {
        clientId: coachingRequest.clientId,
        isActive: true,
      },
    });

    if (existing) {
      // Deactivate the existing plan before assigning a new one
      await prisma.dietPlanAssignment.update({
        where: { id: existing.id },
        data: {
          isActive: false,
        },
      });
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

    // Assign nutrition plan
    const assigned = await prisma.dietPlanAssignment.create({
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

    // Update clientCount in the nutrition plan
    const activeAssignments = await prisma.dietPlanAssignment.count({
      where: {
        nutritionPlanId: nutritionPlan.id,
        isActive: true,
      },
    });

    await prisma.nutritionPlan.update({
      where: { id: nutritionPlan.id },
      data: { clientCount: activeAssignments },
    });

    return NextResponse.json(
      { success: true, data: assigned },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning nutrition plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}