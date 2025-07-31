"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Modal } from "@/components/common/Modal";

export const MealDetailModal = ({
  isOpen,
  onClose,
  meal,
  option,
  onLogMeal,
}) => {
  const [portion, setPortion] = useState(1);
  const [isLogging, setIsLogging] = useState(false);
  const [adjustedNutrition, setAdjustedNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Calculate adjusted nutrition values based on portion
  useEffect(() => {
    if (!option) return;

    setAdjustedNutrition({
      calories: Math.round((option.calories || 0) * portion),
      protein: Math.round((option.protein || 0) * portion * 10) / 10,
      carbs: Math.round((option.carbs || 0) * portion * 10) / 10,
      fat: Math.round((option.fat || 0) * portion * 10) / 10,
    });
  }, [option, portion]);

  // Handle log meal
  const handleLogMeal = async () => {
    if (!meal || !option) return;

    setIsLogging(true);
    try {
      // Create adjusted option with portion
      const adjustedOption = {
        ...option,
        ...adjustedNutrition,
        portionMultiplier: portion,
      };

      await onLogMeal(meal, adjustedOption);
      onClose();
    } catch (error) {
      console.error("Error logging meal:", error);
    } finally {
      setIsLogging(false);
    }
  };

  // Reset portion when modal opens
  useEffect(() => {
    if (isOpen) {
      setPortion(1);
    }
  }, [isOpen]);

  if (!meal || !option) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meal.name}
      size="medium"
      primaryButtonText={isLogging ? "Logging Meal..." : "LOG THIS MEAL"}
      secondaryButtonText="Cancel"
      primaryButtonAction={handleLogMeal}
      primaryButtonDisabled={isLogging}
      showCloseButton
    >
      <div className="space-y-6">
        {/* Meal Header with Image and Details */}
        <div className="flex flex-col md:flex-row gap-5">
          {option.imageUrl && (
            <div className="w-full md:w-1/3 h-48 md:h-auto rounded-lg overflow-hidden border-2 border-[#FF6B00]/30">
              <Image
                src={option.imageUrl}
                alt={option.name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 space-y-4">
            {/* Meal Name and Description */}
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                {option.name}
              </h2>
              {option.description && (
                <p className="text-zinc-400 mt-2 text-sm">
                  {option.description}
                </p>
              )}
            </div>

            {/* Dietary Tags */}
            {option.dietary && option.dietary.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {option.dietary.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#FF6B00]/20 text-[#FF9A00] text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Nutrition Info with Color-coded Bars */}
            <div className="space-y-3">
              {/* Calories */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:fire" className="w-5 h-5 text-[#FF6B00]" />
                    <span className="text-zinc-300 text-sm">Calories</span>
                  </div>
                  <span className="text-white font-bold">
                    {adjustedNutrition.calories}
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                    style={{
                      width: `${Math.min(100, (adjustedNutrition.calories / 1000) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Protein */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:food-steak"
                      className="w-5 h-5 text-red-400"
                    />
                    <span className="text-zinc-300 text-sm">Protein</span>
                  </div>
                  <span className="text-white font-bold">
                    {adjustedNutrition.protein}g
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-400"
                    style={{
                      width: `${Math.min(100, (adjustedNutrition.protein / 50) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:bread-slice"
                      className="w-5 h-5 text-yellow-400"
                    />
                    <span className="text-zinc-300 text-sm">Carbs</span>
                  </div>
                  <span className="text-white font-bold">
                    {adjustedNutrition.carbs}g
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                    style={{
                      width: `${Math.min(100, (adjustedNutrition.carbs / 100) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Fat */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:oil" className="w-5 h-5 text-green-400" />
                    <span className="text-zinc-300 text-sm">Fat</span>
                  </div>
                  <span className="text-white font-bold">
                    {adjustedNutrition.fat}g
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                    style={{
                      width: `${Math.min(100, (adjustedNutrition.fat / 50) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-700/50"></div>

        {/* Portion Control Section */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gradient-to-br from-[#FF6B00]/30 to-[#FF9A00]/20 p-2 rounded-full">
              <Icon
                icon="mdi:scale-balance"
                className="w-5 h-5 text-[#FF9A00]"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Portion Size</h3>
              <p className="text-zinc-400 text-sm">Adjust how much you ate</p>
            </div>
          </div>

          {/* Portion Display and Controls */}
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            {/* Current Portion Display */}
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-white">
                {portion < 1
                  ? `${Math.round(portion * 100)}%`
                  : portion === 1
                    ? "Full Portion"
                    : `${portion}x Portion`}
              </div>
              <p className="text-zinc-400 text-sm mt-1">Current serving size</p>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  portion === 0.5
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white"
                    : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 text-white hover:bg-zinc-700"
                }`}
                onClick={() => setPortion(0.5)}
              >
                Half
              </button>

              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  portion === 1
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white"
                    : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 text-white hover:bg-zinc-700"
                }`}
                onClick={() => setPortion(1)}
              >
                Full
              </button>

              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  portion === 1.5
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white"
                    : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 text-white hover:bg-zinc-700"
                }`}
                onClick={() => setPortion(1.5)}
              >
                1.5x
              </button>

              <button
                className={`px-4 py-2 rounded-lg font-medium ${
                  portion === 2
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white"
                    : "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 text-white hover:bg-zinc-700"
                }`}
                onClick={() => setPortion(2)}
              >
                Double
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="px-4 mb-2">
            <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full transition-all duration-300"
                style={{ width: `${(portion / 2) * 100}%` }}
              />
              <div
                className="absolute w-6 h-6 bg-white rounded-full border-2 border-[#FF6B00] shadow-lg top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-grab hover:scale-110 transition-transform"
                style={{ left: `${(portion / 2) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.25"
              value={portion}
              onChange={(e) => setPortion(parseFloat(e.target.value))}
              className="w-full h-3 absolute -mt-3 opacity-0 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
              <span>150%</span>
              <span>200%</span>
            </div>
          </div>

          {/* Plus/Minus Fine Control */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-white hover:bg-[#FF6B00] hover:border-[#FF6B00]/50 transition-all disabled:opacity-50"
              onClick={() => setPortion(Math.max(0.25, portion - 0.25))}
              disabled={portion <= 0.25}
            >
              <Icon icon="mdi:minus" className="w-5 h-5" />
            </button>

            <div className="w-16 text-center font-medium text-white">
              {portion}x
            </div>

            <button
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-white hover:bg-[#FF6B00] hover:border-[#FF6B00]/50 transition-all disabled:opacity-50"
              onClick={() => setPortion(Math.min(2, portion + 0.25))}
              disabled={portion >= 2}
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ingredients Section */}
        {option.ingredients && option.ingredients.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className=" p-2 rounded-full">
                <Icon
                  icon="mdi:food-variant"
                  className="w-5 h-5 text-[#FF9A00]"
                />
              </div>
              <h3 className="text-lg font-semibold text-white">Ingredients</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {option.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-zinc-800/50 rounded-lg px-3 py-2"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                    <Icon icon="mdi:check" className="w-3 h-3 text-[#FF9A00]" />
                  </div>
                  <span className="text-zinc-200">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
