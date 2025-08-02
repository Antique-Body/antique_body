"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ContextualSaveBar } from "@/components";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import {
  PlanLoadingState,
  PlanErrorState,
  PlanNotFoundState,
} from "@/components/custom/dashboard/trainer/pages/clients/components";
import { ExerciseLibrarySelector } from "@/components/custom/dashboard/trainer/pages/exercises/components";
import { VideoModal } from "@/components/modals/VideoModal";
import { LiveWorkoutMode } from "@/components/training/LiveWorkoutMode";
import { TrainingPlanOverview } from "@/components/training/TrainingPlanOverview";
import { WorkoutReview } from "@/components/training/WorkoutReview";
import { VIEW_MODES } from "@/constants/trainingConstants";
import { useTrainingPlan } from "@/hooks/useTrainingPlan";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { createNewTrainingDay } from "@/utils/trainingUtils";

export default function TrackPlanPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutRef = useRef(null);
  // Unwrap params for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  const { id, planId } = unwrappedParams;

  // Training plan management
  const trainingPlan = useTrainingPlan(id, planId);
  const {
    plan,
    setPlan,
    loading,
    showSaveBar,
    isSaving,
    isShaking,
    handleSavePlan,
    handleDiscardPlan,
    safeNavigate,
    updateLastSavedPlan,
    addExercise,
    removeExercise,
    replaceExercise,
    addTrainingDay,
    updateExerciseParams,
  } = trainingPlan;

  // Workout session management
  const workoutSession = useWorkoutSession(plan, planId, id);
  const {
    currentDayIndex,
    setCurrentDayIndex,
    isWorkoutStarted,
    startWorkout,
    completeDayWorkout: _completeDayWorkout,
    getTotalSessionStats,
    updateWorkoutDataAfterExerciseChange,
    addNewDayWorkoutData,
    updateWorkoutDataAfterRepsChange,
  } = workoutSession;

  // UI state
  const [viewMode, setViewMode] = useState(() => {
    // Check if mode=review is in URL params using useSearchParams
    const modeParam = searchParams.get("mode");
    return modeParam === "review" ? VIEW_MODES.REVIEW : VIEW_MODES.OVERVIEW;
  });
  const [selectedReviewDay, setSelectedReviewDay] = useState(null);

  // End workout modal state
  const [showEndWorkoutModal, setShowEndWorkoutModal] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState("");

  // Exercise library modal state
  const [showExerciseLibraryModal, setShowExerciseLibraryModal] =
    useState(false);
  const [pendingAddExerciseDayIdx, setPendingAddExerciseDayIdx] =
    useState(null);
  const [editingExercise, setEditingExercise] = useState(null); // {dayIdx, exerciseIdx} or null
  const [selectedExercisesForNewDay, setSelectedExercisesForNewDay] = useState(
    []
  );

  // Video modal state
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  // Safe navigation handlers - only block specific navigations
  const handleBackNavigation = () => {
    safeNavigate(() => router.back());
  };

  const handleBreadcrumbNavigation = (path) => {
    // Only block breadcrumb navigation for this specific plan page
    if (path.includes("/plans/") || path.includes("/clients/")) {
      safeNavigate(() => router.push(path));
    } else {
      // Allow dashboard tab navigation (Upcoming Trainings, Clients, etc.)
      router.push(path);
    }
  };

  const handleViewModeChange = (newMode) => {
    // Prevent switching to Live mode if no workout is started
    if (newMode === VIEW_MODES.LIVE && !isWorkoutStarted) {
      return false;
    }

    // Handle switching to Review mode
    if (newMode === VIEW_MODES.REVIEW) {
      setSelectedReviewDay(null); // Reset selected review day
    }

    // Allow switching between view modes without navigation blocking
    setViewMode(newMode);
    return true;
  };

  // Handle URL query params and auto-switch logic
  React.useEffect(() => {
    // Check URL params on mount and route changes using useSearchParams
    const modeParam = searchParams.get("mode");
    if (modeParam === "review" && viewMode !== VIEW_MODES.REVIEW) {
      setViewMode(VIEW_MODES.REVIEW);
    }

    // Auto-switch to Overview if trying to access Live mode without workout
    if (viewMode === VIEW_MODES.LIVE && !isWorkoutStarted) {
      setViewMode(VIEW_MODES.OVERVIEW);
    }
  }, [viewMode, isWorkoutStarted, searchParams]);

  // Helper functions for workout status logic
  const getWorkoutStatus = (day, dayIdx, isWorkoutStarted, currentDayIndex) => {
    // If this is the current active workout day, set status to in_progress
    if (
      isWorkoutStarted &&
      currentDayIndex === dayIdx &&
      !day.workoutCompletedAt
    ) {
      return "in_progress";
    }
    // Use existing status or default logic
    return day.workoutStatus || (dayIdx === 0 ? "not_started" : "locked");
  };

  const getWorkoutStartedAt = (
    day,
    dayIdx,
    isWorkoutStarted,
    currentDayIndex
  ) => {
    // If this is the current active workout day and workout is started, ensure workoutStartedAt is set
    if (
      isWorkoutStarted &&
      currentDayIndex === dayIdx &&
      !day.workoutStartedAt
    ) {
      return new Date().toISOString();
    }
    return day.workoutStartedAt || null;
  };

  const handleStartWorkout = (dayIdx = currentDayIndex) => {
    if (
      safeNavigate(() => {
        // Initialize sets as objects if they're not already
        setPlan((prevPlan) => {
          const updatedPlan = { ...prevPlan };
          const day = updatedPlan.schedule[dayIdx];

          if (day && day.exercises) {
            day.exercises.forEach((exercise) => {
              // If sets is a number or empty array, convert to objects
              if (
                typeof exercise.sets === "number" ||
                !Array.isArray(exercise.sets) ||
                exercise.sets.length === 0
              ) {
                const setsCount =
                  typeof exercise.sets === "number" ? exercise.sets : 3;
                exercise.sets = Array.from(
                  { length: setsCount },
                  (_, setIdx) => ({
                    setNumber: setIdx + 1,
                    weight: "",
                    reps: (exercise.reps || 10).toString(),
                    completed: false,
                    notes: "",
                    completedAt: null,
                    restTime: exercise.rest || 60,
                  })
                );
              }
            });
          }

          return updatedPlan;
        });

        // Set workout status and started time in plan state
        setPlan((prevPlan) => {
          const updatedPlan = { ...prevPlan };
          const day = updatedPlan.schedule[dayIdx];
          if (day && !day.workoutStartedAt) {
            day.workoutStatus = "in_progress";
            day.workoutStartedAt = new Date().toISOString();
          }
          return updatedPlan;
        });

        setCurrentDayIndex(dayIdx);
        setViewMode(VIEW_MODES.LIVE);
        if (!isWorkoutStarted) {
          startWorkout(dayIdx);
        }
      })
    ) {
      // Workout started successfully
    }
  };

  // Handlers
  const handleAddTrainingDay = () => {
    setSelectedExercisesForNewDay([]);
    setPendingAddExerciseDayIdx(-1); // Special flag for new day creation
    setShowExerciseLibraryModal(true);
  };

  const handleShowExerciseLibrary = (
    dayIdx,
    mode = "add",
    exerciseIdx = null
  ) => {
    if (mode === "replace") {
      setEditingExercise({ dayIdx, exerciseIdx });
    } else {
      setPendingAddExerciseDayIdx(dayIdx);
    }
    setShowExerciseLibraryModal(true);
  };

  const handleExerciseSelection = (selectedExercise) => {
    if (editingExercise) {
      // Replace exercise
      replaceExercise(
        editingExercise.dayIdx,
        editingExercise.exerciseIdx,
        selectedExercise
      );
      updateWorkoutDataAfterExerciseChange(
        editingExercise.dayIdx,
        editingExercise.exerciseIdx,
        selectedExercise
      );
      setEditingExercise(null);
      setShowExerciseLibraryModal(false);
    } else if (pendingAddExerciseDayIdx === -1) {
      // Multiple selection mode for new day
      handleExerciseSelectionForNewDay(selectedExercise);
    } else if (pendingAddExerciseDayIdx !== null) {
      // Add exercise to existing day
      addExercise(pendingAddExerciseDayIdx, selectedExercise);
      setPendingAddExerciseDayIdx(null);
      setShowExerciseLibraryModal(false);
    }
  };

  const handleExerciseSelectionForNewDay = (selectedExercise) => {
    setSelectedExercisesForNewDay((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === selectedExercise.id);
      if (existingIndex >= 0) {
        return prev.filter((e) => e.id !== selectedExercise.id);
      } else {
        return [...prev, selectedExercise];
      }
    });
  };

  const createNewDayWithSelectedExercises = () => {
    if (selectedExercisesForNewDay.length === 0) return;

    const newDayIndex = plan.schedule.length;
    const newDay = createNewTrainingDay(`Day ${newDayIndex + 1}`);
    newDay.exercises = selectedExercisesForNewDay.map((exercise) => ({
      ...exercise,
      sets: exercise.sets || 3,
      reps: exercise.reps || 10,
      weight: exercise.weight || "",
      notes: "",
    }));

    addTrainingDay(newDay);
    addNewDayWorkoutData(newDayIndex, selectedExercisesForNewDay);

    // Clear selections and close modal
    setSelectedExercisesForNewDay([]);
    setPendingAddExerciseDayIdx(null);
    setShowExerciseLibraryModal(false);
  };

  const closeExerciseLibraryModal = () => {
    setEditingExercise(null);
    setPendingAddExerciseDayIdx(null);
    setSelectedExercisesForNewDay([]);
    setShowExerciseLibraryModal(false);
  };

  const handleVideoOpen = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const handleVideoClose = () => {
    setShowVideoModal(false);
    setCurrentVideoUrl(null);
  };

  // Enhanced workout session management
  const handleEndWorkout = () => {
    setShowEndWorkoutModal(true);
  };

  const handleConfirmEndWorkout = async () => {
    try {
      // Complete the workout with notes FIRST
      workoutSession.completeDayWorkout(workoutNotes);

      // Update plan state immediately with completion data
      const now = new Date().toISOString();
      setPlan((prevPlan) => {
        const updatedPlan = { ...prevPlan };
        const day = updatedPlan.schedule[currentDayIndex];
        if (day) {
          day.workoutStatus = "completed";
          day.workoutStartedAt = day.workoutStartedAt || now;
          day.workoutCompletedAt = now;
          day.workoutDuration =
            workoutSession.getSessionDurationInSeconds() || 0;
          day.workoutNotes = workoutNotes;
          day.workoutWasCompleted = true;
        }
        return updatedPlan;
      });

      // Automatically save the plan to backend
      await handleSavePlan();

      // Update lastSavedPlan to prevent save bar from showing after automatic save
      timeoutRef.current = setTimeout(() => {
        setPlan((currentPlan) => {
          updateLastSavedPlan(currentPlan);
          return currentPlan;
        });
      }, 100);

      // Switch back to overview mode
      setViewMode(VIEW_MODES.OVERVIEW);
    } catch (error) {
      console.error("Error ending workout:", error);
    } finally {
      setShowEndWorkoutModal(false);
      setWorkoutNotes(""); // Clear notes after ending
    }
  };

  const handleCancelEndWorkout = () => {
    setShowEndWorkoutModal(false);
    setWorkoutNotes(""); // Clear notes on cancel
  };

  // Complete Workout
  const handleCompleteWorkoutSession = async (completionData) => {
    const {
      dayIndex = currentDayIndex,
      notes = "",
      wasCompleted = true,
    } = completionData;
    setPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan };
      const day = updatedPlan.schedule[dayIndex];
      if (day) {
        const now = new Date();
        day.workoutStatus = wasCompleted ? "completed" : "ended";
        day.workoutStartedAt = day.workoutStartedAt || now.toISOString();
        day.workoutCompletedAt = wasCompleted ? now.toISOString() : null;
        day.workoutEndedAt = !wasCompleted ? now.toISOString() : null;
        day.workoutDuration = 0; // Optionally calculate duration if needed
        day.workoutNotes = notes;
        day.workoutWasCompleted = wasCompleted;
      }
      return updatedPlan;
    });
    await handleSaveWorkoutProgress();

    // Update lastSavedPlan to prevent save bar from showing after automatic save
    timeoutRef.current = setTimeout(() => {
      setPlan((currentPlan) => {
        updateLastSavedPlan(currentPlan);
        return currentPlan;
      });
    }, 100);

    // Ensure workout session is ended
    if (workoutSession.completeDayWorkout) {
      workoutSession.completeDayWorkout(notes);
    }

    setViewMode(VIEW_MODES.OVERVIEW); // Redirect to overview immediately after completion
  };

  const handleSaveWorkoutProgress = async () => {
    if (!plan) {
      return { success: false, message: "Missing plan data" };
    }
    try {
      const cleanPlanData = {
        ...plan,
        schedule: plan.schedule?.map((day, dayIdx) => {
          // Use plan state directly - it already has all the completion data
          const cleanDay = {
            id: day.id || crypto.randomUUID(),
            day: dayIdx + 1,
            name: day.name,
            type: day.type,
            duration: day.duration,
            description: day.description || "",

            // Workout completion data from plan state (already updated in handleCompleteWorkoutSession)
            workoutStatus: getWorkoutStatus(
              day,
              dayIdx,
              isWorkoutStarted,
              currentDayIndex
            ),
            workoutStartedAt: getWorkoutStartedAt(
              day,
              dayIdx,
              isWorkoutStarted,
              currentDayIndex
            ),
            workoutCompletedAt: day.workoutCompletedAt || null,
            workoutEndedAt: day.workoutEndedAt || null,
            workoutDuration: day.workoutDuration || 0,
            workoutNotes: day.workoutNotes || "",
            workoutWasCompleted: day.workoutWasCompleted || false,
          };

          // Add exercises with sets from plan state
          cleanDay.exercises =
            day.exercises?.map((exercise) => {
              const cleanExercise = {
                id: exercise.id || crypto.randomUUID(),
                name: exercise.name,
                reps: exercise.reps || 10,
                rest: exercise.rest || 60,
                type: exercise.type || "strength",
                level: exercise.level || "beginner",
                imageUrl:
                  typeof exercise.imageUrl === "string"
                    ? exercise.imageUrl
                    : "",
                location: exercise.location || "gym",
                equipment: exercise.equipment || false,
                instructions: exercise.instructions || "",
                muscleGroups: exercise.muscleGroups || [],
              };

              // Use sets directly from plan state
              if (Array.isArray(exercise.sets)) {
                cleanExercise.sets = exercise.sets.map((set) => ({
                  setNumber: set.setNumber,
                  weight: set.weight === "" ? null : Number(set.weight),
                  reps: set.reps === "" ? null : Number(set.reps),
                  completed: set.completed || false,
                  notes: set.notes || "",
                  completedAt: set.completedAt || null,
                  restTime: set.restTime || exercise.rest || 60,
                }));
              } else {
                // Fallback: create default sets structure
                const setsCount =
                  typeof exercise.sets === "number" ? exercise.sets : 3;
                cleanExercise.sets = Array.from(
                  { length: setsCount },
                  (_, setIdx) => ({
                    setNumber: setIdx + 1,
                    weight: null,
                    reps: exercise.reps ? Number(exercise.reps) : 10,
                    completed: false,
                    notes: "",
                    completedAt: null,
                    restTime: exercise.rest || 60,
                  })
                );
              }

              cleanExercise.exerciseNotes = exercise.exerciseNotes || "";
              cleanExercise.exerciseCompleted =
                exercise.exerciseCompleted || false;

              return cleanExercise;
            }) || [];

          return cleanDay;
        }),
        lastUpdated: new Date().toISOString(),
      };

      const progressData = {
        planData: cleanPlanData,
      };

      const response = await fetch(
        `/api/coaching-requests/${id}/assigned-training-plan/${planId}/progress`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(progressData),
        }
      );

      const result = await response.json();
      if (result.success) {
        if (result.plan) {
          setPlan(result.plan);
          updateLastSavedPlan(result.plan);
        } else {
          // Unexpected response format
          console.error(
            "Unexpected API response: missing 'plan' field",
            result
          );
          return { success: false, message: "Unexpected API response format" };
        }
        return { success: true, message: "Progress saved!" };
      } else {
        throw new Error(result.error || "Failed to save progress");
      }
    } catch (error) {
      console.error("Failed to save workout progress:", error);
      return { success: false, message: "Failed to save progress" };
    }
  };

  const handleUpdateExerciseNotes = (dayIdx, exerciseIdx, notes) => {
    setPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan };

      // Ensure the exercise exists
      if (updatedPlan.schedule[dayIdx]?.exercises[exerciseIdx]) {
        // Update exercise notes directly in plan
        updatedPlan.schedule[dayIdx].exercises[exerciseIdx].exerciseNotes =
          notes;
      }

      return updatedPlan;
    });
  };

  const handleUpdateSetData = (dayIdx, exerciseIdx, setIdx, field, value) => {
    setPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan };
      const setData =
        updatedPlan.schedule[dayIdx]?.exercises[exerciseIdx]?.sets?.[setIdx];
      if (setData) {
        setData[field] = value;
        if (field === "completed" && value)
          setData.completedAt = new Date().toISOString();
      }
      return updatedPlan;
    });
  };

  const handleModifyExerciseParams = (dayIdx, exerciseIdx, field, value) => {
    updateExerciseParams(dayIdx, exerciseIdx, field, value);
    if (field === "reps") {
      updateWorkoutDataAfterRepsChange(dayIdx, exerciseIdx, value);
    }
  };

  // FIXED: Simplified Add/Remove Set - NO MORE DUPLICATION
  const [setOperationInProgress, setSetOperationInProgress] = useState(
    new Set()
  );

  // Add Set - robust, immutable
  const handleAddSet = (dayIdx, exerciseIdx) => {
    const operationKey = `add-${dayIdx}-${exerciseIdx}`;

    // Prevent duplicate calls
    if (setOperationInProgress.has(operationKey)) {
      return;
    }

    // Mark operation as in progress
    setSetOperationInProgress((prev) => new Set(prev).add(operationKey));

    try {
      // Safety checks
      if (!plan?.schedule?.[dayIdx]?.exercises?.[exerciseIdx]) {
        return;
      }

      // ONLY UPDATE PLAN STATE - no workoutSession calls to avoid duplication
      setPlan((prev) => {
        const updated = {
          ...prev,
          schedule: prev.schedule.map((day, dIdx) =>
            dIdx === dayIdx
              ? {
                  ...day,
                  exercises: day.exercises.map((ex, eIdx) =>
                    eIdx === exerciseIdx
                      ? {
                          ...ex,
                          sets: [
                            ...(Array.isArray(ex.sets) ? ex.sets : []),
                            {
                              setNumber:
                                (Array.isArray(ex.sets) ? ex.sets.length : 0) +
                                1,
                              weight: "",
                              reps: (ex.reps || 10).toString(),
                              completed: false,
                              notes: "",
                              completedAt: null,
                              restTime: ex.rest || 60,
                            },
                          ],
                        }
                      : ex
                  ),
                }
              : day
          ),
        };
        // Clear operation flag after state update
        setSetOperationInProgress((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(operationKey);
          return newSet;
        });
        return updated;
      });
    } catch (error) {
      console.error("Error in handleAddSet:", error);
    }
  };

  // Remove Set - robust, immutable
  const handleRemoveSet = (dayIdx, exerciseIdx) => {
    const operationKey = `remove-${dayIdx}-${exerciseIdx}`;

    // Prevent duplicate calls
    if (setOperationInProgress.has(operationKey)) {
      return;
    }

    // Mark operation as in progress
    setSetOperationInProgress((prev) => new Set(prev).add(operationKey));

    try {
      // Safety checks
      if (!plan?.schedule?.[dayIdx]?.exercises?.[exerciseIdx]) {
        return;
      }

      const exercise = plan.schedule[dayIdx].exercises[exerciseIdx];
      const currentSets = Array.isArray(exercise.sets)
        ? exercise.sets.length
        : 0;

      if (currentSets <= 1) {
        return;
      }

      // ONLY UPDATE PLAN STATE - no workoutSession calls to avoid duplication
      setPlan((prev) => {
        const updated = {
          ...prev,
          schedule: prev.schedule.map((day, dIdx) =>
            dIdx === dayIdx
              ? {
                  ...day,
                  exercises: day.exercises.map((ex, eIdx) =>
                    eIdx === exerciseIdx &&
                    Array.isArray(ex.sets) &&
                    ex.sets.length > 1
                      ? { ...ex, sets: ex.sets.slice(0, -1) }
                      : ex
                  ),
                }
              : day
          ),
        };
        // Clear operation flag after state update
        setSetOperationInProgress((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(operationKey);
          return newSet;
        });
        return updated;
      });
    } catch (error) {
      console.error("Error in handleRemoveSet:", error);
    }
  };

  // Loading state
  if (loading) {
    return <PlanLoadingState message="Loading Training Plan" />;
  }

  // Error state
  if (trainingPlan.error) {
    return (
      <PlanErrorState
        error={trainingPlan.error}
        onRetry={trainingPlan.retryFetchPlan}
      />
    );
  }

  // No plan state
  if (!plan) {
    return <PlanNotFoundState onGoBack={() => router.back()} />;
  }

  const sessionStats = getTotalSessionStats();

  // Check if current day is completed
  const isCurrentDayCompleted =
    plan?.schedule?.[currentDayIndex]?.workoutStatus === "completed";
  const isActiveSession = isWorkoutStarted && !isCurrentDayCompleted;

  // Add a planKey that changes when plan changes, to force remount of child components
  // Use a stable planKey based on planId to avoid unnecessary remounts
  const planKey = planId || "";

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Contextual Save Bar - Sticky at the very top */}
        {viewMode === VIEW_MODES.OVERVIEW &&
          showSaveBar &&
          !isWorkoutStarted && (
            <ContextualSaveBar
              visible={showSaveBar}
              onSave={handleSavePlan}
              onDiscard={handleDiscardPlan}
              isShaking={isShaking}
              isSaving={isSaving}
              message={
                isSaving ? "Saving changes..." : "You have unsaved changes"
              }
            />
          )}

        <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
          {/* Enhanced Header with Breadcrumb */}
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-zinc-700/50 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-2xl">
            {/* Breadcrumb Navigation */}
            <div className="mb-4 hidden sm:block">
              <nav className="flex items-center gap-2 text-sm flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    handleBreadcrumbNavigation("/trainer/dashboard")
                  }
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
                  type="button"
                  onClick={() =>
                    handleBreadcrumbNavigation(
                      `/trainer/dashboard/clients/${id}`
                    )
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleBackNavigation}
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

                <div className="flex items-center gap-3 sm:gap-4">
                  {plan.coverImage && (
                    <div className="relative flex-shrink-0">
                      <Image
                        src={plan.coverImage}
                        alt={plan.title}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl border border-zinc-600/50 shadow-lg"
                        width={64}
                        height={64}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                        <Icon
                          icon="mdi:weight-lifter"
                          width={8}
                          height={8}
                          className="text-white sm:w-3 sm:h-3"
                        />
                      </div>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 truncate">
                      {plan.title}
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Icon
                          icon="mdi:calendar"
                          width={14}
                          height={14}
                          className="sm:w-4 sm:h-4"
                        />
                        {plan.duration} {plan.durationType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon
                          icon="mdi:star"
                          width={14}
                          height={14}
                          className="sm:w-4 sm:h-4"
                        />
                        {plan.difficultyLevel}
                      </span>
                      {plan.price && (
                        <span className="flex items-center gap-1">
                          <Icon
                            icon="mdi:currency-usd"
                            width={14}
                            height={14}
                            className="sm:w-4 sm:h-4"
                          />
                          ${plan.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex bg-zinc-800/50 rounded-lg p-1 flex-1 sm:flex-none">
                  {[
                    {
                      key: VIEW_MODES.OVERVIEW,
                      label: "Overview",
                      icon: "mdi:view-dashboard",
                      disabled: (() => {
                        // If accessed via mode=review query param, disable overview tab
                        if (typeof window !== "undefined") {
                          const urlParams = new URLSearchParams(
                            window.location.search
                          );
                          return urlParams.get("mode") === "review";
                        }
                        return false;
                      })(),
                    },
                    {
                      key: VIEW_MODES.LIVE,
                      label: "Live",
                      icon: "mdi:play-circle",
                      disabled: !isWorkoutStarted, // Disable if no workout started
                    },
                    {
                      key: VIEW_MODES.REVIEW,
                      label: "Review",
                      icon: "mdi:chart-line",
                      disabled: (() => {
                        // If accessed via mode=review query param, don't disable
                        if (typeof window !== "undefined") {
                          const urlParams = new URLSearchParams(
                            window.location.search
                          );
                          if (urlParams.get("mode") === "review") return false;
                        }
                        return showSaveBar; // Default behavior: disable if save bar is active
                      })(),
                    },
                  ].map((mode) => (
                    <button
                      type="button"
                      key={mode.key}
                      onClick={() =>
                        !mode.disabled && handleViewModeChange(mode.key)
                      }
                      disabled={mode.disabled}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none justify-center ${
                        viewMode === mode.key
                          ? "bg-blue-600 text-white shadow-lg"
                          : mode.disabled
                            ? "text-zinc-500 cursor-not-allowed opacity-50"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                      }`}
                      title={
                        mode.disabled
                          ? "Start a workout from Overview tab to access Live training mode"
                          : ""
                      }
                    >
                      <Icon
                        icon={mode.icon}
                        width={14}
                        height={14}
                        className="sm:w-4 sm:h-4"
                      />
                      <span className="hidden sm:inline">{mode.label}</span>
                      <span className="sm:hidden">
                        {mode.label.slice(0, 3)}
                      </span>
                      {mode.disabled && (
                        <Icon
                          icon="mdi:lock"
                          width={12}
                          height={12}
                          className="ml-0.5 sm:ml-1 sm:w-3 sm:h-3"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Session Timer */}
                <div className="text-center sm:text-right bg-zinc-800/30 rounded-lg px-2 sm:px-4 py-2 sm:py-3 w-full sm:w-auto">
                  <div className="text-white text-lg sm:text-xl font-mono font-bold">
                    {isActiveSession && workoutSession.getSessionDuration
                      ? workoutSession.getSessionDuration()
                      : "00:00"}
                  </div>
                  <div className="text-zinc-400 text-xs">
                    {isActiveSession ? "Session Time" : "No Active Session"}
                  </div>
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

          {/* Main Content */}
          {viewMode === VIEW_MODES.OVERVIEW ? (
            <TrainingPlanOverview
              key={planKey}
              plan={plan}
              setPlan={setPlan}
              workoutSession={workoutSession}
              onStartWorkout={handleStartWorkout}
              onAddTrainingDay={handleAddTrainingDay}
              onShowExerciseLibrary={handleShowExerciseLibrary}
              onSaveProgress={handleSaveWorkoutProgress}
              onUpdateSetData={handleUpdateSetData}
              onModifyExerciseParams={handleModifyExerciseParams}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
              safeNavigate={safeNavigate}
              onViewResults={(dayIdx) => {
                setSelectedReviewDay(dayIdx);
                setViewMode(VIEW_MODES.REVIEW);
              }}
            />
          ) : viewMode === VIEW_MODES.REVIEW ? (
            <WorkoutReview
              key={planKey}
              plan={plan}
              workoutSession={workoutSession}
              selectedDayIndex={selectedReviewDay}
              onClose={() => {
                setSelectedReviewDay(null);
                setViewMode(VIEW_MODES.OVERVIEW);
              }}
              onViewResults={(dayIdx) => {
                setSelectedReviewDay(dayIdx);
              }}
            />
          ) : (
            <LiveWorkoutMode
              key={planKey}
              plan={plan}
              setPlan={setPlan}
              workoutSession={workoutSession}
              viewMode={viewMode}
              onVideoOpen={handleVideoOpen}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
              onUpdateExerciseParams={handleModifyExerciseParams}
              onUpdateSetData={handleUpdateSetData}
              onUpdateExerciseNotes={handleUpdateExerciseNotes}
              onModifyExerciseParams={handleModifyExerciseParams}
              onShowExerciseLibrary={handleShowExerciseLibrary}
              onRemoveExercise={removeExercise}
              onCompleteWorkout={handleCompleteWorkoutSession}
              onEndWorkout={handleEndWorkout}
              onSaveProgress={handleSaveWorkoutProgress}
              onExitLiveMode={() => handleViewModeChange(VIEW_MODES.OVERVIEW)}
              onViewResults={(dayIdx) => {
                setSelectedReviewDay(dayIdx);
                setViewMode(VIEW_MODES.REVIEW);
              }}
              planId={planId}
              clientId={id}
            />
          )}

          {/* Exercise Library Modal */}
          {showExerciseLibraryModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 rounded-2xl p-6 max-w-3xl w-full border border-zinc-700 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {pendingAddExerciseDayIdx === -1
                      ? "Create New Training Day"
                      : editingExercise
                        ? "Replace Exercise"
                        : "Add Exercise"}
                  </h2>
                  <button
                    type="button"
                    onClick={closeExerciseLibraryModal}
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
                  onSelectExercise={handleExerciseSelection}
                  onClearSelection={() => setSelectedExercisesForNewDay([])}
                  onClose={closeExerciseLibraryModal}
                />

                {/* Create New Day Button */}
                {pendingAddExerciseDayIdx === -1 &&
                  selectedExercisesForNewDay.length > 0 && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={createNewDayWithSelectedExercises}
                        variant="primary"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        leftIcon={
                          <Icon icon="mdi:plus-circle" width={20} height={20} />
                        }
                      >
                        Create Day with {selectedExercisesForNewDay.length}{" "}
                        Exercise
                        {selectedExercisesForNewDay.length !== 1 ? "s" : ""}
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Video Modal */}
          <VideoModal
            isOpen={showVideoModal}
            onClose={handleVideoClose}
            videoUrl={currentVideoUrl}
            exercise={workoutSession.getCurrentExercise()}
          />

          {/* End Workout Confirmation Modal */}
          <Modal
            isOpen={showEndWorkoutModal}
            onClose={handleCancelEndWorkout}
            title="Complete Workout"
            message={
              <div className="text-zinc-300">
                <p className="mb-4">
                  Are you sure you want to complete and finish this workout
                  session?
                </p>
                <p className="text-sm text-zinc-400">
                  Your progress will be saved and the workout day will be marked
                  as completed.
                </p>
                <textarea
                  className="mt-4 w-full p-2 border border-zinc-600 rounded-md bg-zinc-800 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes for the workout session (optional)"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  rows={3}
                />
              </div>
            }
            onConfirm={handleConfirmEndWorkout}
            confirmButtonText="Complete Workout"
            cancelButtonText="Cancel"
          />
        </div>
      </div>
    </DndProvider>
  );
}
