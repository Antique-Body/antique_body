"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { fetchPlanDetails } from "@/app/api/users/services/planService";
import { NutritionPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/nutrition/create/NutritionPlanCreator";

export default function EditNutritionPlanPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback UUID generator
  const fallbackUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  // Safe UUID generator
  const safeUUID = useCallback(
    () =>
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : fallbackUUID(),
    []
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPlanDetails(id, "nutrition")
      .then((data) => {
        const planData = {
          ...data,
          id: data.id,
          targetGoal: data.targetGoal || "",
          keyFeatures: data.keyFeatures || [""],
          timeline: data.timeline || [{ week: "", title: "", description: "" }],
          nutritionInfo: data.nutritionInfo || {
            calories: "",
            protein: "",
            carbs: "",
            fats: "",
          },
          mealTypes: data.mealTypes || [],
          supplementRecommendations: data.supplementRecommendations || "",
          cookingTime: data.cookingTime || "",
          days: data.days || [
            {
              id: safeUUID(),
              name: "Day 1",
              isRestDay: false,
              description: "",
              meals: [],
            },
          ],
        };
        if (searchParams.get("mode") === "copy") {
          planData.id = undefined;
          planData.createdAt = undefined;
          planData.clientCount = undefined;
          planData.title = `Copy of ${data.title}`;
        }
        setInitialData(planData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load nutrition plan data");
        setLoading(false);
      });
  }, [id, searchParams, safeUUID]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!initialData) return null;

  return <NutritionPlanCreator initialData={initialData} />;
}
