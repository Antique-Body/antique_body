import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { RatingStars } from "./RatingStars";

import { Button } from "@/components/common/Button";

export const TrainerCard = ({ trainer, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="relative h-60 overflow-hidden">
        {trainer.image ? (
          <Image
            src={trainer.image}
            alt={trainer.name || "Trainer profile"}
            width={500}
            height={300}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <Icon icon="mdi:account" className="w-16 h-16 text-zinc-700" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        {/* Verification badge */}
        {trainer.isVerified && (
          <div className="absolute top-3 left-3 bg-[#FF6B00]/80 backdrop-blur-sm p-1.5 rounded-full">
            <Icon icon="mdi:check-circle" className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Featured badge - Made wider for translations */}
        {trainer.isFeatured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] px-3 py-1.5 rounded-md text-xs font-medium">
            Featured
          </div>
        )}

        {/* Price badge - Repositioned to bottom center */}
        <div className="absolute bottom-20 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm">
          <span className="font-semibold text-white">${trainer.price}</span>
          <span className="text-zinc-400 mx-1">
            /{trainer.priceUnit || "session"}
          </span>
        </div>

        {/* Trainer info overlay - Increased padding for longer names */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {trainer.name || "Unnamed Trainer"}
          </h3>
          <p className="text-sm text-zinc-300 flex items-center">
            <Icon
              icon="mdi:map-marker"
              className="w-4 h-4 text-[#FF6B00] mr-2 flex-shrink-0"
            />
            <span className="line-clamp-1">
              {trainer.location || "Location unknown"}
            </span>
          </p>
        </div>
      </div>

      {/* Trainer details - Using flex-1 to make it expand and push buttons to bottom */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Top section with specialty and ratings */}
        <div>
          {/* Specialty - Made wider for translations */}
          <div className="inline-block px-3 py-1.5 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-full mb-4 max-w-full">
            <span className="text-xs font-medium text-[#FF6B00] truncate block">
              {trainer.specialty || "General Training"}
            </span>
          </div>

          {/* Rating and reviews - More spaced layout */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <div className="flex items-center">
              <RatingStars rating={trainer.rating} size={14} />
              <span className="ml-2 text-white text-sm font-medium">
                {trainer.rating ? trainer.rating.toFixed(1) : "N/A"}
              </span>
              <span className="text-zinc-400 text-xs ml-1">
                ({trainer.reviewCount || 0})
              </span>
            </div>

            {trainer.experience && (
              <div className="text-zinc-400 text-xs px-2 py-1 bg-zinc-800/50 rounded-full">
                {trainer.experience}
              </div>
            )}
          </div>

          {/* Bio with line clamp - Increased line count for better readability */}
          <p className="text-zinc-400 text-sm mb-5 line-clamp-3 min-h-[3em]">
            {trainer.bio || "No biography provided for this trainer."}
          </p>

          {/* Stats - FIXED layout for "km away" text */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-zinc-900 rounded-lg p-3 flex items-start">
              <Icon
                icon="mdi:account-group"
                className="w-5 h-5 text-[#FF6B00] mr-3 flex-shrink-0 mt-0.5"
              />
              <div className="overflow-hidden">
                <div className="text-xs text-zinc-400">Clients</div>
                <div className="text-sm font-medium truncate">
                  {trainer.clientCount || 0}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-3 flex items-start">
              <Icon
                icon="mdi:map"
                className="w-5 h-5 text-[#FF6B00] mr-3 flex-shrink-0 mt-0.5"
              />
              <div className="overflow-hidden">
                <div className="text-xs text-zinc-400">Distance</div>
                <div className="text-sm font-medium truncate w-full">
                  {trainer.proximity || "Unknown"}
                </div>
              </div>
            </div>
          </div>

          {/* Tags - Made scrollable for many tags */}
          <div className="flex flex-wrap gap-1.5 mb-5 max-h-[50px] overflow-y-auto">
            {trainer.tags && trainer.tags.length > 0 ? (
              <>
                {trainer.tags.slice(0, 5).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
                {trainer.tags.length > 5 && (
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full whitespace-nowrap">
                    +{trainer.tags.length - 5} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs bg-zinc-800 text-zinc-500 px-2.5 py-1 rounded-full">
                No tags
              </span>
            )}
          </div>
        </div>

        {/* Actions - Made more spacious for translations */}
        <div className="flex gap-3 mt-auto">
          <Button
            variant="orangeFilled"
            size="small"
            className="flex-1 min-h-[40px] px-4"
            onClick={onClick}
          >
            View Profile
          </Button>

          <Button
            variant="outline"
            size="small"
            className="w-12 h-10 flex items-center justify-center flex-shrink-0"
            aria-label="Bookmark trainer"
          >
            <Icon icon="mdi:bookmark-outline" className="w-5 h-5" />
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
    </motion.div>
  );
};
