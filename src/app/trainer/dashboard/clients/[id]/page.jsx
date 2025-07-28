"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { PlanPreviewModal } from "@/components/custom/dashboard/trainer/pages/plans/components";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { calculateAge } from "@/utils/dateUtils";

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
  const [nutritionPreviewOpen, setNutritionPreviewOpen] = useState(false);
  const [nutritionPreviewData, setNutritionPreviewData] = useState(null);
  const [startingPlanId, setStartingPlanId] = useState(null);
  const [startPlanError, setStartPlanError] = useState(null);
  const [trackingNutritionPlanId, setTrackingNutritionPlanId] = useState(null);
  const [nutritionTrackError, setNutritionTrackError] = useState(null);
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
        // Dohvati i assigned training planove
        const assignedTrainingPlansRes = await fetch(
          `/api/coaching-requests/${clientId}/assigned-training-plans`
        );
        let assignedTrainingPlans = [];
        if (assignedTrainingPlansRes.ok) {
          const assignedTrainingData = await assignedTrainingPlansRes.json();
          assignedTrainingPlans = assignedTrainingData.data || [];
        }

        // Dohvati i assigned nutrition planove
        const assignedNutritionPlansRes = await fetch(
          `/api/coaching-requests/${clientId}/assigned-nutrition-plans`
        );
        let assignedNutritionPlans = [];
        if (assignedNutritionPlansRes.ok) {
          const assignedNutritionData = await assignedNutritionPlansRes.json();
          assignedNutritionPlans = assignedNutritionData.data || [];
        }

        setClient({ 
          ...data.data, 
          assignedTrainingPlans: assignedTrainingPlans,
          assignedNutritionPlans: assignedNutritionPlans 
        });
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
    if (!selectedPlan || !assignType) return;

    try {
      setAssigning(true);
      setAssignError(null);
      
      // Determine API endpoint based on plan type
      const endpoint = assignType === "training" 
        ? `/api/coaching-requests/${client.id}/assign-training-plan`
        : `/api/coaching-requests/${client.id}/assign-nutrition-plan`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: String(selectedPlan.id) }),
      });
      
      const data = await response.json();
      
      // Handle different error messages for training vs nutrition plans
      const planTypeName = assignType === "training" ? "training" : "nutrition";
      if (
        data.error ===
        `Client already has an active ${planTypeName} plan. Complete it before assigning a new one.`
      ) {
        setAssignError(
          `Assigning a new ${planTypeName} plan will end the current ${planTypeName} plan for this client. ` +
            "Click 'End Current & Assign New Plan' to proceed."
        );
        return;
      }
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to assign ${planTypeName} plan`);
      }
      
      setShowAssignModal(false);
      setSelectedPlan(null);
      setAssignType(null);
      fetchClientData();
    } catch (err) {
      console.error("Error assigning plan:", err);
      setAssignError(err.message || "Failed to assign plan. Please try again.");
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

  // Handle nutrition plan preview
  const handleViewNutritionPlan = (plan) => {
    // For assigned plans, the actual plan data is in planData property
    const planDataToShow = plan.planData || plan;
    setNutritionPreviewData(planDataToShow);
    setNutritionPreviewOpen(true);
  };

  // Handler for tracking nutrition plan
  const handleTrackNutritionPlan = async (planId) => {
    if (!client?.id || !planId) return;
    setTrackingNutritionPlanId(planId);
    setNutritionTrackError(null);
    try {
      const res = await fetch(
        `/api/coaching-requests/${client.id}/assigned-nutrition-plan/${planId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "tracking" }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to start tracking nutrition plan");
      }
      fetchClientData();
    } catch (err) {
      setNutritionTrackError(err.message || "Failed to start tracking nutrition plan");
    } finally {
      setTrackingNutritionPlanId(null);
    }
  };

  // State za prikaz gumba End & Assign

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

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "mdi:account-details",
      description: "Client profile and basic information",
    },
    {
      id: "progress",
      label: "Progress",
      icon: "mdi:chart-line",
      description: "Track fitness progress and measurements",
    },
    {
      id: "workouts",
      label: "Workout Plans",
      icon: "mdi:dumbbell",
      description: "Manage workout routines and exercises",
    },
    {
      id: "nutrition",
      label: "Nutrition",
      icon: "mdi:food-apple",
      description: "Meal plans and dietary guidelines",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "mdi:message",
      description: "Communication with client",
    },
  ];

  if (loading) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
            <p className="mt-4 text-zinc-400">Loading client data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-500"
              width={48}
              height={48}
            />
            <p className="mt-4 text-lg font-medium text-white">
              Failed to load client data
            </p>
            <p className="mt-2 text-zinc-400">{error}</p>
            <Button
              variant="primary"
              onClick={fetchClientData}
              leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <Icon
              icon="mdi:account-off"
              className="text-zinc-600"
              width={48}
              height={48}
            />
            <p className="mt-4 text-lg font-medium text-white">
              Client not found
            </p>
            <p className="mt-2 text-zinc-400">
              This client may have been removed or doesn't exist.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/trainer/dashboard/clients")}
              leftIcon={<Icon icon="mdi:arrow-left" width={20} height={20} />}
            >
              Back to Clients
            </Button>
          </div>
        </div>
      </div>
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
      <div className="mb-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/trainer/dashboard/clients")}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200"
          >
            <Icon
              icon="mdi:arrow-left"
              width={20}
              height={20}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="text-sm font-medium">Back to Clients</span>
          </button>
        </div>

        {/* Client Profile Header */}
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-[#3E92CC]/30 shadow-lg">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={`${profile.firstName} profile`}
                className="object-cover w-full h-full"
                width={80}
                height={80}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                <Icon icon="mdi:account" width={32} height={32} color="white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-zinc-400 flex items-center gap-2">
              <Icon icon="mdi:calendar" width={16} height={16} />
              Client since {formatDate(client.respondedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-zinc-800">
          <nav className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-[#3E92CC] text-[#3E92CC]"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon icon={tab.icon} width={20} height={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === "overview" && (
          <OverviewTab
            client={client}
            profile={profile}
            onAssignPlan={handleAssignPlan}
            assignedTrainingPlans={client.assignedTrainingPlans || []}
            assignedNutritionPlans={client.assignedNutritionPlans || []}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "progress" && <ProgressTab client={client} />}
        {activeTab === "workouts" && (
          <WorkoutsTab
            assignedTrainingPlans={client.assignedTrainingPlans || []}
            client={client}
            onViewPlan={(plan) => {
              setPlanPreviewData(plan.planData);
              setPlanPreviewOpen(true);
            }}
            onStartPlan={handleStartPlan}
            startingPlanId={startingPlanId}
            startPlanError={startPlanError}
          />
        )}
        {activeTab === "nutrition" && (
          <NutritionTab 
            clientId={clientId}
            assignedNutritionPlans={client.assignedNutritionPlans || []}
            onViewNutritionPlan={handleViewNutritionPlan}
            onTrackNutritionPlan={handleTrackNutritionPlan}
            trackingNutritionPlanId={trackingNutritionPlanId}
            nutritionTrackError={nutritionTrackError}
          />
        )}
        {activeTab === "messages" && <MessagesTab client={client} />}
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
          {/* Prikaži info/error poruku odmah ako postoji aktivni plan */}
          {assignType === "training" &&
            client.assignedTrainingPlans?.some(
              (plan) => plan.status === "active"
            ) && (
              <>
                <InfoBanner
                  icon="mdi:alert"
                  title="Current Active Plan"
                  subtitle={(() => {
                    const activePlan = client.assignedTrainingPlans.find(
                      (plan) => plan.status === "active"
                    );
                    if (!activePlan) return null;
                    return `${activePlan.planData.title} • ${activePlan.planData.duration} ${activePlan.planData.durationType}`;
                  })()}
                  variant="warning"
                  className="mb-4"
                />
                <ErrorMessage
                  error={"Client already has an active training plan."}
                />
              </>
            )}
          {assignError && <ErrorMessage error={assignError} />}
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
                  {/* Ako postoji aktivni plan, prikazi Replace Current Plan dugme */}
                  {assignType === "training" &&
                  client.assignedTrainingPlans?.some(
                    (plan) => plan.status === "active"
                  ) ? (
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white border-none"
                      onClick={async () => {
                        setAssigning(true);
                        setAssignError(null);
                        try {
                          const response = await fetch(
                            `/api/coaching-requests/${client.id}/replace-training-plan`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                planId: String(selectedPlan.id),
                              }),
                            }
                          );
                          const data = await response.json();
                          if (!response.ok || !data.success) {
                            throw new Error(
                              data.error || "Failed to replace plan"
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
        type={assignType || "training"}
      />
      
      {/* Nutrition Plan Preview Modal */}
      <PlanPreviewModal
        plan={nutritionPreviewData}
        isOpen={nutritionPreviewOpen}
        onClose={() => setNutritionPreviewOpen(false)}
        days={nutritionPreviewData?.days}
        type="nutrition"
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

// Overview Tab Component
function OverviewTab({
  client,
  profile,
  onAssignPlan,
  assignedTrainingPlans,
  assignedNutritionPlans,
  setActiveTab,
}) {
  const getExperienceText = (level) => {
    if (!level) return "Unknown";
    const experienceLevel = EXPERIENCE_LEVELS.find(
      (exp) => exp.value === level
    );
    return experienceLevel ? experienceLevel.label : level;
  };

  const getFitnessGoalText = (goalId) => {
    if (!goalId) return "Unknown Goal";
    const fitnessGoal = FITNESS_GOALS.find((goal) => goal.id === goalId);
    return fitnessGoal ? fitnessGoal.label : goalId;
  };

  const mapActivityToLabel = (activityName) => {
    if (!activityName) return "Unknown Activity";
    const activity = ACTIVITY_TYPES.find(
      (a) =>
        a.id === activityName ||
        (a.label && a.label.toLowerCase() === activityName.toLowerCase())
    );
    return activity
      ? activity.label
      : activityName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Pronađi aktivni training plan
  const activeTrainingPlan = assignedTrainingPlans?.find(
    (plan) => plan.status === "active"
  );

  // Pronađi aktivni nutrition plan
  const activeNutritionPlan = assignedNutritionPlans?.find(
    (plan) => plan.status === "active"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profile Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="mdi:account-details"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">
              Basic Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 text-sm">Full Name</label>
                <p className="text-white font-medium">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
              <div>
                <label className="text-zinc-400 text-sm">Age</label>
                <p className="text-white font-medium">
                  {calculateAge(profile.dateOfBirth)} years
                </p>
              </div>
              <div>
                <label className="text-zinc-400 text-sm">
                  Experience Level
                </label>
                <p className="text-white font-medium">
                  {getExperienceText(profile.experienceLevel)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 text-sm">Location</label>
                <p className="text-white font-medium">
                  {profile.location?.city || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-zinc-400 text-sm">Height</label>
                <p className="text-white font-medium">{profile.height} cm</p>
              </div>
              <div>
                <label className="text-zinc-400 text-sm">Weight</label>
                <p className="text-white font-medium">{profile.weight} kg</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Fitness Goals */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="mdi:target"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Fitness Goals</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-zinc-400 text-sm">Primary Goal</label>
              <p className="text-white font-medium text-lg">
                {getFitnessGoalText(profile.primaryGoal)}
              </p>
            </div>
            {profile.preferredActivities.length > 0 && (
              <div>
                <label className="text-zinc-400 text-sm mb-2 block">
                  Preferred Activities
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.preferredActivities.map((activity) => (
                    <span
                      key={activity.id}
                      className="px-3 py-1.5 bg-blue-900/30 text-blue-400 text-sm rounded-full border border-blue-800/30"
                    >
                      {mapActivityToLabel(activity.name)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Current Plans */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:clipboard-list"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">Current Plans</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="small"
                leftIcon={<Icon icon="mdi:dumbbell" width={16} height={16} />}
                onClick={() => onAssignPlan("training")}
              >
                Assign Training Plan
              </Button>
              <Button
                variant="success"
                size="small"
                leftIcon={<Icon icon="mdi:food-apple" width={16} height={16} />}
                onClick={() => onAssignPlan("nutrition")}
              >
                Assign Meal Plan
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {/* Training Plan */}
            {activeTrainingPlan ? (
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-orange-400"
                    width={20}
                    height={20}
                  />
                  <div>
                    <p className="text-white font-medium">
                      {activeTrainingPlan.planData?.title || "Untitled Training Plan"}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      Training Plan • {activeTrainingPlan.planData?.duration ?? "?"}{" "}
                      {activeTrainingPlan.planData?.durationType ?? ""} • Active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setActiveTab("workouts")}
                  >
                    <Icon icon="mdi:eye" width={16} height={16} />
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Nutrition Plan */}
            {activeNutritionPlan ? (
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:food-apple"
                    className="text-green-400"
                    width={20}
                    height={20}
                  />
                  <div>
                    <p className="text-white font-medium">
                      {activeNutritionPlan.planData?.title || "Untitled Nutrition Plan"}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      Nutrition Plan • {activeNutritionPlan.planData?.duration ?? "?"}{" "}
                      {activeNutritionPlan.planData?.durationType ?? ""} • Active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setActiveTab("nutrition")}
                  >
                    <Icon icon="mdi:eye" width={16} height={16} />
                  </Button>
                </div>
              </div>
            ) : null}

            {/* No Plans State */}
            {!activeTrainingPlan && !activeNutritionPlan && (
              <div className="text-center py-8">
                <Icon
                  icon="mdi:clipboard-outline"
                  className="text-zinc-600 mx-auto mb-2"
                  width={32}
                  height={32}
                />
                <p className="text-zinc-400 text-sm">
                  No active plans assigned
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  Use the buttons above to assign training or nutrition plans
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Payment History */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:credit-card"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">
                Payment History
              </h3>
            </div>
            <Button
              variant="success"
              size="small"
              leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
            >
              Add Payment
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">
                    Training Plan Payment
                  </p>
                  <p className="text-zinc-400 text-sm">Jan 15, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-medium">$49.00</p>
                <p className="text-zinc-500 text-sm">Paid</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">
                    Nutrition Plan Payment
                  </p>
                  <p className="text-zinc-400 text-sm">Jan 1, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-orange-400 font-medium">$100.00</p>
                <p className="text-zinc-500 text-sm">Pending</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Initial Request */}
        {client.note && (
          <Card variant="dark" className="overflow-visible">
            <div className="flex items-center gap-2 mb-4">
              <Icon
                icon="mdi:message-text"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">
                Initial Request
              </h3>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <p className="text-zinc-300 italic">"{client.note}"</p>
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="mdi:lightning-bolt"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={() => onAssignPlan("training")}
              leftIcon={<Icon icon="mdi:dumbbell" width={20} height={20} />}
            >
              Assign Training Plan
            </Button>
            <Button
              variant="success"
              fullWidth
              onClick={() => onAssignPlan("nutrition")}
              leftIcon={<Icon icon="mdi:food-apple" width={20} height={20} />}
            >
              Assign Meal Plan
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={<Icon icon="mdi:message" width={20} height={20} />}
            >
              Send Message
            </Button>
            <Button
              variant="warning"
              fullWidth
              leftIcon={<Icon icon="mdi:calendar" width={20} height={20} />}
            >
              Schedule Session
            </Button>
            <Button
              variant="info"
              fullWidth
              leftIcon={<Icon icon="mdi:chart-line" width={20} height={20} />}
            >
              View Progress
            </Button>
          </div>
        </Card>

        {/* Client Statistics */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="mdi:chart-box"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Statistics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Total Workouts</span>
              <span className="text-white font-medium">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Completion Rate</span>
              <span className="text-green-400 font-medium">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Weight Progress</span>
              <span className="text-blue-400 font-medium">-2.5 kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Total Spent</span>
              <span className="text-[#3E92CC] font-medium">$149.00</span>
            </div>
          </div>
        </Card>

        {/* Medical Information */}
        {(profile.medicalConditions || profile.allergies) && (
          <Card variant="dark" className="overflow-visible">
            <div className="flex items-center gap-2 mb-4">
              <Icon
                icon="mdi:medical-bag"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">
                Medical Information
              </h3>
            </div>
            <div className="space-y-3">
              {profile.medicalConditions && (
                <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      icon="mdi:medical-bag"
                      className="text-amber-400"
                      width={16}
                      height={16}
                    />
                    <span className="text-amber-400 font-medium text-sm">
                      Medical Conditions
                    </span>
                  </div>
                  <p className="text-amber-300/90 text-sm">
                    {profile.medicalConditions}
                  </p>
                </div>
              )}
              {profile.allergies && (
                <div className="bg-red-900/20 rounded-lg p-3 border border-red-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      icon="mdi:alert"
                      className="text-red-400"
                      width={16}
                      height={16}
                    />
                    <span className="text-red-400 font-medium text-sm">
                      Allergies
                    </span>
                  </div>
                  <p className="text-red-300/90 text-sm">{profile.allergies}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="mdi:history"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">Completed workout</p>
                <p className="text-zinc-400 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">Logged meal</p>
                <p className="text-zinc-400 text-xs">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">Weight update</p>
                <p className="text-zinc-400 text-xs">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Client Status */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="mdi:account-check"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Client Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Status</span>
              <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Client Since</span>
              <span className="text-white text-sm">
                {new Date(client.respondedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Last Activity</span>
              <span className="text-white text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Next Session</span>
              <span className="text-[#3E92CC] text-sm">Tomorrow 10:00 AM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Progress Tab Component
function ProgressTab({ client }) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:weight-kilogram"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Current Weight</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {client.client.clientProfile.weight} kg
          </p>
          <p className="text-green-400 text-sm mt-1">-2.5 kg this month</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:target"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Goal Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">75%</p>
          <p className="text-blue-400 text-sm mt-1">On track</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:fire"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Workouts This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">4/5</p>
          <p className="text-orange-400 text-sm mt-1">1 more to go</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:trophy"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-yellow-400 text-sm mt-1">3 this month</p>
        </Card>
      </div>

      {/* Progress Charts and Body Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress Chart */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:chart-line"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">
                Weight Progress
              </h3>
            </div>
            <Button variant="secondary" size="small">
              <Icon icon="mdi:plus" width={16} height={16} />
              Add Entry
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <p className="text-zinc-400">
              Weight progress chart coming soon...
            </p>
          </div>
        </Card>

        {/* Body Measurements */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:human-male-height"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">
                Body Measurements
              </h3>
            </div>
            <Button variant="secondary" size="small">
              <Icon icon="mdi:plus" width={16} height={16} />
              Update
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Chest</span>
              <span className="text-white font-medium">102 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Waist</span>
              <span className="text-white font-medium">85 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Hips</span>
              <span className="text-white font-medium">95 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Arms</span>
              <span className="text-white font-medium">35 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Thighs</span>
              <span className="text-white font-medium">58 cm</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Workout Analytics */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:chart-bar"
            className="text-[#3E92CC]"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">
            Workout Analytics
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:clock"
              className="text-orange-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">24.5h</p>
            <p className="text-zinc-400 text-sm">Total Time</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:fire"
              className="text-red-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">12,450</p>
            <p className="text-zinc-400 text-sm">Calories Burned</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:trending-up"
              className="text-green-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">+15%</p>
            <p className="text-zinc-400 text-sm">Strength Gain</p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center">
          <p className="text-zinc-400">
            Workout analytics chart coming soon...
          </p>
        </div>
      </Card>

      {/* Goal Tracking */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:bullseye-arrow"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Goal Tracking</h3>
          </div>
          <Button variant="primary" size="small">
            <Icon icon="mdi:plus" width={16} height={16} />
            Add Goal
          </Button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Lose 5kg</h4>
              <span className="text-green-400 text-sm">75% complete</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-zinc-400 text-sm">
              Target: Feb 28, 2024 • 3.75kg lost
            </p>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Bench Press 80kg</h4>
              <span className="text-blue-400 text-sm">60% complete</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <p className="text-zinc-400 text-sm">
              Target: Mar 15, 2024 • Current: 65kg
            </p>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Run 5km in 25min</h4>
              <span className="text-orange-400 text-sm">40% complete</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
              <div
                className="bg-orange-400 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
            <p className="text-zinc-400 text-sm">
              Target: Apr 1, 2024 • Current: 30min
            </p>
          </div>
        </div>
      </Card>

      {/* Progress Photos */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:camera"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">
              Progress Photos
            </h3>
          </div>
          <Button variant="primary" size="small">
            <Icon icon="mdi:plus" width={16} height={16} />
            Add Photo
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="mdi:calendar"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Week 1</p>
            </div>
          </div>
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="mdi:calendar"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Week 4</p>
            </div>
          </div>
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="mdi:calendar"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Week 8</p>
            </div>
          </div>
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center border-dashed">
            <div className="text-center">
              <Icon
                icon="mdi:plus"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Add Photo</p>
            </div>
          </div>
        </div>
      </Card>
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
        // Lazy load detailed plan data
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

      {/* Expanded Details */}
      {showDetails && planDetails && (
        <div className="border-t border-white/10 p-4 sm:p-6">
          <div className="space-y-4">
            {/* Workout Summary */}
            {plan.status === "completed" && (
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Icon
                    icon="mdi:chart-line"
                    width={16}
                    height={16}
                    className="text-green-400"
                  />
                  Completion Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Days Completed</div>
                    <div className="text-white font-semibold">
                      {stats?.completedDays || 0}/{stats?.totalDays || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Exercises Done</div>
                    <div className="text-white font-semibold">
                      {stats?.completedExercises || 0}/
                      {stats?.totalExercises || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Completion Rate</div>
                    <div className="text-green-400 font-semibold">
                      {Math.round(
                        ((stats?.completedDays || 0) /
                          (stats?.totalDays || 1)) *
                          100
                      )}
                      %
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Status</div>
                    <div className="text-green-400 font-semibold">
                      ✓ Finished
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Workouts */}
            {planDetails.schedule && (
              <div>
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Icon
                    icon="mdi:format-list-bulleted"
                    width={16}
                    height={16}
                    className="text-blue-400"
                  />
                  Workout Days ({planDetails.schedule.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {planDetails.schedule.map((day, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            day.workoutStatus === "completed"
                              ? "bg-green-600 text-white"
                              : "bg-slate-600 text-white"
                          }`}
                        >
                          {day.workoutStatus === "completed" ? "✓" : idx + 1}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {day.name}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {day.exercises?.length || 0} exercises •{" "}
                            {day.duration || 60} min
                          </div>
                        </div>
                      </div>
                      <div className="text-xs">
                        {day.workoutStatus === "completed" && (
                          <span className="text-green-400">Completed</span>
                        )}
                        {day.workoutStatus !== "completed" && (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Workouts Tab Component
function WorkoutsTab({
  assignedTrainingPlans,
  client,
  onViewPlan,
  onStartPlan,
  startingPlanId,
  startPlanError,
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Training Plans</h2>
        <Link href="/trainer/dashboard/plans">
          <Button
            variant="primary"
            leftIcon={<Icon icon="mdi:plus" width={18} height={18} />}
            className="w-full sm:w-auto"
          >
            Create New Plan
          </Button>
        </Link>
      </div>

      {/* Training Plans History */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <Icon
            icon="mdi:history"
            className="text-blue-400"
            width={20}
            height={20}
          />
          <h3 className="text-lg font-semibold text-white">
            Assigned Training Plans History
          </h3>
        </div>

        {startPlanError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="text-red-400 text-sm">{startPlanError}</div>
          </div>
        )}

        <div className="space-y-4">
          {assignedTrainingPlans && assignedTrainingPlans.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <Icon
                icon="mdi:clipboard-outline"
                className="text-slate-600 mx-auto mb-3"
                width={48}
                height={48}
              />
              <p className="text-slate-400 text-lg font-medium mb-2">
                No Training Plans Yet
              </p>
              <p className="text-slate-500 text-sm">
                Create and assign training plans to start tracking workouts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Messages Tab Component
function MessagesTab({}) {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: "client",
      text: "Hey! Just finished today's workout. The bench press felt much easier than last week!",
      time: "2:30 PM",
      date: "Today",
    },
    {
      id: 2,
      sender: "trainer",
      text: "That's fantastic! Your form has improved significantly. Keep up the great work! 💪",
      time: "2:32 PM",
      date: "Today",
    },
    {
      id: 3,
      sender: "client",
      text: "Quick question about tomorrow's leg day - should I increase the weight on squats?",
      time: "3:15 PM",
      date: "Today",
    },
    {
      id: 4,
      sender: "trainer",
      text: "Here's your updated meal plan for this week. Focus on hitting your protein targets!",
      time: "10:30 AM",
      date: "Yesterday",
      file: "meal-plan-week3.pdf",
    },
    {
      id: 5,
      sender: "client",
      text: "Perfect! Thanks for the meal plan. I'll start implementing it today.",
      time: "11:45 AM",
      date: "Yesterday",
    },
  ]);
  const [newMessage, setNewMessage] = React.useState("");
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  // Auto-scroll to bottom on new message
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showVideoModal]);

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push(msg);
    return acc;
  }, {});

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "trainer",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: "Today",
      },
    ]);
    setNewMessage("");
  };

  // Helper for avatar (initials)
  const getAvatar = (sender) => (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-md border-2 select-none ${
        sender === "trainer"
          ? "bg-gradient-to-br from-blue-600 to-blue-400 border-blue-400"
          : "bg-gradient-to-br from-zinc-700 to-zinc-500 border-zinc-400"
      }`}
    >
      {sender === "trainer" ? "T" : "C"}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-180px)] sm:h-[600px]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between rounded-t-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Messages
        </h2>
        <button
          onClick={() => setShowVideoModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Icon icon="mdi:video" width={20} height={20} />
          Video Call
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto bg-zinc-900/80 px-4 py-6 rounded-b-2xl rounded-t-none border-x border-b border-zinc-700/50 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <Icon
              icon="mdi:chat-outline"
              width={48}
              height={48}
              className="mb-2"
            />
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start the conversation below!</p>
          </div>
        )}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <React.Fragment key={date}>
            <div className="text-center my-4">
              <span className="text-zinc-500 text-xs bg-zinc-800 px-3 py-1 rounded-full shadow">
                {date}
              </span>
            </div>
            {msgs.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 mb-2 group ${
                  msg.sender === "trainer" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "client" && getAvatar("client")}
                <div
                  className={`max-w-[70%] flex flex-col ${
                    msg.sender === "trainer" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`relative px-4 py-2 rounded-2xl shadow-md transition-all duration-200 text-base whitespace-pre-line break-words ${
                      msg.sender === "trainer"
                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-md"
                        : "bg-zinc-800/80 text-zinc-100 rounded-bl-md"
                    } ${idx === msgs.length - 1 ? "animate-fade-in" : ""}`}
                  >
                    {msg.text}
                    {msg.file && (
                      <div className="mt-2 p-2 bg-blue-900/30 rounded border border-blue-700/30 flex items-center gap-2">
                        <Icon
                          icon="mdi:file-document"
                          className="text-blue-400"
                          width={16}
                          height={16}
                        />
                        <span className="text-blue-400 text-xs">
                          {msg.file}
                        </span>
                      </div>
                    )}
                    {/* Timestamp on hover */}
                    <span
                      className={`absolute -bottom-5 right-2 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none`}
                    >
                      {msg.time}
                    </span>
                  </div>
                  {/* Always show timestamp below bubble, smaller on mobile */}
                  <span className="mt-1 text-xs text-zinc-500/80 select-none sm:hidden block">
                    {msg.time}
                  </span>
                </div>
                {msg.sender === "trainer" && getAvatar("trainer")}
              </div>
            ))}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="bg-zinc-900/90 border-t border-zinc-800 px-4 py-3 flex items-center gap-3 rounded-b-2xl shadow-lg">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 bg-zinc-800/70 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none resize-none shadow-sm transition-all"
          style={{ minHeight: 44, maxHeight: 120 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          <Icon icon="mdi:send" width={22} height={22} />
        </button>
      </div>

      {/* Video Call Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl max-w-3xl w-full overflow-hidden relative">
            <div className="flex items-center justify-between p-6 border-b border-zinc-700 bg-zinc-900/95">
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:video"
                  width={28}
                  height={28}
                  className="text-blue-400"
                />
                <h3 className="text-2xl font-bold text-white">Video Call</h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Close video call"
              >
                <Icon
                  icon="mdi:close"
                  width={28}
                  height={28}
                  className="text-zinc-400"
                />
              </button>
            </div>
            <div className="p-4 bg-black">
              <iframe
                src="https://meet.jit.si/AntiqueBodyDemoRoom"
                allow="camera; microphone; fullscreen; display-capture"
                className="w-full h-[500px] rounded-xl border-none bg-black"
                title="Video Call"
              />
              <div className="mt-4 text-center text-zinc-400 text-base">
                Video poziv je pokrenut. Pošaljite link klijentu ako je
                potrebno.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Nutrition Tab Component
function NutritionTab({ 
  clientId,
  assignedNutritionPlans, 
  onViewNutritionPlan, 
  onTrackNutritionPlan,
  trackingNutritionPlanId,
  nutritionTrackError 
}) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Nutrition Plans</h2>
        <Link href="/trainer/dashboard/plans/nutrition">
          <Button
            variant="success"
            leftIcon={<Icon icon="mdi:plus" width={18} height={18} />}
            className="w-full sm:w-auto"
          >
            Create New Nutrition Plan
          </Button>
        </Link>
      </div>

      {/* Nutrition Plans History */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <Icon
            icon="mdi:history"
            className="text-green-400"
            width={20}
            height={20}
          />
          <h3 className="text-lg font-semibold text-white">
            Assigned Nutrition Plans History
          </h3>
        </div>

        {nutritionTrackError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="text-red-400 text-sm">{nutritionTrackError}</div>
          </div>
        )}

        <div className="space-y-4">
          {assignedNutritionPlans && assignedNutritionPlans.length > 0 ? (
            assignedNutritionPlans.map((plan) => (
              <NutritionPlanCard
                key={plan.id}
                plan={plan}
                clientId={clientId}
                onViewPlan={onViewNutritionPlan}
                onTrackPlan={onTrackNutritionPlan}
                trackingPlanId={trackingNutritionPlanId}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Icon
                icon="mdi:food-outline"
                className="text-zinc-600 mx-auto mb-3"
                width={48}
                height={48}
              />
              <p className="text-zinc-400 mb-2">No nutrition plans assigned yet</p>
              <p className="text-zinc-500 text-sm">
                Create and assign nutrition plans to help your client with their dietary goals.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Nutrition Overview */}
      {assignedNutritionPlans?.find(plan => plan.status === "active" || plan.status === "tracking") && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:chart-line"
                className="text-green-400"
                width={20}
                height={20}
              />
              <h3 className="text-lg font-semibold text-white">
                Current Nutrition Progress
              </h3>
            </div>
            {assignedNutritionPlans?.find(plan => plan.status === "tracking") && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Tracking Active</span>
              </div>
            )}
          </div>
          
          {/* Daily Nutrition Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  icon="mdi:fire"
                  className="text-orange-400"
                  width={20}
                  height={20}
                />
                <span className="text-zinc-400 text-sm">Calories</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {assignedNutritionPlans?.find(plan => plan.status === "active" || plan.status === "tracking")?.planData?.nutritionInfo?.calories || "-"}
                  </p>
                  <p className="text-zinc-400 text-xs">per day</p>
                </div>
              </div>
            </Card>
            
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  icon="mdi:food-drumstick"
                  className="text-blue-400"
                  width={20}
                  height={20}
                />
                <span className="text-zinc-400 text-sm">Protein</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {assignedNutritionPlans?.find(plan => plan.status === "active" || plan.status === "tracking")?.planData?.nutritionInfo?.protein || "-"}g
                  </p>
                  <p className="text-zinc-400 text-xs">grams</p>
                </div>
              </div>
            </Card>
            
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  icon="mdi:grain"
                  className="text-yellow-400"
                  width={20}
                  height={20}
                />
                <span className="text-zinc-400 text-sm">Carbs</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {assignedNutritionPlans?.find(plan => plan.status === "active" || plan.status === "tracking")?.planData?.nutritionInfo?.carbs || "-"}g
                  </p>
                  <p className="text-zinc-400 text-xs">grams</p>
                </div>
              </div>
            </Card>
            
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  icon="mdi:water"
                  className="text-green-400"
                  width={20}
                  height={20}
                />
                <span className="text-zinc-400 text-sm">Fats</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {assignedNutritionPlans?.find(plan => plan.status === "active" || plan.status === "tracking")?.planData?.nutritionInfo?.fats || "-"}g
                  </p>
                  <p className="text-zinc-400 text-xs">grams</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Nutrition Plan Timeline */}
          {assignedNutritionPlans?.find(plan => plan.status === "tracking") && (
            <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  icon="mdi:timeline"
                  className="text-green-400"
                  width={16}
                  height={16}
                />
                <h4 className="text-white font-medium">Tracking Progress</h4>
              </div>
              <div className="text-zinc-400 text-sm">
                <p>• Nutrition plan is actively being tracked</p>
                <p>• Monitor client's daily nutrition intake</p>
                <p>• Review meal compliance and progress weekly</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Nutrition Plan Card Component
function NutritionPlanCard({ plan, clientId, onViewPlan, onTrackPlan, trackingPlanId }) {
  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "completed":
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "paused":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      default:
        return "text-zinc-400 bg-zinc-400/10 border-zinc-400/30";
    }
  };

  return (
    <div className="border border-zinc-700 rounded-xl p-4 sm:p-6 bg-zinc-800/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:food-apple" className="text-white" width={24} height={24} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-white truncate">
                {plan.planData?.title || "Untitled Nutrition Plan"}
              </h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  plan.status
                )}`}
              >
                {plan.status?.charAt(0).toUpperCase() + plan.status?.slice(1) || "Unknown"}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-3">
              {plan.planData?.description || "No description available"}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1">
                <Icon icon="mdi:calendar" width={16} height={16} />
                <span>Assigned: {formatDate(plan.assignedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:clock" width={16} height={16} />
                <span>
                  {plan.planData?.duration} {plan.planData?.durationType}
                </span>
              </div>
              {plan.planData?.targetGoal && (
                <div className="flex items-center gap-1">
                  <Icon icon="mdi:target" width={16} height={16} />
                  <span>{plan.planData.targetGoal}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="small"
            leftIcon={<Icon icon="mdi:eye" width={16} height={16} />}
            onClick={() => onViewPlan && onViewPlan(plan)}
          >
            View Details
          </Button>
          {plan.status === "active" && onTrackPlan && (
            <Button
              variant="success"
              size="small"
              leftIcon={
                trackingPlanId === plan.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Icon icon="mdi:chart-line" width={16} height={16} />
                )
              }
              onClick={() => onTrackPlan(plan.id)}
              disabled={trackingPlanId === plan.id}
            >
              {trackingPlanId === plan.id ? "Tracking..." : "Track Progress"}
            </Button>
          )}
          {(plan.status === "active" || plan.status === "tracking") && (
            <Link href={`/trainer/dashboard/clients/${clientId}/nutrition/${plan.id}`}>
              <Button
                variant="primary"
                size="small"
                leftIcon={<Icon icon="mdi:food-apple" width={16} height={16} />}
              >
                Open Tracking
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
