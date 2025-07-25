import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import AnatomicalViewer from "@/components/custom/dashboard/trainer/pages/exercises/components/AnatomicalViewer";
import { getMuscleGroupColor, formatTime } from "@/utils/trainingUtils";

export function LiveWorkoutMode({
  plan,
  workoutSession,
  onVideoOpen,
  onAddSet,
  onRemoveSet,
  onUpdateSetData,
  onUpdateExerciseNotes,
  onShowExerciseLibrary,
  onExitLiveMode,
  onSaveProgress,
  onCompleteWorkout,
}) {
  const [isCompletingWorkout, setIsCompletingWorkout] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showEndWorkoutModal, setShowEndWorkoutModal] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState("");

  const {
    currentDayIndex,
    setCurrentDayIndex,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    setCurrentSet,
    isWorkoutStarted,
    startWorkout,
    restTimer,
    isResting,
    setIsResting,
    getCurrentDay,
    getSessionDuration,
    getCompletedSets,
    getDayProgress,
    getExerciseProgress,
    getTotalSessionStats,
    nextExercise,
    prevExercise,
    isDayAccessible,
    getDayStatus,
  } = workoutSession;

  const currentDay = getCurrentDay();
  // Get current exercise directly from plan instead of workoutSession to avoid errors
  const currentExercise =
    plan.schedule?.[currentDayIndex]?.exercises?.[currentExerciseIndex] || null;
  const sessionStats = getTotalSessionStats();
  const currentDayProgress = getDayProgress(currentDayIndex);

  // Get sets directly from plan state - simple approach
  const exerciseSets =
    plan.schedule?.[currentDayIndex]?.exercises?.[currentExerciseIndex]?.sets ||
    [];
  const setsCount = exerciseSets.length;

  // Check if current day workout is complete
  const isDayComplete = currentDayProgress.percentage === 100;

  // Check if current day is completed (finished workout)
  const isDayCompleted = getDayStatus(currentDayIndex) === "completed";

  // Handle save progress
  const handleSaveProgress = async () => {
    setIsSavingProgress(true);
    setSaveMessage("");

    try {
      const result = await onSaveProgress();
      if (result.success) {
        setSaveMessage("✅ Progress saved successfully!");
      } else {
        setSaveMessage("❌ Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      setSaveMessage("❌ Error saving progress");
    } finally {
      setIsSavingProgress(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Handle end workout - show modal for notes and completion
  const handleEndWorkout = () => {
    setShowEndWorkoutModal(true);
  };

  // Complete workout with notes
  const handleCompleteWorkout = async () => {
    setIsCompletingWorkout(true);

    try {
      // Call onCompleteWorkout with completion data - this should call handleCompleteWorkoutSession in parent
      const result = await onCompleteWorkout({
        dayIndex: currentDayIndex,
        notes: workoutNotes.trim(),
        completedAt: new Date().toISOString(),
        wasCompleted: true,
      });

      if (result && result.success) {
        setShowEndWorkoutModal(false);
        setWorkoutNotes("");
        setSaveMessage("🎉 Workout completed successfully!");
        onExitLiveMode(); // Redirect immediately to overview
      } else {
        setSaveMessage("❌ Failed to complete workout - please try again");
      }
    } catch (error) {
      console.error("Error completing workout:", error);
      setSaveMessage("❌ Error completing workout - please try again");
    } finally {
      setIsCompletingWorkout(false);
    }
  };

  // Pre-workout screen
  if (!isWorkoutStarted) {
    const isReviewMode = false; // LiveWorkoutMode doesn't handle review mode directly

    return (
      <div className="text-center py-16">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-700/50 p-12 max-w-4xl mx-auto shadow-2xl">
          <div className="mb-8">
            <div
              className={`w-24 h-24 bg-gradient-to-br ${
                isReviewMode
                  ? "from-green-500 to-emerald-600"
                  : "from-blue-500 to-purple-600"
              } rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
            >
              <Icon
                icon={isReviewMode ? "mdi:chart-line" : "mdi:weight-lifter"}
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
                {plan.schedule?.[currentDayIndex]?.exercises?.length || 0}{" "}
                exercises
              </span>
            </div>
          </div>

          {/* Day selector with status indicators */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <Icon icon="mdi:calendar-check" width={20} height={20} />
              Select Training Day
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {plan.schedule?.map((day, idx) => {
                const dayProgress = getDayProgress(idx);
                const dayStatus = getDayStatus(idx);
                const isAccessible = isDayAccessible(idx);

                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      if (isAccessible) {
                        setCurrentDayIndex(idx);
                      }
                    }}
                    disabled={!isAccessible}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      idx === currentDayIndex
                        ? "bg-blue-600/20 border-blue-500 text-blue-300"
                        : isAccessible
                        ? "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600"
                        : "bg-zinc-900/30 border-zinc-800/50 text-zinc-500 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{day.name}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            dayStatus === "completed"
                              ? "bg-green-500 text-white"
                              : dayStatus === "in_progress"
                              ? "bg-blue-500 text-white animate-pulse"
                              : dayStatus === "unlocked"
                              ? "bg-yellow-500 text-black"
                              : "bg-zinc-600 text-zinc-300"
                          }`}
                        >
                          {dayStatus === "completed" ? (
                            <Icon icon="mdi:check" width={14} height={14} />
                          ) : dayStatus === "locked" ? (
                            <Icon icon="mdi:lock" width={12} height={12} />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        {/* Status badge */}
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            dayStatus === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : dayStatus === "in_progress"
                              ? "bg-blue-500/20 text-blue-300"
                              : dayStatus === "unlocked"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-zinc-600/20 text-zinc-400"
                          }`}
                        >
                          {dayStatus === "completed"
                            ? "DONE"
                            : dayStatus === "in_progress"
                            ? "ACTIVE"
                            : dayStatus === "unlocked"
                            ? "READY"
                            : "LOCKED"}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm opacity-80">
                      {day.duration}min • {day.exercises?.length || 0} exercises
                    </div>
                    {dayProgress.total > 0 && (
                      <div className="mt-2">
                        <div className="text-xs mb-1">
                          Progress: {dayProgress.completed}/{dayProgress.total}{" "}
                          sets ({Math.round(dayProgress.percentage)}%)
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-1.5">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              dayStatus === "completed"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${dayProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={() => startWorkout(currentDayIndex)}
            disabled={!isDayAccessible(currentDayIndex)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            leftIcon={<Icon icon="mdi:play" width={24} height={24} />}
          >
            {getDayStatus(currentDayIndex) === "in_progress" ||
            getDayStatus(currentDayIndex) === "ended"
              ? "Continue Workout"
              : "Start Workout"}
          </Button>
        </div>
      </div>
    );
  }

  // Active workout screen
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Current Exercise */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exercise Header */}
          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
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
                    <Icon icon="mdi:progress-check" width={16} height={16} />
                    <span className="text-sm">
                      {getCompletedSets()} / {setsCount} sets
                    </span>
                    {/* Mini progress indicator */}
                    <div className="w-8 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{
                          width: `${(() => {
                            const completed = getCompletedSets();
                            const total = setsCount;
                            const percentage =
                              total > 0 ? (completed / total) * 100 : 0;
                            return isNaN(percentage)
                              ? 0
                              : Math.min(percentage, 100);
                          })()}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Day Progress Badge */}
                <div
                  className={`px-4 py-2.5 rounded-full text-white font-semibold shadow-lg ${
                    isDayComplete
                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : "bg-gradient-to-r from-orange-500 to-yellow-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={
                        isDayComplete ? "mdi:check-circle" : "mdi:clock-outline"
                      }
                      width={16}
                      height={16}
                    />
                    <span className="text-sm">
                      Day {Math.round(currentDayProgress.percentage)}%{" "}
                      {isDayComplete ? "Complete!" : "Done"}
                    </span>
                  </div>
                </div>

                {/* Exercise Type with Icon */}
                <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 px-4 py-2.5 rounded-full text-zinc-300 font-medium shadow-lg">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:clock-outline" width={16} height={16} />
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
                      type="button"
                      onClick={() => onVideoOpen(currentExercise.videoUrl)}
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
                    type="button"
                    onClick={() => {
                      onRemoveSet(currentDayIndex, currentExerciseIndex);
                    }}
                    disabled={setsCount <= 1}
                    className="p-2.5 hover:bg-red-600/20 rounded-l-xl text-red-400 hover:text-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Remove Set"
                  >
                    <Icon icon="mdi:minus-circle" width={18} height={18} />
                  </button>
                  <div className="px-3 py-2 text-white text-sm font-semibold border-x border-zinc-700/50">
                    {setsCount} sets
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddSet(currentDayIndex, currentExerciseIndex);
                    }}
                    className="p-2.5 hover:bg-green-600/20 rounded-r-xl text-green-400 hover:text-green-300 transition-colors"
                    title="Add Set"
                  >
                    <Icon icon="mdi:plus-circle" width={18} height={18} />
                  </button>
                </div>

                {/* Exercise Navigation */}
                <div className="flex items-center bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                  <button
                    type="button"
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
                    type="button"
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
                  type="button"
                  onClick={() =>
                    onShowExerciseLibrary(
                      currentDayIndex,
                      "replace",
                      currentExerciseIndex
                    )
                  }
                  className="p-2.5 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-xl text-purple-400 hover:text-purple-300 transition-all"
                  title="Replace Exercise"
                >
                  <Icon icon="mdi:swap-horizontal" width={18} height={18} />
                </button>

                {/* Exit Live Mode */}
                <button
                  type="button"
                  onClick={onExitLiveMode}
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
                            currentExercise?.muscleGroups?.map((m) => m.name) ||
                            []
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
                      type="button"
                      onClick={() => onVideoOpen(currentExercise.videoUrl)}
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
              </div>

              {/* Exercise Details */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="text-3xl font-bold text-white">
                    {currentExercise?.name}
                  </h2>
                  {currentExercise?.videoUrl && (
                    <button
                      type="button"
                      onClick={() => onVideoOpen(currentExercise.videoUrl)}
                      className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Icon icon="mdi:play-circle" width={20} height={20} />
                      <span>Watch Video</span>
                    </button>
                  )}
                </div>
                <p className="text-zinc-400 mb-4 text-lg leading-relaxed">
                  {currentExercise?.instructions}
                </p>
                <div className="flex gap-4">
                  <div className="bg-zinc-800/50 px-4 py-3 rounded-xl backdrop-blur">
                    <span className="text-zinc-400 text-sm">Target: </span>
                    <span className="text-white font-semibold text-lg">
                      {setsCount} sets × {currentExercise?.reps}{" "}
                      {currentExercise?.repsUnit === "seconds"
                        ? "seconds"
                        : "reps"}
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
                  <div className="mt-4">
                    <h4 className="text-zinc-300 font-semibold mb-2">
                      Target Muscles
                    </h4>
                    <div className="flex flex-wrap gap-2">
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
                  </div>
                )}

                {/* Video Section Enhancement */}
                {currentExercise?.videoUrl && (
                  <div
                    className="mt-4 p-4 bg-red-900/20 border border-red-700/50 rounded-xl w-full max-w-md"
                    style={{ minWidth: 320 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-600/20 rounded-lg">
                        <Icon
                          icon="mdi:video"
                          className="text-red-400"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-red-300 font-semibold">
                            Tutorial Video
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              onVideoOpen(currentExercise.videoUrl)
                            }
                            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <Icon icon="mdi:play" width={14} height={14} />
                            <span>Play Video</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-xs text-red-200/80 font-mono bg-red-900/30 px-3 py-2 rounded-lg border border-red-700/50 truncate flex-1 select-all">
                            {currentExercise.videoUrl}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                currentExercise.videoUrl
                              );
                              setSaveMessage("Copied!");
                              setTimeout(() => setSaveMessage(""), 1500);
                            }}
                            className="ml-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors text-xs border border-zinc-600"
                            title="Copy URL"
                          >
                            <Icon
                              icon="mdi:content-copy"
                              width={14}
                              height={14}
                            />
                          </button>
                        </div>
                        {saveMessage === "Copied!" && (
                          <div className="text-green-400 text-xs font-medium mb-2">
                            Copied!
                          </div>
                        )}
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
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon
                icon="mdi:format-list-checks"
                width={24}
                height={24}
                className="text-blue-400"
              />
              Set Tracking
            </h3>
            <div className="space-y-4">
              {/* Render sets based on current exercise sets data */}
              {currentExercise &&
                (() => {
                  // Get sets structure from plan state
                  const planSets = exerciseSets;

                  // Get workout data for this exercise to merge completion status
                  const workoutExerciseData =
                    workoutSession?.workoutData?.[currentDayIndex]?.exercises?.[
                      currentExerciseIndex
                    ];

                  // Combine plan sets structure with workout completion data
                  const setsData = planSets.map((planSet, setIdx) => {
                    const workoutSet = workoutExerciseData?.sets?.[setIdx];
                    return {
                      ...planSet, // Structure from plan (setNumber, restTime, etc.)
                      // Override with workout data if available (weight, reps, completed, notes, completedAt)
                      weight: workoutSet?.weight || planSet.weight || "",
                      reps: workoutSet?.reps || planSet.reps || "",
                      completed:
                        workoutSet?.completed || planSet.completed || false,
                      notes: workoutSet?.notes || planSet.notes || "",
                      completedAt:
                        workoutSet?.completedAt || planSet.completedAt || null,
                    };
                  });

                  // If no sets exist, show message with add set option
                  if (setsData.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="bg-zinc-800/30 border-2 border-dashed border-zinc-600 rounded-xl p-8">
                          <Icon
                            icon="mdi:plus-circle-outline"
                            width={48}
                            height={48}
                            className="text-zinc-500 mx-auto mb-4"
                          />
                          <h4 className="text-zinc-400 text-lg font-medium mb-2">
                            No Sets Added Yet
                          </h4>
                          <p className="text-zinc-500 text-sm mb-6">
                            Click "Add Set" below to create your first set for
                            this exercise.
                          </p>
                          <Button
                            type="button"
                            onClick={() => {
                              onAddSet(currentDayIndex, currentExerciseIndex);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
                            leftIcon={
                              <Icon icon="mdi:plus" width={18} height={18} />
                            }
                          >
                            Add First Set
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  // Render existing sets
                  return setsData.map((setData, setIdx) => (
                    <div
                      key={setIdx}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        setData.completed
                          ? "bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/50 shadow-lg shadow-green-500/10"
                          : "bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50"
                      }`}
                    >
                      {/* Set Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              setData.completed
                                ? "bg-green-500 text-white"
                                : "bg-zinc-700 text-zinc-300"
                            }`}
                          >
                            {setIdx + 1}
                          </div>
                          Set {setIdx + 1}
                        </h4>
                        {setData.completed && (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            <Icon
                              icon="mdi:check-circle"
                              width={16}
                              height={16}
                            />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>

                      {/* Set Inputs */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            className="block text-zinc-400 text-sm mb-1 font-medium"
                            htmlFor={`weight-${currentDayIndex}-${currentExerciseIndex}-${setIdx}`}
                          >
                            Weight (kg)
                          </label>
                          <input
                            id={`weight-${currentDayIndex}-${currentExerciseIndex}-${setIdx}`}
                            type="number"
                            min="0"
                            step="0.5"
                            value={setData.weight || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Only allow valid numbers or empty string
                              if (
                                value === "" ||
                                (!isNaN(value) && parseFloat(value) >= 0)
                              ) {
                                onUpdateSetData(
                                  currentDayIndex,
                                  currentExerciseIndex,
                                  setIdx,
                                  "weight",
                                  value === "" ? null : Number(value)
                                );
                              }
                            }}
                            disabled={isDayCompleted}
                            className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white text-lg font-semibold backdrop-blur focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label
                            className="block text-zinc-400 text-sm mb-1 font-medium"
                            htmlFor={`reps-${currentDayIndex}-${currentExerciseIndex}-${setIdx}`}
                          >
                            {currentExercise?.repsUnit === "seconds"
                              ? "Seconds"
                              : "Reps"}
                          </label>
                          <input
                            id={`reps-${currentDayIndex}-${currentExerciseIndex}-${setIdx}`}
                            type="number"
                            min="1"
                            step="1"
                            value={setData.reps || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Only allow valid positive integers or empty string
                              if (
                                value === "" ||
                                (!isNaN(value) && parseInt(value) >= 1)
                              ) {
                                onUpdateSetData(
                                  currentDayIndex,
                                  currentExerciseIndex,
                                  setIdx,
                                  "reps",
                                  value === "" ? null : Number(value)
                                );
                              }
                            }}
                            disabled={isDayCompleted}
                            className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white text-lg font-semibold backdrop-blur focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder={
                              currentExercise?.reps?.toString() ||
                              (currentExercise?.repsUnit === "seconds"
                                ? "30"
                                : "10")
                            }
                          />
                        </div>
                      </div>

                      {/* Complete/Undo Button - only show if not completed workout */}
                      {!isDayCompleted && (
                        <div className="flex flex-col gap-2">
                          {setData.completed ? (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateSetData(
                                  currentDayIndex,
                                  currentExerciseIndex,
                                  setIdx,
                                  "completed",
                                  false
                                )
                              }
                              className="px-6 py-3 rounded-xl font-bold text-sm transition-all bg-yellow-600 hover:bg-yellow-700 text-white hover:scale-105 active:scale-95"
                            >
                              ↺ Undo
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateSetData(
                                  currentDayIndex,
                                  currentExerciseIndex,
                                  setIdx,
                                  "completed",
                                  true
                                )
                              }
                              className="px-6 py-3 rounded-xl font-bold text-sm transition-all bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      )}

                      {/* Completed celebration message */}
                      {setData.completed && !isDayCompleted && (
                        <div className="text-xs text-green-400 text-center animate-bounce">
                          Great job! 🎉
                        </div>
                      )}

                      {/* Set Notes */}
                      <div className="mt-4">
                        <label
                          className="block text-zinc-400 text-xs mb-1 font-medium"
                          htmlFor={`set-notes-${currentDayIndex}-${currentExerciseIndex}-${setIdx}`}
                        >
                          Set Notes
                        </label>
                        <textarea
                          id={`set-notes-${currentDayIndex}-${currentExerciseIndex}-${setIdx}`}
                          value={setData.notes || ""}
                          onChange={(e) =>
                            onUpdateSetData(
                              currentDayIndex,
                              currentExerciseIndex,
                              setIdx,
                              "notes",
                              e.target.value
                            )
                          }
                          disabled={isDayCompleted}
                          className="w-full bg-zinc-800/30 border border-zinc-600/30 rounded-lg px-3 py-2 text-white text-sm backdrop-blur focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Add notes about this set..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ));
                })()}
            </div>

            {/* Add/Remove Set Controls - only show if workout not completed */}
            {!isDayCompleted && (
              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  onClick={() => {
                    onAddSet(currentDayIndex, currentExerciseIndex);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold"
                  leftIcon={<Icon icon="mdi:plus" width={18} height={18} />}
                >
                  Add Set
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onRemoveSet(currentDayIndex, currentExerciseIndex);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  leftIcon={<Icon icon="mdi:minus" width={18} height={18} />}
                  disabled={setsCount <= 1}
                >
                  Remove Set
                </Button>
              </div>
            )}

            {/* Exercise Notes */}
            <div className="mt-6">
              <label
                className="block text-zinc-300 font-semibold mb-2"
                htmlFor={`exercise-notes-${currentDayIndex}-${currentExerciseIndex}`}
              >
                Exercise Notes
              </label>
              <textarea
                id={`exercise-notes-${currentDayIndex}-${currentExerciseIndex}`}
                value={
                  plan.schedule?.[currentDayIndex]?.exercises?.[
                    currentExerciseIndex
                  ]?.exerciseNotes || ""
                }
                onChange={(e) =>
                  onUpdateExerciseNotes(
                    currentDayIndex,
                    currentExerciseIndex,
                    e.target.value
                  )
                }
                disabled={isDayCompleted}
                className="w-full bg-zinc-800/50 border border-zinc-600/50 rounded-xl px-4 py-3 text-white h-24 backdrop-blur focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Add notes about form, difficulty, modifications..."
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Session Info & Controls */}
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
                type="button"
                onClick={() => {
                  setIsResting(false);
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
                icon="mdi:chart-line"
                width={20}
                height={20}
                className="text-blue-400"
              />
              Session Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Duration</span>
                <span className="text-white font-mono font-bold text-lg">
                  {getSessionDuration()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Sets Completed</span>
                <span className="text-white font-semibold">
                  {sessionStats.completedSets} / {sessionStats.totalSets}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Day Progress</span>
                <span className="text-white font-semibold">
                  {Math.round(currentDayProgress.percentage)}%
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-3 mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                    isDayComplete ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{
                    width: `${
                      isNaN(currentDayProgress.percentage)
                        ? 0
                        : Math.min(currentDayProgress.percentage, 100)
                    }%`,
                  }}
                >
                  {/* Shimmer effect for active progress */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
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
                const exerciseWorkoutData =
                  workoutSession?.workoutData?.[currentDayIndex]?.exercises?.[
                    idx
                  ];
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentExerciseIndex(idx);
                      setCurrentSet(1);
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setCurrentExerciseIndex(idx);
                        setCurrentSet(1);
                      }
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
                          {Array.isArray(exerciseWorkoutData?.sets)
                            ? exerciseWorkoutData.sets.length
                            : Array.isArray(exercise.sets)
                            ? exercise.sets.length
                            : exercise.sets || 0}{" "}
                          sets × {exercise.reps}{" "}
                          {exercise.repsUnit === "seconds" ? "seconds" : "reps"}
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out relative ${
                              exerciseProgress.percentage === 100
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{
                              width: `${
                                isNaN(exerciseProgress.percentage)
                                  ? 0
                                  : Math.min(exerciseProgress.percentage, 100)
                              }%`,
                            }}
                          >
                            {/* Animated progress indicator */}
                            {exerciseProgress.percentage > 0 &&
                              exerciseProgress.percentage < 100 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
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

            {/* Save Message */}
            {saveMessage && (
              <div className="mb-4 p-3 rounded-lg text-sm text-center font-medium">
                {saveMessage}
              </div>
            )}

            <div className="space-y-3">
              {/* Save Progress */}
              <Button
                type="button"
                onClick={handleSaveProgress}
                disabled={isSavingProgress}
                variant="secondary"
                className="w-full py-3 rounded-xl font-semibold bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 disabled:opacity-50"
                leftIcon={
                  isSavingProgress ? (
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon icon="mdi:content-save" width={18} height={18} />
                  )
                }
              >
                {isSavingProgress ? "Saving..." : "Save Progress"}
              </Button>

              {/* Complete Workout - only show if not already completed */}
              {!isDayCompleted && (
                <Button
                  type="button"
                  onClick={handleEndWorkout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                  leftIcon={
                    <Icon icon="mdi:check-circle" width={18} height={18} />
                  }
                >
                  Complete Workout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* End Workout Modal */}
      <Modal
        isOpen={showEndWorkoutModal}
        onClose={() => {
          if (!isCompletingWorkout) {
            setShowEndWorkoutModal(false);
            setWorkoutNotes("");
          }
        }}
        title="🎉 Complete Workout"
        showCancelButton={true}
        confirmButtonText={
          isCompletingWorkout ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Completing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Icon icon="mdi:trophy" width={18} height={18} />
              Complete Workout
            </div>
          )
        }
        onConfirm={handleCompleteWorkout}
        onCancel={() => {
          if (!isCompletingWorkout) {
            setShowEndWorkoutModal(false);
            setWorkoutNotes("");
          }
        }}
        confirmButtonDisabled={isCompletingWorkout}
        confirmButtonClassName="bg-green-600 hover:bg-green-700 text-white font-bold"
        message={
          <div className="space-y-4">
            <div className="text-zinc-300">
              <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    icon="mdi:celebration"
                    width={24}
                    height={24}
                    className="text-green-400"
                  />
                  <h3 className="text-lg font-bold text-green-300">
                    Congratulations!
                  </h3>
                </div>
                <p className="text-green-200">
                  You're about to complete this workout. Great job on your
                  training session!
                </p>
              </div>

              <p className="mb-4 text-zinc-400">
                Add any notes about your session (optional):
              </p>

              {/* Workout Notes Input */}
              <div className="mb-4">
                <textarea
                  className="w-full p-3 bg-zinc-800/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-400 focus:border-green-500 focus:outline-none resize-none backdrop-blur"
                  placeholder="How did the workout feel? Any improvements or observations..."
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  rows={4}
                  disabled={isCompletingWorkout}
                />
              </div>
            </div>

            {/* Session Summary */}
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Icon icon="mdi:chart-line" width={18} height={18} />
                Session Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-400">Duration:</span>
                  <div className="text-white font-mono">
                    {getSessionDuration()}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-400">Day:</span>
                  <div className="text-white">
                    {currentDay?.name || `Day ${currentDayIndex + 1}`}
                  </div>
                </div>
                <div>
                  <span className="text-zinc-400">Progress:</span>
                  <div className="text-green-400 font-semibold">
                    {Math.round(currentDayProgress.percentage)}% Complete
                  </div>
                </div>
                <div>
                  <span className="text-zinc-400">Sets Done:</span>
                  <div className="text-white">
                    {currentDayProgress.completed}/{currentDayProgress.total}
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center p-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/20">
              <div className="text-green-300 font-medium">
                🚀 Keep up the excellent work! Every workout brings you closer
                to your goals.
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
