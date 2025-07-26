"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { AnatomicalViewer } from "./AnatomicalViewer";
import exerciseLibrary from "./exerciseLibrary.json";

import { Button, FormField, InfoBanner } from "@/components/common";
import { formatMuscleDisplayName } from "@/utils/muscleMapper";
export const ExerciseLibrarySelector = ({
  searchLoading = false,
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

  // State for dynamic exercises from the database
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  // Removed unused error and setError state

  // Determine which exercises to display
  const displayExercises = useStaticData ? filteredStaticExercises : exercises;
  const displaySearchTerm = useStaticData ? staticSearchTerm : search;
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

  // Fetch iz baze kad je useStaticData false
  useEffect(() => {
    if (!useStaticData) {
      setLoading(true);
      // Reset error state before fetching
      const controller = new AbortController();
      fetch(
        `/api/users/trainer/exercises?search=${encodeURIComponent(search)}`,
        { signal: controller.signal }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch exercises");
          return res.json();
        })
        .then((data) => {
          setExercises(data.exercises || []);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            // setError(
            //   err.message || "An error occurred while fetching exercises."
            // );
            setLoading(false);
          }
        });
      return () => {
        controller.abort();
      };
    }
  }, [useStaticData, search]);

  // Handle search input change
  const handleSearchChange = (value) => {
    if (useStaticData) {
      setStaticSearchTerm(value);
    } else {
      setSearch(value);
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayExercises.map((exercise) => {
                const isSelected = selectedExercises.find(
                  (e) => e.id === exercise.id
                );

                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => onSelectExercise(exercise)}
                    className={`w-full text-left bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 hover:from-zinc-700/80 hover:to-zinc-800/80 border border-zinc-700/50 hover:border-orange-500/40 rounded-2xl p-2 md:p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-md hover:shadow-2xl backdrop-blur-md flex flex-row items-stretch ${
                      isSelected
                        ? "ring-2 ring-orange-500 bg-orange-500/10 border-orange-500/50"
                        : ""
                    }`}
                  >
                    {/* Slika/AnatomicalViewer lijevo, full height */}
                    <div className="h-full w-20 md:w-24 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-700 border border-zinc-600 shadow-inner flex items-center justify-center">
                      {exercise.imageUrl ? (
                        <Image
                          src={exercise.imageUrl}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                          width={96}
                          height={144}
                        />
                      ) : (
                        <AnatomicalViewer
                          exerciseName={exercise.name}
                          muscleGroups={exercise.muscleGroups || []}
                          showBothViews={false}
                          size="small"
                          interactive={false}
                          showMuscleInfo={false}
                          showExerciseInfo={false}
                          darkMode={false}
                          compact={true}
                          bodyColor="white"
                          className="w-full h-full"
                        />
                      )}
                    </div>
                    {/* Tekstualni sadržaj desno, kompaktan i rastezljiv */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between pl-3 py-1">
                      <div>
                        {/* Naslov iznad badge-ova */}
                        <h3 className="text-white font-semibold text-base mb-1">
                          {exercise.name}
                        </h3>
                        <div className="flex gap-1 mb-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full shadow-sm border-2 font-semibold ${
                              exercise.type === "strength"
                                ? "bg-purple-900/60 text-purple-200 border-purple-700/40"
                                : exercise.type === "bodyweight"
                                  ? "bg-green-900/60 text-green-200 border-green-700/40"
                                  : exercise.type === "cardio"
                                    ? "bg-blue-900/60 text-blue-200 border-blue-700/40"
                                    : exercise.type === "flexibility"
                                      ? "bg-violet-900/60 text-violet-200 border-violet-700/40"
                                      : exercise.type === "balance"
                                        ? "bg-pink-900/60 text-pink-200 border-pink-700/40"
                                        : "bg-gray-900/60 text-gray-200 border-gray-700/40"
                            }`}
                          >
                            {exercise.type.charAt(0).toUpperCase() +
                              exercise.type.slice(1)}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full shadow-sm border-2 font-semibold ${
                              exercise.level === "beginner"
                                ? "bg-green-900/60 text-green-200 border-green-700/40"
                                : exercise.level === "intermediate"
                                  ? "bg-orange-900/60 text-orange-200 border-orange-700/40"
                                  : "bg-red-900/60 text-red-200 border-red-700/40"
                            }`}
                          >
                            {exercise.level.charAt(0).toUpperCase() +
                              exercise.level.slice(1)}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs mb-2 line-clamp-2">
                          {exercise.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {exercise.muscleGroups
                          .slice(0, 3)
                          .map((muscle, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-orange-900/40 text-orange-200 rounded-full border border-orange-700/40 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              {formatMuscleDisplayName(muscle)}
                            </span>
                          ))}
                        {exercise.muscleGroups.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded-full border border-zinc-600/30 shadow-sm">
                            +{exercise.muscleGroups.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="flex-shrink-0 ml-2 flex items-center">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Icon
                            icon="mdi:check"
                            className="w-4 h-4 text-white"
                          />
                        </div>
                      </div>
                    )}
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
            </div>
            {/* No more results indicator - centered at bottom */}
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
          </>
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
