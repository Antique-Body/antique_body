import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

import { Button } from "@/components/common/Button";
import AnatomicalViewer from "@/components/custom/dashboard/trainer/pages/exercises/components/AnatomicalViewer";
import { getMuscleGroupColor } from "@/utils/trainingUtils";

export function WorkoutReview({
  plan,
  workoutSession,
  selectedDayIndex,
  onClose,
  onViewResults,
}) {
  const { getDayProgress, getExerciseProgress } = workoutSession;

  // Helper function to get workout status from plan data
  const getWorkoutStatus = (dayIdx) => {
    const day = plan.schedule?.[dayIdx];
    if (!day) return null;

    // Check saved workout data format (completed/ended workouts)
    const hasWorkoutData =
      day.workoutStatus ||
      day.workoutStartedAt ||
      day.workoutCompletedAt ||
      day.workoutEndedAt;

    if (hasWorkoutData) {
      // Only consider it truly completed if it has completedAt timestamp or wasCompleted flag
      const isTrulyCompleted =
        day.workoutCompletedAt || day.workoutWasCompleted;

      return {
        status: isTrulyCompleted
          ? "completed"
          : day.workoutStatus || "not_started",
        startedAt: day.workoutStartedAt,
        completedAt: day.workoutCompletedAt,
        endedAt: day.workoutEndedAt,
        duration: day.workoutDuration || 0,
        notes: day.workoutNotes || "",
        wasCompleted: isTrulyCompleted,
      };
    }

    // Check workoutSession data (for in-progress sessions that aren't currently active)
    const workoutSession = day.workoutSession;
    if (
      workoutSession &&
      workoutSession.status &&
      workoutSession.status !== "unlocked"
    ) {
      return {
        status: workoutSession.status,
        startedAt: workoutSession.startedAt,
        completedAt: workoutSession.completedAt,
        endedAt: workoutSession.endedAt,
        duration: workoutSession.totalTimeSpent || 0,
        notes: workoutSession.workoutNotes || "",
        wasCompleted: workoutSession.status === "completed",
      };
    }

    return null;
  };

  // If no specific day is selected, show selection interface
  if (selectedDayIndex === null || selectedDayIndex === undefined) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl p-8 border border-zinc-700/50 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30 shadow-lg">
                <Icon
                  icon="mdi:chart-line"
                  className="text-green-400"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Workout Reviews
                </h2>
                <p className="text-zinc-400">
                  Select a completed workout to view detailed results and
                  performance metrics
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="secondary"
              className="bg-zinc-700/50 hover:bg-zinc-600/50 border-zinc-600/50 text-zinc-300"
              leftIcon={<Icon icon="mdi:arrow-left" width={18} height={18} />}
            >
              Back to Overview
            </Button>
          </div>
        </div>

        {/* Completed Workouts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.schedule?.map((day, dayIdx) => {
            const workoutStatus = getWorkoutStatus(dayIdx);
            const dayProgress = getDayProgress(dayIdx);

            // Only show completed workouts
            if (workoutStatus?.status !== "completed") {
              return null;
            }

            return (
              <div
                key={dayIdx}
                onClick={() => onViewResults && onViewResults(dayIdx)}
                className="group cursor-pointer bg-gradient-to-br from-green-900/40 via-emerald-800/50 to-green-900/40 border border-green-500/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      <Icon icon="mdi:check" width={20} height={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-green-200 transition-colors">
                        {day.name}
                      </h3>
                      <div className="text-sm text-green-300">
                        Day {dayIdx + 1} • Completed
                      </div>
                    </div>
                  </div>
                  <Icon
                    icon="mdi:chevron-right"
                    width={20}
                    height={20}
                    className="text-green-400 group-hover:translate-x-1 transition-transform"
                  />
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-200 text-sm">Completed:</span>
                    <span className="text-white font-semibold">
                      {workoutStatus.completedAt
                        ? new Date(
                            workoutStatus.completedAt
                          ).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200 text-sm">Duration:</span>
                    <span className="text-white font-mono font-semibold">
                      {Math.floor(workoutStatus.duration / 60)}m{" "}
                      {workoutStatus.duration % 60}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200 text-sm">Progress:</span>
                    <span className="text-white font-semibold">
                      {Math.round(dayProgress.percentage)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200 text-sm">Exercises:</span>
                    <span className="text-white font-semibold">
                      {day.exercises?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-green-900/30 rounded-full h-2 mb-4">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${dayProgress.percentage}%` }}
                  />
                </div>

                {/* Notes Preview */}
                {workoutStatus.notes && (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                    <div className="text-xs text-green-300 mb-1">Notes:</div>
                    <div className="text-sm text-green-100 line-clamp-2">
                      {workoutStatus.notes}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Completed Workouts */}
        {!plan.schedule?.some(
          (day, dayIdx) => getWorkoutStatus(dayIdx)?.status === "completed"
        ) && (
          <div className="text-center py-16">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-700/50 p-12 max-w-2xl mx-auto shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Icon
                  icon="mdi:clipboard-text-off"
                  className="text-zinc-400"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Completed Workouts Yet
              </h3>
              <p className="text-zinc-400 mb-6">
                Complete some workouts first, then return here to review your
                performance and progress.
              </p>
              <Button
                onClick={onClose}
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                leftIcon={<Icon icon="mdi:arrow-left" width={18} height={18} />}
              >
                Back to Overview
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show specific workout review
  const selectedDay = plan.schedule?.[selectedDayIndex];
  const workoutStatus = getWorkoutStatus(selectedDayIndex);
  const dayProgress = getDayProgress(selectedDayIndex);

  // Calculate proper sets completion from workout data
  const calculateSetsCompletion = () => {
    let totalSets = 0;
    let completedSets = 0;

    selectedDay?.exercises?.forEach((exercise) => {
      if (Array.isArray(exercise.sets)) {
        // If exercise.sets is an array, it contains the actual workout data
        exercise.sets.forEach((set) => {
          totalSets++;
          if (set.completed) {
            completedSets++;
          }
        });
      } else {
        // If exercise.sets is a number, use the original plan number
        const setsCount = exercise.sets || 0;
        totalSets += setsCount;
        // For completed exercises, assume all sets are completed
        if (workoutStatus?.status === "completed") {
          completedSets += setsCount;
        }
      }
    });

    return { totalSets, completedSets };
  };

  const setsCompletion = calculateSetsCompletion();

  if (!selectedDay || !workoutStatus || workoutStatus.status !== "completed") {
    return (
      <div className="text-center py-16">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-700/50 p-12 max-w-2xl mx-auto shadow-2xl">
          <Icon
            icon="mdi:alert-circle"
            width={64}
            height={64}
            className="text-red-400 mx-auto mb-6"
          />
          <h3 className="text-2xl font-bold text-white mb-4">
            Workout Not Available
          </h3>
          <p className="text-zinc-400 mb-6">
            This workout hasn't been completed yet or the data is not available
            for review.
          </p>
          <Button
            onClick={onClose}
            variant="secondary"
            leftIcon={<Icon icon="mdi:arrow-left" width={18} height={18} />}
          >
            Back to Overview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/90 to-emerald-800/90 backdrop-blur-xl rounded-3xl p-8 border border-green-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-2xl border border-green-500/50 shadow-lg">
              <Icon
                icon="mdi:trophy"
                className="text-green-400"
                width={32}
                height={32}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedDay.name} - Review
              </h2>
              <div className="flex items-center gap-4 text-sm text-green-200">
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:calendar-check" width={16} height={16} />
                  Completed on{" "}
                  {workoutStatus.completedAt
                    ? new Date(workoutStatus.completedAt).toLocaleDateString()
                    : "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:clock" width={16} height={16} />
                  Duration: {Math.floor(workoutStatus.duration / 60)}m{" "}
                  {workoutStatus.duration % 60}s
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-green-700/50 hover:bg-green-600/50 border-green-600/50 text-green-200"
            leftIcon={<Icon icon="mdi:arrow-left" width={18} height={18} />}
          >
            Back to Reviews
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-800/30 rounded-xl p-4 border border-green-600/30">
            <div className="text-green-300 text-sm font-medium mb-1">
              Progress
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(dayProgress.percentage)}%
            </div>
          </div>
          <div className="bg-green-800/30 rounded-xl p-4 border border-green-600/30">
            <div className="text-green-300 text-sm font-medium mb-1">
              Exercises
            </div>
            <div className="text-2xl font-bold text-white">
              {selectedDay.exercises?.length || 0}
            </div>
          </div>
          <div className="bg-green-800/30 rounded-xl p-4 border border-green-600/30">
            <div className="text-green-300 text-sm font-medium mb-1">
              Sets Completed
            </div>
            <div className="text-2xl font-bold text-white">
              {setsCompletion.completedSets} / {setsCompletion.totalSets}
            </div>
          </div>
          <div className="bg-green-800/30 rounded-xl p-4 border border-green-600/30">
            <div className="text-green-300 text-sm font-medium mb-1">
              Status
            </div>
            <div className="text-2xl font-bold text-green-400">COMPLETED</div>
          </div>
        </div>
      </div>

      {/* Workout Notes */}
      {workoutStatus.notes && (
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Icon
              icon="mdi:note-text"
              width={24}
              height={24}
              className="text-blue-400"
            />
            Workout Notes
          </h3>
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-600/50">
            <p className="text-zinc-300 leading-relaxed">
              {workoutStatus.notes}
            </p>
          </div>
        </div>
      )}

      {/* Exercises Review */}
      <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Icon
            icon="mdi:dumbbell"
            width={24}
            height={24}
            className="text-green-400"
          />
          Exercise Performance
        </h3>

        <div className="space-y-6">
          {selectedDay.exercises?.map((exercise, exerciseIdx) => {
            const exerciseProgress = getExerciseProgress(
              selectedDayIndex,
              exerciseIdx
            );
            const exerciseSets = Array.isArray(exercise.sets)
              ? exercise.sets
              : typeof exercise.sets === "object" && exercise.sets !== null
              ? [] // If it's an object but not an array, treat as empty
              : [];

            return (
              <div
                key={exerciseIdx}
                className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/30"
              >
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
                      <div className="relative">
                        <div className="w-24 h-32 rounded-xl border-2 border-green-600/50 bg-gradient-to-br from-green-900/30 to-emerald-900/30 shadow-lg flex items-center justify-center">
                          <AnatomicalViewer
                            exerciseName={exercise.name}
                            muscleGroups={
                              exercise.muscleGroups?.map((m) => m.name) || []
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
                        <div className="absolute top-1 right-1 bg-green-600/90 backdrop-blur-sm rounded-md px-1.5 py-0.5">
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

                  {/* Exercise Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">
                        {exercise.name}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            exerciseProgress.percentage === 100
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          }`}
                        >
                          {exerciseProgress.percentage === 100
                            ? "COMPLETED"
                            : "PARTIAL"}
                        </div>
                        <div className="text-sm text-zinc-400">
                          {exerciseProgress.completed}/{exerciseProgress.total}{" "}
                          sets
                        </div>
                      </div>
                    </div>

                    {/* Muscle Groups */}
                    {exercise.muscleGroups && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {exercise.muscleGroups.map((muscle, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getMuscleGroupColor(
                                muscle.name
                              )}`}
                            >
                              {muscle.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sets Performance */}
                    <div className="space-y-3">
                      <h5 className="text-lg font-semibold text-white">
                        Sets Performance
                      </h5>
                      {exerciseSets.length > 0 ? (
                        <div className="grid gap-3">
                          {exerciseSets.map((set, setIdx) => (
                            <div
                              key={setIdx}
                              className={`p-4 rounded-lg border-2 ${
                                set.completed
                                  ? "bg-green-900/20 border-green-700/50"
                                  : "bg-zinc-800/30 border-zinc-700/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                      set.completed
                                        ? "bg-green-600 text-white"
                                        : "bg-zinc-600 text-zinc-300"
                                    }`}
                                  >
                                    {set.completed ? (
                                      <Icon
                                        icon="mdi:check"
                                        width={16}
                                        height={16}
                                      />
                                    ) : (
                                      setIdx + 1
                                    )}
                                  </div>
                                  <span className="text-white font-semibold">
                                    Set {setIdx + 1}
                                  </span>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                  {set.weight &&
                                    !isNaN(parseFloat(set.weight)) &&
                                    parseFloat(set.weight) > 0 && (
                                      <div>
                                        <span className="text-zinc-400">
                                          Weight:{" "}
                                        </span>
                                        <span className="text-white font-semibold">
                                          {parseFloat(set.weight)}kg
                                        </span>
                                      </div>
                                    )}
                                  {set.reps && (
                                    <div>
                                      <span className="text-zinc-400">
                                        Reps:{" "}
                                      </span>
                                      <span className="text-white font-semibold">
                                        {set.reps}
                                      </span>
                                    </div>
                                  )}
                                  {set.completedAt && (
                                    <div>
                                      <span className="text-zinc-400">
                                        Completed:{" "}
                                      </span>
                                      <span className="text-white font-mono text-xs">
                                        {new Date(
                                          set.completedAt
                                        ).toLocaleTimeString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {set.notes && (
                                <div className="mt-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
                                  <div className="text-xs text-zinc-400 mb-1">
                                    Notes:
                                  </div>
                                  <div className="text-sm text-zinc-300">
                                    {set.notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-zinc-400">
                          No set data available for this exercise.
                        </div>
                      )}
                    </div>

                    {/* Exercise Notes */}
                    {exercise.exerciseNotes && (
                      <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
                        <div className="text-sm text-zinc-400 mb-2">
                          Exercise Notes:
                        </div>
                        <div className="text-zinc-300">
                          {exercise.exerciseNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
