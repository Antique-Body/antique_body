import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import Ajv from "ajv";

const planDataSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    schedule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { anyOf: [{ type: "string" }, { type: "number" }] },
          name: { type: "string" },
          type: { type: "string" },
          duration: { type: "number" },
          description: { type: "string" },
          workoutStatus: { type: "string" },
          workoutStartedAt: { type: ["string", "null"] },
          workoutCompletedAt: { type: ["string", "null"] },
          workoutEndedAt: { type: ["string", "null"] },
          workoutDuration: { type: ["number", "null"] },
          workoutNotes: { type: "string" },
          workoutWasCompleted: { type: "boolean" },
          exercises: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                reps: { type: ["number", "null"] },
                rest: { type: ["number", "null"] },
                sets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      weight: { type: ["number", "null"] },
                      reps: { type: ["number", "null"] },
                      completed: { type: "boolean" },
                      notes: { type: "string" },
                    },
                    required: ["reps", "completed"],
                  },
                },
                type: { type: "string" },
                level: { type: "string" },
                imageUrl: { type: "string" },
                location: { type: "string" },
                equipment: { type: ["boolean", "null"] },
                instructions: { type: "string" },
                muscleGroups: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                    },
                    required: ["name"],
                  },
                },
                exerciseNotes: { type: "string" },
                exerciseCompleted: { type: "boolean" },
              },
              required: ["name", "type", "sets"],
            },
          },
        },
        required: ["day", "name", "type", "duration", "exercises"],
      },
    },
    lastUpdated: { type: ["string", "null"] },
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
      console.error("AJV validation errors:", ajv.errors); // <-- log errors for backend debugging
      return NextResponse.json(
        {
          success: false,
          error: "Invalid planData format",
          details: ajv.errors, // <-- return full error details
        },
        { status: 400 }
      );
    }

    // Get current assigned plan
    const currentPlan = await prisma.assignedTrainingPlan.findUnique({
      where: {
        id: assignedPlanId,
      },
      select: {
        client: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        trainer: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
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
      plan: updatedPlanData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
