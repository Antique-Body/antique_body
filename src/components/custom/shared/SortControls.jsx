import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect, forwardRef } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import {
  EXERCISE_TYPES,
  EXERCISE_LEVELS,
  EXERCISE_LOCATIONS,
  EQUIPMENT_OPTIONS,
} from "@/enums/exerciseTypes";
import { searchCities } from "@/lib/googlePlaces";

export const SortControls = forwardRef(
  (
    {
      sortOption,
      setSortOption,
      sortOrder,
      setSortOrder,
      itemCount,
      sortOptions = [
        { value: "rating", label: "Rating" },
        { value: "price", label: "Price" },
        { value: "experience", label: "Experience" },
        { value: "name", label: "Name" },
      ],
      variant = "blue", // 'blue' or 'orange'
      className,
      // Search props
      searchQuery = "",
      setSearchQuery = () => {},
      searchPlaceholder = "Search...",
      // Location props
      enableLocation = true,
      locationSearch = "",
      setLocationSearch = () => {},
      selectedLocation = null,
      setSelectedLocation = () => {},
      // Filter props
      filters = {},
      setFilters = () => {},
      // Exercise filter props
      isExerciseFilter = false,
      // Action props
      onClearFilters = () => {},
      actionButton = null,
      itemLabel = "items",
      showSortControls = true,
    },
    ref
  ) => {
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] =
      useState(false);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);
    const [showExerciseFilters, setShowExerciseFilters] = useState(false);
    const dropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const exerciseFiltersRef = useRef(null);
    const searchInputRef = useRef(null);

    // Use the forwarded ref or fallback to internal ref
    const finalSearchRef = ref || searchInputRef;

    // Define color variants
    const colorVariants = {
      blue: {
        accent: "#3E92CC",
        accentClass: "text-[#3E92CC]",
        accentBg: "bg-[#3E92CC]",
        focusRing: "focus:ring-[#3E92CC]/40 focus:border-[#3E92CC]",
      },
      orange: {
        accent: "#FF6B00",
        accentClass: "text-[#FF6B00]",
        accentBg: "bg-[#FF6B00]",
        focusRing: "focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]",
      },
    };

    const colors = colorVariants[variant];

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setShowSortOptions(false);
        }
        if (
          locationDropdownRef.current &&
          !locationDropdownRef.current.contains(event.target)
        ) {
          setShowLocationSuggestions(false);
        }
        if (
          exerciseFiltersRef.current &&
          !exerciseFiltersRef.current.contains(event.target)
        ) {
          setShowExerciseFilters(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Handle location search
    useEffect(() => {
      if (!enableLocation) return;

      const fetchLocationSuggestions = async () => {
        if (locationSearch.length < 2) {
          setLocationSuggestions([]);
          return;
        }
        setIsLoadingLocations(true);
        try {
          const suggestions = await searchCities(locationSearch);
          setLocationSuggestions(suggestions);
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
          setLocationSuggestions([]);
        }
        setIsLoadingLocations(false);
      };

      const timeoutId = setTimeout(fetchLocationSuggestions, 300);
      return () => clearTimeout(timeoutId);
    }, [locationSearch, enableLocation]);

    const toggleSortOrder = () => {
      if (sortOption !== "location") {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      }
    };

    const handleLocationSelect = (location) => {
      setSelectedLocation(location);
      setLocationSearch(location.label);
      setShowLocationSuggestions(false);
    };

    // Handle search input change with focus preservation
    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchQuery(value);

      // Preserve cursor position and focus
      setTimeout(() => {
        if (finalSearchRef.current) {
          finalSearchRef.current.focus();
          // Restore cursor position
          const cursorPosition = e.target.selectionStart;
          finalSearchRef.current.setSelectionRange(
            cursorPosition,
            cursorPosition
          );
        }
      }, 0);
    };

    // Handle search clear with focus preservation
    const handleSearchClear = () => {
      setSearchQuery("");
      // Maintain focus after clearing
      setTimeout(() => {
        if (finalSearchRef.current) {
          finalSearchRef.current.focus();
        }
      }, 0);
    };

    // Handle exercise filter changes
    const handleExerciseFilterChange = (filterName, value) => {
      setFilters((prev) => ({
        ...prev,
        [filterName]: value,
      }));
    };

    // Check if any filters are active
    const hasActiveFilters =
      searchQuery ||
      selectedLocation ||
      Object.entries(filters).some(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object")
          return Object.values(value).some(
            (v) => v !== null && v !== undefined && v !== 0
          );
        return value;
      });

    return (
      <div className={`relative z-10 mb-3 sm:mb-6 ${className || ""}`}>
        <div className="flex flex-col gap-2 sm:gap-3 bg-zinc-900 backdrop-blur-md p-2 sm:p-4 rounded-xl border border-zinc-800 shadow-lg">
          {/* Search row */}
          <div
            className={`grid grid-cols-1 ${
              enableLocation ? "md:grid-cols-2" : ""
            } gap-2 sm:gap-3`}
          >
            {/* Search */}
            <div className="relative">
              <FormField
                ref={finalSearchRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className={`w-full bg-zinc-800 border-zinc-700 text-white rounded-lg text-sm sm:text-base h-9 sm:h-10 ${colors.focusRing}`}
                prefixIcon="mdi:magnify"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={handleSearchClear}
                  type="button"
                >
                  <Icon
                    icon="mdi:close"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-white"
                  />
                </button>
              )}
            </div>

            {/* Location Search - Only if enabled */}
            {enableLocation && (
              <div className="relative" ref={locationDropdownRef}>
                <FormField
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  placeholder="Search by location..."
                  className={`w-full bg-zinc-800 border-zinc-700 text-white rounded-lg text-sm sm:text-base h-9 sm:h-10 ${colors.focusRing}`}
                  prefixIcon="mdi:map-marker"
                />
                {locationSearch && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      setLocationSearch("");
                      setSelectedLocation(null);
                    }}
                    type="button"
                  >
                    <Icon
                      icon="mdi:close"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-white"
                    />
                  </button>
                )}

                {/* Location Suggestions Dropdown */}
                <AnimatePresence>
                  {showLocationSuggestions &&
                    (locationSuggestions.length > 0 || isLoadingLocations) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-[60] w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto"
                      >
                        {isLoadingLocations ? (
                          <div className="p-2 sm:p-3 text-center text-zinc-400 text-sm">
                            Loading locations...
                          </div>
                        ) : (
                          locationSuggestions.map((location) => (
                            <button
                              key={location.value}
                              className="w-full px-3 py-2 text-left hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none text-sm"
                              onClick={() => handleLocationSelect(location)}
                              type="button"
                            >
                              <div className="flex items-center">
                                <Icon
                                  icon="mdi:map-marker"
                                  className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${colors.accentClass}`}
                                />
                                <span>{location.label}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Active filters and sort controls row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="text-zinc-300 text-xs sm:text-sm">
                Found{" "}
                <span className="font-semibold text-white">{itemCount}</span>{" "}
                {itemLabel}
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-1 sm:ml-2">
                <AnimatePresence>
                  {searchQuery && (
                    <motion.div
                      layout
                      key="search-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex items-center ${colors.accentBg} px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white`}
                    >
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        Search: {searchQuery}
                      </span>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setTimeout(() => {
                            if (finalSearchRef.current) {
                              finalSearchRef.current.focus();
                            }
                          }, 0);
                        }}
                        className="ml-1.5 sm:ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon
                          icon="mdi:close"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                      </button>
                    </motion.div>
                  )}
                  {selectedLocation && (
                    <motion.div
                      layout
                      key="location-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex items-center ${colors.accentBg} px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white`}
                    >
                      <Icon
                        icon="mdi:map-marker"
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      />
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        {selectedLocation.label}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedLocation(null);
                          setLocationSearch("");
                        }}
                        className="ml-1.5 sm:ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon
                          icon="mdi:close"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                      </button>
                    </motion.div>
                  )}

                  {/* Exercise Type Filter Badge */}
                  {filters.type && (
                    <motion.div
                      layout
                      key="type-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex items-center ${colors.accentBg} px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white`}
                    >
                      <Icon
                        icon="mdi:dumbbell"
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      />
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        Type:{" "}
                        {EXERCISE_TYPES.find((t) => t.value === filters.type)
                          ?.label || filters.type}
                      </span>
                      <button
                        onClick={() => handleExerciseFilterChange("type", "")}
                        className="ml-1.5 sm:ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon
                          icon="mdi:close"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                      </button>
                    </motion.div>
                  )}

                  {/* Exercise Level Filter Badge */}
                  {filters.level && (
                    <motion.div
                      layout
                      key="level-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex items-center ${colors.accentBg} px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white`}
                    >
                      <Icon
                        icon="mdi:signal"
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      />
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        Level:{" "}
                        {EXERCISE_LEVELS.find((l) => l.value === filters.level)
                          ?.label || filters.level}
                      </span>
                      <button
                        onClick={() => handleExerciseFilterChange("level", "")}
                        className="ml-1.5 sm:ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon
                          icon="mdi:close"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                      </button>
                    </motion.div>
                  )}

                  {/* Exercise Location Filter Badge */}
                  {filters.location && (
                    <motion.div
                      layout
                      key="ex-location-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex items-center ${colors.accentBg} px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white`}
                    >
                      <Icon
                        icon="mdi:map"
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      />
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        Location:{" "}
                        {EXERCISE_LOCATIONS.find(
                          (l) => l.value === filters.location
                        )?.label || filters.location}
                      </span>
                      <button
                        onClick={() =>
                          handleExerciseFilterChange("location", "")
                        }
                        className="ml-1.5 sm:ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon
                          icon="mdi:close"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                      </button>
                    </motion.div>
                  )}

                  {/* Equipment Filter Badge */}
                  {filters.equipment !== undefined &&
                    filters.equipment !== "" && (
                      <motion.div
                        layout
                        key="equipment-chip"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`flex items-center ${colors.accentBg} px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-white`}
                      >
                        <Icon
                          icon="mdi:weight"
                          className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                        />
                        <span className="truncate max-w-[100px] sm:max-w-none">
                          Equipment:{" "}
                          {filters.equipment === "true" ? "Yes" : "No"}
                        </span>
                        <button
                          onClick={() =>
                            handleExerciseFilterChange("equipment", "")
                          }
                          className="ml-1.5 sm:ml-2 hover:text-zinc-200"
                          type="button"
                        >
                          <Icon
                            icon="mdi:close"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                        </button>
                      </motion.div>
                    )}

                  {hasActiveFilters && (
                    <motion.div
                      layout
                      key="clear-chip"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <button
                        onClick={onClearFilters}
                        className={`text-xs sm:text-sm mt-1 ${colors.accentClass} hover:underline flex items-center`}
                        type="button"
                      >
                        Clear all
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Exercise Filters Button - Only if isExerciseFilter is true */}
              {isExerciseFilter && (
                <div
                  className="relative flex-1 sm:flex-none"
                  ref={exerciseFiltersRef}
                >
                  <Button
                    variant="secondary"
                    size="small"
                    className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={() => setShowExerciseFilters(!showExerciseFilters)}
                  >
                    <Icon
                      icon="mdi:filter-variant"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    <span>Filters</span>
                    {(filters.type ||
                      filters.level ||
                      filters.location ||
                      (filters.equipment !== undefined &&
                        filters.equipment !== "")) && (
                      <span
                        className={`inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-xs text-white ${colors.accentBg}`}
                      >
                        {
                          [
                            filters.type,
                            filters.level,
                            filters.location,
                            filters.equipment !== undefined &&
                            filters.equipment !== ""
                              ? "equipment"
                              : null,
                          ].filter(Boolean).length
                        }
                      </span>
                    )}
                  </Button>

                  {/* Exercise Filters Dropdown */}
                  <AnimatePresence>
                    {showExerciseFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 z-[60] mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden"
                      >
                        <div className="p-3 border-b border-zinc-700">
                          <h3 className="font-medium text-white">
                            Filter Exercises
                          </h3>
                        </div>

                        {/* Exercise Type Filter */}
                        <div className="p-3 border-b border-zinc-700">
                          <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Exercise Type
                          </label>
                          <select
                            className="w-full bg-zinc-700 border border-zinc-600 rounded text-white p-2 text-sm"
                            value={filters.type || ""}
                            onChange={(e) =>
                              handleExerciseFilterChange("type", e.target.value)
                            }
                          >
                            <option value="">All Types</option>
                            {EXERCISE_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Exercise Level Filter */}
                        <div className="p-3 border-b border-zinc-700">
                          <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Difficulty Level
                          </label>
                          <select
                            className="w-full bg-zinc-700 border border-zinc-600 rounded text-white p-2 text-sm"
                            value={filters.level || ""}
                            onChange={(e) =>
                              handleExerciseFilterChange(
                                "level",
                                e.target.value
                              )
                            }
                          >
                            <option value="">All Levels</option>
                            {EXERCISE_LEVELS.map((level) => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Exercise Location Filter */}
                        <div className="p-3 border-b border-zinc-700">
                          <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Location
                          </label>
                          <select
                            className="w-full bg-zinc-700 border border-zinc-600 rounded text-white p-2 text-sm"
                            value={filters.location || ""}
                            onChange={(e) =>
                              handleExerciseFilterChange(
                                "location",
                                e.target.value
                              )
                            }
                          >
                            <option value="">All Locations</option>
                            {EXERCISE_LOCATIONS.map((location) => (
                              <option
                                key={location.value}
                                value={location.value}
                              >
                                {location.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Equipment Filter */}
                        <div className="p-3 border-b border-zinc-700">
                          <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Equipment Required
                          </label>
                          <select
                            className="w-full bg-zinc-700 border border-zinc-600 rounded text-white p-2 text-sm"
                            value={filters.equipment || ""}
                            onChange={(e) =>
                              handleExerciseFilterChange(
                                "equipment",
                                e.target.value
                              )
                            }
                          >
                            <option value="">All</option>
                            {EQUIPMENT_OPTIONS.map((option) => (
                              <option
                                key={option.value}
                                value={
                                  option.value === "yes" ? "true" : "false"
                                }
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Filter Actions */}
                        <div className="p-3 flex justify-between">
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => {
                              handleExerciseFilterChange("type", "");
                              handleExerciseFilterChange("level", "");
                              handleExerciseFilterChange("location", "");
                              handleExerciseFilterChange("equipment", "");
                            }}
                          >
                            Clear Filters
                          </Button>
                          <Button
                            variant={
                              variant === "blue" ? "primary" : "orangeFilled"
                            }
                            size="small"
                            onClick={() => setShowExerciseFilters(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Action Button - if provided */}
              {actionButton}

              {/* Desktop sort controls */}
              {showSortControls && (
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-zinc-400 text-sm">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={`bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${colors.focusRing}`}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={toggleSortOrder}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-1.5 hover:bg-zinc-700 transition-colors"
                    aria-label={
                      sortOrder === "asc" ? "Sort descending" : "Sort ascending"
                    }
                  >
                    <Icon
                      icon={
                        sortOrder === "asc"
                          ? "mdi:sort-ascending"
                          : "mdi:sort-descending"
                      }
                      className="w-5 h-5 text-zinc-300"
                    />
                  </Button>
                </div>
              )}

              {/* Mobile sort dropdown */}
              <div className="relative flex-1 sm:hidden" ref={dropdownRef}>
                <Button
                  variant="secondary"
                  size="small"
                  className="flex items-center justify-between w-full bg-zinc-800 border border-zinc-700 rounded-lg py-1 px-2 h-8 text-xs"
                  onClick={() => setShowSortOptions(!showSortOptions)}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon icon="mdi:sort" className="w-4 h-4" />
                    <span className="truncate">
                      Sort:{" "}
                      {
                        sortOptions.find((opt) => opt.value === sortOption)
                          ?.label
                      }
                    </span>
                  </span>
                  <Icon
                    icon={
                      showSortOptions ? "mdi:chevron-up" : "mdi:chevron-down"
                    }
                    className="w-4 h-4 flex-shrink-0"
                  />
                </Button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {showSortOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-1 z-[60] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortOption(option.value);
                            setShowSortOptions(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-zinc-700 transition-colors flex items-center justify-between ${
                            sortOption === option.value
                              ? `${colors.accentClass} bg-zinc-700/50`
                              : "text-zinc-300"
                          }`}
                          type="button"
                        >
                          {option.label}
                          {sortOption === option.value && (
                            <Icon icon="mdi:check" className="w-3 h-3 ml-2" />
                          )}
                        </button>
                      ))}
                      <div className="border-t border-zinc-700 px-3 py-2">
                        <button
                          onClick={() => {
                            toggleSortOrder();
                            setShowSortOptions(false);
                          }}
                          className="flex items-center text-xs text-zinc-300 hover:text-white transition-colors"
                          type="button"
                        >
                          <Icon
                            icon={
                              sortOrder === "asc"
                                ? "mdi:sort-ascending"
                                : "mdi:sort-descending"
                            }
                            className="w-3 h-3 mr-2"
                          />
                          {sortOrder === "asc" ? "Ascending" : "Descending"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SortControls.displayName = "SortControls";
