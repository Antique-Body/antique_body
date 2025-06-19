import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/common/Button";

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
}) => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const dropdownRef = useRef(null);

  // Define color variants
  const colorVariants = {
    blue: {
      accent: "#3E92CC",
      accentClass: "text-[#3E92CC]",
      focusRing: "focus:ring-[#3E92CC]/40 focus:border-[#3E92CC]",
    },
    orange: {
      accent: "#FF6B00",
      accentClass: "text-[#FF6B00]",
      focusRing: "focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]",
    },
  };

  const colors = colorVariants[variant];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSortOrder = () => {
    if (sortOption !== "location") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }
  };

  return (
    <div className={`mb-6 sticky top-0 z-30 ${className || ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-zinc-800 shadow-lg">
        <div className="text-zinc-300 text-sm">
          Found <span className="font-semibold text-white">{itemCount}</span>{" "}
          trainers
        </div>

        {/* Mobile sort dropdown */}
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          {/* Dropdown menu */}
          {showSortOptions && (
            <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-1 z-50 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
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
      </div>
    </div>
  );
};
