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
  trainingType: "with-trainer",
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

export const useTrainingPlanForm = (initialData = null) => {
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
    return (
      title.trim() !== "" &&
      description.trim() !== "" &&
      price !== "" &&
      duration !== ""
    );
  };

  const validateFeatures = () =>
    formData.keyFeatures.length > 0 &&
    formData.keyFeatures[0].trim() !== "" &&
    formData.timeline.some(
      (item) => item.week.trim() !== "" && item.title.trim() !== ""
    );

  const isValid = (step) => {
    switch (step) {
      case 0:
        return validateBasicInfo();
      case 1:
        return true; // Uklonjena validacija za Schedule, uvijek dozvoljeno
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

      // DEBUG: Log file info
      if (formData.coverImage) {
        console.log("Uploading file:", formData.coverImage);
        console.log(
          "Is file instance of File?",
          formData.coverImage instanceof File
        );
        console.log("File type:", formData.coverImage.type);
        console.log("File size (MB):", formData.coverImage.size / 1024 / 1024);
      }

      // 1. Upload slike ako je File
      if (formData.coverImage && typeof formData.coverImage !== "string") {
        const uploadData = new FormData();
        uploadData.append("coverImage", formData.coverImage);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        // DEBUG: Log upload response
        console.log("Upload response:", uploadJson);
        if (!uploadRes.ok || !uploadJson.coverImage) {
          throw new Error(uploadJson.error || "Failed to upload image");
        }
        coverImageUrl =
          typeof uploadJson.coverImage === "string"
            ? uploadJson.coverImage
            : uploadJson.coverImage.url;
      }

      // 2. Pošalji plan na backend
      const planPayload = {
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
              week:
                item.week !== undefined && item.week !== "" ? item.week : null,
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
      console.log("[handleSubmit] planPayload:", planPayload);
      if (formData.id && !isCopy) {
        // EDIT MODE: PATCH
        console.log("[handleSubmit] PATCH (updatePlan)");
        await updatePlan(formData.id, planPayload, "training");
      } else {
        // CREATE MODE: POST (or COPY)
        console.log("[handleSubmit] POST (createPlan)");
        await createPlan(planPayload, "training");
      }
      // Redirect na plans page
      router.push("/trainer/dashboard/plans");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Ovdje možeš postaviti error state za prikaz korisniku
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    isValid,
    handleSubmit,
  };
};
