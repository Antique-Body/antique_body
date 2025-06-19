import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";

import { RatingStars } from "./RatingStars";

import { Button } from "@/components/common/Button";

export const TrainerCard = ({ trainer, onClick }) => {
  // Debug: log each trainer rendered
  console.log("Rendering TrainerCard:", trainer);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const gymsTooltipRef = useRef(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

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

  // Get closest gym info
  const getClosestGym = () => {
    if (!Array.isArray(trainer.gyms) || trainer.gyms.length === 0) {
      return null;
    }

    // If we have a specific gym that's the source of the distance
    if (trainer.distanceSource === "gym" && trainer.gyms.length > 0) {
      return trainer.gyms[0].gym || trainer.gyms[0];
    }

    return null;
  };

  const closestGym = getClosestGym();

  // Handle showing/hiding gym tooltip
  const handleGymsMouseEnter = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
  };

  const handleGymsMouseLeave = (e) => {
    e.stopPropagation();
    setShowTooltip(false);
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`relative group rounded-xl overflow-hidden transition-all duration-300 bg-gradient-to-b from-zinc-900 to-black border flex flex-col h-full ${
        isHovered
          ? "border-[#FF6B00]/50 shadow-lg shadow-[#FF6B00]/10"
          : "border-zinc-800"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image section with overlay */}
      <div className="relative aspect-[3/2] overflow-hidden">
        {trainer.image ? (
          <>
            <div
              className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 ${
                isImageLoaded ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Icon icon="mdi:account" className="w-12 h-12 text-zinc-700" />
              </div>
            </div>
            <Image
              src={trainer.image}
              alt={trainer.name || "Trainer profile"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onLoad={() => setIsImageLoaded(true)}
              className={`object-cover transition-all duration-700 ${
                isHovered ? "scale-105" : "scale-100"
              } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <Icon icon="mdi:account" className="w-12 h-12 text-zinc-700" />
          </div>
        )}

        {/* Image overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        {/* Top badges container */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
          {/* Left badges */}
          <div className="flex flex-col gap-2">
            {trainer.isVerified && (
              <div className="bg-[#FF6B00]/80 backdrop-blur-sm p-1.5 rounded-full">
                <Icon icon="mdi:check-circle" className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Right badges */}
          <div className="flex flex-col gap-2 items-end">
            {trainer.isFeatured && (
              <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] px-2.5 py-1 rounded-md text-xs font-medium shadow-sm">
                Featured
              </div>
            )}

            {/* Price badge */}
            <div className="bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm shadow-sm">
              <span className="font-semibold text-white">${trainer.price}</span>
              <span className="text-zinc-400 ml-1">
                /{trainer.priceUnit || "session"}
              </span>
            </div>
          </div>
        </div>

        {/* Trainer name and location - bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
            {trainer.name || "Unnamed Trainer"}
          </h3>
          <p className="text-xs text-zinc-300 flex items-center">
            <Icon
              icon="mdi:map-marker"
              className="w-3.5 h-3.5 text-[#FF6B00] mr-1 flex-shrink-0"
            />
            <span className="line-clamp-1">
              {trainer.location || "Location unknown"}
            </span>
          </p>
        </div>
      </div>

      {/* Card content section */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Rating and experience in single row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center">
            <RatingStars rating={trainer.rating} size={12} />
            <span className="ml-1 text-white text-xs font-medium">
              {trainer.rating ? trainer.rating.toFixed(1) : "N/A"}
            </span>
            <span className="text-zinc-400 text-xs ml-0.5">
              ({trainer.reviewCount || 0})
            </span>
          </div>

          {trainer.experience && (
            <div className="text-xs px-2 py-0.5 bg-zinc-800/70 rounded-full text-zinc-300">
              {trainer.experience}
            </div>
          )}
        </div>

        {/* Distance to closest gym - New prominent section */}
        {typeof trainer.distance === "number" &&
          trainer.distanceSource === "gym" &&
          closestGym && (
            <div className="mb-2.5 bg-zinc-800/30 rounded-lg p-2 border border-zinc-700/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon
                  icon="mdi:directions"
                  className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0"
                />
                <span className="text-xs font-medium text-white">
                  Distance to closest gym:
                </span>
              </div>
              <div className="flex items-center">
                <div className="ml-5 flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#FF6B00]">
                    {formatDistance(trainer.distance)}
                  </span>
                  <span className="text-xs text-zinc-400 line-clamp-1">
                    • {closestGym.name || closestGym.label},{" "}
                    {closestGym.address?.split(",")[0]}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* Bio with line clamp */}
        <p className="text-zinc-400 text-xs mb-2.5 line-clamp-2 min-h-[2.5em]">
          {trainer.bio || "No biography provided for this trainer."}
        </p>

        {/* Stats bar - Clean and minimal with tooltips */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          {/* Clients stat */}
          <div className="flex items-center gap-1 bg-zinc-800/40 rounded-full px-2 py-1">
            <Icon icon="mdi:account-group" className="w-3 h-3 text-[#FF6B00]" />
            <span className="text-xs text-white">
              {trainer.clientCount || 0} clients
            </span>
          </div>

          {/* Gyms stat with tooltip */}
          {Array.isArray(trainer.gyms) && trainer.gyms.length > 0 && (
            <div
              className="relative flex items-center gap-1 bg-zinc-800/40 rounded-full px-2 py-1 cursor-pointer"
              onMouseEnter={handleGymsMouseEnter}
              onMouseLeave={handleGymsMouseLeave}
              ref={gymsTooltipRef}
            >
              <Icon icon="mdi:dumbbell" className="w-3 h-3 text-[#FF6B00]" />
              <span className="text-xs text-white">
                {trainer.gyms.length}{" "}
                {trainer.gyms.length === 1 ? "gym" : "gyms"}
              </span>

              {/* Gyms tooltip */}
              {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-zinc-800 rounded-lg shadow-lg p-2 z-50 border border-zinc-700">
                  <div className="text-xs font-medium text-white mb-1">
                    Training Locations:
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1 max-h-40 overflow-y-auto">
                    {trainer.gyms.map((gym, idx) => {
                      const gymData = gym.gym || gym;
                      return (
                        <li
                          key={idx}
                          className="flex items-start py-1 border-b border-zinc-700/50 last:border-0"
                        >
                          <Icon
                            icon="mdi:map-marker"
                            className="w-3 h-3 text-[#FF6B00] mr-1 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="font-medium">
                              {gymData.name || gymData.label}
                            </div>
                            {gymData.address && (
                              <div className="text-zinc-400 text-[10px]">
                                {gymData.address}
                              </div>
                            )}
                            {idx === 0 &&
                              trainer.distanceSource === "gym" &&
                              typeof trainer.distance === "number" && (
                                <div className="mt-0.5 text-[10px] bg-[#FF6B00]/20 text-[#FF6B00] px-1.5 py-0.5 rounded-full inline-block">
                                  {formatDistance(trainer.distance)} away
                                </div>
                              )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 transform rotate-45"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags section */}
        <div className="flex flex-wrap gap-1 mb-3 max-h-[32px] overflow-y-auto">
          {trainer.tags && trainer.tags.length > 0 ? (
            <>
              {trainer.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-[10px] bg-zinc-800/50 text-zinc-300 px-2 py-0.5 rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
              {trainer.tags.length > 3 && (
                <span className="text-[10px] bg-zinc-800/50 text-zinc-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                  +{trainer.tags.length - 3}
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] bg-zinc-800/50 text-zinc-500 px-2 py-0.5 rounded-full">
              No specialties
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="orangeFilled"
            size="small"
            className="flex-1 min-h-[32px] text-xs px-2 shadow-sm"
            onClick={onClick}
          >
            View Profile
          </Button>

          <Button
            variant="outline"
            size="small"
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 p-0"
            aria-label="Bookmark trainer"
          >
            <Icon icon="mdi:bookmark-outline" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced hover effect */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 1px rgba(255, 107, 0, 0.2)"
            : "0 0 0px 0px rgba(255, 107, 0, 0)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Touch highlight effect for mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00]/10 to-transparent opacity-0 active:opacity-100 lg:hidden transition-opacity duration-200"></div>
    </motion.div>
  );
};
