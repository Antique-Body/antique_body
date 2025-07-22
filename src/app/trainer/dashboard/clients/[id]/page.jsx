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
  const [startingPlanId, setStartingPlanId] = useState(null);
  const [startPlanError, setStartPlanError] = useState(null);
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
        // Dohvati i assigned planove
        const assignedPlansRes = await fetch(
          `/api/coaching-requests/${clientId}/assigned-training-plans`
        );
        let assignedPlans = [];
        if (assignedPlansRes.ok) {
          const assignedData = await assignedPlansRes.json();
          assignedPlans = assignedData.data || [];
        }
        setClient({ ...data.data, assignedTrainingPlans: assignedPlans });
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
      // Novi API poziv za assignanje plana
      const response = await fetch(
        `/api/coaching-requests/${client.id}/assign-training-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: selectedPlan.id }),
        }
      );
      const data = await response.json();
      if (
        data.error ===
        "Client already has an active training plan. Complete it before assigning a new one."
      ) {
        setAssignError(
          "Assigning a new plan will end the current plan for this client. " +
            "Click 'End Current & Assign New Plan' to proceed."
        );
        return;
      }
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to assign plan");
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
        {activeTab === "nutrition" && <NutritionTab client={client} />}
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
                              body: JSON.stringify({ planId: selectedPlan.id }),
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
        type="training"
      />
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  client,
  profile,
  onAssignPlan,
  assignedTrainingPlans,
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

  // Pronađi aktivni plan
  const activePlan = assignedTrainingPlans?.find(
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

        {/* Current Plan */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:clipboard-list"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">Current Plan</h3>
            </div>
            <Button
              variant="primary"
              size="small"
              leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
              onClick={() => onAssignPlan("training")}
            >
              {activePlan ? "Replace Plan" : "Assign Plan"}
            </Button>
          </div>
          <div className="space-y-3">
            {activePlan ? (
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
                      {activePlan.planData.title}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      {activePlan.planData.duration}{" "}
                      {activePlan.planData.durationType} • Active
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
            ) : (
              <div className="text-center py-6">
                <Icon
                  icon="mdi:clipboard-outline"
                  className="text-zinc-600 mx-auto mb-2"
                  width={32}
                  height={32}
                />
                <p className="text-zinc-400 text-sm">
                  No active plans assigned
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

// Workouts Tab Component
function WorkoutsTab({
  assignedTrainingPlans,
  client,
  onViewPlan,
  onStartPlan,
  startingPlanId,
  startPlanError,
}) {
  console.log("Assigned Training Plans History:", assignedTrainingPlans);
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Workout Management</h2>
        <div className="flex gap-2">
          <Link href="/trainer/dashboard/plans">
            <Button
              variant="primary"
              leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
            >
              Create Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Historija svih dodijeljenih planova */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:history"
            className="text-[#3E92CC]"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">
            Assigned Training Plans History
          </h3>
        </div>
        {startPlanError && (
          <div className="text-red-500 text-sm mb-2">{startPlanError}</div>
        )}
        <div className="space-y-3">
          {assignedTrainingPlans && assignedTrainingPlans.length > 0 ? (
            assignedTrainingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  plan.status === "active"
                    ? "bg-blue-900/30 border-blue-500/70 shadow-lg"
                    : "bg-zinc-800/50 border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:dumbbell"
                    className={
                      plan.status === "completed"
                        ? "text-green-400"
                        : plan.status === "active"
                        ? "text-blue-400"
                        : "text-orange-400"
                    }
                    width={20}
                    height={20}
                  />
                  <div>
                    <p className="text-white font-medium flex items-center gap-2">
                      {plan.planData.title}
                      {plan.status === "active" && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-700/60 text-blue-200 text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      {plan.planData.duration} {plan.planData.durationType} •{" "}
                      {plan.status.charAt(0).toUpperCase() +
                        plan.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => onViewPlan(plan)}
                  >
                    <Icon icon="mdi:eye" width={16} height={16} />
                  </Button>
                  {plan.status !== "completed" && plan.status !== "active" && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onStartPlan(plan.id)}
                      loading={startingPlanId === plan.id}
                    >
                      Start Plan
                    </Button>
                  )}
                  {plan.status === "active" && (
                    <Link
                      href={`/trainer/dashboard/clients/${client.id}/plans/${plan.id}`}
                      passHref
                    >
                      <Button
                        as="a"
                        variant="info"
                        size="small"
                        className="ml-2"
                      >
                        <Icon icon="mdi:open-in-new" width={16} height={16} />
                        Open & Track Plan
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Icon
                icon="mdi:clipboard-outline"
                className="text-zinc-600 mx-auto mb-2"
                width={32}
                height={32}
              />
              <p className="text-zinc-400 text-sm">
                No assigned training plans
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Nutrition Tab Component
function NutritionTab({}) {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Nutrition Management
        </h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            leftIcon={<Icon icon="mdi:calculator" width={20} height={20} />}
          >
            Macro Calculator
          </Button>
          <Button
            variant="primary"
            leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
          >
            Create Meal Plan
          </Button>
        </div>
      </div>

      {/* Daily Nutrition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:fire"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Calories</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">1,845</p>
              <p className="text-zinc-400 text-xs">/ 2,200 goal</p>
            </div>
            <div className="w-12 h-12">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-700"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-orange-400 border-t-transparent"
                  style={{ transform: "rotate(270deg)" }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-orange-400 text-sm mt-1">355 remaining</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:food-drumstick"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Protein</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">125g</p>
              <p className="text-zinc-400 text-xs">/ 150g goal</p>
            </div>
            <div className="w-12 h-12">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-700"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent"
                  style={{ transform: "rotate(225deg)" }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-blue-400 text-sm mt-1">25g remaining</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:grain"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Carbs</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">180g</p>
              <p className="text-zinc-400 text-xs">/ 200g goal</p>
            </div>
            <div className="w-12 h-12">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-700"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-green-400 border-t-transparent"
                  style={{ transform: "rotate(324deg)" }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-green-400 text-sm mt-1">20g remaining</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:water"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Water</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">2.1L</p>
              <p className="text-zinc-400 text-xs">/ 3.0L goal</p>
            </div>
            <div className="w-12 h-12">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-700"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent"
                  style={{ transform: "rotate(252deg)" }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-cyan-400 text-sm mt-1">0.9L remaining</p>
        </Card>
      </div>

      {/* Current Meal Plan */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:food-apple"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">
              Current Meal Plan
            </h3>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="small">
              <Icon icon="mdi:pencil" width={16} height={16} />
              Edit
            </Button>
            <Button variant="primary" size="small">
              <Icon icon="mdi:eye" width={16} height={16} />
              View Full Plan
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Plan Name</span>
              <span className="text-white font-medium">
                Muscle Gain Nutrition
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Duration</span>
              <span className="text-white">8 weeks</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Daily Calories</span>
              <span className="text-white">2,200 kcal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Meal Frequency</span>
              <span className="text-white">5 meals/day</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Progress</span>
              <span className="text-green-400">Week 2/8 (25%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Adherence</span>
              <span className="text-blue-400">87%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Target Goal</span>
              <span className="text-white">Muscle Gain</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Meals */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:clock"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Today's Meals</h3>
          </div>
          <Button variant="primary" size="small">
            <Icon icon="mdi:plus" width={16} height={16} />
            Log Meal
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:check-circle"
                className="text-green-400"
                width={20}
                height={20}
              />
              <div>
                <h4 className="text-white font-medium">Breakfast</h4>
                <p className="text-zinc-400 text-sm">
                  Protein Pancakes & Greek Yogurt
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">485 kcal</p>
              <p className="text-zinc-400 text-sm">38g protein</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:check-circle"
                className="text-green-400"
                width={20}
                height={20}
              />
              <div>
                <h4 className="text-white font-medium">Lunch</h4>
                <p className="text-zinc-400 text-sm">Grilled Chicken Salad</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">420 kcal</p>
              <p className="text-zinc-400 text-sm">35g protein</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-900/20 rounded-lg border border-orange-700/30">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:clock"
                className="text-orange-400"
                width={20}
                height={20}
              />
              <div>
                <h4 className="text-white font-medium">Snack</h4>
                <p className="text-zinc-400 text-sm">Protein Shake & Banana</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">280 kcal</p>
              <p className="text-zinc-400 text-sm">25g protein</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:circle-outline"
                className="text-zinc-500"
                width={20}
                height={20}
              />
              <div>
                <h4 className="text-zinc-300 font-medium">Dinner</h4>
                <p className="text-zinc-500 text-sm">Salmon & Sweet Potato</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 font-medium">520 kcal</p>
              <p className="text-zinc-500 text-sm">42g protein</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Meal Library */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:library"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Meal Library</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="small">
              <Icon icon="mdi:filter" width={16} height={16} />
              Filter
            </Button>
            <Button variant="primary" size="small">
              <Icon icon="mdi:plus" width={16} height={16} />
              Add Meal
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:egg"
                className="text-yellow-400"
                width={20}
                height={20}
              />
              <h4 className="text-white font-medium">Protein Pancakes</h4>
            </div>
            <p className="text-zinc-400 text-sm mb-2">High protein breakfast</p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>485 kcal</span>
              <span>38g protein</span>
            </div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:food-drumstick"
                className="text-orange-400"
                width={20}
                height={20}
              />
              <h4 className="text-white font-medium">Grilled Chicken</h4>
            </div>
            <p className="text-zinc-400 text-sm mb-2">Lean protein source</p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>420 kcal</span>
              <span>35g protein</span>
            </div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:fish"
                className="text-blue-400"
                width={20}
                height={20}
              />
              <h4 className="text-white font-medium">Salmon Bowl</h4>
            </div>
            <p className="text-zinc-400 text-sm mb-2">Omega-3 rich meal</p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>520 kcal</span>
              <span>42g protein</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Supplements */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:pill"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Supplements</h3>
          </div>
          <Button variant="primary" size="small">
            <Icon icon="mdi:plus" width={16} height={16} />
            Add Supplement
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Whey Protein</h4>
              <Icon
                icon="mdi:check-circle"
                className="text-green-400"
                width={20}
                height={20}
              />
            </div>
            <p className="text-zinc-400 text-sm mb-2">25g per serving</p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Post-workout</span>
              <span>Daily</span>
            </div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Creatine</h4>
              <Icon
                icon="mdi:clock"
                className="text-orange-400"
                width={20}
                height={20}
              />
            </div>
            <p className="text-zinc-400 text-sm mb-2">5g per serving</p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Pre-workout</span>
              <span>Daily</span>
            </div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Multivitamin</h4>
              <Icon
                icon="mdi:check-circle"
                className="text-green-400"
                width={20}
                height={20}
              />
            </div>
            <p className="text-zinc-400 text-sm mb-2">1 tablet</p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Morning</span>
              <span>Daily</span>
            </div>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Omega-3</h4>
              <Icon
                icon="mdi:circle-outline"
                className="text-zinc-500"
                width={20}
                height={20}
              />
            </div>
            <p className="text-zinc-400 text-sm mb-2">1000mg</p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>With meals</span>
              <span>2x daily</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Nutrition Analytics */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:chart-pie"
            className="text-[#3E92CC]"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">
            Nutrition Analytics
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:trending-up"
              className="text-green-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">87%</p>
            <p className="text-zinc-400 text-sm">Adherence Rate</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:calendar-check"
              className="text-blue-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">14</p>
            <p className="text-zinc-400 text-sm">Days Tracked</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:target"
              className="text-orange-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">+1.2kg</p>
            <p className="text-zinc-400 text-sm">Weight Change</p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center">
          <p className="text-zinc-400">
            Nutrition analytics chart coming soon...
          </p>
        </div>
      </Card>
    </div>
  );
}

// Messages Tab Component
function MessagesTab({}) {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Communication</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            leftIcon={<Icon icon="mdi:video" width={20} height={20} />}
          >
            Video Call
          </Button>
          <Button
            variant="primary"
            leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
          >
            New Message
          </Button>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:message-text"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Total Messages</span>
          </div>
          <p className="text-2xl font-bold text-white">127</p>
          <p className="text-green-400 text-sm mt-1">+5 this week</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:clock"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Response Time</span>
          </div>
          <p className="text-2xl font-bold text-white">2.5h</p>
          <p className="text-blue-400 text-sm mt-1">Average</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:video"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Video Calls</span>
          </div>
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-orange-400 text-sm mt-1">This month</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:file-document"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Files Shared</span>
          </div>
          <p className="text-2xl font-bold text-white">23</p>
          <p className="text-purple-400 text-sm mt-1">Documents</p>
        </Card>
      </div>

      {/* Message Composer */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:pencil"
            className="text-[#3E92CC]"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">Send Message</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:tag"
              className="text-zinc-400"
              width={16}
              height={16}
            />
            <span className="text-zinc-400 text-sm">Subject</span>
          </div>
          <input
            type="text"
            placeholder="Message subject..."
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-[#3E92CC] focus:outline-none transition-colors"
          />
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:message-text"
              className="text-zinc-400"
              width={16}
              height={16}
            />
            <span className="text-zinc-400 text-sm">Message</span>
          </div>
          <textarea
            placeholder="Type your message here..."
            rows={4}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-[#3E92CC] focus:outline-none transition-colors resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="small">
                <Icon icon="mdi:attachment" width={16} height={16} />
                Attach File
              </Button>
              <Button variant="secondary" size="small">
                <Icon icon="mdi:emoticon" width={16} height={16} />
                Emoji
              </Button>
            </div>
            <Button variant="primary">
              <Icon icon="mdi:send" width={16} height={16} />
              Send Message
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Responses */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:lightning-bolt"
            className="text-[#3E92CC]"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">Quick Responses</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors text-left">
            <p className="text-white font-medium text-sm">
              Great job on today's workout!
            </p>
            <p className="text-zinc-400 text-xs mt-1">Workout encouragement</p>
          </button>
          <button className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors text-left">
            <p className="text-white font-medium text-sm">
              Don't forget to log your meals
            </p>
            <p className="text-zinc-400 text-xs mt-1">Nutrition reminder</p>
          </button>
          <button className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors text-left">
            <p className="text-white font-medium text-sm">
              How are you feeling today?
            </p>
            <p className="text-zinc-400 text-xs mt-1">Check-in question</p>
          </button>
          <button className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors text-left">
            <p className="text-white font-medium text-sm">
              Let's schedule your next session
            </p>
            <p className="text-zinc-400 text-xs mt-1">Scheduling</p>
          </button>
        </div>
      </Card>

      {/* Message History */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:history"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">
              Message History
            </h3>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="small">
              <Icon icon="mdi:filter" width={16} height={16} />
              Filter
            </Button>
            <Button variant="secondary" size="small">
              <Icon icon="mdi:download" width={16} height={16} />
              Export
            </Button>
          </div>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Today's Messages */}
          <div className="text-center">
            <span className="text-zinc-500 text-sm bg-zinc-800 px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#3E92CC] rounded-full flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:account" width={16} height={16} color="white" />
            </div>
            <div className="flex-1">
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <p className="text-white text-sm">
                  Hey! Just finished today's workout. The bench press felt much
                  easier than last week!
                </p>
                <p className="text-zinc-400 text-xs mt-2">2:30 PM</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 justify-end">
            <div className="flex-1 max-w-md">
              <div className="bg-[#3E92CC] rounded-lg p-3 ml-auto">
                <p className="text-white text-sm">
                  That's fantastic! Your form has improved significantly. Keep
                  up the great work! 💪
                </p>
                <p className="text-blue-100 text-xs mt-2">2:32 PM</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:account" width={16} height={16} color="white" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#3E92CC] rounded-full flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:account" width={16} height={16} color="white" />
            </div>
            <div className="flex-1">
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <p className="text-white text-sm">
                  Quick question about tomorrow's leg day - should I increase
                  the weight on squats?
                </p>
                <p className="text-zinc-400 text-xs mt-2">3:15 PM</p>
              </div>
            </div>
          </div>

          {/* Yesterday's Messages */}
          <div className="text-center">
            <span className="text-zinc-500 text-sm bg-zinc-800 px-3 py-1 rounded-full">
              Yesterday
            </span>
          </div>

          <div className="flex items-start gap-3 justify-end">
            <div className="flex-1 max-w-md">
              <div className="bg-[#3E92CC] rounded-lg p-3 ml-auto">
                <p className="text-white text-sm">
                  Here's your updated meal plan for this week. Focus on hitting
                  your protein targets!
                </p>
                <div className="mt-2 p-2 bg-blue-900/30 rounded border border-blue-700/30">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:file-document"
                      className="text-blue-400"
                      width={16}
                      height={16}
                    />
                    <span className="text-blue-400 text-sm">
                      meal-plan-week3.pdf
                    </span>
                  </div>
                </div>
                <p className="text-blue-100 text-xs mt-2">10:30 AM</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:account" width={16} height={16} color="white" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#3E92CC] rounded-full flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:account" width={16} height={16} color="white" />
            </div>
            <div className="flex-1">
              <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                <p className="text-white text-sm">
                  Perfect! Thanks for the meal plan. I'll start implementing it
                  today.
                </p>
                <p className="text-zinc-400 text-xs mt-2">11:45 AM</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Scheduled Messages */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:calendar-clock"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">
              Scheduled Messages
            </h3>
          </div>
          <Button variant="primary" size="small">
            <Icon icon="mdi:plus" width={16} height={16} />
            Schedule Message
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:clock"
                className="text-orange-400"
                width={20}
                height={20}
              />
              <div>
                <p className="text-white font-medium text-sm">
                  Weekly check-in reminder
                </p>
                <p className="text-zinc-400 text-xs">Every Monday at 9:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="small">
                <Icon icon="mdi:pencil" width={16} height={16} />
              </Button>
              <Button variant="danger" size="small">
                <Icon icon="mdi:delete" width={16} height={16} />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <Icon
                icon="mdi:clock"
                className="text-blue-400"
                width={20}
                height={20}
              />
              <div>
                <p className="text-white font-medium text-sm">
                  Meal prep reminder
                </p>
                <p className="text-zinc-400 text-xs">Every Sunday at 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="small">
                <Icon icon="mdi:pencil" width={16} height={16} />
              </Button>
              <Button variant="danger" size="small">
                <Icon icon="mdi:delete" width={16} height={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Communication Settings */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:cog"
            className="text-[#3E92CC]"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">
            Communication Settings
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-zinc-400 text-sm">
                Receive email alerts for new messages
              </p>
            </div>
            <button className="w-12 h-6 bg-[#3E92CC] rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-zinc-400 text-sm">
                Get instant notifications on your device
              </p>
            </div>
            <button className="w-12 h-6 bg-[#3E92CC] rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Auto-Reply</p>
              <p className="text-zinc-400 text-sm">
                Send automatic responses when offline
              </p>
            </div>
            <button className="w-12 h-6 bg-zinc-700 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
