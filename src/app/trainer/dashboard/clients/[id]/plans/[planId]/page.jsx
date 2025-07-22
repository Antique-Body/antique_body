"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Button } from "@/components/common/Button";
import { ExerciseLibrarySelector } from "@/components/custom/dashboard/trainer/pages/exercises/components";
import AnatomicalViewer from "@/components/custom/dashboard/trainer/pages/exercises/components/AnatomicalViewer";

const ItemTypes = {
  TRAINING_DAY: "training_day",
  EXERCISE: "exercise",
};

// Draggable Training Day Component
function DraggableTrainingDay({ day, dayIdx, children, plan, setPlan }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TRAINING_DAY,
    item: { index: dayIdx, day },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TRAINING_DAY,
    hover(item, monitor) {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = dayIdx;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveTrainingDay(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const moveTrainingDay = (dragIndex, hoverIndex) => {
    const newSchedule = [...plan.schedule];
    const draggedDay = newSchedule[dragIndex];
    newSchedule.splice(dragIndex, 1);
    newSchedule.splice(hoverIndex, 0, draggedDay);
    setPlan({ ...plan, schedule: newSchedule });
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.6 : 1,
        cursor: isDragging ? "grabbing" : "move",
        transform: isDragging ? "rotate(1deg) scale(1.01)" : "none",
      }}
      className="relative group transition-all duration-200"
    >
      {/* Left side drag indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500/0 via-blue-500/60 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full z-10" />

      {/* Left side drag handle */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <div className="bg-blue-600/90 backdrop-blur-sm rounded-md p-1.5 shadow-md border border-blue-500/30">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag overlay effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500/40 rounded-2xl pointer-events-none" />
      )}

      {children}
    </div>
  );
}

// Draggable Exercise Component
function DraggableExercise({
  exercise,
  exerciseIdx,
  dayIdx,
  children,
  plan,
  setPlan,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EXERCISE,
    item: { exerciseIdx, dayIdx, exercise },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.EXERCISE,
    hover(item, monitor) {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      const dragExerciseIdx = item.exerciseIdx;
      const dragDayIdx = item.dayIdx;
      const hoverExerciseIdx = exerciseIdx;
      const hoverDayIdx = dayIdx;

      if (dragExerciseIdx === hoverExerciseIdx && dragDayIdx === hoverDayIdx) {
        return;
      }
      moveExercise(dragDayIdx, dragExerciseIdx, hoverDayIdx, hoverExerciseIdx);
      item.exerciseIdx = hoverExerciseIdx;
      item.dayIdx = hoverDayIdx;
    },
  });

  const moveExercise = (
    fromDayIdx,
    fromExerciseIdx,
    toDayIdx,
    toExerciseIdx
  ) => {
    const newSchedule = [...plan.schedule];

    if (fromDayIdx === toDayIdx) {
      // Moving within the same day
      const day = { ...newSchedule[fromDayIdx] };
      const exercises = [...day.exercises];
      const draggedExercise = exercises[fromExerciseIdx];

      // Remove from original position
      exercises.splice(fromExerciseIdx, 1);

      // Adjust target index if moving within same array
      const adjustedToIndex =
        fromExerciseIdx < toExerciseIdx ? toExerciseIdx - 1 : toExerciseIdx;

      // Insert at new position
      exercises.splice(adjustedToIndex, 0, draggedExercise);

      newSchedule[fromDayIdx] = { ...day, exercises };
    } else {
      // Moving between different days
      const fromDay = { ...newSchedule[fromDayIdx] };
      const toDay = { ...newSchedule[toDayIdx] };

      const draggedExercise = fromDay.exercises[fromExerciseIdx];

      // Remove from source day
      fromDay.exercises = [...fromDay.exercises];
      fromDay.exercises.splice(fromExerciseIdx, 1);

      // Add to target day
      toDay.exercises = [...toDay.exercises];
      toDay.exercises.splice(toExerciseIdx, 0, draggedExercise);

      newSchedule[fromDayIdx] = fromDay;
      newSchedule[toDayIdx] = toDay;
    }

    setPlan({ ...plan, schedule: newSchedule });
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.6 : 1,
        cursor: isDragging ? "grabbing" : "move",
        transform: isDragging ? "rotate(2deg) scale(1.02)" : "none",
      }}
      className="relative group transition-all duration-200"
    >
      {/* Left side drag indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500/0 via-green-500/60 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full z-10" />

      {/* Left side drag handle */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <div className="bg-green-600/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-green-500/30">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag overlay effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/40 rounded-xl pointer-events-none" />
      )}

      {children}
    </div>
  );
}

