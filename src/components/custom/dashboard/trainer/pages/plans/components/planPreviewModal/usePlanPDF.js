import { useState } from "react";

import { generatePlanPDF } from "@/utils/pdfGenerator";

export const usePlanPDF = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async (plan, days, type) => {
    try {
      setIsDownloading(true);
      const isNutrition = type === "nutrition";
      const description = plan.description;
      const keyFeatures = plan.keyFeatures;
      const schedule = plan.schedule;
      const timeline = plan.timeline;
      const formattedDate = new Date(plan.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
      const overview = {
        summary: description || "No summary available.",
        keyFeatures:
          keyFeatures && keyFeatures.length > 0
            ? keyFeatures
            : ["No key features specified."],
      };
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
        (schedule || plan.schedule || []).forEach((day, idx) => {
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
      const pdfData = {
        title: plan.title,
        description,
        planType: isNutrition ? "nutrition" : "training",
        duration: plan.duration,
        createdAt: formattedDate,
        image: plan.image || plan.coverImage,
        keyFeatures,
        schedule,
        timeline,
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
      await generatePlanPDF(pdfData);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDownloadPDF, isDownloading };
};
