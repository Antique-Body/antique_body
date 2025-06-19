import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";

export const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  goalFilter,
  setGoalFilter,
  sportFilter,
  setSportFilter,
  goalOptions = [],
  sportOptions = [],
  onClearFilters,
  filtersActive,
  className,
  variant = "blue", // 'blue' or 'orange'
}) => {
  const [expanded, setExpanded] = useState(false);

  // Define color variants
  const colorVariants = {
    blue: {
      accent: "#3E92CC",
      gradient: "from-zinc-900/80 to-black/80",
      buttonHover: "hover:bg-[#3E92CC]/10",
      buttonActive: "bg-[#3E92CC]/20 text-[#3E92CC]",
      icon: "text-[#3E92CC]",
    },
    orange: {
      accent: "#FF6B00",
      gradient: "from-zinc-900/80 to-black/80",
      buttonHover: "hover:bg-[#FF6B00]/10",
      buttonActive: "bg-[#FF6B00]/20 text-[#FF6B00]",
      icon: "text-[#FF6B00]",
    },
  };

  const colors = colorVariants[variant];

  return (
    <div
      className={`bg-gradient-to-b ${
        colors.gradient
      } backdrop-blur-sm rounded-xl border border-zinc-800 p-4 mb-6 ${
        className || ""
      }`}
    >
      <div className="flex flex-col space-y-4">
        {/* Search input with clear button */}
        <div className="relative">
          <FormField
            type="text"
            placeholder="Search by name, specialty, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            leftIcon={
              <Icon icon="mdi:magnify" className={`w-5 h-5 ${colors.icon}`} />
            }
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter toggles */}
        <div className="flex flex-wrap gap-2">
          {/* Goal filter */}
          <div className="flex-1 min-w-[150px]">
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3E92CC]/50 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
              }}
            >
              <option value="">All Goals</option>
              {goalOptions.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sport filter */}
          <div className="flex-1 min-w-[150px]">
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3E92CC]/50 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
              }}
            >
              <option value="">All Sports</option>
              {sportOptions.map((sport) => (
                <option key={sport.value} value={sport.value}>
                  {sport.label}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced filters toggle */}
          <Button
            variant="secondary"
            size="small"
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1 min-w-[130px] ${
              expanded ? colors.buttonActive : ""
            } ${colors.buttonHover}`}
          >
            <Icon
              icon={expanded ? "mdi:filter-check" : "mdi:filter"}
              className={`w-4 h-4 ${expanded ? colors.icon : "text-zinc-400"}`}
            />
            <span>Filters</span>
            <Icon
              icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="w-4 h-4 ml-auto"
            />
          </Button>

          {/* Clear filters button */}
          {filtersActive && (
            <Button
              variant="secondary"
              size="small"
              onClick={onClearFilters}
              className="flex items-center gap-1"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>

        {/* Expanded filters */}
        {expanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 mt-3 border-t border-zinc-700/50">
            {/* Additional filter options would go here */}
            <div className="text-zinc-400 text-sm col-span-full">
              Advanced filters can be customized based on specific requirements
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
