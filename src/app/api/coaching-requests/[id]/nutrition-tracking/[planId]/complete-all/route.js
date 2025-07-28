import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// POST: Mark all meals as completed when a new nutrition plan is assigned
export async function POST(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, planId } = await context.params;

    // Get coaching request to verify permissions
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: { trainer: true, client: true },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Only trainer can mark all meals as completed
    if (session.user.id !== coachingRequest.trainer.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get all existing tracking data for this plan
    const existingTrackingData = await prisma.nutritionTrackingData.findMany({
      where: {
        assignedNutritionPlanId: planId,
      },
    });

    // Update all existing tracking data to mark meals as completed
    const updatePromises = existingTrackingData.map(async (trackingRecord) => {
      const meals = trackingRecord.meals || {};
      
      // Mark all meals as completed
      Object.keys(meals).forEach(mealKey => {
        meals[mealKey] = {
          ...meals[mealKey],
          status: 'completed',
          completedAt: meals[mealKey]?.completedAt || new Date().toISOString(),
        };
      });

      return prisma.nutritionTrackingData.update({
        where: { id: trackingRecord.id },
        data: { meals: meals },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "All previous meals marked as completed"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}