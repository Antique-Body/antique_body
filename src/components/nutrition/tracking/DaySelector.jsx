import { Icon } from "@iconify/react";

import { Card } from "@/components/common/Card";

export function DaySelector({ days, activeDay, onDayChange }) {
  return (
    <Card
      variant="dark"
      className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon
          icon="mdi:calendar-week"
          className="text-[#3E92CC]"
          width={28}
          height={28}
        />
        <h3 className="text-xl font-semibold text-white">Plan Days</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => onDayChange(index)}
            className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-200 font-medium ${
              activeDay === index
                ? "bg-gradient-to-r from-[#3E92CC] to-[#2E7DCC] text-white shadow-lg"
                : "bg-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700/70"
            }`}
          >
            {day.name || `Day ${index + 1}`}
          </button>
        ))}
      </div>
    </Card>
  );
}