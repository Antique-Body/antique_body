"use client";

import { useState } from "react";

import {
  DietPlanAssignmentCard,
  ActiveDietPlan,
  LoadingState,
  ErrorState,
  PlanProgressSummary,
  PlanCompletionCard,
} from "@/components/custom/dashboard/client/pages/diet-tracker";
import { useDietTracker } from "@/hooks/useDietTracker";

export default function DietTrackerPage() {
  const [viewMode, setViewMode] = useState("tracker"); // "tracker", "progress", "completion"

  const {
    hasActivePlan,
    activePlan,
    dailyLogs,
    nextMeal,
    loading,
    error,
    mockPlanAvailable,
    assignedPlan,
    validationError,
    progress,
    progressMessage,
    isCompleted,
    dailyWaterIntake,
    isWaterLoading,
    // completionStatus, // Currently unused but may be needed later
    startDietPlan,
    completeMeal,
    uncompleteMeal,
    changeMealOption,
    addCustomMealToDay,
    deleteSnack,
    getCompletionRate,
    getLogByDate,
    clearValidationError,
    addWater,
    fetchWaterIntake,
    getWaterStats,
    resetWaterIntake,
  } = useDietTracker();

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error && !hasActivePlan) {
    return <ErrorState error={error} />;
  }

  // No active plan - show assignment card
  if (!hasActivePlan && (assignedPlan || mockPlanAvailable)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <DietPlanAssignmentCard
          onStartPlan={startDietPlan}
          loading={loading}
          assignedPlan={assignedPlan}
        />
      </div>
    );
  }

  // Plan completed - show completion celebration
  if (hasActivePlan && activePlan && isCompleted && viewMode === "completion") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PlanCompletionCard
          assignment={activePlan}
          progress={progress}
          onViewHistory={() => setViewMode("progress")}
        />
      </div>
    );
  }

  // Progress view
  if (hasActivePlan && activePlan && viewMode === "progress") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => setViewMode(isCompleted ? "completion" : "tracker")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {isCompleted ? "Completion" : "Tracker"}
          </button>
        </div>
        <PlanProgressSummary
          progress={progress}
          assignment={activePlan}
          isCompleted={isCompleted}
        />
      </div>
    );
  }

  // Active plan interface
  if (hasActivePlan && activePlan) {
    // If plan just completed, show completion first
    if (isCompleted && viewMode === "tracker") {
      setViewMode("completion");
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Diet Tracker</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("progress")}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors"
            >
              View Progress
            </button>
            {isCompleted && (
              <button
                onClick={() => setViewMode("completion")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
              >
                Celebration 🎉
              </button>
            )}
          </div>
        </div>

        <ActiveDietPlan
          activePlan={activePlan}
          dailyLogs={dailyLogs}
          nextMeal={nextMeal}
          validationError={validationError}
          progress={progress}
          progressMessage={progressMessage}
          isCompleted={isCompleted}
          dailyWaterIntake={dailyWaterIntake}
          isWaterLoading={isWaterLoading}
          onCompleteMeal={completeMeal}
          onUncompleteMeal={uncompleteMeal}
          onChangeMealOption={changeMealOption}
          onAddSnack={addCustomMealToDay}
          onDeleteSnack={deleteSnack}
          onWaterAdd={addWater}
          getCompletionRate={getCompletionRate}
          getLogByDate={getLogByDate}
          clearValidationError={clearValidationError}
          onFetchWaterIntake={fetchWaterIntake}
          onGetWaterStats={getWaterStats}
          onResetWaterIntake={resetWaterIntake}
        />
      </div>
    );
  }

  // Fallback state
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center py-12">
        <h2 className="text-xl text-white mb-4">No Diet Plan Available</h2>
        <p className="text-zinc-400">
          Contact your trainer to get a nutrition plan assigned.
        </p>
      </div>
    </div>
  );
}
