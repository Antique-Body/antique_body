import { TRAINING_PLAN_CONFIG, NUTRITION_PLAN_CONFIG } from "./defaultSettings";

import prisma from "@/lib/prisma";

export async function createDefaultPlansForTrainer(trainerInfoId) {
  await prisma.$transaction(async (tx) => {
    // Check if plans already exist (inside transaction)
    const [existingTraining, existingNutrition] = await Promise.all([
      tx.trainingPlan.count({ where: { trainerInfoId } }),
      tx.nutritionPlan.count({ where: { trainerInfoId } }),
    ]);
    if (existingTraining > 0 || existingNutrition > 0) return;

    await Promise.all([
      ...TRAINING_PLAN_CONFIG.map((plan) =>
        tx.trainingPlan.create({
          data: { ...plan, trainerInfoId },
        })
      ),
      ...NUTRITION_PLAN_CONFIG.map((plan) =>
        tx.nutritionPlan.create({
          data: { ...plan, trainerInfoId },
        })
      ),
    ]);
  });
}

// Utility functions for plan management (API calls)
const API_URL = "/api/users/trainer/plans";
const FETCH_TIMEOUT = 5000; // 5 seconds

async function fetchWithTimeout(url, options = {}, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    if (error.name === "AbortError") {
      throw new Error(`Request to ${url} timed out after ${timeout}ms`);
    }
    throw new Error(`Network error while fetching ${url}: ${error.message}`);
  }
}

export const fetchPlans = async (type = "training") => {
  const url = `${API_URL}?type=${type}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok)
    throw new Error(
      `Failed to fetch plans from ${url} (status: ${res.status})`
    );
  return res.json();
};

export const fetchPlanDetails = async (planId, type = "training") => {
  const url = `${API_URL}/${planId}?type=${type}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok)
    throw new Error(
      `Failed to fetch plan details from ${url} (status: ${res.status})`
    );
  return res.json();
};

export const createPlan = async (plan, type = "training") => {
  const url = API_URL;
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    let errorMsg = `Failed to create plan at ${url} (status: ${res.status})`;
    try {
      const error = await res.json();
      errorMsg += `: ${error.error}`;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};

export const updatePlan = async (planId, plan, type = "training") => {
  const url = `${API_URL}/${planId}`;
  const res = await fetchWithTimeout(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    let errorMsg = `Failed to update plan at ${url} (status: ${res.status})`;
    try {
      const error = await res.json();
      errorMsg += `: ${error.error}`;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};

export const putPlan = async (planId, plan, type = "training") => {
  const url = `${API_URL}/${planId}`;
  const res = await fetchWithTimeout(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    let errorMsg = `Failed to replace plan at ${url} (status: ${res.status})`;
    try {
      const error = await res.json();
      errorMsg += `: ${error.error}`;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};

export const deletePlan = async (planId, type = "training") => {
  const url = `${API_URL}/${planId}?type=${type}`;
  const res = await fetchWithTimeout(url, {
    method: "DELETE",
  });
  if (!res.ok) {
    let errorMsg = `Failed to delete plan at ${url} (status: ${res.status})`;
    try {
      const error = await res.json();
      errorMsg += `: ${error.error}`;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};

export const softDeletePlan = async (planId, type = "training") => {
  const url = `${API_URL}/${planId}`;
  const res = await fetchWithTimeout(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
  if (!res.ok) {
    let errorMsg = `Failed to soft delete plan at ${url} (status: ${res.status})`;
    try {
      const error = await res.json();
      errorMsg += `: ${error.error}`;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};
