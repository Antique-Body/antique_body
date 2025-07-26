// Muscle group color mapping
export const getMuscleGroupColor = (muscleGroup) => {
  if (!muscleGroup || typeof muscleGroup !== "string") {
    return "bg-zinc-900/30 text-zinc-400 border-zinc-700/30";
  }

  const colors = {
    chest: "bg-red-900/30 text-red-400 border-red-700/30",
    back: "bg-green-900/30 text-green-400 border-green-700/30",
    legs: "bg-blue-900/30 text-blue-400 border-blue-700/30",
    shoulders: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
    arms: "bg-purple-900/30 text-purple-400 border-purple-700/30",
    core: "bg-orange-900/30 text-orange-400 border-orange-700/30",
    glutes: "bg-pink-900/30 text-pink-400 border-pink-700/30",
    quadriceps: "bg-indigo-900/30 text-indigo-400 border-indigo-700/30",
    hamstrings: "bg-cyan-900/30 text-cyan-400 border-cyan-700/30",
    calves: "bg-teal-900/30 text-teal-400 border-teal-700/30",
    triceps: "bg-violet-900/30 text-violet-400 border-violet-700/30",
    biceps: "bg-emerald-900/30 text-emerald-400 border-emerald-700/30",
    "full body":
      "bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-300 border-blue-700/30",
  };

  const lowerCase = muscleGroup.toLowerCase();
  return colors[lowerCase] || "bg-zinc-900/30 text-zinc-400 border-zinc-700/30";
};

// Exercise type color mapping
export const getTypeColor = (type) => {
  const colors = {
    strength: "bg-red-500",
    hiit: "bg-orange-500",
    cardio: "bg-blue-500",
    mobility: "bg-green-500",
    core: "bg-purple-500",
    bodyweight: "bg-yellow-500",
    rest: "bg-purple-500",
  };
  if (!type || typeof type !== "string" || !(type in colors)) {
    return "bg-zinc-500";
  }
  return colors[type];
};

// YouTube URL utilities
export function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  // Handle standard YouTube URLs
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  // Already an embed URL or not a YouTube URL
  return url;
}

// Time formatting utilities
export const formatTime = (seconds) => {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  const formatted = `${mins}:${secs.toString().padStart(2, "0")}`;
  return isNegative ? `-${formatted}` : formatted;
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}min` : `${hours}h`;
};

// Drag and drop utilities
export const moveItemInArray = (array, fromIndex, toIndex) => {
  if (
    !Array.isArray(array) ||
    fromIndex < 0 ||
    fromIndex >= array.length ||
    toIndex < 0 ||
    toIndex > array.length ||
    fromIndex === toIndex
  ) {
    return array;
  }
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
};

export const moveItemBetweenArrays = (
  sourceArray,
  targetArray,
  sourceIndex,
  targetIndex
) => {
  if (
    !Array.isArray(sourceArray) ||
    !Array.isArray(targetArray) ||
    sourceIndex < 0 ||
    sourceIndex >= sourceArray.length ||
    targetIndex < 0 ||
    targetIndex > targetArray.length
  ) {
    return {
      source: sourceArray,
      target: targetArray,
    };
  }
  const newSourceArray = [...sourceArray];
  const newTargetArray = [...targetArray];

  const [movedItem] = newSourceArray.splice(sourceIndex, 1);
  newTargetArray.splice(targetIndex, 0, movedItem);

  return {
    source: newSourceArray,
    target: newTargetArray,
  };
};

// Exercise validation utilities
export const validateExercise = (exercise) => {
  const errors = [];

  if (!exercise.name) {
    errors.push("Exercise name is required");
  }

  if (!exercise.sets || exercise.sets < 1) {
    errors.push("Sets must be at least 1");
  }

  if (!exercise.reps || exercise.reps < 1) {
    errors.push("Reps must be at least 1");
  }

  if (exercise.rest !== undefined && exercise.rest < 0) {
    errors.push("Rest time cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Training day validation utilities
export const validateTrainingDay = (day) => {
  const errors = [];

  if (!day.name) {
    errors.push("Day name is required");
  }

  if (!day.type) {
    errors.push("Day type is required");
  }

  if (!day.duration || day.duration < 1) {
    errors.push("Duration must be at least 1 minute");
  }

  if (!day.exercises || day.exercises.length === 0) {
    errors.push("At least one exercise is required");
  }

  // Validate each exercise
  day.exercises?.forEach((exercise, index) => {
    const exerciseValidation = validateExercise(exercise);
    if (!exerciseValidation.isValid) {
      errors.push(
        `Exercise ${index + 1}: ${exerciseValidation.errors.join(", ")}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Progress calculation utilities
export const calculateProgress = (completed, total) => {
  if (total === 0) return { completed: 0, total: 0, percentage: 0 };
  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
};

export const calculateWorkoutProgress = (workoutData) => {
  let totalSets = 0;
  let completedSets = 0;
  let totalExercises = 0;
  let completedExercises = 0;

  Object.keys(workoutData).forEach((dayIdx) => {
    const dayData = workoutData[dayIdx];
    Object.keys(dayData).forEach((exerciseIdx) => {
      totalExercises++;
      const exerciseData = dayData[exerciseIdx];
      const exerciseCompleted = exerciseData.sets.filter(
        (set) => set.completed
      ).length;
      totalSets += exerciseData.sets.length;
      completedSets += exerciseCompleted;

      if (exerciseCompleted === exerciseData.sets.length) {
        completedExercises++;
      }
    });
  });

  return { totalSets, completedSets, totalExercises, completedExercises };
};

// Data transformation utilities
export const createNewTrainingDay = (
  name,
  type = "training",
  duration = 60
) => ({
  name,
  type,
  duration,
  exercises: [],
  notes: "",
  warmupDescription: "",
});

export const createNewExercise = (baseExercise, overrides = {}) => ({
  ...baseExercise,
  sets: baseExercise.sets || 3,
  reps: baseExercise.reps || 10,
  rest: baseExercise.rest || 60,
  weight: baseExercise.weight || "",
  notes: "",
  ...overrides,
});

// Local storage utilities for workout data
export const saveWorkoutToStorage = (planId, workoutData) => {
  try {
    const key = `workout_${planId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        data: workoutData,
        timestamp: Date.now(),
      })
    );
    return true;
  } catch (error) {
    console.error("Failed to save workout data:", error);
    return false;
  }
};

export const loadWorkoutFromStorage = (
  planId,
  expirationMs = 24 * 60 * 60 * 1000
) => {
  try {
    const key = `workout_${planId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = Date.now();
      if (!parsed.timestamp || now - parsed.timestamp > expirationMs) {
        return null;
      }
      return parsed.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to load workout data:", error);
    return null;
  }
};

export const clearWorkoutFromStorage = (planId) => {
  try {
    const key = `workout_${planId}`;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Failed to clear workout data:", error);
    return false;
  }
};

/**
 * Initializes workout data structure from a plan object.
 * @param {Object} planData - The workout plan object.
 * @returns {Object} Initialized workout data structure.
 */
export function initializeWorkoutData(planData) {
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
}
