import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";

import { TrainerCard } from "./TrainerCard";

export const TrainersList = ({ trainers, onTrainerClick }) => {
  const [sortOption, setSortOption] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  // Sort trainers based on selected option and order
  const sortedTrainers = [...trainers].sort((a, b) => {
    let comparison = 0;

    if (sortOption === "rating") {
      comparison = a.rating - b.rating;
    } else if (sortOption === "price") {
      comparison = a.price - b.price;
    } else if (sortOption === "experience") {
      comparison = parseInt(a.experience) - parseInt(b.experience);
    } else if (sortOption === "name") {
      comparison = a.name.localeCompare(b.name);
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      {/* Results count and sorting options */}
      <div className="flex flex-wrap justify-between items-center mb-6 bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl border border-zinc-800">
        <div className="text-zinc-300 mb-2 sm:mb-0">
          Found{" "}
          <span className="font-semibold text-white">{trainers.length}</span>{" "}
          trainers
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-sm">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00]"
          >
            <option value="rating">Rating</option>
            <option value="price">Price</option>
            <option value="experience">Experience</option>
            <option value="name">Name</option>
          </select>

          <button
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
          </button>
        </div>
      </div>

      {/* Trainers grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {sortedTrainers.map((trainer) => (
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
