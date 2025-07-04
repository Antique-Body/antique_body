import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { Button } from "@/components/common/Button";
import { mapSpecialtyToLabel } from "@/utils/specialtyMapper";

export const TrainerCard = ({
  trainer,
  onRequestCoaching,
  onViewProfile,
  hasRequested,
  colorVariant = "blue",
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showGymsTooltip, setShowGymsTooltip] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const gymsTooltipRef = useRef(null);

  // Set theme colors based on colorVariant
  const themeColors = {
    primary: colorVariant === "blue" ? "#3E92CC" : "#FF6B00",
    secondary: colorVariant === "blue" ? "#2D7EB8" : "#E65A00",
    featured: colorVariant === "blue" ? "#FFD700" : "#FFD700", // Gold for both variants
  };

  // Calculate experience years based on trainerSince field
  const experienceYears = trainer.trainerSince
    ? `${new Date().getFullYear() - trainer.trainerSince}+ years`
    : trainer.trainerInfo?.totalSessions
    ? `${trainer.trainerInfo.totalSessions}+ sessions`
    : null;

  // Check if trainer has paid ads (featured)
  const isFeatured = trainer.paidAds && new Date(trainer.paidAds) > new Date();

  // Format distance to be more concise
  const formatDistance = (distance) => {
    if (typeof distance !== "number") return null;

    // For distances under 1km, show in meters
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    // For distances under 10km, show one decimal place
    if (distance < 10) {
      return `${distance.toFixed(1)}km`;
    }
    // For larger distances, round to nearest whole number
    return `${Math.round(distance)}km`;
  };

  // Map specialties using the specialtyMapper utility
  const mappedSpecialties = trainer.specialties.map((specialty) => ({
    id: specialty.id,
    name: mapSpecialtyToLabel(specialty.name),
  }));

  // Handle showing/hiding gym tooltip
  const handleGymsMouseEnter = (e) => {
    e.stopPropagation();
    setShowGymsTooltip(true);
  };

  const handleGymsMouseLeave = (e) => {
    e.stopPropagation();
    setShowGymsTooltip(false);
  };

  // Handle card click to open profile modal
  const handleCardClick = (e) => {
    // Don't trigger if clicking on buttons or interactive elements
    if (e.target.closest("button") || e.target.closest("a")) {
      return;
    }
    onViewProfile(trainer);
  };

  // Toggle accordion
  const toggleAccordion = (e) => {
    e.stopPropagation();
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Format pricing display based on pricing type
  const getPricingDisplay = () => {
    if (trainer.pricePerSession) {
      return (
        <>
          ${trainer.pricePerSession}
          <span className="text-xs font-normal text-zinc-400">
            /{trainer.pricingType === "per_session" ? "session" : "package"}
          </span>
        </>
      );
    } else {
      // Handle different pricing types
      switch (trainer.pricingType) {
        case "contact_for_pricing":
          return "Contact for pricing";
        case "free_consultation":
          return "Free consultation";
        case "variable":
          return "Variable pricing";
        default:
          return "Price not specified";
      }
    }
  };

  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Icon
            key={i}
            icon="mdi:star"
            className={`text-[${themeColors.primary}] w-3 h-3 sm:w-4 sm:h-4`}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Icon
            key={i}
            icon="mdi:star-half"
            className={`text-[${themeColors.primary}] w-3 h-3 sm:w-4 sm:h-4`}
          />
        );
      } else {
        stars.push(
          <Icon
            key={i}
            icon="mdi:star-outline"
            className="text-zinc-600 w-3 h-3 sm:w-4 sm:h-4"
          />
        );
      }
    }

    return stars;
  };

  return (
    <div
      className={`group flex flex-col h-full overflow-hidden rounded-xl border transition-all duration-300 bg-gradient-to-b from-zinc-900 to-black cursor-pointer ${
        hasRequested
          ? `border-[${themeColors.primary}]`
          : isFeatured
          ? "border-[#FFD700]"
          : "border-zinc-800"
      } hover:border-[${themeColors.primary}] hover:shadow-lg hover:shadow-[${
        themeColors.primary
      }]/10 hover:translate-y-[-2px] sm:hover:translate-y-[-4px]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative flex h-full flex-col">
        {/* Top accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] sm:h-[3px] ${
            isFeatured ? "bg-[#FFD700]" : `bg-[${themeColors.primary}]`
          } scale-x-[0.6] transform transition-transform duration-300 ease-in-out group-hover:scale-x-100`}
          style={{
            backgroundColor: isFeatured ? "#FFD700" : themeColors.primary,
          }}
        ></div>

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute right-0 top-0 z-2">
            <div className="flex items-center gap-1 bg-[#FFD700] px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[10px] sm:text-xs font-medium text-black rounded-bl-lg">
              <Icon
                icon="mdi:star"
                width={10}
                height={10}
                className="sm:w-3 sm:h-3"
              />
              <span className="hidden sm:inline">Featured</span>
              <span className="sm:hidden">★</span>
            </div>
          </div>
        )}

        {/* Image section */}
        <div className="relative aspect-[3/2] overflow-hidden">
          {trainer.profileImage ? (
            <>
              <div
                className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 ${
                  isImageLoaded ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Icon
                    icon="mdi:account"
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-zinc-700"
                  />
                </div>
              </div>
              <Image
                src={trainer.profileImage}
                alt={`${trainer.firstName} ${trainer.lastName || ""}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-700 ${
                  isHovered ? "scale-105" : "scale-100"
                } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <Icon
                icon="mdi:account"
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-zinc-700"
              />
            </div>
          )}

          {/* Image overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* Trainer name and location - bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
            <h3 className="text-xs sm:text-sm md:text-lg font-bold text-white mb-1 line-clamp-1">
              {trainer.firstName} {trainer.lastName || ""}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-[10px] sm:text-xs text-zinc-300 flex items-center">
                <Icon
                  icon="mdi:map-marker"
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-[${themeColors.primary}] mr-1 flex-shrink-0`}
                  style={{ color: themeColors.primary }}
                />
                <span className="line-clamp-1">{trainer.location.city}</span>
              </p>

              {/* Pending status badge - small dot style */}
              {hasRequested && (
                <div
                  className={`flex items-center gap-1 bg-[${themeColors.primary}] rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[10px] sm:text-xs font-medium text-white`}
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-white animate-pulse"></span>
                  <span className="hidden sm:inline">Pending</span>
                  <span className="sm:hidden">•</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card content section */}
        <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
          {/* Rating and experience in single row */}
          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
            <div className="flex items-center">
              <div className="flex gap-0.5">
                {renderStars(trainer.trainerInfo?.rating || 0)}
              </div>
              <span className="ml-1 sm:ml-1.5 text-white text-[10px] sm:text-xs font-medium">
                {trainer.trainerInfo?.rating
                  ? trainer.trainerInfo.rating.toFixed(1)
                  : "N/A"}
              </span>
              <span className="text-zinc-400 text-[10px] sm:text-xs ml-0.5">
                ({trainer.trainerInfo?.reviewCount || 0})
              </span>
            </div>

            {/* Experience badge - only if experienceYears is not null */}
            {experienceYears && (
              <div className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-zinc-800/70 rounded-full text-zinc-300">
                {experienceYears.length > 12
                  ? experienceYears
                      .replace("+ years", "+y")
                      .replace("+ sessions", "+s")
                  : experienceYears}
              </div>
            )}
          </div>

          {/* Distance to gym - Compact version */}
          {typeof trainer.distance == "number" && (
            <div className="mb-2 bg-zinc-800/30 rounded-lg p-2 border border-zinc-700/30">
              <div className="flex items-center gap-1.5">
                <Icon
                  icon="mdi:directions"
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-[${themeColors.primary}] flex-shrink-0`}
                  style={{ color: themeColors.primary }}
                />
                <span className="text-[10px] sm:text-xs font-medium text-white">
                  {trainer.distanceSource === "gym" ? "To gym:" : "Distance:"}
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-bold text-[${themeColors.primary}]`}
                  style={{ color: themeColors.primary }}
                >
                  {formatDistance(trainer.distance)}
                </span>
              </div>
            </div>
          )}

          {/* Compact stats row */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            {/* Gym count */}
            {Array.isArray(trainer.trainerGyms) &&
              trainer.trainerGyms.length > 0 && (
                <div
                  className="relative flex items-center gap-1 bg-zinc-800/40 rounded-lg px-2 py-1 cursor-pointer hover:bg-zinc-800 flex-1"
                  onMouseEnter={handleGymsMouseEnter}
                  onMouseLeave={handleGymsMouseLeave}
                  ref={gymsTooltipRef}
                >
                  <Icon
                    icon="mdi:dumbbell"
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-[${themeColors.primary}]`}
                    style={{ color: themeColors.primary }}
                  />
                  <span className="text-[10px] sm:text-xs text-white">
                    {trainer.trainerGyms.length} gym
                    {trainer.trainerGyms.length !== 1 ? "s" : ""}
                  </span>

                {/* Gyms tooltip - Only show on larger screens */}
                {showGymsTooltip && (
                  <div className="hidden sm:block absolute bottom-full left-0 mb-2 w-56 bg-zinc-800 rounded-lg shadow-lg p-2 z-50 border border-zinc-700">
                    <div className="text-xs font-medium text-white mb-1">
                      Training Locations:
                    </div>
                    <ul className="text-xs text-zinc-300 space-y-1 max-h-40 overflow-y-auto">
                      {trainer.trainerGyms.map((gymData, idx) => (
                        <li
                          key={idx}
                          className="flex items-start py-1 border-b border-zinc-700/50 last:border-0"
                        >
                          <Icon
                            icon="mdi:map-marker"
                            className={`w-3 h-3 text-[${themeColors.primary}] mr-1 mt-0.5 flex-shrink-0`}
                            style={{ color: themeColors.primary }}
                          />
                          <div>
                            <div className="font-medium">
                              {gymData.gym?.name || "Unnamed Gym"}
                            </div>
                            {gymData.gym?.address && (
                              <div className="text-zinc-400 text-[10px]">
                                {gymData.gym.address}
                              </div>
                            )}
                            {idx === 0 &&
                              trainer.distanceSource === "gym" &&
                              typeof trainer.distance === "number" && (
                                <div
                                  className={`mt-0.5 text-[10px] bg-[${themeColors.primary}]/20 text-[${themeColors.primary}] px-1.5 py-0.5 rounded-full inline-block`}
                                  style={{
                                    backgroundColor: `${themeColors.primary}20`,
                                    color: themeColors.primary,
                                  }}
                                >
                                  {formatDistance(trainer.distance)} away
                                </div>
                              )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 transform rotate-45" />
                  </div>
                )}
              </div>
            )}

            {/* Client count */}
            <div className="flex items-center gap-1 bg-zinc-800/40 rounded-lg px-2 py-1 flex-1">
              <Icon
                icon="mdi:account-group"
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-[${themeColors.primary}]`}
                style={{ color: themeColors.primary }}
              />
              <span className="text-[10px] sm:text-xs text-white">
                {trainer.clientCount || 0} clients
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <p
              className={`text-sm sm:text-lg font-bold text-[${themeColors.primary}]`}
              style={{ color: themeColors.primary }}
            >
              {getPricingDisplay()}
            </p>

            {/* Session duration badge */}
            {trainer.sessionDuration && (
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-zinc-800 rounded-full text-zinc-400">
                {trainer.sessionDuration}min
              </span>
            )}
          </div>

          {/* Collapsible Details Accordion */}
          <div className="mb-2 sm:mb-3">
            <button
              onClick={toggleAccordion}
              className={`w-full flex items-center justify-between p-2 sm:p-3 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg border border-zinc-700/30 transition-all duration-200 ${
                isAccordionOpen ? "rounded-b-none border-b-0" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:information-outline"
                  className={`w-3 h-3 sm:w-4 sm:h-4 text-[${themeColors.primary}]`}
                  style={{ color: themeColors.primary }}
                />
                <span className="text-[10px] sm:text-xs font-medium text-white">
                  Details & Specialties
                </span>
              </div>
              <Icon
                icon="mdi:chevron-down"
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  isAccordionOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isAccordionOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-zinc-800/20 border border-zinc-700/30 border-t-0 rounded-b-lg p-2 sm:p-3 space-y-3">
                {/* Specialties */}
                <div>
                  <p className="text-[10px] sm:text-xs text-zinc-400 mb-1 font-medium">
                    Specialties:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {mappedSpecialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-[${themeColors.primary}]/10 text-[${themeColors.primary}] rounded-full border border-[${themeColors.primary}]/20`}
                        style={{
                          backgroundColor: `${themeColors.primary}10`,
                          color: themeColors.primary,
                          borderColor: `${themeColors.primary}20`,
                        }}
                      >
                        {specialty.name}
                      </span>
                    ))}
                    {mappedSpecialties.length > 3 && (
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-zinc-700 text-zinc-300 rounded-full">
                        +{mappedSpecialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                {trainer.certifications &&
                  trainer.certifications.length > 0 && (
                    <div>
                      <p className="text-[10px] sm:text-xs text-zinc-400 mb-1 font-medium">
                        Certifications:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {trainer.certifications
                          .slice(0, 2)
                          .map((cert, index) => (
                            <span
                              key={index}
                              className={`flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-[${themeColors.primary}]/10 text-[${themeColors.primary}] rounded-full border border-[${themeColors.primary}]/20`}
                              style={{
                                backgroundColor: `${themeColors.primary}10`,
                                color: themeColors.primary,
                                borderColor: `${themeColors.primary}20`,
                              }}
                            >
                              <Icon
                                icon="mdi:certificate"
                                className="w-2 h-2 sm:w-2.5 sm:h-2.5"
                              />
                              <span className="truncate max-w-[80px] sm:max-w-[100px]">
                                {cert.name}
                              </span>
                            </span>
                          ))}
                        {trainer.certifications.length > 2 && (
                          <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-zinc-700 text-zinc-300 rounded-full">
                            +{trainer.certifications.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {/* Description */}
                {trainer.description && (
                  <div>
                    <p className="text-[10px] sm:text-xs text-zinc-400 mb-1 font-medium">
                      About:
                    </p>
                    <p className="text-[10px] sm:text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                      {trainer.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons - Simplified for mobile */}
          <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-auto">
            <Button
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(trainer);
              }}
              className="w-full transition-transform duration-300 group-hover:-translate-y-1 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-xs sm:text-sm py-1.5 sm:py-2"
              leftIcon={
                <Icon
                  icon="mdi:eye"
                  width={12}
                  height={12}
                  className="sm:w-[14px] sm:h-[14px]"
                />
              }
            >
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">View</span>
            </Button>
            <Button
              variant={hasRequested ? "secondary" : "primary"}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRequestCoaching(trainer);
              }}
              disabled={hasRequested}
              className={`w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 text-xs sm:text-sm py-1.5 sm:py-2 ${
                hasRequested
                  ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                  : `bg-[${themeColors.primary}] hover:bg-[${themeColors.secondary}] border-[${themeColors.primary}]`
              }`}
              style={
                !hasRequested
                  ? {
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.primary,
                      "--hover-bg": themeColors.secondary,
                    }
                  : {}
              }
              leftIcon={
                hasRequested ? (
                  <Icon
                    icon="mdi:check-circle"
                    width={12}
                    height={12}
                    className="sm:w-[14px] sm:h-[14px]"
                  />
                ) : (
                  <Icon
                    icon="mdi:account-multiple"
                    width={12}
                    height={12}
                    className="sm:w-[14px] sm:h-[14px]"
                  />
                )
              }
            >
              {hasRequested ? "Requested" : "Request"}
            </Button>
            <div className="col-span-2">
              <Button
                variant="outline"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/client/dashboard/messages?trainer=${trainer.id}`
                  );
                }}
                leftIcon={
                  <Icon
                    icon="mdi:message-outline"
                    width={12}
                    height={12}
                    className="sm:w-[14px] sm:h-[14px]"
                  />
                }
                className={`w-full text-[${themeColors.primary}] mt-1 sm:mt-2 transition-transform duration-300 group-hover:-translate-y-1 border-zinc-700 hover:border-[${themeColors.primary}] text-xs sm:text-sm py-1.5 sm:py-2`}
                style={{
                  color: themeColors.primary,
                  "--hover-border": themeColors.primary,
                }}
              >
                Message
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced hover effect */}
        <div
          className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: isHovered
              ? isFeatured
                ? "0 0 20px 1px rgba(255, 215, 0, 0.2)"
                : `0 0 20px 1px ${themeColors.primary}33`
              : "none",
          }}
        />
      </div>
    </div>
  );
};
