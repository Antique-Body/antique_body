import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Get client's real-time progress on assigned nutrition plan
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, assignedPlanId } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Get coaching request to verify trainer access
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            clientProfile: {
              select: {
                firstName: true,
                lastName: true,
                dietaryPreferences: true,
              },
            },
          },
        },
        trainer: {
          include: {
            user: {
              select: { id: true },
            },
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

    // Check if user is the trainer
    const isTrainer = coachingRequest.trainer.user.id === session.user.id;
    if (!isTrainer) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get assigned nutrition plan
    const assignedPlan = await prisma.dietPlanAssignment.findUnique({
      where: { id: assignedPlanId },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        dailyLogs: {
          include: {
            mealLogs: true,
            snackLogs: true,
          },
        },
      },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned nutrition plan not found" },
        { status: 404 }
      );
    }

    // Check if the assigned plan belongs to the correct client
    if (assignedPlan.clientId !== coachingRequest.client.id) {
      return NextResponse.json(
        { success: false, error: "Plan not assigned to this client" },
        { status: 403 }
      );
    }

    // Check if client has started tracking this plan
    if (assignedPlan.status !== 'active' || !assignedPlan.isActive) {
      return NextResponse.json({
        success: true,
        data: {
          hasActiveTracking: false,
          message: "Client hasn't started tracking this nutrition plan yet.",
          completionRate: 0,
          completedMeals: 0,
          totalMeals: 0,
          totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          meals: [],
          snacks: [],
          waterIntake: {
            current: 0,
            goal: 4000,
            percentage: 0,
          },
        },
      });
    }

    // Find the daily log for the requested date
    const requestedDate = new Date(date);
    const startDate = new Date(assignedPlan.startDate);
    const daysDiff = Math.floor((requestedDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Find by either dayNumber (1-based) or by date
    const dailyLog = assignedPlan.dailyLogs.find(log => 
      log.dayNumber === daysDiff + 1 || // dayNumber is 1-based
      log.date.toISOString().split('T')[0] === date
    );

    if (!dailyLog) {
      return NextResponse.json({
        success: true,
        data: {
          hasActiveTracking: true,
          message: `No tracking data available for ${date}.`,
          completionRate: 0,
          completedMeals: 0,
          totalMeals: 0,
          totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          meals: [],
          snacks: [],
          waterIntake: {
            current: 0,
            goal: 4000,
            percentage: 0,
          },
        },
      });
    }

    // Calculate progress for this day
    const mealLogs = dailyLog.mealLogs || [];
    const completedMeals = mealLogs.filter(meal => meal.isCompleted);
    const totalMeals = mealLogs.length;
    const completionRate = totalMeals > 0 ? (completedMeals.length / totalMeals) * 100 : 0;

    // Calculate total nutrition from completed meals
    const totalNutrition = completedMeals.reduce(
      (total, meal) => ({
        calories: total.calories + (meal.calories || 0),
        protein: total.protein + (meal.protein || 0),
        carbs: total.carbs + (meal.carbs || 0),
        fat: total.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Format meal data for trainer view
    const meals = mealLogs.map(meal => ({
      id: meal.id,
      name: meal.mealName,
      time: meal.mealTime,
      isCompleted: meal.isCompleted,
      completedAt: meal.completedAt,
      selectedOption: meal.selectedOption,
      nutrition: {
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
      },
      notes: meal.notes || '',
    }));

    // Get snack logs from daily log (snacks are stored at daily log level)
    const snacks = (dailyLog.snackLogs || []).map(snack => ({
      id: snack.id,
      name: snack.name,
      description: snack.description,
      nutrition: {
        calories: snack.calories || 0,
        protein: snack.protein || 0,
        carbs: snack.carbs || 0,
        fat: snack.fat || 0,
      },
      loggedTime: snack.createdAt, // Use createdAt as loggedTime
      mealType: snack.mealType || 'snack',
    }));

    // Add snack nutrition to total
    const snackNutrition = snacks.reduce(
      (total, snack) => {
        const nutrition = snack.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 };
        return {
          calories: total.calories + (nutrition.calories || 0),
          protein: total.protein + (nutrition.protein || 0),
          carbs: total.carbs + (nutrition.carbs || 0),
          fat: total.fat + (nutrition.fat || 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Combine meal and snack nutrition
    const combinedNutrition = {
      calories: totalNutrition.calories + snackNutrition.calories,
      protein: totalNutrition.protein + snackNutrition.protein,
      carbs: totalNutrition.carbs + snackNutrition.carbs,
      fat: totalNutrition.fat + snackNutrition.fat,
    };

    return NextResponse.json({
      success: true,
      data: {
        hasActiveTracking: true,
        completionRate,
        completedMeals: completedMeals.length,
        totalMeals,
        totalNutrition: combinedNutrition,
        meals,
        snacks,
        // Add water intake info from daily log
        waterIntake: {
          current: dailyLog.waterIntake || 0,
          goal: dailyLog.waterGoal || 4000,
          percentage: Math.round(((dailyLog.waterIntake || 0) / (dailyLog.waterGoal || 4000)) * 100),
        },
        dailyLogId: dailyLog.id,
        lastUpdated: dailyLog.updatedAt,
      },
    });

  } catch (error) {
    console.error("Error getting client progress:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}