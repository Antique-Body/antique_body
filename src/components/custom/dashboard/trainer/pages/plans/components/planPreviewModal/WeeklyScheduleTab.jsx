import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";

const renderDayButton = (day, index, activeDay, setActiveDay) => (
  <Button
    key={day.id ?? index}
    type="button"
    onClick={() => setActiveDay(day.day || day.name)}
    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
      activeDay === (day.day || day.name)
        ? "bg-[#FF6B00] text-white"
        : "bg-[#1A1A1A] text-gray-400 hover:text-white"
    }`}
    variant="ghost"
  >
    {day.name || day.day}
  </Button>
);

export const WeeklyScheduleTab = ({
  isNutrition,
  days,
  plan,
  schedule,
  activeDay,
  setActiveDay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Weekly Schedule</h3>
      <div className="flex space-x-2 overflow-x-auto mb-6">
        {(isNutrition
          ? days || plan.days || []
          : schedule || plan.schedule || []
        ).map((day, index) =>
          renderDayButton(day, index, activeDay, setActiveDay)
        )}
      </div>
      <div>
        {/* The day details rendering function should be passed as a prop or further modularized if needed */}
      </div>
    </div>
  </motion.div>
);
