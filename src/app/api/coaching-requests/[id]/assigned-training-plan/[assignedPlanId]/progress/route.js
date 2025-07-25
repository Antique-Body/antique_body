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
    // Add more fields as needed, e.g., workouts, exercises, progress
  },
  required: ["title", "description", "schedule"],
};
const ajv = new Ajv();

// GET: Get workout progress from planData
export async function GET(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { assignedPlanId } = await context.params;

    // Get the assigned training plan - first find by ID, then check permissions
    const assignedPlan = await prisma.assignedTrainingPlan.findUnique({
      where: {
        id: assignedPlanId,
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        trainer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    // Check if the user has permission to access this plan
    const hasAccess =
      assignedPlan.client?.user?.id === session.user.id || // Client can access their own plan
      assignedPlan.trainer?.user?.id === session.user.id; // Trainer can access their client's plan

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Return complete planData with all embedded workout data
    const planData = assignedPlan.planData || {};

    return NextResponse.json({
      success: true,
      data: planData, // Return the complete planData with embedded workout data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Save workout progress to planData
export async function PATCH(request, context) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { assignedPlanId } = await context.params;

    const body = await request.json();

    if (!body.planData) {
      return NextResponse.json(
        { success: false, error: "Missing planData" },
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

    // Get current assigned plan
    const currentPlan = await prisma.assignedTrainingPlan.findUnique({
      where: {
        id: assignedPlanId,
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        trainer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!currentPlan) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const hasAccess =
      currentPlan.client?.user?.id === session.user.id ||
      currentPlan.trainer?.user?.id === session.user.id;

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Simple update - save the complete planData with embedded workout data
    const updatedPlanData = {
      ...body.planData,
      lastUpdated: new Date().toISOString(),
    };

    // Update the assigned training plan
    await prisma.assignedTrainingPlan.update({
      where: {
        id: assignedPlanId,
      },
      data: {
        planData: updatedPlanData,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPlanData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
