"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { createPlan, updatePlan } from "@/app/api/users/services/planService";

const initialFormData = {
  // Basic Info
  title: "",
  description: "",
  coverImage: null,
  price: "",
  duration: "4",
  durationType: "weeks",
  trainingType: "with_trainer",
  sessionsPerWeek: "3",
  difficultyLevel: "",

  // Session Format
  sessionFormat: {
    inPerson: true,
    online: false,
  },

  // Schedule
  schedule: [
    {
      id: crypto.randomUUID(),
      name: "Full Body Workout",
      duration: 60,
      day: "Monday",
      description: "",
      exercises: [],
      type: "strength",
    },
  ],

  // Features
  keyFeatures: [""],
  timeline: [{ week: "", title: "", description: "" }],
  features: {
    support24_7: false,
    liveTraining: false,
    onlineCalls: false,
    personalizedNutrition: false,
    progressTracking: false,
    mealPlanning: false,
    flexibleScheduling: false,
    recoveryPlans: false,
  },
};

// Helper to upload cover image and return URL or original string
async function uploadCoverImage(coverImage) {
  if (coverImage && typeof coverImage !== "string") {
    const uploadData = new FormData();
    uploadData.append("coverImage", coverImage);
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok || !uploadJson.coverImage) {
      throw new Error(uploadJson.error || "Failed to upload image");
    }
    return typeof uploadJson.coverImage === "string"
      ? uploadJson.coverImage
      : uploadJson.coverImage.url;
  }
  return coverImage;
}

// Helper to construct the plan payload
function constructPlanPayload(formData, coverImageUrl) {
  return {
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
    keyFeatures: formData.keyFeatures,
    timeline: Array.isArray(formData.timeline)
      ? formData.timeline.map((item) => ({
          ...item,
          week: item.week !== undefined && item.week !== "" ? item.week : null,
        }))
      : [],
    features: formData.features,
    schedule: formData.schedule,
    sessionsPerWeek:
      formData.sessionsPerWeek !== "" &&
      !isNaN(Number(formData.sessionsPerWeek))
        ? Number(formData.sessionsPerWeek)
        : null,
    sessionFormat: formData.sessionFormat,
    trainingType: formData.trainingType,
    difficultyLevel: formData.difficultyLevel || null,
  };
}

export const useTrainingPlanForm = (initialData = null) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
        cleanData.id = undefined;
        // Prefix title with 'Copy of ' if not already present
        if (cleanData.title && !cleanData.title.startsWith("Copy of ")) {
          cleanData.title = `Copy of ${cleanData.title}`;
        }
      }
      setFormData(cleanData);
    }
  }, [initialData]);

  const updateFormData = (updates) => {
    if (typeof updates === "function") {
      setFormData((prev) => updates(prev));
    } else {
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  };

  const validateBasicInfo = () => {
    const { title, description, price, duration } = formData;
    // Price: must be a valid number (not NaN, not empty, >= 0)
    const priceNum = Number(price);
    const isPriceValid =
      price !== "" && !isNaN(priceNum) && isFinite(priceNum) && priceNum >= 0;
    // Duration: must be a positive integer
    const durationNum = Number(duration);
    const isDurationValid =
      duration !== "" && Number.isInteger(durationNum) && durationNum > 0;
    return (
      typeof title === "string" &&
      title.trim() !== "" &&
      typeof description === "string" &&
      description.trim() !== "" &&
      isPriceValid &&
      isDurationValid
    );
  };

  // Helper for week format: allow positive integer, or YYYY-MM-DD, or YYYY-W##
  const isValidWeekFormat = (week) => {
    if (typeof week !== "string") return false;
    // Numeric week (e.g., '1', '2')
    if (/^\d+$/.test(week.trim())) return true;
    // Date format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(week.trim())) return true;
    // HTML5 week format YYYY-W##
    if (/^\d{4}-W\d{2}$/.test(week.trim())) return true;
    return false;
  };

  const validateFeatures = () => {
    // keyFeatures: all must be non-empty strings
    const keyFeaturesValid =
      Array.isArray(formData.keyFeatures) &&
      formData.keyFeatures.length > 0 &&
      formData.keyFeatures.every(
        (f) => typeof f === "string" && f.trim() !== ""
      );
    // timeline: at least one item with valid week and non-empty title
    const timelineValid =
      Array.isArray(formData.timeline) &&
      formData.timeline.some(
        (item) =>
          item &&
          typeof item.title === "string" &&
          item.title.trim() !== "" &&
          typeof item.week === "string" &&
          isValidWeekFormat(item.week)
      );
    return keyFeaturesValid && timelineValid;
  };

  const isValid = (step) => {
    switch (step) {
      case 0:
        return validateBasicInfo();
      case 1:
        return true; // Removed Schedule validation, always allowed
      case 2:
        return validateFeatures();
      case 3:
        return true; // Preview step is always valid
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Get searchParams only when running in the browser
      const searchParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const isCopy = searchParams && searchParams.get("mode") === "copy";

      // 1. Upload cover image if needed
      const coverImageUrl = await uploadCoverImage(formData.coverImage);

      // 2. Construct plan payload
      const planPayload = constructPlanPayload(formData, coverImageUrl);

      if (formData.id && !isCopy) {
        // EDIT MODE: PATCH
        await updatePlan(formData.id, planPayload, "training");
      } else {
        // CREATE MODE: POST (or COPY)
        await createPlan(planPayload, "training");
      }
      // Redirect na plans page
      router.push("/trainer/dashboard/plans");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    isValid,
    handleSubmit,
    error,
  };
};
