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
        {(() => {
          const dayList = isNutrition
            ? days || plan.days || []
            : schedule || plan.schedule || [];
          const currentDay = dayList.find(
            (d) => (d.day || d.name) === activeDay
          );
          if (!currentDay) {
            return (
              <div className="text-zinc-400">No details for this day.</div>
            );
          }
          // Render details for the current day
          return (
            <div className="bg-zinc-900/40 rounded-lg p-4 border border-zinc-700/40 mt-2">
              <h4 className="text-md font-semibold text-white mb-2">
                {currentDay.name || currentDay.day}
              </h4>
              {currentDay.details ? (
                <div className="text-zinc-200 text-sm whitespace-pre-line">
                  {currentDay.details}
                </div>
              ) : (
                <div className="text-zinc-400 text-sm">
                  No details provided.
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  </motion.div>
);
