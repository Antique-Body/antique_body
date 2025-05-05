"use client";

import { PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const CreateExerciseCard = ({ onClick }) => (
    <Card
      variant="createPlanCard"
      width="100%"
      maxWidth="100%"
      className="flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
          <PlusIcon size={24} className="text-[#FF6B00]" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">Add New Exercise</h3>
        <p className="text-sm text-gray-400">Create a custom exercise for your training library</p>
      </div>
    </Card>
  ); 