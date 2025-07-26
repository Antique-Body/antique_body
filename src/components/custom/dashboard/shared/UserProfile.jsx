import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";

import { UserEditProfile } from "./UserEditProfile";
import { UserSettings } from "./UserSettings";


export const UserProfile = ({
  profileType = "client",
  avatarContent,
  showProgressBar = false,
  progressData = null,
  profileTitle,
  profileSubtitle,
  certifications = [],
  children,
  userData = {},
  onProfileUpdate,
  onHeaderClick,
  _showDetailedView = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileSave = async (profileData) => {
    try {
      if (onProfileUpdate) {
        await onProfileUpdate(profileData);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };

  const handleHeaderClick = () => {
    if (onHeaderClick) {
      onHeaderClick();
    }
  };

  return (
    <>
      {/* Enhanced Header - Fully Responsive */}
      <div className="bg-white/[0.02] border border-zinc-800/60 rounded-xl p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Enhanced Avatar */}
          <div className="relative flex-shrink-0 self-center sm:self-start">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold text-white shadow-lg ${
                onHeaderClick
                  ? "cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                  : ""
              }`}
              onClick={handleHeaderClick}
            >
              {avatarContent && !imageError && (
                <Image
                  src={avatarContent}
                  alt="Profile"
                  fill
                  priority
                  className={`object-cover transition-opacity duration-300 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 128px"
                  onError={() => setImageError(true)}
                  onLoad={() => setIsImageLoaded(true)}
                  loading="eager"
                />
              )}
              {(!avatarContent || imageError || !isImageLoaded) && (
                <span>{getInitials(profileTitle)}</span>
              )}
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-zinc-900 shadow-sm"></div>

            {/* Click indicator */}
            {onHeaderClick && (
              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg">
                <Icon
                  icon="mdi:eye"
                  width={12}
                  height={12}
                  className="text-white"
                />
              </div>
            )}
          </div>

          {/* Enhanced Profile Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div
                className={`flex-1 min-w-0 ${
                  onHeaderClick ? "cursor-pointer" : ""
                }`}
                onClick={handleHeaderClick}
              >
                {/* Profile Title */}
                {profileTitle && (
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate mb-2">
                    {profileTitle}
                  </h1>
                )}

                {/* Profile Subtitle - Enhanced for mobile */}
                {profileSubtitle && (
                  <div className="text-sm sm:text-base lg:text-lg text-[#FF6B00] font-medium mb-3 sm:mb-4">
                    {profileSubtitle}
                  </div>
                )}

                {/* Enhanced Certifications for trainers */}
                {profileType === "trainer" && certifications.length > 0 && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 sm:mb-4">
                    <Icon
                      icon="mdi:certificate"
                      className="text-[#FF6B00]"
                      width={16}
                      height={16}
                    />
                    <span className="text-sm sm:text-base text-zinc-300 font-medium">
                      {certifications.length} Professional Certification
                      {certifications.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {/* Progress Bar for clients */}
                {profileType === "client" &&
                  showProgressBar &&
                  progressData && (
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <Icon
                        icon="mdi:chart-line"
                        className="text-[#FF6B00] flex-shrink-0"
                        width={16}
                        height={16}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm sm:text-base text-zinc-300 font-medium">
                            Progress
                          </span>
                          <span className="text-sm sm:text-base text-[#FF6B00] font-medium">
                            {Math.round(
                              (progressData.completed / progressData.total) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (progressData.completed / progressData.total) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                {/* Click hint */}
                {onHeaderClick && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-zinc-500 mt-2">
                    <Icon
                      icon="mdi:cursor-default-click"
                      width={12}
                      height={12}
                    />
                    <span>Click to view detailed profile</span>
                  </div>
                )}
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex gap-2 sm:gap-3 flex-shrink-0 justify-center sm:justify-end">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditProfile(true);
                  }}
                  className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Icon icon="mdi:pencil" width={12} height={12} />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="ghost"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(true);
                  }}
                  className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Icon icon="mdi:cog" width={12} height={12} />
                  <span>Settings</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div>{children}</div>

      {/* Modals */}
      {showEditProfile && (
        <UserEditProfile
          profileType={profileType}
          userData={userData}
          onClose={() => setShowEditProfile(false)}
          onSave={handleProfileSave}
        />
      )}

      {showSettings && (
        <UserSettings
          profileType={profileType}
          userData={userData}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};
