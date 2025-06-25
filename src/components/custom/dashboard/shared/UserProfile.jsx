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
      // Call the onProfileUpdate callback if provided
      if (onProfileUpdate) {
        await onProfileUpdate(profileData);
        // Add a small delay to ensure data is refreshed
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      console.log("Profile data saved successfully:", profileData);
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-6 py-2 md:flex-row">
        <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-3xl font-semibold text-white transition-transform duration-300 hover:scale-105">
          {avatarContent && !imageError && (
            <Image
              src={avatarContent}
              alt="Profile"
              fill
              priority
              className={`object-cover transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 128px) 100vw, 128px"
              onError={() => setImageError(true)}
              onLoadingComplete={() => setIsImageLoaded(true)}
              loading="eager"
            />
          )}
          {(!avatarContent || imageError || !isImageLoaded) && (
            <span>{getInitials(profileTitle)}</span>
          )}
        </div>

        <div className="flex flex-col w-full">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              {profileTitle && (
                <h1 className="mb-2 text-2xl font-bold text-white">
                  {profileTitle}
                </h1>
              )}
              {profileSubtitle && (
                <p className="mb-3 font-medium text-[#FF6B00] text-base">
                  {profileSubtitle}
                </p>
              )}

              {profileType === "trainer" && certifications.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-3 py-1 text-xs font-medium text-[#FF6B00] transition-all hover:bg-[rgba(255,107,0,0.25)]"
                    >
                      <Icon icon="mdi:certificate" width={12} height={12} />
                      {cert}
                    </span>
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              {showProgressBar && progressData && (
                <div className="mb-4 p-4 bg-[rgba(255,107,0,0.05)] rounded-lg border border-[rgba(255,107,0,0.1)]">
                  <div className="mb-2 flex justify-between items-center text-sm">
                    <span className="font-medium text-white flex items-center gap-2">
                      <Icon
                        icon="mdi:progress-check"
                        width={16}
                        height={16}
                        className="text-[#FF6B00]"
                      />
                      Program Progress
                    </span>
                    <span className="font-semibold text-[#FF6B00]">
                      {Math.round(
                        (progressData.completed / progressData.total) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#333]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-500"
                      style={{
                        width: `${
                          (progressData.completed / progressData.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  {progressData.nextMilestone && (
                    <p className="mt-2 text-xs text-gray-400">
                      Next milestone:{" "}
                      <span className="text-white font-medium">
                        {progressData.nextMilestone}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="medium"
                leftIcon={
                  <Icon icon="mdi:account-edit" width={18} height={18} />
                }
                onClick={() => setShowEditProfile(true)}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:from-[#FF5500] hover:to-[#FF8500] text-white font-medium px-6  rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 !h-12"
              >
                Edit Profile
              </Button>

              <Button
                variant="outline"
                size="medium"
                leftIcon={<Icon icon="mdi:cog" width={18} height={18} />}
                onClick={() => setShowSettings(true)}
                className="border-2 border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.1)] hover:bg-[rgba(255,107,0,0.2)] text-[#FF6B00] hover:text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 backdrop-blur-sm hover:border-[#FF6B00] hover:shadow-lg"
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div>{children}</div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <UserEditProfile
          profileType={profileType}
          userData={userData}
          onClose={() => setShowEditProfile(false)}
          onSave={handleProfileSave}
        />
      )}

      {/* Settings Modal */}
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
