"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const NewMealCard = ({
  meal,
  mealLog,
  isNextMeal,
  isEditable,
  isCompleted,
  isDayEditable,
  onLogMeal,
  onViewDetail,
  onCustomMeal,
  onDeleteMeal,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    mealLog?.selectedOption || meal.options?.[0] || null
  );
  const [isLogging, setIsLogging] = useState(false);

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleLogMeal = async () => {
    if (!selectedOption || !isEditable) return;

    setIsLogging(true);
    try {
      await onLogMeal(meal, selectedOption, mealLog);
    } finally {
      setIsLogging(false);
    }
  };

  const handleDeleteMeal = async () => {
    if (!mealLog) return;
    await onDeleteMeal(mealLog);
  };

  const getMealIcon = (mealName) => {
    const name = mealName.toLowerCase();
    if (name.includes("breakfast")) return "mdi:coffee";
    if (name.includes("lunch") || name.includes("dinner"))
      return "mdi:silverware-fork-knife";
    if (name.includes("snack")) return "mdi:food-apple";
    return "mdi:silverware-fork-knife";
  };

  // Card styling based on state
  const getCardStyle = () => {
    let baseStyle =
      "relative rounded-xl border transition-all duration-300 overflow-hidden ";

    if (isCompleted) {
      baseStyle +=
        "bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/40 ";
    } else if (isNextMeal) {
      baseStyle +=
        "bg-gradient-to-br from-[#FF6B00]/15 to-[#FF9A00]/10 border-[#FF6B00]/60 ring-2 ring-[#FF6B00]/30 shadow-lg shadow-[#FF6B00]/20 ";
    } else if (!isEditable && isDayEditable) {
      // Improved disabled state - less opacity, better visual hierarchy
      baseStyle += "bg-zinc-800/25 border-zinc-700/25 ";
    } else {
      baseStyle +=
        "bg-zinc-800/40 border-zinc-700/50 hover:border-zinc-600/50 ";
    }

    return baseStyle;
  };

  return (
    <div className={getCardStyle()}>
      {/* Next Meal Indicator */}
      {isNextMeal && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>
      )}

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
            <Icon icon="mdi:check-circle" className="w-4 h-4" />
            Completed
          </div>
        </div>
      )}

      {/* Next Up Badge */}
      {isNextMeal && !isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-[#FF6B00]/20 text-[#FF6B00] px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            <Icon icon="mdi:clock-fast" className="w-4 h-4" />
            Next Up
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Meal Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isCompleted
                ? "bg-green-500/20 text-green-400"
                : isNextMeal
                ? "bg-[#FF6B00]/20 text-[#FF6B00]"
                : !isEditable && isDayEditable
                ? "bg-zinc-700/30 text-zinc-500"
                : "bg-zinc-700/50 text-zinc-400"
            }`}
          >
            <Icon icon={getMealIcon(meal.name)} className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3
              className={`text-lg sm:text-xl font-bold ${
                isNextMeal
                  ? "text-[#FF6B00]"
                  : !isEditable && isDayEditable
                  ? "text-zinc-500"
                  : "text-white"
              }`}
            >
              {meal.name}
            </h3>
            <p
              className={`${
                !isEditable && isDayEditable ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              {formatTime(meal.time)}
            </p>
          </div>
        </div>

        {/* Completed Meal Display */}
        {isCompleted && mealLog?.selectedOption && (
          <div className="mb-4">
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {mealLog.selectedOption.imageUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={mealLog.selectedOption.imageUrl}
                        alt={mealLog.selectedOption.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium text-sm truncate">
                        {mealLog.selectedOption.name}
                      </h4>
                      {mealLog.selectedOption.isCustom && (
                        <span className="text-xs bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-green-300 flex-wrap">
                      <span>{mealLog.selectedOption.calories || 0} cal</span>
                      <span>
                        {mealLog.selectedOption.protein || 0}g protein
                      </span>
                      <span className="hidden sm:inline">
                        {mealLog.selectedOption.carbs || 0}g carbs
                      </span>
                      <span className="hidden sm:inline">
                        {mealLog.selectedOption.fat || 0}g fat
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Option for Completed Meals */}
                {isDayEditable && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleDeleteMeal}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-1.5 ml-2"
                  >
                    <Icon icon="mdi:delete" className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trainer Suggestions (for incomplete meals) */}
        {!isCompleted && meal.options && (
          <div className="space-y-3">
            {/* Subtle header for trainer suggestions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4
                  className={`text-xs font-medium ${
                    !isEditable && isDayEditable
                      ? "text-zinc-500"
                      : "text-zinc-400"
                  }`}
                >
                  {meal.options.length} suggested options
                </h4>
              </div>
              {!isEditable && isDayEditable && (
                <div className="flex items-center gap-1 text-zinc-600 text-xs">
                  <Icon icon="mdi:lock" className="w-3 h-3" />
                  <span>Complete previous first</span>
                </div>
              )}
            </div>

            {/* Compact Options List */}
            <div className="space-y-2">
              {meal.options.map((option, index) => {
                const isSelected = selectedOption?.name === option.name;

                return (
                  <div
                    key={index}
                    className={`relative border rounded-lg p-3 transition-all duration-200 ${
                      !isEditable && isDayEditable
                        ? "border-zinc-700/15 bg-zinc-800/5 cursor-not-allowed"
                        : isSelected
                        ? "border-[#FF6B00]/50 bg-[#FF6B00]/3 ring-1 ring-[#FF6B00]/15 cursor-pointer"
                        : "border-zinc-700/30 bg-zinc-800/15 hover:border-zinc-600/30 hover:bg-zinc-800/25 cursor-pointer"
                    }`}
                    onClick={() => isEditable && setSelectedOption(option)}
                  >
                    {/* Selection Indicator */}
                    {isSelected && isEditable && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-[#FF6B00] rounded-full flex items-center justify-center">
                          <Icon
                            icon="mdi:check"
                            className="w-2 h-2 text-white"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {/* Option Image */}
                      {option.imageUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={option.imageUrl}
                            alt={option.name}
                            width={40}
                            height={40}
                            className={`w-full h-full object-cover ${
                              !isEditable && isDayEditable ? "opacity-40" : ""
                            }`}
                          />
                        </div>
                      )}

                      {/* Option Info */}
                      <div className="flex-1 min-w-0">
                        <h5
                          className={`font-medium text-sm mb-1 truncate ${
                            !isEditable && isDayEditable
                              ? "text-zinc-500"
                              : "text-white"
                          }`}
                        >
                          {option.name}
                        </h5>

                        {/* Compact Nutrition Preview */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
                          <span
                            className={
                              !isEditable && isDayEditable
                                ? "text-zinc-600"
                                : "text-zinc-400"
                            }
                          >
                            {option.calories || 0} cal
                          </span>
                          <span
                            className={
                              !isEditable && isDayEditable
                                ? "text-zinc-600"
                                : "text-zinc-400"
                            }
                          >
                            {option.protein || 0}g protein
                          </span>
                          <span
                            className={`hidden sm:inline ${
                              !isEditable && isDayEditable
                                ? "text-zinc-600"
                                : "text-zinc-400"
                            }`}
                          >
                            {option.carbs || 0}g carbs
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetail(meal, option);
                        }}
                        className={`text-xs px-1.5 py-1 h-6 ${
                          !isEditable && isDayEditable
                            ? "text-zinc-600 hover:text-zinc-500"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Icon icon="mdi:eye" className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isCompleted && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {/* LOG MEAL Button */}
            {isEditable && selectedOption && (
              <Button
                variant="orangeFilled"
                size="large"
                onClick={handleLogMeal}
                disabled={isLogging}
                className="flex-1 h-12"
              >
                {isLogging ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Logging Meal...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:check-circle" className="w-5 h-5 mr-3" />
                    LOG MEAL
                  </>
                )}
              </Button>
            )}

            {/* Custom Meal Button */}
            {isEditable && (
              <Button
                variant="secondary"
                size="large"
                onClick={() => onCustomMeal(meal, mealLog)}
                className="h-12 px-6 sm:flex-shrink-0"
              >
                <Icon icon="mdi:plus-circle" className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Custom Meal</span>
                <span className="sm:hidden">Custom</span>
              </Button>
            )}

            {/* Improved Disabled State Message */}
            {!isEditable && isDayEditable && (
              <div className="flex-1 flex items-center justify-center h-12 bg-zinc-800/20 rounded-lg border border-zinc-700/20">
                <div className="flex items-center gap-2 text-zinc-600 text-center">
                  <Icon
                    icon="mdi:clock-outline"
                    className="w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-sm font-medium">
                    <span className="hidden sm:inline">
                      Complete previous meals to unlock
                    </span>
                    <span className="sm:hidden">Complete previous first</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Next Meal Glow */}
        {isNextMeal && !isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF9A00]/5 rounded-xl blur-xl -z-10 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};
