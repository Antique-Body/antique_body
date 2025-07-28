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

    // Check for assigned nutrition plans first
    const assignedNutritionPlan = await prisma.assignedNutritionPlan.findFirst({
      where: {
        clientId: clientInfo.id,
        status: "active",
      },
      include: {
        originalPlan: true,
        trainer: {
          include: {
            trainerProfile: true,
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    // Check for active diet plan assignment
    const activePlan = await getActiveDietPlan(clientInfo.id);

    if (assignedNutritionPlan && !activePlan) {
      // Client has an assigned plan but no active diet tracker
      return NextResponse.json({
        hasActivePlan: false,
        hasAssignedPlan: true,
        assignedPlan: assignedNutritionPlan,
        message:
          "Your trainer has assigned you a nutrition plan. Would you like to start tracking it?",
      });
    }

    if (!activePlan && !assignedNutritionPlan) {
      // No active plan and no assigned plan
      return NextResponse.json({
        hasActivePlan: false,
        hasAssignedPlan: false,
        mockPlanAvailable: true,
        message:
          "No nutrition plan assigned yet. Contact your trainer to get started.",
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
    const {
      action,
      dietPlanAssignmentId,
      useMockPlan,
      assignedNutritionPlanId,
    } = body;

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
      if (assignedNutritionPlanId) {
        // Start plan from assigned nutrition plan
        const assignedPlan = await prisma.assignedNutritionPlan.findUnique({
          where: { id: assignedNutritionPlanId },
          include: { originalPlan: true },
        });

        if (!assignedPlan) {
          return NextResponse.json(
            { error: "Assigned nutrition plan not found" },
            { status: 404 }
          );
        }

        // Create diet plan assignment from the assigned nutrition plan
        const assignment = await prisma.dietPlanAssignment.create({
          data: {
            clientId: clientInfo.id,
            nutritionPlanId: assignedPlan.originalPlanId,
            assignedById: assignedPlan.trainerId,
          },
        });

        // Start the diet plan
        const result = await startDietPlan(assignment.id);
        return NextResponse.json(result);
      } else if (useMockPlan) {
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

    if (action === "log-meal") {
      const { mealName, mealTime, selectedOption, date } = body;

      if (!mealName || !selectedOption || !date) {
        return NextResponse.json(
          { error: "Meal name, selected option, and date are required" },
          { status: 400 }
        );
      }

      try {
        // Get the active diet plan assignment
        const activeAssignment = await prisma.dietPlanAssignment.findFirst({
          where: {
            clientId: clientInfo.id,
            isActive: true,
          },
        });

        if (!activeAssignment) {
          return NextResponse.json(
            { error: "No active diet plan found" },
            { status: 404 }
          );
        }

        // Get or create daily log for the specified date
        let dailyLog = await prisma.dailyDietLog.findFirst({
          where: {
            dietPlanAssignmentId: activeAssignment.id,
            date: new Date(date),
          },
        });

        if (!dailyLog) {
          dailyLog = await prisma.dailyDietLog.create({
            data: {
              dietPlanAssignmentId: activeAssignment.id,
              date: new Date(date),
            },
          });
        }

        // Create meal log with the selected option and portion information
        const mealLog = await prisma.mealLog.create({
          data: {
            dailyDietLogId: dailyLog.id,
            mealName,
            mealTime: mealTime || "",
            selectedOption: selectedOption,
            calories: selectedOption.calories || 0,
            protein: selectedOption.protein || 0,
            carbs: selectedOption.carbs || 0,
            fat: selectedOption.fat || 0,
            isCompleted: true,
            completedAt: new Date(),
            portionMultiplier: selectedOption.portionMultiplier || 1,
            isCustom: selectedOption.isCustom || false,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Meal logged successfully",
          data: mealLog,
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
