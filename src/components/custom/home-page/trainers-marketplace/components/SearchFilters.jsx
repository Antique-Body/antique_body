import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { FilterChips } from "./FilterChips";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { RatingStars } from "./RatingStars";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import {
  getAllAvailabilityDays,
  getAllLocations,
  getAllSpecialties,
  getAllTags,
} from "@/components/custom/home-page/trainers-marketplace/data/trainersData";

export const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState({
    specialty: true,
    location: false,
    availability: false,
    price: true,
    rating: true,
    tags: false,
  });

  const specialties = getAllSpecialties();
  const locations = getAllLocations();
  const availabilityDays = getAllAvailabilityDays();
  const tags = getAllTags();

  const toggleSection = (section) => {
    setIsExpanded({
      ...isExpanded,
      [section]: !isExpanded[section],
    });
  };

  const handleSpecialtyChange = (specialty) => {
    setFilters((prev) => {
      const newSpecialties = prev.specialty.includes(specialty)
        ? prev.specialty.filter((s) => s !== specialty)
        : [...prev.specialty, specialty];

      return { ...prev, specialty: newSpecialties };
    });
  };

  const handleLocationChange = (location) => {
    setFilters((prev) => {
      const newLocations = prev.location.includes(location)
        ? prev.location.filter((l) => l !== location)
        : [...prev.location, location];

      return { ...prev, location: newLocations };
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

  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({ ...prev, price: { min, max } }));
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

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    count += filters.specialty.length;
    count += filters.location.length;
    count += filters.availability.length;
    count += filters.price.min > 0 || filters.price.max < 200 ? 1 : 0;
    count += filters.rating > 0 ? 1 : 0;
    count += filters.tags.length;
    return count;
  };

  const hasActiveFilters = countActiveFilters() > 0 || searchQuery !== "";

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
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

      {/* Search input */}
      <div className="relative mb-6">
        <FormField
          type="text"
          name="searchTrainers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-0 w-full bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
          placeholder="Search trainers..."
          prefixIcon="mdi:magnify"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="small"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setSearchQuery("")}
          >
            <Icon
              icon="mdi:close"
              className="h-5 w-5 text-zinc-400 hover:text-white"
            />
          </Button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="mb-4">
          <FilterChips
            filters={filters}
            setFilters={setFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      )}

      {/* Specialty filter */}
      <div className="mb-4 border-t border-zinc-800 pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection("specialty")}
        >
          <span className="font-medium">Specialty</span>
          <Icon
            icon={isExpanded.specialty ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5"
          />
        </Button>

        <AnimatePresence>
          {isExpanded.specialty && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mt-2">
                {specialties.map((specialty) => (
                  <FormField
                    key={specialty}
                    type="checkbox"
                    id={`specialty-${specialty}`}
                    name={`specialty-${specialty}`}
                    label={specialty}
                    checked={filters.specialty.includes(specialty)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    className="text-sm text-zinc-300"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location filter */}
      <div className="mb-4 border-t border-zinc-800 pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection("location")}
        >
          <span className="font-medium">Location</span>
          <Icon
            icon={isExpanded.location ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5"
          />
        </Button>

        <AnimatePresence>
          {isExpanded.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mt-2">
                {locations.map((location) => (
                  <FormField
                    key={location}
                    type="checkbox"
                    id={`location-${location}`}
                    name={`location-${location}`}
                    label={location}
                    checked={filters.location.includes(location)}
                    onChange={() => handleLocationChange(location)}
                    className="text-sm text-zinc-300"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Availability filter */}
      <div className="mb-4 border-t border-zinc-800 pt-4">
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection("availability")}
        >
          <span className="font-medium">Availability</span>
          <Icon
            icon={
              isExpanded.availability ? "mdi:chevron-up" : "mdi:chevron-down"
            }
            className="h-5 w-5"
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
                    className={`px-2.5 py-1 text-xs font-medium rounded-full`}
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
          <span className="font-medium">Price range</span>
          <Icon
            icon={isExpanded.price ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5"
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
              <PriceRangeSlider
                min={0}
                max={200}
                value={[filters.price.min, filters.price.max]}
                onChange={handlePriceChange}
              />
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
          <span className="font-medium">Rating</span>
          <Icon
            icon={isExpanded.rating ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5"
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
                        <RatingStars
                          rating={rating}
                          size={14}
                          className="mr-1"
                        />
                        & up
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
          <span className="font-medium">Tags</span>
          <Icon
            icon={isExpanded.tags ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="h-5 w-5"
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

      {/* Apply filters button on mobile */}
      <div className="mt-6 lg:hidden">
        <Button variant="orangeFilled" size="medium" className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
