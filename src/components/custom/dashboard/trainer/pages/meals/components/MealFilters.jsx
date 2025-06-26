import { BaseFilters } from "@/components/custom/dashboard/shared";
import {
  MEAL_TYPES,
  MEAL_DIFFICULTY_LEVELS,
  PREPARATION_TIME_RANGES,
  DIETARY_PREFERENCES,
  CUISINE_TYPES,
} from "@/enums/mealTypes";

export const MealFilters = ({
  filters,
  updateFilters,
  clearFilters,
  totalMeals = 0,
}) => {
  const filterConfigs = [
    {
      key: "mealType",
      label: "Meal Type",
      placeholder: "All Types",
      options: MEAL_TYPES,
    },
    {
      key: "difficulty",
      label: "Difficulty",
      placeholder: "All Difficulties",
      options: MEAL_DIFFICULTY_LEVELS,
    },
    {
      key: "preparationTime",
      label: "Prep Time",
      placeholder: "All Times",
      options: PREPARATION_TIME_RANGES,
    },
    {
      key: "dietary",
      label: "Dietary",
      placeholder: "All Diets",
      options: DIETARY_PREFERENCES,
    },
    {
      key: "cuisine",
      label: "Cuisine",
      placeholder: "All Cuisines",
      options: CUISINE_TYPES,
    },
  ];

  return (
    <BaseFilters
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      totalItems={totalMeals}
      itemType="meal"
      filterConfigs={filterConfigs}
      searchPlaceholder="Search meals... (Press Enter to search)"
    />
  );
};
