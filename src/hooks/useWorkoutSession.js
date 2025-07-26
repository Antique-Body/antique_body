import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

export function useWorkoutSession(plan, planId, clientId) {
  // Live tracking state
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutData, setWorkoutData] = useState({});
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  // New: Workout status tracking
  const [_workoutStatus, setWorkoutStatus] = useState({
    currentDay: 0,
    completedDays: [],
    inProgressDay: null,
    startedAt: null,
    lastSavedAt: null,
    totalWorkoutSessions: 0,
    planStartedAt: null,
    estimatedCompletionDate: null,
  });

  // Initialize workout data structure
  const initializeWorkoutData = useCallback((planData) => {
    if (!planData || !planData.schedule) {
      return {};
    }

    const data = {};

    try {
      planData.schedule.forEach((day, dayIdx) => {
        data[dayIdx] = {
          status: dayIdx === 0 ? "unlocked" : "locked",
          startedAt: null,
          completedAt: null,
          totalTimeSpent: 0,
          attempts: 0,
          exercises: {},
          workoutSummary: null,
        };

        if (day.exercises && Array.isArray(day.exercises)) {
          day.exercises.forEach((exercise, exIdx) => {
            const setsCount = exercise.sets || 3;
            const targetReps = exercise.reps || 10;

            data[dayIdx].exercises[exIdx] = {
              sets: Array.from({ length: setsCount }, (_, setIdx) => ({
                setNumber: setIdx + 1,
                weight: "",
                reps: targetReps.toString(),
                completed: false,
                notes: "",
                completedAt: null,
                restTime: exercise.rest || 60,
                actualRestTime: null,
              })),
              exerciseNotes: "",
              completed: false,
            };
          });
        }
      });
    } catch (err) {
      console.error("Error initializing workout data:", err);
      return {};
    }

    return data;
  }, []);

  // Initialize workout data when plan changes
  useEffect(() => {
    if (
      plan &&
      plan.schedule &&
      Array.isArray(plan.schedule) &&
      plan.schedule.length > 0
    ) {
      try {
        const initialData = initializeWorkoutData(plan);
        setWorkoutData(initialData);
        setWorkoutStatus({
          currentDay: 0,
          completedDays: [],
          inProgressDay: null,
          startedAt: null,
          lastSavedAt: null,
          totalWorkoutSessions: 0,
          planStartedAt: new Date().toISOString(),
          estimatedCompletionDate: null,
        });

        // Auto-load existing progress after initialization
        if (planId && clientId) {
          loadWorkoutProgress(planId, clientId).then((loadedData) => {
            if (loadedData) {
              // Merge loaded data with initialized data
              setWorkoutData((prevData) => {
                const mergedData = { ...prevData };

                // Merge each day's data
                Object.keys(loadedData).forEach((dayIdx) => {
                  if (loadedData[dayIdx] && mergedData[dayIdx]) {
                    mergedData[dayIdx] = {
                      ...mergedData[dayIdx],
                      ...loadedData[dayIdx],
                      exercises: {
                        ...mergedData[dayIdx].exercises,
                        ...loadedData[dayIdx].exercises,
                      },
                    };
                  }
                });

                return mergedData;
              });

              // Check for any in-progress workout and restore state
              Object.keys(loadedData).forEach((dayIdx) => {
                const dayData = loadedData[dayIdx];
                if (dayData && dayData.status === "in_progress") {
                  setCurrentDayIndex(parseInt(dayIdx));
                  setIsWorkoutStarted(true);
                  setSessionStartTime(
                    dayData.startedAt ? new Date(dayData.startedAt) : new Date()
                  );
                }
              });
            }
          });
        }
      } catch (err) {
        console.error(
          "Error during workout data initialization or progress loading:",
          err
        );
        setWorkoutData({});
      }

      // Existing progress is loaded above if planId and clientId are provided.
    }
  }, [plan, initializeWorkoutData, planId, clientId]);

  // Rest timer effect
  useEffect(() => {
    let interval;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  // Auto-save effect - debounced to avoid excessive API calls
  useEffect(() => {
    if (!isWorkoutStarted) return;
    // Debounce save function: only save after 10s of inactivity
    const debouncedSave = debounce(() => {
      saveWorkoutProgress(planId, clientId);
    }, 10000); // 10 seconds

    debouncedSave();

    return () => {
      debouncedSave.cancel();
    };
    // Only run when workoutData changes during an active workout
  }, [workoutData, isWorkoutStarted, planId, clientId]);

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper function to check if workout data is initialized
  const isWorkoutDataInitialized = useCallback(
    () =>
      workoutData &&
      typeof workoutData === "object" &&
      Object.keys(workoutData).length > 0,
    [workoutData]
  );

  const getCurrentDay = () => {
    if (!plan || !plan.schedule || !Array.isArray(plan.schedule)) {
      return null;
    }
    return plan.schedule[currentDayIndex] || null;
  };

  const getCurrentExercise = () => {
    const currentDay = getCurrentDay();
    if (
      !currentDay ||
      !currentDay.exercises ||
      !Array.isArray(currentDay.exercises)
    ) {
      return null;
    }
    return currentDay.exercises[currentExerciseIndex] || null;
  };
  const getCurrentExerciseData = () => {
    if (!isWorkoutDataInitialized()) {
      return null;
    }
    return workoutData[currentDayIndex]?.exercises?.[currentExerciseIndex];
  };

  // New: Check if day is accessible
  const isDayAccessible = (dayIdx) => {
    if (!isWorkoutDataInitialized()) {
      return false;
    }

    const dayData = workoutData[dayIdx];
    if (!dayData) return false;

    return (
      dayData.status === "unlocked" ||
      dayData.status === "in_progress" ||
      dayData.status === "completed" ||
      dayData.status === "ended" // Allow access to ended workouts so they can be resumed
    );
  };

  // New: Get day status
  const getDayStatus = (dayIdx) => {
    if (!isWorkoutDataInitialized()) {
      return "locked";
    }
    return workoutData[dayIdx]?.status || "locked";
  };

  // Enhanced updateWorkoutData with timestamp tracking and exercise completion check
  const updateWorkoutData = (dayIdx, exIdx, setIdx, field, value) => {
    if (!isWorkoutDataInitialized()) {
      return;
    }

    setWorkoutData((prev) => {
      if (!prev || typeof prev !== "object") {
        return prev;
      }

      // Ensure day data exists
      const dayData = prev[dayIdx] || {
        status: "unlocked",
        startedAt: null,
        completedAt: null,
        totalTimeSpent: 0,
        attempts: 0,
        exercises: {},
      };

      // Ensure exercise data exists
      const exerciseData = dayData.exercises[exIdx] || {
        sets: [],
        exerciseNotes: "",
        completed: false,
      };

      // Ensure sets array exists and has the required set - add safety check
      let sets = [];
      if (Array.isArray(exerciseData.sets)) {
        sets = [...exerciseData.sets];
      } else {
        sets = [];
      }

      // Validate setIdx is within bounds
      if (setIdx < 0 || setIdx >= sets.length) {
        console.error(
          `Invalid setIdx: ${setIdx} for exercise at day ${dayIdx}, exercise ${exIdx}.`
        );
        return prev; // Or throw new Error(...) if you want to crash in dev
      }

      // Update the specific set
      sets = sets.map((set, idx) =>
        idx === setIdx
          ? {
              ...set,
              [field]: value,
              ...(field === "completed" && value
                ? { completedAt: new Date().toISOString() }
                : {}),
            }
          : set
      );

      // Check if all sets are completed to mark exercise as completed
      const allSetsCompleted = sets.every((set) => set.completed);

      return {
        ...prev,
        [dayIdx]: {
          ...dayData,
          exercises: {
            ...dayData.exercises,
            [exIdx]: {
              ...exerciseData,
              sets: sets,
              completed: allSetsCompleted,
            },
          },
        },
      };
    });
  };

  const updateExerciseNotes = (dayIdx, exIdx, notes) => {
    setWorkoutData((prev) => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        exercises: {
          ...prev[dayIdx].exercises,
          [exIdx]: {
            ...prev[dayIdx].exercises[exIdx],
            exerciseNotes: notes,
          },
        },
      },
    }));
  };

  const completeSet = (setIdx) => {
    if (!isWorkoutDataInitialized()) {
      return;
    }

    updateWorkoutData(
      currentDayIndex,
      currentExerciseIndex,
      setIdx,
      "completed",
      true
    );
    const exercise = getCurrentExercise();
    if (exercise && exercise.rest && setIdx < (exercise.sets || 3) - 1) {
      setRestTimer(exercise.rest);
      setIsResting(true);
    }
  };

  // New: Undo set completion
  const undoSet = (setIdx) => {
    if (!isWorkoutDataInitialized()) {
      return;
    }

    // Only allow undo if workout is not completed
    const dayData = workoutData[currentDayIndex];
    if (dayData && dayData.status === "completed") {
      return;
    }

    updateWorkoutData(
      currentDayIndex,
      currentExerciseIndex,
      setIdx,
      "completed",
      false
    );

    // Clear completion timestamp
    updateWorkoutData(
      currentDayIndex,
      currentExerciseIndex,
      setIdx,
      "completedAt",
      null
    );
  };

  const startWorkout = (dayIdx = currentDayIndex) => {
    const now = new Date();
    setIsWorkoutStarted(true);
    setSessionStartTime(now);
    setCurrentDayIndex(dayIdx);

    // Update workout status with enhanced tracking
    setWorkoutData((prev) => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        status: "in_progress",
        startedAt: now.toISOString(),
        attempts: (prev[dayIdx]?.attempts || 0) + 1,
      },
    }));

    setWorkoutStatus((prev) => ({
      ...prev,
      inProgressDay: dayIdx,
      startedAt: now.toISOString(),
      totalWorkoutSessions: prev.totalWorkoutSessions + 1,
      planStartedAt: prev.planStartedAt || now.toISOString(),
    }));
  };

  // Save workout progress to planData
  const saveWorkoutProgress = async (planId, clientId) => {
    try {
      // The API expects planData structure, not just workoutData
      // We need to merge workoutData into the plan structure
      if (!plan) {
        throw new Error("No plan data available for saving");
      }

      // Create planData with embedded workout progress
      const planDataWithProgress = {
        ...plan,
        schedule:
          plan.schedule?.map((day, dayIdx) => {
            const dayWorkoutData = workoutData[dayIdx];

            if (!dayWorkoutData) {
              return day; // No workout data for this day
            }

            return {
              ...day,
              // Save day-level workout status
              workoutStatus: dayWorkoutData.status,
              workoutStartedAt: dayWorkoutData.startedAt,
              workoutCompletedAt: dayWorkoutData.completedAt,
              workoutEndedAt: dayWorkoutData.endedAt,
              workoutDuration: dayWorkoutData.totalTimeSpent || 0,
              workoutNotes: dayWorkoutData.workoutSummary?.userNotes || "",
              workoutWasCompleted:
                dayWorkoutData.workoutSummary?.wasCompleted || false,

              // Save exercise-level data by embedding sets into exercises
              exercises:
                day.exercises?.map((exercise, exIdx) => {
                  const exerciseWorkoutData = dayWorkoutData.exercises?.[exIdx];

                  if (!exerciseWorkoutData) {
                    return exercise; // No workout data for this exercise
                  }

                  return {
                    ...exercise,
                    // Embed workout sets data
                    sets: exerciseWorkoutData.sets || [],
                    exerciseNotes: exerciseWorkoutData.exerciseNotes || "",
                    exerciseCompleted: exerciseWorkoutData.completed || false,
                  };
                }) || [],
            };
          }) || [],
      };

      const response = await fetch(
        `/api/coaching-requests/${clientId}/assigned-training-plan/${planId}/progress`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planData: planDataWithProgress }),
        }
      );

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        throw new Error(
          `Invalid response from server: ${
            jsonError && jsonError.message ? jsonError.message : jsonError
          }`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || `API returned ${response.status}`);
      }

      return { success: true, message: "Progress saved successfully!" };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to save progress",
      };
    }
  };

  // Load workout progress from planData
  const loadWorkoutProgress = async (planId, clientId) => {
    try {
      const response = await fetch(
        `/api/coaching-requests/${clientId}/assigned-training-plan/${planId}/progress`
      );

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data && result.data.schedule) {
          const planData = result.data;
          const extractedWorkoutData = {};

          planData.schedule.forEach((day, dayIdx) => {
            // Extract day-level workout data
            const dayStatus =
              day.workoutStatus || (dayIdx === 0 ? "unlocked" : "locked");

            extractedWorkoutData[dayIdx] = {
              status: dayStatus,
              startedAt: day.workoutStartedAt || null,
              completedAt: day.workoutCompletedAt || null,
              endedAt: day.workoutEndedAt || null,
              totalTimeSpent: day.workoutDuration || 0,
              attempts: day.workoutAttempts || 0,
              bestPerformance: day.workoutBestPerformance || null,
              workoutSummary:
                day.workoutNotes || day.workoutWasCompleted
                  ? {
                      userNotes: day.workoutNotes || "",
                      completedAt: day.workoutCompletedAt || null,
                      endedAt: day.workoutEndedAt || null,
                      duration: day.workoutDuration || 0,
                      wasCompleted: day.workoutWasCompleted || false,
                    }
                  : null,
              exercises: {},
            };

            // Extract exercise-level workout data from sets
            if (day.exercises) {
              day.exercises.forEach((exercise, exIdx) => {
                // Check if exercise has workout sets data (completed sets, notes, etc.)
                const exerciseSets = exercise.sets;
                const hasWorkoutData =
                  (Array.isArray(exerciseSets) &&
                    exerciseSets.some(
                      (set) =>
                        set.completed ||
                        set.weight ||
                        set.notes ||
                        set.completedAt
                    )) ||
                  exercise.exerciseNotes ||
                  exercise.exerciseCompleted;

                if (hasWorkoutData) {
                  extractedWorkoutData[dayIdx].exercises[exIdx] = {
                    sets: Array.isArray(exerciseSets) ? exerciseSets : [],
                    exerciseNotes: exercise.exerciseNotes || "",
                    completed: exercise.exerciseCompleted || false,
                  };
                }
              });
            }
          });

          // Ensure day unlocking logic - if a day is completed, unlock the next day
          planData.schedule.forEach((day, dayIdx) => {
            if (
              day.workoutStatus === "completed" &&
              extractedWorkoutData[dayIdx + 1]
            ) {
              extractedWorkoutData[dayIdx + 1].status = "unlocked";
            }
          });

          return extractedWorkoutData;
        }
      }
    } catch (err) {
      console.error("Error loading workout progress:", err);
    }
    return null;
  };

  // New: Complete current day and unlock next with enhanced tracking
  const completeDayWorkout = (workoutNotes = "", dayIndex = currentDayIndex) =>
    new Promise((resolve) => {
      const now = new Date();
      const completedDayIdx = dayIndex;
      const sessionDuration = sessionStartTime
        ? Math.floor((now - sessionStartTime) / 1000)
        : 0;

      setWorkoutData((prev) => {
        const updated = { ...prev };

        // Mark specified day as completed
        updated[completedDayIdx] = {
          ...updated[completedDayIdx],
          status: "completed",
          completedAt: now.toISOString(),
          totalTimeSpent:
            (updated[completedDayIdx]?.totalTimeSpent || 0) + sessionDuration,
          workoutSummary: {
            userNotes: workoutNotes.trim(),
            completedAt: now.toISOString(),
            duration: sessionDuration,
            wasCompleted: true,
          },
        };

        // Unlock next day if it exists
        const nextDayIdx = completedDayIdx + 1;
        if (updated[nextDayIdx]) {
          updated[nextDayIdx] = {
            ...updated[nextDayIdx],
            status: "unlocked",
          };
        }

        resolve(updated[completedDayIdx]);

        return updated;
      });

      setIsWorkoutStarted(false);
      setSessionStartTime(null);
    });

  // New: End workout without completing day
  const endWorkout = (workoutNotes = "", dayIndex = currentDayIndex) =>
    new Promise((resolve) => {
      const now = new Date();
      const endedDayIdx = dayIndex;
      const sessionDuration = sessionStartTime
        ? Math.floor((now - sessionStartTime) / 1000)
        : 0;

      setWorkoutData((prev) => {
        const updated = {
          ...prev,
          [endedDayIdx]: {
            ...prev[endedDayIdx],
            status: "ended",
            endedAt: now.toISOString(),
            totalTimeSpent:
              (prev[endedDayIdx]?.totalTimeSpent || 0) + sessionDuration,
            workoutSummary: {
              userNotes: workoutNotes.trim(),
              endedAt: now.toISOString(),
              duration: sessionDuration,
              wasCompleted: false,
            },
          },
        };

        resolve(updated[endedDayIdx]);

        return updated;
      });

      setIsWorkoutStarted(false);
      setSessionStartTime(null);
    });

  const nextExercise = () => {
    const currentDay = getCurrentDay();
    if (currentExerciseIndex < currentDay.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setCurrentSet(1);
    }
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return "00:00";
    const now = new Date();
    const diff = Math.floor((now - sessionStartTime) / 1000);
    return formatTime(diff);
  };

  const getSessionDurationInSeconds = () => {
    if (!sessionStartTime) return 0;
    const now = new Date();
    return Math.floor((now - sessionStartTime) / 1000);
  };

  const getCompletedSets = () => {
    // First try to get completed sets from plan data (most accurate)
    if (plan?.schedule?.[currentDayIndex]?.exercises?.[currentExerciseIndex]) {
      const exercise =
        plan.schedule[currentDayIndex].exercises[currentExerciseIndex];

      if (Array.isArray(exercise.sets)) {
        // If sets is an array, count completed sets
        return exercise.sets.filter((set) => set.completed).length;
      } else {
        // If sets is a number, check if exercise/day is completed
        const dayStatus = plan.schedule[currentDayIndex]?.workoutStatus;
        if (dayStatus === "completed" || exercise.exerciseCompleted) {
          return exercise.sets || 3;
        }
        return 0;
      }
    }

    // Fallback to workoutSession data
    const exerciseData = getCurrentExerciseData();
    if (
      !exerciseData ||
      !exerciseData.sets ||
      !Array.isArray(exerciseData.sets)
    ) {
      return 0;
    }
    return exerciseData.sets.filter((set) => set && set.completed).length;
  };

  const getDayProgress = (dayIdx) => {
    // First try to get progress from plan data (most accurate for completed sets)
    if (plan?.schedule?.[dayIdx]?.exercises) {
      let completed = 0;
      let total = 0;

      plan.schedule[dayIdx].exercises.forEach((exercise) => {
        if (Array.isArray(exercise.sets)) {
          // If sets is an array, it contains workout data
          exercise.sets.forEach((set) => {
            total++;
            if (set.completed) completed++;
          });
        } else {
          // If sets is a number, use the plan number but check if workout is completed
          const setsCount = exercise.sets || 3;
          total += setsCount;

          // For completed workouts, assume all sets are completed
          const dayStatus = plan.schedule[dayIdx]?.workoutStatus;
          if (dayStatus === "completed") {
            completed += setsCount;
          }
        }
      });

      if (total > 0) {
        return {
          completed,
          total,
          percentage: (completed / total) * 100,
        };
      }
    }

    // Fallback to workoutSession data if plan data is not available
    if (!isWorkoutDataInitialized()) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const dayData = workoutData[dayIdx];
    if (!dayData || !dayData.exercises)
      return { completed: 0, total: 0, percentage: 0 };

    let completed = 0;
    let total = 0;

    Object.values(dayData.exercises).forEach((exerciseData) => {
      if (
        exerciseData &&
        exerciseData.sets &&
        Array.isArray(exerciseData.sets)
      ) {
        exerciseData.sets.forEach((set) => {
          total++;
          if (set && set.completed) completed++;
        });
      }
    });

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const getExerciseProgress = (dayIdx, exerciseIdx) => {
    // First try to get progress from plan data (most accurate for completed sets)
    if (plan?.schedule?.[dayIdx]?.exercises?.[exerciseIdx]) {
      const exercise = plan.schedule[dayIdx].exercises[exerciseIdx];

      if (Array.isArray(exercise.sets)) {
        // If sets is an array, it contains workout data
        const completed = exercise.sets.filter((set) => set.completed).length;
        const total = exercise.sets.length;

        return {
          completed,
          total,
          percentage: total > 0 ? (completed / total) * 100 : 0,
        };
      } else {
        // If sets is a number, use the plan number but check completion status
        const total = exercise.sets || 3;
        let completed = 0;

        // Check if exercise is completed or if workout day is completed
        const dayStatus = plan.schedule[dayIdx]?.workoutStatus;
        if (dayStatus === "completed" || exercise.exerciseCompleted) {
          completed = total;
        }

        return {
          completed,
          total,
          percentage: total > 0 ? (completed / total) * 100 : 0,
        };
      }
    }

    // Fallback to workoutSession data
    if (!isWorkoutDataInitialized()) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const exerciseData = workoutData[dayIdx]?.exercises?.[exerciseIdx];
    if (
      !exerciseData ||
      !exerciseData.sets ||
      !Array.isArray(exerciseData.sets)
    ) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const completed = exerciseData.sets.filter(
      (set) => set && set.completed
    ).length;
    const total = exerciseData.sets.length;

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const getTotalSessionStats = () => {
    // First try to get stats from plan data (most accurate for completed sets)
    if (plan?.schedule) {
      let totalSets = 0;
      let completedSets = 0;
      let totalExercises = 0;
      let completedExercises = 0;

      plan.schedule.forEach((day) => {
        if (day.exercises) {
          day.exercises.forEach((exercise) => {
            totalExercises++;

            if (Array.isArray(exercise.sets)) {
              // If sets is an array, it contains workout data
              exercise.sets.forEach((set) => {
                totalSets++;
                if (set.completed) completedSets++;
              });

              // Check if all sets are completed for this exercise
              const exerciseCompletedSets = exercise.sets.filter(
                (set) => set.completed
              ).length;
              if (
                exerciseCompletedSets === exercise.sets.length &&
                exercise.sets.length > 0
              ) {
                completedExercises++;
              }
            } else {
              // If sets is a number, use the plan number
              const setsCount = exercise.sets || 3;
              totalSets += setsCount;

              // For completed workouts/exercises, assume all sets are completed
              if (
                day.workoutStatus === "completed" ||
                exercise.exerciseCompleted
              ) {
                completedSets += setsCount;
                completedExercises++;
              }
            }
          });
        }
      });

      return { totalSets, completedSets, totalExercises, completedExercises };
    }

    // Fallback to workoutSession data
    if (!isWorkoutDataInitialized()) {
      return {
        totalSets: 0,
        completedSets: 0,
        totalExercises: 0,
        completedExercises: 0,
      };
    }

    let totalSets = 0;
    let completedSets = 0;
    let totalExercises = 0;
    let completedExercises = 0;

    Object.keys(workoutData).forEach((dayIdx) => {
      const dayData = workoutData[dayIdx];
      if (dayData && dayData.exercises) {
        Object.keys(dayData.exercises).forEach((exerciseIdx) => {
          const exerciseData = dayData.exercises[exerciseIdx];

          if (
            exerciseData &&
            exerciseData.sets &&
            Array.isArray(exerciseData.sets)
          ) {
            totalExercises++;
            const exerciseCompleted = exerciseData.sets.filter(
              (set) => set && set.completed
            ).length;
            totalSets += exerciseData.sets.length;
            completedSets += exerciseCompleted;

            if (exerciseCompleted === exerciseData.sets.length) {
              completedExercises++;
            }
          }
        });
      }
    });

    return { totalSets, completedSets, totalExercises, completedExercises };
  };

  const addSet = (dayIdx, exerciseIdx) => {
    setWorkoutData((prev) => {
      if (!prev || typeof prev !== "object") {
        prev = {};
      }

      const dayData = prev[dayIdx] || {
        status: "unlocked",
        startedAt: null,
        completedAt: null,
        totalTimeSpent: 0,
        attempts: 0,
        exercises: {},
      };

      if (!dayData.exercises || typeof dayData.exercises !== "object") {
        dayData.exercises = {};
      }

      const exerciseData = dayData.exercises[exerciseIdx] || {
        sets: [],
        exerciseNotes: "",
        completed: false,
      };

      if (!Array.isArray(exerciseData.sets)) {
        exerciseData.sets = [];
      }

      // Get exercise template from plan for defaults
      let targetReps = 10;
      let restTime = 60;

      if (
        plan &&
        plan.schedule &&
        plan.schedule[dayIdx] &&
        plan.schedule[dayIdx].exercises &&
        plan.schedule[dayIdx].exercises[exerciseIdx]
      ) {
        const exerciseTemplate = plan.schedule[dayIdx].exercises[exerciseIdx];
        targetReps = exerciseTemplate.reps || 10;
        restTime = exerciseTemplate.rest || 60;
      }

      const newSetNumber = exerciseData.sets.length + 1;

      const newSet = {
        setNumber: newSetNumber,
        weight: "",
        reps: targetReps.toString(),
        completed: false,
        notes: "",
        completedAt: null,
        restTime: restTime,
        actualRestTime: null,
      };

      try {
        const updatedData = {
          ...prev,
          [dayIdx]: {
            ...dayData,
            exercises: {
              ...dayData.exercises,
              [exerciseIdx]: {
                ...exerciseData,
                sets: [...exerciseData.sets, newSet],
              },
            },
          },
        };

        return updatedData;
      } catch {
        return prev;
      }
    });
  };

  const removeSet = (dayIdx, exerciseIdx) => {
    setWorkoutData((prev) => {
      const dayData = prev[dayIdx];
      const exerciseData = dayData?.exercises?.[exerciseIdx];

      // Check workout data instead of plan data
      if (
        !exerciseData ||
        !exerciseData.sets ||
        exerciseData.sets.length <= 1
      ) {
        return prev; // Don't remove if only one set or no sets
      }

      // Remove the last set and renumber remaining sets
      const updatedSets = exerciseData.sets.slice(0, -1).map((set, index) => ({
        ...set,
        setNumber: index + 1,
      }));

      return {
        ...prev,
        [dayIdx]: {
          ...dayData,
          exercises: {
            ...dayData.exercises,
            [exerciseIdx]: {
              ...exerciseData,
              sets: updatedSets,
            },
          },
        },
      };
    });
  };

  const updateWorkoutDataAfterExerciseChange = (
    dayIdx,
    exerciseIdx,
    exercise
  ) => {
    setWorkoutData((prev) => {
      const dayData = prev[dayIdx] || { exercises: {} };
      const existingExerciseData = dayData.exercises[exerciseIdx];

      // If we have existing exercise data, preserve completed sets
      if (existingExerciseData && existingExerciseData.sets) {
        const existingSets = existingExerciseData.sets;
        const newSetsCount = exercise.sets || 3;

        // Adjust sets array to match new sets count
        let adjustedSets;
        if (existingSets.length === newSetsCount) {
          // Same number of sets, keep all existing data
          adjustedSets = existingSets.map((set) => ({
            ...set,
            reps: set.completed
              ? set.reps
              : exercise.reps?.toString() || set.reps || "10",
            restTime: exercise.rest || set.restTime || 60,
          }));
        } else if (existingSets.length > newSetsCount) {
          // Fewer sets needed, keep first N sets
          adjustedSets = existingSets.slice(0, newSetsCount).map((set) => ({
            ...set,
            reps: set.completed
              ? set.reps
              : exercise.reps?.toString() || set.reps || "10",
            restTime: exercise.rest || set.restTime || 60,
          }));
        } else {
          // More sets needed, keep existing and add new ones
          adjustedSets = [
            ...existingSets.map((set) => ({
              ...set,
              reps: set.completed
                ? set.reps
                : exercise.reps?.toString() || set.reps || "10",
              restTime: exercise.rest || set.restTime || 60,
            })),
            // Add new empty sets
            ...Array.from(
              { length: newSetsCount - existingSets.length },
              (_, idx) => ({
                setNumber: existingSets.length + idx + 1,
                weight: "",
                reps: exercise.reps?.toString() || "10",
                completed: false,
                notes: "",
                completedAt: null,
                restTime: exercise.rest || 60,
                actualRestTime: null,
              })
            ),
          ];
        }

        return {
          ...prev,
          [dayIdx]: {
            ...dayData,
            exercises: {
              ...dayData.exercises,
              [exerciseIdx]: {
                ...existingExerciseData,
                sets: adjustedSets,
              },
            },
          },
        };
      } else {
        // No existing data, create fresh
        const newExercises = { ...dayData.exercises };

        newExercises[exerciseIdx] = {
          sets: Array.from({ length: exercise.sets || 3 }, (_, idx) => ({
            setNumber: idx + 1,
            weight: "",
            reps: exercise.reps?.toString() || "10",
            completed: false,
            notes: "",
            completedAt: null,
            restTime: exercise.rest || 60,
            actualRestTime: null,
          })),
          exerciseNotes: "",
          completed: false,
        };

        return {
          ...prev,
          [dayIdx]: {
            ...dayData,
            exercises: newExercises,
          },
        };
      }
    });
  };

  const updateWorkoutDataAfterRemoveExercise = (dayIdx, exerciseIdx) => {
    setWorkoutData((prev) => {
      const dayData = prev[dayIdx] || { exercises: {} };
      const newExercises = { ...dayData.exercises };
      delete newExercises[exerciseIdx];

      // Re-index keys to match new exercise indices
      const reindexed = {};
      Object.keys(newExercises)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((oldIdx, i) => {
          reindexed[i] = newExercises[oldIdx];
        });

      return {
        ...prev,
        [dayIdx]: {
          ...dayData,
          exercises: reindexed,
        },
      };
    });
  };

  const addNewDayWorkoutData = (dayIndex, exercises) => {
    setWorkoutData((prev) => {
      const newExercises = {};
      exercises.forEach((exercise, idx) => {
        newExercises[idx] = {
          sets: Array.from({ length: exercise.sets || 3 }, (_, setIdx) => ({
            setNumber: setIdx + 1,
            weight: "",
            reps: (exercise.reps || 10).toString(),
            completed: false,
            notes: "",
            completedAt: null,
            restTime: exercise.rest || 60,
            actualRestTime: null,
          })),
          exerciseNotes: "",
          completed: false,
        };
      });

      return {
        ...prev,
        [dayIndex]: {
          status: "locked",
          startedAt: null,
          completedAt: null,
          totalTimeSpent: 0,
          attempts: 0,
          exercises: newExercises,
        },
      };
    });
  };

  const updateWorkoutDataAfterRepsChange = (dayIdx, exerciseIdx, newReps) => {
    setWorkoutData((prev) => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        exercises: {
          ...prev[dayIdx].exercises,
          [exerciseIdx]: {
            ...prev[dayIdx].exercises[exerciseIdx],
            sets: prev[dayIdx].exercises[exerciseIdx].sets.map((set) => ({
              ...set,
              // Only update reps for non-completed sets
              reps: set.completed ? set.reps : newReps?.toString() || set.reps,
            })),
          },
        },
      },
    }));
  };

  return {
    // State
    currentDayIndex,
    setCurrentDayIndex,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    currentSet,
    setCurrentSet,
    workoutData,
    setWorkoutData,
    restTimer,
    isResting,
    setIsResting,
    sessionStartTime,
    isWorkoutStarted,
    setIsWorkoutStarted,

    // Computed values
    getCurrentDay,
    getCurrentExercise,
    getCurrentExerciseData,
    getSessionDuration,
    getSessionDurationInSeconds,
    getCompletedSets,
    getDayProgress,
    getExerciseProgress,
    getTotalSessionStats,
    getDayStatus,
    isDayAccessible,

    // Actions
    formatTime,
    updateWorkoutData,
    updateExerciseNotes,
    completeSet,
    undoSet,
    startWorkout,
    endWorkout,
    completeDayWorkout,
    nextExercise,
    prevExercise,
    addSet,
    removeSet,
    updateWorkoutDataAfterExerciseChange,
    updateWorkoutDataAfterRemoveExercise,
    addNewDayWorkoutData,
    updateWorkoutDataAfterRepsChange,
    saveWorkoutProgress,
    loadWorkoutProgress,
  };
}
