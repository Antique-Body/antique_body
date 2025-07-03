import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { UserEditProfile } from "./UserEditProfile";
import { UserSettings } from "./UserSettings";

import { Button } from "@/components/common/Button";

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
  showDetailedView = false,
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
      console.log("Profile data saved successfully:", profileData);
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

  // Enhanced header for trainers
  if (profileType === "trainer") {
    return (
      <>
        {/* Enhanced Trainer Header */}
        <div className="bg-white/[0.02] border border-zinc-800/60 rounded-xl p-6 mb-4">
          <div className="flex items-center gap-6">
            {/* Enhanced Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex items-center justify-center text-xl font-bold text-white shadow-lg ${
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
                    sizes="80px"
                    onError={() => setImageError(true)}
                    onLoadingComplete={() => setIsImageLoaded(true)}
                    loading="eager"
                  />
                )}
                {(!avatarContent || imageError || !isImageLoaded) && (
                  <span>{getInitials(profileTitle)}</span>
                )}
              </div>
              {/* Online Status */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900 shadow-sm"></div>

              {/* Click indicator for trainers */}
              {onHeaderClick && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg">
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
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div
                  className={`flex-1 min-w-0 ${
                    onHeaderClick ? "cursor-pointer" : ""
                  }`}
                  onClick={handleHeaderClick}
                >
                  {profileTitle && (
                    <h1 className="text-xl font-bold text-white truncate mb-1">
                      {profileTitle}
                    </h1>
                  )}
                  {profileSubtitle && (
                    <div className="text-sm text-[#FF6B00] font-medium truncate mb-2">
                      {profileSubtitle}
                    </div>
                  )}

                  {/* Enhanced Certifications */}
                  {certifications.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Icon
                        icon="mdi:certificate"
                        className="text-[#FF6B00]"
                        width={16}
                        height={16}
                      />
                      <span className="text-sm text-zinc-300 font-medium">
                        {certifications.length} Professional Certification
                        {certifications.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {/* Click hint */}
                  {onHeaderClick && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                      <Icon
                        icon="mdi:cursor-default-click"
                        width={12}
                        height={12}
                      />
                      <span>Click to view detailed profile</span>
                    </div>
                  )}
                </div>

                {/* Prominent Action Buttons */}
                <div className="flex gap-3 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditProfile(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Icon icon="mdi:pencil" width={14} height={14} />
                    <span className="text-xs">Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Icon icon="mdi:cog" width={14} height={14} />
                    <span className="text-xs">Settings</span>
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
  }

  // Enhanced header for clients (matching trainer design)
  return (
    <>
      {/* Enhanced Client Header */}
      <div className="bg-white/[0.02] border border-zinc-800/60 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-6">
          {/* Enhanced Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg ${
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
                  sizes="80px"
                  onError={() => setImageError(true)}
                  onLoadingComplete={() => setIsImageLoaded(true)}
                  loading="eager"
                />
              )}
              {(!avatarContent || imageError || !isImageLoaded) && (
                <span>{getInitials(profileTitle)}</span>
              )}
            </div>
            {/* Online Status */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900 shadow-sm"></div>

            {/* Click indicator for clients */}
            {onHeaderClick && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
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
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div
                className={`flex-1 min-w-0 ${
                  onHeaderClick ? "cursor-pointer" : ""
                }`}
                onClick={handleHeaderClick}
              >
                {profileTitle && (
                  <h1 className="text-xl font-bold text-white truncate mb-1">
                    {profileTitle}
                  </h1>
                )}
                {profileSubtitle && (
                  <div className="text-sm text-blue-400 font-medium truncate mb-2">
                    {profileSubtitle}
                  </div>
                )}

                {/* Progress Bar */}
                {showProgressBar && progressData && (
                  <div className="flex items-center gap-3 mb-3">
                    <Icon
                      icon="mdi:chart-line"
                      className="text-blue-500"
                      width={16}
                      height={16}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-zinc-300 font-medium">
                          Progress
                        </span>
                        <span className="text-sm text-blue-400 font-medium">
                          {Math.round(
                            (progressData.completed / progressData.total) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
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
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                    <Icon
                      icon="mdi:cursor-default-click"
                      width={12}
                      height={12}
                    />
                    <span>Click to view detailed profile</span>
                  </div>
                )}
              </div>

              {/* Prominent Action Buttons */}
              <div className="flex gap-3 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditProfile(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-500/90 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Icon icon="mdi:pencil" width={14} height={14} />
                  <span className="text-xs">Edit</span>
                </Button>

                <Button
                  variant="ghost"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Icon icon="mdi:cog" width={14} height={14} />
                  <span className="text-xs">Settings</span>
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
