import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Get weekly nutrition tracking progress
export async function GET(request, context) {
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

    // Only trainer or client can access
    if (
      session.user.id !== coachingRequest.trainer.userId &&
      session.user.id !== coachingRequest.client.userId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get tracking data for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    const weeklyData = await prisma.nutritionTrackingData.findMany({
      where: {
        assignedNutritionPlanId: planId,
        date: {
          gte: startDate.toISOString().split('T')[0],
          lte: endDate.toISOString().split('T')[0],
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculate weekly progress
    const progressData = weeklyData.map(day => {
      const meals = day.meals || {};
      const totalMeals = Object.keys(meals).length;
      const completedMeals = Object.values(meals).filter(meal => meal.status === 'completed').length;
      const completionRate = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

      return {
        date: day.date,
        completionRate,
        totalMeals,
        completedMeals,
        notes: day.notes,
      };
    });

    return NextResponse.json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error("Error fetching weekly progress:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}