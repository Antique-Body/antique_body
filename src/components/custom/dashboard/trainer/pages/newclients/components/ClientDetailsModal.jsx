import { Icon } from "@iconify/react";
import Image from "next/image";

import { Modal } from "@/components/common/Modal";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { calculateAge } from "@/utils/dateUtils";

export const ClientDetailsModal = ({
  isOpen,
  onClose,
  clientDetails,
  onProfileImageClick,
}) => {
  if (!clientDetails) return null;

  // Helper function to get experience text
  const getExperienceText = (level) => {
    if (!level) return "Experience Not Specified";

    const experienceLevel = EXPERIENCE_LEVELS.find(
      (exp) => exp.value === level
    );
    return experienceLevel ? experienceLevel.label : level;
  };

  // Helper function to get fitness goal text
  const getFitnessGoalText = (goalId) => {
    if (!goalId) return "Goal Not Specified";

    const fitnessGoal = FITNESS_GOALS.find((goal) => goal.id === goalId);
    return fitnessGoal ? fitnessGoal.label : goalId;
  };

  // Function to map activity names to proper labels with null safety
  const mapActivityToLabel = (activityName) => {
    if (!activityName) return "Activity Not Specified";

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

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footerButtons={false}
      title={
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:account-details"
            width={24}
            height={24}
            className="text-[#FF7800]"
          />
          <span>Client Details</span>
        </div>
      }
      hideButtons={true}
      className="max-w-4xl"
    >
      <div className="space-y-6 pb-6">
        {/* Profile Header - Compact */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div
                className="relative flex-shrink-0 cursor-pointer"
                role="button"
                aria-label="View client profile"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onProfileImageClick(
                      clientDetails.client.clientProfile.profileImage,
                      `${clientDetails.client.clientProfile.firstName} ${clientDetails.client.clientProfile.lastName}`
                    );
                  }
                }}
                onClick={() =>
                  onProfileImageClick(
                    clientDetails.client.clientProfile.profileImage,
                    `${clientDetails.client.clientProfile.firstName} ${clientDetails.client.clientProfile.lastName}`
                  )
                }
              >
                <div className="h-20 w-20 overflow-hidden rounded-lg ring-2 ring-zinc-600/30 shadow-lg hover:ring-[#FF7800]/50 transition-all duration-300">
                  {clientDetails.client.clientProfile.profileImage ? (
                    <Image
                      src={clientDetails.client.clientProfile.profileImage}
                      alt={`${clientDetails.client.clientProfile.firstName} profile`}
                      className="object-cover w-full h-full"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF7800] to-[#FF9A00]">
                      <Icon
                        icon="mdi:account"
                        width={32}
                        height={32}
                        className="text-white"
                      />
                    </div>
                  )}
                </div>
                {/* Gender Badge */}
                {clientDetails.client.clientProfile.gender && (
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border border-zinc-800 shadow-lg ${
                      clientDetails.client.clientProfile.gender.toLowerCase() ===
                      "male"
                        ? "bg-gradient-to-br from-[#FF7800] to-[#FF9A00]"
                        : clientDetails.client.clientProfile.gender.toLowerCase() ===
                            "female"
                          ? "bg-gradient-to-br from-[#FF9A00] to-[#FF7800]"
                          : "bg-gradient-to-br from-zinc-500 to-zinc-600"
                    }`}
                  >
                    <Icon
                      icon={
                        clientDetails.client.clientProfile.gender.toLowerCase() ===
                        "male"
                          ? "mdi:gender-male"
                          : clientDetails.client.clientProfile.gender.toLowerCase() ===
                              "female"
                            ? "mdi:gender-female"
                            : "mdi:help"
                      }
                      width={12}
                      height={12}
                      className="text-white"
                    />
                  </div>
                )}
              </div>

              {/* Client Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {clientDetails.client.clientProfile.firstName}{" "}
                    {clientDetails.client.clientProfile.lastName}
                  </h2>

                  {/* Request Date - Directly next to name */}
                  <div className="flex items-center gap-1 bg-zinc-800/60 px-2 py-1 rounded-md border border-zinc-700/50">
                    <Icon
                      icon="mdi:calendar-clock"
                      width={14}
                      height={14}
                      className="text-[#FF9A00]"
                    />
                    <span className="text-xs text-zinc-300 whitespace-nowrap">
                      {formatDate(clientDetails.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Info Pills - Compact */}
                <div className="flex flex-wrap gap-2">
                  {/* Experience Level */}
                  <div className="bg-zinc-900/30 rounded-lg px-2 py-1 border border-zinc-700/30">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="mdi:dumbbell"
                        width={14}
                        height={14}
                        className="text-[#FF7800]"
                      />
                      <span className="text-zinc-300 text-xs font-medium">
                        {getExperienceText(
                          clientDetails.client.clientProfile.experienceLevel
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Age */}
                  <div className="bg-zinc-900/30 rounded-lg px-2 py-1 border border-zinc-700/30">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="mdi:calendar"
                        width={14}
                        height={14}
                        className="text-[#FF9A00]"
                      />
                      <span className="text-zinc-300 text-xs font-medium">
                        {calculateAge(
                          clientDetails.client.clientProfile.dateOfBirth
                        )}{" "}
                        yrs
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  {clientDetails.client.clientProfile.location?.city && (
                    <div className="bg-zinc-900/30 rounded-lg px-2 py-1 border border-zinc-700/30">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:map-marker"
                          width={14}
                          height={14}
                          className="text-[#FF7800]"
                        />
                        <span className="text-zinc-300 text-xs font-medium">
                          {clientDetails.client.clientProfile.location.city}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Gender */}
                  {clientDetails.client.clientProfile.gender && (
                    <div className="bg-zinc-900/30 rounded-lg px-2 py-1 border border-zinc-700/30">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon={
                            clientDetails.client.clientProfile.gender.toLowerCase() ===
                            "male"
                              ? "mdi:gender-male"
                              : "mdi:gender-female"
                          }
                          width={14}
                          height={14}
                          className={
                            clientDetails.client.clientProfile.gender.toLowerCase() ===
                            "male"
                              ? "text-[#FF7800]"
                              : "text-[#FF9A00]"
                          }
                        />
                        <span className="text-zinc-300 text-xs font-medium capitalize">
                          {clientDetails.client.clientProfile.gender}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Information - Compact Layout */}
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Primary Goal */}
          <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF7800]/20 flex items-center justify-center border border-[#FF7800]/30">
                <Icon
                  icon="mdi:target"
                  className="text-[#FF7800]"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <h4 className="text-white font-semibold">Primary Goal</h4>
                <p className="text-zinc-400 text-xs">Training objective</p>
              </div>
            </div>
            <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-700/30">
              <p className="text-white font-medium break-words">
                {getFitnessGoalText(
                  clientDetails.client.clientProfile.primaryGoal
                )}
              </p>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF9A00]/20 flex items-center justify-center border border-[#FF9A00]/30">
                <Icon
                  icon="mdi:human-male-height"
                  className="text-[#FF9A00]"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <h4 className="text-white font-semibold">Physical Stats</h4>
                <p className="text-zinc-400 text-xs">Body measurements</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    icon="mdi:ruler"
                    className="text-[#FF9A00]"
                    width={16}
                    height={16}
                  />
                  <span className="text-zinc-400 text-xs">Height</span>
                </div>
                <p className="text-white font-medium">
                  {clientDetails.client.clientProfile.height &&
                  clientDetails.client.clientProfile.height > 0
                    ? `${clientDetails.client.clientProfile.height}cm`
                    : "Not specified"}
                </p>
              </div>
              <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    icon="mdi:weight"
                    className="text-[#FF9A00]"
                    width={16}
                    height={16}
                  />
                  <span className="text-zinc-400 text-xs">Weight</span>
                </div>
                <p className="text-white font-medium">
                  {clientDetails.client.clientProfile.weight &&
                  clientDetails.client.clientProfile.weight > 0
                    ? `${clientDetails.client.clientProfile.weight}kg`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Request Date - Removed from here as it's now next to the name */}
        </div>

        {/* Preferred Activities */}
        {clientDetails.client.clientProfile.preferredActivities?.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF9A00]/20 flex items-center justify-center border border-[#FF9A00]/30">
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-[#FF9A00]"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    Preferred Activities
                  </h4>
                  <p className="text-zinc-400 text-xs">Training preferences</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {clientDetails.client.clientProfile.preferredActivities.map(
                  (activity) => (
                    <div
                      key={activity.id}
                      className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-700/30 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF7800] flex-shrink-0" />
                        <span className="text-zinc-200 text-sm font-medium truncate">
                          {mapActivityToLabel(activity.name)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Languages */}
        {clientDetails.client.clientProfile.languages &&
          clientDetails.client.clientProfile.languages.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FF7800]/20 flex items-center justify-center border border-[#FF7800]/30">
                    <Icon
                      icon="mdi:translate"
                      className="text-[#FF7800]"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Languages</h4>
                    <p className="text-zinc-400 text-xs">
                      Communication preferences
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {clientDetails.client.clientProfile.languages.map(
                    (language) => (
                      <div
                        key={language.id}
                        className="bg-zinc-900/30 rounded-lg px-3 py-2 border border-zinc-700/30"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#FF9A00] flex-shrink-0" />
                          <span className="text-zinc-200 text-sm font-medium whitespace-nowrap">
                            {language.name}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Medical Information */}
        {(clientDetails.client.clientProfile.medicalConditions ||
          clientDetails.client.clientProfile.allergies) && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Icon
                    icon="mdi:medical-bag"
                    className="text-amber-400"
                    width={20}
                    height={20}
                  />
                </div>
                <h4 className="text-white font-medium">Medical Information</h4>
              </div>
              <div className="space-y-3">
                {clientDetails.client.clientProfile.medicalConditions && (
                  <div className="flex items-start gap-3 bg-amber-900/20 rounded-xl p-4 border border-amber-700/30">
                    <Icon
                      icon="mdi:medical-bag"
                      className="text-amber-400 mt-1"
                      width={20}
                      height={20}
                    />
                    <div>
                      <p className="text-amber-400 font-medium text-sm mb-1">
                        Medical Conditions
                      </p>
                      <p className="text-amber-300/90 text-sm">
                        {clientDetails.client.clientProfile.medicalConditions}
                      </p>
                    </div>
                  </div>
                )}
                {clientDetails.client.clientProfile.allergies && (
                  <div className="flex items-start gap-3 bg-red-900/20 rounded-xl p-4 border border-red-700/30">
                    <Icon
                      icon="mdi:alert"
                      className="text-red-400 mt-1"
                      width={20}
                      height={20}
                    />
                    <div>
                      <p className="text-red-400 font-medium text-sm mb-1">
                        Allergies
                      </p>
                      <p className="text-red-300/90 text-sm">
                        {clientDetails.client.clientProfile.allergies}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Client Message */}
        {clientDetails.note && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-[#FF7800]/20">
                  <Icon
                    icon="mdi:message-text"
                    className="text-[#FF7800]"
                    width={20}
                    height={20}
                  />
                </div>
                <h4 className="text-white font-medium">Message from Client</h4>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                <p className="text-zinc-300 text-sm italic">
                  "{clientDetails.note}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Client Description */}
        {clientDetails.client.clientProfile.description && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-[#FF9A00]/20">
                  <Icon
                    icon="mdi:account-details"
                    className="text-[#FF9A00]"
                    width={20}
                    height={20}
                  />
                </div>
                <h4 className="text-white font-medium">About Client</h4>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                <p className="text-zinc-300 text-sm">
                  {clientDetails.client.clientProfile.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
