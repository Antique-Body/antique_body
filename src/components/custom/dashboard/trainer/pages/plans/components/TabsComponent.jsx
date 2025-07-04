import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { NutritionPlanIcon, TrainingPlanIcon } from "@/components/common/Icons";

export const TabsComponent = ({
  activeTab,
  setActiveTab,
  disableAnimations = false,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const tabs = [
    {
      id: "training",
      label: "Training Plans",
      icon: <TrainingPlanIcon size={20} />,
      description:
        "Design workout programs, exercise routines, and training schedules to help your clients achieve their fitness goals.",
    },
    {
      id: "nutrition",
      label: "Nutrition Plans",
      icon: <NutritionPlanIcon size={20} />,
      description:
        "Create and manage meal plans, recipes, macro targets and nutritional guidelines for your clients.",
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="mb-4 sm:mb-8">
      {/* Glass Morphism Container */}
      <div className="backdrop-blur-md bg-gradient-to-r from-[#1a1a1a]/70 to-[#2a2a2a]/70 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-[#333]/50 p-1 sm:p-1.5 overflow-hidden">
        <div className="flex rounded-lg overflow-hidden relative">
          {/* Animated background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF9500]/5 animate-pulse-slow opacity-30" />

          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`
                                relative flex-1 flex items-center justify-center gap-1 sm:gap-3 py-2 sm:py-4 px-2 sm:px-6 text-xs sm:text-sm font-medium transition-all duration-300
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
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9500] shadow-[0_5px_15px_rgba(255,107,0,0.3)]"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}

              {/* Icon with pulse animation on active */}
              <div
                className={`relative transition-all duration-300 ${
                  activeTab === tab.id ? "scale-110" : "scale-100"
                }`}
              >
                <motion.div
                  animate={
                    activeTab === tab.id &&
                    !prefersReducedMotion &&
                    !disableAnimations
                      ? {
                          scale: [1, 1.1, 1],
                          transition: {
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2,
                            repeatDelay: 1,
                          },
                        }
                      : {}
                  }
                  className="relative z-10 scale-75 sm:scale-100"
                >
                  {tab.icon}
                </motion.div>

                {activeTab === tab.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-full bg-white/10 blur-sm z-0"
                  />
                )}
              </div>

              {/* Label with subtle animation */}
              <motion.span
                className="relative z-10 font-medium text-xs sm:text-sm"
                animate={activeTab === tab.id ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">
                  {tab.id === "nutrition" ? "Nutrition" : "Training"}
                </span>
              </motion.span>
            </button>
          ))}
        </div>
      </div>

      {/* Description Panel with enhanced transitions */}
      <div className="mt-3 sm:mt-6 relative h-20 sm:h-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, height: "auto" }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute left-0 top-0 w-full backdrop-blur-sm bg-gradient-to-r from-[#222]/40 to-[#333]/40 p-3 sm:p-4 rounded-lg border border-[#444]/30"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex items-start sm:items-center gap-2 sm:gap-3"
            >
              <div className="text-[#FF6B00] shrink-0 mt-1 sm:mt-0">
                {tabs.find((tab) => tab.id === activeTab)?.icon}
              </div>
              <div className="text-xs sm:text-sm text-gray-300 font-light">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

TabsComponent.propTypes = {
  activeTab: PropTypes.oneOf(["training", "nutrition"]).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  disableAnimations: PropTypes.bool,
};
