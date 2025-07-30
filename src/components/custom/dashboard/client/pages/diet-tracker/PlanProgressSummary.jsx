"use client";

import { Icon } from "@iconify/react";

import { Card } from "@/components/common/Card";

export const PlanProgressSummary = ({ progress, assignment, isCompleted }) => {
  if (!progress) return null;

  const {
    totalDays,
    completedDays,
    successRate,
    averageCaloriesPerDay,
    averageProteinPerDay,
    averageCompletionRate,
    consistencyScore,
    adherenceScore,
    overallSuccess,
    calorieAccuracy,
    proteinAccuracy,
  } = progress;

  const remainingDays = Math.max(0, totalDays - completedDays);
  const nutritionPlan = assignment?.nutritionPlan;
  const targetCalories = nutritionPlan?.nutritionInfo?.calories || 0;
  const targetProtein = nutritionPlan?.nutritionInfo?.protein || 0;

  // Determine status and styling
  const getStatusConfig = () => {
    if (isCompleted) {
      if (overallSuccess) {
        return {
          status: "Completed Successfully",
          icon: "mdi:trophy",
          bgColor: "bg-green-900/30",
          textColor: "text-green-400",
          borderColor: "border-green-700/50",
        };
      } else {
        return {
          status: "Plan Completed",
          icon: "mdi:flag-checkered",
          bgColor: "bg-blue-900/30",
          textColor: "text-blue-400",
          borderColor: "border-blue-700/50",
        };
      }
    } else {
      return {
        status: "In Progress",
        icon: "mdi:trending-up",
        bgColor: "bg-orange-900/30",
        textColor: "text-orange-400",
        borderColor: "border-orange-700/50",
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
          <Icon icon={statusConfig.icon} className="w-6 h-6" />
          <span className="font-semibold text-lg">{statusConfig.status}</span>
        </div>
      </div>

      {/* Progress Overview */}
      <Card variant="darkGlass" className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Days Progress */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgb(64, 64, 64)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeDasharray={`${successRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{Math.round(successRate)}%</span>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Days Progress</h3>
            <p className="text-zinc-400 text-sm">
              {completedDays} of {totalDays} days completed
            </p>
          </div>

          {/* Meal Completion */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgb(64, 64, 64)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray={`${averageCompletionRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{Math.round(averageCompletionRate)}%</span>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Meal Completion</h3>
            <p className="text-zinc-400 text-sm">Average daily completion</p>
          </div>

          {/* Adherence Score */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgb(64, 64, 64)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray={`${adherenceScore}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{Math.round(adherenceScore)}%</span>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-1">Adherence</h3>
            <p className="text-zinc-400 text-sm">Target adherence score</p>
          </div>
        </div>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Nutrition Analytics */}
        <Card variant="darkGlass" className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Icon icon="mdi:nutrition" className="w-5 h-5 text-[#FF6B00]" />
            Nutrition Performance
          </h3>
          
          <div className="space-y-4">
            {/* Calories */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-300">Daily Calories</span>
                <span className="text-white font-medium">
                  {Math.round(averageCaloriesPerDay)} / {targetCalories} kcal
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-[#FF6B00] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (averageCaloriesPerDay / targetCalories) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-zinc-500">Accuracy</span>
                <span className="text-xs text-zinc-400">{Math.round(calorieAccuracy)}%</span>
              </div>
            </div>

            {/* Protein */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-300">Daily Protein</span>
                <span className="text-white font-medium">
                  {Math.round(averageProteinPerDay)} / {targetProtein}g
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (averageProteinPerDay / targetProtein) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-zinc-500">Accuracy</span>
                <span className="text-xs text-zinc-400">{Math.round(proteinAccuracy)}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card variant="darkGlass" className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Icon icon="mdi:chart-line" className="w-5 h-5 text-[#FF6B00]" />
            Performance Metrics
          </h3>

          <div className="space-y-4">
            {/* Consistency Score */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:target" className="w-4 h-4 text-blue-400" />
                <span className="text-zinc-300">Consistency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${consistencyScore}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-12">{Math.round(consistencyScore)}%</span>
              </div>
            </div>

            {/* Days Remaining */}
            {!isCompleted && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-orange-400" />
                  <span className="text-zinc-300">Days Remaining</span>
                </div>
                <span className="text-white font-medium">{remainingDays} days</span>
              </div>
            )}

            {/* Overall Success Status */}
            <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
              <div className="flex items-center gap-2">
                <Icon 
                  icon={overallSuccess ? "mdi:check-circle" : "mdi:clock-outline"} 
                  className={`w-4 h-4 ${overallSuccess ? "text-green-400" : "text-yellow-400"}`} 
                />
                <span className="text-zinc-300">Success Status</span>
              </div>
              <span className={`font-medium ${overallSuccess ? "text-green-400" : "text-yellow-400"}`}>
                {overallSuccess ? "On Track" : "Needs Improvement"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Motivational Message */}
      {!isCompleted && (
        <Card variant="darkGlass" className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:lightning-bolt" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">
              {overallSuccess ? "You're Doing Great! 🎉" : "Keep Pushing Forward! 💪"}
            </h3>
            <p className="text-zinc-300 max-w-md mx-auto">
              {overallSuccess 
                ? "Your consistency and dedication are paying off. Keep up the excellent work!"
                : "Every meal completed is a step closer to your goals. Stay focused and consistent!"
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};