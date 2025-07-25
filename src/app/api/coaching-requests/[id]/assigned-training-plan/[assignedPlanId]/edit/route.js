import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import Ajv from "ajv";

const planDataSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    schedule: { type: "array" },
    // Add more fields as needed
  },
  required: ["title", "description", "schedule"],
};
const ajv = new Ajv();

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id, assignedPlanId } = await params;
    const body = await request.json();
    // Validate planData
    if (!ajv.validate(planDataSchema, body.planData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid planData format",
          details: ajv.errors,
        },
        { status: 400 }
      );
    }
    // Fetch the assigned plan
    const assignedPlan = await prisma.assignedTrainingPlan.findUnique({
      where: { id: assignedPlanId },
    });
    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned plan not found" },
        { status: 404 }
      );
    }
    // Check if the trainer is the owner
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
    const previousPlanData = assignedPlan.planData;
    const updated = await prisma.assignedTrainingPlan.update({
      where: { id: assignedPlanId },
      data: { planData: body.planData },
    });
    // Audit log: log previous and new planData values
    console.log("[AUDIT] AssignedTrainingPlan updated", {
      assignedPlanId,
      previousPlanData,
      newPlanData: body.planData,
      updatedAt: new Date().toISOString(),
      userId: session.user.id,
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
