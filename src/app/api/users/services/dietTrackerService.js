import prisma from "@/lib/prisma";

import { 
  updateDailyLogProgress, 
  checkPlanCompletion
} from "./dietProgressService.js";

/**
 * Diet Tracker Service
 * Handles all diet tracking functionality including plan assignments, daily logs, and meal tracking
 */

// Day validation helper functions
function getDayStatus(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison

  const dayDate = new Date(date);
  dayDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

  if (dayDate < today) {
    return "past";
  } else if (dayDate.getTime() === today.getTime()) {
    return "current";
  } else {
    return "future";
  }
}

function isDayEditable(date) {
  // Always normalize dates to midnight for comparison
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // A day is editable if it's the current day
  return normalizedDate.getTime() === today.getTime();
}

function validateDayEdit(date, operation = "edit") {
  // Always normalize dates to midnight for comparison
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  const status = getDayStatus(normalizedDate);

  if (status === "past") {
    throw new Error(
      `Cannot ${operation} meals for past days. This day has already passed.`
    );
  }

  if (status === "future") {
    throw new Error(
      `Cannot ${operation} meals for future days. This day is not yet available.`
    );
  }

  return true;
}

// Get current active diet plan for a client
export async function getActiveDietPlan(clientId) {
  try {
    const assignment = await prisma.dietPlanAssignment.findFirst({
      where: {
        clientId,
        status: 'active',
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

    return assignment;
  } catch (error) {
    console.error("Error fetching active diet plan:", error);
    throw new Error("Error fetching active diet plan");
  }
}

// Get assigned but not started diet plans for a client
export async function getAssignedDietPlans(clientId) {
  try {
    const assignments = await prisma.dietPlanAssignment.findMany({
      where: {
        clientId,
        status: 'assigned',
        isActive: true,
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
        assignedAt: "desc",
      },
    });

    return assignments;
  } catch (error) {
    console.error("Error fetching assigned diet plans:", error);
    throw new Error("Error fetching assigned diet plans");
  }
}

// Start a diet plan for a client
export async function startDietPlan(dietPlanAssignmentId, startDate = null) {
  try {
    const assignment = await prisma.dietPlanAssignment.findUnique({
      where: { id: dietPlanAssignmentId },
      include: {
        nutritionPlan: true,
      },
    });

    if (!assignment) {
      throw new Error("Diet plan assignment not found");
    }

    if (assignment.status !== 'assigned') {
      throw new Error("Diet plan has already been started or is not in assigned status");
    }

    // Get the nutrition plan data
    const nutritionPlan = assignment.nutritionPlan;
    const days = nutritionPlan.days || [];
    const planStartDate = startDate ? new Date(startDate) : new Date();
    
    // Calculate end date
    const planEndDate = new Date(planStartDate);
    planEndDate.setDate(planEndDate.getDate() + days.length - 1);

    // Use transaction for atomic operation
    const result = await prisma.$transaction(async (tx) => {
      const dailyLogs = [];
      
      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const currentDate = new Date(planStartDate);
        currentDate.setDate(currentDate.getDate() + i);

        // Calculate target nutrition for this day
        const nutritionInfo = nutritionPlan.nutritionInfo || {};
        const targetCalories = nutritionInfo.calories || 0;
        const targetProtein = nutritionInfo.protein || 0;
        const targetCarbs = nutritionInfo.carbs || 0;
        const targetFats = nutritionInfo.fats || 0;

        const dailyLog = await tx.dailyDietLog.create({
          data: {
            dietPlanAssignmentId: assignment.id,
            date: currentDate,
            dayNumber: i + 1,
            totalMeals: day.meals?.length || 0,
            targetCalories,
            targetProtein,
            targetCarbs,
            targetFat: targetFats,
          },
        });

        // Create meal logs for each meal in the day
        if (day.meals) {
          for (const meal of day.meals) {
            await tx.mealLog.create({
              data: {
                dailyDietLogId: dailyLog.id,
                mealName: meal.name,
                mealTime: meal.time,
                selectedOption: meal.options?.[0] || {},
                calories: meal.options?.[0]?.calories || 0,
                protein: meal.options?.[0]?.protein || 0,
                carbs: meal.options?.[0]?.carbs || 0,
                fat: meal.options?.[0]?.fat || 0,
              },
            });
          }
        }

        dailyLogs.push(dailyLog);
      }

      // Update assignment to active status
      const updatedAssignment = await tx.dietPlanAssignment.update({
        where: { id: assignment.id },
        data: {
          status: 'active',
          startDate: planStartDate,
          endDate: planEndDate,
          actualStartDate: new Date(),
          totalDays: days.length,
        },
      });

      return { dailyLogs, assignment: updatedAssignment };
    });

    return {
      success: true,
      message: "Diet plan started successfully! Day 1 begins now.",
      dailyLogs: result.dailyLogs,
      assignment: result.assignment,
      planDuration: days.length,
      startDate: planStartDate,
      endDate: planEndDate,
    };
  } catch (error) {
    console.error("Error starting diet plan:", error);
    throw error;
  }
}

// Get daily diet log with meals for a specific date
export async function getDailyDietLog(dietPlanAssignmentId, date) {
  try {
    const dailyLog = await prisma.dailyDietLog.findFirst({
      where: {
        dietPlanAssignmentId,
        date: new Date(date),
      },
      include: {
        mealLogs: {
          orderBy: {
            mealTime: "asc",
          },
        },
        dietPlanAssignment: {
          include: {
            nutritionPlan: true,
          },
        },
      },
    });

    return dailyLog;
  } catch (error) {
    console.error("Error fetching daily diet log:", error);
    throw error;
  }
}

// Get all daily logs for a diet plan assignment
export async function getAllDailyLogs(dietPlanAssignmentId) {
  try {
    const dailyLogs = await prisma.dailyDietLog.findMany({
      where: {
        dietPlanAssignmentId,
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
      orderBy: {
        date: "asc",
      },
    });

    // Calculate nutrition totals including snacks
    const enrichedLogs = dailyLogs.map((log) => {
      // Calculate nutrition from meal logs
      const mealNutrition = log.mealLogs
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

      // Calculate nutrition from snack logs
      const snackNutrition = log.snackLogs.reduce(
        (total, snack) => ({
          calories: total.calories + (snack.calories || 0),
          protein: total.protein + (snack.protein || 0),
          carbs: total.carbs + (snack.carbs || 0),
          fat: total.fat + (snack.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      // Combine meal and snack nutrition
      const totalNutrition = {
        calories: mealNutrition.calories + snackNutrition.calories,
        protein: mealNutrition.protein + snackNutrition.protein,
        carbs: mealNutrition.carbs + snackNutrition.carbs,
        fat: mealNutrition.fat + snackNutrition.fat,
      };

      return {
        ...log,
        // Keep meal completion separate from nutrition totals
        totalCalories: totalNutrition.calories,
        totalProtein: totalNutrition.protein,
        totalCarbs: totalNutrition.carbs,
        totalFat: totalNutrition.fat,
        // Add snack count for reference
        snackCount: log.snackLogs.length,
      };
    });

    return enrichedLogs;
  } catch (error) {
    console.error("Error getting all daily logs:", error);
    throw error;
  }
}

// Single function to update meal completion status
async function updateMealCompletionStatus(mealLogId, isCompleted) {
  try {
    // First get the meal to check its date
    const mealLog = await prisma.mealLog.findUnique({
      where: { id: mealLogId },
      include: {
        dailyDietLog: true,
      },
    });

    if (!mealLog) {
      throw new Error("Meal log not found");
    }

    // Validate that the day is editable
    validateDayEdit(
      mealLog.dailyDietLog.date,
      isCompleted ? "complete" : "uncomplete"
    );

    const updatedMealLog = await prisma.mealLog.update({
      where: { id: mealLogId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      include: {
        dailyDietLog: true,
      },
    });

    // Update daily totals and progress
    await updateDailyTotals(updatedMealLog.dailyDietLog.id);
    
    // Update progress calculations
    await updateDailyLogProgress(updatedMealLog.dailyDietLog.id);
    
    // Check if plan should be completed
    const completionCheck = await checkPlanCompletion(updatedMealLog.dailyDietLog.dietPlanAssignmentId);
    
    return {
      ...updatedMealLog,
      planCompletion: completionCheck
    };
  } catch (error) {
    console.error(
      `Error ${isCompleted ? "completing" : "uncompleting"} meal:`,
      error
    );
    throw error;
  }
}

// Mark a meal as completed
export async function completeMeal(mealLogId) {
  return updateMealCompletionStatus(mealLogId, true);
}

// Mark a meal as not completed
export async function uncompleteMeal(mealLogId) {
  return updateMealCompletionStatus(mealLogId, false);
}

// Update daily nutrition totals
export async function updateDailyTotals(dailyDietLogId) {
  try {
    const mealLogs = await prisma.mealLog.findMany({
      where: {
        dailyDietLogId,
        isCompleted: true,
      },
    });

    const totals = mealLogs.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const completedMeals = mealLogs.length;
    const totalMeals = await prisma.mealLog.count({
      where: { dailyDietLogId },
    });

    const updatedLog = await prisma.dailyDietLog.update({
      where: { id: dailyDietLogId },
      data: {
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
        completedMeals,
        isCompleted: completedMeals === totalMeals,
      },
    });

    return updatedLog;
  } catch (error) {
    console.error("Error updating daily totals:", error);
    throw error;
  }
}

// Get next upcoming meal
export async function getNextMeal(dietPlanAssignmentId) {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Date object for today

    // First, try to find an incomplete meal for today
    const todayLog = await prisma.dailyDietLog.findFirst({
      where: {
        dietPlanAssignmentId,
        date: today,
      },
      include: {
        mealLogs: {
          where: {
            isCompleted: false,
          },
          orderBy: {
            mealTime: "asc",
          },
        },
      },
    });

    if (todayLog && todayLog.mealLogs.length > 0) {
      // Find the next meal based on current time
      const nextMeal = todayLog.mealLogs.find(
        (meal) => meal.mealTime >= currentTime
      );

      if (nextMeal) {
        return {
          ...nextMeal,
          dayNumber: todayLog.dayNumber,
          date: todayLog.date,
        };
      }

      // If no future meals today, return the first incomplete meal
      return {
        ...todayLog.mealLogs[0],
        dayNumber: todayLog.dayNumber,
        date: todayLog.date,
      };
    }

    // If no incomplete meals today, find the next day with incomplete meals
    const futureLogs = await prisma.dailyDietLog.findMany({
      where: {
        dietPlanAssignmentId,
        date: {
          gt: today,
        },
      },
      include: {
        mealLogs: {
          where: {
            isCompleted: false,
          },
          orderBy: {
            mealTime: "asc",
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    for (const log of futureLogs) {
      if (log.mealLogs.length > 0) {
        return {
          ...log.mealLogs[0],
          dayNumber: log.dayNumber,
          date: log.date,
        };
      }
    }

    return null; // No upcoming meals
  } catch (error) {
    console.error("Error getting next meal:", error);
    throw error;
  }
}

// Get diet plan progress/stats
export async function getDietPlanStats(dietPlanAssignmentId) {
  try {
    const assignment = await prisma.dietPlanAssignment.findUnique({
      where: { id: dietPlanAssignmentId },
      include: {
        nutritionPlan: true,
        dailyLogs: {
          include: {
            mealLogs: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new Error("Diet plan assignment not found");
    }

    const totalDays = assignment.dailyLogs.length;
    const completedDays = assignment.dailyLogs.filter(
      (log) => log.isCompleted
    ).length;

    const totalMeals = assignment.dailyLogs.reduce(
      (sum, log) => sum + log.totalMeals,
      0
    );
    const completedMeals = assignment.dailyLogs.reduce(
      (sum, log) => sum + log.completedMeals,
      0
    );

    const averageCalories =
      assignment.dailyLogs.length > 0
        ? assignment.dailyLogs.reduce(
            (sum, log) => sum + log.totalCalories,
            0
          ) / assignment.dailyLogs.length
        : 0;

    const averageProtein =
      assignment.dailyLogs.length > 0
        ? assignment.dailyLogs.reduce((sum, log) => sum + log.totalProtein, 0) /
          assignment.dailyLogs.length
        : 0;

    const averageCarbs =
      assignment.dailyLogs.length > 0
        ? assignment.dailyLogs.reduce((sum, log) => sum + log.totalCarbs, 0) /
          assignment.dailyLogs.length
        : 0;

    const averageFat =
      assignment.dailyLogs.length > 0
        ? assignment.dailyLogs.reduce((sum, log) => sum + log.totalFat, 0) /
          assignment.dailyLogs.length
        : 0;

    return {
      totalDays,
      completedDays,
      totalMeals,
      completedMeals,
      adherenceRate: totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0,
      dayCompletionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
      averageNutrition: {
        calories: Math.round(averageCalories),
        protein: Math.round(averageProtein * 10) / 10,
        carbs: Math.round(averageCarbs * 10) / 10,
        fat: Math.round(averageFat * 10) / 10,
      },
      nutritionPlan: assignment.nutritionPlan,
      startDate: assignment.startDate,
    };
  } catch (error) {
    console.error("Error getting diet plan stats:", error);
    throw error;
  }
}

// Change meal option for a meal log
export async function changeMealOption(mealLogId, newOption) {
  try {
    // First get the meal to check its date
    const mealLog = await prisma.mealLog.findUnique({
      where: { id: mealLogId },
      include: {
        dailyDietLog: true,
      },
    });

    if (!mealLog) {
      throw new Error("Meal log not found");
    }

    // Validate that the day is editable
    validateDayEdit(mealLog.dailyDietLog.date, "change meal option for");

    const updatedMealLog = await prisma.mealLog.update({
      where: { id: mealLogId },
      data: {
        selectedOption: newOption,
        calories: newOption.calories || 0,
        protein: newOption.protein || 0,
        carbs: newOption.carbs || 0,
        fat: newOption.fat || 0,
      },
      include: {
        dailyDietLog: true,
      },
    });

    // Update daily totals if meal is completed
    if (updatedMealLog.isCompleted) {
      await updateDailyTotals(updatedMealLog.dailyDietLog.id);
    }

    return updatedMealLog;
  } catch (error) {
    console.error("Error changing meal option:", error);
    throw error;
  }
}

// Add a custom meal/snack to a specific day
export async function addCustomMealToDay(
  dietPlanAssignmentId,
  date,
  customMeal
) {
  try {
    // Validate day editability
    const assignment = await prisma.dietPlanAssignment.findUnique({
      where: { id: dietPlanAssignmentId },
      include: {
        nutritionPlan: true,
      },
    });

    if (!assignment) {
      throw new Error("Diet plan assignment not found");
    }

    const startDate = new Date(assignment.startDate);
    const targetDate = new Date(date);
    const today = new Date();

    // Reset time parts for accurate comparison
    startDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Only allow editing current day
    if (targetDate.getTime() !== today.getTime()) {
      throw new Error(
        targetDate < today ? "Cannot edit past days" : "Cannot edit future days"
      );
    }

    // Get or create daily log
    let dailyLog = await prisma.dailyDietLog.findFirst({
      where: {
        dietPlanAssignmentId,
        date: {
          gte: new Date(targetDate.getTime()),
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
      include: {
        mealLogs: true,
        snackLogs: true,
      },
    });

    if (!dailyLog) {
      // Calculate day number
      const daysDiff = Math.floor(
        (targetDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const dayNumber = daysDiff + 1;

      // Create daily log
      dailyLog = await prisma.dailyDietLog.create({
        data: {
          dietPlanAssignmentId,
          date: targetDate,
          dayNumber,
          totalMeals: 0,
          completedMeals: 0,
        },
        include: {
          mealLogs: true,
          snackLogs: true,
        },
      });
    }

    // Create snack log
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const snackLog = await prisma.snackLog.create({
      data: {
        dailyDietLogId: dailyLog.id,
        name: customMeal.name,
        description: customMeal.description,
        mealType: customMeal.mealType || "snack",
        calories: customMeal.calories,
        protein: customMeal.protein,
        carbs: customMeal.carbs,
        fat: customMeal.fat,
        ingredients: customMeal.ingredients || [],
        loggedAt: new Date(),
        loggedTime: currentTime,
      },
    });

    // Save to custom meal history for reuse
    try {
      await saveCustomMealToHistory(
        assignment.clientId,
        customMeal.name,
        customMeal.description,
        customMeal.mealType || "snack",
        customMeal.calories,
        customMeal.protein,
        customMeal.carbs,
        customMeal.fat,
        customMeal.ingredients || []
      );
    } catch (historyError) {
      console.error("Error saving to history:", historyError);
      // Don't fail the whole operation if history save fails
    }

    return snackLog;
  } catch (error) {
    console.error("Error adding custom meal to day:", error);
    throw error;
  }
}

// Delete a snack log
export async function deleteSnackLog(snackLogId) {
  try {
    // Validate that the snack log exists
    const snackLog = await prisma.snackLog.findUnique({
      where: { id: snackLogId },
      include: {
        dailyDietLog: {
          include: {
            dietPlanAssignment: true,
          },
        },
      },
    });

    if (!snackLog) {
      throw new Error("Snack log not found");
    }

    // Delete the snack log
    await prisma.snackLog.delete({
      where: { id: snackLogId },
    });

    return { success: true, message: "Snack deleted successfully" };
  } catch (error) {
    console.error("Error deleting snack log:", error);
    throw error;
  }
}

// Helper function to save custom meal to history
async function saveCustomMealToHistory(
  clientId,
  name,
  description,
  mealType,
  calories,
  protein,
  carbs,
  fat,
  ingredients
) {
  const existingMeal = await prisma.customMeal.findFirst({
    where: {
      clientId,
      name: name.trim(),
      mealType: mealType.toLowerCase(),
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
    },
  });

  if (existingMeal) {
    await prisma.customMeal.update({
      where: { id: existingMeal.id },
      data: {
        usageCount: existingMeal.usageCount + 1,
        lastUsed: new Date(),
      },
    });
  } else {
    await prisma.customMeal.create({
      data: {
        clientId,
        name: name.trim(),
        description: description?.trim() || null,
        mealType: mealType.toLowerCase(),
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        ingredients: ingredients || [],
        usageCount: 1,
        lastUsed: new Date(),
      },
    });
  }
}

// Export validation helpers for use in API routes
export { getDayStatus, isDayEditable, validateDayEdit };
