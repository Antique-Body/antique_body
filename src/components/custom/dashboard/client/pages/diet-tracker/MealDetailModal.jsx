"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

import { Modal } from "@/components/common/Modal";

export const MealDetailModal = ({ isOpen, onClose, meal, option }) => {
  if (!meal || !option) return null;

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMacroPercentages = () => {
    const proteinCals = (option.protein || 0) * 4;
    const carbsCals = (option.carbs || 0) * 4;
    const fatCals = (option.fat || 0) * 9;
    const totalCals = proteinCals + carbsCals + fatCals;

    if (totalCals === 0) return { protein: 0, carbs: 0, fat: 0 };

    return {
      protein: Math.round((proteinCals / totalCals) * 100),
      carbs: Math.round((carbsCals / totalCals) * 100),
      fat: Math.round((fatCals / totalCals) * 100),
    };
  };

  const macroPercentages = getMacroPercentages();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <Icon
            icon="mdi:silverware-fork-knife"
            className="w-6 h-6 text-[#FF6B00]"
          />
          <div>
            <span className="text-lg font-semibold">{option.name}</span>
            <p className="text-sm text-zinc-400 font-normal">
              {meal.name} • {formatTime(meal.time)}
            </p>
          </div>
        </div>
      }
      size="large"
      primaryButtonText="Close"
      primaryButtonAction={onClose}
    >
      <div className="space-y-6">
        {/* Hero Image and Basic Info */}
        <div className="relative">
          {option.imageUrl && (
            <div className="w-full h-64 rounded-xl overflow-hidden mb-6">
              <Image
                src={option.imageUrl}
                alt={option.name}
                width={800}
                height={256}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Floating Nutrition Summary */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-4 text-center text-white">
                    <div>
                      <div className="text-2xl font-bold">
                        {option.calories || 0}
                      </div>
                      <div className="text-xs opacity-80">Calories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {option.protein || 0}g
                      </div>
                      <div className="text-xs opacity-80">Protein</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {option.carbs || 0}g
                      </div>
                      <div className="text-xs opacity-80">Carbs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {option.fat || 0}g
                      </div>
                      <div className="text-xs opacity-80">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {option.description && (
          <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/50">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Icon icon="mdi:text" className="w-5 h-5 text-[#FF6B00]" />
              Description
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              {option.description}
            </p>
          </div>
        )}

        {/* Detailed Nutrition Breakdown */}
        <div className="bg-zinc-800/40 rounded-lg p-6 border border-zinc-700/50">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Icon icon="mdi:nutrition" className="w-5 h-5 text-[#FF6B00]" />
            Nutrition Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Macronutrients */}
            <div className="space-y-4">
              <h4 className="text-zinc-300 font-medium">Macronutrients</h4>

              {/* Protein */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Protein</span>
                  <span className="text-white font-semibold">
                    {option.protein || 0}g ({macroPercentages.protein}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${macroPercentages.protein}%` }}
                  ></div>
                </div>
                <p className="text-xs text-zinc-400">
                  {(option.protein || 0) * 4} calories from protein
                </p>
              </div>

              {/* Carbs */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Carbohydrates</span>
                  <span className="text-white font-semibold">
                    {option.carbs || 0}g ({macroPercentages.carbs}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${macroPercentages.carbs}%` }}
                  ></div>
                </div>
                <p className="text-xs text-zinc-400">
                  {(option.carbs || 0) * 4} calories from carbs
                </p>
              </div>

              {/* Fat */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">Fat</span>
                  <span className="text-white font-semibold">
                    {option.fat || 0}g ({macroPercentages.fat}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${macroPercentages.fat}%` }}
                  ></div>
                </div>
                <p className="text-xs text-zinc-400">
                  {(option.fat || 0) * 9} calories from fat
                </p>
              </div>
            </div>

            {/* Macro Distribution Chart */}
            <div className="space-y-4">
              <h4 className="text-zinc-300 font-medium">Distribution</h4>

              <div className="relative w-32 h-32 mx-auto">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth="2"
                  />
                  {/* Protein */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray={`${macroPercentages.protein}, 100`}
                  />
                  {/* Carbs */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray={`${macroPercentages.carbs}, 100`}
                    strokeDashoffset={`-${macroPercentages.protein}`}
                  />
                  {/* Fat */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="2"
                    strokeDasharray={`${macroPercentages.fat}, 100`}
                    strokeDashoffset={`-${
                      macroPercentages.protein + macroPercentages.carbs
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {option.calories || 0}
                    </div>
                    <div className="text-xs text-zinc-400">cal</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-zinc-300">Protein</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-zinc-300">Carbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-zinc-300">Fat</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {option.ingredients && option.ingredients.length > 0 && (
          <div className="bg-zinc-800/40 rounded-lg p-6 border border-zinc-700/50">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon
                icon="mdi:format-list-bulleted"
                className="w-5 h-5 text-[#FF6B00]"
              />
              Ingredients ({option.ingredients.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {option.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-zinc-700/30 rounded-lg"
                >
                  <Icon
                    icon="mdi:circle-small"
                    className="w-4 h-4 text-[#FF6B00]"
                  />
                  <span className="text-zinc-300 text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Facts */}
        <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#FF9A00]/5 rounded-lg p-6 border border-[#FF6B00]/20">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Icon icon="mdi:lightbulb" className="w-5 h-5 text-[#FF6B00]" />
            Quick Facts
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-300 text-sm">
                  Calories per gram:
                </span>
                <span className="text-white font-medium text-sm">
                  {option.calories &&
                  option.protein &&
                  option.carbs &&
                  option.fat
                    ? Math.round(
                        option.calories /
                          (option.protein + option.carbs + option.fat)
                      )
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300 text-sm">Protein ratio:</span>
                <span className="text-white font-medium text-sm">
                  {option.calories
                    ? Math.round(
                        (((option.protein || 0) * 4) / option.calories) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-300 text-sm">Meal timing:</span>
                <span className="text-white font-medium text-sm">
                  {formatTime(meal.time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300 text-sm">Meal type:</span>
                <span className="text-white font-medium text-sm">
                  {meal.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
