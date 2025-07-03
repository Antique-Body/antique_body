"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchPlanDetails } from "@/app/api/users/services/planService";
import { TrainingPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/training/create/TrainingPlanCreator";

/**
 * React component for editing a training plan based on the route parameter `id`.
 *
 * Fetches the training plan details using the provided `id`, normalizes missing fields with default values, and renders the `TrainingPlanCreator` component with the prepared data. Displays loading and error states as appropriate.
 */
export default function EditTrainingPlanPage() {
  const params = useParams();
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPlanDetails(id, "training")
      .then((data) => {
        setInitialData({
          ...data,
          id: data.id,
          difficultyLevel: data.difficultyLevel || "",
          keyFeatures: data.keyFeatures || [""],
          timeline: data.timeline || [{ week: "", title: "", description: "" }],
          features: data.features || {},
          schedule: data.schedule || [
            {
              id:
                typeof crypto !== "undefined" && crypto.randomUUID
                  ? crypto.randomUUID()
                  : Math.random().toString(36).substr(2, 9),
              name: "Full Body Workout",
              duration: 60,
              day: "Monday",
              description: "",
              exercises: [],
              type: "strength",
            },
          ],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching plan details:", err);
        setError("Failed to load plan data");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!initialData) return null;

  return <TrainingPlanCreator initialData={initialData} />;
}
