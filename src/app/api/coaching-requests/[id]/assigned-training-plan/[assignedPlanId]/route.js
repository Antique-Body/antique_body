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
    const { id, assignedPlanId } = params;
    
    if (!id || !assignedPlanId) {
      return NextResponse.json(
        { success: false, error: "Request ID and assignedPlanId are required" },
        { status: 400 }
      );
    }

    // Fetch coaching request to verify access
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      select: {
        client: { select: { userId: true } },
        trainer: { select: { userId: true } },
        clientId: true,
        trainerId: true,
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Only the trainer or client can view
    if (
      session.user.id !== coachingRequest.trainer.userId &&
      session.user.id !== coachingRequest.client.userId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get assigned plan with full planData
    const assignedPlan = await prisma.assignedTrainingPlan.findUnique({
      where: { id: assignedPlanId },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned plan not found" },
        { status: 404 }
      );
    }

    // Verify the plan belongs to this coaching request
    if (
      assignedPlan.clientId !== coachingRequest.clientId ||
      assignedPlan.trainerId !== coachingRequest.trainerId
    ) {
      return NextResponse.json(
        { success: false, error: "Plan not associated with this coaching request" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: assignedPlan });
  } catch (error) {
    console.error("Error fetching assigned plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id, assignedPlanId } = params;
    const { status } = await request.json();
    if (!id || !assignedPlanId) {
      return NextResponse.json(
        { success: false, error: "Request ID and assignedPlanId are required" },
        { status: 400 }
      );
    }
    if (!status || !["active", "inactive", "completed"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid status is required (active, inactive, completed)",
        },
        { status: 400 }
      );
    }
    // Get assigned plan
    const assignedPlan = await prisma.assignedTrainingPlan.findUnique({
      where: { id: assignedPlanId },
    });
    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned plan not found" },
        { status: 404 }
      );
    }
    // Check if the coach is the owner
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
    });
    if (
      !coachingRequest ||
      coachingRequest.trainerId !== assignedPlan.trainerId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }
    // Update status
    const updateData = { status };
    if (status === "completed") {
      updateData.completedAt = new Date();
    } else if (status === "active") {
      updateData.completedAt = null;
    }
    const updated = await prisma.assignedTrainingPlan.update({
      where: { id: assignedPlanId },
      data: updateData,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating assigned plan status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
