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
      day: 1, // broj, ne string
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

  // Helper for week format: allow any non-empty string
  const isValidWeekFormat = (week) => {
    if (typeof week !== "string") {
      return false;
    }
    // Accept any non-empty string
    if (week.trim() !== "") {
      return true;
    }
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
    let result;
    switch (step) {
      case 0:
        result = validateBasicInfo();
        break;
      case 1:
        result = true; // Removed Schedule validation, always allowed
        break;
      case 2:
        result = validateFeatures();
        break;
      case 3:
        result = true; // Preview step is always valid
        break;
      default:
        result = false;
    }
    return result;
  };

  // Add function to get validation errors
  const getValidationErrors = (step) => {
    const errors = [];

    switch (step) {
      case 0:
        const { title, description, price, duration } = formData;
        if (!title || title.trim() === "") {
          errors.push("Title is required");
        }
        if (!description || description.trim() === "") {
          errors.push("Description is required");
        }
        if (
          !price ||
          price.toString().trim() === "" ||
          isNaN(Number(price)) ||
          Number(price) < 0
        ) {
          errors.push("Valid price is required");
        }
        if (
          !duration ||
          duration.toString().trim() === "" ||
          !Number.isInteger(Number(duration)) ||
          Number(duration) <= 0
        ) {
          errors.push("Valid duration is required");
        }
        break;

      case 2:
        // Check key features
        if (
          !Array.isArray(formData.keyFeatures) ||
          formData.keyFeatures.length === 0
        ) {
          errors.push("At least one key feature is required");
        } else {
          const emptyFeatures = formData.keyFeatures.filter(
            (f) => !f || f.trim() === ""
          );
          if (emptyFeatures.length > 0) {
            errors.push("All key features must be filled");
          }
        }

        // Check timeline
        if (
          !Array.isArray(formData.timeline) ||
          formData.timeline.length === 0
        ) {
          errors.push("At least one timeline item is required");
        } else {
          const invalidTimeline = formData.timeline.filter(
            (item) =>
              !item ||
              !item.title ||
              item.title.trim() === "" ||
              !item.week ||
              item.week.trim() === ""
          );
          if (invalidTimeline.length > 0) {
            errors.push("All timeline items must have title and week filled");
          }
        }
        break;
    }

    return errors;
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
    getValidationErrors,
  };
};
