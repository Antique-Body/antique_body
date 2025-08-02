import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";

export function ClientWorkoutsTab({
  assignedTrainingPlans,
  client,
  onViewPlan,
  onStartPlan,
  onAssignPlan,
  onRemoveTrainingPlan,
  startingPlanId,
  startPlanError,
}) {
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
  const [removingPlan, setRemovingPlan] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [planToRemove, setPlanToRemove] = useState(null);

  const handleRemoveTrainingPlan = async () => {
    if (!planToRemove || !onRemoveTrainingPlan) return;

    try {
      setRemovingPlan(true);
      setRemoveError(null);
      await onRemoveTrainingPlan(planToRemove.id);
      setShowConfirmRemoveModal(false);
      setPlanToRemove(null);
    } catch (err) {
      setRemoveError(err.message || "Failed to remove training plan");
    } finally {
      setRemovingPlan(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Training Plans</h2>
        <Button
          variant="primary"
          leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
          onClick={() => onAssignPlan && onAssignPlan("training")}
        >
          {assignedTrainingPlans.length > 0
            ? "Replace Plan"
            : "Assign Training Plan"}
        </Button>
      </div>

      {assignedTrainingPlans.length === 0 ? (
        <Card variant="dark" className="overflow-visible">
          <div className="text-center py-12">
            <Icon
              icon="mdi:dumbbell"
              className="text-zinc-600 mx-auto mb-4"
              width={48}
              height={48}
            />
            <p className="text-zinc-400 text-lg mb-2">
              No Training Plans Assigned
            </p>
            <p className="text-zinc-500 text-sm mb-6">
              Create and assign a training plan to help this client reach their
              fitness goals.
            </p>
            <Button
              variant="primary"
              leftIcon={<Icon icon="mdi:dumbbell" width={20} height={20} />}
              onClick={() => onAssignPlan && onAssignPlan("training")}
            >
              Assign First Training Plan
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignedTrainingPlans.map((plan) => (
            <TrainingPlanCard
              key={plan.id}
              plan={plan}
              client={client}
              onViewPlan={onViewPlan}
              onStartPlan={onStartPlan}
              onRemoveTrainingPlan={(_planId) => {
                setPlanToRemove(plan);
                setShowConfirmRemoveModal(true);
              }}
              startingPlanId={startingPlanId}
            />
          ))}
        </div>
      )}

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

      {/* Confirm Remove Plan Modal */}
      {showConfirmRemoveModal && planToRemove && (
        <Modal
          isOpen={showConfirmRemoveModal}
          onClose={() => {
            setShowConfirmRemoveModal(false);
            setPlanToRemove(null);
          }}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:alert-circle"
                width={24}
                height={24}
                className="text-red-400"
              />
              Remove Training Plan
            </div>
          }
          message={
            <div className="space-y-4">
              {removeError && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
                  <p className="text-red-400 text-sm">{removeError}</p>
                </div>
              )}
              <p className="text-white">
                Are you sure you want to remove{" "}
                <span className="font-semibold">
                  {planToRemove.planData?.title || "this training plan"}
                </span>{" "}
                from this client?
              </p>
              <p className="text-zinc-400 text-sm">
                This will deactivate the plan assignment. The client will no
                longer have access to this plan.
              </p>
            </div>
          }
          primaryButtonText={removingPlan ? "Removing..." : "Remove Plan"}
          secondaryButtonText="Cancel"
          primaryButtonAction={handleRemoveTrainingPlan}
          primaryButtonDisabled={removingPlan}
          hideButtons={false}
        />
      )}
    </div>
  );
}

