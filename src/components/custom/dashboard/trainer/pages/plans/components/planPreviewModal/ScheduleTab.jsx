import { motion } from "framer-motion";

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
        {timeline && Array.isArray(timeline) && timeline.length > 0 ? (
          timeline.map((item, index) => (
            <div
              key={item.id ?? item.day ?? `timeline-${index}`}
              className="relative pl-8"
            >
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                <span className="text-xs font-medium text-[#FF6B00]">
                  {index + 1}
                </span>
              </div>
              {index !== timeline.length - 1 && (
                <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
              )}
              <div>
                <h4 className="text-white font-medium">
                  {item.title || item.name || `Week ${index + 1}`}
                </h4>
                <p className="text-gray-300">{item.description}</p>
              </div>
            </div>
          ))
        ) : isNutrition ? (
          (days || plan.days || []).length > 0 ? (
            (days || plan.days || []).map((day, index) => (
              <div
                key={day.id ?? day.day ?? day.name ?? `day-${index}`}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#FF6B00]">
                    {index + 1}
                  </span>
                </div>
                {index !== (days || plan.days || []).length - 1 && (
                  <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
                )}
                <div>
                  <h4 className="text-white font-medium">
                    {day.name || day.day || `Day ${index + 1}`}
                  </h4>
                  <p className="text-gray-300">{day.description}</p>
                </div>
              </div>
            ))
          ) : schedule && Array.isArray(schedule) && schedule.length > 0 ? (
            schedule.map((item, index) => (
              <div
                key={item.id ?? item.day ?? `schedule-${index}`}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#FF6B00]">
                    {index + 1}
                  </span>
                </div>
                {index !== schedule.length - 1 && (
                  <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
                )}
                <div>
                  <h4 className="text-white font-medium">
                    {item.name || `Day ${index + 1}`}
                  </h4>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No timeline or days available.</p>
          )
        ) : schedule && Array.isArray(schedule) && schedule.length > 0 ? (
          schedule.map((week, index) => (
            <div
              key={week.id ?? week.day ?? week.name ?? `week-${index}`}
              className="relative pl-8"
            >
              <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                <span className="text-xs font-medium text-[#FF6B00]">
                  {index + 1}
                </span>
              </div>
              {index !== schedule.length - 1 && (
                <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
              )}
              <div>
                <h4 className="text-white font-medium">
                  {week.name || `Week ${index + 1}`}
                </h4>
                <p className="text-gray-300">{week.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No timeline or schedule available.</p>
        )}
      </div>
    </div>
  </motion.div>
);
