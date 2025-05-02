"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { InfoIcon, CalendarIcon, WorkoutIcon, NutritionIcon, NutritionStrategyIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { DashboardTabs, AnimatedTabContent } from "@/components/custom/DashboardTabs";

export const PlanDetailTabs = ({ plan, activeTab: initialActiveTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || "overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <InfoIcon size={18} className="mr-2" />, badgeCount: 0 },
    { id: "schedule", label: "Schedule", icon: <CalendarIcon size={18} className="mr-2" />, badgeCount: 0 },
    { id: "exercises", label: "Exercises", icon: <WorkoutIcon size={18} className="mr-2" />, badgeCount: 0 },
    { id: "nutrition", label: "Nutrition", icon: <NutritionIcon size={18} className="mr-2" />, badgeCount: 0 },
  ];

  // Handle tab change and propagate to parent
  const handleTabChange = tabId => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="w-full">
      <DashboardTabs activeTab={activeTab} setActiveTab={handleTabChange} tabs={tabs} />

      <div className="mt-6 overflow-hidden">
        <AnimatedTabContent isActive={activeTab === "overview"} tabId="overview">
          <OverviewTab plan={plan} />
        </AnimatedTabContent>

        <AnimatedTabContent isActive={activeTab === "schedule"} tabId="schedule">
          <ScheduleTab plan={plan} />
        </AnimatedTabContent>

        <AnimatedTabContent isActive={activeTab === "exercises"} tabId="exercises">
          <ExercisesTab plan={plan} />
        </AnimatedTabContent>

        <AnimatedTabContent isActive={activeTab === "nutrition"} tabId="nutrition">
          <NutritionTab plan={plan} />
        </AnimatedTabContent>
      </div>
    </div>
  );
};

const OverviewTab = ({ plan }) => (
  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
    <Card variant="darkStrong" width="100%" maxWidth="100%" className="p-6">
      <h2 className="mb-6 text-xl font-bold text-white">About This Plan</h2>
      <p className="mb-6 text-gray-300">{plan.description}</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Target Athletes</h3>
          <p className="text-gray-300">{plan.forAthletes}</p>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {plan.days.map((day, index) => (
              <span key={index} className="rounded bg-[rgba(255,107,0,0.15)] px-3 py-1 text-sm text-[#FF6B00]">
                {day.focus}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);

const ScheduleTab = ({ plan }) => (
  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
    <Card variant="darkStrong" width="100%" maxWidth="100%" className="p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Training Schedule</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {plan.days.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.1 }}
          >
            <Card
              variant="dark"
              width="100%"
              maxWidth="100%"
              className="transform p-4 transition-all duration-300 hover:scale-[1.02]"
              hover={true}
            >
              <div className="mb-3 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
                  <span className="font-bold text-[#FF6B00]">{day.day}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{day.focus}</h3>
              </div>

              <div className="pl-11">
                <ul className="space-y-1 text-gray-300">
                  {day.exercises
                    .map((exercise, i) => (
                      <li key={i} className="truncate text-sm">
                        • {exercise.name}
                      </li>
                    ))
                    .slice(0, 3)}
                  {day.exercises.length > 3 && (
                    <li className="text-xs text-gray-400">+ {day.exercises.length - 3} more exercises</li>
                  )}
                </ul>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  </motion.div>
);

const ExercisesTab = ({ plan }) => (
  <div className="space-y-6">
    {plan.days.map((day, dayIndex) => (
      <motion.div
        key={dayIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="darkStrong" width="100%" maxWidth="100%" className="p-6">
          <div className="mb-4 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
              <span className="font-bold text-[#FF6B00]">{day.day}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{day.focus}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#333] text-left">
                  <th className="pb-2 font-medium text-gray-400">Exercise</th>
                  <th className="pb-2 text-center font-medium text-gray-400">Sets</th>
                  <th className="pb-2 text-center font-medium text-gray-400">Reps</th>
                  <th className="pb-2 text-center font-medium text-gray-400">Rest</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((exercise, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <td className="py-3 text-white">{exercise.name}</td>
                    <td className="py-3 text-center text-white">{exercise.sets}</td>
                    <td className="py-3 text-center text-white">{exercise.reps}</td>
                    <td className="py-3 text-center text-white">{exercise.rest}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
);

const NutritionTab = ({ plan }) => {
  // Define colors for each macro nutrient
  const macroColors = {
    "Daily Calories": "#FF6B00",
    Protein: "#5D8CFF",
    Carbs: "#47C872",
    Fats: "#FFC547",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="space-y-6">
        {/* Macronutrients Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 50,
            damping: 20,
          }}
        >
          <Card variant="darkStrong" width="100%" maxWidth="100%" className="p-6">
            <h2 className="mb-6 text-xl font-bold text-white">Daily Nutrition Overview</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {["Daily Calories", "Protein", "Carbs", "Fats"].map((nutrient, _index) => (
                <div
                  key={nutrient}
                  className="p-5"
                  style={{
                    background: `linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(30,30,30,0.9) 100%)`,
                    borderLeft: `4px solid ${macroColors[nutrient]}`,
                  }}
                >
                  <h3 className="mb-1 text-sm font-medium text-gray-400">{nutrient}</h3>
                  <p className="text-2xl font-bold" style={{ color: macroColors[nutrient] }}>
                    {nutrient === "Daily Calories"
                      ? plan.nutrition.dailyCalories
                      : nutrient === "Protein"
                        ? plan.nutrition.macros.protein
                        : nutrient === "Carbs"
                          ? plan.nutrition.macros.carbs
                          : plan.nutrition.macros.fats}
                  </p>
                  <div className="absolute right-3 top-3 h-12 w-12 opacity-10" style={{ color: macroColors[nutrient] }}>
                    {nutrient === "Daily Calories" && (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    )}
                    {nutrient === "Protein" && (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5m16 1V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z" />
                      </svg>
                    )}
                    {nutrient === "Carbs" && (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                      </svg>
                    )}
                    {nutrient === "Fats" && (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3.5L6 10v10h12V10l-6-6.5z" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Macros distribution chart */}
            <div className="mt-6">
              <h3 className="mb-4 flex items-center text-lg font-semibold text-white">
                <NutritionStrategyIcon />
                Nutrition Strategy
              </h3>

              <div className="rounded-md bg-[rgba(20,20,20,0.3)] p-4">
                <p className="text-gray-300">{plan.nutrition.mealPlan}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
