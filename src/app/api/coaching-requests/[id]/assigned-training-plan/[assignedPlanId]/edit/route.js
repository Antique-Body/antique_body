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
    const body = await request.json();
    // Dohvati assigned plan
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
    // Update planData
    const updated = await prisma.assignedTrainingPlan.update({
      where: { id: assignedPlanId },
      data: { planData: body.planData },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error editing assigned plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
