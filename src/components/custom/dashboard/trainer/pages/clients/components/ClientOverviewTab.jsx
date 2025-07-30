import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { calculateAge } from "@/utils/dateUtils";

export function ClientOverviewTab({
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
                      {activePlan.planData?.title || "Untitled Plan"}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      {activePlan.planData?.duration ?? "?"}{" "}
                      {activePlan.planData?.durationType ?? ""} • Active
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
