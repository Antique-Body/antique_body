import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

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
    // Provjeri da li je trener vlasnik
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
