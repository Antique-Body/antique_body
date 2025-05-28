"use client";
import { Icon } from "@iconify/react";

const trainingEnvironments = [
  {
    id: "indoor",
    label: "Indoor Training",
    icon: "mdi:home-variant",
    description: "Gym, studio, home workouts",
  },
  {
    id: "outdoor",
    label: "Outdoor Training",
    icon: "mdi:tree",
    description: "Parks, beaches, outdoor spaces",
  },
  {
    id: "both",
    label: "Both Indoor & Outdoor",
    icon: "mdi:sync",
    description: "Flexible training locations",
  },
];

const trainingTypes = [
  { id: "personal", label: "1-on-1 Personal Training", icon: "mdi:account" },
  {
    id: "small_group",
    label: "Small Group Training (2-5)",
    icon: "mdi:account-group",
  },
  {
    id: "group_classes",
    label: "Group Classes (6+)",
    icon: "mdi:account-multiple",
  },
  { id: "online", label: "Online/Virtual Training", icon: "mdi:laptop" },
  { id: "corporate", label: "Corporate Wellness", icon: "mdi:office-building" },
  {
    id: "sports_specific",
    label: "Sports-Specific Training",
    icon: "mdi:soccer",
  },
];

export const TrainingTypeSelector = ({
  selectedEnvironment,
  selectedTypes = [],
  onEnvironmentChange,
  onTypeToggle,
}) => (
  <div className="space-y-6">
    {/* Training Environment */}
    <div>
      <label className="block text-gray-300 mb-3">
        Training Environment Preference
      </label>
      <p className="text-sm text-gray-400 mb-4">
        Where do you prefer to conduct training sessions?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {trainingEnvironments.map((env) => (
          <button
            key={env.id}
            type="button"
            onClick={() => onEnvironmentChange(env.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedEnvironment === env.id
                ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                : "border-[#333] bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon icon={env.icon} className="text-2xl" />
              <span className="font-medium">{env.label}</span>
            </div>
            <p className="text-xs text-gray-400">{env.description}</p>
          </button>
        ))}
      </div>
    </div>

    {/* Training Types */}
    <div>
      <label className="block text-gray-300 mb-3">Training Types Offered</label>
      <p className="text-sm text-gray-400 mb-4">
        Select all types of training you offer (multiple selections allowed)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {trainingTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onTypeToggle(type.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedTypes.includes(type.id)
                ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                : "border-[#333] bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon icon={type.icon} className="text-xl" />
              <span className="font-medium text-sm">{type.label}</span>
              {selectedTypes.includes(type.id) && (
                <Icon
                  icon="mdi:check"
                  width={16}
                  height={16}
                  className="ml-auto"
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedTypes.length === 0 && (
        <p className="mt-3 text-sm text-red-400">
          Please select at least one training type
        </p>
      )}
    </div>

    {/* Selected summary */}
    {(selectedEnvironment || selectedTypes.length > 0) && (
      <div className="p-4 bg-[rgba(255,107,0,0.1)] border border-[#FF6B00]/30 rounded-lg">
        <h4 className="text-[#FF6B00] font-medium mb-2">
          Your Training Preferences:
        </h4>
        <div className="space-y-1 text-sm text-gray-300">
          {selectedEnvironment && (
            <p>
              <span className="text-gray-400">Environment:</span>{" "}
              {
                trainingEnvironments.find(
                  (env) => env.id === selectedEnvironment
                )?.label
              }
            </p>
          )}
          {selectedTypes.length > 0 && (
            <p>
              <span className="text-gray-400">Types:</span>{" "}
              {selectedTypes
                .map(
                  (typeId) =>
                    trainingTypes.find((type) => type.id === typeId)?.label
                )
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    )}
  </div>
);
