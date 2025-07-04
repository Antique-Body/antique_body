import { TRAINING_PLAN_CONFIG, NUTRITION_PLAN_CONFIG } from "./defaultSettings";

import prisma from "@/lib/prisma";

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
