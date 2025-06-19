import { motion } from "framer-motion";

import { TrainerCard } from "./TrainerCard";

import { SortControls } from "@/components/custom/shared";

export const TrainersList = ({
  trainers,
  onTrainerClick,
  sortOption,
  setSortOption,
  sortOrder,
  setSortOrder,
}) => {
  const sortOptions = [
    ...(trainers.some((t) => typeof t.distance === "number")
      ? [{ value: "location", label: "Location (Closest)" }]
      : []),
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "experience", label: "Experience" },
    { value: "name", label: "Name" },
  ];

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
      {/* Use the shared SortControls component */}
      <SortControls
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        itemCount={trainers.length}
        sortOptions={sortOptions}
        variant="orange"
      />

      {/* Trainers grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
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
