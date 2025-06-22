import { useState, useCallback } from "react";

export function useExercises() {
  const [exercises, setExercises] = useState([]);
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
    type: "",
    level: "",
    location: "",
    equipment: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch all exercises with filters
  const fetchExercises = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const {
        page = 1,
        limit = 12,
        search = "",
        type = "",
        level = "",
        location = "",
        equipment = "",
        sortBy = "name",
        sortOrder = "asc",
      } = options;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) params.append("search", search);
      if (type) params.append("type", type);
      if (level) params.append("level", level);
      if (location) params.append("location", location);
      if (equipment) params.append("equipment", equipment);

      const response = await fetch(`/api/exercises?${params}`);
      const data = await response.json();

      if (data.success) {
        setExercises(data.exercises);
        setPagination(data.pagination);
      } else {
        setError(data.error || "Failed to fetch exercises");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch exercises");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch exercises for a specific trainer with filters
  const fetchTrainerExercisesWithFilters = useCallback(
    async (filterOptions = {}) => {
      try {
        setLoading(true);
        setError(null);

        const {
          search = filters.search,
          type = filters.type,
          level = filters.level,
          location = filters.location,
          equipment = filters.equipment,
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
        if (type) params.append("type", type);
        if (level) params.append("level", level);
        if (location) params.append("location", location);
        if (equipment !== "") params.append("equipment", equipment);

        const response = await fetch(`/api/users/trainer/exercises?${params}`);
        const data = await response.json();

        if (data.success) {
          setExercises(data.exercises);
          setPagination(data.pagination);

          // Update filter state
          setFilters({ search, type, level, location, equipment });
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        } else {
          setError(data.error || "Failed to fetch trainer exercises");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch trainer exercises");
      } finally {
        setLoading(false);
      }
    },
    [
      filters.equipment,
      filters.level,
      filters.location,
      filters.search,
      filters.type,
      sortBy,
      sortOrder,
    ]
  );

  // Fetch exercises for a specific trainer (legacy method for backward compatibility)
  const fetchTrainerExercises = useCallback(async () => {
    await fetchTrainerExercisesWithFilters();
  }, [fetchTrainerExercisesWithFilters]);

  // Update filters and refetch
  const updateFilters = useCallback(
    async (newFilters) => {
      await fetchTrainerExercisesWithFilters({
        ...newFilters,
        page: 1, // Reset to first page when filters change
      });
    },
    [fetchTrainerExercisesWithFilters]
  );

  // Update sorting and refetch
  const updateSorting = useCallback(
    async (newSortBy, newSortOrder) => {
      await fetchTrainerExercisesWithFilters({
        sortBy: newSortBy,
        sortOrder: newSortOrder,
        page: 1, // Reset to first page when sorting changes
      });
    },
    [fetchTrainerExercisesWithFilters]
  );

  // Change page
  const changePage = useCallback(
    async (newPage) => {
      await fetchTrainerExercisesWithFilters({
        page: newPage,
      });
    },
    [fetchTrainerExercisesWithFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(async () => {
    await fetchTrainerExercisesWithFilters({
      search: "",
      type: "",
      level: "",
      location: "",
      equipment: "",
      sortBy: "name",
      sortOrder: "asc",
      page: 1,
    });
  }, [fetchTrainerExercisesWithFilters]);

  // Create a new exercise
  const createExercise = useCallback(
    async (exerciseData) => {
      try {
        setError(null);

        const response = await fetch("/api/users/trainer/exercises", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exerciseData),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh the exercises list with current filters
          await fetchTrainerExercisesWithFilters();
          return { success: true, data: data.data };
        } else {
          setError(data.error || "Failed to create exercise");
          return { success: false, error: data.error };
        }
      } catch (err) {
        const errorMsg = err.message || "Failed to create exercise";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [fetchTrainerExercisesWithFilters]
  );

  // Update an exercise
  const updateExercise = useCallback(async (exerciseId, exerciseData) => {
    try {
      setError(null);

      const response = await fetch(
        `/api/users/trainer/exercises/${exerciseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exerciseData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the exercise in the local state
        setExercises((prev) =>
          prev.map((ex) => (ex.id === exerciseId ? data.data : ex))
        );
        return { success: true, data: data.data };
      } else {
        setError(data.error || "Failed to update exercise");
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to update exercise";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Delete an exercise
  const deleteExercise = useCallback(
    async (exerciseId) => {
      try {
        setError(null);

        const response = await fetch(
          `/api/users/trainer/exercises/${exerciseId}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (data.success) {
          // Refresh the exercises list with current filters
          await fetchTrainerExercisesWithFilters();
          return { success: true };
        } else {
          setError(data.error || "Failed to delete exercise");
          return { success: false, error: data.error };
        }
      } catch (err) {
        const errorMsg = err.message || "Failed to delete exercise";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [fetchTrainerExercisesWithFilters]
  );

  // Get a single exercise
  const getExercise = useCallback(async (exerciseId) => {
    try {
      setError(null);

      const response = await fetch(
        `/api/users/trainer/exercises/${exerciseId}`
      );
      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        setError(data.error || "Failed to fetch exercise");
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch exercise";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  return {
    exercises,
    loading,
    error,
    pagination,
    filters,
    sortBy,
    sortOrder,
    fetchExercises,
    fetchTrainerExercises,
    fetchTrainerExercisesWithFilters,
    updateFilters,
    updateSorting,
    changePage,
    clearFilters,
    createExercise,
    updateExercise,
    deleteExercise,
    getExercise,
  };
}
