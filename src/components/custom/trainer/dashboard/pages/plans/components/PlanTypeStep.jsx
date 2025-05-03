"use client";

import { PlusIcon, WorkoutIcon } from "@/components/common/Icons";

const planTypes = [
  {
    id: "muscle-building",
    name: "Muscle Building Program",
    icon: <WorkoutIcon className="h-12 w-12 text-[#FF6B00]" />,
    description: "Focused strength training program designed for muscle hypertrophy and overall strength gains.",
    subtypes: [
      { id: "beginner-bulk", name: "Beginner Bulk" },
      { id: "advanced-hypertrophy", name: "Advanced Hypertrophy" },
      { id: "strength-focus", name: "Strength Focus" },
    ],
  },
  {
    id: "fat-loss",
    name: "Fat Loss Program",
    icon: <WorkoutIcon className="h-12 w-12 text-[#FF6B00]" />,
    description: "High-intensity workouts combined with strategic cardio for optimal fat burning and body composition.",
    subtypes: [
      { id: "hiit-focus", name: "HIIT Training" },
      { id: "metabolic-conditioning", name: "Metabolic Conditioning" },
      { id: "weight-management", name: "Weight Management" },
    ],
  },
  {
    id: "rehabilitation",
    name: "Injury Rehabilitation",
    icon: <WorkoutIcon className="h-12 w-12 text-[#FF6B00]" />,
    description: "Specialized programs for recovery from injuries with focus on mobility, stability, and gradual strength building.",
    subtypes: [
      { id: "joint-recovery", name: "Joint Recovery" },
      { id: "back-rehabilitation", name: "Back Rehabilitation" },
      { id: "post-surgery", name: "Post-Surgery" },
    ],
  },
  {
    id: "functional-fitness",
    name: "Functional Fitness",
    icon: <WorkoutIcon className="h-12 w-12 text-[#FF6B00]" />,
    description: "Improve everyday movement patterns, core strength, and overall mobility for better quality of life.",
    subtypes: [
      { id: "mobility-focus", name: "Mobility & Flexibility" },
      { id: "core-strength", name: "Core Strength" },
      { id: "balance-stability", name: "Balance & Stability" },
    ],
  },
  {
    id: "custom",
    name: "Custom Program",
    icon: <PlusIcon size={32} className="text-[#FF6B00]" />,
    description: "Start from scratch and build a fully customized training program for any specific fitness goal or requirement.",
  },
];

export const PlanTypeStep = ({ onSelect }) => (
  <div className="p-6">
    <h2 className="mb-6 text-2xl font-bold text-white">Select Training Plan Type</h2>
    <p className="mb-8 text-gray-400">
      Choose the type of training plan you want to create. This will determine the structure and focus of your plan.
    </p>

    <div className="flex flex-col space-y-4">
      {planTypes.map(type => (
        <div
          key={type.id}
          className="group cursor-pointer rounded-xl border border-[#333] bg-gradient-to-r from-[rgba(20,20,20,0.9)] to-[rgba(30,30,30,0.9)] p-4 transition-all duration-300 hover:border-[#FF6B00] hover:shadow-[0_0_20px_rgba(255,107,0,0.15)]"
          onClick={() => onSelect(type.id)}
        >
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,107,0,0.1)] transition-all duration-300 group-hover:bg-[rgba(255,107,0,0.2)]">
              {type.icon}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#FF6B00]">{type.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{type.description}</p>

              {type.subtypes && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {type.subtypes.map(subtype => (
                    <span
                      key={subtype.id}
                      className="rounded bg-[rgba(255,107,0,0.15)] px-3 py-1 text-xs text-[#FF6B00]"
                    >
                      {subtype.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222] transition-all duration-300 group-hover:bg-[#FF6B00]">
              <span className="text-lg font-bold text-gray-400 group-hover:text-white">→</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
