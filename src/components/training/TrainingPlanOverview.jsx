import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";

import { DraggableExercise } from "./DraggableExercise";
import { DraggableTrainingDay } from "./DraggableTrainingDay";
import { WorkoutReview } from "./WorkoutReview";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import AnatomicalViewer from "@/components/custom/dashboard/trainer/pages/exercises/components/AnatomicalViewer";
import { getMuscleGroupColor } from "@/utils/trainingUtils";

// Helper function to get status-based styling

export function TrainingPlanOverview({
  plan,
  setPlan,
  workoutSession,
  onStartWorkout,
  onAddTrainingDay,
  onShowExerciseLibrary,
  onAddSet,
  onRemoveSet,
  onViewResults,
}) {
  const [expandedDays, setExpandedDays] = useState(new Set([0]));
  const [editingDay, setEditingDay] = useState(null);
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "review"
  const [selectedReviewDay, setSelectedReviewDay] = useState(null);
  const [showWorkoutPreventionModal, setShowWorkoutPreventionModal] =
    useState(false);
  const [preventionMessage, setPreventionMessage] = useState("");

  const { getExerciseProgress, isWorkoutStarted, currentDayIndex } =
    workoutSession;

  // Helper function to get workout status from plan data
  const getWorkoutStatus = (dayIdx) => {
    const day = plan.schedule?.[dayIdx];
    if (!day) return null;

    // PRIORITY 1: Check if this is the currently active workout session
    // BUT if it's already completed, don't override with in_progress
    if (
      isWorkoutStarted &&
      currentDayIndex === dayIdx &&
      day.workoutStatus !== "completed"
    ) {
      return {
        status: "in_progress",
        startedAt: day.workoutStartedAt || new Date().toISOString(),
        completedAt: null,
        endedAt: null,
        duration: day.workoutDuration || 0,
        notes: day.workoutNotes || "",
        wasCompleted: false,
      };
    }

    // PRIORITY 2: Check the workout data structure from plan (MAIN SOURCE OF TRUTH)
    if (day.workoutStatus && day.workoutStatus !== "not_started") {
      return {
        status: day.workoutStatus,
        startedAt: day.workoutStartedAt,
        completedAt: day.workoutCompletedAt,
        endedAt: day.workoutEndedAt,
        duration: day.workoutDuration || 0,
        notes: day.workoutNotes || "",
        wasCompleted: day.workoutWasCompleted || false,
      };
    }

    // PRIORITY 3: Check if workout data exists in workoutSession (fallback)
    const workoutSessionData = workoutSession.workoutData?.[dayIdx];

    if (
      workoutSessionData &&
      workoutSessionData.status &&
      workoutSessionData.status !== "locked"
    ) {
      return {
        status: workoutSessionData.status,
        startedAt: workoutSessionData.startedAt,
        completedAt: workoutSessionData.completedAt,
        endedAt: workoutSessionData.endedAt,
        duration: workoutSessionData.totalTimeSpent || 0,
        notes: workoutSessionData.workoutSummary?.userNotes || "",
        wasCompleted: workoutSessionData.workoutSummary?.wasCompleted || false,
      };
    }

    // PRIORITY 4: Default status for days that haven't been started
    return {
      status: dayIdx === 0 ? "not_started" : "locked",
      startedAt: null,
      completedAt: null,
      endedAt: null,
      duration: 0,
      notes: "",
      wasCompleted: false,
    };
  };

  // Enhanced workout prevention logic
  const handleWorkoutStart = (dayIdx) => {
    // If this is the same day as the current active workout, allow continuing
    if (isWorkoutStarted && currentDayIndex === dayIdx) {
      // This is a "Continue" action - allow it
      onStartWorkout(dayIdx);
      return;
    }

    // Check if another workout is already in progress (different day)
    if (isWorkoutStarted && currentDayIndex !== dayIdx) {
      setPreventionMessage(
        `You currently have an active workout on "${plan.schedule?.[currentDayIndex]?.name}". Finish or stop the current workout before starting a new one.`
      );
      setShowWorkoutPreventionModal(true);
      return;
    }

    // All checks passed, start the workout
    onStartWorkout(dayIdx);
  };

  // Handle workout review - trigger parent to switch to review mode
  const handleViewResults = (dayIdx) => {
    if (onViewResults) {
      onViewResults(dayIdx);
    }
  };

  // Get smart button configuration
  const getSmartButtonConfig = (dayIdx) => {
    const workoutStatus = getWorkoutStatus(dayIdx);
    const isActiveWorkout =
      isWorkoutStarted &&
      currentDayIndex === dayIdx &&
      plan.schedule[dayIdx]?.workoutStatus !== "completed";
    const hasOtherActiveWorkout =
      isWorkoutStarted && currentDayIndex !== dayIdx;

    // If workout is completed
    if (workoutStatus?.status === "completed") {
      return {
        text: "View Results",
        icon: "mdi:chart-line",
        className: "bg-emerald-600 hover:bg-emerald-700 text-white",
        action: () => handleViewResults(dayIdx),
      };
    }

    // If this is the currently active workout
    if (isActiveWorkout || workoutStatus?.status === "in_progress") {
      return {
        text: "Continue",
        icon: "mdi:play",
        className: "bg-blue-600 hover:bg-blue-700 text-white animate-pulse",
        action: () => handleWorkoutStart(dayIdx),
      };
    }

    // If workout was ended but not completed
    if (workoutStatus?.status === "ended") {
      return {
        text: hasOtherActiveWorkout ? "Another Workout Active" : "Continue",
        icon: hasOtherActiveWorkout ? "mdi:clock-outline" : "mdi:play",
        className: hasOtherActiveWorkout
          ? "bg-amber-600/80 text-amber-100 cursor-not-allowed border border-amber-500/50"
          : "bg-blue-600 hover:bg-blue-700 text-white",
        action: hasOtherActiveWorkout ? null : () => handleWorkoutStart(dayIdx),
        disabled: hasOtherActiveWorkout,
      };
    }

    // If workout hasn't started
    return {
      text: hasOtherActiveWorkout ? "Another Workout Active" : "Start Workout",
      icon: hasOtherActiveWorkout ? "mdi:clock-outline" : "mdi:play",
      className: hasOtherActiveWorkout
        ? "bg-amber-600/80 text-amber-100 cursor-not-allowed border border-amber-500/50"
        : "bg-blue-600 hover:bg-blue-700 text-white",
      action: hasOtherActiveWorkout ? null : () => handleWorkoutStart(dayIdx),
      disabled: hasOtherActiveWorkout,
    };
  };

  const toggleDayExpansion = (dayIdx) => {
    // Allow expansion of all days since we simplified the system
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

  const updateWarmupDescription = (dayIdx, value) => {
    // Check if the value is actually different before updating
    const currentDay = plan.schedule?.[dayIdx];
    if (!currentDay || (currentDay.warmupDescription ?? "") === value) {
      return; // No change needed
    }

    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx ? { ...day, warmupDescription: value } : day
      ),
    }));
  };

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
  };

  // Use the passed functions instead of local ones
  const handleAddSet = (dayIdx, exerciseIdx) => {
    if (onAddSet) {
      onAddSet(dayIdx, exerciseIdx);
    }
  };

  const handleRemoveSet = (dayIdx, exerciseIdx) => {
    if (onRemoveSet) {
      onRemoveSet(dayIdx, exerciseIdx);
    }
  };

  const updateExerciseParams = (dayIdx, exerciseIdx, field, value) => {
    // Check if the value is actually different before updating
    const currentExercise = plan.schedule?.[dayIdx]?.exercises?.[exerciseIdx];
    if (!currentExercise || currentExercise[field] === value) {
      return; // No change needed
    }

    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIdx) =>
                eIdx === exerciseIdx
                  ? { ...exercise, [field]: value }
                  : exercise
              ),
            }
          : day
      ),
    }));
  };

  const startEditingDay = (dayIdx) => {
    // Allow editing of all days since we simplified the system
    const day = plan.schedule[dayIdx];
    setEditingDay({
      dayIdx,
      name: day.name,
      type: day.type,
      notes: day.notes || "",
      duration: day.duration || 60,
      // Store original values for comparison
      originalValues: {
        name: day.name,
        type: day.type,
        notes: day.notes || "",
        duration: day.duration || 60,
      },
    });
  };

  const saveDayDetails = () => {
    if (!editingDay) return;

    // Check if any values actually changed
    const hasChanges =
      editingDay.name !== editingDay.originalValues.name ||
      editingDay.type !== editingDay.originalValues.type ||
      editingDay.notes !== editingDay.originalValues.notes ||
      (parseInt(editingDay.duration) || 60) !==
        editingDay.originalValues.duration;

    // Only update if there are actual changes
    if (hasChanges) {
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
    }

    setEditingDay(null);
  };

  const cancelEditingDay = () => {
    setEditingDay(null);
  };

  // If in review mode, show WorkoutReview component
  if (viewMode === "review" && selectedReviewDay !== null) {
    return (
      <WorkoutReview
        plan={plan}
        workoutSession={workoutSession}
        selectedDayIndex={selectedReviewDay}
        onClose={() => {
          setViewMode("overview");
          setSelectedReviewDay(null);
        }}
      />
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header with Progress */}
        <div className="bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border border-zinc-800/50 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 flex items-center justify-center">
                  <Icon
                    icon="mdi:dumbbell"
                    width={20}
                    height={20}
                    className="text-blue-400"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Training Overview
                </h1>
              </div>

              {/* Progress Bar */}
              {(() => {
                const completedCount =
                  plan.schedule?.filter((day) => {
                    const status = getWorkoutStatus(plan.schedule.indexOf(day));
                    return status?.status === "completed";
                  }).length || 0;
                const totalCount = plan.schedule?.length || 0;
                const progress =
                  totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">
                        Progress: {completedCount} of {totalCount} days
                      </span>
                      <span className="text-blue-400 font-medium">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Active Session Indicator */}
              {isWorkoutStarted &&
                plan.schedule?.[currentDayIndex]?.workoutStatus !==
                  "completed" && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-300 text-sm font-medium">
                      Active: {plan.schedule?.[currentDayIndex]?.name}
                    </span>
                  </div>
                )}
            </div>

            <Button
              onClick={onAddTrainingDay}
              variant="primary"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all"
              leftIcon={<Icon icon="mdi:plus-circle" width={18} height={18} />}
            >
              Add Training Day
            </Button>
          </div>
        </div>

        {/* Training Days Timeline */}
        <div className="space-y-4">
          {plan.schedule
            ?.map((day, _dayIdx) => ({ day, originalIndex: _dayIdx }))
            .sort((a, b) => {
              const aStatus = getWorkoutStatus(a.originalIndex);
              const bStatus = getWorkoutStatus(b.originalIndex);

              // Priority 1: Active workouts at top
              if (
                aStatus.status === "in_progress" &&
                bStatus.status !== "in_progress"
              )
                return -1;
              if (
                bStatus.status === "in_progress" &&
                aStatus.status !== "in_progress"
              )
                return 1;

              // Priority 2: Not started workouts next
              if (
                aStatus.status === "not_started" &&
                bStatus.status === "completed"
              )
                return -1;
              if (
                bStatus.status === "not_started" &&
                aStatus.status === "completed"
              )
                return 1;

              // Priority 3: Among completed workouts, most recent first (newest at top of completed section)
              if (
                aStatus.status === "completed" &&
                bStatus.status === "completed"
              ) {
                const aCompletedAt = a.day.workoutCompletedAt
                  ? new Date(a.day.workoutCompletedAt)
                  : new Date(0);
                const bCompletedAt = b.day.workoutCompletedAt
                  ? new Date(b.day.workoutCompletedAt)
                  : new Date(0);
                return bCompletedAt - aCompletedAt; // Most recent first
              }

              // Default: maintain original order
              return a.originalIndex - b.originalIndex;
            })
            .map(({ day, originalIndex }, displayIndex, sortedArray) => {
              const isExpanded = expandedDays.has(originalIndex);
              const isRestDay = day.type === "rest";
              const workoutStatus = day.workoutStatus;
              const isActiveWorkout =
                isWorkoutStarted &&
                currentDayIndex === originalIndex &&
                day.workoutStatus !== "completed";
              const isCompleted = workoutStatus === "completed";
              const buttonConfig = getSmartButtonConfig(originalIndex);

              // Disable drag and drop for completed and active workouts
              const isDragDisabled = isCompleted || isActiveWorkout;

              // Check if we need to show a section separator
              const showSeparator =
                displayIndex > 0 &&
                (() => {
                  const currentStatus = getWorkoutStatus(originalIndex).status;
                  const prevItem = sortedArray[displayIndex - 1];
                  const prevStatus = getWorkoutStatus(
                    prevItem.originalIndex
                  ).status;

                  // Show separator when transitioning between different status groups
                  return (
                    (prevStatus === "in_progress" &&
                      currentStatus !== "in_progress") ||
                    (prevStatus === "not_started" &&
                      currentStatus === "completed") ||
                    (prevStatus === "ended" && currentStatus === "completed")
                  );
                })();

              return (
                <React.Fragment key={`day-section-${originalIndex}`}>
                  {/* Section Separator */}
                  {showSeparator && (
                    <div className="flex items-center gap-4 py-6 px-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
                      <div className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full">
                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          {getWorkoutStatus(originalIndex).status ===
                          "completed"
                            ? "Completed Workouts"
                            : "Upcoming Workouts"}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
                    </div>
                  )}

                  <DraggableTrainingDay
                    key={`day-${originalIndex}-${day.id}`}
                    day={day}
                    dayIdx={originalIndex}
                    plan={plan}
                    setPlan={setPlan}
                    disabled={isDragDisabled}
                  >
                    <div className="relative group">
                      {/* Timeline Connector */}
                      {originalIndex < plan.schedule.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-8 bg-gradient-to-b from-zinc-600 to-zinc-700 z-0"></div>
                      )}

                      {/* Day Card */}
                      <div
                        className={`relative bg-zinc-900/40 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl ${
                          isDragDisabled
                            ? "cursor-default opacity-90"
                            : "cursor-grab active:cursor-grabbing"
                        } transform hover:scale-[1.02] ${
                          workoutStatus === "completed"
                            ? "border-emerald-500/40 shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:border-emerald-400/60"
                            : isActiveWorkout
                            ? "border-blue-500/50 shadow-blue-500/10 hover:shadow-blue-500/25 hover:border-blue-400/70"
                            : isRestDay
                            ? "border-purple-500/40 shadow-purple-500/10 hover:shadow-purple-500/25 hover:border-purple-400/60"
                            : "border-zinc-700/50 hover:border-zinc-600/70 hover:shadow-zinc-600/10"
                        }`}
                        onClick={(e) => {
                          if (
                            e.target === e.currentTarget ||
                            e.target.closest(".day-main-content")
                          ) {
                            toggleDayExpansion(originalIndex);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleDayExpansion(originalIndex);
                          }
                        }}
                      >
                        {/* Card Header */}
                        <div className="p-5 day-main-content">
                          <div className="flex items-center gap-4">
                            {/* Enhanced Day Number with Timeline Dot */}
                            <div className="relative flex-shrink-0">
                              <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 transform group-hover:scale-105 ${
                                  workoutStatus === "completed"
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30"
                                    : isActiveWorkout
                                    ? "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/30 animate-pulse"
                                    : isRestDay
                                    ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-500/30"
                                    : "bg-gradient-to-br from-zinc-600 to-zinc-700 shadow-zinc-600/30"
                                }`}
                              >
                                {workoutStatus === "completed" ? (
                                  <Icon
                                    icon="mdi:trophy"
                                    width={24}
                                    height={24}
                                  />
                                ) : isRestDay ? (
                                  <Icon
                                    icon="mdi:sleep"
                                    width={24}
                                    height={24}
                                  />
                                ) : isActiveWorkout ? (
                                  <Icon
                                    icon="mdi:play"
                                    width={24}
                                    height={24}
                                  />
                                ) : (
                                  <span className="text-xl">
                                    {originalIndex + 1}
                                  </span>
                                )}
                              </div>

                              {/* Status Ring */}
                              {(workoutStatus === "completed" ||
                                isActiveWorkout) && (
                                <div
                                  className={`absolute -inset-1 rounded-2xl ${
                                    workoutStatus === "completed"
                                      ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                                      : "bg-gradient-to-r from-blue-400 to-cyan-400"
                                  } opacity-20 blur-sm animate-pulse`}
                                ></div>
                              )}
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 min-w-0">
                              {editingDay?.dayIdx === originalIndex ? (
                                <div className="space-y-4">
                                  <input
                                    type="text"
                                    id={`day-name-input-${originalIndex}`}
                                    value={editingDay.name}
                                    onChange={(e) =>
                                      setEditingDay({
                                        ...editingDay,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full bg-zinc-800/50 border border-zinc-600 rounded-xl px-4 py-3 text-white text-xl font-bold backdrop-blur focus:border-blue-500 focus:outline-none"
                                    placeholder="Day name"
                                  />
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label
                                        htmlFor={`day-duration-input-${originalIndex}`}
                                        className="text-sm text-zinc-400 font-medium mb-2 block"
                                      >
                                        Duration (min)
                                      </label>
                                      <input
                                        type="number"
                                        id={`day-duration-input-${originalIndex}`}
                                        value={editingDay.duration}
                                        onChange={(e) =>
                                          setEditingDay({
                                            ...editingDay,
                                            duration:
                                              parseInt(e.target.value) || 60,
                                          })
                                        }
                                        className="w-full bg-zinc-800/50 border border-zinc-600 rounded-lg px-3 py-2 text-white backdrop-blur focus:border-blue-500 focus:outline-none"
                                        min="1"
                                        max="300"
                                      />
                                    </div>
                                    <div>
                                      <label
                                        htmlFor={`day-type-select-${originalIndex}`}
                                        className="text-sm text-zinc-400 font-medium mb-2 block"
                                      >
                                        Type
                                      </label>
                                      <select
                                        id={`day-type-select-${originalIndex}`}
                                        value={editingDay.type}
                                        onChange={(e) =>
                                          setEditingDay({
                                            ...editingDay,
                                            type: e.target.value,
                                          })
                                        }
                                        className="w-full bg-zinc-800/50 border border-zinc-600 rounded-lg px-3 py-2 text-white backdrop-blur focus:border-blue-500 focus:outline-none"
                                      >
                                        <option value="strength">
                                          Strength
                                        </option>
                                        <option value="cardio">Cardio</option>
                                        <option value="hiit">HIIT</option>
                                        <option value="flexibility">
                                          Flexibility
                                        </option>
                                        <option value="rest">Rest</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {/* Title Row */}
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
                                      {day.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      {workoutStatus === "completed" && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-full hover:bg-emerald-500/30 transition-all duration-300">
                                          <Icon
                                            icon="mdi:check-circle"
                                            width={12}
                                            height={12}
                                            className="animate-pulse"
                                          />
                                          COMPLETED
                                        </div>
                                      )}
                                      {isActiveWorkout && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-full animate-pulse">
                                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                          ACTIVE
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Stats Row */}
                                  {!isRestDay ? (
                                    <div className="flex items-center gap-6">
                                      <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                          <Icon
                                            icon="mdi:dumbbell"
                                            width={14}
                                            height={14}
                                            className="text-orange-400"
                                          />
                                        </div>
                                        <span className="text-sm font-medium">
                                          {day.exercises?.length || 0} exercises
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                          <Icon
                                            icon="mdi:clock"
                                            width={14}
                                            height={14}
                                            className="text-blue-400"
                                          />
                                        </div>
                                        <span className="text-sm font-medium">
                                          {day.duration || 60} min
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                          <Icon
                                            icon="mdi:fitness"
                                            width={14}
                                            height={14}
                                            className="text-purple-400"
                                          />
                                        </div>
                                        <span className="text-sm font-medium capitalize">
                                          {day.type}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-purple-400">
                                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <Icon
                                          icon="mdi:sleep"
                                          width={14}
                                          height={14}
                                        />
                                      </div>
                                      <span className="text-sm font-medium">
                                        Recovery Day - Rest & Recover
                                      </span>
                                    </div>
                                  )}

                                  {/* Workout Notes */}
                                  {workoutStatus === "completed" &&
                                    day.workoutNotes && (
                                      <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <div className="flex items-start gap-3">
                                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Icon
                                              icon="mdi:note-text"
                                              width={14}
                                              height={14}
                                              className="text-emerald-400"
                                            />
                                          </div>
                                          <div>
                                            <h4 className="text-emerald-300 font-semibold text-sm mb-1">
                                              Workout Notes
                                            </h4>
                                            <p className="text-emerald-100/90 text-sm leading-relaxed">
                                              {day.workoutNotes}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                  {/* Completion Info */}
                                  {workoutStatus === "completed" &&
                                    day.workoutCompletedAt && (
                                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                                        <Icon
                                          icon="mdi:calendar-check"
                                          width={12}
                                          height={12}
                                        />
                                        <span>
                                          Completed{" "}
                                          {new Date(
                                            day.workoutCompletedAt
                                          ).toLocaleDateString()}{" "}
                                          at{" "}
                                          {new Date(
                                            day.workoutCompletedAt
                                          ).toLocaleTimeString()}
                                        </span>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {editingDay?.dayIdx === originalIndex ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveDayDetails();
                                    }}
                                    variant="primary"
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium transition-all"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cancelEditingDay();
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="px-4 py-2 text-sm"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  {!isCompleted && !isActiveWorkout && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditingDay(originalIndex);
                                      }}
                                      variant="ghost"
                                      size="sm"
                                      className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-zinc-700/50"
                                    >
                                      <Icon
                                        icon="mdi:pencil"
                                        width={16}
                                        height={16}
                                      />
                                    </Button>
                                  )}

                                  {!isRestDay && day.exercises?.length > 0 && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                          buttonConfig.action &&
                                          !buttonConfig.disabled
                                        ) {
                                          buttonConfig.action();
                                        }
                                      }}
                                      disabled={buttonConfig.disabled}
                                      className={`${buttonConfig.className} px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
                                    >
                                      <Icon
                                        icon={buttonConfig.icon}
                                        width={16}
                                        height={16}
                                      />
                                      {buttonConfig.text}
                                    </Button>
                                  )}

                                  {!isRestDay && day.exercises?.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDayExpansion(originalIndex);
                                      }}
                                      className="p-2 hover:bg-zinc-700/50 transition-all"
                                    >
                                      <Icon
                                        icon={
                                          isExpanded
                                            ? "mdi:chevron-up"
                                            : "mdi:chevron-down"
                                        }
                                        width={18}
                                        height={18}
                                      />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Exercises - only show if not rest day */}
                      {isExpanded && !isRestDay && (
                        <div className="border-t border-zinc-700/50 bg-zinc-800/30">
                          <div className="p-6 space-y-4">
                            {/* Warmup section */}
                            <div className="mb-6">
                              <label
                                className="block text-zinc-300 font-semibold mb-2 text-lg"
                                htmlFor={`warmup-${originalIndex}`}
                              >
                                Warmup
                              </label>
                              <textarea
                                id={`warmup-${originalIndex}`}
                                className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-20 backdrop-blur focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter warmup description for this day..."
                                value={day.warmupDescription ?? ""}
                                onChange={(e) =>
                                  updateWarmupDescription(
                                    originalIndex,
                                    e.target.value
                                  )
                                }
                                disabled={isCompleted}
                              />
                            </div>

                            {/* Add exercise button - only show if not completed */}
                            {!isCompleted && (
                              <div className="mb-4 flex justify-end">
                                <button
                                  type="button"
                                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all"
                                  onClick={() =>
                                    onShowExerciseLibrary(originalIndex)
                                  }
                                >
                                  <Icon
                                    icon="mdi:plus"
                                    width={18}
                                    height={18}
                                  />
                                  Add Exercise
                                </button>
                              </div>
                            )}

                            {day.exercises?.map((exercise, exerciseIdx) => {
                              const exerciseProgress = getExerciseProgress(
                                originalIndex,
                                exerciseIdx
                              );

                              return (
                                <DraggableExercise
                                  key={exerciseIdx}
                                  exercise={exercise}
                                  exerciseIdx={exerciseIdx}
                                  dayIdx={originalIndex}
                                  plan={plan}
                                  setPlan={setPlan}
                                  disabled={isCompleted || isActiveWorkout}
                                >
                                  <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-700/30 hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg">
                                    <div className="flex gap-6">
                                      {/* Exercise Media */}
                                      <div className="flex-shrink-0">
                                        {exercise.imageUrl ? (
                                          <div className="w-24 h-32 rounded-xl overflow-hidden shadow-lg bg-zinc-800">
                                            <Image
                                              src={exercise.imageUrl}
                                              alt={exercise.name}
                                              className="w-full h-full object-cover"
                                              width={96}
                                              height={128}
                                            />
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
                                          </div>
                                        )}
                                      </div>

                                      {/* Exercise Content */}
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className="text-lg font-semibold text-white">
                                            {exercise.name}
                                          </h4>
                                          <div className="flex items-center gap-2">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                                              exerciseProgress.percentage === 100 
                                                ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50' 
                                                : exerciseProgress.percentage > 0 
                                                  ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50' 
                                                  : 'bg-zinc-800 text-zinc-400'
                                            }`}>
                                              {exerciseProgress.completed}/{exerciseProgress.total} sets
                                              {exerciseProgress.percentage === 100 && (
                                                <Icon icon="mdi:check-circle" width={14} height={14} className="text-emerald-400" />
                                              )}
                                              {exerciseProgress.percentage > 0 && exerciseProgress.percentage < 100 && (
                                                <Icon icon="mdi:clock-outline" width={14} height={14} className="text-blue-400" />
                                              )}
                                            </div>
                                            <div
                                              className={`w-3 h-3 rounded-full ${
                                                exerciseProgress.percentage ===
                                                100
                                                  ? "bg-emerald-500"
                                                  : exerciseProgress.percentage >
                                                    0
                                                  ? "bg-blue-500"
                                                  : "bg-zinc-600"
                                              }`}
                                            />
                                            {/* Show individual set completion status */}
                                            {Array.isArray(exercise.sets) &&
                                              exercise.sets.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                  {exercise.sets.map(
                                                    (set, setIdx) => (
                                                      <div
                                                        key={setIdx}
                                                        className={`w-2 h-2 rounded-full ${
                                                          set.completed
                                                            ? "bg-emerald-500"
                                                            : "bg-zinc-600"
                                                        }`}
                                                        title={`Set ${
                                                          setIdx + 1
                                                        }: ${
                                                          set.completed
                                                            ? `Completed${
                                                                set.weight
                                                                  ? ` - ${set.weight}kg`
                                                                  : ""
                                                              }${
                                                                set.reps
                                                                  ? ` × ${set.reps}`
                                                                  : ""
                                                              }`
                                                            : "Not completed"
                                                        }`}
                                                      />
                                                    )
                                                  )}
                                                </div>
                                              )}
                                            {/* Edit Controls - only show if not completed */}
                                            {!isCompleted && (
                                              <div className="flex gap-1">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    onShowExerciseLibrary(
                                                      originalIndex,
                                                      "replace",
                                                      exerciseIdx
                                                    )
                                                  }
                                                  className="p-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                                                  title="Replace exercise"
                                                >
                                                  <Icon
                                                    icon="mdi:swap-horizontal"
                                                    width={14}
                                                    height={14}
                                                    className="text-zinc-300"
                                                  />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    removeExercise(
                                                      originalIndex,
                                                      exerciseIdx
                                                    )
                                                  }
                                                  className="p-1.5 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
                                                  title="Remove exercise"
                                                >
                                                  <Icon
                                                    icon="mdi:delete"
                                                    width={14}
                                                    height={14}
                                                    className="text-red-300"
                                                  />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Exercise Parameters */}
                                        <div className="grid grid-cols-3 gap-4 mb-3">
                                          <div>
                                            <label
                                              className="block text-xs text-zinc-400 mb-1"
                                              htmlFor={`sets-${originalIndex}-${exerciseIdx}`}
                                            >
                                              Sets
                                            </label>
                                            <div className="flex items-center gap-2">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveSet(
                                                    originalIndex,
                                                    exerciseIdx
                                                  )
                                                }
                                                disabled={
                                                  (exercise.sets || 0) <= 1 ||
                                                  isCompleted
                                                }
                                                className="p-1 bg-red-600 hover:bg-red-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                              >
                                                <Icon
                                                  icon="mdi:minus"
                                                  width={12}
                                                  height={12}
                                                />
                                              </button>
                                              <div
                                                className="w-12 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white text-center font-semibold"
                                                id={`sets-${originalIndex}-${exerciseIdx}`}
                                              >
                                                {typeof exercise.sets ===
                                                "number"
                                                  ? exercise.sets
                                                  : Array.isArray(exercise.sets)
                                                  ? exercise.sets.length
                                                  : 0}
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleAddSet(
                                                    originalIndex,
                                                    exerciseIdx
                                                  )
                                                }
                                                disabled={isCompleted}
                                                className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                              >
                                                <Icon
                                                  icon="mdi:plus"
                                                  width={12}
                                                  height={12}
                                                />
                                              </button>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="flex items-center justify-between mb-1">
                                              <label
                                                className="block text-xs text-zinc-400"
                                                htmlFor={`reps-${originalIndex}-${exerciseIdx}`}
                                              >
                                                {exercise.repsUnit === "seconds"
                                                  ? "Seconds"
                                                  : "Reps"}
                                              </label>
                                              {!isCompleted && (
                                                <Button
                                                  variant="ghost"
                                                  size="small"
                                                  onClick={() =>
                                                    updateExerciseParams(
                                                      originalIndex,
                                                      exerciseIdx,
                                                      "repsUnit",
                                                      exercise.repsUnit ===
                                                        "reps"
                                                        ? "seconds"
                                                        : "reps"
                                                    )
                                                  }
                                                  className="p-0.5 h-5 w-5 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/20 rounded transition-all"
                                                  title={`Switch to ${
                                                    exercise.repsUnit === "reps"
                                                      ? "seconds"
                                                      : "reps"
                                                  }`}
                                                >
                                                  <Icon
                                                    icon={
                                                      exercise.repsUnit ===
                                                      "reps"
                                                        ? "mdi:timer-outline"
                                                        : "mdi:counter"
                                                    }
                                                    className="w-3 h-3"
                                                  />
                                                </Button>
                                              )}
                                            </div>
                                            <input
                                              id={`reps-${originalIndex}-${exerciseIdx}`}
                                              type="number"
                                              value={
                                                typeof exercise.reps ===
                                                "number"
                                                  ? exercise.reps
                                                  : ""
                                              }
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "") {
                                                  updateExerciseParams(
                                                    originalIndex,
                                                    exerciseIdx,
                                                    "reps",
                                                    ""
                                                  );
                                                } else {
                                                  const parsed =
                                                    parseInt(value);
                                                  if (
                                                    exercise.repsUnit ===
                                                    "seconds"
                                                  ) {
                                                    // Allow 0 or more
                                                    updateExerciseParams(
                                                      originalIndex,
                                                      exerciseIdx,
                                                      "reps",
                                                      isNaN(parsed) ? 0 : parsed
                                                    );
                                                  } else {
                                                    // repsUnit === 'reps' -- minimum 1
                                                    updateExerciseParams(
                                                      originalIndex,
                                                      exerciseIdx,
                                                      "reps",
                                                      isNaN(parsed)
                                                        ? ""
                                                        : Math.max(1, parsed)
                                                    );
                                                  }
                                                }
                                              }}
                                              disabled={isCompleted}
                                              placeholder={
                                                exercise.repsUnit === "reps"
                                                  ? "12"
                                                  : "30"
                                              }
                                              className="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                          </div>
                                          <div>
                                            <label
                                              className="block text-xs text-zinc-400 mb-1"
                                              htmlFor={`rest-${originalIndex}-${exerciseIdx}`}
                                            >
                                              Rest (s)
                                            </label>
                                            <input
                                              id={`rest-${originalIndex}-${exerciseIdx}`}
                                              type="number"
                                              value={exercise.rest || 0}
                                              onChange={(e) =>
                                                updateExerciseParams(
                                                  originalIndex,
                                                  exerciseIdx,
                                                  "rest",
                                                  parseInt(e.target.value) || 0
                                                )
                                              }
                                              disabled={isCompleted}
                                              className="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                          </div>
                                        </div>

                                        {/* Instructions */}
                                        <p className="text-sm text-zinc-400 mb-3">
                                          {exercise.instructions}
                                        </p>

                                        {/* Muscle Groups */}
                                        <div className="mb-3">
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

                                        {/* Enhanced Progress bar for exercise */}
                                        <div className="mt-3">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-zinc-400">Exercise Progress</span>
                                            <span className={`text-xs font-medium ${
                                              exerciseProgress.percentage === 100 
                                                ? 'text-emerald-400' 
                                                : exerciseProgress.percentage > 0 
                                                  ? 'text-blue-400' 
                                                  : 'text-zinc-500'
                                            }`}>
                                              {Math.round(exerciseProgress.percentage)}%
                                            </span>
                                          </div>
                                          <div className="w-full bg-zinc-700 rounded-full h-3 shadow-inner">
                                            <div
                                              className={`h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                                                exerciseProgress.percentage === 100
                                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/25"
                                                  : exerciseProgress.percentage > 0
                                                    ? "bg-gradient-to-r from-blue-500 to-blue-400 shadow-sm shadow-blue-500/25"
                                                    : "bg-zinc-600"
                                              }`}
                                              style={{
                                                width: `${
                                                  isNaN(exerciseProgress.percentage)
                                                    ? 0
                                                    : Math.min(exerciseProgress.percentage, 100)
                                                }%`,
                                              }}
                                            >
                                              {exerciseProgress.percentage > 0 && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                              )}
                                            </div>
                                          </div>

                                          {/* Show completed sets details */}
                                          {Array.isArray(exercise.sets) &&
                                            exercise.sets.some(
                                              (set) => set.completed
                                            ) && (
                                              <div className="mt-2 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
                                                <div className="text-xs text-emerald-300 mb-2 font-medium">
                                                  Completed Sets:
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {exercise.sets.map(
                                                    (set, setIdx) => {
                                                      if (!set.completed)
                                                        return null;
                                                      return (
                                                        <div
                                                          key={setIdx}
                                                          className="bg-emerald-800/30 px-2 py-1 rounded text-xs text-emerald-200 border border-emerald-600/30"
                                                        >
                                                          Set {setIdx + 1}:
                                                          {set.reps &&
                                                            ` ${set.reps} reps`}
                                                          {set.weight &&
                                                            !isNaN(
                                                              parseFloat(
                                                                set.weight
                                                              )
                                                            ) &&
                                                            parseFloat(
                                                              set.weight
                                                            ) > 0 &&
                                                            ` @ ${parseFloat(
                                                              set.weight
                                                            )}kg`}
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                            )}
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
                </React.Fragment>
              );
            })}
        </div>
      </div>

      {/* Workout Prevention Modal */}
      <Modal
        isOpen={showWorkoutPreventionModal}
        onClose={() => setShowWorkoutPreventionModal(false)}
        title="Cannot Start Workout"
        message={
          <div className="text-zinc-300">
            <p className="mb-4">{preventionMessage}</p>
            <div className="flex items-center gap-2 p-3 bg-orange-900/30 rounded-lg border border-orange-700/50">
              <Icon
                icon="mdi:information"
                width={20}
                height={20}
                className="text-orange-400"
              />
              <span className="text-orange-200 text-sm">
                Please complete or end your current workout session before
                starting a new one.
              </span>
            </div>
          </div>
        }
        confirmButtonText="Understood"
        onConfirm={() => setShowWorkoutPreventionModal(false)}
        showCancelButton={false}
      />
    </>
  );
}
