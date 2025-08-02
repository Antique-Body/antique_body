"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import {
  ClientHeader,
  ClientTabs,
  ClientLoadingState,
  ClientErrorState,
  ClientNotFoundState,
  ClientOverviewTab,
  ClientProgressTab,
  ClientWorkoutsTab,
  ClientNutritionTab,
  ClientMessagesTab,
} from "@/components/custom/dashboard/trainer/pages/clients/components";
import { PlanPreviewModal } from "@/components/custom/dashboard/trainer/pages/plans/components";
import useAssignPlan from "@/hooks/useAssignPlan";

export default function ClientDashboard({ params }) {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignType, setAssignType] = useState(null); // "training" or "nutrition"
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [planPreviewOpen, setPlanPreviewOpen] = useState(false);
  const [planPreviewData, setPlanPreviewData] = useState(null);
  const [startingPlanId, setStartingPlanId] = useState(null);
  const [startPlanError, setStartPlanError] = useState(null);
  const [clientHasMockPlan, setClientHasMockPlan] = useState(false);

  // Use the assign plan hook
  const { removeNutritionPlan } = useAssignPlan();

  // Unwrap params using React.use() for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  const clientId = unwrappedParams.id;

  // Fetch client data
  const fetchClientData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coaching-requests/${clientId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch client data");
      }

      const data = await response.json();
      if (data.success) {
        // Fetch assigned training plans
        const assignedTrainingPlansRes = await fetch(
          `/api/coaching-requests/${clientId}/assigned-training-plans`
        );
        let assignedTrainingPlans = [];
        if (assignedTrainingPlansRes.ok) {
          const assignedTrainingData = await assignedTrainingPlansRes.json();
          assignedTrainingPlans = assignedTrainingData.data || [];
        }

        // Fetch assigned nutrition plans
        const assignedNutritionPlansRes = await fetch(
          `/api/coaching-requests/${clientId}/assigned-nutrition-plans`
        );
        let assignedNutritionPlans = [];
        if (assignedNutritionPlansRes.ok) {
          const assignedNutritionData = await assignedNutritionPlansRes.json();
          assignedNutritionPlans = assignedNutritionData.data || [];
        }

        // Check if client has a mock nutrition plan
        const clientUserId = data.data.client.userId;
        const clientDietTrackerRes = await fetch(
          `/api/users/client/diet-tracker?userId=${clientUserId}`,
          {
            headers: {
              "x-trainer-view": "true", // Special header to allow trainer to view client data
            },
          }
        );

        let hasMockPlan = false;
        if (clientDietTrackerRes.ok) {
          const dietTrackerData = await clientDietTrackerRes.json();
          // If client has no assigned plan but has a mock plan
          if (
            !dietTrackerData.hasActivePlan &&
            dietTrackerData.mockPlanAvailable &&
            assignedNutritionPlans.length === 0
          ) {
            hasMockPlan = true;
          }
        }

        setClient({
          ...data.data,
          assignedTrainingPlans: assignedTrainingPlans,
          assignedNutritionPlans: assignedNutritionPlans,
        });
        setClientHasMockPlan(hasMockPlan);
      } else {
        throw new Error(data.error || "Failed to fetch client data");
      }
    } catch (err) {
      console.error("Error fetching client data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Fetch trainer plans
  const fetchPlans = async (type) => {
    try {
      setPlansLoading(true);
      const response = await fetch(`/api/users/trainer/plans?type=${type}`);

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans(data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      // Handle error appropriately
    } finally {
      setPlansLoading(false);
    }
  };

  // Handle assign plan modal
  const handleAssignPlan = (type) => {
    setAssignType(type);
    setShowAssignModal(true);
    fetchPlans(type);
  };

  // Handle plan assignment
  const handleAssignPlanToClient = async () => {
    if (!selectedPlan) return;

    try {
      setAssigning(true);
      setAssignError(null);

      // Choose the correct API endpoint based on plan type
      const endpoint =
        assignType === "training"
          ? `/api/coaching-requests/${client.id}/assign-training-plan`
          : `/api/coaching-requests/${client.id}/assign-nutrition-plan`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: String(selectedPlan.id) }),
      });

      const data = await response.json();

      if (
        data.error &&
        (data.error.includes("already has an active") ||
          data.error.includes("Complete it before assigning"))
      ) {
        setAssignError(
          "Assigning a new plan will end the current plan for this client. " +
            "Click 'End Current & Assign New Plan' to proceed."
        );
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to assign ${assignType} plan`);
      }

      setShowAssignModal(false);
      setSelectedPlan(null);
      setAssignType(null);
      fetchClientData();
    } catch (err) {
      console.error("Error assigning plan:", err);
      setAssignError(
        err.message || `Failed to assign ${assignType} plan. Please try again.`
      );
    } finally {
      setAssigning(false);
    }
  };

  // Close assign modal
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedPlan(null);
    setAssignType(null);
    setPlans([]);
  };

  // Handle remove nutrition plan
  const handleRemoveNutritionPlan = async (assignmentId) => {
    try {
      await removeNutritionPlan(client.id, assignmentId);
      // Refresh client data after removing the plan
      await fetchClientData();
      return true;
    } catch (err) {
      console.error("Error removing nutrition plan:", err);
      throw err;
    }
  };

  // Handle remove training plan
  const handleRemoveTrainingPlan = async (assignmentId) => {
    try {
      const response = await fetch(
        `/api/coaching-requests/${client.id}/remove-training-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignmentId }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to remove training plan");
      }

      // Refresh client data after removing the plan
      await fetchClientData();
      return true;
    } catch (err) {
      console.error("Error removing training plan:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [clientId, fetchClientData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Tab configuration is now handled in ClientTabs component

  if (loading) {
    return <ClientLoadingState message="Loading client data..." />;
  }

  if (error) {
    return <ClientErrorState error={error} onRetry={fetchClientData} />;
  }

  if (!client) {
    return (
      <ClientNotFoundState
        onBackToClients={() => router.push("/trainer/dashboard/clients")}
      />
    );
  }

  const profile = client.client.clientProfile;

  // Handler for starting a plan
  const handleStartPlan = async (planId) => {
    if (!client?.id || !planId) return;
    setStartingPlanId(planId);
    setStartPlanError(null);
    try {
      const res = await fetch(
        `/api/coaching-requests/${client.id}/assigned-training-plan/${planId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "active" }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to start plan");
      }
      fetchClientData();
    } catch (err) {
      setStartPlanError(err.message || "Failed to start plan");
    } finally {
      setStartingPlanId(null);
    }
  };

  return (
    <div className="px-4 py-5">
      {/* Header */}
      <ClientHeader client={client} profile={profile} formatDate={formatDate} />

      {/* Tab Navigation */}
      <ClientTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === "overview" && (
          <ClientOverviewTab
            client={client}
            profile={profile}
            onAssignPlan={handleAssignPlan}
            assignedTrainingPlans={client.assignedTrainingPlans || []}
            assignedNutritionPlans={client.assignedNutritionPlans || []}
            setActiveTab={setActiveTab}
            onRemoveNutritionPlan={handleRemoveNutritionPlan}
            onRemoveTrainingPlan={handleRemoveTrainingPlan}
            clientHasMockPlan={clientHasMockPlan}
          />
        )}
        {activeTab === "progress" && <ClientProgressTab client={client} />}
        {activeTab === "workouts" && (
          <ClientWorkoutsTab
            assignedTrainingPlans={client.assignedTrainingPlans || []}
            client={client}
            onViewPlan={(plan) => {
              setPlanPreviewData(plan.planData);
              setPlanPreviewOpen(true);
            }}
            onStartPlan={handleStartPlan}
            onAssignPlan={handleAssignPlan}
            onRemoveTrainingPlan={handleRemoveTrainingPlan}
            startingPlanId={startingPlanId}
            startPlanError={startPlanError}
          />
        )}
        {activeTab === "nutrition" && (
          <ClientNutritionTab
            client={client}
            onAssignNutritionPlan={handleAssignPlan}
            onRemoveNutritionPlan={handleRemoveNutritionPlan}
            clientHasMockPlan={clientHasMockPlan}
          />
        )}
        {activeTab === "messages" && <ClientMessagesTab client={client} />}
      </div>

      {/* Assign Plan Modal */}
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={handleCloseAssignModal}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon={
                  assignType === "training" ? "mdi:dumbbell" : "mdi:food-apple"
                }
                width={24}
                height={24}
                className="text-[#3E92CC]"
              />
              Assign {assignType === "training" ? "Training" : "Nutrition"} Plan
            </div>
          }
          hideButtons={true}
          className="max-w-4xl"
          footerButtons={false}
        >
          {/* Show info/error message if there's an active plan */}
          {((assignType === "training" &&
            client.assignedTrainingPlans?.some(
              (plan) => plan.status === "active"
            )) ||
            (assignType === "nutrition" &&
              client.assignedNutritionPlans?.some(
                (plan) => plan.isActive
              ))) && (
            <>
              <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-700/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="mdi:alert"
                    className="text-amber-400"
                    width={20}
                    height={20}
                  />
                  <p className="text-amber-400 font-medium">
                    Current Active Plan
                  </p>
                </div>
                <p className="text-amber-300/90 text-sm">
                  {(() => {
                    if (assignType === "training") {
                      const activePlan = client.assignedTrainingPlans?.find(
                        (plan) => plan.status === "active"
                      );
                      if (!activePlan) return null;
                      return `${activePlan.planData.title} • ${activePlan.planData.duration} ${activePlan.planData.durationType}`;
                    } else if (assignType === "nutrition") {
                      const activePlan = client.assignedNutritionPlans?.find(
                        (plan) => plan.isActive
                      );
                      if (!activePlan) return null;
                      return `${activePlan.nutritionPlan.title} • ${activePlan.nutritionPlan.duration} ${activePlan.nutritionPlan.durationType}`;
                    }
                    return null;
                  })()}
                </p>
                <p className="text-amber-300/90 text-sm mt-1">
                  Client already has an active {assignType} plan.
                </p>
              </div>
            </>
          )}

          {/* Show info message if client has a mock nutrition plan */}
          {assignType === "nutrition" && clientHasMockPlan && (
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  icon="mdi:information"
                  className="text-blue-400"
                  width={20}
                  height={20}
                />
                <p className="text-blue-400 font-medium">
                  Client Using Demo Plan
                </p>
              </div>
              <p className="text-blue-300/90 text-sm">
                This client is currently using a demo nutrition plan. Assigning
                a new plan will replace it.
              </p>
            </div>
          )}

          {assignError && (
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-700/30 mb-4">
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:alert-circle"
                  className="text-red-400"
                  width={20}
                  height={20}
                />
                <p className="text-red-400 font-medium">Assignment Error</p>
              </div>
              <p className="text-red-300/90 text-sm mt-1">{assignError}</p>
            </div>
          )}
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-zinc-400 mb-4">
                Select a {assignType === "training" ? "training" : "nutrition"}{" "}
                plan to assign to{" "}
                <span className="text-white font-medium">
                  {profile.firstName} {profile.lastName}
                </span>
              </p>
            </div>

            {plansLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
                  <p className="mt-2 text-zinc-400 text-sm">Loading plans...</p>
                </div>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-8">
                <Icon
                  icon={
                    assignType === "training"
                      ? "mdi:dumbbell-off"
                      : "mdi:food-off"
                  }
                  className="text-zinc-600 mx-auto mb-4"
                  width={48}
                  height={48}
                />
                <p className="text-zinc-400 mb-2">
                  No {assignType} plans found
                </p>
                <p className="text-zinc-500 text-sm">
                  Create some {assignType} plans first to assign to clients
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative group rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                      selectedPlan?.id === plan.id
                        ? "border-[#3E92CC] bg-[#3E92CC]/5 shadow-lg shadow-[#3E92CC]/20"
                        : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 hover:bg-zinc-800/80"
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {/* Plan Image */}
                    {plan.coverImage && (
                      <div className="relative h-32 w-full overflow-hidden">
                        <Image
                          src={plan.coverImage}
                          alt={plan.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Price Badge */}
                        {plan.price && (
                          <div className="absolute top-2 right-2 bg-[#3E92CC] text-white px-2 py-1 rounded-full text-xs font-medium">
                            ${plan.price}
                          </div>
                        )}

                        {/* Selection Indicator */}
                        {selectedPlan?.id === plan.id && (
                          <div className="absolute top-2 left-2 bg-[#3E92CC] text-white rounded-full p-1">
                            <Icon icon="mdi:check" width={16} height={16} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Plan Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-lg leading-tight">
                          {plan.title}
                        </h4>
                        {!plan.coverImage && selectedPlan?.id === plan.id && (
                          <Icon
                            icon="mdi:check-circle"
                            className="text-[#3E92CC] ml-2 flex-shrink-0"
                            width={20}
                            height={20}
                          />
                        )}
                      </div>

                      <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                        {plan.description}
                      </p>

                      {/* Plan Features */}
                      {plan.keyFeatures && plan.keyFeatures.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {plan.keyFeatures
                              .slice(0, 3)
                              .map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            {plan.keyFeatures.length > 3 && (
                              <span className="px-2 py-1 bg-zinc-700 text-zinc-400 text-xs rounded-full">
                                +{plan.keyFeatures.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Plan Stats */}
                      <div className="grid grid-cols-3 gap-2 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:clock" width={12} height={12} />
                          <span>
                            {plan.duration} {plan.durationType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon
                            icon="mdi:account-group"
                            width={12}
                            height={12}
                          />
                          <span>{plan.clientCount || 0} clients</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:star" width={12} height={12} />
                          <span>4.8/5</span>
                        </div>
                      </div>

                      {/* Nutrition specific info */}
                      {assignType === "nutrition" && plan.nutritionInfo && (
                        <div className="mt-3 pt-3 border-t border-zinc-700">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-zinc-400">
                              <span className="text-orange-400">
                                {plan.nutritionInfo.calories || 0}
                              </span>{" "}
                              cal
                            </div>
                            <div className="text-zinc-400">
                              <span className="text-blue-400">
                                {plan.nutritionInfo.protein || 0}g
                              </span>{" "}
                              protein
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Training specific info */}
                      {assignType === "training" && (
                        <div className="mt-3 pt-3 border-t border-zinc-700">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span>{plan.sessionsPerWeek || 3}x/week</span>
                            <span className="capitalize">
                              {plan.difficultyLevel || "beginner"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {plans.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                {/* Selected Plan Summary */}
                {selectedPlan && (
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h4 className="text-white font-medium mb-2">
                      Selected Plan
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-zinc-300">{selectedPlan.title}</p>
                        <p className="text-zinc-500 text-sm">
                          {selectedPlan.duration} {selectedPlan.durationType}
                        </p>
                      </div>
                      <div className="text-right">
                        {selectedPlan.price && (
                          <p className="text-[#3E92CC] font-bold text-lg">
                            ${selectedPlan.price}
                          </p>
                        )}
                        <p className="text-zinc-500 text-sm">
                          {selectedPlan.clientCount || 0} active clients
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleCloseAssignModal}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  {/* If there's an active plan, show Replace Current Plan button */}
                  {(assignType === "training" &&
                    client.assignedTrainingPlans?.some(
                      (plan) => plan.status === "active"
                    )) ||
                  (assignType === "nutrition" &&
                    (client.assignedNutritionPlans?.some(
                      (plan) => plan.isActive
                    ) ||
                      clientHasMockPlan)) ? (
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white border-none"
                      onClick={async () => {
                        setAssigning(true);
                        setAssignError(null);
                        try {
                          const replaceEndpoint =
                            assignType === "training"
                              ? `/api/coaching-requests/${client.id}/replace-training-plan`
                              : `/api/coaching-requests/${client.id}/replace-nutrition-plan`;

                          const response = await fetch(replaceEndpoint, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              planId: String(selectedPlan.id),
                            }),
                          });
                          const data = await response.json();
                          if (!response.ok || !data.success) {
                            throw new Error(
                              data.error ||
                                `Failed to replace ${assignType} plan`
                            );
                          }
                          setShowAssignModal(false);
                          setSelectedPlan(null);
                          setAssignType(null);
                          fetchClientData();
                        } catch (err) {
                          setAssignError(
                            err.message ||
                              "Failed to replace plan. Please try again."
                          );
                        } finally {
                          setAssigning(false);
                        }
                      }}
                      disabled={!selectedPlan || assigning}
                      leftIcon={
                        assigning ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Icon icon="mdi:check" width={20} height={20} />
                        )
                      }
                      fullWidth
                    >
                      {assigning ? "Replacing..." : "Replace Current Plan"}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleAssignPlanToClient}
                      disabled={!selectedPlan || assigning}
                      leftIcon={
                        assigning ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Icon icon="mdi:check" width={20} height={20} />
                        )
                      }
                      fullWidth
                    >
                      {assigning ? "Assigning..." : "Assign Plan"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      {/* Plan Preview Modal */}
      <PlanPreviewModal
        plan={planPreviewData}
        isOpen={planPreviewOpen}
        onClose={() => setPlanPreviewOpen(false)}
        days={planPreviewData?.days}
        type="training"
      />
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
