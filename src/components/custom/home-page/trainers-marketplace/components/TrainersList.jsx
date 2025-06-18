import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";

import { TrainerCard } from "./TrainerCard";

import { Button } from "@/components/common/Button";

export const TrainersList = ({
  trainers,
  onTrainerClick,
  sortOption,
  setSortOption,
  sortOrder,
  setSortOrder,
}) => {
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions = [
    ...(trainers.some((t) => typeof t.distance === "number")
      ? [{ value: "location", label: "Location (Closest)" }]
      : []),
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "experience", label: "Experience" },
    { value: "name", label: "Name" },
  ];

  const toggleSortOrder = () => {
    if (sortOption !== "location") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div>
      {/* Results count and sorting options */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-zinc-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-zinc-800">
          <div className="text-zinc-300 text-sm">
            Found{" "}
            <span className="font-semibold text-white">{trainers.length}</span>{" "}
            trainers
          </div>

          {/* Mobile sort dropdown */}
          <div className="relative w-full sm:w-auto">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center justify-between w-full sm:w-auto bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm"
            >
              <span className="flex items-center">
                <Icon icon="mdi:sort" className="w-4 h-4 mr-2 text-zinc-400" />
                Sort:{" "}
                {sortOptions.find((opt) => opt.value === sortOption)?.label}
              </span>
              <Icon
                icon={showSortOptions ? "mdi:chevron-up" : "mdi:chevron-down"}
                className="w-5 h-5 ml-2"
              />
            </Button>

            {/* Mobile dropdown menu */}
            {showSortOptions && (
              <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-1 z-10 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setShowSortOptions(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-700 transition-colors flex items-center justify-between ${
                      sortOption === option.value
                        ? "text-[#FF6B00] bg-zinc-700/50"
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

          {/* Desktop sort controls - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-zinc-400 text-sm">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
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

      {/* Trainers grid - Original 4-column layout */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {trainers.map((trainer) => (
          <TrainerCard
            key={trainer.id}
            trainer={trainer}
            onClick={() => onTrainerClick(trainer)}
          />
        ))}
      </motion.div>
    </div>
  );
};
