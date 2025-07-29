import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function POST(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params; // coaching request id
    const body = await request.json();
    const { documents = [], description = "" } = body;

    console.log("Received documents:", documents);
    console.log("Received description:", description);

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

    // Only trainer can enable custom meal input
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if client already has active assigned nutrition plan
    const existing = await prisma.assignedNutritionPlan.findFirst({
      where: {
        clientId: coachingRequest.clientId,
        status: "active",
      },
    });

    if (existing) {
      // Mark all tracking data for the existing plan as completed
      const existingTrackingData = await prisma.nutritionTrackingData.findMany({
        where: {
          assignedNutritionPlanId: existing.id,
        },
      });

      const updatePromises = existingTrackingData.map(
        async (trackingRecord) => {
          const meals = trackingRecord.meals || {};

          // Mark all meals as completed
          Object.keys(meals).forEach((mealKey) => {
            meals[mealKey] = {
              ...meals[mealKey],
              status: "completed",
              completedAt:
                meals[mealKey]?.completedAt || new Date().toISOString(),
            };
          });

          return prisma.nutritionTrackingData.update({
            where: { id: trackingRecord.id },
            data: { meals: meals },
          });
        }
      );

      await Promise.all(updatePromises);

      // Complete the existing plan before enabling custom meal input
      await prisma.assignedNutritionPlan.update({
        where: { id: existing.id },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      });
    }

    // Create new assigned nutrition plan with custom meal input enabled
    const assigned = await prisma.assignedNutritionPlan.create({
      data: {
        client: { connect: { id: coachingRequest.clientId } },
        trainer: { connect: { id: coachingRequest.trainerId } },
        planData: {
          title: "Custom Meal Input",
          description:
            description || "Track your daily meals with custom input",
          type: "custom",
          customMealInputEnabled: true,
          days: [], // Empty days array for custom meal input
        },
        status: "active",
        customMealInputEnabled: true,
        documents: documents.length > 0 ? documents : null, // Save uploaded documents
      },
    });

    // Make sure this is the latest assigned plan for the client (deactivate others if needed)
    await prisma.assignedNutritionPlan.updateMany({
      where: {
        client: { id: coachingRequest.clientId },
        id: { not: assigned.id },
        status: "active",
      },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    // Create DietPlanAssignment for the client so they can start tracking immediately
    const dietPlanAssignment = await prisma.dietPlanAssignment.create({
      data: {
        clientId: coachingRequest.clientId,
        nutritionPlanId: null, // No specific nutrition plan for custom input
        assignedById: coachingRequest.trainerId,
        isActive: true,
      },
    });

    // Fetch the created plan with all relations for debugging
    const createdPlan = await prisma.assignedNutritionPlan.findUnique({
      where: { id: assigned.id },
      include: {
        client: true,
        trainer: {
          include: {
            trainerProfile: true,
          },
        },
      },
    });

    console.log("Created custom meal input plan:", {
      planId: assigned.id,
      clientId: coachingRequest.clientId,
      trainerId: coachingRequest.trainerId,
      customMealInputEnabled: assigned.customMealInputEnabled,
      status: assigned.status,
      dietPlanAssignmentId: dietPlanAssignment.id,
      documents: assigned.documents,
      documentsCount: documents.length,
    });

    return NextResponse.json(
      {
        success: true,
        data: createdPlan,
        message: "Custom meal input enabled successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error enabling custom meal input:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
