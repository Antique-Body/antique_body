import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { PrismaClient } from "@prisma/client";

// Create a new prisma instance for this route
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

import {
  getActiveDietPlan,
  startDietPlan,
  getAllDailyLogs,
  getDietPlanStats,
  getNextMeal,
  updateWaterIntake,
  logCustomMeal,
  logAlternativeMeal,
  updateMealPortion,
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

    // If there's a new assigned plan, deactivate old active diet plans (except the current one)
    if (assignedNutritionPlan) {
      await prisma.dietPlanAssignment.updateMany({
        where: {
          clientId: clientInfo.id,
          isActive: true,
          nutritionPlanId: {
            not: assignedNutritionPlan.originalPlanId,
          },
        },
        data: {
          isActive: false,
        },
      });
    }

    // Check for active diet plan assignment
    let activePlan = await getActiveDietPlan(clientInfo.id);

    // If we have an assigned plan but no active DietPlanAssignment, try to find/create one
    if (assignedNutritionPlan && !activePlan) {
      // Look for existing inactive DietPlanAssignment for this plan
      let dietPlanAssignment = await prisma.dietPlanAssignment.findFirst({
        where: {
          clientId: clientInfo.id,
          nutritionPlanId: assignedNutritionPlan.originalPlanId,
        },
        include: {
          nutritionPlan: true,
          assignedBy: {
            include: {
              trainerProfile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // If found but inactive, activate it
      if (dietPlanAssignment && !dietPlanAssignment.isActive) {
        await prisma.dietPlanAssignment.update({
          where: { id: dietPlanAssignment.id },
          data: {
            isActive: true,
            startDate: new Date(),
          },
        });
        // Refresh the active plan
        activePlan = await getActiveDietPlan(clientInfo.id);
      }
    }

    // If there's an active plan, check if it's a custom meal input plan
    if (activePlan) {
      // Check if this active plan corresponds to a custom meal input assigned plan
      const customAssignedPlan = await prisma.assignedNutritionPlan.findFirst({
        where: {
          clientId: clientInfo.id,
          status: "active",
          customMealInputEnabled: true,
        },
        include: {
          originalPlan: true,
          trainer: {
            include: {
              trainerProfile: true,
            },
          },
        },
      });

      if (customAssignedPlan) {
        // Return the custom meal input plan as assigned plan with documents
        return NextResponse.json({
          hasActivePlan: true,
          hasAssignedPlan: true,
          assignedPlan: customAssignedPlan,
          isCustomMealInput: true,
          activePlan: {
            ...activePlan,
            documents: customAssignedPlan.documents, // Include documents in active plan
          },
          dailyLogs: await getAllDailyLogs(activePlan.id),
          nextMeal: await getNextMeal(activePlan.id),
          message:
            "Your trainer has enabled custom meal input for you. You can now track your meals!",
        });
      }
    }

    if (assignedNutritionPlan && !activePlan) {
      // Client has an assigned plan but no active diet tracker
      console.log("DEBUG: Assigned plan found but no active plan:", {
        assignedPlanId: assignedNutritionPlan.id,
        originalPlanId: assignedNutritionPlan.originalPlanId,
        status: assignedNutritionPlan.status,
        clientId: clientInfo.id,
      });

      return NextResponse.json({
        hasActivePlan: false,
        hasAssignedPlan: true,
        assignedPlan: assignedNutritionPlan,
        isCustomMealInput: assignedNutritionPlan.customMealInputEnabled,
        message: assignedNutritionPlan.customMealInputEnabled
          ? "Your trainer has enabled custom meal input for you. Start tracking your meals!"
          : "Your trainer has assigned you a nutrition plan. Would you like to start tracking it?",
      });
    }

    if (!activePlan && !assignedNutritionPlan) {
      // No active plan and no assigned plan
      return NextResponse.json({
        hasActivePlan: false,
        hasAssignedPlan: false,
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

        // Check if this is a custom meal input plan
        if (assignedPlan.customMealInputEnabled) {
          // Create a diet plan assignment for custom meal input
          const assignment = await prisma.dietPlanAssignment.create({
            data: {
              clientId: clientInfo.id,
              nutritionPlanId: assignedPlan.originalPlanId,
              assignedById: assignedPlan.trainerId,
              startDate: new Date(),
            },
          });

          return NextResponse.json({
            message: "Custom meal input plan started successfully",
            assignmentId: assignment.id,
          });
        } else {
          // Start regular nutrition plan - create diet plan assignment first
          const assignment = await prisma.dietPlanAssignment.create({
            data: {
              clientId: clientInfo.id,
              nutritionPlanId: assignedPlan.originalPlanId,
              assignedById: assignedPlan.trainerId,
              startDate: new Date(),
            },
          });

          const result = await startDietPlan(assignment.id);
          return NextResponse.json(result);
        }
      } else if (useMockPlan) {
        return NextResponse.json(
          {
            error:
              "Mock plans are no longer supported. Please contact your trainer to get a nutrition plan assigned.",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error:
              "Invalid request. Please contact your trainer to get a nutrition plan assigned.",
          },
          { status: 400 }
        );
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

    if (action === "log-custom-meal") {
      const { mealType, mealData, date, portionMultiplier } = body;

      if (!mealType || !mealData || !date) {
        return NextResponse.json(
          { error: "Meal type, meal data, and date are required" },
          { status: 400 }
        );
      }

      try {
        const result = await logCustomMeal(
          clientInfo.id,
          date,
          mealType,
          mealData,
          portionMultiplier || 1
        );

        return NextResponse.json({
          success: true,
          message: "Custom meal logged successfully",
          data: result,
        });
      } catch (validationError) {
        if (
          validationError.message.includes("Cannot") &&
          (validationError.message.includes("past days") ||
            validationError.message.includes("future days"))
        ) {
          return NextResponse.json(
            { error: validationError.message },
            { status: 403 }
          );
        }
        throw validationError;
      }
    }

    if (action === "log-alternative-meal") {
      const { mealLogId, alternativeMealData, portionMultiplier } = body;

      if (!mealLogId || !alternativeMealData) {
        return NextResponse.json(
          { error: "Meal log ID and alternative meal data are required" },
          { status: 400 }
        );
      }

      try {
        const result = await logAlternativeMeal(
          mealLogId,
          alternativeMealData,
          portionMultiplier || 1
        );

        return NextResponse.json({
          success: true,
          message: "Alternative meal logged successfully",
          data: result,
        });
      } catch (validationError) {
        if (
          validationError.message.includes("Cannot") &&
          (validationError.message.includes("past days") ||
            validationError.message.includes("future days"))
        ) {
          return NextResponse.json(
            { error: validationError.message },
            { status: 403 }
          );
        }
        throw validationError;
      }
    }

    if (action === "update-portion") {
      const { mealLogId, portionMultiplier } = body;

      if (!mealLogId || !portionMultiplier) {
        return NextResponse.json(
          { error: "Meal log ID and portion multiplier are required" },
          { status: 400 }
        );
      }

      try {
        const result = await updateMealPortion(mealLogId, portionMultiplier);

        return NextResponse.json({
          success: true,
          message: "Meal portion updated successfully",
          data: result,
        });
      } catch (validationError) {
        if (
          validationError.message.includes("Cannot") &&
          (validationError.message.includes("past days") ||
            validationError.message.includes("future days"))
        ) {
          return NextResponse.json(
            { error: validationError.message },
            { status: 403 }
          );
        }
        throw validationError;
      }
    }

    if (action === "update-water") {
      const { date, waterAmount } = body;

      if (!date || waterAmount === undefined) {
        return NextResponse.json(
          { error: "Date and water amount are required" },
          { status: 400 }
        );
      }

      try {
        // Get active diet plan assignment
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

        const result = await updateWaterIntake(
          activeAssignment.id,
          date,
          waterAmount
        );

        return NextResponse.json({
          success: true,
          message: "Water intake updated successfully",
          data: result,
        });
      } catch (validationError) {
        if (
          validationError.message.includes("Cannot") &&
          (validationError.message.includes("past days") ||
            validationError.message.includes("future days"))
        ) {
          return NextResponse.json(
            { error: validationError.message },
            { status: 403 }
          );
        }
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
