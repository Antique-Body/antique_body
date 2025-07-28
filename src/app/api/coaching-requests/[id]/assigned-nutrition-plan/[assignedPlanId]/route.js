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

    const { id, assignedPlanId } = await context.params;

    // Get coaching request to verify permissions
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: { trainer: true, client: true },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Only trainer or client can access
    if (
      session.user.id !== coachingRequest.trainer.userId &&
      session.user.id !== coachingRequest.client.userId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Find the assigned nutrition plan with plan data
    const assignedPlan = await prisma.assignedNutritionPlan.findUnique({
      where: { id: assignedPlanId },
      include: {
        originalPlan: true,
      },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned nutrition plan not found" },
        { status: 404 }
      );
    }

    // Verify the plan belongs to the correct client and trainer
    if (
      assignedPlan.clientId !== coachingRequest.clientId ||
      assignedPlan.trainerId !== coachingRequest.trainerId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to nutrition plan" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, data: assignedPlan },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assigned nutrition plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, assignedPlanId } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    // Get coaching request to verify permissions
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: { trainer: true, client: true },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Only trainer can update nutrition plan status
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Find the assigned nutrition plan
    const assignedPlan = await prisma.assignedNutritionPlan.findUnique({
      where: { id: assignedPlanId },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned nutrition plan not found" },
        { status: 404 }
      );
    }

    // Verify the plan belongs to the correct client and trainer
    if (
      assignedPlan.clientId !== coachingRequest.clientId ||
      assignedPlan.trainerId !== coachingRequest.trainerId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to nutrition plan" },
        { status: 403 }
      );
    }

    // Update the plan status
    const updatedPlan = await prisma.assignedNutritionPlan.update({
      where: { id: assignedPlanId },
      data: {
        status,
        ...(status === "completed" && { completedAt: new Date() }),
      },
    });

    return NextResponse.json(
      { success: true, data: updatedPlan },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating assigned nutrition plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}