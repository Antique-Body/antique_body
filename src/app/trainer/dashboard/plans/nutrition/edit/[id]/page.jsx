"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchPlanDetails } from "@/app/api/users/services/planService";
import { NutritionPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/nutrition/create/NutritionPlanCreator";

/**
 * React component for editing or copying a nutrition plan based on the provided plan ID.
 *
 * Fetches nutrition plan details using the route parameter `id`, normalizes the data with default values for missing fields, and prepares the data for editing or duplication depending on the query parameter `mode`. Displays loading and error states as appropriate, and renders the nutrition plan editor UI when data is ready.
 */
export default function EditNutritionPlanPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              id: crypto.randomUUID(),
              name: "Day 1",
              isRestDay: false,
              description: "",
              meals: [],
            },
          ],
        };
        if (searchParams.get("mode") === "copy") {
          delete planData.id;
          delete planData.createdAt;
          delete planData.clientCount;
          planData.title = `Copy of ${data.title}`;
        }
        setInitialData(planData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load nutrition plan data");
        setLoading(false);
      });
  }, [id, searchParams]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!initialData) return null;

  return <NutritionPlanCreator initialData={initialData} />;
}
