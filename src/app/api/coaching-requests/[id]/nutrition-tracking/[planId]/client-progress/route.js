import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Get client's actual diet tracking progress
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
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

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

    // Only trainer can view client progress
    if (session.user.id !== coachingRequest.trainer.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get the assigned nutrition plan
    const assignedPlan = await prisma.assignedNutritionPlan.findFirst({
      where: {
        id: planId,
        clientId: coachingRequest.client.id,
        trainerId: coachingRequest.trainer.id,
      },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned nutrition plan not found" },
        { status: 404 }
      );
    }

    // Get client's diet plan assignment
    const dietPlanAssignment = await prisma.dietPlanAssignment.findFirst({
      where: {
        clientId: coachingRequest.client.id,
        nutritionPlanId: assignedPlan.originalPlanId,
        isActive: true,
      },
      include: {
        dailyLogs: {
          where: {
            date: new Date(date),
          },
          include: {
            mealLogs: {
              orderBy: {
                mealTime: "asc",
              },
            },
            snackLogs: {
              orderBy: {
                loggedTime: "asc",
              },
            },
          },
        },
      },
    });

    if (!dietPlanAssignment) {
      return NextResponse.json({
        success: true,
        data: {
          hasActiveTracking: false,
          message: "Client hasn't started tracking this plan yet",
        },
      });
    }

    const dailyLog = dietPlanAssignment.dailyLogs[0];

    if (!dailyLog) {
      return NextResponse.json({
        success: true,
        data: {
          hasActiveTracking: true,
          date: date,
          meals: [],
          snacks: [],
          totalNutrition: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
          completionRate: 0,
        },
      });
    }

    // Calculate nutrition totals
    const mealNutrition = dailyLog.mealLogs
      .filter((meal) => meal.isCompleted)
      .reduce(
        (total, meal) => ({
          calories: total.calories + (meal.calories || 0),
          protein: total.protein + (meal.protein || 0),
          carbs: total.carbs + (meal.carbs || 0),
          fat: total.fat + (meal.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

    const snackNutrition = dailyLog.snackLogs.reduce(
      (total, snack) => ({
        calories: total.calories + (snack.calories || 0),
        protein: total.protein + (snack.protein || 0),
        carbs: total.carbs + (snack.carbs || 0),
        fat: total.fat + (snack.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const totalNutrition = {
      calories: mealNutrition.calories + snackNutrition.calories,
      protein: mealNutrition.protein + snackNutrition.protein,
      carbs: mealNutrition.carbs + snackNutrition.carbs,
      fat: mealNutrition.fat + snackNutrition.fat,
    };

    // Calculate completion rate
    const completedMeals = dailyLog.mealLogs.filter(
      (meal) => meal.isCompleted
    ).length;
    const totalMeals = dailyLog.mealLogs.length;
    const completionRate =
      totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        hasActiveTracking: true,
        date: date,
        meals: dailyLog.mealLogs.map((meal) => ({
          id: meal.id,
          name: meal.mealName,
          time: meal.mealTime,
          isCompleted: meal.isCompleted,
          completedAt: meal.completedAt,
          selectedOption: meal.selectedOption,
          nutrition: {
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
          },
        })),
        snacks: dailyLog.snackLogs.map((snack) => ({
          id: snack.id,
          name: snack.name,
          description: snack.description,
          mealType: snack.mealType,
          loggedTime: snack.loggedTime,
          nutrition: {
            calories: snack.calories,
            protein: snack.protein,
            carbs: snack.carbs,
            fat: snack.fat,
          },
          ingredients: snack.ingredients,
        })),
        totalNutrition,
        completionRate,
        completedMeals,
        totalMeals,
      },
    });
  } catch (error) {
    console.error("Error getting client progress:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
