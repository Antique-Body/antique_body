"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const MealCard = ({
  meal,
  mealLog,
  isEditable,
  onComplete,
  onSelectOption,
  onCustomMeal,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleComplete = async () => {
    if (!isEditable || !mealLog) return;

    setIsUpdating(true);
    try {
      await onComplete(mealLog, !mealLog.isCompleted);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentOption = () => mealLog?.selectedOption || meal.options?.[0];

  const currentOption = getCurrentOption();
  const isCompleted = mealLog?.isCompleted || false;

  return (
    <div
      className={`bg-zinc-800/40 rounded-lg border transition-all duration-200 ${
        isCompleted
          ? "border-green-500/50 bg-green-500/5"
          : "border-zinc-700/50 hover:border-zinc-600/50"
      }`}
    >
      <div className="p-6">
        {/* Meal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted
                  ? "bg-green-500/20 text-green-400"
                  : "bg-[#FF6B00]/20 text-[#FF6B00]"
              }`}
            >
              <Icon
                icon={
                  isCompleted ? "mdi:check-circle" : "mdi:silverware-fork-knife"
                }
                className="w-5 h-5"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{meal.name}</h3>
              <p className="text-zinc-400 text-sm">{formatTime(meal.time)}</p>
            </div>
          </div>

          {/* Completion Toggle */}
          {isEditable && mealLog && (
            <Button
              variant={isCompleted ? "secondary" : "orangeFilled"}
              size="small"
              onClick={handleComplete}
              disabled={isUpdating}
              className="h-9 px-4"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Icon
                  icon={isCompleted ? "mdi:undo" : "mdi:check"}
                  className="w-4 h-4 mr-2"
                />
              )}
              {isCompleted ? "Undo" : "Complete"}
            </Button>
          )}
        </div>

        {/* Current Meal Option */}
        {currentOption && (
          <div className="mb-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Meal Image */}
              {currentOption.imageUrl && (
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={currentOption.imageUrl}
                      alt={currentOption.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Meal Info */}
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2">
                  {currentOption.name}
                </h4>
                <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                  {currentOption.description}
                </p>

                {/* Nutrition Info */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-2 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold text-sm">
                      {currentOption.calories || 0}
                    </div>
                    <div className="text-zinc-400 text-xs">cal</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold text-sm">
                      {currentOption.protein || 0}g
                    </div>
                    <div className="text-zinc-400 text-xs">protein</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold text-sm">
                      {currentOption.carbs || 0}g
                    </div>
                    <div className="text-zinc-400 text-xs">carbs</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold text-sm">
                      {currentOption.fat || 0}g
                    </div>
                    <div className="text-zinc-400 text-xs">fat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditable && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-700/50">
            {/* Change Option Button */}
            {meal.options && meal.options.length > 1 && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => onSelectOption(meal, mealLog)}
                className="h-8 px-3 text-sm"
              >
                <Icon icon="mdi:swap-horizontal" className="w-4 h-4 mr-2" />
                Change Option ({meal.options.length})
              </Button>
            )}

            {/* Custom Meal Button */}
            <Button
              variant="secondary"
              size="small"
              onClick={() => onCustomMeal(meal, mealLog)}
              className="h-8 px-3 text-sm"
            >
              <Icon icon="mdi:plus-circle" className="w-4 h-4 mr-2" />
              Custom Meal
            </Button>

            {/* Ingredients Button */}
            {currentOption?.ingredients && (
              <Button
                variant="ghost"
                size="small"
                className="h-8 px-3 text-sm text-zinc-400 hover:text-white"
              >
                <Icon
                  icon="mdi:format-list-bulleted"
                  className="w-4 h-4 mr-2"
                />
                Ingredients ({currentOption.ingredients.length})
              </Button>
            )}
          </div>
        )}

        {/* Completion Status */}
        {isCompleted && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:check-circle"
                className="w-4 h-4 text-green-400"
              />
              <span className="text-green-400 text-sm font-medium">
                Completed{" "}
                {mealLog?.completedAt
                  ? new Date(mealLog.completedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "recently"}
              </span>
            </div>
          </div>
        )}

        {/* View Only Mode */}
        {!isEditable && !mealLog && (
          <div className="mt-4 p-3 bg-zinc-700/30 border border-zinc-600/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:eye" className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-400 text-sm">
                Preview mode - This day is not editable
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
