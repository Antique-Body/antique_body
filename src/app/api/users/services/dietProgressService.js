import prisma from "@/lib/prisma";

/**
 * Diet Progress Service
 * Handles progress calculations, completion detection, and analytics for diet plans
 */

/**
 * Calculate daily progress targets and variances
 */
export function calculateDailyProgress(dailyLog, nutritionPlan) {
  const nutritionInfo = nutritionPlan.nutritionInfo || {};

  // Calculate target values for this day
  const targetCalories = nutritionInfo.calories || 0;
  const targetProtein = nutritionInfo.protein || 0;
  const targetCarbs = nutritionInfo.carbs || 0;
  const targetFats = nutritionInfo.fats || 0;

  // Calculate variances
  const calorieVariance = dailyLog.totalCalories - targetCalories;
  const proteinVariance = dailyLog.totalProtein - targetProtein;

  // Calculate completion rate
  const completionRate =
    dailyLog.totalMeals > 0
      ? (dailyLog.completedMeals / dailyLog.totalMeals) * 100
      : 0;

  return {
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFats,
    calorieVariance,
    proteinVariance,
    completionRate,
  };
}

/**
 * Calculate overall diet plan progress
 */
export async function calculatePlanProgress(dietPlanAssignmentId) {
  try {
    const assignment = await prisma.dietPlanAssignment.findUnique({
      where: { id: dietPlanAssignmentId },
      include: {
        nutritionPlan: true,
        dailyLogs: {
          orderBy: { date: "asc" },
        },
      },
    });

    if (!assignment) {
      throw new Error("Diet plan assignment not found");
    }

    const dailyLogs = assignment.dailyLogs;
    const totalDays = dailyLogs.length;

    if (totalDays === 0) {
      return {
        totalDays: 0,
        completedDays: 0,
        successRate: 0,
        averageCompletionRate: 0,
        consistencyScore: 0,
        adherenceScore: 0,
        overallSuccess: false,
      };
    }

    // Count completed days (days with >50% meal completion)
    const completedDays = dailyLogs.filter(
      (log) => log.completionRate >= 50
    ).length;

    // Calculate averages
    const totalCalories = dailyLogs.reduce(
      (sum, log) => sum + log.totalCalories,
      0
    );
    const totalProtein = dailyLogs.reduce(
      (sum, log) => sum + log.totalProtein,
      0
    );
    const totalCarbs = dailyLogs.reduce((sum, log) => sum + log.totalCarbs, 0);
    const totalFat = dailyLogs.reduce((sum, log) => sum + log.totalFat, 0);
    const totalCompletionRate = dailyLogs.reduce(
      (sum, log) => sum + log.completionRate,
      0
    );

    const averageCaloriesPerDay = totalCalories / totalDays;
    const averageProteinPerDay = totalProtein / totalDays;
    const averageCarbsPerDay = totalCarbs / totalDays;
    const averageFatPerDay = totalFat / totalDays;
    const averageCompletionRate = totalCompletionRate / totalDays;

    // Calculate consistency score (how consistent were the completion rates)
    const completionRates = dailyLogs.map((log) => log.completionRate);
    const avgCompletion = averageCompletionRate;
    const variance =
      completionRates.reduce(
        (sum, rate) => sum + Math.pow(rate - avgCompletion, 2),
        0
      ) / totalDays;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - standardDeviation); // Lower deviation = higher consistency

    // Calculate adherence score (how well they followed targets)
    const nutritionInfo = assignment.nutritionPlan.nutritionInfo || {};
    const targetCalories = nutritionInfo.calories || 2000;
    const targetProtein = nutritionInfo.protein || 150;

    const calorieAccuracy = dailyLogs.map((log) => {
      const variance = Math.abs(log.totalCalories - targetCalories);
      const percentageOff = (variance / targetCalories) * 100;
      return Math.max(0, 100 - percentageOff);
    });

    const proteinAccuracy = dailyLogs.map((log) => {
      const variance = Math.abs(log.totalProtein - targetProtein);
      const percentageOff = (variance / targetProtein) * 100;
      return Math.max(0, 100 - percentageOff);
    });

    const avgCalorieAccuracy =
      calorieAccuracy.reduce((sum, acc) => sum + acc, 0) / totalDays;
    const avgProteinAccuracy =
      proteinAccuracy.reduce((sum, acc) => sum + acc, 0) / totalDays;
    const adherenceScore =
      (avgCalorieAccuracy + avgProteinAccuracy + averageCompletionRate) / 3;

    // Calculate success rate
    const successRate = (completedDays / totalDays) * 100;

    // Determine overall success (>70% completion rate and >60% adherence)
    const overallSuccess = averageCompletionRate >= 70 && adherenceScore >= 60;

    // Find best and worst days
    const bestDay = dailyLogs.reduce((best, current) =>
      current.completionRate > best.completionRate ? current : best
    );
    const worstDay = dailyLogs.reduce((worst, current) =>
      current.completionRate < worst.completionRate ? current : worst
    );

    return {
      totalDays,
      completedDays,
      successRate,
      averageCaloriesPerDay,
      averageProteinPerDay,
      averageCarbsPerDay,
      averageFatPerDay,
      averageCompletionRate,
      totalCaloriesConsumed: totalCalories,
      totalProteinConsumed: totalProtein,
      consistencyScore,
      adherenceScore,
      overallSuccess,
      bestDay: bestDay.date,
      worstDay: worstDay.date,
      calorieAccuracy: avgCalorieAccuracy,
      proteinAccuracy: avgProteinAccuracy,
    };
  } catch (error) {
    console.error("Error calculating plan progress:", error);
    throw error;
  }
}

