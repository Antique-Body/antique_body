import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const BaseFilters = ({
  filters,
  updateFilters,
  clearFilters,
  totalItems = 0,
  itemType = "items",
  filterConfigs = [],
  searchPlaceholder = "Search...",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  // Local filter state
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Handle search input change with focus preservation
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search trigger (when Enter is pressed or search button is clicked)
  const handleSearchTrigger = () => {
    updateFilters({ ...filters, search: searchTerm });

    // Animate the badge when search is triggered
    if (searchTerm) {
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 1000);
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchTrigger();
    }
  };

  // Handle search clear with focus preservation
  const handleSearchClear = () => {
    setSearchTerm("");
    updateFilters({ ...filters, search: "" });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    updateFilters({ ...filters, [filterName]: value });

    // Animate the badge when a filter is applied
    if (value) {
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 1000);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null && value !== undefined
  );

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;

  // Get filter icon based on type
  const getFilterIcon = (filterType) => {
    const iconMap = {
      type: "mdi:dumbbell",
      level: "mdi:signal",
      location: "mdi:map-marker",
      equipment: "mdi:weight",
      search: "mdi:magnify",
      difficulty: "mdi:signal",
      preparationTime: "mdi:clock",
      dietary: "mdi:leaf",
      cuisine: "mdi:food",
      mealType: "mdi:food-variant",
    };
    return iconMap[filterType] || "mdi:filter-variant";
  };

  // Get filter color based on type
  const getFilterColor = (filterType) => {
    const colorMap = {
      type: "from-purple-500/20 to-purple-600/20 text-purple-400",
      level: "from-orange-500/20 to-orange-600/20 text-orange-400",
      location: "from-blue-500/20 to-blue-600/20 text-blue-400",
      equipment: "from-green-500/20 to-green-600/20 text-green-400",
      search: "from-[#FF6B00]/20 to-[#FF9A00]/20 text-[#FF6B00]",
      difficulty: "from-orange-500/20 to-orange-600/20 text-orange-400",
      preparationTime: "from-cyan-500/20 to-cyan-600/20 text-cyan-400",
      dietary: "from-green-500/20 to-green-600/20 text-green-400",
      cuisine: "from-yellow-500/20 to-yellow-600/20 text-yellow-400",
      mealType: "from-purple-500/20 to-purple-600/20 text-purple-400",
    };
    return (
      colorMap[filterType] || "from-zinc-500/20 to-zinc-600/20 text-zinc-400"
    );
  };

  // Common button class for consistency
  const buttonClass = "h-12 w-[120px] flex items-center justify-center gap-2";

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-md rounded-xl border border-zinc-800 shadow-lg overflow-hidden">
        {/* Main search row - always visible */}
        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search input */}
            <div className="flex-1 relative w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  placeholder={searchPlaceholder}
                  className="w-full h-12 pl-12 pr-10 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF7800]/30 focus:border-[#FF7800] transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon icon="mdi:magnify" className="w-5 h-5 text-zinc-500" />
                </div>
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={handleSearchClear}
                    type="button"
                  >
                    <Icon
                      icon="mdi:close-circle"
                      className="w-5 h-5 text-zinc-400 hover:text-white transition-colors"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Action buttons container with consistent sizing */}
            <div className="flex md:flex-row gap-3 w-full md:w-auto">
              {/* Search button */}
              <Button
                variant="orangeFilled"
                size="large"
                className={buttonClass}
                onClick={handleSearchTrigger}
              >
                <Icon icon="mdi:magnify" className="w-5 h-5" />
                <span className="text-sm font-medium">Search</span>
              </Button>

              {/* Filter toggle button with animated badge */}
              <Button
                variant={isExpanded ? "orangeFilled" : "secondary"}
                size="large"
                className={buttonClass + " relative"}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="relative">
                  <Icon
                    icon="mdi:filter-variant"
                    width={20}
                    height={20}
                    className={isExpanded ? "text-white" : "text-zinc-300"}
                  />
                  {hasActiveFilters && (
                    <div
                      className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-[#FF6B00] text-white text-xs rounded-full ${
                        animateBadge ? "animate-pulse-scale" : ""
                      }`}
                      style={{
                        boxShadow: animateBadge
                          ? "0 0 0 rgba(255, 107, 0, 0.4)"
                          : "none",
                        animation: animateBadge
                          ? "pulse 1s cubic-bezier(0, 0, 0.2, 1)"
                          : "none",
                      }}
                    >
                      {activeFilterCount}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">Filters</span>

                {/* Animated filter indicator */}
                {hasActiveFilters && (
                  <span
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      animateBadge ? "animate-ping bg-[#FF6B00]/60" : "hidden"
                    }`}
                  />
                )}
              </Button>

              {/* Clear filters button - only show if filters are active */}
              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  size="large"
                  className={buttonClass}
                  onClick={clearFilters}
                >
                  <Icon icon="mdi:refresh" className="w-5 h-5" />
                  <span className="text-sm font-medium">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Results count with animated highlight when filters change */}
          <div className="mt-3 text-sm text-zinc-400">
            <span
              className={`${
                animateBadge
                  ? "text-[#FF6B00] transition-colors duration-1000"
                  : ""
              }`}
            >
              {totalItems}
            </span>{" "}
            {itemType}
            {totalItems !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Expanded filters section */}
        {isExpanded && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-900/60 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filterConfigs.map((config) => (
                <div key={config.key} className="filter-group">
                  <label className="text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                    <Icon
                      icon={getFilterIcon(config.key)}
                      className={`w-4 h-4 ${
                        getFilterColor(config.key).split(" ")[2]
                      }`}
                    />
                    {config.label}
                  </label>
                  <div className="relative">
                    <select
                      value={filters[config.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(config.key, e.target.value)
                      }
                      className={`w-full h-12 pl-4 pr-10 py-3 appearance-none bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF7800]/30 focus:border-[#FF7800] transition-all ${
                        filters[config.key]
                          ? `border-${
                              getFilterColor(config.key).split("-")[1]
                            }-500/50 bg-gradient-to-r ${getFilterColor(
                              config.key
                            )
                              .split(" ")
                              .slice(0, 2)
                              .join(" ")}/5`
                          : ""
                      }`}
                    >
                      <option value="">{config.placeholder}</option>
                      {config.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Icon
                        icon="mdi:chevron-down"
                        className={`w-5 h-5 ${
                          filters[config.key]
                            ? getFilterColor(config.key).split(" ")[2]
                            : "text-zinc-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="mt-5 flex flex-wrap gap-2 items-center border-t border-zinc-800/50 pt-4">
                <span className="text-sm font-medium text-zinc-400 mr-1">
                  Active filters:
                </span>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;

                  let displayValue = value;
                  let displayKey = key.charAt(0).toUpperCase() + key.slice(1);

                  // Format display values for dropdowns
                  const config = filterConfigs.find((c) => c.key === key);
                  if (config) {
                    const option = config.options.find(
                      (o) => o.value === value
                    );
                    displayValue = option ? option.label : value;
                  }

                  if (key === "search") {
                    displayKey = "Search";
                  }

                  const filterColor = getFilterColor(key);
                  const filterIcon = getFilterIcon(key);

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-1.5 bg-gradient-to-r ${filterColor} bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 animate-fadeIn group hover:border-zinc-600 transition-all`}
                    >
                      <Icon icon={filterIcon} className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium text-zinc-400">
                        {displayKey}:
                      </span>
                      <span className="text-xs font-medium text-white">
                        {displayValue}
                      </span>
                      <button
                        onClick={() => handleFilterChange(key, "")}
                        className="ml-1 text-zinc-500 hover:text-white transition-colors group-hover:text-zinc-300"
                      >
                        <Icon icon="mdi:close-circle" className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                <Button
                  variant="secondary"
                  size="small"
                  className="h-8 px-3 text-zinc-400 hover:text-white text-xs"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
