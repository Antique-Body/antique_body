import { useState, useEffect, useCallback } from "react";

export const useDietTracker = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [nextMeal, setNextMeal] = useState(null);
  const [stats, setStats] = useState(null);
  const [mockPlanAvailable, setMockPlanAvailable] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Fetch diet tracker data
  const fetchDietTrackerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/users/client/diet-tracker");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch diet tracker data");
      }

      setHasActivePlan(data.hasActivePlan);
      setMockPlanAvailable(data.mockPlanAvailable || false);

      if (data.hasActivePlan) {
        setActivePlan(data.activePlan);
        setDailyLogs(data.dailyLogs || []);
        setNextMeal(data.nextMeal);
      }
    } catch (err) {
      console.error("Error fetching diet tracker data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Start diet plan
  const startDietPlan = useCallback(
    async (useMockPlan = false, dietPlanAssignmentId = null) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/users/client/diet-tracker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "start-plan",
            useMockPlan,
            dietPlanAssignmentId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to start diet plan");
        }

        // Refresh data after starting plan
        await fetchDietTrackerData();

        return data;
      } catch (err) {
        console.error("Error starting diet plan:", err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDietTrackerData]
  );

  // Complete a meal
  const completeMeal = useCallback(
    async (mealLogId) => {
      try {
        setValidationError(null);

        const response = await fetch("/api/users/client/diet-tracker/meals", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "complete",
            mealLogId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            // Day validation error
            setValidationError(data.error);
            return;
          }
          throw new Error(data.error || "Failed to complete meal");
        }

        // Update local state
        setDailyLogs((prevLogs) =>
          prevLogs.map((log) => {
            const updatedMealLogs = log.mealLogs.map((meal) =>
              meal.id === mealLogId
                ? {
                    ...meal,
                    isCompleted: true,
                    completedAt: new Date().toISOString(),
                  }
                : meal
            );

            // Recalculate completed meals count
            const completedMeals = updatedMealLogs.filter(
              (meal) => meal.isCompleted
            ).length;

            return {
              ...log,
              mealLogs: updatedMealLogs,
              completedMeals,
            };
          })
        );

        // Refresh next meal
        await fetchNextMeal();

        return data;
      } catch (err) {
        console.error("Error completing meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchNextMeal]
  );

  // Uncomplete a meal
  const uncompleteMeal = useCallback(
    async (mealLogId) => {
      try {
        setValidationError(null);

        const response = await fetch("/api/users/client/diet-tracker/meals", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "uncomplete",
            mealLogId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            // Day validation error
            setValidationError(data.error);
            return;
          }
          throw new Error(data.error || "Failed to uncomplete meal");
        }

        // Update local state
        setDailyLogs((prevLogs) =>
          prevLogs.map((log) => {
            const updatedMealLogs = log.mealLogs.map((meal) =>
              meal.id === mealLogId
                ? { ...meal, isCompleted: false, completedAt: null }
                : meal
            );

            // Recalculate completed meals count
            const completedMeals = updatedMealLogs.filter(
              (meal) => meal.isCompleted
            ).length;

            return {
              ...log,
              mealLogs: updatedMealLogs,
              completedMeals,
            };
          })
        );

        // Refresh next meal
        await fetchNextMeal();

        return data;
      } catch (err) {
        console.error("Error uncompleting meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchNextMeal]
  );

  // Change meal option
  const changeMealOption = useCallback(async (mealLogId, newOption) => {
    try {
      setValidationError(null);

      const response = await fetch("/api/users/client/diet-tracker/meals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "change-option",
          mealLogId,
          newOption,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          // Day validation error
          setValidationError(data.error);
          return;
        }
        throw new Error(data.error || "Failed to change meal option");
      }

      // Update local state
      setDailyLogs((prevLogs) =>
        prevLogs.map((log) => ({
          ...log,
          mealLogs: log.mealLogs.map((meal) =>
            meal.id === mealLogId
              ? {
                  ...meal,
                  selectedOption: newOption,
                  calories: newOption.calories || 0,
                  protein: newOption.protein || 0,
                  carbs: newOption.carbs || 0,
                  fat: newOption.fat || 0,
                }
              : meal
          ),
        }))
      );

      return data;
    } catch (err) {
      console.error("Error changing meal option:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Get custom meal history
  const getCustomMealHistory = useCallback(async (mealType, limit = 10) => {
    try {
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?mealType=${mealType}&limit=${limit}`
      );
      const data = await response.json();

      if (response.ok) {
        return data.data || [];
      }

      throw new Error(data.error || "Failed to fetch custom meal history");
    } catch (err) {
      console.error("Error fetching custom meal history:", err);
      return [];
    }
  }, []);

  // Add custom meal/snack to a specific day
  const addCustomMealToDay = useCallback(
    async (date, customMealData) => {
      try {
        setValidationError(null);

        if (!activePlan) {
          throw new Error("No active diet plan found");
        }

        const response = await fetch("/api/users/client/diet-tracker/meals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dietPlanAssignmentId: activePlan.id,
            date,
            customMeal: customMealData,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            // Day validation error
            setValidationError(data.error);
            return;
          }
          throw new Error(data.error || "Failed to add custom meal");
        }

        // Update local state instead of full refresh
        const newSnackLog = data.data;
        const targetDate = new Date(date);

        setDailyLogs((prevLogs) =>
          prevLogs.map((log) => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);

            if (logDate.getTime() === targetDate.getTime()) {
              return {
                ...log,
                snackLogs: [...(log.snackLogs || []), newSnackLog],
                snackCount: (log.snackCount || 0) + 1,
                // Update nutrition totals
                totalCalories:
                  (log.totalCalories || 0) + (newSnackLog.calories || 0),
                totalProtein:
                  (log.totalProtein || 0) + (newSnackLog.protein || 0),
                totalCarbs: (log.totalCarbs || 0) + (newSnackLog.carbs || 0),
                totalFat: (log.totalFat || 0) + (newSnackLog.fat || 0),
              };
            }
            return log;
          })
        );

        return data;
      } catch (err) {
        console.error("Error adding custom meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [activePlan]
  );

  // Delete a snack
  const deleteSnack = useCallback(async (snackLogId) => {
    try {
      setValidationError(null);

      const response = await fetch(
        `/api/users/client/diet-tracker/meals?snackLogId=${snackLogId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          // Day validation error
          setValidationError(data.error);
          return;
        }
        throw new Error(data.error || "Failed to delete snack");
      }

      // Update local state instead of full refresh
      setDailyLogs((prevLogs) =>
        prevLogs.map((log) => {
          if (
            log.snackLogs &&
            log.snackLogs.some((snack) => snack.id === snackLogId)
          ) {
            const deletedSnack = log.snackLogs.find(
              (snack) => snack.id === snackLogId
            );
            const updatedSnackLogs = log.snackLogs.filter(
              (snack) => snack.id !== snackLogId
            );

            return {
              ...log,
              snackLogs: updatedSnackLogs,
              snackCount: Math.max(0, (log.snackCount || 0) - 1),
              // Update nutrition totals
              totalCalories: Math.max(
                0,
                (log.totalCalories || 0) - (deletedSnack?.calories || 0)
              ),
              totalProtein: Math.max(
                0,
                (log.totalProtein || 0) - (deletedSnack?.protein || 0)
              ),
              totalCarbs: Math.max(
                0,
                (log.totalCarbs || 0) - (deletedSnack?.carbs || 0)
              ),
              totalFat: Math.max(
                0,
                (log.totalFat || 0) - (deletedSnack?.fat || 0)
              ),
            };
          }
          return log;
        })
      );

      return data;
    } catch (err) {
      console.error("Error deleting snack:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Fetch next meal
  const fetchNextMeal = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/users/client/diet-tracker?action=next-meal"
      );
      const data = await response.json();

      if (response.ok) {
        setNextMeal(data.nextMeal);
      }
    } catch (err) {
      console.error("Error fetching next meal:", err);
    }
  }, []);

  // Fetch diet plan stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/users/client/diet-tracker?action=stats"
      );
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Get meals for a specific date
  const getMealsForDate = useCallback(
    async (date) => {
      if (!activePlan) return null;

      try {
        const response = await fetch(
          `/api/users/client/diet-tracker/meals?date=${date}&dietPlanAssignmentId=${activePlan.id}`
        );
        const data = await response.json();

        if (response.ok) {
          return data;
        }

        throw new Error(data.error || "Failed to fetch meals for date");
      } catch (err) {
        console.error("Error fetching meals for date:", err);
        throw err;
      }
    },
    [activePlan]
  );

  // Helper functions
  const getTodayLog = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return dailyLogs.find((log) => {
      // Handle both string and Date object formats
      const logDate =
        typeof log.date === "string"
          ? log.date.split("T")[0]
          : new Date(log.date).toISOString().split("T")[0];
      return logDate === today;
    });
  }, [dailyLogs]);

  const getLogByDate = useCallback(
    (date) =>
      dailyLogs.find((log) => {
        // Handle both string and Date object formats
        const logDate =
          typeof log.date === "string"
            ? log.date.split("T")[0]
            : new Date(log.date).toISOString().split("T")[0];
        const targetDate =
          typeof date === "string"
            ? date.split("T")[0]
            : new Date(date).toISOString().split("T")[0];
        return logDate === targetDate;
      }),
    [dailyLogs]
  );

  const getCompletionRate = useCallback(() => {
    if (dailyLogs.length === 0) return 0;

    const totalMeals = dailyLogs.reduce((sum, log) => sum + log.totalMeals, 0);
    const completedMeals = dailyLogs.reduce(
      (sum, log) => sum + log.completedMeals,
      0
    );

    return totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;
  }, [dailyLogs]);

  // Clear validation error
  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchDietTrackerData();
  }, [fetchDietTrackerData]);

  return {
    // State
    loading,
    error,
    hasActivePlan,
    activePlan,
    dailyLogs,
    nextMeal,
    stats,
    mockPlanAvailable,
    validationError,

    // Actions
    startDietPlan,
    completeMeal,
    uncompleteMeal,
    changeMealOption,
    fetchDietTrackerData,
    fetchNextMeal,
    fetchStats,
    getMealsForDate,
    getCustomMealHistory,
    addCustomMealToDay,
    deleteSnack,
    clearValidationError,

    // Helpers
    getTodayLog,
    getLogByDate,
    getCompletionRate,
  };
};
