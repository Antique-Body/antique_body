import { Icon } from "@iconify/react";

const TAB_CONFIG = [
  {
    id: "overview",
    label: "Overview",
    icon: "mdi:account-details",
    description: "Client profile and basic information",
  },
  {
    id: "progress",
    label: "Progress",
    icon: "mdi:chart-line",
    description: "Track fitness progress and measurements",
  },
  {
    id: "workouts",
    label: "Workout Plans",
    icon: "mdi:dumbbell",
    description: "Manage workout routines and exercises",
  },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: "mdi:food-apple",
    description: "Meal plans and dietary guidelines",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "mdi:message",
    description: "Communication with client",
  },
];

export function ClientTabs({ activeTab, setActiveTab, className = "" }) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="border-b border-zinc-800">
        <nav className="flex gap-8 overflow-x-auto">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-[#3E92CC] text-[#3E92CC]"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon icon={tab.icon} width={20} height={20} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}