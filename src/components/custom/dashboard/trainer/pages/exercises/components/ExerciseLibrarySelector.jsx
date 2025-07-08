"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { AnatomicalViewer } from "./AnatomicalViewer";
import exerciseLibrary from "./exerciseLibrary.json";

import { Button, FormField, InfoBanner } from "@/components/common";
import { formatMuscleDisplayName } from "@/utils/muscleMapper";
export const ExerciseLibrarySelector = ({
  exercises = [],
  loading = false,
  searchLoading = false,
  searchTerm = "",
  onSearch = () => {},
  onSelectExercise,
  onClose,
  onScroll = () => {},
  hasMore = false,
  useStaticData = false, // New prop to control data source
  selectedExercises = [], // Add this prop to receive selected exercises from parent
  onClearSelection = () => {}, // Add callback for clearing all selections
}) => {
  const listRef = useRef(null);
  const [staticSearchTerm, setStaticSearchTerm] = useState("");
  const [filteredStaticExercises, setFilteredStaticExercises] =
    useState(exerciseLibrary);

  // Determine which exercises to display
  const displayExercises = useStaticData ? filteredStaticExercises : exercises;
  const displaySearchTerm = useStaticData ? staticSearchTerm : searchTerm;
  const displayLoading = useStaticData ? false : loading;
  const displaySearchLoading = useStaticData ? false : searchLoading;
  const displayHasMore = useStaticData ? false : hasMore;

  // Handle static search
  useEffect(() => {
    if (!useStaticData) return;

    if (!staticSearchTerm.trim()) {
      setFilteredStaticExercises(exerciseLibrary);
      return;
    }

    const lowerCaseSearch = staticSearchTerm.toLowerCase();
    const filtered = exerciseLibrary.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(lowerCaseSearch) ||
        exercise.description.toLowerCase().includes(lowerCaseSearch) ||
        exercise.muscleGroups.some((muscle) =>
          muscle.toLowerCase().includes(lowerCaseSearch)
        )
    );

    setFilteredStaticExercises(filtered);
  }, [staticSearchTerm, useStaticData]);

  // Handle search input change
  const handleSearchChange = (value) => {
    if (useStaticData) {
      setStaticSearchTerm(value);
    } else {
      onSearch(value);
    }
  };

  // ESC key close
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current || displayLoading || !displayHasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        onScroll();
      }
    };
    const ref = listRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [displayLoading, displayHasMore, onScroll]);

  return (
    <div className="flex flex-col h-full">
      {/* Info message about templates */}
      <div className="mb-4">
        <InfoBanner
          icon="mdi:information-outline"
          title={
            useStaticData ? "Pre-built exercise templates" : "Exercise library"
          }
          subtitle={
            useStaticData
              ? "These are template exercises with placeholder content. Customize with your own media as needed."
              : "Browse and select exercises from your library."
          }
          variant="info"
        />
      </div>

      {/* Search input */}
      <div className="mb-4">
        <div className="relative">
          <FormField
            type="text"
            value={displaySearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={
              useStaticData
                ? "Search templates..."
                : "Search exercise library..."
            }
            prefixIcon="mdi:magnify"
            className="mb-0"
          />
          {displaySearchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FF6B00]/30 border-t-[#FF6B00]" />
            </div>
          )}
        </div>
      </div>

      {/* Exercise list */}
      <div
        className="flex-1 overflow-y-auto pr-2 -mr-2"
        ref={listRef}
        style={{ minHeight: 200, maxHeight: 400 }}
      >
        {displayExercises.length > 0 || displaySearchLoading ? (
          <div className="grid grid-cols-1 gap-3">
            {displayExercises.map((exercise) => {
              const isSelected = selectedExercises.find(
                (e) => e.id === exercise.id
              );

              return (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => onSelectExercise(exercise)}
                  className={`w-full text-left bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
                    isSelected
                      ? "ring-2 ring-orange-500 bg-orange-500/10 border-orange-500/50"
                      : ""
                  }`}
                >
                  <div className="flex flex-row gap-4 items-center">
                    {/* AnatomicalViewer on the left - larger size */}
                    <div className="h-auto w-16 sm:w-20 md:w-24 lg:w-28 flex-shrink-0">
                      {exercise.imageUrl ? (
                        <div className="w-full h-full rounded-lg overflow-hidden bg-zinc-600">
                          <Image
                            src={exercise.imageUrl}
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                            width={100}
                            height={100}
                          />
                        </div>
                      ) : (
                        <AnatomicalViewer
                          exerciseName={exercise.name}
                          muscleGroups={exercise.muscleGroups || []}
                          showBothViews={false}
                          size="medium"
                          interactive={false}
                          showMuscleInfo={false}
                          showExerciseInfo={false}
                          darkMode={true}
                          compact={false}
                        />
                      )}
                    </div>
                    {/* Textual info on the right */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold text-sm sm:text-base">
                          {exercise.name}
                        </h3>
                        <div className="flex gap-1">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              exercise.type === "strength"
                                ? "bg-purple-900/40 text-purple-300"
                                : exercise.type === "bodyweight"
                                ? "bg-green-900/40 text-green-300"
                                : exercise.type === "cardio"
                                ? "bg-blue-900/40 text-blue-300"
                                : exercise.type === "flexibility"
                                ? "bg-violet-900/40 text-violet-300"
                                : exercise.type === "balance"
                                ? "bg-pink-900/40 text-pink-300"
                                : "bg-gray-900/40 text-gray-300"
                            }`}
                          >
                            {exercise.type.charAt(0).toUpperCase() +
                              exercise.type.slice(1)}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              exercise.level === "beginner"
                                ? "bg-green-900/40 text-green-300"
                                : exercise.level === "intermediate"
                                ? "bg-orange-900/40 text-orange-300"
                                : "bg-red-900/40 text-red-300"
                            }`}
                          >
                            {exercise.level.charAt(0).toUpperCase() +
                              exercise.level.slice(1)}
                          </span>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs sm:text-sm mb-2 line-clamp-2">
                        {exercise.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {exercise.muscleGroups
                          .slice(0, 3)
                          .map((muscle, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-orange-900/20 text-orange-300 rounded"
                            >
                              {formatMuscleDisplayName(muscle)}
                            </span>
                          ))}
                        {exercise.muscleGroups.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-zinc-700 text-zinc-400 rounded">
                            +{exercise.muscleGroups.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Icon
                            icon="mdi:check"
                            className="w-4 h-4 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
            {displayLoading && (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-2" />
                <p className="text-gray-400 text-sm">
                  Loading more exercises...
                </p>
              </div>
            )}
            {!displayHasMore &&
              !displayLoading &&
              displayExercises.length > 0 && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Icon
                    icon="mdi:check-circle-outline"
                    className="w-8 h-8 text-green-400 mb-2"
                  />
                  <p className="text-green-300 text-sm">No more results</p>
                </div>
              )}
          </div>
        ) : displaySearchLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-4" />
            <p className="text-gray-400 text-lg">Searching exercises...</p>
          </div>
        ) : displayLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-4" />
            <p className="text-gray-400 text-lg">Loading exercises...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Icon
              icon="mdi:dumbbell-off"
              className="w-12 h-12 text-zinc-600 mb-2"
            />
            <p className="text-zinc-400">
              No exercises found
              {displaySearchTerm ? ` matching "${displaySearchTerm}"` : ""}
            </p>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleSearchChange("")}
              className="mt-2 h-8 px-3"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>

      {/* Selection summary */}
      {selectedExercises.length > 0 && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-orange-300 text-sm font-medium">
              {selectedExercises.length} exercise
              {selectedExercises.length !== 1 ? "s" : ""} selected
            </span>
            <Button
              variant="secondary"
              size="small"
              onClick={onClearSelection}
              className="text-xs h-6 px-2"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
