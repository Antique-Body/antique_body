"use client";

import { useRouter } from "next/navigation";

import { CreatePlanCard } from "./CreatePlanCard";
import { PlanCard } from "./PlanCard";

export const PlansList = ({ plans }) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} onClick={() => router.push(`/trainer/dashboard/plans/${plan.id}`)} />
        ))}

        <CreatePlanCard onClick={() => router.push("/trainer/dashboard/plans/create")} />
      </div>
    </div>
  );
};
