"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchPlanDetails } from "@/app/api/users/services/planService";
import { TrainingPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/training/create/TrainingPlanCreator";

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
          planData.id = undefined;
          planData.createdAt = undefined;
          planData.clientCount = undefined;
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
