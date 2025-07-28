import { useState, useEffect, useCallback } from "react";

export const useDietTracker = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [hasAssignedPlan, setHasAssignedPlan] = useState(false);
  const [assignedPlan, setAssignedPlan] = useState(null);
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
      setHasAssignedPlan(data.hasAssignedPlan || false);
      setAssignedPlan(data.assignedPlan || null);
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
    async (
      useMockPlan = false,
      dietPlanAssignmentId = null,
      assignedNutritionPlanId = null
    ) => {
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
            assignedNutritionPlanId,
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

  // Start assigned nutrition plan
  const startAssignedPlan = useCallback(
    async (assignedNutritionPlanId) => {
      return startDietPlan(false, null, assignedNutritionPlanId);
    },
    [startDietPlan]
  );

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

  // Complete meal
  const completeMeal = useCallback(
    async (mealLogId) => {
      try {
        const response = await fetch("/api/users/client/diet-tracker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "complete-meal",
            mealLogId,
            isCompleted: true,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            // Day validation error
            setValidationError(data.error);
            throw new Error(data.error);
          }
          throw new Error(data.error || "Failed to complete meal");
        }

        // Refresh data
        await fetchDietTrackerData();
        setValidationError(null);

        return data;
      } catch (err) {
        console.error("Error completing meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData]
  );

  // Uncomplete meal
  const uncompleteMeal = useCallback(
    async (mealLogId) => {
      try {
        const response = await fetch("/api/users/client/diet-tracker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "complete-meal",
            mealLogId,
            isCompleted: false,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            // Day validation error
            setValidationError(data.error);
            throw new Error(data.error);
          }
          throw new Error(data.error || "Failed to uncomplete meal");
        }

        // Refresh data
        await fetchDietTrackerData();
        setValidationError(null);

        return data;
      } catch (err) {
        console.error("Error uncompleting meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData]
  );

  // Change meal option
  const changeMealOption = useCallback(
    async (mealLogId, newOption) => {
      try {
        const response = await fetch("/api/users/client/diet-tracker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "change-meal-option",
            mealLogId,
            newOption,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            // Day validation error
            setValidationError(data.error);
            throw new Error(data.error);
          }
          throw new Error(data.error || "Failed to change meal option");
        }

        // Refresh data
        await fetchDietTrackerData();
        setValidationError(null);

        return data;
      } catch (err) {
        console.error("Error changing meal option:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData]
  );

  // Log meal with portion control and custom meals
  const logMeal = useCallback(
    async (meal, selectedOption, mealLog) => {
      try {
        if (mealLog) {
          // If meal log exists, toggle completion
          if (mealLog.isCompleted) {
            return await uncompleteMeal(mealLog.id);
          } else {
            return await completeMeal(mealLog.id);
          }
        }

        // Log new meal
        const response = await fetch("/api/users/client/diet-tracker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "log-meal",
            mealName: meal.name,
            mealTime: meal.time,
            selectedOption,
            date: new Date().toISOString().split("T")[0],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            // Day validation error
            setValidationError(data.error);
            throw new Error(data.error);
          }
          throw new Error(data.error || "Failed to log meal");
        }

        // Refresh data
        await fetchDietTrackerData();
        setValidationError(null);

        return data;
      } catch (err) {
        console.error("Error logging meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData, completeMeal, uncompleteMeal]
  );

  // Add custom meal to day
  const addCustomMealToDay = useCallback(
    async (date, customMealData) => {
      try {
        if (!activePlan) {
          throw new Error("No active plan found");
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
          throw new Error(data.error || "Failed to add custom meal");
        }

        // Refresh data
        await fetchDietTrackerData();

        return data;
      } catch (err) {
        console.error("Error adding custom meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [activePlan, fetchDietTrackerData]
  );

  // Delete snack
  const deleteSnack = useCallback(
    async (snackLogId) => {
      try {
        const response = await fetch(
          `/api/users/client/diet-tracker/snacks/${snackLogId}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete snack");
        }

        // Refresh data
        await fetchDietTrackerData();

        return data;
      } catch (err) {
        console.error("Error deleting snack:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData]
  );

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
    (date) => {
      return dailyLogs.find((log) => {
        // Handle both string and Date object formats
        const logDate =
          typeof log.date === "string"
            ? log.date.split("T")[0]
            : new Date(log.date).toISOString().split("T")[0];
        return logDate === date;
      });
    },
    [dailyLogs]
  );

  const getCompletionRate = useCallback(() => {
    if (!dailyLogs.length) return 0;

    const totalMeals = dailyLogs.reduce(
      (total, log) => total + (log.totalMeals || 0),
      0
    );
    const completedMeals = dailyLogs.reduce(
      (total, log) => total + (log.completedMeals || 0),
      0
    );

    return totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;
  }, [dailyLogs]);

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  // Initialize data
  useEffect(() => {
    fetchDietTrackerData();
  }, [fetchDietTrackerData]);

  return {
    loading,
    error,
    hasActivePlan,
    hasAssignedPlan,
    assignedPlan,
    activePlan,
    dailyLogs,
    nextMeal,
    stats,
    mockPlanAvailable,
    validationError,
    startDietPlan,
    startAssignedPlan,
    completeMeal,
    uncompleteMeal,
    changeMealOption,
    logMeal,
    addCustomMealToDay,
    deleteSnack,
    getCompletionRate,
    getLogByDate,
    getTodayLog,
    getMealsForDate,
    fetchStats,
    clearValidationError,
    fetchDietTrackerData,
  };
};
