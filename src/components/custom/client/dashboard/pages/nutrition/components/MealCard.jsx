import { useState } from "react";

import { Button } from "@/components/common/Button";
import { ChevronDownIcon, TrashIcon } from "@/components/common/Icons";

export const MealCard = ({ meal, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)]">
      <div className="flex cursor-pointer items-center justify-between p-4" onClick={() => setIsExpanded(!isExpanded)}>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{meal.name}</h3>
            <span className="text-xs text-gray-400">{meal.time}</span>
          </div>
          <p className="text-sm text-gray-400">
            {meal.items.length} {meal.items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{meal.calories} kcal</p>
            <p className="text-xs text-gray-400">
              P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0 text-gray-400"
          >
            <ChevronDownIcon size={20} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mb-3 h-px bg-[#444]"></div>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {meal.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-[rgba(20,20,20,0.5)] p-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.amount}</p>
                </div>
                <p className="text-sm">{item.calories} kcal</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onDelete(meal.id);
              }}
              className="flex items-center gap-1 p-0 text-sm text-red-500 hover:text-red-400"
            >
              <TrashIcon size={14} />
              Delete Meal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
