import Ajv from "ajv";
import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

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

// PATCH: Edit assigned training plan (update planData JSON)
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
    // Check if trainer is the owner
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
      data: {
        planData: body.planData,
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error editing assigned plan:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
