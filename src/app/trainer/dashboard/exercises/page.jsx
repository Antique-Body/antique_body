"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import {
  ExerciseCard,
  ExerciseModal,
  ExerciseFilters,
} from "@/components/custom/dashboard/trainer/pages/exercises/components";
import { NoResults, Pagination } from "@/components/custom/shared";
import { useExercises } from "@/hooks";

export default function ExercisesPage() {
  const {
    exercises,
    loading,
    error,
    pagination,
    filters,
    fetchTrainerExercisesWithFilters,
    updateFilters,
    changePage,
    clearFilters,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useExercises();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  // Load exercises data on component mount - only once
  useEffect(() => {
    fetchTrainerExercisesWithFilters();
  }, [fetchTrainerExercisesWithFilters]); // Include fetchTrainerExercisesWithFilters in dependencies

  // Handle page change
  const handlePageChange = async (newPage) => {
    await changePage(newPage);
  };

  // Handle creating a new exercise
  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveExercise = async (exerciseData) => {
    if (modalMode === "create") {
      const result = await createExercise(exerciseData);
      if (result.success) {
        setIsModalOpen(false);
      }
    } else if (modalMode === "edit") {
      const result = await updateExercise(exerciseData.id, exerciseData);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    const result = await deleteExercise(exerciseId);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  // Loading state
  if (loading && exercises.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B00] border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading exercises...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && exercises.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500"
            width={48}
            height={48}
          />
          <p className="mt-4 text-lg font-medium text-white">
            Failed to load exercises
          </p>
          <p className="mt-2 text-zinc-400">{error}</p>
          <Button
            variant="orangeFilled"
            size="large"
            className="h-12 w-[120px] mt-4"
            onClick={() => fetchTrainerExercisesWithFilters()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-6 relative">
      {/* Header with create button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
        <Button
          variant="orangeFilled"
          size="large"
          className="h-12 flex items-center justify-center gap-2"
          onClick={handleCreateExercise}
        >
          <Icon icon="mdi:plus" width={20} height={20} />
          <span className="text-md text-nowrap font-medium">
            Create Exercise
          </span>
        </Button>
      </div>

      {/* Filters */}
      <ExerciseFilters
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        totalExercises={pagination.total}
      />

      {/* Exercise Cards or No Results */}
      <div className="min-h-[400px]">
        {exercises.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-8">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onView={() => handleViewExercise(exercise)}
                onEdit={() => handleEditExercise(exercise)}
                onDelete={handleDeleteExercise}
              />
            ))}
          </div>
        ) : (
          <NoResults
            onClearFilters={clearFilters}
            variant="orange"
            title="No exercises match your criteria"
            message="We couldn't find any exercises matching your current filters. Try adjusting your search criteria or clearing all filters."
          />
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          variant="orange"
        />
      )}

      {/* Exercise Modal */}
      <ExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        exercise={selectedExercise}
        onSave={handleSaveExercise}
        onDelete={handleDeleteExercise}
      />

      {/* Floating action button - removed in favor of consistent header button */}
    </div>
  );
}
