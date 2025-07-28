"use client";

import {
  DietPlanAssignmentCard,
  ActiveDietPlan,
  LoadingState,
  ErrorState,
} from "@/components/custom/dashboard/client/pages/diet-tracker";
import { useDietTracker } from "@/hooks/useDietTracker";

export default function DietTrackerPage() {
  const {
    hasActivePlan,
    activePlan,
    dailyLogs,
    nextMeal,
    loading,
    error,
    mockPlanAvailable,
    validationError,
    startDietPlan,
    completeMeal,
    uncompleteMeal,
    changeMealOption,
    addCustomMealToDay,
    deleteSnack,
    getCompletionRate,
    getLogByDate,
    clearValidationError,
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
  if (!hasActivePlan && mockPlanAvailable) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <DietPlanAssignmentCard onStartPlan={startDietPlan} loading={loading} />
      </div>
    );
  }

  // Active plan interface
  if (hasActivePlan && activePlan) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ActiveDietPlan
          activePlan={activePlan}
          dailyLogs={dailyLogs}
          nextMeal={nextMeal}
          validationError={validationError}
          onCompleteMeal={completeMeal}
          onUncompleteMeal={uncompleteMeal}
          onChangeMealOption={changeMealOption}
          onAddSnack={addCustomMealToDay}
          onDeleteSnack={deleteSnack}
          getCompletionRate={getCompletionRate}
          getLogByDate={getLogByDate}
          clearValidationError={clearValidationError}
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
