"use client";
import React from "react";

import { NutritionTrackingPage } from "@/components/nutrition/tracking";

export default function NutritionTrackingPageWrapper({ params }) {
  // Unwrap params using React.use() for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  const clientId = unwrappedParams.id;
  const planId = unwrappedParams.planId;

  return <NutritionTrackingPage clientId={clientId} planId={planId} />;
}
