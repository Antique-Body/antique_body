"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { FullScreenLoader, ContextualSaveBar } from "@/components";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ExerciseLibrarySelector } from "@/components/custom/dashboard/trainer/pages/exercises/components";
import { VideoModal } from "@/components/modals/VideoModal";
import { LiveWorkoutMode } from "@/components/training/LiveWorkoutMode";
import { TrainingPlanOverview } from "@/components/training/TrainingPlanOverview";
import { WorkoutReview } from "@/components/training/WorkoutReview";
import { VIEW_MODES } from "@/constants/trainingConstants";
import { useTrainingPlan } from "@/hooks/useTrainingPlan";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { createNewTrainingDay } from "@/utils/trainingUtils";

export default function AssignedPlanTrackingPage({ params }) {
  const router = useRouter();
  // Unwrap params for Next.js 15 compatibility
  const unwrappedParams = React.use ? React.use(params) : params;
  const { assignedPlanId } = unwrappedParams;

  // Training plan management - use dummy clientId since we don't need it with new API
  const trainingPlan = useTrainingPlan(undefined, assignedPlanId);
  const {
    plan,
    loading,
    showSaveBar,
    isSaving,
    isShaking,
    handleSavePlan,
    handleDiscardPlan,
    safeNavigate,
    addExercise,
    replaceExercise,
    addTrainingDay,
    updateExerciseParams,
  } = trainingPlan;

  // Workout session management
  const clientId = React.useMemo(() => {
    // Try to get clientId from plan object if available
    if (plan && plan.clientId) return plan.clientId;
    // If plan is not loaded yet, return undefined
    return undefined;
  }, [plan]);

  const workoutSession = useWorkoutSession(plan, assignedPlanId, clientId);
  const {
    currentDayIndex,
    setCurrentDayIndex,
    isWorkoutStarted,
    startWorkout,
    getTotalSessionStats,
  } = workoutSession;

  // UI state
  const [viewMode, setViewMode] = React.useState(VIEW_MODES.OVERVIEW);
  const [selectedReviewDay, setSelectedReviewDay] = React.useState(null);

  // End workout modal state
  const [showEndWorkoutModal, setShowEndWorkoutModal] = React.useState(false);
  const [workoutNotes, setWorkoutNotes] = React.useState("");

  // Exercise library modal state
  const [showExerciseLibraryModal, setShowExerciseLibraryModal] =
    React.useState(false);
  const [pendingAddExerciseDayIdx, setPendingAddExerciseDayIdx] =
    React.useState(null);
  const [editingExercise, setEditingExercise] = React.useState(null);
  const [selectedExercisesForNewDay, setSelectedExercisesForNewDay] =
    React.useState([]);

  // Video modal state
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = React.useState(null);

  // Safe navigation handlers
  const handleBackNavigation = () => {
    safeNavigate(() => router.back());
  };

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
  };

  const handleStartWorkout = (dayIdx = currentDayIndex) => {
    if (!plan || !plan.schedule || !plan.schedule[dayIdx]) {
      console.error("Invalid day index or plan data");
      return;
    }

    setCurrentDayIndex(dayIdx);
    startWorkout(dayIdx);
  };

  const handleAddTrainingDay = () => {
    const newDay = createNewTrainingDay();
    addTrainingDay(newDay);
  };

  const handleShowExerciseLibrary = (
    dayIdx,
    mode = "add",
    exerciseIdx = null
  ) => {
    setPendingAddExerciseDayIdx(dayIdx);
    setEditingExercise(mode === "edit" ? { dayIdx, exerciseIdx } : null);
    setShowExerciseLibraryModal(true);
  };

  const handleExerciseSelection = (selectedExercise) => {
    if (editingExercise) {
      // Replace existing exercise
      replaceExercise(
        editingExercise.dayIdx,
        editingExercise.exerciseIdx,
        selectedExercise
      );
      setEditingExercise(null);
    } else {
      // Add new exercise
      addExercise(pendingAddExerciseDayIdx, selectedExercise);
    }
    setShowExerciseLibraryModal(false);
    setPendingAddExerciseDayIdx(null);
  };

  const handleExerciseSelectionForNewDay = (selectedExercise) => {
    setSelectedExercisesForNewDay([
      ...selectedExercisesForNewDay,
      selectedExercise,
    ]);
  };

  const createNewDayWithSelectedExercises = () => {
    if (selectedExercisesForNewDay.length > 0) {
      const newDay = createNewTrainingDay();
      newDay.exercises = selectedExercisesForNewDay;
      addTrainingDay(newDay);
      setSelectedExercisesForNewDay([]);
      setShowExerciseLibraryModal(false);
    }
  };

  const closeExerciseLibraryModal = () => {
    setShowExerciseLibraryModal(false);
    setPendingAddExerciseDayIdx(null);
    setEditingExercise(null);
    setSelectedExercisesForNewDay([]);
  };

  const handleVideoOpen = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const handleVideoClose = () => {
    setShowVideoModal(false);
    setCurrentVideoUrl(null);
  };

  const handleEndWorkout = () => {
    setShowEndWorkoutModal(true);
  };

  const handleConfirmEndWorkout = async () => {
    try {
      const _sessionStats = getTotalSessionStats();
      const _completionData = {
        completedAt: new Date().toISOString(),
        notes: workoutNotes,
        stats: _sessionStats,
      };

      // Here you would typically save the workout completion data

      setShowEndWorkoutModal(false);
      setWorkoutNotes("");
    } catch (error) {
      console.error("Error completing workout:", error);
    }
  };

  const handleCancelEndWorkout = () => {
    setShowEndWorkoutModal(false);
    setWorkoutNotes("");
  };

  const handleSaveWorkoutProgress = async () => {
    try {
      // TODO: Implement workout progress saving logic here
    } catch (error) {
      console.error("Error saving workout progress:", error);
    }
  };

  const handleUpdateExerciseNotes = (dayIdx, exerciseIdx, notes) => {
    updateExerciseParams(dayIdx, exerciseIdx, "notes", notes);
  };

  const handleUpdateSetData = (
    _dayIdx,
    _exerciseIdx,
    _setIdx,
    _field,
    _value
  ) => {
    // This would update the set data in the workout session
  };

  const handleModifyExerciseParams = (dayIdx, exerciseIdx, field, value) => {
    updateExerciseParams(dayIdx, exerciseIdx, field, value);
  };

  const handleAddSet = (_dayIdx, _exerciseIdx) => {
    // This would add a new set to the exercise
  };

  const handleRemoveSet = (_dayIdx, _exerciseIdx) => {
    // This would remove a set from the exercise
  };

  if (loading) {
    return <FullScreenLoader text="Loading Training Plan" />;
  }

  if (trainingPlan.error) {
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
          <p className="text-red-400 mb-4">{trainingPlan.error}</p>
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!plan) {
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
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-zinc-700/50 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="secondary"
                onClick={handleBackNavigation}
                leftIcon={<Icon icon="mdi:arrow-left" width={18} height={18} />}
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
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* View Mode Tabs */}
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-4">
              <div className="flex space-x-1">
                {Object.values(VIEW_MODES).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "primary" : "secondary"}
                    onClick={() => handleViewModeChange(mode)}
                    size="small"
                    className="flex-1"
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Training Plan Content */}
            {viewMode === VIEW_MODES.OVERVIEW && (
              <TrainingPlanOverview
                plan={plan}
                onStartWorkout={handleStartWorkout}
                onAddTrainingDay={handleAddTrainingDay}
                onShowExerciseLibrary={handleShowExerciseLibrary}
                onVideoOpen={handleVideoOpen}
                isWorkoutStarted={isWorkoutStarted}
                currentDayIndex={currentDayIndex}
              />
            )}

            {viewMode === VIEW_MODES.LIVE && (
              <LiveWorkoutMode
                plan={plan}
                currentDayIndex={currentDayIndex}
                isWorkoutStarted={isWorkoutStarted}
                onStartWorkout={handleStartWorkout}
                onEndWorkout={handleEndWorkout}
                onSaveProgress={handleSaveWorkoutProgress}
                onUpdateSetData={handleUpdateSetData}
                onAddSet={handleAddSet}
                onRemoveSet={handleRemoveSet}
                onUpdateExerciseNotes={handleUpdateExerciseNotes}
                onModifyExerciseParams={handleModifyExerciseParams}
                onVideoOpen={handleVideoOpen}
              />
            )}

            {viewMode === VIEW_MODES.REVIEW && (
              <WorkoutReview
                plan={plan}
                selectedDay={selectedReviewDay}
                onDaySelect={setSelectedReviewDay}
                onVideoOpen={handleVideoOpen}
              />
            )}
          </div>
        </div>

        {/* Contextual Save Bar */}
        {showSaveBar && (
          <ContextualSaveBar
            onSave={handleSavePlan}
            onDiscard={handleDiscardPlan}
            isSaving={isSaving}
            isShaking={isShaking}
          />
        )}

        {/* Exercise Library Modal */}
        <Modal
          isOpen={showExerciseLibraryModal}
          onClose={closeExerciseLibraryModal}
          title="Exercise Library"
          size="large"
        >
          <ExerciseLibrarySelector
            onExerciseSelect={handleExerciseSelection}
            onExerciseSelectForNewDay={handleExerciseSelectionForNewDay}
            onCreateNewDay={createNewDayWithSelectedExercises}
            selectedExercisesForNewDay={selectedExercisesForNewDay}
          />
        </Modal>

        {/* End Workout Modal */}
        <Modal
          isOpen={showEndWorkoutModal}
          onClose={handleCancelEndWorkout}
          title="End Workout"
        >
          <div className="space-y-4">
            <p className="text-zinc-300">
              Are you sure you want to end this workout session?
            </p>
            <textarea
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="Add workout notes (optional)"
              className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400"
              rows={3}
            />
            <div className="flex space-x-3">
              <Button onClick={handleConfirmEndWorkout} variant="primary">
                End Workout
              </Button>
              <Button onClick={handleCancelEndWorkout} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Video Modal */}
        <VideoModal
          isOpen={showVideoModal}
          onClose={handleVideoClose}
          videoUrl={currentVideoUrl}
        />
      </div>
    </DndProvider>
  );
}
