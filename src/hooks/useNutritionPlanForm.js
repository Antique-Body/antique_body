import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { createPlan, updatePlan } from "@/app/api/users/services/planService";

const initialFormData = {
  // Step 1: Basic Info
  title: "",
  description: "",
  coverImage: null,
  price: "",
  duration: "",
  durationType: "weeks",
  targetGoal: "",

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
  timeline: [{ week: "", title: "", description: "" }],
  recommendedFrequency: "",
  adaptability: "",

  // Additional nutrition-specific fields
  mealTypes: [],
  supplementRecommendations: "",
  cookingTime: "",
};

export const useNutritionPlanForm = (initialData = null) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get searchParams only when running in the browser
    const searchParams =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const isCopy = searchParams && searchParams.get("mode") === "copy";
    if (initialData) {
      const cleanData = { ...initialData };
      if (isCopy) {
        // Remove id for copy mode so a new plan is created
        delete cleanData.id;
      }
      setFormData(cleanData);
    }
  }, [initialData]);

  const updateFormData = (updates) => {
    setFormData((prev) => {
      const newData = { ...prev };
      Object.keys(updates).forEach((key) => {
        if (key === "frequency") {
          newData.recommendedFrequency = updates[key];
        } else if (key === "adaptability") {
          newData.adaptability = updates[key];
        } else if (key.includes(".")) {
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
    if (isSubmitting) {
      console.log("[handleSubmit] Prevented double submit");
      return;
    }
    setIsSubmitting(true);
    try {
      // Get searchParams only when running in the browser
      const searchParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const isCopy = searchParams && searchParams.get("mode") === "copy";
      let coverImageUrl = formData.coverImage;

      // 1. Upload image if it's a File object
      if (formData.coverImage && typeof formData.coverImage !== "string") {
        const uploadData = new FormData();
        uploadData.append("coverImage", formData.coverImage);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok || !uploadJson.coverImage) {
          throw new Error(uploadJson.error || "Failed to upload image");
        }
        coverImageUrl =
          typeof uploadJson.coverImage === "string"
            ? uploadJson.coverImage
            : uploadJson.coverImage.url;
      }

      // 2. Prepare the data for submission
      const submitData = {
        title: formData.title,
        description: formData.description,
        coverImage: coverImageUrl || null,
        price:
          formData.price !== "" && !isNaN(Number(formData.price))
            ? Number(formData.price)
            : null,
        duration:
          formData.duration !== "" && !isNaN(Number(formData.duration))
            ? Number(formData.duration)
            : null,
        durationType: formData.durationType,
        nutritionInfo: formData.nutritionInfo,
        keyFeatures: formData.keyFeatures.filter((f) => f.trim()),
        timeline: formData.timeline.filter(
          (t) => t.week.trim() && t.title.trim()
        ),
        mealTypes: formData.mealTypes,
        supplementRecommendations: formData.supplementRecommendations,
        cookingTime: formData.cookingTime,
        targetGoal: formData.targetGoal,
        days: formData.days,
        recommendedFrequency: formData.recommendedFrequency,
        adaptability: formData.adaptability,
      };

      if (formData.id && !isCopy) {
        // EDIT MODE: PATCH
        await updatePlan(formData.id, submitData, "nutrition");
      } else {
        // CREATE MODE: POST (or COPY)
        await createPlan(submitData, "nutrition");
      }

      // Redirect to plans page
      router.push("/trainer/dashboard/plans");
    } catch (error) {
      console.error("Error submitting nutrition plan:", error);
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
