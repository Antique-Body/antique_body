import { Icon } from "@iconify/react";
import { useState } from "react";

import { Modal } from "@/components/common/Modal";
import { UserProfile } from "@/components/custom/dashboard/shared";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";

export const ClientProfile = ({ clientData, onProfileUpdate }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const info = clientData?.clientInfo || {};
  const getOrNoData = (val) => val ?? "No data";

  // Combine first and last name
  const fullName =
    (clientData?.firstName || "") +
      (clientData?.lastName ? ` ${clientData.lastName}` : "") ||
    clientData?.name ||
    "No data";

  // Subtitle with stats
  const profileSubtitle = (
    <div className="flex items-center gap-4 text-xs text-zinc-400">
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:target"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>3 goals</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:calendar"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>2 months</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:chart-line"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>85% progress</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:dumbbell"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>42 sessions</span>
      </div>
    </div>
  );

  // Format fitness goals
  const formatFitnessGoals = (goals) => {
    if (!goals || !Array.isArray(goals)) return [];
    return goals.map((goal) => {
      const goalData = FITNESS_GOALS.find((g) => g.value === goal);
      return goalData ? goalData.label : goal;
    });
  };

  // Format activity types
  const formatActivityTypes = (activities) => {
    if (!activities || !Array.isArray(activities)) return [];
    return activities.map((activity) => {
      const activityData = ACTIVITY_TYPES.find((a) => a.value === activity);
      return activityData ? activityData.label : activity;
    });
  };

  const handleHeaderClick = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <UserProfile
        profileType="client"
        avatarContent={clientData?.profileImage}
        profileTitle={fullName}
        profileSubtitle={profileSubtitle}
        userData={clientData}
        onProfileUpdate={onProfileUpdate}
        onHeaderClick={handleHeaderClick}
        showDetailedView={true}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
              {clientData?.profileImage ? (
                <img
                  src={clientData.profileImage}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon
                    icon="mdi:account"
                    width={24}
                    height={24}
                    className="text-zinc-400"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{fullName}</h3>
              <p className="text-sm text-zinc-400">Client</p>
            </div>
          </div>
        }
        size="large"
        primaryButtonText="Close"
        primaryButtonAction={() => setShowDetailModal(false)}
      >
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:target"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">3</div>
              <div className="text-xs text-zinc-400">Goals</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:calendar"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">2</div>
              <div className="text-xs text-zinc-400">Months</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:chart-line"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">85%</div>
              <div className="text-xs text-zinc-400">Progress</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:dumbbell"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">42</div>
              <div className="text-xs text-zinc-400">Sessions</div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:account"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Age:</span>
                <span className="text-white">{getOrNoData(info.age)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Height:</span>
                <span className="text-white">{getOrNoData(info.height)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Weight:</span>
                <span className="text-white">{getOrNoData(info.weight)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fitness Level:</span>
                <span className="text-white">
                  {getOrNoData(info.fitnessLevel)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:contact-mail"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Email:</span>
                <span className="text-white">
                  {getOrNoData(clientData?.email)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Phone:</span>
                <span className="text-white">
                  {getOrNoData(clientData?.phone)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">City:</span>
                <span className="text-white">
                  {getOrNoData(clientData?.city)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Country:</span>
                <span className="text-white">
                  {getOrNoData(clientData?.country)}
                </span>
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          {info.fitnessGoals && info.fitnessGoals.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:target"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Fitness Goals
              </h4>
              <div className="flex flex-wrap gap-2">
                {formatFitnessGoals(info.fitnessGoals).map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity Types */}
          {info.activityTypes && info.activityTypes.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:run"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Preferred Activities
              </h4>
              <div className="flex flex-wrap gap-2">
                {formatActivityTypes(info.activityTypes).map(
                  (activity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm"
                    >
                      {activity}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Health Information */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:heart-pulse"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Health Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Medical Conditions:</span>
                <span className="text-white">
                  {getOrNoData(info.medicalConditions)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Injuries:</span>
                <span className="text-white">{getOrNoData(info.injuries)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Medications:</span>
                <span className="text-white">
                  {getOrNoData(info.medications)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Emergency Contact:</span>
                <span className="text-white">
                  {getOrNoData(info.emergencyContact)}
                </span>
              </div>
            </div>
          </div>

          {/* About */}
          {info.bio && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:information"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                About Me
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {info.bio}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
