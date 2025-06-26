import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  editProfilePath = "/trainer/edit-profile",
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const router = useRouter();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-start gap-6 py-6 md:flex-row">
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
          />
        )}
        {(!avatarContent || imageError || !isImageLoaded) && (
          <span>{getInitials(profileTitle)}</span>
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex w-full justify-between items-center">
          {profileTitle && (
            <h1 className="mb-1 text-2xl font-bold">{profileTitle}</h1>
          )}
          {profileSubtitle && (
            <p className="mb-4 font-medium text-[#FF6B00]">{profileSubtitle}</p>
          )}

          {profileType === "trainer" && certifications.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <span
                  key={index}
                  className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]"
                >
                  {cert}
                </span>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {showProgressBar && progressData && (
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Program Progress</span>
                <span>
                  {Math.round(
                    (progressData.completed / progressData.total) * 100
                  )}
                  %
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#333]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                  style={{
                    width: `${
                      (progressData.completed / progressData.total) * 100
                    }%`,
                  }}
                ></div>
              </div>
              {progressData.nextMilestone && (
                <p className="mt-1 text-xs text-gray-400">
                  Next milestone: {progressData.nextMilestone}
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end mb-4 px-1">
            <Button
              variant="secondary"
              leftIcon={
                <Icon icon="material-symbols:settings" width={16} height={16} />
              }
              onClick={() => router.push(editProfilePath)}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div>{children}</div>
      </div>
    </div>
  );
};
