import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/common/Button";

export const FilterChips = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
}) => {
  const removeSpecialty = (specialty) => {
    setFilters((prev) => ({
      ...prev,
      specialty: prev.specialty.filter((s) => s !== specialty),
    }));
  };

  const removeLocation = (location) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location.filter((l) => l !== location),
    }));
  };

  const removeAvailability = (day) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.filter((d) => d !== day),
    }));
  };

  const removeTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const resetPrice = () => {
    setFilters((prev) => ({
      ...prev,
      price: { min: 0, max: 200 },
    }));
  };

  const resetRating = () => {
    setFilters((prev) => ({
      ...prev,
      rating: 0,
    }));
  };

  const chipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            key="search-query"
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center px-2.5 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full"
          >
            <Icon
              icon="mdi:magnify"
              className="w-3.5 h-3.5 text-[#FF6B00] mr-1"
            />
            <span className="text-xs text-white truncate max-w-[150px]">
              {searchQuery}
            </span>
            <Button
              variant="ghostOrange"
              size="small"
              onClick={() => setSearchQuery("")}
              className="ml-1.5 p-0"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        )}

        {filters.specialty.map((specialty) => (
          <motion.div
            key={`specialty-${specialty}`}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
          >
            <span className="text-xs text-zinc-300 truncate max-w-[120px]">
              {specialty}
            </span>
            <Button
              variant="ghost"
              size="small"
              onClick={() => removeSpecialty(specialty)}
              className="ml-1.5 p-0"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}

        {filters.location.map((location) => (
          <motion.div
            key={`location-${location}`}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
          >
            <Icon
              icon="mdi:map-marker"
              className="w-3.5 h-3.5 text-[#FF6B00] mr-1"
            />
            <span className="text-xs text-zinc-300 truncate max-w-[120px]">
              {location}
            </span>
            <Button
              variant="ghost"
              size="small"
              onClick={() => removeLocation(location)}
              className="ml-1.5 p-0"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}

        {filters.availability.map((day) => (
          <motion.div
            key={`day-${day}`}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
          >
            <Icon
              icon="mdi:calendar"
              className="w-3.5 h-3.5 text-[#FF6B00] mr-1"
            />
            <span className="text-xs text-zinc-300">{day}</span>
            <Button
              variant="ghost"
              size="small"
              onClick={() => removeAvailability(day)}
              className="ml-1.5 p-0"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}

        {(filters.price.min > 0 || filters.price.max < 200) && (
          <motion.div
            key="price-range"
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
          >
            <Icon
              icon="mdi:currency-usd"
              className="w-3.5 h-3.5 text-[#FF6B00] mr-1"
            />
            <span className="text-xs text-zinc-300">
              ${filters.price.min} - ${filters.price.max}
            </span>
            <Button
              variant="ghost"
              size="small"
              onClick={resetPrice}
              className="ml-1.5 p-0"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        )}

        {filters.rating > 0 && (
          <motion.div
            key="rating-filter"
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
          >
            <Icon icon="mdi:star" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
            <span className="text-xs text-zinc-300">
              {filters.rating}+ Stars
            </span>
            <Button
              variant="ghost"
              size="small"
              onClick={resetRating}
              className="ml-1.5 p-0"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        )}

        {filters.tags.map((tag) => (
          <motion.div
            key={`tag-${tag}`}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
          >
            <Icon icon="mdi:tag" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
            <span className="text-xs text-zinc-300 truncate max-w-[100px]">
              {tag}
            </span>
            <Button
              variant="ghost"
              size="small"
              onClick={() => removeTag(tag)}
              className="ml-1.5 p-0"
            >
              <Icon icon="mdi:close" className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
