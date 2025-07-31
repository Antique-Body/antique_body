import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { mockNutritionPlan as mockPlanData } from "@/components/custom/dashboard/client/pages/diet-tracker/mockNutritionPlan";
import prisma from "@/lib/prisma";

import {
  calculatePlanProgress,
  generateProgressMessage,
} from "../../services/dietProgressService";
import {
  getActiveDietPlan,
  getAssignedDietPlans,
  startDietPlan,
  getAllDailyLogs,
  getDietPlanStats,
  getNextMeal,
  updateWaterIntake,
  getWaterIntake,
} from "../../services/dietTrackerService";
// Import the mock nutrition plan directly

// GET: Get current diet plan and progress for client
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if this is a trainer viewing a client's data
    const isTrainerView = req.headers.get("x-trainer-view") === "true";
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    // If trainer view, verify the trainer has access to this client
    let clientInfo;

    if (isTrainerView && targetUserId) {
      // Verify that the trainer has access to this client
      const trainerInfo = await prisma.trainerInfo.findUnique({
        where: { userId: session.user.id },
      });

      if (!trainerInfo) {
        return NextResponse.json(
          { error: "Unauthorized - Not a trainer" },
          { status: 403 }
        );
      }

      // Check if this client is assigned to the trainer
      const coachingRequest = await prisma.coachingRequest.findFirst({
        where: {
          trainerId: trainerInfo.id,
          client: {
            userId: targetUserId,
          },
          status: "accepted",
        },
      });

      if (!coachingRequest) {
        return NextResponse.json(
          { error: "Unauthorized - Client not assigned to trainer" },
          { status: 403 }
        );
      }

      // Get client info for the target user
      clientInfo = await prisma.clientInfo.findUnique({
        where: { userId: targetUserId },
      });
    } else {
      // Regular client view - get client's own info
      clientInfo = await prisma.clientInfo.findUnique({
        where: { userId: session.user.id },
      });
    }

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

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
      console.log(
        `next-meal action: Active plan found: ${activePlan ? "yes" : "no"}`
      );

      if (!activePlan) {
        // Check for any plans that might have been incorrectly marked as inactive
        const anyPlan = await prisma.dietPlanAssignment.findFirst({
          where: {
            clientId: clientInfo.id,
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        console.log(
          `next-meal action: Found any active plan: ${anyPlan ? "yes" : "no"}`
        );

        if (anyPlan) {
          // Found a plan that's marked as active but not with 'active' status
          // This is likely a bug, so let's fix it and return it as the active plan
          console.log(
            `next-meal action: Fixing plan status from ${anyPlan.status} to active`
          );

          const fixedPlan = await prisma.dietPlanAssignment.update({
            where: { id: anyPlan.id },
            data: {
              status: "active",
            },
          });

          // Get next meal for the fixed plan
          const nextMeal = await getNextMeal(fixedPlan.id);
          return NextResponse.json({
            nextMeal,
            planFixed: true,
          });
        }

        // Check if there are any assigned plans that might need to be started
        const assignedPlans = await getAssignedDietPlans(clientInfo.id);

        if (assignedPlans.length > 0) {
          // There's an assigned plan that could be started
          return NextResponse.json({
            nextMeal: null,
            hasAssignedPlan: true,
            assignedPlan: assignedPlans[0],
          });
        }

        return NextResponse.json(
          { error: "No active diet plan found" },
          { status: 404 }
        );
      }

      const nextMeal = await getNextMeal(activePlan.id);
      return NextResponse.json({ nextMeal });
    }

    if (action === "water-intake") {
      // Get water intake for active plan
      const activePlan = await getActiveDietPlan(clientInfo.id);
      if (!activePlan) {
        return NextResponse.json(
          { error: "No active diet plan found" },
          { status: 404 }
        );
      }

      const waterIntake = await getWaterIntake(activePlan.id);
      return NextResponse.json(waterIntake);
    }

    // Default: Get current active diet plan
    const activePlan = await getActiveDietPlan(clientInfo.id);
    console.log(
      `GET diet-tracker: Active plan found: ${activePlan ? "yes" : "no"}`
    );

    if (!activePlan) {
      // Check if there are any assigned nutrition plans that haven't been started yet
      const assignedPlans = await getAssignedDietPlans(clientInfo.id);
      console.log(
        `GET diet-tracker: Found ${assignedPlans.length} assigned plans`
      );

      if (assignedPlans.length > 0) {
        // There's an assigned nutrition plan that hasn't been started
        const latestAssignment = assignedPlans[0];
        return NextResponse.json({
          hasActivePlan: false,
          assignedPlan: latestAssignment,
          planCount: assignedPlans.length,
          message: `${latestAssignment.assignedBy.trainerProfile?.firstName || "Your trainer"} has assigned you a new nutrition plan. Are you ready to start your journey?`,
        });
      }

      // Check for any plans that might have been incorrectly marked as inactive
      const anyPlan = await prisma.dietPlanAssignment.findFirst({
        where: {
          clientId: clientInfo.id,
          isActive: true,
        },
        include: {
          nutritionPlan: true,
          assignedBy: {
            include: {
              trainerProfile: true,
            },
          },
          progressSummary: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log(
        `GET diet-tracker: Found any active plan: ${anyPlan ? "yes" : "no"}`
      );

      if (anyPlan) {
        // Found a plan that's marked as active but not with 'active' status
        // This is likely a bug, so let's fix it and return it as the active plan
        console.log(
          `GET diet-tracker: Fixing plan status from ${anyPlan.status} to active`
        );

        const fixedPlan = await prisma.dietPlanAssignment.update({
          where: { id: anyPlan.id },
          data: {
            status: "active",
          },
          include: {
            nutritionPlan: true,
            assignedBy: {
              include: {
                trainerProfile: true,
              },
            },
            progressSummary: true,
          },
        });

        // Get all daily logs for the fixed plan
        const dailyLogs = await getAllDailyLogs(fixedPlan.id);

        // Get next meal
        const nextMeal = await getNextMeal(fixedPlan.id);

        // Calculate current progress
        const progress = await calculatePlanProgress(fixedPlan.id);
        const progressMessage = generateProgressMessage(progress);

        // Return the fixed plan
        return NextResponse.json({
          hasActivePlan: true,
          activePlan: fixedPlan,
          dailyLogs,
          nextMeal,
          progress,
          progressMessage,
          isCompleted: false,
          isPastEndDate: false,
          completionStatus: "active",
        });
      }

      // No assigned plans, check if there's a mock plan available (for demo purposes)
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

    // Calculate current progress
    const progress = await calculatePlanProgress(activePlan.id);
    const progressMessage = generateProgressMessage(progress);

    // Check if plan is completed
    const today = new Date();
    const planEndDate = activePlan.endDate
      ? new Date(activePlan.endDate)
      : null;
    const isCompleted = activePlan.status === "completed";
    const isPastEndDate = planEndDate && today > planEndDate;

    return NextResponse.json({
      hasActivePlan: true,
      activePlan,
      dailyLogs,
      nextMeal,
      progress,
      progressMessage,
      isCompleted,
      isPastEndDate,
      completionStatus: isCompleted
        ? "completed"
        : isPastEndDate
          ? "expired"
          : "active",
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
    const { action, dietPlanAssignmentId, useMockPlan, selectedPlan } = body;

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
      const { startDate } = body; // Allow custom start date

      if (dietPlanAssignmentId) {
        // Start existing assigned plan
        const result = await startDietPlan(dietPlanAssignmentId, startDate);
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

        // Use selected plan data if provided, otherwise use default mock data
        const planData = selectedPlan || mockPlanData;

        // Check if this specific nutrition plan already exists
        let existingNutritionPlan = await prisma.nutritionPlan.findFirst({
          where: {
            trainerInfoId: trainer.id,
            title: planData.title,
          },
        });

        // If no plan exists, create one using the plan data
        if (!existingNutritionPlan) {
          existingNutritionPlan = await prisma.nutritionPlan.create({
            data: {
              title: planData.title,
              description: planData.description,
              coverImage: planData.coverImage,
              price: planData.price || 100,
              duration: planData.duration,
              durationType: planData.durationType,
              nutritionInfo: {
                calories:
                  planData.nutritionInfo?.calories ||
                  planData.dailyCaloriesGoal ||
                  2000,
                protein:
                  planData.nutritionInfo?.protein ||
                  planData.dailyProteinGoal ||
                  150,
                carbs:
                  planData.nutritionInfo?.carbs ||
                  planData.dailyCarbsGoal ||
                  200,
                fats:
                  planData.nutritionInfo?.fats || planData.dailyFatGoal || 80,
              },
              days: planData.days,
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
        // Check if there's an assigned plan to start
        const assignedPlans = await getAssignedDietPlans(clientInfo.id);

        if (assignedPlans.length === 0) {
          return NextResponse.json(
            { error: "No assigned nutrition plan found" },
            { status: 404 }
          );
        }

        const latestAssignment = assignedPlans[0];
        const result = await startDietPlan(latestAssignment.id, startDate);
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

    if (action === "update-water-intake") {
      const { dietPlanAssignmentId, amountMl } = body;

      if (!dietPlanAssignmentId || !amountMl) {
        return NextResponse.json(
          { error: "Diet plan assignment ID and amount are required" },
          { status: 400 }
        );
      }

      if (amountMl <= 0 || amountMl > 2000) {
        return NextResponse.json(
          { error: "Amount must be between 1ml and 2000ml" },
          { status: 400 }
        );
      }

      try {
        const result = await updateWaterIntake(dietPlanAssignmentId, amountMl);
        return NextResponse.json({
          success: true,
          message: `Added ${amountMl}ml to your daily water intake`,
          data: result,
        });
      } catch (error) {
        if (error.message.includes("not found")) {
          return NextResponse.json(
            { error: "Diet plan not found" },
            { status: 404 }
          );
        }
        if (error.message.includes("not active")) {
          return NextResponse.json(
            { error: "Diet plan is not active" },
            { status: 403 }
          );
        }
        throw error;
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
