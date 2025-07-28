import { NextResponse } from "next/server";


import { auth } from "#/auth";
import { mockNutritionPlan as mockPlanData } from "@/components/custom/dashboard/client/pages/diet-tracker/mockNutritionPlan";
import prisma from "@/lib/prisma";

import {
  getActiveDietPlan,
  startDietPlan,
  getAllDailyLogs,
  getDietPlanStats,
  getNextMeal,
} from "../../services/dietTrackerService";
// Import the mock nutrition plan directly

// GET: Get current diet plan and progress for client
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      // Get diet plan stats
      const activePlan = await getActiveDietPlan(clientInfo.id);
      if (!activePlan) {
        return NextResponse.json(
          { error: "No active diet plan found" },
          { status: 404 }
        );
      }

      const stats = await getDietPlanStats(activePlan.id);
      return NextResponse.json(stats);
    }

    if (action === "next-meal") {
      // Get next upcoming meal
      const activePlan = await getActiveDietPlan(clientInfo.id);
      if (!activePlan) {
        return NextResponse.json(
          { error: "No active diet plan found" },
          { status: 404 }
        );
      }

      const nextMeal = await getNextMeal(activePlan.id);
      return NextResponse.json({ nextMeal });
    }

    // Default: Get current active diet plan
    const activePlan = await getActiveDietPlan(clientInfo.id);

    if (!activePlan) {
      // Check if there's a mock plan available (for demo purposes)
      // In a real app, this would be assigned by a trainer
      return NextResponse.json({
        hasActivePlan: false,
        mockPlanAvailable: true,
        message:
          "A trainer has assigned you a new nutrition plan. Are you ready to start?",
      });
    }

    // Get all daily logs for the active plan
    const dailyLogs = await getAllDailyLogs(activePlan.id);

    // Get next meal
    const nextMeal = await getNextMeal(activePlan.id);

    return NextResponse.json({
      hasActivePlan: true,
      activePlan,
      dailyLogs,
      nextMeal,
    });
  } catch (error) {
    console.error("Error in diet tracker GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Start diet plan or perform actions
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, dietPlanAssignmentId, useMockPlan } = body;

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    if (action === "start-plan") {
      if (useMockPlan) {
        // For demo purposes, create a mock plan assignment
        // In a real app, this would be created by a trainer

        // First, get a trainer to assign the plan (use the first trainer)
        const trainer = await prisma.trainerInfo.findFirst();
        if (!trainer) {
          return NextResponse.json(
            { error: "No trainer available" },
            { status: 404 }
          );
        }

        // Check if mock nutrition plan already exists
        let existingNutritionPlan = await prisma.nutritionPlan.findFirst({
          where: { trainerInfoId: trainer.id },
        });

        // If no plan exists, create one using our mock data
        if (!existingNutritionPlan) {
          existingNutritionPlan = await prisma.nutritionPlan.create({
            data: {
              title: mockPlanData.title,
              description: mockPlanData.description,
              coverImage: mockPlanData.coverImage,
              price: mockPlanData.price,
              duration: mockPlanData.duration,
              durationType: mockPlanData.durationType,
              nutritionInfo: {
                calories: mockPlanData.dailyCaloriesGoal || 2000,
                protein: mockPlanData.dailyProteinGoal || 150,
                carbs: mockPlanData.dailyCarbsGoal || 200,
                fats: mockPlanData.dailyFatGoal || 80,
              },
              days: mockPlanData.days,
              trainerInfoId: trainer.id,
            },
          });
        }

        // Create diet plan assignment
        const assignment = await prisma.dietPlanAssignment.create({
          data: {
            clientId: clientInfo.id,
            nutritionPlanId: existingNutritionPlan.id,
            assignedById: trainer.id,
          },
        });

        // Start the diet plan
        const result = await startDietPlan(assignment.id);
        return NextResponse.json(result);
      } else {
        // Start existing plan
        if (!dietPlanAssignmentId) {
          return NextResponse.json(
            { error: "Diet plan assignment ID required" },
            { status: 400 }
          );
        }

        const result = await startDietPlan(dietPlanAssignmentId);
        return NextResponse.json(result);
      }
    }

    if (action === "complete-meal") {
      const { mealLogId, isCompleted } = body;

      if (!mealLogId) {
        return NextResponse.json(
          { error: "Meal log ID is required" },
          { status: 400 }
        );
      }

      try {
        const { completeMeal, uncompleteMeal } = await import(
          "../../services/dietTrackerService"
        );

        const result = isCompleted
          ? await completeMeal(mealLogId)
          : await uncompleteMeal(mealLogId);

        return NextResponse.json({
          success: true,
          message: `Meal ${
            isCompleted ? "completed" : "uncompleted"
          } successfully`,
          data: result,
        });
      } catch (validationError) {
        // Check if this is a day validation error
        if (
          validationError.message.includes("Cannot") &&
          (validationError.message.includes("past days") ||
            validationError.message.includes("future days"))
        ) {
          return NextResponse.json(
            { error: validationError.message },
            { status: 403 } // Forbidden - day is not editable
          );
        }

        // Re-throw other errors to be caught by outer catch
        throw validationError;
      }
    }

    if (action === "change-meal-option") {
      const { mealLogId, newOption } = body;

      if (!mealLogId || !newOption) {
        return NextResponse.json(
          { error: "Meal log ID and new option are required" },
          { status: 400 }
        );
      }

      try {
        const { changeMealOption } = await import(
          "../../services/dietTrackerService"
        );

        const result = await changeMealOption(mealLogId, newOption);

        return NextResponse.json({
          success: true,
          message: "Meal option changed successfully",
          data: result,
        });
      } catch (validationError) {
        // Check if this is a day validation error
        if (
          validationError.message.includes("Cannot") &&
          (validationError.message.includes("past days") ||
            validationError.message.includes("future days"))
        ) {
          return NextResponse.json(
            { error: validationError.message },
            { status: 403 } // Forbidden - day is not editable
          );
        }

        // Re-throw other errors to be caught by outer catch
        throw validationError;
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in diet tracker POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
