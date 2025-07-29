"use client";

import { Icon } from "@iconify/react";

export const NutritionSummary = ({
  dailyNutrition,
  targetNutrition,
  selectedDay,
  currentDay,
  completedMeals,
  totalMeals,
  waterIntake = 0,
  waterGoal = 2.5,
}) => {
  const getProgressPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return (current / target) * 100;
  };

  const getProgressColor = (percentage, nutrient = "default") => {
    // Special handling for calories and fat - exceeding is not good
    if (nutrient === "calories" || nutrient === "fat") {
      if (percentage > 110) return "text-red-500"; // Significantly over target
      if (percentage > 100) return "text-orange-500"; // Slightly over target
      if (percentage >= 90) return "text-green-400"; // Perfect range
      if (percentage >= 70) return "text-[#FF6B00]"; // On track
      if (percentage >= 50) return "text-yellow-400"; // Needs improvement
      return "text-red-400"; // Too low
    }

    // For protein and carbs - exceeding is generally okay
    if (nutrient === "protein" || nutrient === "carbs") {
      if (percentage > 130) return "text-orange-400"; // Way too much
      if (percentage > 110) return "text-blue-400"; // Over but okay
      if (percentage >= 90) return "text-green-400"; // Perfect
      if (percentage >= 70) return "text-[#FF6B00]"; // Good progress
      if (percentage >= 50) return "text-yellow-400"; // Needs more
      return "text-red-400"; // Too low
    }

    // For water - more is generally better
    if (nutrient === "water") {
      if (percentage >= 100) return "text-green-400"; // Goal met or exceeded
      if (percentage >= 80) return "text-blue-400"; // Close to goal
      if (percentage >= 60) return "text-[#FF6B00]"; // Good progress
      if (percentage >= 40) return "text-yellow-400"; // Needs more
      return "text-red-400"; // Too low
    }

    // Default behavior
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-[#FF6B00]";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressBarColor = (percentage, nutrient = "default") => {
    // Special handling for calories and fat
    if (nutrient === "calories" || nutrient === "fat") {
      if (percentage > 110) return "from-red-500 to-red-400"; // Over limit
      if (percentage > 100) return "from-orange-500 to-orange-400"; // Slightly over
      if (percentage >= 90) return "from-green-500 to-green-400"; // Perfect
      if (percentage >= 70) return "from-[#FF6B00] to-[#FF9A00]"; // On track
      if (percentage >= 50) return "from-yellow-500 to-yellow-400"; // Needs improvement
      return "from-red-500 to-red-400"; // Too low
    }

    // For protein and carbs
    if (nutrient === "protein" || nutrient === "carbs") {
      if (percentage > 130) return "from-orange-500 to-orange-400"; // Too much
      if (percentage > 110) return "from-blue-500 to-blue-400"; // Over but okay
      if (percentage >= 90) return "from-green-500 to-green-400"; // Perfect
      if (percentage >= 70) return "from-[#FF6B00] to-[#FF9A00]"; // Good
      if (percentage >= 50) return "from-yellow-500 to-yellow-400"; // Needs more
      return "from-red-500 to-red-400"; // Too low
    }

    // For water
    if (nutrient === "water") {
      if (percentage >= 100) return "from-green-500 to-green-400"; // Goal met
      if (percentage >= 80) return "from-blue-500 to-blue-400"; // Close to goal
      if (percentage >= 60) return "from-[#FF6B00] to-[#FF9A00]"; // Good progress
      if (percentage >= 40) return "from-yellow-500 to-yellow-400"; // Needs more
      return "from-red-500 to-red-400"; // Too low
    }

    // Default
    if (percentage >= 90) return "from-green-500 to-green-400";
    if (percentage >= 70) return "from-[#FF6B00] to-[#FF9A00]";
    if (percentage >= 50) return "from-yellow-500 to-yellow-400";
    return "from-red-500 to-red-400";
  };

  const getStatusMessage = (percentage, nutrient, label) => {
    // Don't show messages if intake is below 50% of target
    if (percentage < 50) {
      return null;
    }

    if (nutrient === "calories") {
      if (percentage > 120)
        return {
          icon: "mdi:alert-circle",
          message: `Significantly exceeded ${label.toLowerCase()} target`,
          color: "text-red-500",
        };
      if (percentage > 105)
        return {
          icon: "mdi:alert",
          message: `Slightly over ${label.toLowerCase()} target`,
          color: "text-orange-500",
        };
      if (percentage >= 95)
        return {
          icon: "mdi:check-circle",
          message: `Excellent ${label.toLowerCase()} intake`,
          color: "text-green-400",
        };
      if (percentage >= 80)
        return {
          icon: "mdi:trending-up",
          message: `On track with ${label.toLowerCase()}`,
          color: "text-[#FF6B00]",
        };
      if (percentage >= 50)
        return {
          icon: "mdi:chart-line-variant",
          message: `Halfway to ${label.toLowerCase()} goal`,
          color: "text-yellow-400",
        };
    }

    if (nutrient === "fat") {
      if (percentage > 120)
        return {
          icon: "mdi:alert-circle",
          message: "Too much fat consumed",
          color: "text-red-500",
        };
      if (percentage > 105)
        return {
          icon: "mdi:alert",
          message: "Slightly over fat target",
          color: "text-orange-500",
        };
      if (percentage >= 95)
        return {
          icon: "mdi:check-circle",
          message: "Optimal fat intake",
          color: "text-green-400",
        };
      if (percentage >= 50)
        return {
          icon: "mdi:chart-line-variant",
          message: "Good progress on healthy fats",
          color: "text-yellow-400",
        };
    }

    if (nutrient === "protein") {
      if (percentage > 140)
        return {
          icon: "mdi:information",
          message: "Very high protein intake",
          color: "text-orange-400",
        };
      if (percentage > 110)
        return {
          icon: "mdi:muscle",
          message: "Excellent protein for muscle building!",
          color: "text-blue-400",
        };
      if (percentage >= 95)
        return {
          icon: "mdi:check-circle",
          message: "Perfect protein intake",
          color: "text-green-400",
        };
      if (percentage >= 80)
        return {
          icon: "mdi:trending-up",
          message: "Great protein progress",
          color: "text-[#FF6B00]",
        };
      if (percentage >= 50)
        return {
          icon: "mdi:food-steak",
          message: "Halfway to protein goal",
          color: "text-yellow-400",
        };
    }

    if (nutrient === "carbs") {
      if (percentage > 130)
        return {
          icon: "mdi:information",
          message: "High carbohydrate intake",
          color: "text-orange-400",
        };
      if (percentage > 110)
        return {
          icon: "mdi:lightning-bolt",
          message: "Great energy levels!",
          color: "text-blue-400",
        };
      if (percentage >= 95)
        return {
          icon: "mdi:check-circle",
          message: "Excellent carb intake",
          color: "text-green-400",
        };
      if (percentage >= 80)
        return {
          icon: "mdi:trending-up",
          message: "Good energy balance",
          color: "text-[#FF6B00]",
        };
      if (percentage >= 50)
        return {
          icon: "mdi:fruit-grapes",
          message: "Halfway to carb goal",
          color: "text-yellow-400",
        };
    }

    return null;
  };

  const nutritionItems = [
    {
      label: "Calories",
      current: dailyNutrition.calories,
      target: targetNutrition?.calories || 2000,
      unit: "kcal",
      icon: "mdi:fire",
      nutrient: "calories",
    },
    {
      label: "Protein",
      current: dailyNutrition.protein,
      target: targetNutrition?.protein || 150,
      unit: "g",
      icon: "mdi:dumbbell",
      nutrient: "protein",
    },
    {
      label: "Carbs",
      current: dailyNutrition.carbs,
      target: targetNutrition?.carbs || 200,
      unit: "g",
      icon: "mdi:grain",
      nutrient: "carbs",
    },
    {
      label: "Fat",
      current: dailyNutrition.fat,
      target: targetNutrition?.fats || targetNutrition?.fat || 80,
      unit: "g",
      icon: "mdi:oil",
      nutrient: "fat",
    },
    {
      label: "Water",
      current: waterIntake,
      target: waterGoal,
      unit: "L",
      icon: "mdi:water",
      nutrient: "water",
    },
  ];

  const mealCompletion =
    totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Day Status */}
      <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">
            Day {selectedDay}
          </h3>
          <div
            className={`px-2 py-1 rounded text-xs font-medium ${
              selectedDay === currentDay
                ? "bg-[#FF6B00]/20 text-[#FF6B00]"
                : selectedDay < currentDay
                ? "bg-green-500/20 text-green-400"
                : "bg-zinc-600/20 text-zinc-400"
            }`}
          >
            {selectedDay === currentDay
              ? "Current"
              : selectedDay < currentDay
              ? "Past"
              : "Upcoming"}
          </div>
        </div>

        {/* Meal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-300">Meals Completed</span>
            <span className="text-[#FF6B00] font-medium">
              {completedMeals}/{totalMeals}
            </span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] h-2 rounded-full transition-all duration-500"
              style={{ width: `${mealCompletion}%` }}
            ></div>
          </div>
          <p className="text-xs text-zinc-400">
            {Math.round(mealCompletion)}% of today's meals completed
          </p>
        </div>
      </div>

      {/* Nutrition Breakdown */}
      <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Nutrition Summary
        </h3>

        <div className="space-y-4">
          {nutritionItems.map((item) => {
            const percentage = getProgressPercentage(item.current, item.target);
            const progressColor = getProgressColor(percentage, item.nutrient);
            const barColor = getProgressBarColor(percentage, item.nutrient);
            const statusMessage = getStatusMessage(
              percentage,
              item.nutrient,
              item.label
            );
            const displayPercentage = Math.min(percentage, 150); // Cap visual bar at 150%

            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={item.icon}
                      className={`w-4 h-4 ${progressColor}`}
                    />
                    <span className="text-white text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${progressColor}`}>
                      {Math.round(item.current)}/{item.target} {item.unit}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {Math.round(percentage)}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-zinc-700 rounded-full h-2 relative overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${barColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${displayPercentage}%` }}
                  ></div>
                  {/* Overflow indicator */}
                  {percentage > 100 && (
                    <div className="absolute top-0 left-full w-1 h-2 bg-white/30 -translate-x-1"></div>
                  )}
                </div>

                {/* Status message */}
                {statusMessage && (
                  <div
                    className={`flex items-center gap-1 text-xs ${statusMessage.color} font-medium`}
                  >
                    <Icon icon={statusMessage.icon} className="w-3 h-3" />
                    <span>{statusMessage.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Insights */}
      <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Daily Insights
        </h3>

        <div className="space-y-3">
          {/* Calorie Status */}
          {(() => {
            const caloriePercentage = getProgressPercentage(
              dailyNutrition.calories,
              targetNutrition?.calories || 2000
            );

            let insight = {
              icon: "mdi:information",
              color: "text-blue-400",
              message: "Track your meals to see insights",
            };

            if (caloriePercentage > 110) {
              insight = {
                icon: "mdi:alert",
                color: "text-red-400",
                message: "You've exceeded your daily calorie target",
              };
            } else if (caloriePercentage >= 90) {
              insight = {
                icon: "mdi:check-circle",
                color: "text-green-400",
                message: "Great job! You're meeting your calorie goals",
              };
            } else if (caloriePercentage >= 50) {
              insight = {
                icon: "mdi:trending-up",
                color: "text-[#FF6B00]",
                message: "You're on track to meet your daily goals",
              };
            } else if (caloriePercentage > 0) {
              insight = {
                icon: "mdi:clock-alert",
                color: "text-yellow-400",
                message: "Remember to log all your meals today",
              };
            }

            return (
              <div className="flex items-start gap-3">
                <Icon
                  icon={insight.icon}
                  className={`w-5 h-5 ${insight.color} mt-0.5`}
                />
                <p className="text-zinc-300 text-sm">{insight.message}</p>
              </div>
            );
          })()}

          {/* Protein Focus */}
          {(() => {
            const proteinPercentage = getProgressPercentage(
              dailyNutrition.protein,
              targetNutrition?.protein || 150
            );

            if (proteinPercentage >= 80) {
              return (
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:dumbbell"
                    className="w-5 h-5 text-green-400 mt-0.5"
                  />
                  <p className="text-zinc-300 text-sm">
                    Excellent protein intake for muscle building!
                  </p>
                </div>
              );
            } else if (proteinPercentage >= 50) {
              return (
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:dumbbell"
                    className="w-5 h-5 text-[#FF6B00] mt-0.5"
                  />
                  <p className="text-zinc-300 text-sm">
                    Consider adding more protein-rich foods to your remaining
                    meals.
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {/* Hydration Status */}
          {(() => {
            const hydrationPercentage = getProgressPercentage(waterIntake, waterGoal);
            
            let hydrationInsight = {
              icon: "mdi:water",
              color: "text-blue-400",
              message: "Don't forget to stay hydrated throughout the day!",
            };

            if (hydrationPercentage >= 100) {
              hydrationInsight = {
                icon: "mdi:check-circle",
                color: "text-green-400",
                message: `Excellent! You've reached your daily water goal of ${waterGoal}L.`,
              };
            } else if (hydrationPercentage >= 80) {
              hydrationInsight = {
                icon: "mdi:water-check",
                color: "text-blue-400",
                message: `Great hydration! You're at ${waterIntake.toFixed(1)}L of your ${waterGoal}L goal.`,
              };
            } else if (hydrationPercentage >= 50) {
              hydrationInsight = {
                icon: "mdi:water",
                color: "text-[#FF6B00]",
                message: `Good start! You've had ${waterIntake.toFixed(1)}L of water today.`,
              };
            } else if (waterIntake > 0) {
              hydrationInsight = {
                icon: "mdi:water-alert",
                color: "text-yellow-400",
                message: `Remember to drink more water - you're at ${waterIntake.toFixed(1)}L of ${waterGoal}L.`,
              };
            } else {
              hydrationInsight = {
                icon: "mdi:water-off",
                color: "text-red-400",
                message: `Start your hydration! Aim for ${waterGoal}L of water today.`,
              };
            }

            return (
              <div className="flex items-start gap-3">
                <Icon
                  icon={hydrationInsight.icon}
                  className={`w-5 h-5 ${hydrationInsight.color} mt-0.5`}
                />
                <p className="text-zinc-300 text-sm">{hydrationInsight.message}</p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
