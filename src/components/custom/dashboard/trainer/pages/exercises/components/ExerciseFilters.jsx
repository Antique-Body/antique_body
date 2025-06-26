import { BaseFilters } from "@/components/custom/dashboard/shared";
import {
  EXERCISE_TYPES,
  EXERCISE_LEVELS,
  EXERCISE_LOCATIONS,
  EQUIPMENT_OPTIONS,
} from "@/enums/exerciseTypes";

export const ExerciseFilters = ({
  filters,
  updateFilters,
  clearFilters,
  totalExercises = 0,
}) => {
  const filterConfigs = [
    {
      key: "type",
      label: "Exercise Type",
      placeholder: "All Types",
      options: EXERCISE_TYPES,
    },
    {
      key: "level",
      label: "Difficulty Level",
      placeholder: "All Levels",
      options: EXERCISE_LEVELS,
    },
    {
      key: "location",
      label: "Location",
      placeholder: "All Locations",
      options: EXERCISE_LOCATIONS,
    },
    {
      key: "equipment",
      label: "Equipment",
      placeholder: "All Equipment",
      options: EQUIPMENT_OPTIONS,
    },
  ];

  return (
    <BaseFilters
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      totalItems={totalExercises}
      itemType="exercise"
      filterConfigs={filterConfigs}
      searchPlaceholder="Search exercises... (Press Enter to search)"
    />
  );
};