// Enhanced Training Plan Card Component
function TrainingPlanCard({
  plan,
  client,
  onViewPlan,
  onStartPlan,
  onRemoveTrainingPlan,
  startingPlanId,
}) {
  const [viewResultsLoading, setViewResultsLoading] = useState(false);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get status display text
  const getPlanStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "active":
        return "Active";
      case "paused":
        return "Paused";
      default:
        return "Inactive";
    }
  };

  // Get status color class
  const getPlanStatusColorClass = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "active":
        return "text-blue-400";
      case "paused":
        return "text-amber-400";
      default:
        return "text-zinc-400";
    }
  };

  return (
    <Card variant="dark" className="overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon
            icon={
              plan.status === "completed"
                ? "mdi:check-circle"
                : plan.status === "active"
                  ? "mdi:play-circle"
                  : "mdi:pause-circle"
            }
            className={
              plan.status === "completed"
                ? "text-green-400"
                : plan.status === "active"
                  ? "text-blue-400"
                  : "text-orange-400"
            }
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">
            {plan.status === "active"
              ? "Active Plan"
              : getPlanStatusText(plan.status) + " Plan"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="small"
            leftIcon={<Icon icon="mdi:eye" width={16} height={16} />}
            onClick={() => onViewPlan(plan)}
          >
            View Plan
          </Button>
          {plan.status === "active" && (
            <Link
              href={`/trainer/dashboard/clients/${client.id}/training/${plan.id}`}
            >
              <Button
                variant="success"
                size="small"
                leftIcon={<Icon icon="mdi:chart-line" width={16} height={16} />}
              >
                Track Progress
              </Button>
            </Link>
          )}
          {plan.status === "completed" && (
            <Button
              variant="secondary"
              size="small"
              className="bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30"
              disabled={viewResultsLoading}
              onClick={async () => {
                setViewResultsLoading(true);
                try {
                  window.location.href = `/trainer/dashboard/clients/${client.id}/training/${plan.id}?mode=review`;
                } finally {
                  // Keep loading true until navigation
                }
              }}
              leftIcon={
                viewResultsLoading ? (
                  <span className="w-3 h-3 border-2 border-green-300 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Icon icon="mdi:chart-line" width={16} height={16} />
                )
              }
            >
              {viewResultsLoading ? "Loading..." : "View Results"}
            </Button>
          )}
          {plan.status !== "completed" && plan.status !== "active" && (
            <Button
              variant="primary"
              size="small"
              onClick={() => onStartPlan(plan.id)}
              loading={startingPlanId === plan.id}
              leftIcon={<Icon icon="mdi:play" width={16} height={16} />}
            >
              Start Plan
            </Button>
          )}
          {onRemoveTrainingPlan && (
            <Button
              variant="danger"
              size="small"
              leftIcon={<Icon icon="mdi:delete" width={16} height={16} />}
              onClick={() => onRemoveTrainingPlan(plan.id)}
            >
              Remove Plan
            </Button>
          )}
        </div>
      </div>

      <div
        className={`flex items-center justify-between p-4 rounded-lg border ${
          plan.status === "completed"
            ? "bg-green-900/20 border-green-700/30"
            : plan.status === "active"
              ? "bg-blue-900/20 border-blue-700/30"
              : "bg-orange-900/20 border-orange-700/30"
        }`}
      >
        <div className="flex items-center gap-4">
          {plan.planData?.coverImage ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
              <Image
                src={plan.planData.coverImage}
                alt={plan.planData?.title || "Training Plan"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg overflow-hidden relative bg-zinc-800/50 flex items-center justify-center flex-shrink-0">
              <Icon
                icon="mdi:dumbbell"
                className={
                  plan.status === "completed"
                    ? "text-green-400"
                    : plan.status === "active"
                      ? "text-blue-400"
                      : "text-orange-400"
                }
                width={32}
                height={32}
              />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-lg truncate">
              {plan.planData?.title || "Untitled Plan"}
            </h4>
            <p className="text-zinc-400 text-sm mb-1 line-clamp-2">
              {plan.planData?.description || "No description available"}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
              <span>
                Started:{" "}
                {plan.startDate
                  ? formatDate(plan.startDate)
                  : "Not started yet"}
              </span>
              <span>
                Duration: {plan.planData?.duration || "?"}{" "}
                {plan.planData?.durationType || ""}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0 ml-4">
          <div
            className={`font-medium mb-1 ${getPlanStatusColorClass(plan.status)}`}
          >
            {getPlanStatusText(plan.status)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Icon
              icon="mdi:check-circle"
              className={
                plan.status === "completed"
                  ? "text-green-400"
                  : plan.status === "active"
                    ? "text-blue-400"
                    : "text-orange-400"
              }
              width={14}
              height={14}
            />
            <span
              className={`text-xs ${
                plan.status === "completed"
                  ? "text-green-400"
                  : plan.status === "active"
                    ? "text-blue-400"
                    : "text-orange-400"
              }`}
            >
              Assigned by you
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
