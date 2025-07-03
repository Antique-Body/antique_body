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

  // Get fitness goals
  const getFitnessGoals = () => {
    if (!info.fitnessGoals || info.fitnessGoals.length === 0) return [];
    return info.fitnessGoals.map((goalId) => {
      const found = FITNESS_GOALS.find((g) => g.id === goalId);
      return found ? found.label : goalId;
    });
  };

  // Get activity types
  const getActivityTypes = () => {
    if (!info.activityTypes || info.activityTypes.length === 0) return [];
    return info.activityTypes.map((activityId) => {
      const found = ACTIVITY_TYPES.find((a) => a.id === activityId);
      return found ? found.label : activityId;
    });
  };

  const fitnessGoals = getFitnessGoals();
  const activityTypes = getActivityTypes();

  return (
    <>
      <UserProfile
        profileType="client"
        avatarContent={clientData?.profileImage}
        profileTitle={fullName}
        profileSubtitle={
          <div>
            {info.bio && (
              <div className="text-sm text-[#FF6B00] font-medium truncate mb-2">
                {info.bio}
              </div>
            )}
            {/* Subtle Stats Below Name */}
            <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
              <div className="flex items-center gap-1">
                <Icon
                  icon="mdi:target"
                  width={12}
                  height={12}
                  className="text-blue-500"
                />
                <span>3 goals</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:calendar-today" width={12} height={12} />
                <span>2 months</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:chart-line" width={12} height={12} />
                <span>85% progress</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:dumbbell" width={12} height={12} />
                <span>42 sessions</span>
              </div>
            </div>
          </div>
        }
        userData={clientData}
        onProfileUpdate={onProfileUpdate}
        onHeaderClick={() => setShowDetailModal(true)}
      >
        {/* Empty content - everything moved to modal */}
      </UserProfile>

      {/* Enhanced Detailed Modal */}
      {showDetailModal && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title=""
          showFooter={false}
          size="large"
          className="max-w-6xl"
        >
          <div className="space-y-8">
            {/* Modal Header with Client Info */}
            <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {clientData?.profileImage ? (
                    <img
                      src={clientData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {fullName}
                  </h1>
                  <div className="text-blue-400 font-medium mb-3">
                    {info.bio || "Fitness Enthusiast"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                      <Icon
                        icon="mdi:target"
                        className="text-blue-500"
                        width={14}
                        height={14}
                      />
                      <span className="text-sm text-blue-400 font-medium">
                        {fitnessGoals.length} Active Goal
                        {fitnessGoals.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-400 font-medium">
                        Active Member
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Statistics - Enhanced Layout */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <Icon
                    icon="mdi:chart-line"
                    className="text-blue-500"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Progress Statistics
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Your fitness journey overview
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 text-center hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon
                      icon="mdi:target"
                      className="text-blue-500"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">3</div>
                  <div className="text-sm text-blue-400 font-medium mb-1">
                    Active Goals
                  </div>
                  <div className="text-xs text-zinc-400">
                    Weight loss, strength
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-5 text-center hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon
                      icon="mdi:calendar-today"
                      className="text-green-500"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">2</div>
                  <div className="text-sm text-green-400 font-medium mb-1">
                    Months Active
                  </div>
                  <div className="text-xs text-zinc-400">
                    Since January 2024
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-5 text-center hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon
                      icon="mdi:chart-line"
                      className="text-purple-500"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">85%</div>
                  <div className="text-sm text-purple-400 font-medium mb-1">
                    Progress
                  </div>
                  <div className="text-xs text-zinc-400">On track to goals</div>
                </div>

                <div className="bg-gradient-to-br from-[#FF6B00]/20 to-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-xl p-5 text-center hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 bg-[#FF6B00]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon
                      icon="mdi:dumbbell"
                      className="text-[#FF6B00]"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">42</div>
                  <div className="text-sm text-[#FF6B00] font-medium mb-1">
                    Sessions
                  </div>
                  <div className="text-xs text-zinc-400">This month: 12</div>
                </div>
              </div>
            </div>

            {/* Personal & Contact Information - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Details */}
              <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                    <Icon
                      icon="mdi:account"
                      className="text-blue-500"
                      width={16}
                      height={16}
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    Personal Details
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">Age</span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.age)} years
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">Height</span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.height)} cm
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">Weight</span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.weight)} kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">
                      Activity Level
                    </span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.activityLevel)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400 font-medium">
                      Experience
                    </span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.experience)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Preferences */}
              <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                    <Icon
                      icon="mdi:cog"
                      className="text-blue-500"
                      width={16}
                      height={16}
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    Contact & Preferences
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">Email</span>
                    <span className="text-white font-semibold truncate ml-4">
                      {getOrNoData(clientData?.email)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">Phone</span>
                    <span className="text-white font-semibold">
                      {getOrNoData(clientData?.phoneNumber)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">
                      Preferred Time
                    </span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.preferredTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400 font-medium">Location</span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.location)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fitness Goals */}
              {fitnessGoals.length > 0 && (
                <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <Icon
                        icon="mdi:target"
                        className="text-blue-500"
                        width={16}
                        height={16}
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-white">
                      Fitness Goals
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {fitnessGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Types */}
              {activityTypes.length > 0 && (
                <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <Icon
                        icon="mdi:run"
                        className="text-blue-500"
                        width={16}
                        height={16}
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-white">
                      Preferred Activities
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {activityTypes.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-zinc-700/50 rounded-lg hover:bg-zinc-700/70 transition-colors"
                      >
                        <Icon
                          icon="mdi:check-circle"
                          className="text-green-500"
                          width={16}
                          height={16}
                        />
                        <span className="text-white font-medium">
                          {activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Health Information */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-lg flex items-center justify-center border border-red-500/30">
                  <Icon
                    icon="mdi:heart-pulse"
                    className="text-red-500"
                    width={16}
                    height={16}
                  />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Health Information
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">
                      Health Conditions
                    </span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.healthConditions)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400 font-medium">Injuries</span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.injuries)}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700/30">
                    <span className="text-zinc-400 font-medium">
                      Medications
                    </span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.medications)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-400 font-medium">
                      Emergency Contact
                    </span>
                    <span className="text-white font-semibold">
                      {getOrNoData(info.emergencyContact)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {info.bio && (
              <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                    <Icon
                      icon="mdi:text-account"
                      className="text-blue-500"
                      width={16}
                      height={16}
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-white">About Me</h4>
                </div>
                <div className="prose prose-zinc prose-invert max-w-none">
                  <p className="text-zinc-300 leading-relaxed text-base">
                    {info.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
