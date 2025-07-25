import { useCallback, useMemo } from 'react';
import { TrainingPlanManager, normalizeExercise, REPS_UNITS } from '@/utils/exerciseUtils';

/**
 * High-level hook for managing training plan operations
 * Provides abstracted methods for common training plan tasks
 */
export const useTrainingPlanManager = (plan, setPlan) => {
  // Memoized operations to prevent unnecessary re-renders
  const operations = useMemo(() => ({
    /**
     * Updates an exercise parameter
     */
    updateExercise: (dayIndex, exerciseIndex, field, value) => {
      const updatedPlan = TrainingPlanManager.updateExercise(
        plan,
        dayIndex,
        exerciseIndex,
        field,
        value
      );
      setPlan(updatedPlan);
    },

    /**
     * Adds a set to an exercise
     */
    addSet: (dayIndex, exerciseIndex) => {
      const updatedPlan = TrainingPlanManager.addExerciseSet(
        plan,
        dayIndex,
        exerciseIndex
      );
      setPlan(updatedPlan);
    },

    /**
     * Removes a set from an exercise
     */
    removeSet: (dayIndex, exerciseIndex) => {
      const updatedPlan = TrainingPlanManager.removeExerciseSet(
        plan,
        dayIndex,
        exerciseIndex
      );
      setPlan(updatedPlan);
    },

    /**
     * Adds an exercise to a day
     */
    addExercise: (dayIndex, exerciseData) => {
      const normalizedExercise = normalizeExercise(exerciseData);
      setPlan(prev => ({
        ...prev,
        schedule: prev.schedule.map((day, idx) =>
          idx === dayIndex
            ? { ...day, exercises: [...day.exercises, normalizedExercise] }
            : day
        )
      }));
    },

    /**
     * Removes an exercise from a day
     */
    removeExercise: (dayIndex, exerciseIndex) => {
      setPlan(prev => ({
        ...prev,
        schedule: prev.schedule.map((day, idx) =>
          idx === dayIndex
            ? {
                ...day,
                exercises: day.exercises.filter((_, eIdx) => eIdx !== exerciseIndex)
              }
            : day
        )
      }));
    },

    /**
     * Replaces an exercise with a new one
     */
    replaceExercise: (dayIndex, exerciseIndex, newExerciseData) => {
      const normalizedExercise = normalizeExercise(newExerciseData);
      setPlan(prev => ({
        ...prev,
        schedule: prev.schedule.map((day, idx) =>
          idx === dayIndex
            ? {
                ...day,
                exercises: day.exercises.map((exercise, eIdx) =>
                  eIdx === exerciseIndex ? normalizedExercise : exercise
                )
              }
            : day
        )
      }));
    },

    /**
     * Updates day information
     */
    updateDay: (dayIndex, field, value) => {
      setPlan(prev => ({
        ...prev,
        schedule: prev.schedule.map((day, idx) =>
          idx === dayIndex ? { ...day, [field]: value } : day
        )
      }));
    },

    /**
     * Adds a new training day
     */
    addDay: (dayData) => {
      const newDay = {
        id: crypto.randomUUID(),
        day: plan.schedule.length + 1,
        name: dayData.name || `Day ${plan.schedule.length + 1}`,
        type: dayData.type || "strength",
        duration: dayData.duration || 60,
        exercises: dayData.exercises?.map(normalizeExercise) || [],
        isRestDay: dayData.isRestDay || false,
        description: dayData.description || "",
        workoutStatus: "not_started",
      };

      setPlan(prev => ({
        ...prev,
        schedule: [...prev.schedule, newDay]
      }));
    },

    /**
     * Removes a training day
     */
    removeDay: (dayIndex) => {
      setPlan(prev => ({
        ...prev,
        schedule: prev.schedule.filter((_, idx) => idx !== dayIndex)
      }));
    },

    /**
     * Reorders training days
     */
    reorderDays: (fromIndex, toIndex) => {
      setPlan(prev => {
        const newSchedule = [...prev.schedule];
        const [removed] = newSchedule.splice(fromIndex, 1);
        newSchedule.splice(toIndex, 0, removed);
        return { ...prev, schedule: newSchedule };
      });
    },

    /**
     * Bulk operations for multiple exercises
     */
    bulkAddExercises: (dayIndex, exercisesData) => {
      const normalizedExercises = exercisesData.map(normalizeExercise);
      setPlan(prev => ({
        ...prev,
        schedule: prev.schedule.map((day, idx) =>
          idx === dayIndex
            ? { ...day, exercises: [...day.exercises, ...normalizedExercises] }
            : day
        )
      }));
    },

    /**
     * Toggles reps unit for an exercise (reps <-> seconds)
     */
    toggleRepsUnit: (dayIndex, exerciseIndex) => {
      const currentExercise = plan.schedule?.[dayIndex]?.exercises?.[exerciseIndex];
      if (!currentExercise) return;

      const currentUnit = currentExercise.repsUnit || REPS_UNITS.REPS;
      const newUnit = currentUnit === REPS_UNITS.REPS ? REPS_UNITS.SECONDS : REPS_UNITS.REPS;
      
      operations.updateExercise(dayIndex, exerciseIndex, 'repsUnit', newUnit);
    }
  }), [plan, setPlan]);

  // Computed properties
  const computed = useMemo(() => ({
    /**
     * Gets total number of exercises across all days
     */
    totalExercises: plan.schedule?.reduce((total, day) => 
      total + (day.exercises?.length || 0), 0) || 0,

    /**
     * Gets total number of sets across all exercises
     */
    totalSets: plan.schedule?.reduce((total, day) => 
      total + (day.exercises?.reduce((dayTotal, exercise) => {
        const setsCount = Array.isArray(exercise.sets) 
          ? exercise.sets.length 
          : (typeof exercise.sets === 'number' ? exercise.sets : 3);
        return dayTotal + setsCount;
      }, 0) || 0), 0) || 0,

    /**
     * Gets total estimated duration
     */
    totalDuration: plan.schedule?.reduce((total, day) => 
      total + (day.duration || 0), 0) || 0,

    /**
     * Gets completion statistics
     */
    completionStats: {
      completedDays: plan.schedule?.filter(day => day.workoutStatus === 'completed').length || 0,
      totalDays: plan.schedule?.length || 0,
      completionPercentage: plan.schedule?.length 
        ? Math.round((plan.schedule.filter(day => day.workoutStatus === 'completed').length / plan.schedule.length) * 100)
        : 0
    },

    /**
     * Gets exercise distribution by muscle groups
     */
    muscleGroupDistribution: (() => {
      const distribution = {};
      plan.schedule?.forEach(day => {
        day.exercises?.forEach(exercise => {
          exercise.muscleGroups?.forEach(muscle => {
            const muscleName = muscle.name || muscle;
            distribution[muscleName] = (distribution[muscleName] || 0) + 1;
          });
        });
      });
      return distribution;
    })(),

    /**
     * Gets exercises that use seconds instead of reps
     */
    timedExercises: plan.schedule?.flatMap((day, dayIdx) => 
      day.exercises?.map((exercise, exerciseIdx) => ({
        dayIndex: dayIdx,
        exerciseIndex: exerciseIdx,
        exercise
      })).filter(item => item.exercise.repsUnit === REPS_UNITS.SECONDS) || []
    ) || []
  }), [plan]);

  // Validation methods
  const validation = useMemo(() => ({
    /**
     * Validates if a day has required information
     */
    validateDay: (dayIndex) => {
      const day = plan.schedule?.[dayIndex];
      if (!day) return { isValid: false, errors: ['Day not found'] };

      const errors = [];
      if (!day.name?.trim()) errors.push('Day name is required');
      if (!day.duration || day.duration < 1) errors.push('Duration must be at least 1 minute');
      if (!day.isRestDay && (!day.exercises || day.exercises.length === 0)) {
        errors.push('Training day must have at least one exercise');
      }

      return { isValid: errors.length === 0, errors };
    },

    /**
     * Validates if an exercise has required information
     */
    validateExercise: (dayIndex, exerciseIndex) => {
      const exercise = plan.schedule?.[dayIndex]?.exercises?.[exerciseIndex];
      if (!exercise) return { isValid: false, errors: ['Exercise not found'] };

      const errors = [];
      if (!exercise.name?.trim()) errors.push('Exercise name is required');
      if (!exercise.sets || exercise.sets < 1) errors.push('Sets must be at least 1');
      if (!exercise.reps || exercise.reps < 1) errors.push('Reps/seconds must be at least 1');
      if (exercise.rest < 0) errors.push('Rest time cannot be negative');

      return { isValid: errors.length === 0, errors };
    },

    /**
     * Validates the entire training plan
     */
    validatePlan: () => {
      const errors = [];
      
      if (!plan.title?.trim()) errors.push('Plan title is required');
      if (!plan.schedule || plan.schedule.length === 0) {
        errors.push('Plan must have at least one day');
      }

      // Validate each day
      plan.schedule?.forEach((day, dayIdx) => {
        const dayValidation = validation.validateDay(dayIdx);
        if (!dayValidation.isValid) {
          errors.push(`Day ${dayIdx + 1}: ${dayValidation.errors.join(', ')}`);
        }

        // Validate each exercise in the day
        if (!day.isRestDay && day.exercises) {
          day.exercises.forEach((exercise, exerciseIdx) => {
            const exerciseValidation = validation.validateExercise(dayIdx, exerciseIdx);
            if (!exerciseValidation.isValid) {
              errors.push(`Day ${dayIdx + 1}, Exercise ${exerciseIdx + 1}: ${exerciseValidation.errors.join(', ')}`);
            }
          });
        }
      });

      return { isValid: errors.length === 0, errors };
    }
  }), [plan]);

  return {
    // Operations
    ...operations,
    
    // Computed properties
    ...computed,
    
    // Validation
    ...validation,
    
    // Raw plan data (for cases where direct access is needed)
    plan
  };
};

export default useTrainingPlanManager;