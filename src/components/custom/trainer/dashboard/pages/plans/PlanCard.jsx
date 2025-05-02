"use client";

import { Card } from "@/components/custom/Card";

export const PlanCard = ({ plan, onClick }) => {
  const { title, type, summary, days } = plan;

  return (
    <Card
      variant="planCard"
      width="100%"
      maxWidth="100%"
      className="transform cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="flex h-full flex-col">
        {/* Card Header with Type */}
        <div className="border-b border-[#333] bg-[rgba(30,30,30,0.7)] px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-400">
          {type}
        </div>

        {/* Card Title & Summary */}
        <div className="p-5">
          <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
          <p className="mb-4 text-sm text-gray-400">{summary}</p>

          {/* Day tags */}
          <div className="mt-auto flex flex-wrap gap-2">
            {days.slice(0, 3).map((day, index) => (
              <div key={index} className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs text-[#FF6B00]">
                Day {index + 1}: {day.focus}
              </div>
            ))}
            {days.length > 3 && (
              <div className="rounded-md bg-[rgba(255,255,255,0.1)] px-2 py-1 text-xs text-gray-400">
                +{days.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
