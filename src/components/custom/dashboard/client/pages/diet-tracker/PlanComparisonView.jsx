"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

export const PlanComparisonView = ({ 
  assignedPlan, 
  actualIntake, 
  dayData,
  onLogAlternative,
  onUpdatePortion 
}) => {
  const [expandedMeal, setExpandedMeal] = useState(null);

  if (!assignedPlan || !dayData) {
    return null;
  }

  const plannedMeals = dayData.meals || [];
  const actualMeals = actualIntake.mealLogs || [];

  const getMealComparison = (plannedMeal, mealIndex) => {
    const actualMeal = actualMeals.find(
      (meal) => meal.mealName.toLowerCase() === plannedMeal.name.toLowerCase()
    );

    const planned = plannedMeal.options?.[0] || {};
    const actual = actualMeal ? {
      calories: actualMeal.calories || 0,
      protein: actualMeal.protein || 0,
      carbs: actualMeal.carbs || 0,
      fat: actualMeal.fat || 0,
      isCompleted: actualMeal.isCompleted,
      isAlternative: actualMeal.isAlternative,
      portionMultiplier: actualMeal.portionMultiplier || 1,
      id: actualMeal.id,
    } : null;

    return { planned, actual, plannedMeal, actualMeal };
  };

  const calculateVariance = (actual, planned) => {
    if (!planned || planned === 0) return 0;
    return ((actual - planned) / planned * 100);
  };

  const getVarianceColor = (variance) => {
    if (Math.abs(variance) <= 10) return "text-green-400";
    if (Math.abs(variance) <= 25) return "text-yellow-400";
    return "text-red-400";
  };

  const getVarianceIcon = (variance) => {
    if (Math.abs(variance) <= 10) return "mdi:check-circle";
    if (variance > 0) return "mdi:trending-up";
    return "mdi:trending-down";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-700/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon icon="mdi:compare" className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">Plan vs Actual Intake</h2>
        </div>
        <p className="text-zinc-300 text-sm">
          Compare your assigned nutrition plan with your actual food intake. 
          Green indicates you're on track, yellow shows minor variances, and red indicates significant differences.
        </p>
      </div>

      {/* Meal by Meal Comparison */}
      <div className="space-y-4">
        {plannedMeals.map((plannedMeal, index) => {
          const { planned, actual, actualMeal } = getMealComparison(plannedMeal, index);
          const isExpanded = expandedMeal === index;
          
          return (
            <div
              key={index}
              className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl overflow-hidden"
            >
              {/* Meal Header */}
              <div
                className="p-4 cursor-pointer hover:bg-zinc-700/20 transition-colors"
                onClick={() => setExpandedMeal(isExpanded ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon 
                      icon={plannedMeal.name === "Breakfast" ? "mdi:coffee" :
                            plannedMeal.name === "Lunch" ? "mdi:food" :
                            plannedMeal.name === "Dinner" ? "mdi:silverware-fork-knife" :
                            "mdi:cookie"} 
                      className="w-5 h-5 text-indigo-400" 
                    />
                    <h3 className="text-lg font-medium text-white">
                      {plannedMeal.name}
                    </h3>
                    <span className="text-sm text-zinc-400">
                      {plannedMeal.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    {actual ? (
                      <div className="flex items-center gap-2">
                        {actual.isAlternative && (
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium">
                            Alternative
                          </span>
                        )}
                        {actual.portionMultiplier !== 1 && (
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                            {actual.portionMultiplier}x portion
                          </span>
                        )}
                        <Icon 
                          icon={actual.isCompleted ? "mdi:check-circle" : "mdi:clock"} 
                          className={`w-5 h-5 ${
                            actual.isCompleted ? "text-green-400" : "text-yellow-400"
                          }`} 
                        />
                      </div>
                    ) : (
                      <Icon icon="mdi:circle-outline" className="w-5 h-5 text-zinc-500" />
                    )}
                    
                    <Icon 
                      icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
                      className="w-5 h-5 text-zinc-400" 
                    />
                  </div>
                </div>

                {/* Quick Nutrition Comparison */}
                {actual && (
                  <div className="mt-3 grid grid-cols-4 gap-4">
                    {[
                      { label: "Cal", planned: planned.calories, actual: actual.calories, unit: "" },
                      { label: "Protein", planned: planned.protein, actual: actual.protein, unit: "g" },
                      { label: "Carbs", planned: planned.carbs, actual: actual.carbs, unit: "g" },
                      { label: "Fat", planned: planned.fat, actual: actual.fat, unit: "g" },
                    ].map((nutrient) => {
                      const variance = calculateVariance(nutrient.actual, nutrient.planned);
                      const color = getVarianceColor(variance);
                      
                      return (
                        <div key={nutrient.label} className="text-center">
                          <div className={`text-sm font-medium ${color}`}>
                            {Math.round(nutrient.actual)}{nutrient.unit}
                          </div>
                          <div className="text-xs text-zinc-400">
                            vs {Math.round(nutrient.planned)}{nutrient.unit}
                          </div>
                          {variance !== 0 && (
                            <div className={`text-xs ${color}`}>
                              {variance > 0 ? "+" : ""}{Math.round(variance)}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-zinc-700/50 p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Planned Meal */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                        <Icon icon="mdi:target" className="w-4 h-4" />
                        Planned Meal
                      </h4>
                      <div className="bg-zinc-900/50 rounded-lg p-3">
                        <div className="text-sm font-medium text-white mb-2">
                          {planned.name || `${plannedMeal.name} Option`}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-zinc-400">Calories: <span className="text-white">{planned.calories || 0}</span></div>
                          <div className="text-zinc-400">Protein: <span className="text-white">{planned.protein || 0}g</span></div>
                          <div className="text-zinc-400">Carbs: <span className="text-white">{planned.carbs || 0}g</span></div>
                          <div className="text-zinc-400">Fat: <span className="text-white">{planned.fat || 0}g</span></div>
                        </div>
                        {planned.ingredients && (
                          <div className="mt-2 text-xs text-zinc-400">
                            <strong>Ingredients:</strong> {planned.ingredients}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actual Meal */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                        <Icon icon="mdi:food" className="w-4 h-4" />
                        Actual Intake
                      </h4>
                      {actual ? (
                        <div className="bg-zinc-900/50 rounded-lg p-3">
                          <div className="text-sm font-medium text-white mb-2">
                            {actual.isAlternative ? "Alternative Meal" : "Planned Meal"} 
                            {actual.portionMultiplier !== 1 && (
                              <span className="ml-2 text-blue-300">({actual.portionMultiplier}x)</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-zinc-400">Calories: <span className="text-white">{Math.round(actual.calories)}</span></div>
                            <div className="text-zinc-400">Protein: <span className="text-white">{Math.round(actual.protein)}g</span></div>
                            <div className="text-zinc-400">Carbs: <span className="text-white">{Math.round(actual.carbs)}g</span></div>
                            <div className="text-zinc-400">Fat: <span className="text-white">{Math.round(actual.fat)}g</span></div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
                          <Icon icon="mdi:food-off" className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                          <div className="text-sm text-zinc-400">No intake logged</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-3 border-t border-zinc-700/50">
                    {actual ? (
                      <>
                        <button
                          onClick={() => onUpdatePortion && onUpdatePortion(actual.id, plannedMeal.name)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors text-sm"
                        >
                          <Icon icon="mdi:scale" className="w-4 h-4" />
                          Adjust Portion
                        </button>
                        <button
                          onClick={() => onLogAlternative && onLogAlternative(actual.id, plannedMeal.name)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-colors text-sm"
                        >
                          <Icon icon="mdi:swap-horizontal" className="w-4 h-4" />
                          Log Alternative
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onLogAlternative && onLogAlternative(null, plannedMeal.name)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 transition-colors text-sm"
                      >
                        <Icon icon="mdi:plus" className="w-4 h-4" />
                        Log Meal
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-zinc-800/40 to-zinc-700/20 border border-zinc-700/50 rounded-xl p-4">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
          <Icon icon="mdi:chart-line" className="w-5 h-5 text-indigo-400" />
          Daily Summary
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          {[
            { 
              label: "Calories", 
              planned: plannedMeals.reduce((sum, meal) => sum + (meal.options?.[0]?.calories || 0), 0),
              actual: actualMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
            },
            { 
              label: "Protein", 
              planned: plannedMeals.reduce((sum, meal) => sum + (meal.options?.[0]?.protein || 0), 0),
              actual: actualMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
            },
            { 
              label: "Carbs", 
              planned: plannedMeals.reduce((sum, meal) => sum + (meal.options?.[0]?.carbs || 0), 0),
              actual: actualMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0)
            },
            { 
              label: "Fat", 
              planned: plannedMeals.reduce((sum, meal) => sum + (meal.options?.[0]?.fat || 0), 0),
              actual: actualMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0)
            },
          ].map((nutrient) => {
            const variance = calculateVariance(nutrient.actual, nutrient.planned);
            const color = getVarianceColor(variance);
            const icon = getVarianceIcon(variance);
            
            return (
              <div key={nutrient.label} className="text-center space-y-1">
                <div className="text-sm font-medium text-zinc-300">{nutrient.label}</div>
                <div className={`text-lg font-semibold ${color} flex items-center justify-center gap-1`}>
                  <Icon icon={icon} className="w-4 h-4" />
                  {Math.round(nutrient.actual)}
                </div>
                <div className="text-xs text-zinc-400">
                  vs {Math.round(nutrient.planned)} planned
                </div>
                {variance !== 0 && (
                  <div className={`text-xs ${color}`}>
                    {variance > 0 ? "+" : ""}{Math.round(variance)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};