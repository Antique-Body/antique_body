"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TrainingPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/training/create/TrainingPlanCreator";
import { fetchPlanDetails } from "@/utils/planService";

/**
 * React component for editing or copying a training plan based on the plan ID from the route.
 *
 * Fetches plan details using the provided ID, normalizes missing fields, and supports a "copy" mode that removes unique identifiers and prefixes the title. Renders a loading indicator, error message, or the training plan editor as appropriate.
 */
export default function EditPlanPage() {
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
          keyFeatures: data.keyFeatures || [""],
          timeline: data.timeline || [{ week: "", title: "", description: "" }],
          features: data.features || {},
        };
        // If mode=copy, remove id and other unique fields
        if (searchParams.get("mode") === "copy") {
          delete planData.id;
          delete planData.createdAt;
          delete planData.clientCount;
          planData.title = `Copy of ${data.title}`;
        }
        setInitialData(planData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load plan data");
        setLoading(false);
      });
  }, [id, searchParams]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!initialData) return null;

  return <TrainingPlanCreator initialData={initialData} />;
}
