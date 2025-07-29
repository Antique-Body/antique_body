"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import {
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
    validationError,
    isCustomMealInput,
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
    fetchDietTrackerData,
  } = useDietTracker();

  // Refresh data when component mounts
  useEffect(() => {
    fetchDietTrackerData();
  }, [fetchDietTrackerData]);

  // Debug logging
  useEffect(() => {
    console.log("Diet tracker state:", {
      hasActivePlan,
      hasAssignedPlan,
      assignedPlan: assignedPlan
        ? {
            id: assignedPlan.id,
            customMealInputEnabled: assignedPlan.customMealInputEnabled,
            status: assignedPlan.status,
            planData: assignedPlan.planData,
          }
        : null,
      isCustomMealInput,
      loading,
      error,
    });
  }, [
    hasActivePlan,
    hasAssignedPlan,
    assignedPlan,
    isCustomMealInput,
    loading,
    error,
  ]);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error && !hasActivePlan) {
    return <ErrorState error={error} />;
  }

  // Has assigned custom meal input plan but no active plan yet
  if (hasAssignedPlan && assignedPlan && isCustomMealInput && !hasActivePlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AssignedPlanCard
          assignedPlan={assignedPlan}
          onStartPlan={() => startAssignedPlan(assignedPlan.id)}
          loading={loading}
          isCustomMealInput={isCustomMealInput}
        />
      </div>
    );
  }

  // Has assigned regular plan but no active tracking
  if (hasAssignedPlan && !hasActivePlan && assignedPlan && !isCustomMealInput) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AssignedPlanCard
          assignedPlan={assignedPlan}
          onStartPlan={() => startAssignedPlan(assignedPlan.id)}
          loading={loading}
          isCustomMealInput={isCustomMealInput}
        />
      </div>
    );
  }

  // No active plan and no assigned plan - show message about needing trainer
  if (!hasActivePlan && !hasAssignedPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon
                icon="mdi:account-tie"
                className="text-white"
                width={32}
                height={32}
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Nutrition Plan Assigned
            </h2>
            <p className="text-zinc-400 text-lg mb-6">
              You need a trainer to assign you a personalized nutrition plan.
            </p>
            <p className="text-zinc-500">
              Contact your trainer to get started with your nutrition journey.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active plan interface (including custom meal input)
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
function AssignedPlanCard({
  assignedPlan,
  onStartPlan,
  loading,
  isCustomMealInput,
}) {
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
          {isCustomMealInput
            ? "Custom Meal Tracking"
            : "Your Nutrition Journey"}
        </h1>
        <p className="text-zinc-400 text-lg">
          {isCustomMealInput
            ? "Your trainer has enabled custom meal input for you"
            : "Your trainer has prepared a personalized nutrition plan for you"}
        </p>
      </div>

      {/* Assignment Card */}
      <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8">
        <div className="flex items-start gap-6">
          {/* Plan Image */}
          <div className="flex-shrink-0">
            <div
              className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg ${
                isCustomMealInput
                  ? "bg-gradient-to-br from-green-500 to-green-600"
                  : "bg-gradient-to-br from-[#3E92CC] to-[#2E7DCC]"
              }`}
            >
              <Icon
                icon={isCustomMealInput ? "mdi:pencil-plus" : "mdi:food-apple"}
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
                {isCustomMealInput
                  ? "Custom Meal Input"
                  : assignedPlan.originalPlan?.title || "Nutrition Plan"}
              </h2>
              <span className="px-3 py-1 bg-[#3E92CC]/20 text-[#3E92CC] text-sm font-medium rounded-full">
                Assigned by Trainer
              </span>
            </div>

            <p className="text-zinc-400 mb-6">
              {isCustomMealInput
                ? "Track your daily meals with custom input. Log what you eat and monitor your nutrition progress."
                : assignedPlan.originalPlan?.description ||
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

            {/* Plan Stats - Only show for regular plans */}
            {!isCustomMealInput && assignedPlan.originalPlan?.nutritionInfo && (
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
            )}

            {/* Custom Meal Input Features */}
            {isCustomMealInput && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-zinc-800/30 rounded-xl">
                  <Icon
                    icon="mdi:pencil-plus"
                    className="text-green-400 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <div className="text-zinc-400 text-sm">Custom Input</div>
                </div>
                <div className="text-center p-4 bg-zinc-800/30 rounded-xl">
                  <Icon
                    icon="mdi:chart-line"
                    className="text-blue-400 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <div className="text-zinc-400 text-sm">Track Progress</div>
                </div>
                <div className="text-center p-4 bg-zinc-800/30 rounded-xl">
                  <Icon
                    icon="mdi:food-apple"
                    className="text-orange-400 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <div className="text-zinc-400 text-sm">Nutrition Goals</div>
                </div>
              </div>
            )}

            {/* Plan Description - Only for custom meal input */}
            {isCustomMealInput && assignedPlan.planData?.description && (
              <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Icon
                    icon="mdi:file-document-edit"
                    className="w-4 h-4 text-cyan-400"
                  />
                  Trainer's Nutrition Guidelines
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {assignedPlan.planData.description}
                </p>
              </div>
            )}

            {/* Documents Section - Only for custom meal input */}
            {isCustomMealInput &&
              assignedPlan.documents &&
              assignedPlan.documents.length > 0 && (
                <div className="mb-6 p-4 bg-zinc-800/30 rounded-xl">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Icon
                      icon="mdi:file-document-multiple"
                      className="w-4 h-4 text-blue-400"
                    />
                    Nutrition Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {assignedPlan.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg hover:bg-zinc-700/50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="mdi:file-document"
                            className="w-5 h-5 text-blue-400"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {doc.name}
                          </p>
                          <p className="text-zinc-400 text-xs">
                            {doc.size
                              ? `${(doc.size / 1024 / 1024).toFixed(1)} MB`
                              : "Document"}
                          </p>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                        >
                          <Icon
                            icon="mdi:download"
                            className="w-4 h-4 text-blue-400"
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    <Icon
                      icon={isCustomMealInput ? "mdi:pencil-plus" : "mdi:play"}
                      className="w-5 h-5 mr-2"
                    />
                    {isCustomMealInput
                      ? "Start Custom Tracking"
                      : "Start Tracking This Plan"}
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
