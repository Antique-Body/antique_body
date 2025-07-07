"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchPlanDetails } from "@/app/api/users/services/planService";
import { FullScreenLoader } from "@/components";
import { TrainingPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/training/create/TrainingPlanCreator";

export default function EditTrainingPlanPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPlanDetails(id, "training")
      .then((data) => {
        const planData = {
          ...data,
          id: data.id,
          difficultyLevel: data.difficultyLevel || "",
          keyFeatures: data.keyFeatures || [""],
          timeline: data.timeline || [{ week: "", title: "", description: "" }],
          features: data.features || {},
          schedule: data.schedule || [
            {
              id:
                typeof crypto !== "undefined" &&
                typeof crypto.randomUUID === "function"
                  ? crypto.randomUUID()
                  : Math.random().toString(36) + Date.now().toString(36),
              name: "Full Body Workout",
              duration: 60,
              day: "Monday",
              description: "",
              exercises: [],
              type: "strength",
            },
          ],
        };
        if (searchParams.get("mode") === "copy") {
          planData.id = undefined;
          if ("createdAt" in planData) planData.createdAt = undefined;
          planData.title = `Copy of ${data.title}`;
        }
        setInitialData(planData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plan details:", err);
        setError("Failed to load plan data");
        setLoading(false);
      });
  }, [id, searchParams]);

  if (loading) return <FullScreenLoader text="Loading Training Plan" />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!initialData) return null;

  return <TrainingPlanCreator initialData={initialData} />;
}
