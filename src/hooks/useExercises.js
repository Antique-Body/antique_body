import { useState, useEffect, useCallback } from "react";

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 12,
  });

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

  // Fetch exercises for a specific trainer
  const fetchTrainerExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/users/trainer/exercises");
      const data = await response.json();

      if (data.success) {
        setExercises(data.data);
      } else {
        setError(data.error || "Failed to fetch trainer exercises");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch trainer exercises");
    } finally {
      setLoading(false);
    }
  }, []);

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
          // Refresh the exercises list
          await fetchTrainerExercises();
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
    [fetchTrainerExercises]
  );

  // Update an exercise
  const updateExercise = useCallback(async (exerciseId, exerciseData) => {
    try {
      setError(null);

      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exerciseData),
      });

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
  const deleteExercise = useCallback(async (exerciseId) => {
    try {
      setError(null);

      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Remove the exercise from the local state
        setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
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
  }, []);

  // Get a single exercise
  const getExercise = useCallback(async (exerciseId) => {
    try {
      setError(null);

      const response = await fetch(`/api/exercises/${exerciseId}`);
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
    fetchExercises,
    fetchTrainerExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    getExercise,
  };
}
