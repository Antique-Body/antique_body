import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createPlan } from "@/utils/planService";

export const useNutritionPlanForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    description: "",
    coverImage: null,
    price: "",
    duration: "",
    durationType: "weeks",

    // Nutrition Info
    nutritionInfo: {
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    },

    // Step 2: Meal Planning
    days: [
      {
        id: uuidv4(),
        name: "Day 1",
        isRestDay: false,
        description: "",
        meals: [],
      },
    ],

    // Step 3: Features
    keyFeatures: [""],
    planSchedule: [""],
    timeline: [{ week: "", title: "", description: "" }],

    // Additional nutrition-specific fields
    mealTypes: [],
    dietaryRestrictions: [],
    supplementRecommendations: "",
    cookingTime: "",
    difficultyLevel: "beginner",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates) => {
    setFormData((prev) => {
      // Handle nested updates like nutritionInfo.calories
      const newData = { ...prev };

      Object.keys(updates).forEach((key) => {
        if (key.includes(".")) {
          const [parent, child] = key.split(".");
          if (!newData[parent]) newData[parent] = {};
          newData[parent] = {
            ...newData[parent],
            [child]: updates[key],
          };
        } else {
          newData[key] = updates[key];
        }
      });

      return newData;
    });
  };

  const isValid = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          formData.title.trim() &&
          formData.description.trim() &&
          formData.price &&
          formData.duration &&
          formData.durationType
        );

      case 1: // Meal Planning
        return (
          formData.days.length > 0 &&
          formData.days.some((day) => day.meals.length > 0 || day.isRestDay)
        );

      case 2: // Features
        return (
          formData.keyFeatures.some((feature) => feature.trim()) &&
          formData.planSchedule.some((schedule) => schedule.trim()) &&
          formData.timeline.some(
            (item) => item.week.trim() && item.title.trim()
          )
        );

      case 3: // Preview
        return true; // Always valid for preview

      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Prepare the data for submission - eksplicitno definiram polja
      const submitData = {
        title: formData.title,
        description: formData.description,
        coverImage: formData.coverImage,
        price: formData.price,
        duration: formData.duration,
        durationType: formData.durationType,
        nutritionInfo: formData.nutritionInfo,
        keyFeatures: formData.keyFeatures.filter((f) => f.trim()),
        planSchedule: formData.planSchedule.filter((s) => s.trim()),
        timeline: formData.timeline.filter(
          (t) => t.week.trim() && t.title.trim()
        ),
        mealTypes: formData.mealTypes,
        dietaryRestrictions: formData.dietaryRestrictions,
        supplementRecommendations: formData.supplementRecommendations,
        cookingTime: formData.cookingTime,
        difficultyLevel: formData.difficultyLevel,
      };

      // KORISTI planService
      await createPlan(submitData, "nutrition");

      // Redirect to plans page
      router.push("/trainer/dashboard/plans");
    } catch (error) {
      console.error("Error submitting nutrition plan:", error);
      alert("Failed to save nutrition plan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for managing days
  const addDay = (copyFromIdx = null) => {
    if (formData.days.length >= 30) return;

    let newMeals = [];
    if (copyFromIdx !== null && formData.days[copyFromIdx]) {
      newMeals = JSON.parse(JSON.stringify(formData.days[copyFromIdx].meals));
    }

    const newDay = {
      id: uuidv4(),
      name: `Day ${formData.days.length + 1}`,
      isRestDay: false,
      description: "",
      meals: newMeals,
    };

    updateFormData({ days: [...formData.days, newDay] });
  };

  const addCheatDay = () => {
    if (formData.days.length >= 30) return;

    const cheatDay = {
      id: uuidv4(),
      name: "Cheat Day",
      isRestDay: true,
      description: "Describe your cheat day (e.g. free meal, treat, etc.)",
      meals: [],
    };

    updateFormData({ days: [...formData.days, cheatDay] });
  };

  const updateDay = (dayId, updates) => {
    const updatedDays = formData.days.map((day) =>
      day.id === dayId ? { ...day, ...updates } : day
    );
    updateFormData({ days: updatedDays });
  };

  const deleteDay = (dayId) => {
    const updatedDays = formData.days.filter((day) => day.id !== dayId);
    updateFormData({ days: updatedDays });
  };

  return {
    formData,
    updateFormData,
    handleSubmit,
    isValid,
    isSubmitting,
    addDay,
    addCheatDay,
    updateDay,
    deleteDay,
  };
};
