"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import {
  ExerciseCard,
  ExerciseModal,
} from "@/components/custom/dashboard/trainer/pages/exercises/components";
import { CreateExerciseCard } from "@/components/custom/dashboard/trainer/pages/exercises/components/CreateExerciseCard";
import { NoResults, SortControls } from "@/components/custom/shared";
import { useExercises } from "@/hooks";

export default function ExercisesPage() {
  const {
    exercises,
    loading,
    error,
    fetchTrainerExercises,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useExercises();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // view, edit, create

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    level: "",
    location: "",
    equipment: "",
  });

  // Sorting
  const [sortOption, setSortOption] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter options for the SortControls component
  const filterOptions = [
    {
      name: "type",
      label: "Type",
      options: [
        { value: "", label: "All Types" },
        { value: "strength", label: "Strength" },
        { value: "bodyweight", label: "Bodyweight" },
        { value: "cardio", label: "Cardio" },
        { value: "flexibility", label: "Flexibility" },
        { value: "balance", label: "Balance" },
      ],
    },
    {
      name: "level",
      label: "Level",
      options: [
        { value: "", label: "All Levels" },
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
      ],
    },
    {
      name: "location",
      label: "Location",
      options: [
        { value: "", label: "All Locations" },
        { value: "gym", label: "Gym" },
        { value: "home", label: "Home" },
        { value: "outdoor", label: "Outdoor" },
      ],
    },
    {
      name: "equipment",
      label: "Equipment",
      options: [
        { value: "", label: "All Equipment" },
        { value: "true", label: "Required" },
        { value: "false", label: "No Equipment" },
      ],
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "type", label: "Type" },
    { value: "level", label: "Level" },
    { value: "dateCreated", label: "Date Created" },
  ];

  // Load exercises data
  useEffect(() => {
    fetchTrainerExercises();
  }, [fetchTrainerExercises]);

  // Filter exercises based on search and filters
  const filteredExercises = exercises.filter((exercise) => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const hasNameMatch = exercise.name.toLowerCase().includes(searchLower);
      const hasDescriptionMatch = exercise.description
        .toLowerCase()
        .includes(searchLower);
      const hasMuscleGroupMatch = exercise.muscleGroups.some((muscle) =>
        muscle.name.toLowerCase().includes(searchLower)
      );

      if (!hasNameMatch && !hasDescriptionMatch && !hasMuscleGroupMatch) {
        return false;
      }
    }

    // Apply type filter
    if (filters.type && exercise.type !== filters.type) {
      return false;
    }

    // Apply level filter
    if (filters.level && exercise.level !== filters.level) {
      return false;
    }

    // Apply location filter
    if (filters.location && exercise.location !== filters.location) {
      return false;
    }

    // Apply equipment filter
    if (filters.equipment) {
      const requiresEquipment = filters.equipment === "true";
      if (exercise.equipment !== requiresEquipment) {
        return false;
      }
    }

    return true;
  });

  // Sort exercises
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    let comparison = 0;

    switch (sortOption) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      case "level": {
        const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        comparison = levelOrder[a.level] - levelOrder[b.level];
        break;
      }
      case "dateCreated":
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({
      type: "",
      level: "",
      location: "",
      equipment: "",
    });
  };

  // Open modal to create a new exercise
  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Open modal to view exercise details
  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setModalMode("view");
    setIsModalOpen(true);
  };

  // Open modal to edit an exercise
  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Handle saving exercise (create or update)
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

  // Handle deleting an exercise
  const handleDeleteExercise = async (exerciseId) => {
    const result = await deleteExercise(exerciseId);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B00] border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <button
            className="mt-4 rounded-lg bg-[#FF6B00] px-4 py-2 text-white hover:bg-[#FF8A00] transition-colors"
            onClick={() => fetchTrainerExercises()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-6">
      {/* Search and Filter Controls */}
      <SortControls
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        itemCount={sortedExercises.length}
        sortOptions={sortOptions}
        variant="orange"
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        searchPlaceholder="Search exercises by name..."
        enableLocation={false}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        onClearFilters={handleClearFilters}
        actionButton={
          <Button
            variant="primary"
            size="small"
            onClick={handleCreateExercise}
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:plus" className="w-5 h-5" />
            <span>New Exercise</span>
          </Button>
        }
        itemLabel="exercises"
        className="mb-2"
      />

      {/* Exercise Cards */}
      {sortedExercises.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
          {sortedExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onView={() => handleViewExercise(exercise)}
              onEdit={() => handleEditExercise(exercise)}
              onDelete={handleDeleteExercise}
            />
          ))}
          <CreateExerciseCard onClick={handleCreateExercise} />
        </div>
      ) : (
        <NoResults
          onClearFilters={handleClearFilters}
          variant="orange"
          title="No exercises match your criteria"
          message="We couldn't find any exercises matching your current filters. Try adjusting your search criteria or clearing all filters."
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
    </div>
  );
}
