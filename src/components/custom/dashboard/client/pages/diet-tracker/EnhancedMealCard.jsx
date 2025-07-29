"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

export const EnhancedMealCard = ({
  meal,
  mealName,
  mealTime,
  isCustomTracking = false,
  onAddCustomMeal,
  onLogAlternative,
  onUpdatePortion,
  onCompleteMeal,
  isCompleted,
  canEdit = true,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getMealIcon = (name) => {
    const mealName = name.toLowerCase();
    if (mealName.includes("breakfast")) return "mdi:coffee";
    if (mealName.includes("lunch")) return "mdi:food";
    if (mealName.includes("dinner")) return "mdi:silverware-fork-knife";
    return "mdi:cookie";
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderNutritionBadge = (value, unit, label, color = "zinc") => (
    <div className="flex flex-col items-center">
      <span className={`text-sm font-semibold text-${color}-300`}>
        {Math.round(value || 0)}{unit}
      </span>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );

  // Custom tracking mode - show add meal interface
  if (isCustomTracking) {
    return (
      <div className="bg-gradient-to-r from-zinc-800/40 to-zinc-700/20 border-2 border-dashed border-zinc-600/50 hover:border-[#FF6B00]/50 rounded-xl p-6 transition-all duration-200 group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon 
              icon={getMealIcon(mealName)} 
              className="w-6 h-6 text-zinc-400 group-hover:text-[#FF6B00] transition-colors" 
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{mealName}</h3>
              <p className="text-sm text-zinc-400">{formatTime(mealTime)}</p>
            </div>
          </div>
          <button
            onClick={() => onAddCustomMeal && onAddCustomMeal(mealName, mealTime)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] hover:text-[#FF8B20] transition-all duration-200 group-hover:scale-105"
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Add Meal
          </button>
        </div>
        
        <div className="text-center py-4 border-t border-zinc-700/50">
          <Icon icon="mdi:food-plus" className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">Click "Add Meal" to log what you ate</p>
        </div>
      </div>
    );
  }

  // Regular meal card with meal data
  if (!meal) {
    return (
      <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon icon={getMealIcon(mealName)} className="w-6 h-6 text-zinc-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">{mealName}</h3>
            <p className="text-sm text-zinc-400">{formatTime(mealTime)}</p>
          </div>
        </div>
        <div className="text-center py-4">
          <Icon icon="mdi:food-off" className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No meal data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-zinc-800/40 border rounded-xl p-6 transition-all duration-300 ${
        isCompleted 
          ? "border-green-500/30 bg-green-900/10" 
          : "border-zinc-700/50 hover:border-zinc-600/50"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Meal Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon 
            icon={getMealIcon(mealName)} 
            className={`w-6 h-6 ${
              isCompleted ? "text-green-400" : "text-zinc-400"
            }`} 
          />
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {mealName}
              {meal.isAlternative && (
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium">
                  Alternative
                </span>
              )}
              {meal.portionMultiplier && meal.portionMultiplier !== 1 && (
                <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                  {meal.portionMultiplier}x
                </span>
              )}
            </h3>
            <p className="text-sm text-zinc-400">{formatTime(mealTime)}</p>
          </div>
        </div>

        {/* Completion Status */}
        <div className="flex items-center gap-2">
          {canEdit && (showActions || isCompleted) && (
            <button
              onClick={() => onCompleteMeal && onCompleteMeal(!isCompleted)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isCompleted
                  ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                  : "bg-zinc-600/20 text-zinc-400 hover:bg-[#FF6B00]/20 hover:text-[#FF6B00]"
              }`}
            >
              <Icon 
                icon={isCompleted ? "mdi:check-circle" : "mdi:circle-outline"} 
                className="w-5 h-5" 
              />
            </button>
          )}
          
          {!canEdit && isCompleted && (
            <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400" />
          )}
        </div>
      </div>

      {/* Meal Details */}
      <div className="space-y-4">
        {/* Meal Name */}
        {meal.selectedOption?.name && (
          <div className="bg-zinc-900/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-white mb-1">
              {meal.selectedOption.name}
            </h4>
            {meal.selectedOption.description && (
              <p className="text-xs text-zinc-400">{meal.selectedOption.description}</p>
            )}
          </div>
        )}

        {/* Nutrition Info */}
        <div className="grid grid-cols-4 gap-4">
          {renderNutritionBadge(meal.calories, "", "Cal", "orange")}
          {renderNutritionBadge(meal.protein, "g", "Protein", "blue")}
          {renderNutritionBadge(meal.carbs, "g", "Carbs", "green")}
          {renderNutritionBadge(meal.fat, "g", "Fat", "yellow")}
        </div>

        {/* Ingredients */}
        {meal.selectedOption?.ingredients && (
          <div className="text-xs text-zinc-400">
            <strong>Ingredients:</strong> {meal.selectedOption.ingredients}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {canEdit && (showActions || isCompleted) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-700/50">
          {meal.portionMultiplier !== undefined && onUpdatePortion && (
            <button
              onClick={() => onUpdatePortion(meal.id)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors text-sm"
            >
              <Icon icon="mdi:scale" className="w-4 h-4" />
              Portion
            </button>
          )}
          
          {onLogAlternative && (
            <button
              onClick={() => onLogAlternative(meal.id)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-colors text-sm"
            >
              <Icon icon="mdi:swap-horizontal" className="w-4 h-4" />
              Alternative
            </button>
          )}
          
          {meal.isCustom && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-600/20 text-amber-300 rounded text-xs">
              <Icon icon="mdi:pencil" className="w-3 h-3" />
              Custom
            </div>
          )}
        </div>
      )}

      {/* Completion Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500/10 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};