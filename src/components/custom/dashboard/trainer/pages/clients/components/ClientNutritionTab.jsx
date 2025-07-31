import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";

import { NutritionPlanModal } from "./NutritionPlanModal";

export function ClientNutritionTab({
  client,
  onAssignNutritionPlan,
  onRemoveNutritionPlan,
  clientHasMockPlan,
}) {
  const [activePlan, setActivePlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
  const [removingPlan, setRemovingPlan] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const [planToRemove, setPlanToRemove] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch active nutrition plan
  const fetchActivePlan = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/coaching-requests/${client.id}/assigned-nutrition-plans`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active nutrition plan");
      }

      const data = await response.json();
      setActivePlan(data.data && data.data.length > 0 ? data.data[0] : null);
    } catch (err) {
      console.error("Error fetching active nutrition plan:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [client?.id]);

  // Fetch nutrition plan history
  const fetchPlanHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(
        `/api/coaching-requests/${client.id}/nutrition-plan-history`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch nutrition plan history");
      }

      const data = await response.json();
      setPlanHistory(data.data || []);
    } catch (err) {
      console.error("Error fetching nutrition plan history:", err);
      // Just log the error, no need to display it in the UI
    } finally {
      setHistoryLoading(false);
    }
  }, [client?.id]);

  useEffect(() => {
    if (client?.id) {
      fetchActivePlan();
      fetchPlanHistory();
    }
  }, [client?.id, fetchActivePlan, fetchPlanHistory]);

  const handleRemoveNutritionPlan = async () => {
    if (!planToRemove || !onRemoveNutritionPlan) return;

    try {
      setRemovingPlan(true);
      setRemoveError(null);
      await onRemoveNutritionPlan(planToRemove.id);
      setShowConfirmRemoveModal(false);
      setPlanToRemove(null);
      fetchActivePlan();
      fetchPlanHistory();
    } catch (err) {
      setRemoveError(err.message || "Failed to remove nutrition plan");
    } finally {
      setRemovingPlan(false);
    }
  };

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
      case "abandoned":
        return "Removed";
      case "expired":
        return "Expired";
      case "cancelled":
        return "Cancelled";
      default:
        return "Inactive";
    }
  };

  // Get status color class
  const getPlanStatusColorClass = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "abandoned":
        return "text-red-400";
      case "expired":
        return "text-amber-400";
      case "cancelled":
        return "text-zinc-400";
      default:
        return "text-zinc-400";
    }
  };

  // Handle view plan
  const handleViewPlan = (plan) => {
    setSelectedPlan(plan.nutritionPlan);
    setShowPlanModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Nutrition Plans</h2>
        <Button
          variant="success"
          leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
          onClick={() =>
            onAssignNutritionPlan && onAssignNutritionPlan("nutrition")
          }
        >
          {activePlan
            ? "Replace Plan"
            : clientHasMockPlan
              ? "Replace Demo Plan"
              : "Assign Meal Plan"}
        </Button>
      </div>

      {loading ? (
        <Card variant="dark" className="overflow-visible">
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent mx-auto mb-4" />
            <p className="text-zinc-400">Loading nutrition plans...</p>
          </div>
        </Card>
      ) : error ? (
        <Card variant="dark" className="overflow-visible">
          <div className="text-center py-12">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-500 mx-auto mb-4"
              width={48}
              height={48}
            />
            <p className="text-red-400 text-lg mb-2">Error Loading Plans</p>
            <p className="text-zinc-500 text-sm mb-6">{error}</p>
            <Button
              variant="secondary"
              onClick={fetchActivePlan}
              leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
            >
              Retry
            </Button>
          </div>
        </Card>
      ) : activePlan || clientHasMockPlan ? (
        <div className="space-y-4">
          {/* Active Plan */}
          {activePlan ? (
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:check-circle"
                    className="text-green-400"
                    width={24}
                    height={24}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    Active Plan
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="small"
                    leftIcon={<Icon icon="mdi:eye" width={16} height={16} />}
                    onClick={() => handleViewPlan(activePlan)}
                  >
                    View Plan
                  </Button>
                  {activePlan.isActive && activePlan.startDate && (
                    <Link href={`/trainer/dashboard/clients/${client.id}/nutrition/${activePlan.id}`}>
                      <Button
                        variant="success"
                        size="small"
                        leftIcon={<Icon icon="mdi:chart-line" width={16} height={16} />}
                      >
                        Track Progress
                      </Button>
                    </Link>
                  )}
                  {onRemoveNutritionPlan && (
                    <Button
                      variant="danger"
                      size="small"
                      leftIcon={
                        <Icon icon="mdi:delete" width={16} height={16} />
                      }
                      onClick={() => {
                        setPlanToRemove(activePlan);
                        setShowConfirmRemoveModal(true);
                      }}
                    >
                      Remove Plan
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-700/30">
                <div className="flex items-center gap-4">
                  {activePlan.nutritionPlan.coverImage && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image
                        src={activePlan.nutritionPlan.coverImage}
                        alt={activePlan.nutritionPlan.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-white font-semibold text-lg truncate">
                      {activePlan.nutritionPlan.title}
                    </h4>
                    <p className="text-zinc-400 text-sm mb-1 line-clamp-2">
                      {activePlan.nutritionPlan.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                      <span>
                        Started:{" "}
                        {activePlan.startDate
                          ? formatDate(activePlan.startDate)
                          : "Not started yet"}
                      </span>
                      <span>
                        Duration: {activePlan.nutritionPlan.duration}{" "}
                        {activePlan.nutritionPlan.durationType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-green-400 font-medium mb-1">Active</div>
                  {activePlan.nutritionPlan.nutritionInfo && (
                    <div className="text-xs text-zinc-500 space-y-1">
                      <div>
                        {activePlan.nutritionPlan.nutritionInfo.calories || 0}{" "}
                        cal/day
                      </div>
                      <div>
                        {activePlan.nutritionPlan.nutritionInfo.protein || 0}g
                        protein
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    {activePlan.assignedById === client.trainerId ? (
                      <>
                        <Icon
                          icon="mdi:check-circle"
                          className="text-green-400"
                          width={14}
                          height={14}
                        />
                        <span className="text-green-400 text-xs">
                          Assigned by you
                        </span>
                      </>
                    ) : (
                      <>
                        <Icon
                          icon="mdi:account-circle"
                          className="text-blue-400"
                          width={14}
                          height={14}
                        />
                        <span className="text-blue-400 text-xs">
                          Assigned by{" "}
                          {activePlan.assignedBy?.trainerProfile?.firstName ||
                            "another trainer"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : clientHasMockPlan ? (
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:information"
                    className="text-blue-400"
                    width={24}
                    height={24}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    Demo Plan
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="mdi:food-apple"
                      className="text-blue-400"
                      width={32}
                      height={32}
                    />
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                      <Icon
                        icon="mdi:information-outline"
                        className="text-white"
                        width={14}
                        height={14}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-semibold text-lg truncate">
                      Demo Nutrition Plan
                    </h4>
                    <p className="text-zinc-400 text-sm mb-1">
                      Client is using a demo nutrition plan
                    </p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:alert-circle-outline"
                          className="text-blue-400"
                          width={14}
                          height={14}
                        />
                        <span className="text-blue-400 text-xs">
                          App-provided demo plan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() =>
                      onAssignNutritionPlan &&
                      onAssignNutritionPlan("nutrition")
                    }
                  >
                    Replace with Real Plan
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Plan History */}
          {historyLoading ? (
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="mdi:history"
                  className="text-[#3E92CC]"
                  width={24}
                  height={24}
                />
                <h3 className="text-xl font-semibold text-white">
                  Plan History
                </h3>
              </div>
              <div className="text-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-[#3E92CC] border-t-transparent mx-auto" />
                <p className="text-zinc-400 text-sm mt-2">
                  Loading plan history...
                </p>
              </div>
            </Card>
          ) : planHistory.length > 0 ? (
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="mdi:history"
                  className="text-[#3E92CC]"
                  width={24}
                  height={24}
                />
                <h3 className="text-xl font-semibold text-white">
                  Plan History
                </h3>
              </div>

              <div className="space-y-3">
                {planHistory.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        icon="mdi:food-apple"
                        className="text-zinc-400 flex-shrink-0"
                        width={20}
                        height={20}
                      />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {plan.nutritionPlan.title}
                        </p>
                        <p className="text-zinc-400 text-sm">
                          Assigned:{" "}
                          {formatDate(plan.assignedAt || plan.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${getPlanStatusColorClass(plan.status)}`}
                        >
                          {getPlanStatusText(plan.status)}
                        </div>
                        <div className="text-xs text-zinc-600">
                          {plan.nutritionPlan.duration}{" "}
                          {plan.nutritionPlan.durationType}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      ) : (
        <Card variant="dark" className="overflow-visible">
          <div className="text-center py-12">
            <Icon
              icon="mdi:food-apple"
              className="text-zinc-600 mx-auto mb-4"
              width={48}
              height={48}
            />
            <p className="text-zinc-400 text-lg mb-2">
              No Nutrition Plans Assigned
            </p>
            <p className="text-zinc-500 text-sm mb-6">
              Create and assign a nutrition plan to help this client reach their
              goals.
            </p>
            <Button
              variant="success"
              leftIcon={<Icon icon="mdi:food-apple" width={20} height={20} />}
              onClick={() =>
                onAssignNutritionPlan && onAssignNutritionPlan("nutrition")
              }
            >
              Assign First Meal Plan
            </Button>
          </div>
        </Card>
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
              Remove Nutrition Plan
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
                  {planToRemove.nutritionPlan.title}
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
          primaryButtonAction={handleRemoveNutritionPlan}
          primaryButtonDisabled={removingPlan}
          hideButtons={false}
        />
      )}

      {/* Nutrition Plan Modal */}
      {showPlanModal && selectedPlan && (
        <NutritionPlanModal
          plan={selectedPlan}
          isOpen={showPlanModal}
          onClose={() => {
            setShowPlanModal(false);
            setSelectedPlan(null);
          }}
          days={selectedPlan.days}
        />
      )}
    </div>
  );
}
