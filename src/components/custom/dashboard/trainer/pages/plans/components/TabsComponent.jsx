import { motion } from "framer-motion";

import { NutritionPlanIcon, TrainingPlanIcon } from "@/components/common/Icons";

export const TabsComponent = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "training",
      label: "Training Plans",
      icon: <TrainingPlanIcon size={20} />,
    },
    {
      id: "nutrition",
      label: "Nutrition Plans",
      icon: <NutritionPlanIcon size={20} />,
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-[#1a1a1a]/70 to-[#2a2a2a]/70 backdrop-blur-md border border-[#333]/50 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-1">
        <div className="flex rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF9500]/5 animate-pulse-slow opacity-30" />

          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "text-white z-10"
                    : "text-gray-400 hover:text-gray-200"
                }
              `}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] to-[#FF9500] shadow-[0_5px_15px_rgba(255,107,0,0.3)]"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}

              <div
                className={`relative z-10 ${activeTab === tab.id ? "scale-110" : "scale-100"}`}
              >
                {tab.icon}
              </div>

              <span className="relative z-10 font-medium">
                {tab.id === "nutrition" ? "Nutrition" : "Training"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
