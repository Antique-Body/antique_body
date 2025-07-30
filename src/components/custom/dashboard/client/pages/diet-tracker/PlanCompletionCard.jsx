"use client";

import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export const PlanCompletionCard = ({ assignment, progress, onViewHistory }) => {
  if (!assignment || !progress) return null;

  const {
    successRate,
    averageCompletionRate,
    totalDays,
    completedDays,
    // overallSuccess, // Currently unused in display
    adherenceScore,
    consistencyScore,
    averageCaloriesPerDay,
    averageProteinPerDay,
  } = progress;

  const nutritionPlan = assignment.nutritionPlan;
  const trainerName =
    assignment.assignedBy?.trainerProfile?.firstName || "Your trainer";
  const completionDate = new Date(
    assignment.completedDate
  ).toLocaleDateString();
  const planDuration = Math.ceil(
    (new Date(assignment.actualEndDate) -
      new Date(assignment.actualStartDate)) /
      (1000 * 60 * 60 * 24)
  );

  // Determine completion level
  const getCompletionLevel = () => {
    if (successRate >= 90) return "exceptional";
    if (successRate >= 80) return "excellent";
    if (successRate >= 70) return "good";
    if (successRate >= 60) return "decent";
    return "completed";
  };

  const completionLevel = getCompletionLevel();

  const levelConfig = {
    exceptional: {
      title: "🏆 Exceptional Achievement!",
      subtitle: "You've exceeded all expectations",
      bgGradient: "from-yellow-500/20 to-amber-500/20",
      iconColor: "text-yellow-400",
      icon: "mdi:trophy",
    },
    excellent: {
      title: "🌟 Excellent Work!",
      subtitle: "Outstanding commitment to your goals",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
      icon: "mdi:star",
    },
    good: {
      title: "👏 Great Job!",
      subtitle: "You've shown real dedication",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      icon: "mdi:thumb-up",
    },
    decent: {
      title: "💪 Well Done!",
      subtitle: "You completed your nutrition journey",
      bgGradient: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-400",
      icon: "mdi:check-circle",
    },
    completed: {
      title: "✅ Plan Completed",
      subtitle: "Every step forward counts",
      bgGradient: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-400",
      icon: "mdi:flag-checkered",
    },
  };

  const config = levelConfig[completionLevel];

  // Generate achievements based on performance
  const achievements = [];

  if (successRate >= 90)
    achievements.push({
      icon: "mdi:trophy",
      text: "Perfect Performer",
      color: "text-yellow-400",
    });
  if (consistencyScore >= 85)
    achievements.push({
      icon: "mdi:target",
      text: "Consistency Master",
      color: "text-blue-400",
    });
  if (averageCompletionRate >= 95)
    achievements.push({
      icon: "mdi:check-all",
      text: "Meal Completion Pro",
      color: "text-green-400",
    });
  if (adherenceScore >= 80)
    achievements.push({
      icon: "mdi:bullseye-arrow",
      text: "Target Achiever",
      color: "text-purple-400",
    });
  if (planDuration <= totalDays)
    achievements.push({
      icon: "mdi:rocket-launch",
      text: "On-Time Finisher",
      color: "text-orange-400",
    });

  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <Card variant="darkGlass" className="overflow-hidden">
        <div className={`relative bg-gradient-to-r ${config.bgGradient} p-8`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                icon={config.icon}
                className={`w-10 h-10 ${config.iconColor}`}
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {config.title}
            </h1>
            <p className="text-xl text-zinc-200 mb-4">{config.subtitle}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <Icon icon="mdi:calendar-check" className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                Completed on {completionDate}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Plan Summary */}
      <Card variant="darkGlass" className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center">
            <Icon icon="mdi:nutrition" className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {nutritionPlan.title}
            </h2>
            <p className="text-zinc-300">Assigned by {trainerName}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <div className="text-2xl font-bold text-[#FF6B00] mb-1">
              {totalDays}
            </div>
            <div className="text-sm text-zinc-400">Total Days</div>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {completedDays}
            </div>
            <div className="text-sm text-zinc-400">Days Completed</div>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {Math.round(successRate)}%
            </div>
            <div className="text-sm text-zinc-400">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {planDuration}
            </div>
            <div className="text-sm text-zinc-400">Days Active</div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card variant="darkGlass" className="p-6">
          <h3 className="text-white font-semibold text-xl mb-4 flex items-center gap-2">
            <Icon icon="mdi:medal" className="w-6 h-6 text-yellow-400" />
            Your Achievements
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg"
              >
                <Icon
                  icon={achievement.icon}
                  className={`w-6 h-6 ${achievement.color}`}
                />
                <span className="text-white font-medium">
                  {achievement.text}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Final Stats */}
      <Card variant="darkGlass" className="p-6">
        <h3 className="text-white font-semibold text-xl mb-4 flex items-center gap-2">
          <Icon icon="mdi:chart-bar" className="w-6 h-6 text-[#FF6B00]" />
          Final Performance Report
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-300">Average Daily Completion</span>
                <span className="text-white font-bold">
                  {Math.round(averageCompletionRate)}%
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${averageCompletionRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-300">Consistency Score</span>
                <span className="text-white font-bold">
                  {Math.round(consistencyScore)}%
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${consistencyScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-300">Target Adherence</span>
                <span className="text-white font-bold">
                  {Math.round(adherenceScore)}%
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${adherenceScore}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Average Daily Nutrition</span>
              <div className="text-right">
                <div className="text-white font-bold">
                  {Math.round(averageCaloriesPerDay)} kcal
                </div>
                <div className="text-zinc-400 text-sm">
                  {Math.round(averageProteinPerDay)}g protein
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="orangeFilled"
          size="large"
          onClick={onViewHistory}
          className="px-8"
        >
          <Icon icon="mdi:history" className="w-5 h-5 mr-2" />
          View Full History
        </Button>
        <Button
          variant="secondary"
          size="large"
          onClick={() => window.print()}
          className="px-8"
        >
          <Icon icon="mdi:download" className="w-5 h-5 mr-2" />
          Save Report
        </Button>
      </div>
    </div>
  );
};
