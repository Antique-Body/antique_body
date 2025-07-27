import { Icon } from "@iconify/react";
import Image from "next/image";
import { calculateAge } from "@/utils/dateUtils";
import { Button } from "@/components/common/Button";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";

export const RequestCard = ({
  request,
  onViewDetails,
  onAcceptRequest,
  onRejectRequest,
  onProfileImageClick,
}) => {
  const clientGender = request.client?.clientProfile?.gender?.toLowerCase();
  const isMale = clientGender === "male";
  const isFemale = clientGender === "female";

  // Gender-based styling with elegant colors
  const genderStyles = {
    background: isMale
      ? "bg-gradient-to-r from-slate-900/95 via-blue-900/10 to-slate-900/95"
      : isFemale
      ? "bg-gradient-to-r from-slate-900/95 via-purple-900/10 to-slate-900/95"
      : "bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95",
    border: isMale
      ? "border-cyan-600/30 hover:border-cyan-400/50"
      : isFemale
      ? "border-violet-600/30 hover:border-violet-400/50"
      : "border-slate-700/50 hover:border-blue-400/70",
    shadow: isMale
      ? "hover:shadow-cyan-500/10"
      : isFemale
      ? "hover:shadow-violet-500/10"
      : "hover:shadow-blue-500/20",
    profileRing: isMale
      ? "ring-cyan-400/40"
      : isFemale
      ? "ring-violet-400/40"
      : "ring-white/10",
    genderIcon: isMale
      ? "mdi:gender-male"
      : isFemale
      ? "mdi:gender-female"
      : null,
    genderColor: isMale
      ? "text-cyan-400"
      : isFemale
      ? "text-violet-400"
      : "text-gray-400",
    accent: isMale
      ? "from-cyan-500/10 to-blue-500/10"
      : isFemale
      ? "from-violet-500/10 to-purple-500/10"
      : "from-blue-500/10 to-blue-500/10",
  };

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

  return (
    <div
      className={`relative group w-full ${genderStyles.background} border ${genderStyles.border} rounded-xl shadow-lg ${genderStyles.shadow} transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm overflow-hidden`}
    >
      {/* Gender Accent Strip */}
      {(isMale || isFemale) && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${genderStyles.accent} opacity-70`}
        />
      )}

      {/* Main Card Content */}
      <div className="flex items-center p-4 gap-4">
        {/* Profile Section */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Profile Image */}
          <div
            className="relative cursor-pointer group/image flex-shrink-0"
            tabIndex="0"
            role="button"
            aria-label={`View profile image of ${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName}`}
            onClick={() =>
              onProfileImageClick(
                request.client.clientProfile.profileImage,
                `${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName}`
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onProfileImageClick(
                  request.client.clientProfile.profileImage,
                  `${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName}`
                );
              }
            }}
          >
            <div
              className={`relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl ring-2 ring-white/10 group-hover/image:${genderStyles.profileRing} shadow-md transition-all duration-300`}
            >
              {request.client.clientProfile.profileImage ? (
                <Image
                  src={request.client.clientProfile.profileImage}
                  alt={`${request.client.clientProfile.firstName} profile`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover/image:scale-105"
                  width={56}
                  height={56}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <Icon
                    icon="mdi:account"
                    width={20}
                    height={20}
                    color="white"
                  />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Icon
                icon="mdi:eye"
                className="text-white"
                width={14}
                height={14}
              />
            </div>
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {request.client.clientProfile.firstName}{" "}
                {request.client.clientProfile.lastName}
              </h3>

              {/* Gender icon */}
              {genderStyles.genderIcon && (
                <div
                  className={`p-1 rounded-full ${
                    isMale
                      ? "bg-blue-500/20 border border-blue-400/30"
                      : "bg-pink-500/20 border border-pink-400/30"
                  }`}
                >
                  <Icon
                    icon={genderStyles.genderIcon}
                    className={isMale ? "text-blue-400" : "text-pink-400"}
                    width={12}
                    height={12}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Icon icon="mdi:calendar" width={12} height={12} />
                <span>
                  {calculateAge(request.client.clientProfile.dateOfBirth)} years
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:map-marker" width={12} height={12} />
                <span className="truncate">
                  {request.client.clientProfile.location?.city ||
                    "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Preview */}
        {request.note && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50 max-w-xs">
            <Icon
              icon="mdi:message-text"
              className="text-cyan-400 flex-shrink-0"
              width={14}
              height={14}
            />
            <p className="text-slate-300 text-sm italic truncate">
              "{request.note}"
            </p>
          </div>
        )}

        {/* Medical Alert */}
        {(request.client.clientProfile.medicalConditions ||
          request.client.clientProfile.allergies) && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-amber-900/30 rounded-lg border border-amber-600/40">
            <Icon
              icon="mdi:medical-bag"
              className="text-amber-400"
              width={14}
              height={14}
            />
            <span className="text-amber-300 text-xs font-medium">
              Medical Info
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View Details Button */}
          <Button
            variant="ghost"
            size="small"
            onClick={() => onViewDetails(request)}
            leftIcon={<Icon icon="mdi:eye" width={14} height={14} />}
            className="px-3 py-2 bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/50 hover:border-slate-500/70 text-slate-200 hover:text-white transition-all duration-200 rounded-lg text-xs font-medium"
          >
            <span className="hidden sm:inline">Details</span>
          </Button>

          {/* Accept Button */}
          <Button
            variant="primary"
            size="small"
            onClick={() => onAcceptRequest(request)}
            leftIcon={<Icon icon="mdi:check" width={14} height={14} />}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 hover:border-emerald-400/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
          >
            <span className="hidden sm:inline">Accept</span>
          </Button>

          {/* Reject Button */}
          <Button
            variant="secondary"
            size="small"
            onClick={() => onRejectRequest(request)}
            leftIcon={<Icon icon="mdi:close" width={14} height={14} />}
            className="px-3 py-2 bg-red-600/90 hover:bg-red-500 border border-red-500/50 hover:border-red-400/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
          >
            <span className="hidden sm:inline">Reject</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
