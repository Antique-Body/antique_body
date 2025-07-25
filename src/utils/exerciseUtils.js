/**
 * Exercise Management Utilities
 * High-level abstraction for exercise operations across the application
 */

// Constants
export const REPS_UNITS = {
  REPS: "reps",
  SECONDS: "seconds",
};

export const DEFAULT_SECONDS_REPS = 30;

export const DEFAULT_EXERCISE_VALUES = {
  sets: 3,
  reps: 12,
  repsUnit: REPS_UNITS.REPS,
  rest: 60,
  weight: "",
  notes: "",
};

/**
 * Normalizes exercise data to ensure consistent structure
 * @param {Object} exercise - Raw exercise data
 * @returns {Object} Normalized exercise data
 */
export const normalizeExercise = (exercise) => {
  return {
    ...DEFAULT_EXERCISE_VALUES,
    ...exercise,
    // Ensure repsUnit exists
    repsUnit: exercise.repsUnit || REPS_UNITS.REPS,
    // Ensure sets is properly structured
    sets: normalizeExerciseSets(
      exercise.sets,
      exercise.reps || DEFAULT_EXERCISE_VALUES.reps,
      exercise.rest || DEFAULT_EXERCISE_VALUES.rest
    ),
    // Normalize muscle groups
    muscleGroups: normalizeMuscleGroups(exercise.muscleGroups),
  };
};

/**
 * Normalizes exercise sets to ensure consistent structure
 * @param {number|Array} sets - Sets data (can be number or array)
 * @param {number} defaultReps - Default reps value
 * @param {number} defaultRest - Default rest value
 * @returns {Array} Normalized sets array
 */
export const normalizeExerciseSets = (
  sets,
  defaultReps = 12,
  defaultRest = 60
) => {
  if (Array.isArray(sets)) {
    return sets.map((set, index) => ({
      setNumber: index + 1,
      weight: set.weight || "",
      reps: set.reps !== undefined ? set.reps : defaultReps,
      completed: set.completed || false,
      notes: set.notes || "",
      completedAt: set.completedAt || null,
      restTime: set.restTime || defaultRest,
    }));
  }

  const setsCount =
    typeof sets === "number" ? sets : DEFAULT_EXERCISE_VALUES.sets;
  return Array.from({ length: setsCount }, (_, index) => ({
    setNumber: index + 1,
    weight: "",
    reps: defaultReps,
    completed: false,
    notes: "",
    completedAt: null,
    restTime: defaultRest,
  }));
};

/**
 * Normalizes muscle groups to ensure consistent structure
 * @param {Array} muscleGroups - Raw muscle groups data
 * @returns {Array} Normalized muscle groups
 */
export const normalizeMuscleGroups = (muscleGroups) => {
  if (!Array.isArray(muscleGroups)) return [];

  return muscleGroups.map((muscle) => {
    if (typeof muscle === "object" && (muscle.id || muscle.name)) {
      return {
        id: muscle.id || muscle.name,
        name: muscle.name || muscle.id,
      };
    } else if (typeof muscle === "string") {
      return { id: muscle, name: muscle };
    } else {
      // Safer fallback: use 'unknown' for null/undefined, otherwise String(muscle)
      if (muscle === undefined || muscle === null) {
        return { id: "unknown", name: "unknown" };
      }
      return { id: String(muscle), name: String(muscle) };
    }
  });
};

/**
 * Formats display text for reps/seconds
 * @param {number} value - The numeric value
 * @param {string} unit - The unit type ('reps' or 'seconds')
 * @returns {string} Formatted display text
 */
export const formatRepsDisplay = (value, unit = REPS_UNITS.REPS) => {
  if (unit === REPS_UNITS.SECONDS) {
    return `${value} seconds`;
  }
  return `${value} reps`;
};

/**
 * Gets appropriate placeholder text for reps input
 * @param {string} unit - The unit type ('reps' or 'seconds')
 * @returns {string} Placeholder text
 */
export const getRepsPlaceholder = (unit = REPS_UNITS.REPS) => {
  return unit === REPS_UNITS.SECONDS ? String(DEFAULT_SECONDS_REPS) : "12";
};

/**
 * Toggles between reps and seconds unit
 * @param {string} currentUnit - Current unit
 * @returns {string} New unit
 */
export const toggleRepsUnit = (currentUnit) => {
  return currentUnit === REPS_UNITS.REPS ? REPS_UNITS.SECONDS : REPS_UNITS.REPS;
};

/**
 * Exercise operations for training plans
 */
