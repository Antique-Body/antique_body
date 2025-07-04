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

function selectScheduleData({ timeline, isNutrition, days, plan, schedule }) {
  if (timeline && Array.isArray(timeline) && timeline.length > 0) {
    return { list: timeline, type: "timeline" };
  }
  if (isNutrition) {
    const dayList = days || plan.days || [];
    if (dayList.length > 0) {
      return { list: dayList, type: "day" };
    }
    if (schedule && Array.isArray(schedule) && schedule.length > 0) {
      return { list: schedule, type: "schedule" };
    }
    return {
      list: [],
      type: "none",
      fallback: "No timeline or days available.",
    };
  }
  if (schedule && Array.isArray(schedule) && schedule.length > 0) {
    return { list: schedule, type: "schedule" };
  }
  return {
    list: [],
    type: "none",
    fallback: "No timeline or schedule available.",
  };
}

function renderScheduleContent(props) {
  const { list, type, fallback } = selectScheduleData(props);
  if (list.length > 0) {
    return list.map((item, index) =>
      renderScheduleItem(item, index, list, type)
    );
  } else {
    return <p className="text-gray-400">{fallback}</p>;
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
