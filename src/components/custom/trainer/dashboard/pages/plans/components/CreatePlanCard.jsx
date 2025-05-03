"use client";

import { PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const CreatePlanCard = ({ onClick }) => (
  <Card variant="createPlanCard" width="100%" maxWidth="100%" onClick={onClick}>
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(40,40,40,0.5)]">
        <PlusIcon size={24} className="text-[#FF6B00]" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">Create New Plan</h3>
      <p className="text-sm text-gray-400">Design a customized training plan for your clients</p>
    </div>
  </Card>
);
