import { Icon } from "@iconify/react";
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
      <div className={`mb-6 ${className || ""}`}>
        <div className="flex flex-col gap-3 bg-zinc-900 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-zinc-800 shadow-lg">
          {/* Search row */}
          <div
            className={`grid grid-cols-1 ${
              enableLocation ? "md:grid-cols-2" : ""
            } gap-3`}
          >
            {/* Search */}
            <div className="relative">
              <FormField
                ref={finalSearchRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className={`w-full bg-zinc-800 border-zinc-700 text-white rounded-lg ${colors.focusRing}`}
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
                    className="w-5 h-5 text-zinc-400 hover:text-white"
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
                  className={`w-full bg-zinc-800 border-zinc-700 text-white rounded-lg ${colors.focusRing}`}
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
                      className="w-5 h-5 text-zinc-400 hover:text-white"
                    />
                  </button>
                )}

                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions &&
                  (locationSuggestions.length > 0 || isLoadingLocations) && (
                    <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isLoadingLocations ? (
                        <div className="p-3 text-center text-zinc-400">
                          Loading locations...
                        </div>
                      ) : (
                        locationSuggestions.map((location) => (
                          <button
                            key={location.value}
                            className="w-full px-4 py-2 text-left hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none"
                            onClick={() => handleLocationSelect(location)}
                            type="button"
                          >
                            <div className="flex items-center">
                              <Icon
                                icon="mdi:map-marker"
                                className={`w-5 h-5 mr-2 ${colors.accentClass}`}
                              />
                              <span>{location.label}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Active filters and sort controls row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-zinc-300 text-sm">
                Found{" "}
                <span className="font-semibold text-white">{itemCount}</span>{" "}
                {itemLabel}
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 ml-2">
                  {searchQuery && (
                    <div
                      className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm text-white`}
                    >
                      <span>Search: {searchQuery}</span>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          // Maintain focus after clearing
                          setTimeout(() => {
                            if (finalSearchRef.current) {
                              finalSearchRef.current.focus();
                            }
                          }, 0);
                        }}
                        className="ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {selectedLocation && (
                    <div
                      className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm text-white`}
                    >
                      <Icon icon="mdi:map-marker" className="w-4 h-4 mr-1" />
                      <span>{selectedLocation.label}</span>
                      <button
                        onClick={() => {
                          setSelectedLocation(null);
                          setLocationSearch("");
                        }}
                        className="ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Exercise Type Filter Badge */}
                  {filters.type && (
                    <div
                      className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm text-white`}
                    >
                      <Icon icon="mdi:dumbbell" className="w-4 h-4 mr-1" />
                      <span>
                        Type:{" "}
                        {EXERCISE_TYPES.find((t) => t.value === filters.type)
                          ?.label || filters.type}
                      </span>
                      <button
                        onClick={() => handleExerciseFilterChange("type", "")}
                        className="ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Exercise Level Filter Badge */}
                  {filters.level && (
                    <div
                      className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm text-white`}
                    >
                      <Icon icon="mdi:signal" className="w-4 h-4 mr-1" />
                      <span>
                        Level:{" "}
                        {EXERCISE_LEVELS.find((l) => l.value === filters.level)
                          ?.label || filters.level}
                      </span>
                      <button
                        onClick={() => handleExerciseFilterChange("level", "")}
                        className="ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Exercise Location Filter Badge */}
                  {filters.location && (
                    <div
                      className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm text-white`}
                    >
                      <Icon icon="mdi:map" className="w-4 h-4 mr-1" />
                      <span>
                        Location:{" "}
                        {EXERCISE_LOCATIONS.find(
                          (l) => l.value === filters.location
                        )?.label || filters.location}
                      </span>
                      <button
                        onClick={() =>
                          handleExerciseFilterChange("location", "")
                        }
                        className="ml-2 hover:text-zinc-200"
                        type="button"
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Equipment Filter Badge */}
                  {filters.equipment !== undefined &&
                    filters.equipment !== "" && (
                      <div
                        className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm text-white`}
                      >
                        <Icon icon="mdi:weight" className="w-4 h-4 mr-1" />
                        <span>
                          Equipment:{" "}
                          {filters.equipment === "true" ? "Yes" : "No"}
                        </span>
                        <button
                          onClick={() =>
                            handleExerciseFilterChange("equipment", "")
                          }
                          className="ml-2 hover:text-zinc-200"
                          type="button"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                  {hasActiveFilters && (
                    <button
                      onClick={onClearFilters}
                      className={`text-sm ${colors.accentClass} hover:underline flex items-center`}
                      type="button"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Exercise Filters Button - Only if isExerciseFilter is true */}
              {isExerciseFilter && (
                <div className="relative" ref={exerciseFiltersRef}>
                  <Button
                    variant="secondary"
                    size="small"
                    className="flex items-center gap-2 bg-zinc-800 border border-zinc-700"
                    onClick={() => setShowExerciseFilters(!showExerciseFilters)}
                  >
                    <Icon icon="mdi:filter-variant" className="w-4 h-4" />
                    <span>Filters</span>
                    {(filters.type ||
                      filters.level ||
                      filters.location ||
                      (filters.equipment !== undefined &&
                        filters.equipment !== "")) && (
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs text-white ${colors.accentBg}`}
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
                  {showExerciseFilters && (
                    <div className="absolute right-0 z-50 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden">
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
                            handleExerciseFilterChange("level", e.target.value)
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
                            <option key={location.value} value={location.value}>
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
                              value={option.value === "yes" ? "true" : "false"}
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
                    </div>
                  )}
                </div>
              )}

              {/* Action Button - if provided */}
              {actionButton}

              {/* Desktop sort controls */}
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

              {/* Mobile sort dropdown */}
              <div className="relative w-full sm:hidden" ref={dropdownRef}>
                <Button
                  variant="secondary"
                  size="small"
                  className="flex items-center justify-between w-full bg-zinc-800 border border-zinc-700 rounded-lg py-1.5 px-3"
                  onClick={() => setShowSortOptions(!showSortOptions)}
                >
                  <span className="flex items-center gap-2">
                    <Icon icon="mdi:sort" className="w-5 h-5" />
                    <span>
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
                    className="w-5 h-5"
                  />
                </Button>

                {/* Dropdown menu */}
                {showSortOptions && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortOption(option.value);
                          setShowSortOptions(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-700 transition-colors flex items-center justify-between ${
                          sortOption === option.value
                            ? `${colors.accentClass} bg-zinc-700/50`
                            : "text-zinc-300"
                        }`}
                        type="button"
                      >
                        {option.label}
                        {sortOption === option.value && (
                          <Icon icon="mdi:check" className="w-4 h-4 ml-2" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-zinc-700 px-4 py-2.5">
                      <button
                        onClick={() => {
                          toggleSortOrder();
                          setShowSortOptions(false);
                        }}
                        className="flex items-center text-sm text-zinc-300 hover:text-white transition-colors"
                        type="button"
                      >
                        <Icon
                          icon={
                            sortOrder === "asc"
                              ? "mdi:sort-ascending"
                              : "mdi:sort-descending"
                          }
                          className="w-4 h-4 mr-2"
                        />
                        {sortOrder === "asc" ? "Ascending" : "Descending"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SortControls.displayName = "SortControls";
