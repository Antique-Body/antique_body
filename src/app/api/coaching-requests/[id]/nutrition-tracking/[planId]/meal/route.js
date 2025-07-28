import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// POST: Update meal status for a specific date
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
    const body = await request.json();
    const { date, mealIndex, optionIndex, status, setAsActiveOnly } = body;

    if (!date || mealIndex === undefined || optionIndex === undefined || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    // Only trainer can update meal status
    if (session.user.id !== coachingRequest.trainer.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get existing tracking data
    const existingData = await prisma.nutritionTrackingData.findUnique({
      where: {
        assignedNutritionPlanId_date: {
          assignedNutritionPlanId: planId,
          date: date,
        },
      },
    });

    const mealKey = `${mealIndex}-${optionIndex}`;
    const meals = { ...(existingData?.meals || {}) };

    // If setAsActiveOnly is true, mark all other meals as completed and this one as tracking
    if (setAsActiveOnly && status === 'tracking') {
      // Mark all existing meals as completed
      Object.keys(meals).forEach(key => {
        if (key !== mealKey) {
          meals[key] = {
            ...meals[key],
            status: 'completed',
            completedAt: meals[key]?.completedAt || new Date().toISOString(),
          };
        }
      });
    }

    // Update the current meal
    meals[mealKey] = {
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : meals[mealKey]?.completedAt,
      startedAt: status === 'tracking' ? new Date().toISOString() : meals[mealKey]?.startedAt,
    };

    const trackingData = await prisma.nutritionTrackingData.upsert({
      where: {
        assignedNutritionPlanId_date: {
          assignedNutritionPlanId: planId,
          date: date,
        },
      },
      update: {
        meals: meals
      },
      create: {
        assignedNutritionPlanId: planId,
        date: date,
        meals: meals
      },
    });

    return NextResponse.json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error("Error updating meal status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}