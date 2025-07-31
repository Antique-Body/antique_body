import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { calculateAge } from "@/utils/dateUtils";

export function ClientOverviewTab({
  client,
  profile,
  onAssignPlan,
  assignedTrainingPlans,
  assignedNutritionPlans,
  setActiveTab,
  onRemoveNutritionPlan,
  clientHasMockPlan,
}) {
  const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
  const [removingPlan, setRemovingPlan] = useState(false);
  const [removeError, setRemoveError] = useState(null);

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

  const activeTrainingPlan = assignedTrainingPlans?.find(
    (plan) => plan.status === "active"
  );

  const activeNutritionPlan = assignedNutritionPlans?.find(
    (plan) => plan.isActive
  );

  const handleRemoveNutritionPlan = async () => {
    if (!activeNutritionPlan || !onRemoveNutritionPlan) return;

    try {
      setRemovingPlan(true);
      setRemoveError(null);
      await onRemoveNutritionPlan(activeNutritionPlan.id);
      setShowConfirmRemoveModal(false);
    } catch (err) {
      setRemoveError(err.message || "Failed to remove nutrition plan");
    } finally {
      setRemovingPlan(false);
    }
  };

  // Nutrition Plan Section
  const renderNutritionPlanSection = () => {
    if (activeNutritionPlan) {
      // Check if the plan was assigned by the current trainer
      const currentTrainerId = client?.trainerId;
      const assignedById = activeNutritionPlan.assignedById;
      const isAssignedByCurrentTrainer = currentTrainerId === assignedById;

      // Render assigned nutrition plan
      return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30 gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 mt-1">
              <Icon
                icon="mdi:food-apple"
                className="text-green-400"
                width={20}
                height={20}
              />
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate">
                {activeNutritionPlan.nutritionPlan?.title || "Untitled Plan"}
              </p>
              <p className="text-zinc-400 text-sm">
                {activeNutritionPlan.nutritionPlan?.duration ?? "?"}{" "}
                {activeNutritionPlan.nutritionPlan?.durationType ?? ""} • Active
              </p>
              {activeNutritionPlan.nutritionPlan?.nutritionInfo && (
                <p className="text-zinc-500 text-xs mt-1">
                  {activeNutritionPlan.nutritionPlan.nutritionInfo.calories ||
                    0}{" "}
                  cal/day •{" "}
                  {activeNutritionPlan.nutritionPlan.nutritionInfo.protein || 0}
                  g protein
                </p>
              )}
              <div className="flex items-center gap-1 mt-1">
                {isAssignedByCurrentTrainer ? (
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
                      {activeNutritionPlan.assignedBy?.trainerProfile
                        ?.firstName || "another trainer"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setActiveTab("nutrition")}
            >
              <Icon icon="mdi:eye" width={16} height={16} />
            </Button>
            {activeNutritionPlan.startDate && (
              <Link href={`/trainer/dashboard/clients/${client.id}/nutrition/${activeNutritionPlan.id}`}>
                <Button
                  variant="success"
                  size="small"
                >
                  <Icon icon="mdi:chart-line" width={16} height={16} />
                  <span className="hidden sm:inline ml-1">Track</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center py-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <p className="text-zinc-400 text-sm">No nutrition plan assigned</p>
        </div>
      );
    }
  };

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
            {profile.preferredActivities?.length > 0 && (
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
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="mdi:clipboard-list"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Current Plans</h3>
          </div>

          <div className="space-y-4">
            {/* Training Plan Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-orange-400"
                    width={18}
                    height={18}
                  />
                  <h4 className="text-white font-medium">Training Plan</h4>
                </div>
                <Button
                  variant="primary"
                  size="small"
                  leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
                  onClick={() => onAssignPlan("training")}
                >
                  {!activeTrainingPlan ? "Replace" : "Assign"}
                </Button>
              </div>

              {activeTrainingPlan ? (
                <div className="flex items-center justify-between p-3 bg-orange-900/20 rounded-lg border border-orange-700/30">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:dumbbell"
                      className="text-orange-400"
                      width={20}
                      height={20}
                    />
                    <div>
                      <p className="text-white font-medium">
                        {activeTrainingPlan.planData?.title || "Untitled Plan"}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        {activeTrainingPlan.planData?.duration ?? "?"}{" "}
                        {activeTrainingPlan.planData?.durationType ?? ""} •
                        Active
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
                <div className="text-center py-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                  <Icon
                    icon="mdi:dumbbell-off"
                    className="text-zinc-600 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <p className="text-zinc-400 text-sm">
                    No training plan assigned
                  </p>
                </div>
              )}
            </div>

            {/* Nutrition Plan Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:food-apple"
                    className="text-green-400"
                    width={18}
                    height={18}
                  />
                  <h4 className="text-white font-medium">Nutrition Plan</h4>
                </div>
                <div className="flex gap-2">
                  {activeNutritionPlan && onRemoveNutritionPlan && (
                    <Button
                      variant="danger"
                      size="small"
                      leftIcon={
                        <Icon icon="mdi:delete" width={16} height={16} />
                      }
                      onClick={() => setShowConfirmRemoveModal(true)}
                    >
                      Remove
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="small"
                    leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
                    onClick={() => onAssignPlan("nutrition")}
                  >
                    {activeNutritionPlan ? "Replace" : "Assign"}
                  </Button>
                </div>
              </div>

              {renderNutritionPlanSection()}
            </div>

            {/* Summary when both plans are empty */}
            {!activeTrainingPlan &&
              !activeNutritionPlan &&
              !clientHasMockPlan && (
                <div className="text-center py-6 bg-zinc-800/20 rounded-lg border border-zinc-700/30">
                  <Icon
                    icon="mdi:clipboard-outline"
                    className="text-zinc-600 mx-auto mb-3"
                    width={32}
                    height={32}
                  />
                  <p className="text-zinc-400 text-base font-medium mb-1">
                    No Active Plans
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Assign training and nutrition plans to get started
                  </p>
                </div>
              )}
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
              variant="secondary"
              fullWidth
              onClick={() => onAssignPlan("training")}
              leftIcon={
                <Icon
                  icon="mdi:dumbbell"
                  width={20}
                  height={20}
                  className="group-hover:text-[#FF7800] transition-colors"
                />
              }
              className="!bg-zinc-800/50 !border-zinc-700 hover:!border-[#FF7800] hover:!bg-[#FF7800]/10 hover:!text-[#FF7800] group justify-start gap-3 !p-3"
            >
              Assign Training Plan
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => onAssignPlan("nutrition")}
              leftIcon={
                <Icon
                  icon="mdi:food-apple"
                  width={20}
                  height={20}
                  className="group-hover:text-[#FF7800] transition-colors"
                />
              }
              className="!bg-zinc-800/50 !border-zinc-700 hover:!border-[#FF7800] hover:!bg-[#FF7800]/10 hover:!text-[#FF7800] group justify-start gap-3 !p-3"
            >
              Assign Meal Plan
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={
                <Icon
                  icon="mdi:message"
                  width={20}
                  height={20}
                  className="group-hover:text-[#FF7800] transition-colors"
                />
              }
              className="!bg-zinc-800/50 !border-zinc-700 hover:!border-[#FF7800] hover:!bg-[#FF7800]/10 hover:!text-[#FF7800] group justify-start gap-3 !p-3"
            >
              Send Message
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={
                <Icon
                  icon="mdi:calendar"
                  width={20}
                  height={20}
                  className="group-hover:text-[#FF7800] transition-colors"
                />
              }
              className="!bg-zinc-800/50 !border-zinc-700 hover:!border-[#FF7800] hover:!bg-[#FF7800]/10 hover:!text-[#FF7800] group justify-start gap-3 !p-3"
            >
              Schedule Session
            </Button>
            <Button
              variant="secondary"
              fullWidth
              leftIcon={
                <Icon
                  icon="mdi:chart-line"
                  width={20}
                  height={20}
                  className="group-hover:text-[#FF7800] transition-colors"
                />
              }
              className="!bg-zinc-800/50 !border-zinc-700 hover:!border-[#FF7800] hover:!bg-[#FF7800]/10 hover:!text-[#FF7800] group justify-start gap-3 !p-3"
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

      {/* Confirm Remove Plan Modal */}
      {showConfirmRemoveModal && (
        <Modal
          isOpen={showConfirmRemoveModal}
          onClose={() => setShowConfirmRemoveModal(false)}
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
                Are you sure you want to remove the current nutrition plan from
                this client?
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
    </div>
  );
}
