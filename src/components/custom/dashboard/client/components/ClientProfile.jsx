import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { UserProfile } from "@/components/custom/dashboard/shared";
import { StatCard } from "@/components/custom/dashboard/shared/StatCard";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";

export const ClientProfile = ({ userData }) => {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push("/client/edit-profile");
  };

  // Get label and icon for primary and secondary goals
  const getPrimaryGoal = () => {
    const goal = FITNESS_GOALS.find((g) => g.id === userData.primaryGoal);
    return (
      goal || {
        label: userData.primaryGoal || "Not set",
        icon: "mdi:help-circle",
      }
    );
  };

  const getSecondaryGoal = () => {
    const goal = FITNESS_GOALS.find((g) => g.id === userData.secondaryGoal);
    return (
      goal || {
        label: userData.secondaryGoal || "Not set",
        icon: "mdi:help-circle",
      }
    );
  };

  console.log("userData", userData);
  // Format preferred activities
  const getPreferredActivities = () => {
    if (
      !userData.preferredActivities ||
      userData.preferredActivities.length === 0
    ) {
      return [];
    }

    return userData.preferredActivities.map((activity) => {
      const activityInfo = ACTIVITY_TYPES.find((a) => a.id === activity.name);
      return {
        id: activity.id || activity.name,
        name: activity.name,
        label: activityInfo?.label || activity.name,
        icon: activityInfo?.icon || "mdi:dumbbell",
      };
    });
  };

  const primaryGoal = getPrimaryGoal();
  const secondaryGoal = getSecondaryGoal();
  const preferredActivities = getPreferredActivities();

  return (
    <div className="relative">
      <UserProfile
        userData={userData}
        profileType="client"
        avatarContent={userData.profileImage || userData.avatarContent}
        showProgressBar={true}
        progressData={userData.progress}
        profileTitle={`${userData.firstName || ""} ${userData.lastName || ""}`}
      >
        <div className="w-full space-y-4">
          {/* Primary & Secondary Goals - First Row */}
          <div className="w-full bg-[rgba(0,180,255,0.05)] p-4 rounded-lg border border-[rgba(0,180,255,0.1)]">
            <h3 className="text-xs font-medium text-white mb-3 flex items-center">
              <Icon
                icon="mdi:target"
                className="mr-1.5 text-[#00B4FF]"
                width={16}
                height={16}
              />
              <span className="bg-gradient-to-r from-[#00B4FF] to-white bg-clip-text text-transparent">
                Fitness Goals
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Primary Goal Card */}
              <div className="flex items-center p-3 rounded-lg bg-[rgba(0,180,255,0.1)] border border-[rgba(0,180,255,0.2)]">
                <div className="w-10 h-10 rounded-full bg-[rgba(0,180,255,0.2)] flex items-center justify-center mr-3">
                  <Icon
                    icon={primaryGoal.icon}
                    className="text-[#00B4FF] text-xl"
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Primary Goal</div>
                  <div className="text-sm font-medium text-white">
                    {primaryGoal.label}
                  </div>
                </div>
              </div>

              {/* Secondary Goal Card */}
              <div className="flex items-center p-3 rounded-lg bg-[rgba(0,180,255,0.1)] border border-[rgba(0,180,255,0.2)]">
                <div className="w-10 h-10 rounded-full bg-[rgba(0,180,255,0.2)] flex items-center justify-center mr-3">
                  <Icon
                    icon={secondaryGoal.icon}
                    className="text-[#00B4FF] text-xl"
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Secondary Goal</div>
                  <div className="text-sm font-medium text-white">
                    {secondaryGoal.label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Activities - Second Row */}
          <div className="w-full bg-[rgba(255,107,0,0.05)] p-4 rounded-lg border border-[rgba(255,107,0,0.1)]">
            <h3 className="text-xs font-medium text-white mb-3 flex items-center">
              <Icon
                icon="mdi:run"
                className="mr-1.5 text-[#FF6B00]"
                width={16}
                height={16}
              />
              <span className="bg-gradient-to-r from-[#FF6B00] to-white bg-clip-text text-transparent">
                Preferred Activities
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {preferredActivities.length > 0 ? (
                preferredActivities.map((activity) => (
                  <span
                    key={activity.id}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2.5 py-1 text-xs font-medium text-[#FF6B00] shadow-sm"
                  >
                    <Icon icon={activity.icon} width={14} height={14} />
                    {activity.label}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs">
                  No preferred activities set
                </span>
              )}
            </div>
          </div>

          {/* Stats Section - Third Row */}
          <div className="w-full bg-[rgba(151,71,255,0.05)] p-4 rounded-lg border border-[rgba(151,71,255,0.1)]">
            <h3 className="text-xs font-medium text-white mb-3 flex items-center">
              <Icon
                icon="mdi:chart-bar"
                className="mr-1.5 text-[#9747FF]"
                width={16}
                height={16}
              />
              <span className="bg-gradient-to-r from-[#9747FF] to-white bg-clip-text text-transparent">
                Stats & Metrics
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Next Session"
                value={userData.nextSession?.date || "Not scheduled"}
                subtext={userData.nextSession?.time || ""}
                icon="mdi:calendar-clock"
                variant="primary"
              />

              <StatCard
                label="Current Weight"
                value={userData.weight ? `${userData.weight} kg` : "Not set"}
                subtext={
                  userData.weightChange
                    ? `${userData.weightChange > 0 ? "+" : ""}${
                        userData.weightChange
                      } kg`
                    : "No change recorded"
                }
                icon="mdi:scale"
                variant="orange"
              />

              <StatCard
                label="Body Fat"
                value={userData.bodyFat ? `${userData.bodyFat}%` : "Not set"}
                subtext={
                  userData.bodyFatChange
                    ? `${userData.bodyFatChange > 0 ? "+" : ""}${
                        userData.bodyFatChange
                      }%`
                    : "No change recorded"
                }
                icon="mdi:percent"
                variant="purple"
              />

              <StatCard
                label="Daily Calories"
                value={userData.calorieGoal || "Not set"}
                subtext="Target intake"
                icon="mdi:food-apple"
                variant="success"
              />
            </div>
          </div>
        </div>
      </UserProfile>

      {/* Edit Profile Button */}
      <Button
        variant="secondary"
        leftIcon={
          <Icon icon="material-symbols:settings" width={16} height={16} />
        }
        className="absolute right-0 top-0"
        onClick={handleEditProfile}
      >
        Edit Profile
      </Button>
    </div>
  );
};
