"use client";

import { useState, useEffect } from "react";

import { PlansList } from "@/components/custom/trainer/dashboard/pages/plans";
import mockPlans from "@/components/custom/trainer/dashboard/pages/plans/data/mockPlans";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setPlans(mockPlans);
  }, []);

  return (
    <div className="w-full pb-12">
      <div className="mb-6 px-6 py-4">
        <h1 className="mb-2 text-3xl font-bold text-white">Training Plans</h1>
        <p className="text-gray-400">Create and manage your training plans for clients</p>
      </div>

      <div className="px-6">
        <PlansList plans={plans} />
      </div>
    </div>
  );
};

export default PlansPage;
