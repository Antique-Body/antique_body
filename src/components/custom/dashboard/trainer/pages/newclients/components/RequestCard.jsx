import { Icon } from "@iconify/react";
import Image from "next/image";

import { Button } from "@/components/common/Button";
import { calculateAge } from "@/utils/dateUtils";

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Gender-based styling with app colors
  const genderStyles = {
    background: isMale
      ? "bg-gradient-to-r from-zinc-900/95 via-[#FF7800]/5 to-zinc-900/95"
      : isFemale
      ? "bg-gradient-to-r from-zinc-900/95 via-[#FF9A00]/5 to-zinc-900/95"
      : "bg-gradient-to-r from-zinc-900/95 via-zinc-800/90 to-zinc-900/95",
    border: isMale
      ? "border-[#FF7800]/30 hover:border-[#FF7800]/50"
      : isFemale
      ? "border-[#FF9A00]/30 hover:border-[#FF9A00]/50"
      : "border-zinc-700/50 hover:border-[#FF7800]/70",
    shadow: isMale
      ? "hover:shadow-[#FF7800]/10"
      : isFemale
      ? "hover:shadow-[#FF9A00]/10"
      : "hover:shadow-[#FF7800]/20",
    profileRing: isMale
      ? "ring-[#FF7800]/40"
      : isFemale
      ? "ring-[#FF9A00]/40"
      : "ring-white/10",
    genderIcon: isMale
      ? "mdi:gender-male"
      : isFemale
      ? "mdi:gender-female"
      : null,
    genderColor: isMale
      ? "text-[#FF7800]"
      : isFemale
      ? "text-[#FF9A00]"
      : "text-gray-400",
    accent: isMale
      ? "from-[#FF7800]/10 to-[#FF7800]/10"
      : isFemale
      ? "from-[#FF9A00]/10 to-[#FF9A00]/10"
      : "from-[#FF7800]/10 to-[#FF7800]/10",
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
              className={`relative h-12 w-12 lg:h-14 lg:w-14 overflow-hidden rounded-xl ring-2 ring-white/10 group-hover/image:${genderStyles.profileRing} shadow-md transition-all duration-300`}
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
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF7800] to-[#FF9A00]">
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
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base lg:text-lg font-bold text-white truncate">
                {request.client.clientProfile.firstName}{" "}
                {request.client.clientProfile.lastName}
              </h3>

              {/* Gender icon */}
              {genderStyles.genderIcon && (
                <div
                  className={`p-1 rounded-full ${
                    isMale
                      ? "bg-[#FF7800]/20 border border-[#FF7800]/30"
                      : "bg-[#FF9A00]/20 border border-[#FF9A00]/30"
                  }`}
                >
                  <Icon
                    icon={genderStyles.genderIcon}
                    className={isMale ? "text-[#FF7800]" : "text-[#FF9A00]"}
                    width={12}
                    height={12}
                  />
                </div>
              )}

              {/* Request Date - Directly next to name */}
              <div className="flex items-center gap-1 bg-zinc-800/60 px-2 py-1 rounded-md border border-zinc-700/50">
                <Icon
                  icon="mdi:calendar-clock"
                  className="text-[#FF9A00]"
                  width={14}
                  height={14}
                />
                <span className="text-xs text-zinc-300 whitespace-nowrap">
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="flex items-center gap-1">
                <Icon
                  icon="mdi:calendar"
                  width={12}
                  height={12}
                  className="text-[#FF9A00]"
                />
                <span>
                  {calculateAge(request.client.clientProfile.dateOfBirth)} years
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Icon
                  icon="mdi:map-marker"
                  width={12}
                  height={12}
                  className="text-[#FF7800]"
                />
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
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-zinc-800/60 rounded-lg border border-zinc-700/50 max-w-xs">
            <Icon
              icon="mdi:message-text"
              className="text-[#FF9A00]"
              width={14}
              height={14}
            />
            <p className="text-zinc-300 text-sm italic truncate">
              "{request.note}"
            </p>
          </div>
        )}

        {/* Medical Alert */}
        {(request.client.clientProfile.medicalConditions ||
          request.client.clientProfile.allergies) && (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-amber-900/30 rounded-lg border border-amber-600/40">
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
            className="px-3 py-2 bg-zinc-800/60 hover:bg-zinc-700/80 border border-zinc-700/50 hover:border-[#FF7800]/70 text-zinc-200 hover:text-white transition-all duration-200 rounded-lg text-xs font-medium"
          >
            <span className="hidden lg:inline">Details</span>
          </Button>

          {/* Accept Button */}
          <Button
            variant="primary"
            size="small"
            onClick={() => onAcceptRequest(request)}
            leftIcon={<Icon icon="mdi:check" width={14} height={14} />}
            className="px-3 py-2 bg-[#FF7800] hover:bg-[#FF9A00] border border-[#FF9A00]/50 hover:border-[#FF9A00]/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
          >
            <span className="hidden lg:inline">Accept</span>
          </Button>

          {/* Reject Button */}
          <Button
            variant="secondary"
            size="small"
            onClick={() => onRejectRequest(request)}
            leftIcon={<Icon icon="mdi:close" width={14} height={14} />}
            className="px-3 py-2 bg-red-600/90 hover:bg-red-500 border border-red-500/50 hover:border-red-400/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
          >
            <span className="hidden lg:inline">Reject</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
