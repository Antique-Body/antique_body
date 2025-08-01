import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const ClientCard = ({
  clientRequest,
  handleViewClient,
  isPlanTracking = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const client = clientRequest.client;
  const profile = client.clientProfile;
  const profileImage = profile.profileImage || "/images/default-avatar.png";

  // Format date to be more concise
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-zinc-800 transition-all duration-300 bg-black hover:shadow-lg hover:translate-y-[-2px] cursor-pointer"
      onClick={() => handleViewClient(clientRequest)}
    >
      <div className="relative flex h-full flex-col">
        {/* Banner Section */}
        <div className="relative h-44 overflow-hidden">
          {/* Blurred background banner */}
          <div className="absolute inset-0">
            <div
              className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 ${
                bannerLoaded ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
            />
            <Image
              src={profileImage}
              alt="Banner"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-700 ${
                bannerLoaded ? "opacity-100" : "opacity-0"
              } group-hover:scale-105 blur-sm`}
              onLoad={() => setBannerLoaded(true)}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Status badge - top right */}
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white bg-[#3E92CC]">
            <Icon icon="mdi:check-circle" className="h-2 w-2" />
            <span>Active</span>
          </div>

          {/* Date overlay - top left */}
          <div className="absolute top-2 left-2 bg-black/70 rounded-md px-2 py-1">
            <div className="flex items-center text-xs text-white">
              <Icon
                icon="mdi:calendar-check"
                className="w-3 h-3 mr-1 text-[#3E92CC]"
              />
              <span>{formatDate(clientRequest.respondedAt)}</span>
            </div>
          </div>
        </div>

        {/* Profile Image - Overlapping the banner */}
        <div className="relative -mt-32 flex justify-center">
          <div className="relative w-44 h-44 rounded-full border-4 border-black bg-black overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 ${
                imageLoaded ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300 flex items-center justify-center`}
            >
              <Icon icon="mdi:account" className="w-8 h-8 text-zinc-700" />
            </div>
            <Image
              src={profileImage}
              alt={`${profile.firstName} ${profile.lastName}`}
              fill
              sizes="96px"
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 px-4 pt-3 pb-4 flex flex-col">
          {/* Name */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-white">
              {profile.firstName} {profile.lastName}
            </h3>
          </div>

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1"></div>

          {/* Action buttons - Fixed to bottom */}
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleViewClient(clientRequest);
              }}
              className="transition-transform duration-300 bg-[#3E92CC] hover:bg-[#2D7EB8] border-[#3E92CC]/50 hover:border-[#2D7EB8]/70 text-white py-2.5"
              leftIcon={
                <Icon
                  icon={isPlanTracking ? "mdi:chart-line" : "mdi:eye"}
                  width={16}
                  height={16}
                />
              }
            >
              {isPlanTracking ? "Track Plan" : "View Profile"}
            </Button>

            <Button
              variant="secondary"
              disabled
              className="transition-transform duration-300 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 py-2.5"
              leftIcon={<Icon icon="mdi:message" width={16} height={16} />}
            >
              Message
            </Button>


          </div>
        </div>
      </div>
    </div>
  );
};
