"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    },
  ],

  // Features
  keyFeatures: [""],
  targetAudience: "",
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

export const useTrainingPlanForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
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

  const validateSchedule = () => {
    return (
      formData.schedule.length > 0 &&
      formData.schedule.every(
        (session) =>
          session.name.trim() !== "" &&
          session.duration > 0 &&
          session.exercises.length > 0
      )
    );
  };

  const validateFeatures = () => {
    return (
      formData.keyFeatures.length > 0 &&
      formData.keyFeatures[0].trim() !== "" &&
      formData.targetAudience.trim() !== "" &&
      formData.timeline.some(
        (item) => item.week.trim() !== "" && item.title.trim() !== ""
      )
    );
  };

  const isValid = (step) => {
    switch (step) {
      case 0:
        return validateBasicInfo();
      case 1:
        return validateSchedule();
      case 2:
        return validateFeatures();
      case 3:
        return true; // Preview step is always valid
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would typically send the data to your backend
      console.log("Submitting form data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to plans page on success
      router.push("/trainer/dashboard/plans");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return {
    formData,
    updateFormData,
    isValid,
    handleSubmit,
  };
};
