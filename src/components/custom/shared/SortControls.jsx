import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { searchCities } from "@/lib/googlePlaces";

export const SortControls = ({
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
  // New props for search and location
  searchQuery = "",
  setSearchQuery = () => {},
  locationSearch = "",
  setLocationSearch = () => {},
  selectedLocation = null,
  setSelectedLocation = () => {},
  onClearFilters = () => {},
}) => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const dropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle location search
  useEffect(() => {
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
  }, [locationSearch]);

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

  const hasActiveFilters = searchQuery || selectedLocation;

  return (
    <div className={`mb-6 sticky top-0 z-30 ${className || ""}`}>
      <div className="flex flex-col gap-3 bg-zinc-900 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-zinc-800 shadow-lg">
        {/* Search and filters row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Name Search */}
          <div className="relative">
            <FormField
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trainers by name..."
              className={`w-full bg-zinc-800 border-zinc-700 text-white rounded-lg ${colors.focusRing}`}
              prefixIcon="mdi:magnify"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <Icon
                  icon="mdi:close"
                  className="w-5 h-5 text-zinc-400 hover:text-white"
                />
              </button>
            )}
          </div>

          {/* Location Search */}
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
        </div>

        {/* Active filters and sort controls row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-zinc-300 text-sm">
              Found{" "}
              <span className="font-semibold text-white">{itemCount}</span>{" "}
              trainers
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 ml-2">
                {searchQuery && (
                  <div
                    className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm`}
                  >
                    <span>Name: {searchQuery}</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-2 hover:text-zinc-200"
                    >
                      <Icon icon="mdi:close" className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {selectedLocation && (
                  <div
                    className={`flex items-center ${colors.accentBg} px-3 py-1 rounded-full text-sm`}
                  >
                    <Icon icon="mdi:map-marker" className="w-4 h-4 mr-1" />
                    <span>{selectedLocation.label}</span>
                    <button
                      onClick={() => {
                        setSelectedLocation(null);
                        setLocationSearch("");
                      }}
                      className="ml-2 hover:text-zinc-200"
                    >
                      <Icon icon="mdi:close" className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className={`text-sm ${colors.accentClass} hover:underline flex items-center`}
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

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
                  {sortOptions.find((opt) => opt.value === sortOption)?.label}
                </span>
              </span>
              <Icon
                icon={showSortOptions ? "mdi:chevron-up" : "mdi:chevron-down"}
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
  );
};
