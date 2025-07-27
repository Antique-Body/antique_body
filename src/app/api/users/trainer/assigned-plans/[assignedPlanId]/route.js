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

    const { assignedPlanId } = await params;

    if (!assignedPlanId) {
      return NextResponse.json(
        { success: false, error: "Assigned Plan ID is required" },
        { status: 400 }
      );
    }

    // Get assigned plan directly
    const assignedPlan = await prisma.assignedTrainingPlan.findUnique({
      where: { id: assignedPlanId },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned plan not found" },
        { status: 404 }
      );
    }

    // Verify the trainer owns this assignment
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!trainerInfo || assignedPlan.trainerId !== trainerInfo.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to this plan" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        planData: assignedPlan.planData,
        id: assignedPlan.id,
        originalPlanId: assignedPlan.originalPlanId,
        clientId: assignedPlan.clientId,
        trainerId: assignedPlan.trainerId,
        status: assignedPlan.status,
        assignedAt: assignedPlan.assignedAt,
        completedAt: assignedPlan.completedAt,
      },
    });
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

    const { assignedPlanId } = await params;
    const { status } = await request.json();

    if (!assignedPlanId) {
      return NextResponse.json(
        { success: false, error: "Assigned Plan ID is required" },
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

    // Verify the trainer owns this assignment
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!trainerInfo || assignedPlan.trainerId !== trainerInfo.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to this plan" },
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

    // Update clientCount in the original plan
    const activeAssignments = await prisma.assignedTrainingPlan.count({
      where: {
        originalPlanId: assignedPlan.originalPlanId,
        status: "active",
      },
    });

    await prisma.trainingPlan.update({
      where: { id: assignedPlan.originalPlanId },
      data: { clientCount: activeAssignments },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating assigned plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
