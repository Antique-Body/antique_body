"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import exerciseLibrary from "./exerciseLibrary.json";

import { Button } from "@/components/common/Button";
import { InfoBanner } from "@/components/common/InfoBanner";

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
    <div className="flex flex-col h-full">
      {/* Info message about templates */}
      <div className="mb-4">
        <InfoBanner
          icon="mdi:information-outline"
          title="Templates with placeholder content"
          subtitle="Some exercises may have generic images or videos. Customize with your own media as needed."
          variant="info"
        />
      </div>

      {/* Search input */}
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercise library..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FF7800] focus:border-[#FF7800]"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="mdi:magnify" className="w-5 h-5 text-zinc-500" />
          </div>
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm("")}
            >
              <Icon
                icon="mdi:close-circle"
                className="w-5 h-5 text-zinc-500 hover:text-zinc-300"
              />
            </button>
          )}
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {filteredExercises.map((exercise, index) => (
              <div
                key={index}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg cursor-pointer transition-colors"
                onClick={() => onSelectExercise(exercise)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white">{exercise.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs ${
                        exercise.type === "strength"
                          ? "bg-purple-900/60 text-purple-200"
                          : exercise.type === "bodyweight"
                          ? "bg-green-900/60 text-green-200"
                          : exercise.type === "cardio"
                          ? "bg-blue-900/60 text-blue-200"
                          : "bg-orange-900/60 text-orange-200"
                      }`}
                    >
                      {exercise.type.charAt(0).toUpperCase() +
                        exercise.type.slice(1)}
                    </span>
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs ${
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
                <div className="mt-1 flex flex-wrap gap-1">
                  {exercise.muscleGroups.map((muscle, idx) => (
                    <span key={idx} className="text-xs text-zinc-400">
                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
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
