"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TrainingPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/training/create/TrainingPlanCreator";
import { fetchPlanDetails } from "@/utils/planService";

export default function EditPlanPage() {
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
          schedule: data.planSchedule || [],
          keyFeatures: data.keyFeatures || [""],
          timeline: data.timeline || [{ week: "", title: "", description: "" }],
          features: data.features || {},
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load plan data");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!initialData) return null;

  return <TrainingPlanCreator initialData={initialData} />;
}