export default function TrackPlanPage({ params }) {
  const router = useRouter();
  // Unwrap params for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  const { id, planId } = unwrappedParams;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live tracking state
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutData, setWorkoutData] = useState({});
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [viewMode, setViewMode] = useState("overview"); // 'overview', 'live'
  const [expandedDays, setExpandedDays] = useState(new Set([0]));

  // Exercise editing state
  const [showExerciseLibraryModal, setShowExerciseLibraryModal] =
    useState(false);
  const [pendingAddExerciseDayIdx, setPendingAddExerciseDayIdx] =
    useState(null);
  const [editingExercise, setEditingExercise] = useState(null); // {dayIdx, exerciseIdx} ili null
  const [selectedExercisesForNewDay, setSelectedExercisesForNewDay] = useState(
    []
  ); // For multiple exercise selection
  const [editingDay, setEditingDay] = useState(null); // {dayIdx, name, type, notes} for editing day details
  const [showVideoModal, setShowVideoModal] = useState(false); // For video playback modal
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null); // Current video URL to play

  // Initialize workout data structure
  const initializeWorkoutData = useCallback((planData) => {
    const data = {};
    planData.schedule?.forEach((day, dayIdx) => {
      data[dayIdx] = {};
      day.exercises?.forEach((exercise, exIdx) => {
        data[dayIdx][exIdx] = {
          sets: Array.from({ length: exercise.sets }, () => ({
            weight: "",
            reps: exercise.reps || "",
            completed: false,
            notes: "",
          })),
          exerciseNotes: "",
        };
      });
    });
    return data;
  }, []);

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

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentDay = () => plan?.schedule?.[currentDayIndex];
  const getCurrentExercise = () =>
    getCurrentDay()?.exercises?.[currentExerciseIndex];
  const getCurrentExerciseData = () =>
    workoutData[currentDayIndex]?.[currentExerciseIndex];

  const updateWorkoutData = (dayIdx, exIdx, setIdx, field, value) => {
    setWorkoutData((prev) => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        [exIdx]: {
          ...prev[dayIdx][exIdx],
          sets: prev[dayIdx][exIdx].sets.map((set, idx) =>
            idx === setIdx ? { ...set, [field]: value } : set
          ),
        },
      },
    }));
  };

  const updateExerciseNotes = (dayIdx, exIdx, notes) => {
    setWorkoutData((prev) => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        [exIdx]: {
          ...prev[dayIdx][exIdx],
          exerciseNotes: notes,
        },
      },
    }));
  };

  const completeSet = (setIdx) => {
    updateWorkoutData(
      currentDayIndex,
      currentExerciseIndex,
      setIdx,
      "completed",
      true
    );
    const exercise = getCurrentExercise();
    if (exercise && exercise.rest && setIdx < exercise.sets - 1) {
      setRestTimer(exercise.rest);
      setIsResting(true);
    }
  };

  const startWorkout = () => {
    setIsWorkoutStarted(true);
    setSessionStartTime(new Date());
  };

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

  const getCompletedSets = () => {
    const exerciseData = getCurrentExerciseData();
    if (!exerciseData) return 0;
    return exerciseData.sets.filter((set) => set.completed).length;
  };

  const toggleDayExpansion = (dayIdx) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayIdx)) {
        newSet.delete(dayIdx);
      } else {
        newSet.add(dayIdx);
      }
      return newSet;
    });
  };

  const getDayProgress = (dayIdx) => {
    const dayData = workoutData[dayIdx];
    if (!dayData) return { completed: 0, total: 0, percentage: 0 };

    let completed = 0;
    let total = 0;

    Object.values(dayData).forEach((exerciseData) => {
      exerciseData.sets.forEach((set) => {
        total++;
        if (set.completed) completed++;
      });
    });

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const getExerciseProgress = (dayIdx, exerciseIdx) => {
    const exerciseData = workoutData[dayIdx]?.[exerciseIdx];
    if (!exerciseData) return { completed: 0, total: 0, percentage: 0 };

    const completed = exerciseData.sets.filter((set) => set.completed).length;
    const total = exerciseData.sets.length;

    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const getMuscleGroupColor = (muscleGroup) => {
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
    return (
      colors[lowerCase] || "bg-zinc-900/30 text-zinc-400 border-zinc-700/30"
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      strength: "bg-red-500",
      hiit: "bg-orange-500",
      cardio: "bg-blue-500",
      mobility: "bg-green-500",
      core: "bg-purple-500",
      bodyweight: "bg-yellow-500",
    };
    return colors[type] || "bg-zinc-500";
  };

  const getTotalSessionStats = () => {
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

  // Exercise management functions
  const removeExercise = (dayIdx, exerciseIdx) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.filter(
                (_, eIdx) => eIdx !== exerciseIdx
              ),
            }
          : day
      ),
    }));
    setWorkoutData((prev) => {
      const dayData = prev[dayIdx] || {};
      const newDayData = { ...dayData };
      delete newDayData[exerciseIdx];
      // Re-index keys to match new exercise indices
      const reindexed = {};
      Object.keys(newDayData)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((oldIdx, i) => {
          reindexed[i] = newDayData[oldIdx];
        });
      return {
        ...prev,
        [dayIdx]: reindexed,
      };
    });
  };

  // Add exercise to a day
  const addExercise = (dayIdx, exercise) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: [
                ...day.exercises,
                {
                  ...exercise,
                  sets: exercise.sets || 3,
                  reps: exercise.reps || 10,
                  rest: exercise.rest || 60,
                },
              ],
            }
          : day
      ),
    }));
    setWorkoutData((prev) => {
      const dayData = prev[dayIdx] || {};
      const newIdx =
        plan?.schedule?.[dayIdx]?.exercises?.length ||
        Object.keys(dayData).length ||
        0;
      return {
        ...prev,
        [dayIdx]: {
          ...dayData,
          [newIdx]: {
            sets: Array.from({ length: exercise.sets || 3 }, () => ({
              weight: "",
              reps: exercise.reps || 10,
              completed: false,
              notes: "",
            })),
            exerciseNotes: "",
          },
        },
      };
    });
  };

  // ESC key handler for video modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showVideoModal) {
        setShowVideoModal(false);
        setCurrentVideoUrl(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showVideoModal]);

  // Add new training day
  const addTrainingDay = () => {
    // Clear previous selections and prepare for new day
    setSelectedExercisesForNewDay([]);
    setPendingAddExerciseDayIdx(-1); // Special flag for new day creation
    setShowExerciseLibraryModal(true);
  };

  // Handle multiple exercise selection for new day
  const handleExerciseSelectionForNewDay = (exercise) => {
    setSelectedExercisesForNewDay((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === exercise.id);
      if (existingIndex >= 0) {
        // Remove if already selected
        return prev.filter((e) => e.id !== exercise.id);
      } else {
        // Add if not selected
        return [...prev, exercise];
      }
    });
  };

  // Create new day with selected exercises
  const createNewDayWithSelectedExercises = () => {
    if (selectedExercisesForNewDay.length === 0) return;

    const newDayIndex = plan.schedule.length;
    const newDay = {
      name: `Day ${newDayIndex + 1}`,
      type: "training",
      duration: 60, // Default 60 minutes
      exercises: selectedExercisesForNewDay.map((exercise) => ({
        ...exercise,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
        weight: exercise.weight || "",
        notes: "",
      })),
      notes: "",
    };

    setPlan((prev) => ({
      ...prev,
      schedule: [...prev.schedule, newDay],
    }));

    // Initialize workout data for new exercises
    setWorkoutData((prev) => {
      const newDayData = {};
      selectedExercisesForNewDay.forEach((exercise, idx) => {
        newDayData[idx] = {
          sets: Array.from({ length: exercise.sets || 3 }, () => ({
            weight: "",
            reps: exercise.reps || 10,
            completed: false,
            notes: "",
          })),
          exerciseNotes: "",
        };
      });

      return {
        ...prev,
        [newDayIndex]: newDayData,
      };
    });

    // Expand the new day and close modal
    setExpandedDays((prev) => new Set([...prev, newDayIndex]));
    setSelectedExercisesForNewDay([]);
    setPendingAddExerciseDayIdx(null);
    setShowExerciseLibraryModal(false);
  };

  // Start editing day details
  const startEditingDay = (dayIdx) => {
    const day = plan.schedule[dayIdx];
    setEditingDay({
      dayIdx,
      name: day.name,
      type: day.type,
      notes: day.notes || "",
      duration: day.duration || 60,
    });
  };

  // Save day details
  const saveDayDetails = () => {
    if (!editingDay) return;

    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, idx) =>
        idx === editingDay.dayIdx
          ? {
              ...day,
              name: editingDay.name,
              type: editingDay.type,
              notes: editingDay.notes,
              duration: parseInt(editingDay.duration) || 60,
            }
          : day
      ),
    }));

    setEditingDay(null);
  };

  // Cancel editing day
  const cancelEditingDay = () => {
    setEditingDay(null);
  };

  // Replace exercise in a day
  const replaceExercise = (dayIdx, exerciseIdx, newExercise) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIdx) =>
                eIdx === exerciseIdx ? newExercise : exercise
              ),
            }
          : day
      ),
    }));
    setWorkoutData((prev) => {
      const dayData = prev[dayIdx] || {};
      const newDayData = { ...dayData };
      delete newDayData[exerciseIdx];
      const newIdx =
        plan?.schedule?.[dayIdx]?.exercises?.length ||
        Object.keys(newDayData).length ||
        0;
      return {
        ...prev,
        [dayIdx]: {
          ...newDayData,
          [newIdx]: {
            sets: Array.from({ length: newExercise.sets || 3 }, () => ({
              weight: "",
              reps: newExercise.reps || 10,
              completed: false,
              notes: "",
            })),
            exerciseNotes: "",
          },
        },
      };
    });
  };

  // Warmup description handler
  const updateWarmupDescription = (dayIdx, value) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx ? { ...day, warmupDescription: value } : day
      ),
    }));
  };

  const addSet = (dayIdx, exerciseIdx) => {
    // Update plan
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIdx) =>
                eIdx === exerciseIdx
                  ? {
                      ...exercise,
                      sets: (exercise.sets || 0) + 1,
                    }
                  : exercise
              ),
            }
          : day
      ),
    }));

    // Update workout data
    setWorkoutData((prev) => {
      const dayData = prev[dayIdx] || {};
      const exerciseData = dayData[exerciseIdx] || {
        sets: [],
        exerciseNotes: "",
      };
      return {
        ...prev,
        [dayIdx]: {
          ...dayData,
          [exerciseIdx]: {
            ...exerciseData,
            sets: [
              ...(exerciseData.sets || []),
              {
                weight: "",
                reps:
                  plan?.schedule?.[dayIdx]?.exercises?.[exerciseIdx]?.reps ||
                  "",
                completed: false,
                notes: "",
              },
            ],
          },
        },
      };
    });
  };

  const removeSet = (dayIdx, exerciseIdx) => {
    const currentSets =
      plan?.schedule?.[dayIdx]?.exercises?.[exerciseIdx]?.sets;
    if (!currentSets || currentSets <= 1) return; // Don't allow removing the last set

    // Update plan
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIdx) =>
                eIdx === exerciseIdx
                  ? {
                      ...exercise,
                      sets: exercise.sets - 1,
                    }
                  : exercise
              ),
            }
          : day
      ),
    }));

    // Update workout data
    setWorkoutData((prev) => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        [exerciseIdx]: {
          ...prev[dayIdx][exerciseIdx],
          sets: prev[dayIdx][exerciseIdx].sets.slice(0, -1), // Remove last set
        },
      },
    }));
  };

  const updateExerciseParams = (dayIdx, exerciseIdx, field, value) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIdx) =>
                eIdx === exerciseIdx
                  ? {
                      ...exercise,
                      [field]: value,
                    }
                  : exercise
              ),
            }
          : day
      ),
    }));

    // If reps changed, update all sets in workout data
    if (field === "reps") {
      setWorkoutData((prev) => ({
        ...prev,
        [dayIdx]: {
          ...prev[dayIdx],
          [exerciseIdx]: {
            ...prev[dayIdx][exerciseIdx],
            sets: prev[dayIdx][exerciseIdx].sets.map((set) => ({
              ...set,
              reps: set.completed ? set.reps : value, // Only update uncompleted sets
            })),
          },
        },
      }));
    }
  };

  useEffect(() => {
    async function fetchPlan() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/coaching-requests/${id}/assigned-training-plans`
        );
        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.error || "Failed to fetch plan");
        const assigned = data.data.find((p) => p.id === planId);
        if (!assigned) throw new Error("Plan not found");
        setPlan(assigned.planData);
        setWorkoutData(initializeWorkoutData(assigned.planData));
      } catch (err) {
        setError(err.message || "Failed to load plan");
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [id, planId, initializeWorkoutData]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Loading Training Plan
          </h3>
          <p className="text-zinc-400">Preparing your workout schedule...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center bg-zinc-900/80 backdrop-blur rounded-2xl p-8 border border-red-500/20">
          <Icon
            icon="mdi:alert-circle"
            width={48}
            height={48}
            className="text-red-400 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-white mb-2">
            Unable to Load Plan
          </h3>
          <p className="text-red-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="secondary"
            className="bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30"
          >
            Try Again
          </Button>
        </div>
      </div>
    );

  if (!plan)
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center bg-zinc-900/80 backdrop-blur rounded-2xl p-8 border border-zinc-700/50">
          <Icon
            icon="mdi:file-search"
            width={48}
            height={48}
            className="text-zinc-400 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-white mb-2">
            Plan Not Found
          </h3>
          <p className="text-zinc-400 mb-4">
            The training plan you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    );

  const currentDay = getCurrentDay();
  const currentExercise = getCurrentExercise();
  const currentExerciseData = getCurrentExerciseData();
  const sessionStats = getTotalSessionStats();

  // Helper to convert YouTube URLs to embed URLs
  function getYouTubeEmbedUrl(url) {
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Enhanced Header with Breadcrumb */}
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-700/50 p-6 mb-6 shadow-2xl">
            {/* Breadcrumb Navigation */}
            <div className="mb-4 hidden sm:block">
              <nav className="flex items-center gap-2 text-sm flex-wrap">
                <button
                  onClick={() => router.push("/trainer/dashboard")}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Icon icon="mdi:view-dashboard" width={16} height={16} />
                  Dashboard
                </button>
                <Icon
                  icon="mdi:chevron-right"
                  width={16}
                  height={16}
                  className="text-zinc-600"
                />
                <button
                  onClick={() =>
                    router.push(`/trainer/dashboard/clients/${id}`)
                  }
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Icon icon="mdi:account" width={16} height={16} />
                  Client Profile
                </button>
                <Icon
                  icon="mdi:chevron-right"
                  width={16}
                  height={16}
                  className="text-zinc-600"
                />
                <span className="text-blue-400 font-medium flex items-center gap-1">
                  <Icon icon="mdi:dumbbell" width={16} height={16} />
                  Training Plan
                </span>
              </nav>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => router.back()}
                    leftIcon={
                      <Icon icon="mdi:arrow-left" width={18} height={18} />
                    }
                    className="bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur"
                    size="small"
                  >
                    Back
                  </Button>
                  <div className="h-8 w-px bg-zinc-700"></div>
                </div>

                <div className="flex items-center gap-4">
                  {plan.coverImage && (
                    <div className="relative">
                      <Image
                        src={plan.coverImage}
                        alt={plan.title}
                        className="w-16 h-16 object-cover rounded-xl border border-zinc-600/50 shadow-lg"
                        width={64}
                        height={64}
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                        <Icon
                          icon="mdi:weight-lifter"
                          width={12}
                          height={12}
                          className="text-white"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {plan.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Icon icon="mdi:calendar" width={16} height={16} />
                        {plan.duration} {plan.durationType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon="mdi:star" width={16} height={16} />
                        {plan.difficultyLevel}
                      </span>
                      {plan.price && (
                        <span className="flex items-center gap-1">
                          <Icon
                            icon="mdi:currency-usd"
                            width={16}
                            height={16}
                          />
                          ${plan.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-4">
                <div className="flex bg-zinc-800/50 rounded-lg p-1">
                  {[
                    {
                      key: "overview",
                      label: "Overview",
                      icon: "mdi:view-dashboard",
                    },
                    { key: "live", label: "Live", icon: "mdi:play-circle" },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => setViewMode(mode.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === mode.key
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                      }`}
                    >
                      <Icon icon={mode.icon} width={16} height={16} />
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Session Timer */}
                <div className="text-right bg-zinc-800/30 rounded-lg px-4 py-3">
                  <div className="text-white text-xl font-mono font-bold">
                    {isWorkoutStarted ? getSessionDuration() : "00:00"}
                  </div>
                  <div className="text-zinc-400 text-xs">Session Time</div>
                </div>
              </div>
            </div>

            {/* Global Progress Bar */}
            {sessionStats.totalSets > 0 && (
              <div className="mt-6 pt-4 border-t border-zinc-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">
                    Overall Progress
                  </span>
                  <span className="text-sm text-white">
                    {sessionStats.completedSets}/{sessionStats.totalSets} sets
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        (sessionStats.completedSets / sessionStats.totalSets) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Overview Mode */}
          {viewMode === "overview" && (
            <div className="space-y-6">
              {/* Enhanced Header with Clear Actions */}
              <div className="bg-zinc-800/30 backdrop-blur rounded-2xl p-6 mb-8 border border-zinc-700/30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left - Title and Instructions */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
                      <Icon
                        icon="mdi:format-list-bulleted"
                        className="text-blue-400"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Training Schedule
                      </h2>
                      <p className="text-sm text-zinc-400">
                        Organize your training days • Drag to reorder • Click to
                        expand
                      </p>
                    </div>
                  </div>

                  {/* Right - Action Buttons */}
                  <div className="flex items-center gap-3">
                    {/* Quick Start Button */}
                    <Button
                      onClick={() => setViewMode("live")}
                      variant="secondary"
                      className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300"
                      leftIcon={<Icon icon="mdi:play" width={18} height={18} />}
                    >
                      Start Workout
                    </Button>

                    {/* Primary Action - Add Training Day */}
                    <Button
                      onClick={addTrainingDay}
                      variant="primary"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                      leftIcon={
                        <Icon icon="mdi:plus-circle" width={20} height={20} />
                      }
                    >
                      Add Training Day
                    </Button>
                  </div>
                </div>

                {/* Enhanced Help Section */}
                <div className="mt-4 space-y-3">
                  {/* Quick Tips */}
                  <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <Icon icon="mdi:lightbulb" width={16} height={16} />
                      <span className="text-sm font-medium">Quick Tips:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-200">
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:drag" width={14} height={14} />
                        <span>Hover to see drag handles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:mouse" width={14} height={14} />
                        <span>Click day headers to expand</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:keyboard" width={14} height={14} />
                        <span>Use keyboard for quick actions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:gesture-tap" width={14} height={14} />
                        <span>Double-click to edit values</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      icon="mdi:calendar-clock"
                      className="text-blue-400"
                      width={24}
                      height={24}
                    />
                    <span className="text-blue-200 font-medium">
                      Total Days
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {plan.schedule?.length || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      icon="mdi:dumbbell"
                      className="text-green-400"
                      width={24}
                      height={24}
                    />
                    <span className="text-green-200 font-medium">
                      Total Exercises
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {sessionStats.totalExercises}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      icon="mdi:counter"
                      className="text-purple-400"
                      width={24}
                      height={24}
                    />
                    <span className="text-purple-200 font-medium">
                      Total Sets
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {sessionStats.totalSets}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 rounded-xl p-6 border border-orange-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon
                      icon="mdi:chart-line"
                      className="text-orange-400"
                      width={24}
                      height={24}
                    />
                    <span className="text-orange-200 font-medium">
                      Completed
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {sessionStats.completedSets}
                  </div>
                </div>
              </div>

              {/* Training Days */}
              <div className="space-y-6">
                {plan.schedule?.map((day, dayIdx) => {
                  const dayProgress = getDayProgress(dayIdx);
                  const isExpanded = expandedDays.has(dayIdx);
                  const isRestDay = day.type === "rest";

                  return (
                    <DraggableTrainingDay
                      key={dayIdx}
                      day={day}
                      dayIdx={dayIdx}
                      plan={plan}
                      setPlan={setPlan}
                    >
                      <div
                        className={
                          `backdrop-blur rounded-2xl overflow-hidden shadow-xl border transition-all duration-200 ` +
                          (isRestDay
                            ? "bg-gradient-to-br from-purple-900/40 via-indigo-900/50 to-blue-900/40 border-purple-500/40 shadow-purple-500/20"
                            : "bg-zinc-900/60 border-zinc-700/50 hover:border-zinc-600/70 hover:bg-zinc-800/70")
                        }
                      >
                        {/* Day Header */}
                        <div
                          onClick={() => {
                            if (!isRestDay) toggleDayExpansion(dayIdx);
                          }}
                          className={
                            `p-6 transition-all ` +
                            (isRestDay
                              ? "cursor-not-allowed bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 hover:from-purple-600/30 hover:via-indigo-600/30 hover:to-blue-600/30"
                              : "cursor-pointer hover:bg-zinc-800/50")
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-3 h-12 rounded-full ${getTypeColor(
                                  day.type
                                )}`}
                              />
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                    dayProgress.percentage === 100
                                      ? "bg-green-500"
                                      : dayProgress.percentage > 0
                                      ? "bg-blue-500"
                                      : "bg-zinc-600"
                                  }`}
                                >
                                  {dayIdx + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    {editingDay?.dayIdx === dayIdx ? (
                                      // Editing mode
                                      <div className="flex items-center gap-2 flex-1">
                                        <input
                                          type="text"
                                          value={editingDay.name}
                                          onChange={(e) =>
                                            setEditingDay({
                                              ...editingDay,
                                              name: e.target.value,
                                            })
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              saveDayDetails();
                                            } else if (e.key === "Escape") {
                                              cancelEditingDay();
                                            }
                                          }}
                                          className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1 text-white text-xl font-bold focus:outline-none focus:border-blue-500"
                                          autoFocus
                                        />
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={saveDayDetails}
                                            className="p-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                          >
                                            <Icon
                                              icon="mdi:check"
                                              width={14}
                                              height={14}
                                              className="text-white"
                                            />
                                          </button>
                                          <button
                                            onClick={cancelEditingDay}
                                            className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                          >
                                            <Icon
                                              icon="mdi:close"
                                              width={14}
                                              height={14}
                                              className="text-white"
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      // Display mode
                                      <>
                                        <h3 className="text-xl font-bold text-white">
                                          {day.name}
                                        </h3>
                                        <button
                                          onClick={() =>
                                            startEditingDay(dayIdx)
                                          }
                                          className="p-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                          title="Edit day details"
                                        >
                                          <Icon
                                            icon="mdi:pencil"
                                            width={14}
                                            height={14}
                                            className="text-zinc-300"
                                          />
                                        </button>
                                      </>
                                    )}
                                    {isRestDay && !editingDay && (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/90 to-indigo-600/90 text-white border border-purple-400/30 shadow-md backdrop-blur-sm">
                                        <Icon
                                          icon="mdi:sleep"
                                          width={14}
                                          height={14}
                                        />
                                        REST
                                      </span>
                                    )}
                                  </div>
                                  {!isRestDay && (
                                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                                      <span className="flex items-center gap-1">
                                        <Icon
                                          icon="mdi:clock"
                                          width={14}
                                          height={14}
                                        />
                                        {editingDay?.dayIdx === dayIdx ? (
                                          <div className="flex items-center gap-1">
                                            <input
                                              type="number"
                                              value={editingDay.duration}
                                              onChange={(e) =>
                                                setEditingDay({
                                                  ...editingDay,
                                                  duration: e.target.value,
                                                })
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  saveDayDetails();
                                                } else if (e.key === "Escape") {
                                                  cancelEditingDay();
                                                }
                                              }}
                                              className="bg-zinc-800 border border-zinc-600 rounded px-2 py-0.5 text-white text-sm w-16 focus:outline-none focus:border-blue-500"
                                              min="1"
                                              max="999"
                                            />
                                            <span>min</span>
                                          </div>
                                        ) : (
                                          `${day.duration} min`
                                        )}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Icon
                                          icon="mdi:dumbbell"
                                          width={14}
                                          height={14}
                                        />
                                        {day.exercises?.length || 0} exercises
                                      </span>
                                      {editingDay?.dayIdx === dayIdx ? (
                                        <select
                                          value={editingDay.type}
                                          onChange={(e) =>
                                            setEditingDay({
                                              ...editingDay,
                                              type: e.target.value,
                                            })
                                          }
                                          className="bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                                        >
                                          <option value="strength">
                                            STRENGTH
                                          </option>
                                          <option value="hiit">HIIT</option>
                                          <option value="cardio">CARDIO</option>
                                          <option value="training">
                                            TRAINING
                                          </option>
                                        </select>
                                      ) : (
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                            day.type === "strength"
                                              ? "bg-red-900/30 text-red-400 border-red-700/30"
                                              : day.type === "hiit"
                                              ? "bg-orange-900/30 text-orange-400 border-orange-700/30"
                                              : day.type === "cardio"
                                              ? "bg-blue-900/30 text-blue-400 border-blue-700/30"
                                              : "bg-green-900/30 text-green-400 border-green-700/30"
                                          }`}
                                        >
                                          {day.type.toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Edit notes section */}
                                  {editingDay?.dayIdx === dayIdx && (
                                    <div className="mt-3 border-t border-zinc-700 pt-3">
                                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Notes / Description:
                                      </label>
                                      <textarea
                                        value={editingDay.notes}
                                        onChange={(e) =>
                                          setEditingDay({
                                            ...editingDay,
                                            notes: e.target.value,
                                          })
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Escape") {
                                            cancelEditingDay();
                                          } else if (
                                            e.key === "Enter" &&
                                            e.ctrlKey
                                          ) {
                                            saveDayDetails();
                                          }
                                        }}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                                        rows="3"
                                        placeholder="Add notes or description for this training day... (Ctrl+Enter to save, Escape to cancel)"
                                      />
                                    </div>
                                  )}

                                  {/* Display notes when not editing */}
                                  {!editingDay && day.notes && (
                                    <div className="mt-2 p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                      <p className="text-sm text-zinc-300">
                                        {day.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              {isRestDay ? (
                                <div className="flex items-center gap-4">
                                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full border-2 border-purple-400/40 flex items-center justify-center shadow-lg">
                                    <Icon
                                      icon="mdi:meditation"
                                      className="text-purple-300"
                                      width={24}
                                      height={24}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-purple-200 text-sm font-medium mb-1">
                                      Recovery & Rest
                                    </div>
                                    <div className="text-purple-300 text-xs">
                                      Let your body recover
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative w-16 h-16">
                                  <svg
                                    className="w-16 h-16 transform -rotate-90"
                                    viewBox="0 0 36 36"
                                  >
                                    <circle
                                      cx="18"
                                      cy="18"
                                      r="16"
                                      fill="none"
                                      stroke="#374151"
                                      strokeWidth="3"
                                    />
                                    <circle
                                      cx="18"
                                      cy="18"
                                      r="16"
                                      fill="none"
                                      stroke={
                                        dayProgress.percentage === 100
                                          ? "#10b981"
                                          : "#3b82f6"
                                      }
                                      strokeWidth="3"
                                      strokeDasharray={`${dayProgress.percentage}, 100`}
                                      className="transition-all duration-500"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {Math.round(dayProgress.percentage)}%
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col gap-2">
                                {/* Start Button - hide if resting or if rest day */}
                                {!isResting &&
                                  day.type !== "rest" &&
                                  day.exercises?.length > 0 && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentDayIndex(dayIdx);
                                        setViewMode("live");
                                        if (!isWorkoutStarted) {
                                          startWorkout();
                                        }
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                                      leftIcon={
                                        <Icon
                                          icon="mdi:play"
                                          width={16}
                                          height={16}
                                        />
                                      }
                                    >
                                      Start
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </div>

                          {/* Day Description */}
                          {day.description && (
                            <p className="text-zinc-400 mt-3 ml-16">
                              {day.description}
                            </p>
                          )}
                        </div>

                        {/* Rest Day Content */}
                        {isRestDay && (
                          <div className="border-t border-purple-700/30 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 px-6 py-2">
                            <div className="flex items-center justify-center gap-6">
                              <div className="flex items-center gap-2 text-purple-200">
                                <Icon
                                  icon="mdi:sleep"
                                  className="text-purple-300"
                                  width={16}
                                  height={16}
                                />
                                <span className="text-xs font-medium">
                                  Sleep
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-indigo-200">
                                <Icon
                                  icon="mdi:water"
                                  className="text-indigo-300"
                                  width={16}
                                  height={16}
                                />
                                <span className="text-xs font-medium">
                                  Hydrate
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-blue-200">
                                <Icon
                                  icon="mdi:meditation"
                                  className="text-blue-300"
                                  width={16}
                                  height={16}
                                />
                                <span className="text-xs font-medium">
                                  Stretch
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expanded Exercises */}
                        {isExpanded && !isRestDay && (
                          <div className="border-t border-zinc-700/50 bg-zinc-800/30">
                            <div className="p-6 space-y-4">
                              {/* Warmup section */}
                              <div className="mb-6">
                                <label className="block text-zinc-300 font-semibold mb-2 text-lg">
                                  Warmup (Warmup)
                                </label>
                                <textarea
                                  className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-20 backdrop-blur focus:border-blue-500 focus:outline-none resize-none"
                                  placeholder="Enter warmup description for this day..."
                                  value={day.warmupDescription ?? ""}
                                  onChange={(e) =>
                                    updateWarmupDescription(
                                      dayIdx,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              {/* Add exercise button */}
                              <div className="mb-4 flex justify-end">
                                <button
                                  className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold shadow"
                                  onClick={() => {
                                    setPendingAddExerciseDayIdx(dayIdx);
                                    setShowExerciseLibraryModal(true);
                                  }}
                                >
                                  <Icon
                                    icon="mdi:plus"
                                    width={18}
                                    height={18}
                                  />
                                  Add Exercise
                                </button>
                              </div>

                              {day.exercises?.map((exercise, exerciseIdx) => {
                                console.log("ACCORDION exercise", exercise);
                                console.log(
                                  "ACCORDION muscleGroups",
                                  exercise.muscleGroups
                                );
                                const exerciseProgress = getExerciseProgress(
                                  dayIdx,
                                  exerciseIdx
                                );

                                return (
                                  <DraggableExercise
                                    key={exerciseIdx}
                                    exercise={exercise}
                                    exerciseIdx={exerciseIdx}
                                    dayIdx={dayIdx}
                                    plan={plan}
                                    setPlan={setPlan}
                                  >
                                    <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-700/30 hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all duration-200">
                                      <div className="flex gap-5">
                                        {/* Enhanced Image/Anatomical Display */}
                                        <div className="flex-shrink-0">
                                          {exercise.imageUrl ? (
                                            <div className="relative group">
                                              <div className="w-28 h-32 rounded-xl overflow-hidden border-2 border-zinc-600/50 shadow-lg bg-zinc-800">
                                                <Image
                                                  src={exercise.imageUrl}
                                                  alt={exercise.name}
                                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                  width={112}
                                                  height={128}
                                                />
                                              </div>
                                              {/* Image overlay with type indicator */}
                                              <div className="absolute top-1 right-1 bg-blue-600/90 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                                                <Icon
                                                  icon="mdi:image"
                                                  className="text-white"
                                                  width={12}
                                                  height={12}
                                                />
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="relative group">
                                              <div className="w-24 h-32 rounded-xl border-2 border-orange-600/50 bg-gradient-to-br from-orange-900/30 to-red-900/30 shadow-lg flex items-center justify-center">
                                                <AnatomicalViewer
                                                  exerciseName={exercise.name}
                                                  muscleGroups={
                                                    exercise.muscleGroups?.map(
                                                      (m) => m.name
                                                    ) || []
                                                  }
                                                  size="small"
                                                  compact
                                                  showExerciseInfo={false}
                                                  showBothViews={false}
                                                  darkMode
                                                  bodyColor="white"
                                                  className="w-20 h-28"
                                                />
                                              </div>
                                              {/* Anatomical overlay with type indicator */}
                                              <div className="absolute top-1 right-1 bg-orange-600/90 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                                                <Icon
                                                  icon="mdi:human"
                                                  className="text-white"
                                                  width={12}
                                                  height={12}
                                                />
                                              </div>
                                              {/* Enhanced muscle group indicator */}
                                              <div className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-sm rounded px-1 py-0.5">
                                                <div className="text-xs text-orange-300 font-medium text-center truncate">
                                                  {exercise.muscleGroups
                                                    ?.length > 0
                                                    ? exercise.muscleGroups[0]?.name?.slice(
                                                        0,
                                                        8
                                                      )
                                                    : "Muscle"}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-semibold text-white">
                                              {exercise.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                              <div className="bg-zinc-800 px-3 py-1 rounded-full text-sm text-zinc-300">
                                                {exerciseProgress.completed}/
                                                {exerciseProgress.total} sets
                                              </div>
                                              <div
                                                className={`w-3 h-3 rounded-full ${
                                                  exerciseProgress.percentage ===
                                                  100
                                                    ? "bg-green-500"
                                                    : exerciseProgress.percentage >
                                                      0
                                                    ? "bg-blue-500"
                                                    : "bg-zinc-600"
                                                }`}
                                              />
                                              {/* Edit Controls */}
                                              <div className="flex items-center gap-1">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingExercise({
                                                      dayIdx,
                                                      exerciseIdx,
                                                    });
                                                    setShowExerciseLibraryModal(
                                                      true
                                                    );
                                                  }}
                                                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-blue-400 transition-colors"
                                                  title="Replace Exercise"
                                                >
                                                  <Icon
                                                    icon="mdi:swap-horizontal"
                                                    width={20}
                                                    height={20}
                                                  />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    addSet(dayIdx, exerciseIdx);
                                                  }}
                                                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-green-400 transition-colors"
                                                  title="Add Set"
                                                >
                                                  <Icon
                                                    icon="mdi:plus"
                                                    width={20}
                                                    height={20}
                                                  />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSet(
                                                      dayIdx,
                                                      exerciseIdx
                                                    );
                                                  }}
                                                  disabled={exercise.sets <= 1}
                                                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                  title="Remove Set"
                                                >
                                                  <Icon
                                                    icon="mdi:minus"
                                                    width={20}
                                                    height={20}
                                                  />
                                                </button>
                                                {/* Remove exercise button */}
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeExercise(
                                                      dayIdx,
                                                      exerciseIdx
                                                    );
                                                  }}
                                                  className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition-colors"
                                                  title="Ukloni vježbu"
                                                >
                                                  <Icon
                                                    icon="mdi:delete"
                                                    width={20}
                                                    height={20}
                                                  />
                                                </button>
                                              </div>
                                            </div>
                                          </div>

                                          <p className="text-zinc-400 text-sm mb-3">
                                            {exercise.instructions}
                                          </p>

                                          <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex gap-3 text-sm">
                                              <div className="bg-zinc-800 px-3 py-1 rounded flex items-center gap-2">
                                                <span className="text-zinc-400">
                                                  Sets:
                                                </span>
                                                <span className="text-white font-medium">
                                                  {exercise.sets}
                                                </span>
                                              </div>
                                              <div className="bg-zinc-800 px-3 py-1 rounded flex items-center gap-2">
                                                <span className="text-zinc-400">
                                                  Reps:
                                                </span>
                                                <input
                                                  type="number"
                                                  value={exercise.reps ?? ""}
                                                  onChange={(e) =>
                                                    updateExerciseParams(
                                                      dayIdx,
                                                      exerciseIdx,
                                                      "reps",
                                                      parseInt(
                                                        e.target.value
                                                      ) || 0
                                                    )
                                                  }
                                                  className="bg-transparent text-white font-medium w-12 text-center border-none outline-none"
                                                  min="1"
                                                />
                                              </div>
                                              <div className="bg-zinc-800 px-3 py-1 rounded flex items-center gap-2">
                                                <span className="text-zinc-400">
                                                  Rest:
                                                </span>
                                                <input
                                                  type="number"
                                                  value={exercise.rest ?? ""}
                                                  onChange={(e) =>
                                                    updateExerciseParams(
                                                      dayIdx,
                                                      exerciseIdx,
                                                      "rest",
                                                      parseInt(
                                                        e.target.value
                                                      ) || 0
                                                    )
                                                  }
                                                  className="bg-transparent text-white font-medium w-12 text-center border-none outline-none"
                                                  min="0"
                                                />
                                                <span className="text-zinc-400">
                                                  s
                                                </span>
                                              </div>
                                            </div>

                                            {exercise.muscleGroups && (
                                              <div className="flex flex-wrap gap-2">
                                                {exercise.muscleGroups.map(
                                                  (muscle, idx) => (
                                                    <span
                                                      key={idx}
                                                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getMuscleGroupColor(
                                                        muscle.name
                                                      )}`}
                                                    >
                                                      {muscle.name}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          </div>

                                          {/* Progress bar for exercise */}
                                          <div className="mt-3">
                                            <div className="w-full bg-zinc-700 rounded-full h-2">
                                              <div
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                  exerciseProgress.percentage ===
                                                  100
                                                    ? "bg-green-500"
                                                    : "bg-blue-500"
                                                }`}
                                                style={{
                                                  width: `${exerciseProgress.percentage}%`,
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </DraggableExercise>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </DraggableTrainingDay>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Mode - Pre-workout */}
          {viewMode === "live" && !isWorkoutStarted && (
            <div className="text-center py-16">
              <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-700/50 p-12 max-w-2xl mx-auto shadow-2xl">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Icon
                      icon="mdi:weight-lifter"
                      className="text-white"
                      width={48}
                      height={48}
                    />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to Train?
                  </h2>
                  <p className="text-xl text-zinc-400 mb-2">
                    {plan.schedule?.[currentDayIndex]?.name}
                  </p>
                  <div className="flex items-center justify-center gap-6 text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Icon icon="mdi:clock" width={18} height={18} />
                      {plan.schedule?.[currentDayIndex]?.duration} minutes
                    </span>
                    <span className="flex items-center gap-2">
                      <Icon icon="mdi:dumbbell" width={18} height={18} />
                      {plan.schedule?.[currentDayIndex]?.exercises?.length ||
                        0}{" "}
                      exercises
                    </span>
                  </div>
                </div>

                {/* Day selector */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Select Training Day
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plan.schedule?.map((day, idx) => {
                      const dayProgress = getDayProgress(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentDayIndex(idx)}
                          className={`p-4 rounded-xl text-left transition-all border-2 ${
                            idx === currentDayIndex
                              ? "bg-blue-600/20 border-blue-500 text-blue-300"
                              : "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{day.name}</span>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                dayProgress.percentage === 100
                                  ? "bg-green-500 text-white"
                                  : dayProgress.percentage > 0
                                  ? "bg-blue-500 text-white"
                                  : "bg-zinc-600 text-zinc-300"
                              }`}
                            >
                              {idx + 1}
                            </div>
                          </div>
                          <div className="text-sm opacity-80">
                            {day.duration}min • {day.exercises?.length || 0}{" "}
                            exercises
                          </div>
                          {dayProgress.total > 0 && (
                            <div className="mt-2 text-xs">
                              Progress: {dayProgress.completed}/
                              {dayProgress.total} sets
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={startWorkout}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl rounded-xl shadow-lg"
                  leftIcon={<Icon icon="mdi:play" width={24} height={24} />}
                >
                  Start Workout
                </Button>
              </div>
            </div>
          )}

          {/* Live Mode - Active workout */}
          {viewMode === "live" && isWorkoutStarted && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Current Exercise */}
              <div className="lg:col-span-2 space-y-6">
                {/* Exercise Header */}
                <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Exercise Progress */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 rounded-full text-white font-semibold shadow-lg">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="mdi:format-list-numbered"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm">
                            Exercise {currentExerciseIndex + 1} of{" "}
                            {currentDay?.exercises?.length || 0}
                          </span>
                        </div>
                      </div>

                      {/* Sets Progress with Visual Progress Bar */}
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 rounded-full text-white font-semibold shadow-lg">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="mdi:progress-check"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm">
                            {getCompletedSets()} / {currentExercise?.sets || 0}{" "}
                            sets
                          </span>
                          {/* Mini progress indicator */}
                          <div className="w-8 h-1.5 bg-white/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  (getCompletedSets() /
                                    (currentExercise?.sets || 1)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Exercise Type with Icon */}
                      <div
                        className={`px-4 py-2.5 rounded-full text-white font-semibold shadow-lg ${
                          currentExercise?.type === "strength"
                            ? "bg-gradient-to-r from-red-500 to-pink-600"
                            : currentExercise?.type === "hiit"
                            ? "bg-gradient-to-r from-orange-500 to-yellow-600"
                            : currentExercise?.type === "cardio"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                            : "bg-gradient-to-r from-purple-500 to-indigo-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={
                              currentExercise?.type === "strength"
                                ? "mdi:dumbbell"
                                : currentExercise?.type === "hiit"
                                ? "mdi:flash"
                                : currentExercise?.type === "cardio"
                                ? "mdi:heart-pulse"
                                : "mdi:fitness"
                            }
                            width={16}
                            height={16}
                          />
                          <span className="text-sm">
                            {currentExercise?.type?.toUpperCase() || "EXERCISE"}
                          </span>
                        </div>
                      </div>

                      {/* Time Indicator if available */}
                      <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 px-4 py-2.5 rounded-full text-zinc-300 font-medium shadow-lg">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="mdi:clock-outline"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm">
                            {currentExercise?.duration
                              ? `${currentExercise.duration}min`
                              : currentExercise?.rest
                              ? `${currentExercise.rest}s rest`
                              : "No limit"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Control Panel */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Video Indicator & Quick Access */}
                      {currentExercise?.videoUrl && (
                        <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 px-3 py-2 rounded-xl">
                          <Icon
                            icon="mdi:video"
                            width={16}
                            height={16}
                            className="text-red-400"
                          />
                          <span className="text-red-300 text-sm font-medium">
                            Video Available
                          </span>
                          <button
                            onClick={() => {
                              setCurrentVideoUrl(currentExercise.videoUrl);
                              setShowVideoModal(true);
                            }}
                            className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded-lg transition-colors"
                          >
                            <Icon
                              icon="mdi:play"
                              width={12}
                              height={12}
                              className="text-white"
                            />
                          </button>
                        </div>
                      )}

                      {/* Set Controls Group */}
                      <div className="flex items-center bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                        <button
                          onClick={() =>
                            removeSet(currentDayIndex, currentExerciseIndex)
                          }
                          disabled={(getCurrentExercise()?.sets || 0) <= 1}
                          className="p-2.5 hover:bg-red-600/20 rounded-l-xl text-red-400 hover:text-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Remove Set"
                        >
                          <Icon
                            icon="mdi:minus-circle"
                            width={18}
                            height={18}
                          />
                        </button>
                        <div className="px-3 py-2 text-white text-sm font-semibold border-x border-zinc-700/50">
                          {currentExercise?.sets || 0} sets
                        </div>
                        <button
                          onClick={() =>
                            addSet(currentDayIndex, currentExerciseIndex)
                          }
                          className="p-2.5 hover:bg-green-600/20 rounded-r-xl text-green-400 hover:text-green-300 transition-colors"
                          title="Add Set"
                        >
                          <Icon icon="mdi:plus-circle" width={18} height={18} />
                        </button>
                      </div>

                      {/* Exercise Navigation */}
                      <div className="flex items-center bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                        <button
                          onClick={prevExercise}
                          disabled={currentExerciseIndex === 0}
                          className="group p-2.5 hover:bg-blue-600/20 rounded-l-xl text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Previous Exercise"
                        >
                          <Icon
                            icon="mdi:chevron-left"
                            width={20}
                            height={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
                        <div className="px-4 py-2 text-white text-sm font-semibold border-x border-zinc-700/50 min-w-[60px] text-center">
                          {currentExerciseIndex + 1}/
                          {currentDay?.exercises?.length || 0}
                        </div>
                        <button
                          onClick={nextExercise}
                          disabled={
                            currentExerciseIndex >=
                            (currentDay?.exercises?.length || 0) - 1
                          }
                          className="group p-2.5 hover:bg-blue-600/20 rounded-r-xl text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Next Exercise"
                        >
                          <Icon
                            icon="mdi:chevron-right"
                            width={20}
                            height={20}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
                      </div>

                      {/* Exercise Management */}
                      <button
                        onClick={() => {
                          setEditingExercise({
                            dayIdx: currentDayIndex,
                            exerciseIdx: currentExerciseIndex,
                          });
                          setShowExerciseLibraryModal(true);
                        }}
                        className="p-2.5 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-xl text-purple-400 hover:text-purple-300 transition-all"
                        title="Replace Exercise"
                      >
                        <Icon
                          icon="mdi:swap-horizontal"
                          width={18}
                          height={18}
                        />
                      </button>

                      {/* Exit Live Mode */}
                      <button
                        onClick={() => setViewMode("overview")}
                        className="p-2.5 bg-orange-600/20 border border-orange-500/30 hover:bg-orange-600/30 rounded-xl text-orange-400 hover:text-orange-300 transition-all"
                        title="Exit Live Mode"
                      >
                        <Icon icon="mdi:exit-to-app" width={18} height={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-8">
                    {/* Clean Media Display */}
                    <div className="flex-shrink-0">
                      {/* Main Visual */}
                      <div className="relative">
                        {currentExercise?.imageUrl ? (
                          <div className="w-48 h-48 rounded-xl overflow-hidden shadow-xl bg-zinc-800">
                            <Image
                              src={currentExercise.imageUrl}
                              alt={currentExercise.name}
                              className="w-full h-full object-cover"
                              width={192}
                              height={192}
                            />
                          </div>
                        ) : (
                          <div className="w-48 h-72 rounded-xl bg-zinc-800 flex items-center justify-center shadow-xl relative overflow-hidden">
                            <div className="w-44 h-80 flex items-center justify-center">
                              <AnatomicalViewer
                                exerciseName={currentExercise?.name}
                                muscleGroups={
                                  currentExercise?.muscleGroups?.map(
                                    (m) => m.name
                                  ) || []
                                }
                                size="large"
                                compact={true}
                                showExerciseInfo={false}
                                showBothViews={false}
                                darkMode
                                bodyColor="white"
                              />
                            </div>
                            {/* Clean overlay label */}
                            <div className="absolute top-2 left-2 bg-orange-600/90 backdrop-blur-sm rounded-md px-2 py-1">
                              <div className="flex items-center gap-1">
                                <Icon
                                  icon="mdi:human"
                                  className="text-white"
                                  width={12}
                                  height={12}
                                />
                                <span className="text-white text-xs font-medium">
                                  ANATOMY
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Video Play Button */}
                        {currentExercise?.videoUrl && (
                          <button
                            onClick={() => {
                              setCurrentVideoUrl(currentExercise.videoUrl);
                              setShowVideoModal(true);
                            }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl"
                          >
                            <div className="bg-red-600 rounded-full p-4 shadow-2xl hover:bg-red-500 transition-colors">
                              <Icon
                                icon="mdi:play"
                                className="text-white"
                                width={32}
                                height={32}
                              />
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Simple Upload Options */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="relative">
                          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-center hover:bg-zinc-800/70 transition-colors cursor-pointer">
                            <Icon
                              icon="mdi:image-plus"
                              width={20}
                              height={20}
                              className="text-blue-400 mx-auto mb-1"
                            />
                            <span className="text-xs text-zinc-300">
                              Add Image
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) =>
                              console.log("Image:", e.target.files[0])
                            }
                          />
                        </div>
                        <div className="relative">
                          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 text-center hover:bg-zinc-800/70 transition-colors cursor-pointer">
                            <Icon
                              icon="mdi:video-plus"
                              width={20}
                              height={20}
                              className="text-purple-400 mx-auto mb-1"
                            />
                            <span className="text-xs text-zinc-300">
                              Add Video
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) =>
                              console.log("Video:", e.target.files[0])
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h2 className="text-3xl font-bold text-white">
                          {currentExercise?.name}
                        </h2>
                        {currentExercise?.videoUrl && (
                          <button
                            onClick={() => {
                              setCurrentVideoUrl(currentExercise.videoUrl);
                              setShowVideoModal(true);
                            }}
                            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 shadow-lg"
                          >
                            <Icon
                              icon="mdi:play-circle"
                              width={20}
                              height={20}
                            />
                            <span>Watch Video</span>
                          </button>
                        )}
                      </div>
                      <p className="text-zinc-400 mb-4 text-lg leading-relaxed">
                        {currentExercise?.instructions}
                      </p>
                      <div className="flex gap-4">
                        <div className="bg-zinc-800/50 px-4 py-3 rounded-xl backdrop-blur">
                          <span className="text-zinc-400 text-sm">
                            Target:{" "}
                          </span>
                          <span className="text-white font-semibold text-lg">
                            {currentExercise?.sets} sets ×{" "}
                            {currentExercise?.reps} reps
                          </span>
                        </div>
                        <div className="bg-zinc-800/50 px-4 py-3 rounded-xl backdrop-blur">
                          <span className="text-zinc-400 text-sm">Rest: </span>
                          <span className="text-white font-semibold text-lg">
                            {currentExercise?.rest}s
                          </span>
                        </div>
                      </div>

                      {/* Muscle Groups */}
                      {currentExercise?.muscleGroups && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {currentExercise.muscleGroups.map((muscle, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getMuscleGroupColor(
                                muscle.name
                              )}`}
                            >
                              {muscle.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Video URL Display */}
                      {currentExercise?.videoUrl && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-700/30 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="bg-red-600 rounded-full p-2 flex-shrink-0">
                              <Icon
                                icon="mdi:video"
                                className="text-white"
                                width={16}
                                height={16}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-red-300 font-semibold">
                                  Tutorial Video
                                </h4>
                                <button
                                  onClick={() => {
                                    setCurrentVideoUrl(
                                      currentExercise.videoUrl
                                    );
                                    setShowVideoModal(true);
                                  }}
                                  className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-1"
                                >
                                  <Icon
                                    icon="mdi:play"
                                    width={14}
                                    height={14}
                                  />
                                  <span>Play Video</span>
                                </button>
                              </div>
                              <div className="text-xs text-red-200/80 font-mono bg-red-900/30 px-3 py-2 rounded-lg border border-red-700/50 truncate">
                                {currentExercise.videoUrl}
                              </div>
                              <p className="text-red-200/70 text-sm mt-2">
                                Watch this video to learn the proper form and
                                technique for this exercise.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Set Tracking */}
                <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Set Tracking
                  </h3>
                  <div className="space-y-4">
                    {currentExerciseData?.sets.map((set, setIdx) => (
                      <div
                        key={setIdx}
                        className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                          set.completed
                            ? "bg-green-900/20 border-green-700/50 shadow-lg"
                            : setIdx === currentSet - 1
                            ? "bg-blue-900/20 border-blue-700/50 shadow-lg"
                            : "bg-zinc-800/50 border-zinc-700/30"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            set.completed ? "bg-green-500" : "bg-zinc-700"
                          }`}
                        >
                          {setIdx + 1}
                        </div>

                        <div className="flex gap-4 flex-1">
                          <div className="flex-1">
                            <label className="block text-xs text-zinc-400 mb-2 font-medium">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              value={set.weight ?? ""}
                              onChange={(e) =>
                                updateWorkoutData(
                                  currentDayIndex,
                                  currentExerciseIndex,
                                  setIdx,
                                  "weight",
                                  e.target.value
                                )
                              }
                              className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white text-lg font-semibold backdrop-blur focus:border-blue-500 focus:outline-none"
                              placeholder="0"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-zinc-400 mb-2 font-medium">
                              Reps
                            </label>
                            <input
                              type="number"
                              value={set.reps ?? ""}
                              onChange={(e) =>
                                updateWorkoutData(
                                  currentDayIndex,
                                  currentExerciseIndex,
                                  setIdx,
                                  "reps",
                                  e.target.value
                                )
                              }
                              className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white text-lg font-semibold backdrop-blur focus:border-blue-500 focus:outline-none"
                              placeholder={
                                currentExercise?.reps?.toString() || "0"
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-zinc-400 mb-2 font-medium">
                              Form Notes
                            </label>
                            <input
                              type="text"
                              value={set.notes ?? ""}
                              onChange={(e) =>
                                updateWorkoutData(
                                  currentDayIndex,
                                  currentExerciseIndex,
                                  setIdx,
                                  "notes",
                                  e.target.value
                                )
                              }
                              className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white backdrop-blur focus:border-blue-500 focus:outline-none"
                              placeholder="Good form, felt strong..."
                            />
                          </div>
                        </div>

                        {set.completed ? (
                          <button
                            onClick={() => {
                              // Undo complete
                              updateWorkoutData(
                                currentDayIndex,
                                currentExerciseIndex,
                                setIdx,
                                "completed",
                                false
                              );
                            }}
                            className="px-8 py-3 rounded-xl font-semibold transition-all text-lg bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl"
                          >
                            <div className="flex items-center gap-2">
                              <Icon icon="mdi:undo" width={20} height={20} />
                              Undo
                            </div>
                          </button>
                        ) : (
                          <button
                            onClick={() => completeSet(setIdx)}
                            className="px-8 py-3 rounded-xl font-semibold transition-all text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                          >
                            Complete Set
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add/Remove Set Controls */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={() =>
                        addSet(currentDayIndex, currentExerciseIndex)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold"
                      leftIcon={<Icon icon="mdi:plus" width={18} height={18} />}
                    >
                      Add Set
                    </Button>
                    <Button
                      onClick={() =>
                        removeSet(currentDayIndex, currentExerciseIndex)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      leftIcon={
                        <Icon icon="mdi:minus" width={18} height={18} />
                      }
                      disabled={currentExercise?.sets <= 1}
                    >
                      Remove Set
                    </Button>
                  </div>

                  {/* Exercise Notes */}
                  <div className="mt-8">
                    <label className="block text-lg font-semibold text-white mb-3">
                      Exercise Notes
                    </label>
                    <textarea
                      value={currentExerciseData?.exerciseNotes ?? ""}
                      onChange={(e) =>
                        updateExerciseNotes(
                          currentDayIndex,
                          currentExerciseIndex,
                          e.target.value
                        )
                      }
                      className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-4 text-white h-32 backdrop-blur focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Overall notes about form, difficulty, adjustments made..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Panel - Session Info */}
              <div className="space-y-6">
                {/* Rest Timer */}
                {isResting && (
                  <div className="bg-gradient-to-br from-orange-900/50 to-red-900/30 border border-orange-700/50 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon
                        icon="mdi:timer"
                        className="text-white"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="text-orange-400 text-sm font-semibold mb-2 tracking-wider">
                      REST TIME
                    </div>
                    <div className="text-white text-5xl font-mono font-bold mb-4">
                      {formatTime(restTimer)}
                    </div>
                    <button
                      onClick={() => {
                        setIsResting(false);
                        setRestTimer(0);
                      }}
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                    >
                      Skip Rest
                    </button>
                  </div>
                )}

                {/* Session Stats */}
                <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon
                      icon="mdi:chart-box"
                      width={20}
                      height={20}
                      className="text-blue-400"
                    />
                    Session Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-400">Duration</span>
                      <span className="text-white font-mono text-lg font-bold">
                        {getSessionDuration()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-400">Current Exercise</span>
                      <span className="text-white font-semibold">
                        {currentExerciseIndex + 1} /{" "}
                        {currentDay?.exercises?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-400">Sets Completed</span>
                      <span className="text-green-400 font-semibold">
                        {getCompletedSets()} / {currentExercise?.sets || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-lg">
                      <span className="text-zinc-400">Overall Progress</span>
                      <span className="text-blue-400 font-semibold">
                        {Math.round(
                          (sessionStats.completedSets /
                            sessionStats.totalSets) *
                            100
                        ) || 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exercise List */}
                <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon
                      icon="mdi:format-list-bulleted"
                      width={20}
                      height={20}
                      className="text-green-400"
                    />
                    Exercises
                  </h3>
                  <div className="space-y-3">
                    {currentDay?.exercises?.map((exercise, idx) => {
                      const exerciseProgress = getExerciseProgress(
                        currentDayIndex,
                        idx
                      );
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCurrentExerciseIndex(idx);
                            setCurrentSet(1);
                          }}
                          className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                            idx === currentExerciseIndex
                              ? "bg-blue-900/30 border-blue-700/50 shadow-lg"
                              : "bg-zinc-800/50 hover:bg-zinc-800/70 border-zinc-700/30 hover:border-zinc-600/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                idx === currentExerciseIndex
                                  ? "bg-blue-600 text-white"
                                  : exerciseProgress.percentage === 100
                                  ? "bg-green-600 text-white"
                                  : "bg-zinc-700 text-zinc-300"
                              }`}
                            >
                              {exerciseProgress.percentage === 100 ? (
                                <Icon icon="mdi:check" width={16} height={16} />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">
                                {exercise.name}
                              </div>
                              <div className="text-zinc-400 text-xs">
                                {exercise.sets} sets × {exercise.reps} reps
                              </div>
                              <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-2">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    exerciseProgress.percentage === 100
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                                  }`}
                                  style={{
                                    width: `${exerciseProgress.percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon
                      icon="mdi:lightning-bolt"
                      width={20}
                      height={20}
                      className="text-yellow-400"
                    />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to finish this workout?"
                          )
                        ) {
                          setIsWorkoutStarted(false);
                          setSessionStartTime(null);
                        }
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
                      leftIcon={<Icon icon="mdi:stop" width={18} height={18} />}
                    >
                      End Workout
                    </Button>
                    <Button
                      onClick={() => {
                        const data = JSON.stringify(workoutData, null, 2);
                        console.log("Workout Data:", data);
                        navigator.clipboard?.writeText(data);
                        alert("Workout data saved to clipboard!");
                      }}
                      variant="secondary"
                      className="w-full py-3 rounded-xl font-semibold"
                      leftIcon={
                        <Icon icon="mdi:content-save" width={18} height={18} />
                      }
                    >
                      Save Progress
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exercise Library Modal */}
          {showExerciseLibraryModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 rounded-2xl p-6 max-w-3xl w-full border border-zinc-700 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {pendingAddExerciseDayIdx === -1
                      ? "Dodajte vježbe koje želite da imate u novom danu"
                      : pendingAddExerciseDayIdx !== null
                      ? "Exercise Library"
                      : "Exercise Library"}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingExercise(null);
                      setPendingAddExerciseDayIdx(null);
                      setSelectedExercisesForNewDay([]);
                      setShowExerciseLibraryModal(false);
                    }}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Icon
                      icon="mdi:close"
                      width={24}
                      height={24}
                      className="text-zinc-400"
                    />
                  </button>
                </div>
                <ExerciseLibrarySelector
                  useStaticData={false}
                  selectedExercises={
                    pendingAddExerciseDayIdx === -1
                      ? selectedExercisesForNewDay
                      : []
                  }
                  onSelectExercise={(exercise) => {
                    if (editingExercise) {
                      replaceExercise(
                        editingExercise.dayIdx,
                        editingExercise.exerciseIdx,
                        exercise
                      );
                      setEditingExercise(null);
                      setShowExerciseLibraryModal(false);
                    } else if (pendingAddExerciseDayIdx === -1) {
                      // Multiple selection mode for new day
                      handleExerciseSelectionForNewDay(exercise);
                    } else if (pendingAddExerciseDayIdx !== null) {
                      addExercise(pendingAddExerciseDayIdx, exercise);
                      setPendingAddExerciseDayIdx(null);
                      setShowExerciseLibraryModal(false);
                    }
                  }}
                  onClearSelection={() => setSelectedExercisesForNewDay([])}
                  onClose={() => {
                    setEditingExercise(null);
                    setPendingAddExerciseDayIdx(null);
                    setSelectedExercisesForNewDay([]);
                    setShowExerciseLibraryModal(false);
                  }}
                />

                {/* Create New Day Button - only show when in new day mode with selections */}
                {pendingAddExerciseDayIdx === -1 &&
                  selectedExercisesForNewDay.length > 0 && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={createNewDayWithSelectedExercises}
                        variant="primary"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        leftIcon={
                          <Icon icon="mdi:plus-circle" width={20} height={20} />
                        }
                      >
                        Kreiraj novi dan sa {selectedExercisesForNewDay.length}{" "}
                        vježb
                        {selectedExercisesForNewDay.length === 1 ? "om" : "ama"}
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Video Modal */}
          {showVideoModal && currentVideoUrl && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 rounded-full p-2">
                      <Icon
                        icon="mdi:play"
                        className="text-white"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Exercise Tutorial
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        {currentExercise?.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowVideoModal(false);
                      setCurrentVideoUrl(null);
                    }}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Icon
                      icon="mdi:close"
                      width={24}
                      height={24}
                      className="text-zinc-400"
                    />
                  </button>
                </div>

                {/* Video Content */}
                <div className="p-6">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={getYouTubeEmbedUrl(currentVideoUrl)}
                      className="w-full aspect-video"
                      allowFullScreen
                      title="Exercise Tutorial"
                      style={{ minHeight: "400px" }}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-4 text-sm text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:target" width={16} height={16} />
                        <span>
                          {currentExercise?.sets} sets × {currentExercise?.reps}{" "}
                          reps
                        </span>
                      </div>
                      {currentExercise?.rest && (
                        <div className="flex items-center gap-2">
                          <Icon icon="mdi:clock" width={16} height={16} />
                          <span>{currentExercise.rest}s rest</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:dumbbell" width={16} height={16} />
                        <span>{currentExercise?.type?.toUpperCase()}</span>
                      </div>
                    </div>
                    {currentExercise?.instructions && (
                      <p className="text-zinc-300 mt-3 text-sm leading-relaxed">
                        {currentExercise.instructions}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
