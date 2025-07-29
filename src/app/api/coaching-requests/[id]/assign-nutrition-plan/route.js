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

      // Complete the existing plan before assigning a new one
      await prisma.assignedNutritionPlan.update({
        where: { id: existing.id },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      });
    }
    // Get original plan
    const plan = await prisma.nutritionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Nutrition plan not found" },
        { status: 404 }
      );
    }
    // Copy plan data as JSON
    const planData = JSON.parse(JSON.stringify(plan));
    delete planData.id;
    delete planData.trainerInfoId;
    delete planData.createdAt;
    delete planData.updatedAt;
    delete planData.deletedAt;
    // Assign plan
    const assigned = await prisma.assignedNutritionPlan.create({
      data: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
        originalPlanId: plan.id,
        planData,
        status: "active",
        customMealInputEnabled: false,
      },
    });

    // Automatically create DietPlanAssignment for this assigned plan
    const assignment = await prisma.dietPlanAssignment.create({
      data: {
        clientId: coachingRequest.clientId,
        nutritionPlanId: plan.id,
        assignedById: coachingRequest.trainerId,
        startDate: new Date(),
      },
    });

    // Update clientCount in the original plan
    const activeAssignments = await prisma.assignedNutritionPlan.count({
      where: {
        originalPlanId: plan.id,
        status: "active",
      },
    });

    await prisma.nutritionPlan.update({
      where: { id: plan.id },
      data: { clientCount: activeAssignments },
    });

    return NextResponse.json(
      { success: true, data: { assigned, assignment } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning nutrition plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
