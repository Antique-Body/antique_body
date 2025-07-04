import { motion } from "framer-motion";

function renderScheduleItem(item, index, list, type) {
  return (
    <div
      key={item.id ?? item.day ?? item.name ?? `${type}-${index}`}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
        <span className="text-xs font-medium text-[#FF6B00]">{index + 1}</span>
      </div>
      {index !== list.length - 1 && (
        <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
      )}
      <div>
        <h4 className="text-white font-medium">
          {type === "timeline"
            ? item.title || item.name || `Week ${index + 1}`
            : item.name || item.day || `Day ${index + 1}`}
        </h4>
        <p className="text-gray-300">{item.description}</p>
      </div>
    </div>
  );
}

function renderScheduleContent({
  timeline,
  isNutrition,
  days,
  plan,
  schedule,
}) {
  if (timeline && Array.isArray(timeline) && timeline.length > 0) {
    return timeline.map((item, index) =>
      renderScheduleItem(item, index, timeline, "timeline")
    );
  } else if (isNutrition) {
    const dayList = days || plan.days || [];
    if (dayList.length > 0) {
      return dayList.map((day, index) =>
        renderScheduleItem(day, index, dayList, "day")
      );
    } else if (schedule && Array.isArray(schedule) && schedule.length > 0) {
      return schedule.map((item, index) =>
        renderScheduleItem(item, index, schedule, "schedule")
      );
    } else {
      return <p className="text-gray-400">No timeline or days available.</p>;
    }
  } else if (schedule && Array.isArray(schedule) && schedule.length > 0) {
    return schedule.map((week, index) =>
      renderScheduleItem(week, index, schedule, "schedule")
    );
  } else {
    return <p className="text-gray-400">No timeline or schedule available.</p>;
  }
}

export const ScheduleTab = ({
  timeline,
  isNutrition,
  days,
  plan,
  schedule,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        Timeline Structure
      </h3>
      <div className="space-y-4">
        {renderScheduleContent({ timeline, isNutrition, days, plan, schedule })}
      </div>
    </div>
  </motion.div>
);
