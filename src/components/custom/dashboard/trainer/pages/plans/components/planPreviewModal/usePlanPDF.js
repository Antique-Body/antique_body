import { useState } from "react";

import { generatePlanPDF } from "@/utils/pdfGenerator";

// Helper to format date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper to build overview object
function buildOverview(plan) {
  return {
    summary: plan.description || "No summary available.",
    keyFeatures:
      plan.keyFeatures && plan.keyFeatures.length > 0
        ? plan.keyFeatures
        : ["No key features specified."],
  };
}

// Helper to build weekly schedule object
function buildWeeklySchedule(plan, days, isNutrition) {
  const weeklySchedule = {};
  if (isNutrition) {
    (days || plan.days || []).forEach((day) => {
      weeklySchedule[day.name || day.day] = {
        title: day.name || day.day,
        meals: (day.meals || []).flatMap(
          (meal) =>
            meal.options?.map((option) => ({
              name: meal.name,
              type: meal.type || "Meal",
              time: meal.time || "",
              calories: option.calories || 0,
              protein: option.protein || 0,
              carbs: option.carbs || 0,
              fat: option.fat || 0,
              description: option.description || "",
              ingredients: option.ingredients || [],
            })) || []
        ),
        isRestDay: day.isRestDay,
        description: day.description,
      };
    });
  } else {
    (plan.schedule || []).forEach((day, idx) => {
      weeklySchedule[day.day?.toLowerCase() || `day${idx + 1}`] = {
        title: day.name || day.day || `Day ${idx + 1}`,
        exercises: (day.exercises || []).map((ex) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          notes: ex.notes,
        })),
        description: day.description,
      };
    });
  }
  return weeklySchedule;
}

// Helper to assemble pdfData
function assemblePdfData(options) {
  const { plan, days, type, overview, weeklySchedule, formattedDate } = options;
  const isNutrition = type === "nutrition";
  return {
    title: plan.title,
    description: plan.description,
    planType: isNutrition ? "nutrition" : "training",
    duration: plan.duration,
    createdAt: formattedDate,
    image: plan.image || plan.coverImage,
    keyFeatures: plan.keyFeatures,
    schedule: plan.schedule,
    timeline: plan.timeline,
    features: plan.features,
    overview,
    weeklySchedule,
    nutritionInfo: plan.nutritionInfo,
    days: days || plan.days,
    mealTypes: plan.mealTypes,
    supplementRecommendations: plan.supplementRecommendations,
    cookingTime: plan.cookingTime,
    targetGoal: plan.targetGoal,
    trainingType: plan.trainingType,
    sessionsPerWeek: plan.sessionsPerWeek,
    sessionFormat: plan.sessionFormat,
    difficultyLevel: plan.difficultyLevel,
  };
}

export const usePlanPDF = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownloadPDF = async (plan, days, type) => {
    try {
      setIsDownloading(true);
      setError(null);
      const isNutrition = type === "nutrition";
      const formattedDate = formatDate(plan.createdAt);
      const overview = buildOverview(plan);
      const weeklySchedule = buildWeeklySchedule(plan, days, isNutrition);
      const pdfData = assemblePdfData({
        plan,
        days,
        type,
        overview,
        weeklySchedule,
        formattedDate,
      });
      await generatePlanPDF(pdfData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDownloadPDF, isDownloading, error };
};
