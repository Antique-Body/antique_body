"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import exerciseLibrary from "./exerciseLibrary.json";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";
import { formatMuscleDisplayName } from "@/utils/muscleMapper";

export const ExerciseLibrarySelector = ({ onSelectExercise, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exerciseLibrary);

  // Handle ESC key press for this modal specifically
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation(); // Prevent the event from reaching parent modal
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  // Filter exercises based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredExercises(exerciseLibrary);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = exerciseLibrary.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(lowerCaseSearch) ||
        exercise.description.toLowerCase().includes(lowerCaseSearch) ||
        exercise.muscleGroups.some((muscle) =>
          muscle.toLowerCase().includes(lowerCaseSearch)
        )
    );

    setFilteredExercises(filtered);
  }, [searchTerm]);

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="mb-4">
        <InfoBanner
          icon="mdi:information"
          title="Exercise Templates"
          subtitle="Select a pre-built exercise to quickly populate your form"
          variant="info"
        />
      </div>

      {/* Search */}
      <div className="mb-4">
        <FormField
          type="text"
          placeholder="Search exercises by name, description, or muscle group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefixIcon="mdi:magnify"
          className="mb-0"
        />
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto">
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => onSelectExercise(exercise)}
                className="w-full text-left bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold text-sm">
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

                <p className="text-zinc-400 text-xs mb-2 line-clamp-2">
                  {exercise.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.slice(0, 3).map((muscle, idx) => (
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
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Icon
              icon="mdi:dumbbell-off"
              className="w-12 h-12 text-zinc-600 mb-2"
            />
            <p className="text-zinc-400">
              No exercises found matching "{searchTerm}"
            </p>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setSearchTerm("")}
              className="mt-2 h-8 px-3"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
