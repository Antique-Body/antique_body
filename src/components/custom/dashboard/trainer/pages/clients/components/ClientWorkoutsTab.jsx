import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export function ClientWorkoutsTab({
  assignedTrainingPlans,
  client,
  onViewPlan,
  onStartPlan,
  startingPlanId,
  startPlanError,
}) {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Training Plans ({assignedTrainingPlans.length})
        </h2>
        <Button
          variant="primary"
          leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
        >
          Assign New Plan
        </Button>
      </div>

      {/* Training Plans List */}
      <div className="space-y-4">
        {assignedTrainingPlans.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              icon="mdi:dumbbell"
              className="text-zinc-600 mx-auto mb-4"
              width={48}
              height={48}
            />
            <p className="text-zinc-400 text-lg mb-2">
              No training plans assigned yet
            </p>
            <p className="text-zinc-500 text-sm mb-6">
              Create and assign training plans to help your client reach their
              fitness goals.
            </p>
            <Button
              variant="primary"
              leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
            >
              Assign Training Plan
            </Button>
          </div>
        ) : (
          assignedTrainingPlans.map((plan) => (
            <TrainingPlanCard
              key={plan.id}
              plan={plan}
              client={client}
              onViewPlan={onViewPlan}
              onStartPlan={onStartPlan}
              startingPlanId={startingPlanId}
            />
          ))
        )}
      </div>

      {/* Error Display */}
      {startPlanError && (
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-400"
              width={20}
              height={20}
            />
            <p className="text-red-400 font-medium">Error starting plan</p>
          </div>
          <p className="text-red-300/90 text-sm mt-1">{startPlanError}</p>
        </div>
      )}
    </div>
  );
}

// Enhanced Training Plan Card Component with Lazy Loading
function TrainingPlanCard({
  plan,
  client,
  onViewPlan,
  onStartPlan,
  startingPlanId,
}) {
  const [planDetails, setPlanDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [viewResultsLoading, setViewResultsLoading] = useState(false);

  const handleViewPlan = async () => {
    if (!planDetails && !isLoading) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/coaching-requests/${client.id}/assigned-training-plan/${plan.id}/progress`
        );
        if (response.ok) {
          const data = await response.json();
          setPlanDetails(data);
        }
      } catch (error) {
        console.error("Error loading plan details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setShowDetails(!showDetails);
    onViewPlan(plan);
  };

  const getCompletionStats = () => {
    if (!planDetails || !planDetails.schedule) return null;

    const totalDays = planDetails.schedule.length;
    const completedDays = planDetails.schedule.filter(
      (day) => day.workoutStatus === "completed"
    ).length;
    const totalExercises = planDetails.schedule.reduce(
      (sum, day) => sum + (day.exercises?.length || 0),
      0
    );
    const completedExercises = planDetails.schedule.reduce((sum, day) => {
      if (day.workoutStatus === "completed") {
        return (
          sum +
          (day.exercises?.filter((ex) => ex.exerciseCompleted)?.length || 0)
        );
      }
      return sum;
    }, 0);

    return { totalDays, completedDays, totalExercises, completedExercises };
  };

  const stats = getCompletionStats();

  return (
    <div
      className={`rounded-xl border backdrop-blur-sm transition-all duration-200 ${
        plan.status === "completed"
          ? "bg-green-500/10 border-green-500/30"
          : plan.status === "active"
            ? "bg-blue-500/10 border-blue-500/30 ring-2 ring-blue-500/20"
            : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      {/* Main Card Content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Side - Plan Info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Status Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                plan.status === "completed"
                  ? "bg-green-600 shadow-lg shadow-green-600/30"
                  : plan.status === "active"
                    ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                    : "bg-orange-600 shadow-lg shadow-orange-600/30"
              }`}
            >
              <Icon
                icon={
                  plan.status === "completed"
                    ? "mdi:check"
                    : plan.status === "active"
                      ? "mdi:play"
                      : "mdi:pause"
                }
                className="text-white"
                width={18}
                height={18}
              />
            </div>

            {/* Plan Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-semibold text-white truncate">
                  {plan.planData.title}
                </h3>
                {plan.status === "active" && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                    Active
                  </span>
                )}
                {plan.status === "completed" && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                    Completed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:clock" width={14} height={14} />
                  {plan.planData.duration} {plan.planData.durationType}
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:calendar" width={14} height={14} />
                  {plan.status}
                </span>
              </div>

              {/* Completion Stats for Completed Plans */}
              {plan.status === "completed" && stats && (
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:check-circle" width={12} height={12} />
                    {stats?.completedDays || 0}/{stats?.totalDays || 0} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:dumbbell" width={12} height={12} />
                    {stats?.completedExercises || 0}/
                    {stats?.totalExercises || 0} exercises
                  </span>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                  <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading details...
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewPlan}
              className="px-3 py-2"
            >
              <Icon icon="mdi:eye" width={16} height={16} />
              <span className="hidden sm:inline ml-1">View</span>
            </Button>

            {plan.status === "completed" && (
              <Button
                variant="secondary"
                size="sm"
                className="px-3 py-2 bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30"
                disabled={viewResultsLoading}
                onClick={async () => {
                  setViewResultsLoading(true);
                  try {
                    window.location.href = `/trainer/dashboard/clients/${client.id}/plans/${plan.id}?mode=review`;
                  } finally {
                    // Optionally keep loading true until navigation
                  }
                }}
              >
                {viewResultsLoading ? (
                  <span className="flex items-center">
                    <span className="w-3 h-3 border-2 border-green-300 border-t-transparent rounded-full animate-spin mr-2"></span>
                    Loading...
                  </span>
                ) : (
                  <>
                    <Icon icon="mdi:chart-line" width={16} height={16} />
                    <span className="hidden sm:inline ml-1">View Results</span>
                  </>
                )}
              </Button>
            )}

            {plan.status !== "completed" && plan.status !== "active" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStartPlan(plan.id)}
                loading={startingPlanId === plan.id}
                className="px-3 py-2"
              >
                <Icon icon="mdi:play" width={16} height={16} />
                <span className="hidden sm:inline ml-1">Start</span>
              </Button>
            )}

            {plan.status === "active" && (
              <Link
                href={`/trainer/dashboard/clients/${client.id}/plans/${plan.id}`}
              >
                <Button variant="primary" size="sm" className="px-3 py-2">
                  <Icon icon="mdi:open-in-new" width={16} height={16} />
                  <span className="hidden sm:inline ml-1">Track</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
