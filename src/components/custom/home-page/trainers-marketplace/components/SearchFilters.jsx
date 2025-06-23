import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { SPECIALTIES } from "@/enums/specialties";

export const SearchFilters = ({
  filters,
  setFilters,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState({
    availability: false,
    price: true,
    rating: true,
    tags: false,
  });

  const availabilityDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const tags = SPECIALTIES.map((s) => s.label);

  const toggleSection = (section) => {
    setIsExpanded({
      ...isExpanded,
      [section]: !isExpanded[section],
    });
  };

  const handleAvailabilityChange = (day) => {
    setFilters((prev) => {
      const newAvailability = prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day];
      return { ...prev, availability: newAvailability };
    });
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setFilters((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: Number(value),
      },
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const handleTagChange = (tag) => {
    setFilters((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const countActiveFilters = () => {
    let count = 0;
    count += filters.availability.length;
    count += filters.price.min > 0 || filters.price.max < 200 ? 1 : 0;
    count += filters.rating > 0 ? 1 : 0;
    count += filters.tags.length;
    return count;
  };

  const hasActiveFilters = countActiveFilters() > 0;

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= rating ? "mdi:star" : "mdi:star-outline"}
          className={
            star <= rating
              ? "text-[#FF6B00] w-4 h-4"
              : "text-zinc-600 w-4 h-4"
          }
        />
      ))}
    </div>
  );

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="orangeText"
            size="small"
            onClick={onClearFilters}
            className="text-sm"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {filters.availability.map((day) => (
              <div
                key={day}
                className="flex items-center bg-[#FF6B00] text-white px-2 py-1 rounded-full text-xs"
              >
                <span className="mr-1">{day}</span>
                <button
                  onClick={() => handleAvailabilityChange(day)}
                  className="hover:text-zinc-200"
                >
                  <Icon icon="mdi:close" className="w-3 h-3" />
                </button>
              </div>
            ))}

            {(filters.price.min > 0 || filters.price.max < 200) && (
              <div className="flex items-center bg-[#FF6B00] text-white px-2 py-1 rounded-full text-xs">
                <span className="mr-1">
                  ${filters.price.min} - ${filters.price.max}
                </span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      price: { min: 0, max: 200 },
                    }))
                  }
                  className="hover:text-zinc-200"
                >
                  <Icon icon="mdi:close" className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.rating > 0 && (
              <div className="flex items-center bg-[#FF6B00] text-white px-2 py-1 rounded-full text-xs">
                <span className="mr-1">{filters.rating}+ stars</span>
                <button
                  onClick={() => handleRatingChange(0)}
                  className="hover:text-zinc-200"
                >
                  <Icon icon="mdi:close" className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-[#FF6B00] text-white px-2 py-1 rounded-full text-xs"
              >
                <span className="mr-1">{tag}</span>
                <button
                  onClick={() => handleTagChange(tag)}
                  className="hover:text-zinc-200"
                >
                  <Icon icon="mdi:close" className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability filter */}
      <div className="mb-4 border-t border-zinc-800 pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection("availability")}
        >
          <span className="font-medium text-white">Availability</span>
          <Icon
            icon={
              isExpanded.availability ? "mdi:chevron-up" : "mdi:chevron-down"
            }
            className="h-5 w-5 text-zinc-400"
          />
        </Button>

        <AnimatePresence>
          {isExpanded.availability && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-2">
                {availabilityDays.map((day) => (
                  <Button
                    key={day}
                    variant={
                      filters.availability.includes(day)
                        ? "orangeFilled"
                        : "secondary"
                    }
                    size="small"
                    onClick={() => handleAvailabilityChange(day)}
                    className="px-2.5 py-1 text-xs font-medium rounded-full"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price range filter */}
      <div className="mb-4 border-t border-zinc-800 pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection("price")}
        >
          <span className="font-medium text-white">Price range</span>
          <Icon
            icon={isExpanded.price ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5 text-zinc-400"
          />
        </Button>

        <AnimatePresence>
          {isExpanded.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">
                    Min: ${filters.price.min}
                  </span>
                  <span className="text-sm text-zinc-400">
                    Max: ${filters.price.max}
                  </span>
                </div>

                <input
                  type="range"
                  name="min"
                  min="0"
                  max="200"
                  value={filters.price.min}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B00]"
                />
                <input
                  type="range"
                  name="max"
                  min="0"
                  max="200"
                  value={filters.price.max}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B00]"
                />

                <div className="flex space-x-3">
                  <FormField
                    type="number"
                    name="min"
                    value={filters.price.min}
                    onChange={handlePriceChange}
                    min="0"
                    max={filters.price.max}
                    className="w-1/2 bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
                  />
                  <FormField
                    type="number"
                    name="max"
                    value={filters.price.max}
                    onChange={handlePriceChange}
                    min={filters.price.min}
                    max="200"
                    className="w-1/2 bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating filter */}
      <div className="mb-4 border-t border-zinc-800 pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection("rating")}
        >
          <span className="font-medium text-white">Rating</span>
          <Icon
            icon={isExpanded.rating ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5 text-zinc-400"
          />
        </Button>

        <AnimatePresence>
          {isExpanded.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mt-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <FormField
                    key={rating}
                    type="radio"
                    id={`rating-${rating}`}
                    name="rating"
                    label={
                      <div className="flex items-center">
                        {renderStars(rating)}
                        <span className="ml-2">& up</span>
                      </div>
                    }
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="text-sm text-zinc-300"
                  />
                ))}
                {filters.rating > 0 && (
                  <FormField
                    type="radio"
                    id="rating-0"
                    name="rating"
                    label="Any rating"
                    checked={filters.rating === 0}
                    onChange={() => handleRatingChange(0)}
                    className="text-sm text-zinc-300"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags filter */}
      <div className="mb-4 border-t border-zinc-800 pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection("tags")}
        >
          <span className="font-medium text-white">Specialties</span>
          <Icon
            icon={isExpanded.tags ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5 text-zinc-400"
          />
        </Button>

        <AnimatePresence>
          {isExpanded.tags && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant={
                      filters.tags.includes(tag) ? "orangeFilled" : "secondary"
                    }
                    size="small"
                    onClick={() => handleTagChange(tag)}
                    className="px-2.5 py-1 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Apply button (mobile) */}
      <div className="mt-6 lg:hidden">
        <Button variant="orangeFilled" size="medium" className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
