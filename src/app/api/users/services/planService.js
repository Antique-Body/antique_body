// Configs for default plans
export const TRAINING_PLAN_CONFIG = [
  {
    title: "Beginner Strength",
    description: "A simple strength plan for beginners.",
    coverImage: null,
    price: 0,
    duration: 4,
    durationType: "weeks",
    keyFeatures: [
      "Full body workouts",
      "Progressive overload",
      "Minimal equipment",
    ],
    trainingType: "strength",
    timeline: null,
    features: ["3 sessions per week", "Video instructions"],
    sessionsPerWeek: 3,
    sessionFormat: { type: "in-person" },
    difficultyLevel: "beginner",
  },
  {
    title: "Fat Loss Express",
    description: "Quick fat loss program for all levels.",
    coverImage: null,
    price: 0,
    duration: 6,
    durationType: "weeks",
    keyFeatures: ["HIIT", "Cardio", "Nutrition tips"],
    trainingType: "cardio",
    timeline: null,
    features: ["4 sessions per week", "Flexible schedule"],
    sessionsPerWeek: 4,
    sessionFormat: { type: "online" },
    difficultyLevel: "all",
  },
  {
    title: "Muscle Builder",
    description: "Build muscle mass with this plan.",
    coverImage: null,
    price: 0,
    duration: 8,
    durationType: "weeks",
    keyFeatures: ["Hypertrophy", "Split routine", "Nutrition guidance"],
    trainingType: "hypertrophy",
    timeline: null,
    features: ["5 sessions per week", "Gym required"],
    sessionsPerWeek: 5,
    sessionFormat: { type: "in-person" },
    difficultyLevel: "intermediate",
  },
];

export const NUTRITION_PLAN_CONFIG = [
  {
    title: "Lean Nutrition",
    description: "Low calorie meal plan for fat loss.",
    coverImage: null,
    price: 0,
    duration: 4,
    durationType: "weeks",
    keyFeatures: ["Calorie deficit", "Simple recipes", "Shopping list"],
    timeline: null,
    nutritionInfo: { calories: 1800, protein: 120, carbs: 180, fat: 50 },
    mealTypes: ["breakfast", "lunch", "dinner"],
    dietaryRestrictions: ["gluten-free"],
    supplementRecommendations: null,
    cookingTime: "30 min avg",
    targetGoal: "fat loss",
    days: null,
    recommendedFrequency: "daily",
    adaptability: "easy",
  },
  {
    title: "Muscle Gain Meals",
    description: "High protein meals for muscle gain.",
    coverImage: null,
    price: 0,
    duration: 6,
    durationType: "weeks",
    keyFeatures: ["High protein", "Meal prep", "Bulk recipes"],
    timeline: null,
    nutritionInfo: { calories: 2500, protein: 180, carbs: 250, fat: 80 },
    mealTypes: ["breakfast", "lunch", "dinner", "snack"],
    dietaryRestrictions: [],
    supplementRecommendations: "Whey protein",
    cookingTime: "45 min avg",
    targetGoal: "muscle gain",
    days: null,
    recommendedFrequency: "daily",
    adaptability: "medium",
  },
  {
    title: "Balanced Diet",
    description: "Balanced macros for overall health.",
    coverImage: null,
    price: 0,
    duration: 8,
    durationType: "weeks",
    keyFeatures: ["Balanced macros", "Family friendly", "Easy to follow"],
    timeline: null,
    nutritionInfo: { calories: 2000, protein: 140, carbs: 200, fat: 60 },
    mealTypes: ["breakfast", "lunch", "dinner", "snack"],
    dietaryRestrictions: ["vegetarian"],
    supplementRecommendations: null,
    cookingTime: "35 min avg",
    targetGoal: "health",
    days: null,
    recommendedFrequency: "daily",
    adaptability: "easy",
  },
];

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createDefaultPlansForTrainer(trainerInfoId) {
  // Check if plans already exist
  const existingTraining = await prisma.trainingPlan.count({
    where: { trainerInfoId },
  });
  const existingNutrition = await prisma.nutritionPlan.count({
    where: { trainerInfoId },
  });
  if (existingTraining > 0 || existingNutrition > 0) return;

  await Promise.all([
    ...TRAINING_PLAN_CONFIG.map((plan) =>
      prisma.trainingPlan.create({
        data: { ...plan, trainerInfoId, isActive: true, isPublished: false },
      })
    ),
    ...NUTRITION_PLAN_CONFIG.map((plan) =>
      prisma.nutritionPlan.create({
        data: { ...plan, trainerInfoId, isActive: true, isPublished: false },
      })
    ),
  ]);
}

// Utility functions for plan management (API calls)
const API_URL = "/api/users/trainer/plans";

export const fetchPlans = async (type = "training") => {
  const res = await fetch(`${API_URL}?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
};

export const fetchPlanDetails = async (planId, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch plan details");
  return res.json();
};

export const createPlan = async (plan, type = "training") => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create plan");
  }
  return res.json();
};

export const updatePlan = async (planId, plan, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update plan");
  }
  return res.json();
};

export const putPlan = async (planId, plan, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to replace plan");
  }
  return res.json();
};

export const deletePlan = async (planId, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}?type=${type}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete plan");
  }
  return res.json();
};

export const softDeletePlan = async (planId, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive: false, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to soft delete plan");
  }
  return res.json();
};
