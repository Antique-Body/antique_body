"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { MealConfirmationModal } from "./MealConfirmationModal";

export const NewMealCard = ({
  meal,
  mealLog,
  isNextMeal,
  isEditable,
  isCompleted,
  isDayEditable,
  onLogMeal,
  onViewDetail,
  onDeleteMeal,
  onCustomMeal, // Added for custom meal input
}) => {
  const [selectedOption, setSelectedOption] = useState(
    mealLog?.selectedOption || meal.options?.[0] || null
  );
  const [isLogging, setIsLogging] = useState(false);
  const [showPortionControl, setShowPortionControl] = useState(false);
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [customMealName, setCustomMealName] = useState("");
  const [customMealDescription, setCustomMealDescription] = useState("");
  const [showCustomMealInput, setShowCustomMealInput] = useState(false);
  const [showMealConfirmation, setShowMealConfirmation] = useState(false);
  const [confirmationMealData, setConfirmationMealData] = useState(null);

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCustomMealLog = async () => {
    if (!customMealName.trim() || !isEditable) return;

    setIsLogging(true);
    try {
      const customMeal = {
        name: customMealName,
        description: customMealDescription,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        isCustom: true,
        portionMultiplier: 1,
      };

      await onLogMeal(meal, customMeal, mealLog);
      setShowCustomMealInput(false);
      setCustomMealName("");
      setCustomMealDescription("");
    } finally {
      setIsLogging(false);
    }
  };

  const handleDeleteMeal = async () => {
    if (!mealLog) return;
    await onDeleteMeal(mealLog);
  };

  // Handle meal confirmation modal
  const handleShowMealConfirmation = (option) => {
    setConfirmationMealData(option);
    setShowMealConfirmation(true);
  };

  const handleConfirmMeal = async (meal, mealData) => {
    try {
      await onLogMeal(meal, mealData, null);
      setShowMealConfirmation(false);
      setConfirmationMealData(null);
    } catch (error) {
      console.error("Error confirming meal:", error);
      throw error;
    }
  };

  // Handle "Log Different Meal" (open MealLoggingModal)
  const handleLogDifferentMeal = () => {
    if (onCustomMeal) {
      onCustomMeal(meal, mealLog);
    }
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

  // Check if this is a custom meal input plan (empty meal with calories: 0)
  const isCustomMealInput = selectedOption && selectedOption.calories === 0 && selectedOption.name?.includes("Dodaj");

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
                      {mealLog.selectedOption.portionMultiplier &&
                        mealLog.selectedOption.portionMultiplier !== 1 && (
                          <span className="text-xs bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded">
                            {mealLog.selectedOption.portionMultiplier}x
                          </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-green-300 flex-wrap">
                      <span>
                        {Math.round(mealLog.selectedOption.calories || 0)} cal
                      </span>
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
                    {mealLog.selectedOption.description && (
                      <p className="text-xs text-green-400 mt-1">
                        {mealLog.selectedOption.description}
                      </p>
                    )}
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

        {/* Custom Meal Input */}
        {showCustomMealInput && (
          <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="text-purple-400 font-medium mb-3">
              Add Custom Meal
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                value={customMealName}
                onChange={(e) => setCustomMealName(e.target.value)}
                placeholder="What did you eat?"
                className="w-full px-3 py-2 bg-zinc-700/30 border border-zinc-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
              <textarea
                value={customMealDescription}
                onChange={(e) => setCustomMealDescription(e.target.value)}
                placeholder="Optional: Describe what you ate and how much..."
                rows={2}
                className="w-full px-3 py-2 bg-zinc-700/30 border border-zinc-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2">
                <Button
                  variant="purpleFilled"
                  size="small"
                  onClick={handleCustomMealLog}
                  disabled={!customMealName.trim() || isLogging}
                >
                  {isLogging ? "Logging..." : "Log Custom Meal"}
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowCustomMealInput(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Portion Control */}
        {showPortionControl && selectedOption && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-3">Adjust Portion</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-zinc-300 text-sm">Portion:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() =>
                      setPortionMultiplier(
                        Math.max(0.25, portionMultiplier - 0.25)
                      )
                    }
                    disabled={portionMultiplier <= 0.25}
                  >
                    <Icon icon="mdi:minus" className="w-4 h-4" />
                  </Button>
                  <span className="text-white font-medium min-w-[3rem] text-center">
                    {portionMultiplier}x
                  </span>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() =>
                      setPortionMultiplier(portionMultiplier + 0.25)
                    }
                  >
                    <Icon icon="mdi:plus" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-zinc-700/30 rounded">
                  <div className="text-orange-400 font-bold">
                    {Math.round(
                      (selectedOption.calories || 0) * portionMultiplier
                    )}
                  </div>
                  <div className="text-zinc-400">cal</div>
                </div>
                <div className="text-center p-2 bg-zinc-700/30 rounded">
                  <div className="text-blue-400 font-bold">
                    {Math.round(
                      (selectedOption.protein || 0) * portionMultiplier * 10
                    ) / 10}
                    g
                  </div>
                  <div className="text-zinc-400">protein</div>
                </div>
                <div className="text-center p-2 bg-zinc-700/30 rounded">
                  <div className="text-yellow-400 font-bold">
                    {Math.round(
                      (selectedOption.carbs || 0) * portionMultiplier * 10
                    ) / 10}
                    g
                  </div>
                  <div className="text-zinc-400">carbs</div>
                </div>
                <div className="text-center p-2 bg-zinc-700/30 rounded">
                  <div className="text-green-400 font-bold">
                    {Math.round(
                      (selectedOption.fat || 0) * portionMultiplier * 10
                    ) / 10}
                    g
                  </div>
                  <div className="text-zinc-400">fat</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="greenFilled"
                  size="small"
                  onClick={() => {
                    const customMeal = {
                      name: `Custom ${meal.name}`,
                      description: "Quickly logged meal",
                      calories: 0,
                      protein: 0,
                      carbs: 0,
                      fat: 0,
                      isCustom: true,
                      portionMultiplier: portionMultiplier,
                    };
                    onLogMeal(meal, customMeal, null);
                    setShowPortionControl(false);
                  }}
                  disabled={isLogging}
                  className="flex-1"
                >
                  {isLogging ? "Logging..." : "Log with Portion"}
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowPortionControl(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Trainer Suggestions (for incomplete meals) */}
        {!isCompleted &&
          meal.options &&
          meal.options.length > 0 &&
          !showCustomMealInput && (
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

              {/* Custom Meal Input or Options List */}
              {isCustomMealInput ? (
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon 
                        icon={getMealIcon(meal.name)} 
                        className="w-8 h-8 text-white" 
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {meal.name === "Breakfast" ? "Doručak" :
                       meal.name === "Lunch" ? "Ručak" :
                       meal.name === "Dinner" ? "Večera" :
                       meal.name === "Snack" ? "Užina" : meal.name}
                    </h4>
                    <p className="text-zinc-300 text-sm mb-6">
                      {formatTime(meal.time)} • Dodaj svoj obrok
                    </p>
                    
                    {isEditable ? (
                      <Button
                        variant="orangeFilled"
                        size="large"
                        onClick={() => onCustomMeal && onCustomMeal(meal, mealLog)}
                        className="transform hover:scale-105 transition-all duration-200 shadow-lg"
                      >
                        <Icon icon="mdi:plus-circle" className="w-5 h-5 mr-2" />
                        Unesi obrok
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                        <Icon icon="mdi:lock" className="w-4 h-4" />
                        Završi prethodne obroke prvo
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
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
                        {/* Option Image with Video Indicator */}
                        {option.imageUrl && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={option.imageUrl}
                              alt={option.name}
                              width={40}
                              height={40}
                              className={`w-full h-full object-cover ${
                                !isEditable && isDayEditable ? "opacity-40" : ""
                              }`}
                            />
                            {option.videoUrl && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Icon icon="mdi:play-circle" className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Option Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5
                              className={`font-medium text-sm truncate ${
                                !isEditable && isDayEditable
                                  ? "text-zinc-500"
                                  : "text-white"
                              }`}
                            >
                              {option.name}
                            </h5>
                            {option.videoUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowMealConfirmation(option);
                                }}
                                className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded text-blue-300 hover:text-blue-200 transition-all"
                                title="Pogledaj video"
                              >
                                <Icon icon="mdi:video" className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Show description for text-based meals */}
                          {option.isTextBased && option.description && (
                            <p className="text-xs text-zinc-400 mb-1">
                              {option.description.length > 80 ? `${option.description.substring(0, 80)}...` : option.description}
                            </p>
                          )}

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

                        {/* I ate this button */}
                        {isEditable && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowMealConfirmation(option);
                            }}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8 px-3 text-xs font-medium"
                            title="Jeo sam ovo"
                          >
                            <Icon icon="mdi:check-circle" className="w-3 h-3 mr-1" />
                            Jeo sam
                          </Button>
                        )}

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

                      {/* Log This Meal Button - Full width below option */}
                      {isEditable && (
                        <div className="mt-3 pt-3 border-t border-zinc-700/30">
                          <div className="flex gap-2">
                            <Button
                              variant="greenFilled"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowMealConfirmation(option);
                              }}
                              className="flex-1 h-8 text-xs"
                            >
                              <Icon
                                icon="mdi:silverware-fork-knife"
                                className="w-3 h-3 mr-1"
                              />
                              Jeo sam ovo
                            </Button>
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPortionControl(true);
                              }}
                              className="h-8 px-2 text-xs"
                              title="Adjust portion"
                            >
                              <Icon icon="mdi:scale" className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                  </div>
                  
                  {/* Log Different Meal Button */}
                  {isEditable && (
                    <div className="pt-3 border-t border-zinc-700/30">
                      <Button
                        variant="secondary"
                        size="medium"
                        onClick={handleLogDifferentMeal}
                        className="w-full h-10 bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                      >
                        <Icon icon="mdi:silverware-fork-knife" className="w-4 h-4 mr-2" />
                        Logovaj drugi obrok
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}



        {/* Enhanced Next Meal Glow */}
        {isNextMeal && !isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF9A00]/5 rounded-xl blur-xl -z-10 animate-pulse"></div>
        )}
      </div>

      {/* Meal Confirmation Modal */}
      <MealConfirmationModal
        isOpen={showMealConfirmation}
        onClose={() => {
          setShowMealConfirmation(false);
          setConfirmationMealData(null);
        }}
        onConfirm={handleConfirmMeal}
        meal={meal}
        option={confirmationMealData}
        mealTime={meal?.time}
      />
    </div>
  );
};
