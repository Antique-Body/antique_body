import { useState, useCallback } from "react";

export function useMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: "",
    mealType: "",
    difficulty: "",
    dietary: "",
    cuisine: "",
    preparationTime: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch meals for a specific trainer with filters
  const fetchTrainerMealsWithFilters = useCallback(
    async (filterOptions = {}) => {
      try {
        setLoading(true);
        setError(null);

        const {
          search = filters.search,
          mealType = filters.mealType,
          difficulty = filters.difficulty,
          dietary = filters.dietary,
          cuisine = filters.cuisine,
          preparationTime = filters.preparationTime,
          sortBy: newSortBy = sortBy,
          sortOrder: newSortOrder = sortOrder,
          page = 1,
          limit = 12,
        } = filterOptions;

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy: newSortBy,
          sortOrder: newSortOrder,
        });

        if (search) params.append("search", search);
        if (mealType) params.append("mealType", mealType);
        if (difficulty) params.append("difficulty", difficulty);
        if (dietary) params.append("dietary", dietary);
        if (cuisine) params.append("cuisine", cuisine);
        if (preparationTime) params.append("preparationTime", preparationTime);

        const response = await fetch(`/api/users/trainer/meals?${params}`);
        const data = await response.json();

        if (data.success) {
          setMeals(data.meals);
          setPagination(data.pagination);

          // Update filter state
          setFilters({
            search,
            mealType,
            difficulty,
            dietary,
            cuisine,
            preparationTime,
          });
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        } else {
          setError(data.error || "Failed to fetch trainer meals");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch trainer meals");
      } finally {
        setLoading(false);
      }
    },
    [
      filters.search,
      filters.mealType,
      filters.difficulty,
      filters.dietary,
      filters.cuisine,
      filters.preparationTime,
      sortBy,
      sortOrder,
    ]
  );

  // Fetch meals for a specific trainer (legacy method for backward compatibility)
  const fetchTrainerMeals = useCallback(async () => {
    await fetchTrainerMealsWithFilters();
  }, [fetchTrainerMealsWithFilters]);

  // Update filters and refetch
  const updateFilters = useCallback(
    async (newFilters) => {
      await fetchTrainerMealsWithFilters({
        ...newFilters,
        page: 1, // Reset to first page when filters change
      });
    },
    [fetchTrainerMealsWithFilters]
  );

  // Update sorting and refetch
  const updateSorting = useCallback(
    async (newSortBy, newSortOrder) => {
      await fetchTrainerMealsWithFilters({
        sortBy: newSortBy,
        sortOrder: newSortOrder,
        page: 1, // Reset to first page when sorting changes
      });
    },
    [fetchTrainerMealsWithFilters]
  );

  // Change page
  const changePage = useCallback(
    async (newPage) => {
      await fetchTrainerMealsWithFilters({
        page: newPage,
      });
    },
    [fetchTrainerMealsWithFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(async () => {
    await fetchTrainerMealsWithFilters({
      search: "",
      mealType: "",
      difficulty: "",
      dietary: "",
      cuisine: "",
      preparationTime: "",
      sortBy: "name",
      sortOrder: "asc",
      page: 1,
    });
  }, [fetchTrainerMealsWithFilters]);

  // Create a new meal
  const createMeal = useCallback(
    async (mealData) => {
      try {
        setError(null);

        const response = await fetch("/api/users/trainer/meals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mealData),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh the meals list
          await fetchTrainerMealsWithFilters();
          return { success: true, data: data.data };
        } else {
          setError(data.error || "Failed to create meal");
          return { success: false, error: data.error };
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to create meal";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainerMealsWithFilters]
  );

  // Update an existing meal
  const updateMeal = useCallback(
    async (mealId, mealData) => {
      try {
        setError(null);

        const response = await fetch(`/api/users/trainer/meals/${mealId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mealData),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh the meals list
          await fetchTrainerMealsWithFilters();
          return { success: true, data: data.data };
        } else {
          setError(data.error || "Failed to update meal");
          return { success: false, error: data.error };
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to update meal";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainerMealsWithFilters]
  );

  // Delete a meal
  const deleteMeal = useCallback(
    async (mealId) => {
      try {
        setError(null);

        const response = await fetch(`/api/users/trainer/meals/${mealId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          // Refresh the meals list
          await fetchTrainerMealsWithFilters();
          return { success: true };
        } else {
          setError(data.error || "Failed to delete meal");
          return { success: false, error: data.error };
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to delete meal";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainerMealsWithFilters]
  );

  // Get a single meal by ID
  const getMeal = useCallback(async (mealId) => {
    try {
      setError(null);

      const response = await fetch(`/api/users/trainer/meals/${mealId}`);
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        setError(data.error || "Failed to fetch meal");
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch meal";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    // State
    meals,
    loading,
    error,
    pagination,
    filters,
    sortBy,
    sortOrder,

    // Actions
    fetchTrainerMeals,
    fetchTrainerMealsWithFilters,
    updateFilters,
    updateSorting,
    changePage,
    clearFilters,
    createMeal,
    updateMeal,
    deleteMeal,
    getMeal,
  };
}
