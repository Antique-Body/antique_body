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

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Get the coaching request with all related data
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            clientProfile: {
              include: {
                location: true,
                languages: true,
                preferredActivities: true,
              },
            },
            user: true,
          },
        },
        trainer: {
          include: {
            trainerProfile: {
              include: {
                location: true,
                specialties: true,
              },
            },
            user: true,
          },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Verify that the current user is the trainer for this request
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to view this request" },
        { status: 403 }
      );
    }

    // Only return accepted coaching requests for the client dashboard
    // This endpoint is designed specifically for the client dashboard, which requires
    // active accepted requests. Other statuses (pending, rejected, cancelled) are
    // excluded as they are not relevant for the client's active coaching sessions.
    if (coachingRequest.status !== "accepted") {
      return NextResponse.json(
        { success: false, error: "Client not found or not active" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coachingRequest,
    });
  } catch (error) {
    console.error("Error fetching coaching request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
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

    const { id } = params;
    const { status, rejectionReason } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["accepted", "rejected", "cancelled"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid status is required (accepted, rejected, cancelled)",
        },
        { status: 400 }
      );
    }

    // Get the coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        trainer: {
          include: {
            trainerProfile: true,
            user: true,
          },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Verify that the current user is the trainer for this request
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this request" },
        { status: 403 }
      );
    }

    // Check if request is already responded to
    if (coachingRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Request has already been responded to" },
        { status: 400 }
      );
    }

    // Update the coaching request
    const updatedRequest = await prisma.coachingRequest.update({
      where: { id },
      data: {
        status: status,
        rejectionReason:
          status === "rejected"
            ? rejectionReason
            : coachingRequest.rejectionReason,
        respondedAt: new Date(),
      },
      include: {
        client: {
          include: {
            clientProfile: {
              include: {
                location: true,
                languages: true,
                preferredActivities: true,
              },
            },
          },
        },
        trainer: {
          include: {
            trainerProfile: {
              include: {
                location: true,
                specialties: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating coaching request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Get the coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Verify that the current user is the client for this request
    if (coachingRequest.client.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this request" },
        { status: 403 }
      );
    }

    // Only allow deletion if request is pending
    if (coachingRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Can only delete pending requests" },
        { status: 400 }
      );
    }

    // Use a transaction to delete the request and create a cooldown
    await prisma.$transaction(async (tx) => {
      // Delete the coaching request
      await tx.coachingRequest.delete({
        where: { id },
      });

      // Create a cooldown record (24 hours from now)
      const COOLDOWN_HOURS =
        parseInt(process.env.COACHING_REQUEST_COOLDOWN_HOURS, 10) || 24;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + COOLDOWN_HOURS);

      await tx.coachingRequestCooldown.create({
        data: {
          clientId: coachingRequest.clientId,
          trainerId: coachingRequest.trainerId,
          expiresAt,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Coaching request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting coaching request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Assign training plan to client (creates AssignedTrainingPlan)
// NOTE: If multiple POST handlers are needed, split into separate files/endpoints.
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = params; // coaching request id
    const body = await request.json();
    const { planId } = body;
    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Missing planId" },
        { status: 400 }
      );
    }
    // Get coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: { client: true, trainer: true },
    });
    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }
    // Only trainer can assign
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }
    // Check if client already has active assigned plan
    const existing = await prisma.assignedTrainingPlan.findFirst({
      where: {
        clientId: coachingRequest.clientId,
        status: "active",
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Client already has an active training plan. Complete it before assigning a new one.",
        },
        { status: 409 }
      );
    }
    // Get original plan
    const plan = await prisma.trainingPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Training plan not found" },
        { status: 404 }
      );
    }
    // Copy plan data as JSON
    const planData = { ...plan };
    // Remove fields that shouldn't be in planData
    delete planData.id;
    delete planData.trainerInfoId;
    delete planData.createdAt;
    delete planData.updatedAt;
    delete planData.deletedAt;
    // Validate planData before assignment
    if (!ajv.validate(planDataSchema, planData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid planData format",
          details: ajv.errors,
        },
        { status: 400 }
      );
    }
    // Assign plan
    const assigned = await prisma.assignedTrainingPlan.create({
      data: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
        originalPlanId: plan.id,
        planData,
        status: "active",
      },
    });
    return NextResponse.json(
      { success: true, data: assigned },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning training plan:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
