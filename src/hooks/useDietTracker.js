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
  const [assignedPlan, setAssignedPlan] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionStatus, setCompletionStatus] = useState(null);

  // Water tracking state
  const [dailyWaterIntake, setDailyWaterIntake] = useState(0);
  const [isWaterLoading, setIsWaterLoading] = useState(false);

  // Helper functions - moved to the top to avoid reference errors
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

  // Clear validation error
  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  // Fetch diet tracker data
  const fetchDietTrackerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching diet tracker data");
      const response = await fetch("/api/users/client/diet-tracker");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch diet tracker data");
      }

      setHasActivePlan(data.hasActivePlan);
      setMockPlanAvailable(data.mockPlanAvailable || false);
      setAssignedPlan(data.assignedPlan || null);

      if (data.hasActivePlan) {
        console.log("Setting active plan data");
        setActivePlan(data.activePlan);
        setDailyLogs(data.dailyLogs || []);
        setNextMeal(data.nextMeal);
        setProgress(data.progress || null);
        setProgressMessage(data.progressMessage || null);
        setIsCompleted(data.isCompleted || false);
        setCompletionStatus(data.completionStatus || null);
      } else {
        console.log("No active plan found");
        // Clear active plan data
        setActivePlan(null);
        setDailyLogs([]);
        setNextMeal(null);
        setProgress(null);
        setProgressMessage(null);
        setIsCompleted(false);
        setCompletionStatus(null);
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
      startDate = null,
      selectedPlan = null
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
            startDate,
            selectedPlan,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to start diet plan");
        }

        // Refresh data after starting plan - this is one case where we need a full refresh
        // since we're starting a new plan and need all the data
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

  // Fetch next meal
  const fetchNextMeal = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/users/client/diet-tracker?action=next-meal"
      );
      const data = await response.json();

      if (response.ok) {
        setNextMeal(data.nextMeal);

        // Check if there's an assigned plan that hasn't been started yet
        if (data.hasAssignedPlan && data.assignedPlan) {
          setAssignedPlan(data.assignedPlan);
          setHasActivePlan(false);
        }

        // Check if a plan was fixed (was inactive but should be active)
        if (data.planFixed && !hasActivePlan) {
          console.log("Plan was fixed, refreshing data");
          // Refresh all data to get the fixed plan
          await fetchDietTrackerData();
        }
      } else if (response.status === 404) {
        // If no active plan is found, don't clear the next meal
        // This prevents losing the active plan state on refresh
        console.warn(
          "No active plan found when fetching next meal, maintaining current state"
        );
        // Don't update the state, keep the current meal
      }
    } catch (err) {
      console.error("Error fetching next meal:", err);
    }
  }, [fetchDietTrackerData, hasActivePlan]);

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
        setDailyLogs((prevLogs) => {
          const updatedLogs = prevLogs.map((log) => {
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
              completionRate:
                log.totalMeals > 0
                  ? (completedMeals / log.totalMeals) * 100
                  : 0,
              isCompleted: completedMeals / log.totalMeals >= 0.5, // Mark as completed if >= 50%
            };
          });

          // Update next meal locally if possible
          if (!data.data?.planCompletion?.completed) {
            // Find the next incomplete meal from the updated logs
            const today = new Date().toISOString().split("T")[0];

            // Find today's log in the updated logs
            const todayLog = updatedLogs.find((log) => {
              const logDate =
                typeof log.date === "string"
                  ? log.date.split("T")[0]
                  : new Date(log.date).toISOString().split("T")[0];
              return logDate === today;
            });

            if (todayLog) {
              const incompleteMeals = todayLog.mealLogs.filter(
                (meal) => !meal.isCompleted
              );
              if (incompleteMeals.length > 0) {
                // Sort by meal time
                incompleteMeals.sort((a, b) =>
                  a.mealTime.localeCompare(b.mealTime)
                );
                setNextMeal({
                  ...incompleteMeals[0],
                  dayNumber: todayLog.dayNumber,
                  date: todayLog.date,
                });
              } else {
                // No more incomplete meals today, find next day with meals
                const futureLogs = updatedLogs
                  .filter((log) => {
                    const logDate =
                      typeof log.date === "string"
                        ? new Date(log.date)
                        : new Date(log.date);
                    return logDate > new Date(today);
                  })
                  .sort((a, b) => {
                    const dateA =
                      typeof a.date === "string"
                        ? new Date(a.date)
                        : new Date(a.date);
                    const dateB =
                      typeof b.date === "string"
                        ? new Date(b.date)
                        : new Date(b.date);
                    return dateA - dateB;
                  });

                if (
                  futureLogs.length > 0 &&
                  futureLogs[0].mealLogs.length > 0
                ) {
                  const nextDayMeals = futureLogs[0].mealLogs.sort((a, b) =>
                    a.mealTime.localeCompare(b.mealTime)
                  );
                  setNextMeal({
                    ...nextDayMeals[0],
                    dayNumber: futureLogs[0].dayNumber,
                    date: futureLogs[0].date,
                  });
                }
              }
            }
          }

          return updatedLogs;
        });

        // Check if the plan was completed as a result of this meal completion
        if (data.data?.planCompletion?.completed) {
          console.log("Plan was completed, refreshing data");
          // If plan was completed, refresh all data to get updated status
          await fetchDietTrackerData();
        } else {
          // If we couldn't update next meal locally, fallback to API
          if (!nextMeal) {
            try {
              const nextMealResponse = await fetch(
                "/api/users/client/diet-tracker?action=next-meal"
              );
              const nextMealData = await nextMealResponse.json();

              if (nextMealResponse.ok) {
                setNextMeal(nextMealData.nextMeal);
              }
            } catch (err) {
              console.error("Error fetching next meal:", err);
            }
          }
        }

        // Update progress based on completed meals
        setDailyLogs((currentLogs) => {
          const completedMeals = currentLogs.reduce(
            (sum, log) => sum + log.completedMeals,
            0
          );
          const totalMeals = currentLogs.reduce(
            (sum, log) => sum + log.totalMeals,
            0
          );
          const completionRate =
            totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

          // Update progress state
          if (progress) {
            setProgress({
              ...progress,
              averageCompletionRate: completionRate,
            });
          }

          return currentLogs;
        });

        return data;
      } catch (err) {
        console.error("Error completing meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData, progress, nextMeal]
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
        setDailyLogs((prevLogs) => {
          const updatedLogs = prevLogs.map((log) => {
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
              completionRate:
                log.totalMeals > 0
                  ? (completedMeals / log.totalMeals) * 100
                  : 0,
              isCompleted: completedMeals / log.totalMeals >= 0.5, // Mark as completed if >= 50%
            };
          });

          // Find the uncompleted meal in the updated logs
          let mealInfo = null;
          let mealLog = null;

          for (const log of updatedLogs) {
            const foundMeal = log.mealLogs.find(
              (meal) => meal.id === mealLogId
            );
            if (foundMeal) {
              mealInfo = foundMeal;
              mealLog = log;
              break;
            }
          }

          // Update next meal locally if possible
          if (!data.data?.planCompletion?.completed && mealInfo && mealLog) {
            const today = new Date().toISOString().split("T")[0];
            const mealDate =
              typeof mealLog.date === "string"
                ? mealLog.date.split("T")[0]
                : new Date(mealLog.date).toISOString().split("T")[0];

            // If the meal is from today, set it as the next meal
            if (mealDate === today) {
              setNextMeal({
                ...mealInfo,
                dayNumber: mealLog.dayNumber,
                date: mealLog.date,
              });
            } else {
              // Otherwise, find the next incomplete meal
              const todayLog = updatedLogs.find((log) => {
                const logDate =
                  typeof log.date === "string"
                    ? log.date.split("T")[0]
                    : new Date(log.date).toISOString().split("T")[0];
                return logDate === today;
              });

              if (todayLog) {
                const incompleteMeals = todayLog.mealLogs.filter(
                  (meal) => !meal.isCompleted
                );
                if (incompleteMeals.length > 0) {
                  // Sort by meal time
                  incompleteMeals.sort((a, b) =>
                    a.mealTime.localeCompare(b.mealTime)
                  );
                  setNextMeal({
                    ...incompleteMeals[0],
                    dayNumber: todayLog.dayNumber,
                    date: todayLog.date,
                  });
                }
              }
            }
          }

          return updatedLogs;
        });

        // Check if the plan status changed as a result of this meal action
        if (data.data?.planCompletion?.completed) {
          console.log("Plan status changed, refreshing data");
          // If plan status changed, refresh all data to get updated status
          await fetchDietTrackerData();
        } else {
          // If we couldn't update next meal locally, fallback to API
          if (!nextMeal) {
            try {
              const nextMealResponse = await fetch(
                "/api/users/client/diet-tracker?action=next-meal"
              );
              const nextMealData = await nextMealResponse.json();

              if (nextMealResponse.ok) {
                setNextMeal(nextMealData.nextMeal);
              }
            } catch (err) {
              console.error("Error fetching next meal:", err);
            }
          }
        }

        // Update progress based on completed meals
        setDailyLogs((currentLogs) => {
          const completedMeals = currentLogs.reduce(
            (sum, log) => sum + log.completedMeals,
            0
          );
          const totalMeals = currentLogs.reduce(
            (sum, log) => sum + log.totalMeals,
            0
          );
          const completionRate =
            totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

          // Update progress state
          if (progress) {
            setProgress({
              ...progress,
              averageCompletionRate: completionRate,
            });
          }

          return currentLogs;
        });

        return data;
      } catch (err) {
        console.error("Error uncompleting meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData, progress, nextMeal]
  );

  // Change meal option
  const changeMealOption = useCallback(
    async (mealLogId, newOption) => {
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
          prevLogs.map((log) => {
            const updatedMealLogs = log.mealLogs.map((meal) =>
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
            );

            // Recalculate nutrition totals for the day
            const mealCalories = updatedMealLogs.reduce(
              (sum, meal) => sum + (meal.calories || 0),
              0
            );
            const snackCalories = (log.snackLogs || []).reduce(
              (sum, snack) => sum + (snack.calories || 0),
              0
            );
            const totalCalories = mealCalories + snackCalories;

            const mealProtein = updatedMealLogs.reduce(
              (sum, meal) => sum + (meal.protein || 0),
              0
            );
            const snackProtein = (log.snackLogs || []).reduce(
              (sum, snack) => sum + (snack.protein || 0),
              0
            );
            const totalProtein = mealProtein + snackProtein;

            const mealCarbs = updatedMealLogs.reduce(
              (sum, meal) => sum + (meal.carbs || 0),
              0
            );
            const snackCarbs = (log.snackLogs || []).reduce(
              (sum, snack) => sum + (snack.carbs || 0),
              0
            );
            const totalCarbs = mealCarbs + snackCarbs;

            const mealFat = updatedMealLogs.reduce(
              (sum, meal) => sum + (meal.fat || 0),
              0
            );
            const snackFat = (log.snackLogs || []).reduce(
              (sum, snack) => sum + (snack.fat || 0),
              0
            );
            const totalFat = mealFat + snackFat;

            return {
              ...log,
              mealLogs: updatedMealLogs,
              totalCalories,
              totalProtein,
              totalCarbs,
              totalFat,
            };
          })
        );

        // Check if the plan status changed as a result of this meal action
        if (data.data?.planCompletion?.completed) {
          console.log("Plan status changed, refreshing data");
          // If plan status changed, refresh all data to get updated status
          await fetchDietTrackerData();
        }

        // Update next meal if this is the current next meal
        if (nextMeal && nextMeal.id === mealLogId) {
          setNextMeal({
            ...nextMeal,
            selectedOption: newOption,
            calories: newOption.calories || 0,
            protein: newOption.protein || 0,
            carbs: newOption.carbs || 0,
            fat: newOption.fat || 0,
          });
        }

        return data;
      } catch (err) {
        console.error("Error changing meal option:", err);
        setError(err.message);
        throw err;
      }
    },
    [fetchDietTrackerData, nextMeal]
  );

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
      return null;
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
              // Calculate new nutrition totals
              const newTotalCalories =
                (log.totalCalories || 0) + (newSnackLog.calories || 0);
              const newTotalProtein =
                (log.totalProtein || 0) + (newSnackLog.protein || 0);
              const newTotalCarbs =
                (log.totalCarbs || 0) + (newSnackLog.carbs || 0);
              const newTotalFat = (log.totalFat || 0) + (newSnackLog.fat || 0);

              return {
                ...log,
                snackLogs: [...(log.snackLogs || []), newSnackLog],
                snackCount: (log.snackCount || 0) + 1,
                // Update nutrition totals
                totalCalories: newTotalCalories,
                totalProtein: newTotalProtein,
                totalCarbs: newTotalCarbs,
                totalFat: newTotalFat,
              };
            }
            return log;
          })
        );

        // Update progress based on new nutrition values
        if (progress) {
          // Calculate new average values
          const totalCalories =
            dailyLogs.reduce((sum, log) => sum + log.totalCalories, 0) +
            (newSnackLog.calories || 0);
          const totalProtein =
            dailyLogs.reduce((sum, log) => sum + log.totalProtein, 0) +
            (newSnackLog.protein || 0);
          const totalCarbs =
            dailyLogs.reduce((sum, log) => sum + log.totalCarbs, 0) +
            (newSnackLog.carbs || 0);
          const totalFat =
            dailyLogs.reduce((sum, log) => sum + log.totalFat, 0) +
            (newSnackLog.fat || 0);
          const dayCount = dailyLogs.length;

          if (dayCount > 0) {
            setProgress({
              ...progress,
              averageCaloriesPerDay: totalCalories / dayCount,
              averageProteinPerDay: totalProtein / dayCount,
              averageCarbsPerDay: totalCarbs / dayCount,
              averageFatPerDay: totalFat / dayCount,
            });
          }
        }

        return data;
      } catch (err) {
        console.error("Error adding custom meal:", err);
        setError(err.message);
        throw err;
      }
    },
    [activePlan, dailyLogs, progress]
  );

  // Delete a snack
  const deleteSnack = useCallback(
    async (snackLogId) => {
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

        // Find the snack before deleting it to calculate nutrition changes
        let deletedSnack = null;
        let affectedLogIndex = -1;

        dailyLogs.forEach((log, index) => {
          if (
            log.snackLogs &&
            log.snackLogs.some((snack) => snack.id === snackLogId)
          ) {
            deletedSnack = log.snackLogs.find(
              (snack) => snack.id === snackLogId
            );
            affectedLogIndex = index;
          }
        });

        if (!deletedSnack) {
          console.warn(`Snack with ID ${snackLogId} not found in local state`);
          // Fallback to full refresh if we can't find the snack
          await fetchDietTrackerData();
          return data;
        }

        // Update local state
        setDailyLogs((prevLogs) =>
          prevLogs.map((log, index) => {
            if (index === affectedLogIndex) {
              const updatedSnackLogs = log.snackLogs.filter(
                (snack) => snack.id !== snackLogId
              );

              // Calculate new nutrition totals
              const newTotalCalories = Math.max(
                0,
                (log.totalCalories || 0) - (deletedSnack?.calories || 0)
              );
              const newTotalProtein = Math.max(
                0,
                (log.totalProtein || 0) - (deletedSnack?.protein || 0)
              );
              const newTotalCarbs = Math.max(
                0,
                (log.totalCarbs || 0) - (deletedSnack?.carbs || 0)
              );
              const newTotalFat = Math.max(
                0,
                (log.totalFat || 0) - (deletedSnack?.fat || 0)
              );

              return {
                ...log,
                snackLogs: updatedSnackLogs,
                snackCount: Math.max(0, (log.snackCount || 0) - 1),
                // Update nutrition totals
                totalCalories: newTotalCalories,
                totalProtein: newTotalProtein,
                totalCarbs: newTotalCarbs,
                totalFat: newTotalFat,
              };
            }
            return log;
          })
        );

        // Update progress based on new nutrition values
        if (progress && deletedSnack) {
          // Calculate new average values
          const totalCalories =
            dailyLogs.reduce((sum, log) => sum + log.totalCalories, 0) -
            (deletedSnack.calories || 0);
          const totalProtein =
            dailyLogs.reduce((sum, log) => sum + log.totalProtein, 0) -
            (deletedSnack.protein || 0);
          const totalCarbs =
            dailyLogs.reduce((sum, log) => sum + log.totalCarbs, 0) -
            (deletedSnack.carbs || 0);
          const totalFat =
            dailyLogs.reduce((sum, log) => sum + log.totalFat, 0) -
            (deletedSnack.fat || 0);
          const dayCount = dailyLogs.length;

          if (dayCount > 0) {
            setProgress({
              ...progress,
              averageCaloriesPerDay: totalCalories / dayCount,
              averageProteinPerDay: totalProtein / dayCount,
              averageCarbsPerDay: totalCarbs / dayCount,
              averageFatPerDay: totalFat / dayCount,
            });
          }
        }

        return data;
      } catch (err) {
        console.error("Error deleting snack:", err);
        setError(err.message);
        throw err;
      }
    },
    [dailyLogs, fetchDietTrackerData, progress]
  );

  // Fetch diet plan stats
  const fetchStats = useCallback(async () => {
    try {
      // First try to calculate stats locally if we have all the data
      if (activePlan && dailyLogs.length > 0) {
        console.log("Calculating stats locally");

        const totalDays = dailyLogs.length;
        const completedDays = dailyLogs.filter((log) => log.isCompleted).length;

        const totalMeals = dailyLogs.reduce(
          (sum, log) => sum + log.totalMeals,
          0
        );
        const completedMeals = dailyLogs.reduce(
          (sum, log) => sum + log.completedMeals,
          0
        );

        const totalCalories = dailyLogs.reduce(
          (sum, log) => sum + log.totalCalories,
          0
        );
        const totalProtein = dailyLogs.reduce(
          (sum, log) => sum + log.totalProtein,
          0
        );
        const totalCarbs = dailyLogs.reduce(
          (sum, log) => sum + log.totalCarbs,
          0
        );
        const totalFat = dailyLogs.reduce((sum, log) => sum + log.totalFat, 0);

        const averageCalories = totalDays > 0 ? totalCalories / totalDays : 0;
        const averageProtein = totalDays > 0 ? totalProtein / totalDays : 0;
        const averageCarbs = totalDays > 0 ? totalCarbs / totalDays : 0;
        const averageFat = totalDays > 0 ? totalFat / totalDays : 0;

        const localStats = {
          totalDays,
          completedDays,
          totalMeals,
          completedMeals,
          adherenceRate:
            totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0,
          dayCompletionRate:
            totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
          averageNutrition: {
            calories: Math.round(averageCalories),
            protein: Math.round(averageProtein * 10) / 10,
            carbs: Math.round(averageCarbs * 10) / 10,
            fat: Math.round(averageFat * 10) / 10,
          },
          nutritionPlan: activePlan.nutritionPlan,
          startDate: activePlan.startDate,
        };

        setStats(localStats);
        return;
      }

      // Fall back to API if we don't have enough local data
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
  }, [activePlan, dailyLogs]);

  // Get meals for a specific date
  const getMealsForDate = useCallback(
    async (date) => {
      if (!activePlan) return null;

      // First try to get meals from local state
      const formattedDate =
        typeof date === "string"
          ? date.split("T")[0]
          : new Date(date).toISOString().split("T")[0];

      // Find log directly without using getLogByDate
      const localDailyLog = dailyLogs.find((log) => {
        const logDate =
          typeof log.date === "string"
            ? log.date.split("T")[0]
            : new Date(log.date).toISOString().split("T")[0];
        return logDate === formattedDate;
      });

      if (localDailyLog) {
        console.log(`Using local data for meals on ${formattedDate}`);
        return localDailyLog;
      }

      // If not in local state, fetch from API
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
    [activePlan, dailyLogs]
  );

  // Get completion rate
  const getCompletionRate = useCallback(() => {
    if (dailyLogs.length === 0) return 0;

    const totalMeals = dailyLogs.reduce((sum, log) => sum + log.totalMeals, 0);
    const completedMeals = dailyLogs.reduce(
      (sum, log) => sum + log.completedMeals,
      0
    );

    return totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;
  }, [dailyLogs]);

  // Water tracking functions
  const fetchWaterIntake = useCallback(async () => {
    console.log("🌊 [WATER] Fetching water intake data");
    try {
      setIsWaterLoading(true);

      // For now, we'll simulate fetching water data
      // This will be replaced with actual API call later
      const mockWaterData = {
        dailyIntake: 1200, // ml
        goal: 4000, // ml
        lastUpdated: new Date().toISOString(),
      };

      console.log("🌊 [WATER] Mock water data received:", mockWaterData);
      setDailyWaterIntake(mockWaterData.dailyIntake);

      return mockWaterData;
    } catch (err) {
      console.error("🌊 [WATER] Error fetching water intake:", err);
      setError(err.message);
    } finally {
      setIsWaterLoading(false);
    }
  }, []);

  const addWater = useCallback(
    async (amount) => {
      console.log("🌊 [WATER] Adding water:", amount, "ml");
      try {
        setIsWaterLoading(true);

        // For now, we'll simulate adding water locally
        // This will be replaced with actual API call later
        const newTotal = dailyWaterIntake + amount;
        console.log("🌊 [WATER] New total water intake:", newTotal, "ml");

        setDailyWaterIntake(newTotal);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("🌊 [WATER] Water added successfully");
        return { success: true, newTotal };
      } catch (err) {
        console.error("🌊 [WATER] Error adding water:", err);
        setError(err.message);
        throw err;
      } finally {
        setIsWaterLoading(false);
      }
    },
    [dailyWaterIntake]
  );

  const getWaterStats = useCallback(() => {
    console.log("🌊 [WATER] Getting water stats");
    const goal = 4000; // ml
    const percentage = (dailyWaterIntake / goal) * 100;

    const stats = {
      current: dailyWaterIntake,
      goal,
      percentage: Math.round(percentage),
      remaining: Math.max(0, goal - dailyWaterIntake),
      isGoalReached: dailyWaterIntake >= goal,
    };

    console.log("🌊 [WATER] Water stats:", stats);
    return stats;
  }, [dailyWaterIntake]);

  const resetWaterIntake = useCallback(async () => {
    console.log("🌊 [WATER] Resetting water intake");
    try {
      setIsWaterLoading(true);

      // For now, we'll simulate resetting water locally
      // This will be replaced with actual API call later
      setDailyWaterIntake(0);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("🌊 [WATER] Water intake reset successfully");
      return { success: true };
    } catch (err) {
      console.error("🌊 [WATER] Error resetting water intake:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsWaterLoading(false);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchDietTrackerData();
    fetchWaterIntake(); // Also fetch water data on mount
  }, [fetchDietTrackerData, fetchWaterIntake]);

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
    assignedPlan,
    validationError,
    progress,
    progressMessage,
    isCompleted,
    completionStatus,

    // Water tracking state
    dailyWaterIntake,
    isWaterLoading,

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

    // Water tracking actions
    addWater,
    fetchWaterIntake,
    getWaterStats,
    resetWaterIntake,

    // Helpers
    getTodayLog,
    getLogByDate,
    getCompletionRate,
  };
};
