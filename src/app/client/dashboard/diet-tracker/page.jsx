"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/components/common/Button";
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
    hasAssignedPlan,
    assignedPlan,
    activePlan,
    dailyLogs,
    nextMeal,
    loading,
    error,
    mockPlanAvailable,
    validationError,
    startDietPlan,
    startAssignedPlan,
    completeMeal,
    uncompleteMeal,
    changeMealOption,
    logMeal,
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

  // Has assigned plan but no active tracking
  if (hasAssignedPlan && !hasActivePlan && assignedPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AssignedPlanCard
          assignedPlan={assignedPlan}
          onStartPlan={() => startAssignedPlan(assignedPlan.id)}
          loading={loading}
        />
      </div>
    );
  }

  // No active plan and no assigned plan - show assignment card
  if (!hasActivePlan && !hasAssignedPlan && mockPlanAvailable) {
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
          onLogMeal={logMeal}
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

// Component for assigned plan card
function AssignedPlanCard({ assignedPlan, onStartPlan, loading }) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartPlan = async () => {
    setIsStarting(true);
    try {
      await onStartPlan();
    } catch (error) {
      console.error("Error starting plan:", error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Your Nutrition Journey
        </h1>
        <p className="text-zinc-400 text-lg">
          Your trainer has prepared a personalized nutrition plan for you
        </p>
      </div>

      {/* Assignment Card */}
      <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8">
        <div className="flex items-start gap-6">
          {/* Plan Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-[#3E92CC] to-[#2E7DCC] rounded-2xl flex items-center justify-center shadow-lg">
              <Icon
                icon="mdi:food-apple"
                className="text-white"
                width={32}
                height={32}
              />
            </div>
          </div>

          {/* Plan Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-white">
                {assignedPlan.originalPlan.title || "Nutrition Plan"}
              </h2>
              <span className="px-3 py-1 bg-[#3E92CC]/20 text-[#3E92CC] text-sm font-medium rounded-full">
                Assigned by Trainer
              </span>
            </div>

            <p className="text-zinc-400 mb-6">
              {assignedPlan.originalPlan.description ||
                "Your trainer has created a personalized nutrition plan tailored to your goals and preferences."}
            </p>

            {/* Trainer Info */}
            {assignedPlan.trainer && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-zinc-800/30 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-full flex items-center justify-center">
                  <Icon
                    icon="mdi:account"
                    className="text-white"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {assignedPlan.trainer.trainerProfile?.firstName}{" "}
                    {assignedPlan.trainer.trainerProfile?.lastName}
                  </p>
                  <p className="text-zinc-400 text-sm">Your Trainer</p>
                </div>
              </div>
            )}

            {/* Plan Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-zinc-800/30 rounded-xl">
                <div className="text-2xl font-bold text-orange-400">
                  {assignedPlan.originalPlan.nutritionInfo?.calories || 0}
                </div>
                <div className="text-zinc-400 text-sm">Daily Calories</div>
              </div>
              <div className="text-center p-4 bg-zinc-800/30 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">
                  {assignedPlan.originalPlan.nutritionInfo?.protein || 0}g
                </div>
                <div className="text-zinc-400 text-sm">Protein</div>
              </div>
              <div className="text-center p-4 bg-zinc-800/30 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">
                  {assignedPlan.originalPlan.nutritionInfo?.carbs || 0}g
                </div>
                <div className="text-zinc-400 text-sm">Carbs</div>
              </div>
              <div className="text-center p-4 bg-zinc-800/30 rounded-xl">
                <div className="text-2xl font-bold text-green-400">
                  {assignedPlan.originalPlan.nutritionInfo?.fats || 0}g
                </div>
                <div className="text-zinc-400 text-sm">Fats</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-4">
              <Button
                variant="orangeFilled"
                size="large"
                onClick={handleStartPlan}
                disabled={loading || isStarting}
                className="flex-1 h-12"
              >
                {isStarting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Starting Plan...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:play" className="w-5 h-5 mr-2" />
                    Start Tracking This Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
