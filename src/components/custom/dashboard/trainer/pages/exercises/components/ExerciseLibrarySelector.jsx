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
        <div className="relative"
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            width={20}
            height={20}
          />
          <input
            type="text"
            placeholder="Search exercises by name, description, or muscle group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto">
        {filteredExercises.length > 0 ? (
          <div className="grid gap-3">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => onSelectExercise(exercise)}
                className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-orange-500 cursor-pointer transition-colors"
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
                          : "bg-blue-900/40 text-blue-300"
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
                <div className="mt-1 flex flex-wrap gap-1">
                  {exercise.muscleGroups.map((muscle, idx) => (
                    <span key={idx} className="text-xs text-zinc-400">
                      {formatMuscleDisplayName(muscle)}
                      {idx < exercise.muscleGroups.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
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

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between">
        <div className="text-sm text-zinc-400">
          {filteredExercises.length} exercise
          {filteredExercises.length !== 1 ? "s" : ""} found
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={onClose}
          className="h-8 w-[80px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
