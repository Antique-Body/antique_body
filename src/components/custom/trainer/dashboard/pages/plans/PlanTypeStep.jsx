"use client";

import { RunnerIcon, TrainerIcon, PerformanceIcon, WorkoutIcon, PlusIcon } from "@/components/common/Icons";

const planTypes = [
  {
    id: "football",
    name: "Football Training",
    icon: <TrainerIcon className="h-12 w-12 text-[#FF6B00]" />,
    description:
      "Create specialized training plans for football players focusing on agility, explosiveness, and sport-specific drills.",
  },
  {
    id: "basketball",
    name: "Basketball Training",
    icon: <PerformanceIcon className="h-12 w-12 text-[#FF6B00]" />,
    description:
      "Design basketball-specific programs with emphasis on vertical jump, quick footwork, and game conditioning.",
  },
  {
    id: "athletics",
    name: "Track & Field",
    icon: <RunnerIcon className="h-12 w-12 text-[#FF6B00]" />,
    description:
      "Build training plans for track and field athletes with focus on sprint mechanics, power development, and event specificity.",
  },
  {
    id: "gym",
    name: "Gym Program",
    icon: <WorkoutIcon className="h-12 w-12 text-[#FF6B00]" />,
    description: "Create general gym programs for fat loss, muscle building, or overall fitness improvement.",
    subtypes: [
      { id: "burn-fat", name: "Burn Fat" },
      { id: "build-muscle", name: "Build Muscle" },
      { id: "general-fitness", name: "General Fitness" },
    ],
  },
  {
    id: "custom",
    name: "Custom Program",
    icon: <PlusIcon size={32} className="text-[#FF6B00]" />,
    description: "Start from scratch and build a fully customized training program for any sport or fitness goal.",
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
