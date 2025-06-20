"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import {
  ExerciseCard,
  ExerciseModal,
  ExerciseStats,
} from "@/components/custom/dashboard/trainer/pages/exercises/components";
import { CreateExerciseCard } from "@/components/custom/dashboard/trainer/pages/exercises/components/CreateExerciseCard";
import mockExercises from "@/components/custom/dashboard/trainer/pages/exercises/data/mockExercises";
import {
  NoResults,
  Pagination,
  SortControls,
} from "@/components/custom/shared";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 12;

  // Exercise statistics
  const [stats, setStats] = useState([
    { title: "Total Exercises", count: 0, icon: "mdi:dumbbell" },
    {
      title: "Strength",
      count: 0,
      icon: "mdi:weight-lifter",
      iconColor: "text-red-500",
    },
    {
      title: "Cardio",
      count: 0,
      icon: "mdi:run-fast",
      iconColor: "text-blue-500",
    },
    {
      title: "Flexibility",
      count: 0,
      icon: "mdi:yoga",
      iconColor: "text-green-500",
    },
    {
      title: "Balance",
      count: 0,
      icon: "mdi:human-handsup",
      iconColor: "text-purple-500",
    },
  ]);

  // Filter options for the SortControls component
  const filterOptions = [
    {
      name: "type",
      label: "Type",
      options: [
        { value: "", label: "All Types" },
        { value: "strength", label: "Strength" },
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
    const loadExercises = async () => {
      try {
        // In a real app, you would fetch from an API
        // For now, use mock data with a delay to simulate loading
        setTimeout(() => {
          setExercises(mockExercises);
          setFilteredExercises(mockExercises);
          setLoading(false);

          // Update stats
          updateStats(mockExercises);
        }, 800);
      } catch (error) {
        console.error("Error loading exercises:", error);
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  // Update exercise statistics
  const updateStats = (exercisesList) => {
    const newStats = [...stats];

    // Total exercises
    newStats[0].count = exercisesList.length;

    // Count by type
    const strengthCount = exercisesList.filter(
      (ex) => ex.type === "strength"
    ).length;
    const cardioCount = exercisesList.filter(
      (ex) => ex.type === "cardio"
    ).length;
    const flexibilityCount = exercisesList.filter(
      (ex) => ex.type === "flexibility"
    ).length;
    const balanceCount = exercisesList.filter(
      (ex) => ex.type === "balance"
    ).length;

    newStats[1].count = strengthCount;
    newStats[2].count = cardioCount;
    newStats[3].count = flexibilityCount;
    newStats[4].count = balanceCount;

    setStats(newStats);
  };

  // Filter exercises based on search and filters
  useEffect(() => {
    if (!exercises.length) return;

    let results = [...exercises];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchLower) ||
          exercise.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filters.type) {
      results = results.filter((exercise) => exercise.type === filters.type);
    }

    // Apply level filter
    if (filters.level) {
      results = results.filter((exercise) => exercise.level === filters.level);
    }

    // Apply location filter
    if (filters.location) {
      results = results.filter(
        (exercise) => exercise.location === filters.location
      );
    }

    // Apply equipment filter
    if (filters.equipment) {
      const requiresEquipment = filters.equipment === "true";
      results = results.filter(
        (exercise) => exercise.equipment === requiresEquipment
      );
    }

    // Apply sorting
    results = sortExercises(results);

    setFilteredExercises(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, exercises, sortOption, sortOrder]);

  // Sort exercises
  const sortExercises = (exercisesToSort) =>
    [...exercisesToSort].sort((a, b) => {
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
          comparison = new Date(a.dateCreated) - new Date(b.dateCreated);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
  const handleSaveExercise = (exerciseData) => {
    if (modalMode === "create") {
      // In a real app, you would send to API
      const newExercise = {
        ...exerciseData,
        id: Date.now().toString(),
        dateCreated: new Date().toISOString(),
      };

      const updatedExercises = [...exercises, newExercise];
      setExercises(updatedExercises);
      updateStats(updatedExercises);
    } else if (modalMode === "edit") {
      // Update existing exercise
      const updatedExercises = exercises.map((ex) =>
        ex.id === exerciseData.id ? { ...exerciseData } : ex
      );

      setExercises(updatedExercises);
      updateStats(updatedExercises);
    }

    setIsModalOpen(false);
  };

  // Handle deleting an exercise
  const handleDeleteExercise = (exerciseId) => {
    const updatedExercises = exercises.filter((ex) => ex.id !== exerciseId);
    setExercises(updatedExercises);
    updateStats(updatedExercises);
    setIsModalOpen(false);
  };

  // Pagination logic
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  // Create Exercise button for SortControls
  const createExerciseButton = (
    <Button
      variant="primary"
      size="small"
      onClick={handleCreateExercise}
      className="flex items-center gap-2"
    >
      <Icon icon="mdi:plus" className="w-5 h-5" />
      <span>New Exercise</span>
    </Button>
  );

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

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-6">
      {/* Search and Filter Controls */}
      <SortControls
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        itemCount={filteredExercises.length}
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
        actionButton={createExerciseButton}
        itemLabel="exercises"
        className="sticky top-0 z-30"
      />

      {/* Exercise Cards */}
      {currentExercises.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
          {currentExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onView={() => handleViewExercise(exercise)}
              onEdit={() => handleEditExercise(exercise)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
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
    </div>
  );
}
