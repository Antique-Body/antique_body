import { Suspense } from "react";

import { TrainingPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/training/create/TrainingPlanCreator";

export default function CreateTrainingPlanPage() {
  return (
    <Suspense fallback={<div>Loading training plan creator...</div>}>
      <TrainingPlanCreator />
    </Suspense>
  );
}