/**
 * Update daily log with progress calculations
 */
export async function updateDailyLogProgress(dailyLogId) {
  try {
    const dailyLog = await prisma.dailyDietLog.findUnique({
      where: { id: dailyLogId },
      include: {
        dietPlanAssignment: {
          include: {
            nutritionPlan: true,
          },
        },
        mealLogs: true,
        snackLogs: true,
      },
    });

    if (!dailyLog) {
      throw new Error("Daily log not found");
    }

    // Calculate nutrition totals
    const mealNutrition = dailyLog.mealLogs.reduce(
      (totals, meal) => ({
        calories: totals.calories + (meal.calories || 0),
        protein: totals.protein + (meal.protein || 0),
        carbs: totals.carbs + (meal.carbs || 0),
        fat: totals.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const snackNutrition = dailyLog.snackLogs.reduce(
      (totals, snack) => ({
        calories: totals.calories + (snack.calories || 0),
        protein: totals.protein + (snack.protein || 0),
        carbs: totals.carbs + (snack.carbs || 0),
        fat: totals.fat + (snack.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const totalCalories = mealNutrition.calories + snackNutrition.calories;
    const totalProtein = mealNutrition.protein + snackNutrition.protein;
    const totalCarbs = mealNutrition.carbs + snackNutrition.carbs;
    const totalFat = mealNutrition.fat + snackNutrition.fat;

    // Calculate completion metrics
    const completedMeals = dailyLog.mealLogs.filter(
      (meal) => meal.isCompleted
    ).length;
    const totalMeals = dailyLog.mealLogs.length;
    const completionRate =
      totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

    // Calculate progress values
    const progress = calculateDailyProgress(
      {
        ...dailyLog,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        completedMeals,
        totalMeals,
      },
      dailyLog.dietPlanAssignment.nutritionPlan
    );

    // Update the daily log
    const updatedLog = await prisma.dailyDietLog.update({
      where: { id: dailyLogId },
      data: {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        completedMeals,
        totalMeals,
        completionRate,
        targetCalories: progress.targetCalories,
        targetProtein: progress.targetProtein,
        targetCarbs: progress.targetCarbs,
        targetFat: progress.targetFats,
        calorieVariance: progress.calorieVariance,
        proteinVariance: progress.proteinVariance,
        isCompleted: completionRate >= 50, // Consider day completed if >50% meals done
      },
    });

    return updatedLog;
  } catch (error) {
    console.error("Error updating daily log progress:", error);
    throw error;
  }
}

/**
 * Create or update progress summary
 */
export async function updateProgressSummary(dietPlanAssignmentId) {
  try {
    const progress = await calculatePlanProgress(dietPlanAssignmentId);

    const existingSummary = await prisma.dietProgressSummary.findUnique({
      where: { dietPlanAssignmentId },
    });

    const summaryData = {
      averageCaloriesPerDay: progress.averageCaloriesPerDay,
      averageProteinPerDay: progress.averageProteinPerDay,
      averageCarbsPerDay: progress.averageCarbsPerDay,
      averageFatPerDay: progress.averageFatPerDay,
      averageCompletionRate: progress.averageCompletionRate,
      totalCaloriesConsumed: progress.totalCaloriesConsumed,
      totalProteinConsumed: progress.totalProteinConsumed,
      bestDay: progress.bestDay,
      worstDay: progress.worstDay,
      consistencyScore: progress.consistencyScore,
      adherenceScore: progress.adherenceScore,
      overallSuccess: progress.overallSuccess,
      completedOnTime: true, // Will be calculated based on completion date vs expected date
      daysAhead: 0, // Will be calculated based on actual vs expected progress
    };

    if (existingSummary) {
      return await prisma.dietProgressSummary.update({
        where: { dietPlanAssignmentId },
        data: summaryData,
      });
    } else {
      return await prisma.dietProgressSummary.create({
        data: {
          dietPlanAssignmentId,
          ...summaryData,
        },
      });
    }
  } catch (error) {
    console.error("Error updating progress summary:", error);
    throw error;
  }
}

/**
 * Check if diet plan should be completed
 */
export async function checkPlanCompletion(dietPlanAssignmentId) {
  try {
    const assignment = await prisma.dietPlanAssignment.findUnique({
      where: { id: dietPlanAssignmentId },
      include: {
        nutritionPlan: true,
        dailyLogs: {
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!assignment) {
      throw new Error("Diet plan assignment not found");
    }

    const nutritionPlan = assignment.nutritionPlan;
    const planDays = nutritionPlan.days || [];
    const totalPlanDays = planDays.length;
    const completedDays = assignment.dailyLogs.filter(
      (log) => log.isCompleted
    ).length;
    const currentDay = assignment.dailyLogs.length;

    // Only check for completion if we've reached the end of the plan
    // AND the plan is still active
    const shouldComplete =
      currentDay >= totalPlanDays && assignment.status === "active";

    // Don't mark as complete unless we've actually finished all days
    // This prevents accidental completion when adding daily logs
    if (shouldComplete && currentDay === totalPlanDays) {
      const successfulCompletion = completedDays >= totalPlanDays * 0.7; // 70% completion threshold

      // Update assignment status
      const updatedAssignment = await prisma.dietPlanAssignment.update({
        where: { id: dietPlanAssignmentId },
        data: {
          status: successfulCompletion ? "completed" : "abandoned",
          completedDate: new Date(),
          actualEndDate: new Date(),
          completedDays,
          successRate: (completedDays / totalPlanDays) * 100,
        },
      });

      // Create final progress summary
      await updateProgressSummary(dietPlanAssignmentId);

      return {
        completed: true,
        successful: successfulCompletion,
        completedDays,
        totalDays: totalPlanDays,
        successRate: (completedDays / totalPlanDays) * 100,
        assignment: updatedAssignment,
      };
    }

    // Otherwise, return current progress without completing the plan
    return {
      completed: false,
      currentDay,
      totalDays: totalPlanDays,
      completedDays,
      remainingDays: totalPlanDays - currentDay,
    };
  } catch (error) {
    console.error("Error checking plan completion:", error);
    throw error;
  }
}

/**
 * Generate motivational message based on progress
 */
export function generateProgressMessage(progress) {
  const { averageCompletionRate, overallSuccess } = progress;

  if (overallSuccess) {
    if (averageCompletionRate >= 90) {
      return {
        type: "excellent",
        title: "Outstanding Progress! 🎉",
        message:
          "You're crushing your nutrition goals! Keep up the amazing work.",
      };
    } else {
      return {
        type: "good",
        title: "Great Job! 👏",
        message:
          "You're doing really well with your nutrition plan. Stay consistent!",
      };
    }
  } else if (averageCompletionRate >= 50) {
    return {
      type: "improvement",
      title: "Making Progress 💪",
      message:
        "You're on the right track! Try to complete more meals each day for better results.",
    };
  } else {
    return {
      type: "encouragement",
      title: "Keep Going! 🌟",
      message:
        "Every small step counts. Let's focus on completing your meals consistently.",
    };
  }
}

const dietProgressService = {
  calculateDailyProgress,
  calculatePlanProgress,
  updateDailyLogProgress,
  updateProgressSummary,
  checkPlanCompletion,
  generateProgressMessage,
};

export default dietProgressService;