export class ExerciseManager {
  /**
   * Adds a set to an exercise
   * @param {Object} exercise - Exercise object
   * @returns {Object} Updated exercise with new set
   */
  static addSet(exercise) {
    const currentSets = Array.isArray(exercise.sets) ? exercise.sets : [];
    const newSetNumber = currentSets.length + 1;

    const newSet = {
      setNumber: newSetNumber,
      weight: "",
      reps: (exercise.reps || DEFAULT_EXERCISE_VALUES.reps).toString(),
      completed: false,
      notes: "",
      completedAt: null,
      restTime: exercise.rest || DEFAULT_EXERCISE_VALUES.rest,
    };

    return {
      ...exercise,
      sets: [...currentSets, newSet],
    };
  }

  /**
   * Removes a set from an exercise
   * @param {Object} exercise - Exercise object
   * @returns {Object} Updated exercise with removed set
   */
  static removeSet(exercise) {
    const currentSets = Array.isArray(exercise.sets) ? exercise.sets : [];
    if (currentSets.length <= 1) return exercise;

    return {
      ...exercise,
      sets: currentSets.slice(0, -1),
    };
  }

  /**
   * Updates exercise parameters
   * @param {Object} exercise - Exercise object
   * @param {string} field - Field to update
   * @param {any} value - New value
   * @returns {Object} Updated exercise
   */
  static updateParameter(exercise, field, value) {
    // Handle special cases for repsUnit changes
    if (field === "repsUnit") {
      const updatedExercise = { ...exercise, [field]: value };

      // Update placeholder value when switching units
      if (
        value === REPS_UNITS.SECONDS &&
        exercise.reps === DEFAULT_EXERCISE_VALUES.reps
      ) {
        updatedExercise.reps = DEFAULT_SECONDS_REPS;
      } else if (
        value === REPS_UNITS.REPS &&
        exercise.reps === DEFAULT_SECONDS_REPS
      ) {
        updatedExercise.reps = DEFAULT_EXERCISE_VALUES.reps;
      }

      return updatedExercise;
    }

    return {
      ...exercise,
      [field]: value,
    };
  }
}

/**
 * Training plan operations
 */
export class TrainingPlanManager {
  /**
   * Updates an exercise in a training plan
   * @param {Object} plan - Training plan object
   * @param {number} dayIndex - Day index
   * @param {number} exerciseIndex - Exercise index
   * @param {string} field - Field to update
   * @param {any} value - New value
   * @returns {Object} Updated plan
   */
  static updateExercise(plan, dayIndex, exerciseIndex, field, value) {
    const updatedPlan = { ...plan };
    const updatedSchedule = [...updatedPlan.schedule];
    const updatedDay = { ...updatedSchedule[dayIndex] };
    const updatedExercises = [...updatedDay.exercises];
    const updatedExercise = ExerciseManager.updateParameter(
      updatedExercises[exerciseIndex],
      field,
      value
    );

    updatedExercises[exerciseIndex] = updatedExercise;
    updatedDay.exercises = updatedExercises;
    updatedSchedule[dayIndex] = updatedDay;
    updatedPlan.schedule = updatedSchedule;

    return updatedPlan;
  }

  /**
   * Adds a set to an exercise in a training plan
   * @param {Object} plan - Training plan object
   * @param {number} dayIndex - Day index
   * @param {number} exerciseIndex - Exercise index
   * @returns {Object} Updated plan
   */
  static addExerciseSet(plan, dayIndex, exerciseIndex) {
    const updatedPlan = { ...plan };
    const updatedSchedule = [...updatedPlan.schedule];
    const updatedDay = { ...updatedSchedule[dayIndex] };
    const updatedExercises = [...updatedDay.exercises];
    const updatedExercise = ExerciseManager.addSet(
      updatedExercises[exerciseIndex]
    );

    updatedExercises[exerciseIndex] = updatedExercise;
    updatedDay.exercises = updatedExercises;
    updatedSchedule[dayIndex] = updatedDay;
    updatedPlan.schedule = updatedSchedule;

    return updatedPlan;
  }

  /**
   * Removes a set from an exercise in a training plan
   * @param {Object} plan - Training plan object
   * @param {number} dayIndex - Day index
   * @param {number} exerciseIndex - Exercise index
   * @returns {Object} Updated plan
   */
  static removeExerciseSet(plan, dayIndex, exerciseIndex) {
    const updatedPlan = { ...plan };
    const updatedSchedule = [...updatedPlan.schedule];
    const updatedDay = { ...updatedSchedule[dayIndex] };
    const updatedExercises = [...updatedDay.exercises];
    const updatedExercise = ExerciseManager.removeSet(
      updatedExercises[exerciseIndex]
    );

    updatedExercises[exerciseIndex] = updatedExercise;
    updatedDay.exercises = updatedExercises;
    updatedSchedule[dayIndex] = updatedDay;
    updatedPlan.schedule = updatedSchedule;

    return updatedPlan;
  }
}
