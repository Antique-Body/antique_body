import Ajv from "ajv";
import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

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

    const { assignedPlanId } = await params;
    const body = await request.json();

    if (!assignedPlanId) {
      return NextResponse.json(
        { success: false, error: "Assigned Plan ID is required" },
        { status: 400 }
      );
    }

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

    // Update planData
    const updated = await prisma.assignedTrainingPlan.update({
      where: { id: assignedPlanId },
      data: { planData: body.planData },
    });

    // Audit log: log previous and new planData values

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error editing assigned plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
