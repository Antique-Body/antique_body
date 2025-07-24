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
        `Trenutno imate aktivan trening na "${plan.schedule?.[currentDayIndex]?.name}". Završite ili zaustavite trenutni trening pre pokretanja novog.`
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
        className: "bg-green-600 hover:bg-green-700 text-white",
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
    });
  };

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
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Training Plan
              </h1>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span>
                  {plan.schedule?.filter((day) => {
                    const status = getWorkoutStatus(plan.schedule.indexOf(day));
                    return status?.status === "completed";
                  }).length || 0}{" "}
                  of {plan.schedule?.length || 0} days completed
                </span>
                {(() => {
                  const sessionStats = workoutSession.getTotalSessionStats();
                  if (sessionStats.totalSets > 0) {
                    return (
                      <span>
                        {sessionStats.completedSets} of {sessionStats.totalSets}{" "}
                        sets completed
                      </span>
                    );
                  }
                  return null;
                })()}
                {isWorkoutStarted &&
                  plan.schedule?.[currentDayIndex]?.workoutStatus !==
                    "completed" && (
                    <span className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      {plan.schedule?.[currentDayIndex]?.name}
                    </span>
                  )}
              </div>
            </div>
            <Button
              onClick={onAddTrainingDay}
              variant="primary"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
            >
              Add Day
            </Button>
          </div>
        </div>

        {/* Training Days */}
        <div className="space-y-3">
          {plan.schedule
            ?.map((day, dayIdx) => ({ day, dayIdx }))
            .sort((a, b) => {
              const statusA = getWorkoutStatus(a.dayIdx);
              const statusB = getWorkoutStatus(b.dayIdx);

              // Sort active sessions to the top first
              const isActiveA =
                isWorkoutStarted && currentDayIndex === a.dayIdx;
              const isActiveB =
                isWorkoutStarted && currentDayIndex === b.dayIdx;

              if (isActiveA && !isActiveB) return -1;
              if (isActiveB && !isActiveA) return 1;

              // Then sort completed workouts to the top
              if (
                statusA?.status === "completed" &&
                statusB?.status !== "completed"
              ) {
                return -1;
              }
              if (
                statusB?.status === "completed" &&
                statusA?.status !== "completed"
              ) {
                return 1;
              }

              // Within completed workouts, sort by completion date (newest first)
              if (
                statusA?.status === "completed" &&
                statusB?.status === "completed"
              ) {
                const dateA = statusA.completedAt
                  ? new Date(statusA.completedAt).getTime()
                  : 0;
                const dateB = statusB.completedAt
                  ? new Date(statusB.completedAt).getTime()
                  : 0;
                return dateB - dateA;
              }

              // For non-completed workouts, maintain original order
              return a.dayIdx - b.dayIdx;
            })
            .map(({ day, dayIdx }) => {
              const isExpanded = expandedDays.has(dayIdx);
              const isRestDay = day.type === "rest";
              // Use plan state directly for status
              const workoutStatus = plan.schedule[dayIdx]?.workoutStatus;
              const isActiveWorkout =
                isWorkoutStarted &&
                currentDayIndex === dayIdx &&
                day.workoutStatus !== "completed";
              const isCompleted = workoutStatus === "completed";
              const buttonConfig = getSmartButtonConfig(dayIdx);

              return (
                <DraggableTrainingDay
                  key={dayIdx}
                  day={day}
                  dayIdx={dayIdx}
                  plan={plan}
                  setPlan={setPlan}
                  disabled={isCompleted || isActiveWorkout}
                >
                  <div
                    className={`group relative bg-white/5 backdrop-blur-sm rounded-xl border transition-all duration-200 hover:bg-white/10 cursor-pointer ${
                      workoutStatus === "completed"
                        ? "border-green-500/30 bg-green-500/10"
                        : isActiveWorkout
                        ? "border-blue-500/50 bg-blue-500/10 ring-2 ring-blue-500/20"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    onClick={(e) => {
                      if (
                        e.target === e.currentTarget ||
                        e.target.closest(".day-main-content")
                      ) {
                        toggleDayExpansion(dayIdx);
                      }
                    }}
                  >
                    <div className="p-6">
                      {/* Active Session Badge */}
                      {isActiveWorkout && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full animate-pulse">
                          Active
                        </div>
                      )}

                      <div className="flex items-center justify-between day-main-content">
                        <div className="flex items-center gap-4">
                          {/* Day Badge */}
                          <div className="relative">
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                                workoutStatus === "completed"
                                  ? "bg-green-600 shadow-lg shadow-green-600/30"
                                  : isActiveWorkout
                                  ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                                  : isRestDay
                                  ? "bg-purple-600 shadow-lg shadow-purple-600/30"
                                  : "bg-slate-600 shadow-lg"
                              }`}
                            >
                              {workoutStatus === "completed" ? (
                                <Icon icon="mdi:check" width={20} height={20} />
                              ) : isRestDay ? (
                                <Icon icon="mdi:sleep" width={20} height={20} />
                              ) : (
                                <span>{dayIdx + 1}</span>
                              )}
                            </div>
                          </div>

                          {/* Day Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-3">
                              {editingDay?.dayIdx === dayIdx ? (
                                <div className="flex-1 space-y-3">
                                  <input
                                    type="text"
                                    value={editingDay.name}
                                    onChange={(e) =>
                                      setEditingDay({
                                        ...editingDay,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full bg-zinc-800/50 border border-zinc-600 rounded-lg px-4 py-2 text-white text-2xl font-bold backdrop-blur focus:border-blue-500 focus:outline-none"
                                    placeholder="Day name"
                                    autoFocus
                                  />
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <label className="text-sm text-zinc-400 font-medium">
                                        Duration:
                                      </label>
                                      <input
                                        type="number"
                                        value={editingDay.duration}
                                        onChange={(e) =>
                                          setEditingDay({
                                            ...editingDay,
                                            duration:
                                              parseInt(e.target.value) || 60,
                                          })
                                        }
                                        className="w-20 bg-zinc-800/50 border border-zinc-600 rounded-lg px-3 py-1 text-white text-sm backdrop-blur focus:border-blue-500 focus:outline-none"
                                        min="1"
                                        max="300"
                                      />
                                      <span className="text-sm text-zinc-400">
                                        min
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <label className="text-sm text-zinc-400 font-medium">
                                        Type:
                                      </label>
                                      <select
                                        value={editingDay.type}
                                        onChange={(e) =>
                                          setEditingDay({
                                            ...editingDay,
                                            type: e.target.value,
                                          })
                                        }
                                        className="bg-zinc-800/50 border border-zinc-600 rounded-lg px-3 py-1 text-white text-sm backdrop-blur focus:border-blue-500 focus:outline-none"
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
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold text-white">
                                      {day.name}
                                    </h3>
                                    {workoutStatus === "completed" && (
                                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                                        Completed
                                      </span>
                                    )}
                                  </div>
                                  {!isRestDay ? (
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                      <span className="flex items-center gap-1">
                                        <Icon
                                          icon="mdi:dumbbell"
                                          width={14}
                                          height={14}
                                        />
                                        {day.exercises?.length || 0} exercises
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Icon
                                          icon="mdi:clock"
                                          width={14}
                                          height={14}
                                        />
                                        {day.duration || 60} min
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Icon
                                          icon="mdi:fitness"
                                          width={14}
                                          height={14}
                                        />
                                        {day.type}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-purple-400">
                                      <Icon
                                        icon="mdi:meditation"
                                        width={14}
                                        height={14}
                                      />
                                      <span className="text-sm font-medium">
                                        Recovery Day
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {editingDay?.dayIdx === dayIdx ? (
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveDayDetails();
                                }}
                                variant="primary"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 px-3 py-1"
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
                                className="px-3 py-1"
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
                                    startEditingDay(dayIdx);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1"
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
                                  className={`${buttonConfig.className} px-4 py-2 font-medium flex items-center gap-2`}
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
                                <div className="text-slate-400 text-xs">
                                  <Icon
                                    icon={
                                      isExpanded
                                        ? "mdi:chevron-up"
                                        : "mdi:chevron-down"
                                    }
                                    width={16}
                                    height={16}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Exercises - only show if not rest day */}
                    {isExpanded && !isRestDay && (
                      <div className="border-t border-zinc-700/50 bg-zinc-800/30">
                        <div className="p-6 space-y-4">
                          {/* Warmup section */}
                          <div className="mb-6">
                            <label className="block text-zinc-300 font-semibold mb-2 text-lg">
                              Warmup
                            </label>
                            <textarea
                              className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-20 backdrop-blur focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="Enter warmup description for this day..."
                              value={day.warmupDescription ?? ""}
                              onChange={(e) =>
                                updateWarmupDescription(dayIdx, e.target.value)
                              }
                              disabled={isCompleted}
                            />
                          </div>

                          {/* Add exercise button - only show if not completed */}
                          {!isCompleted && (
                            <div className="mb-4 flex justify-end">
                              <button
                                className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold shadow"
                                onClick={() => onShowExerciseLibrary(dayIdx)}
                              >
                                <Icon icon="mdi:plus" width={18} height={18} />
                                Add Exercise
                              </button>
                            </div>
                          )}

                          {day.exercises?.map((exercise, exerciseIdx) => {
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
                                disabled={isCompleted || isActiveWorkout}
                              >
                                <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-700/30 hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all duration-200">
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
                                                          ? "bg-green-500"
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
                                                onClick={() =>
                                                  onShowExerciseLibrary(
                                                    dayIdx,
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
                                                onClick={() =>
                                                  removeExercise(
                                                    dayIdx,
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
                                          <label className="block text-xs text-zinc-400 mb-1">
                                            Sets
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() =>
                                                handleRemoveSet(
                                                  dayIdx,
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
                                            <div className="w-12 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white text-center font-semibold">
                                              {typeof exercise.sets === "number"
                                                ? exercise.sets
                                                : Array.isArray(exercise.sets)
                                                ? exercise.sets.length
                                                : 0}
                                            </div>
                                            <button
                                              onClick={() =>
                                                handleAddSet(
                                                  dayIdx,
                                                  exerciseIdx
                                                )
                                              }
                                              disabled={isCompleted}
                                              className="p-1 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                                          <label className="block text-xs text-zinc-400 mb-1">
                                            Reps
                                          </label>
                                          <input
                                            type="number"
                                            value={exercise.reps || 0}
                                            onChange={(e) =>
                                              updateExerciseParams(
                                                dayIdx,
                                                exerciseIdx,
                                                "reps",
                                                parseInt(e.target.value) || 1
                                              )
                                            }
                                            disabled={isCompleted}
                                            className="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-zinc-400 mb-1">
                                            Rest (s)
                                          </label>
                                          <input
                                            type="number"
                                            value={exercise.rest || 0}
                                            onChange={(e) =>
                                              updateExerciseParams(
                                                dayIdx,
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
                                              width: `${
                                                isNaN(
                                                  exerciseProgress.percentage
                                                )
                                                  ? 0
                                                  : Math.min(
                                                      exerciseProgress.percentage,
                                                      100
                                                    )
                                              }%`,
                                            }}
                                          />
                                        </div>

                                        {/* Show completed sets details */}
                                        {Array.isArray(exercise.sets) &&
                                          exercise.sets.some(
                                            (set) => set.completed
                                          ) && (
                                            <div className="mt-2 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                                              <div className="text-xs text-green-300 mb-2 font-medium">
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
                                                        className="bg-green-800/30 px-2 py-1 rounded text-xs text-green-200 border border-green-600/30"
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
