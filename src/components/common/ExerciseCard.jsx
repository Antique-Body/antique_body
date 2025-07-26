import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

import AnatomicalViewer from "@/components/custom/dashboard/trainer/pages/exercises/components/AnatomicalViewer";
import { getRepsPlaceholder, toggleRepsUnit } from "@/utils/exerciseUtils";

import { Button } from "./Button";
import { Card } from "./Card";

/**
 * Mobile-first responsive exercise card component
 * Provides consistent exercise display across different contexts
 */
export const ExerciseCard = ({
  exercise,
  exerciseIndex,
  dayIndex,
  onUpdateExercise,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  disabled = false,
  showControls = true,
  compact = false,
  className = "",
}) => {
  const handleParameterChange = (field, value) => {
    if (onUpdateExercise) {
      onUpdateExercise(dayIndex, exerciseIndex, field, value);
    }
  };

  const handleRepsUnitToggle = () => {
    const newUnit = toggleRepsUnit(exercise.repsUnit || "reps");
    handleParameterChange("repsUnit", newUnit);
  };

  const setsCount = Array.isArray(exercise.sets)
    ? exercise.sets.length
    : typeof exercise.sets === "number"
      ? exercise.sets
      : 3;

  return (
    <Card
      variant="dark"
      hover={!disabled}
      hoverBorderColor="#666"
      borderColor="#555"
      padding="0"
      className={`shadow-lg !p-0 ${className}`}
    >
      <div className={`flex ${compact ? "flex-row" : "flex-col lg:flex-row"}`}>
        {/* Exercise details */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h5 className="font-semibold text-white text-sm sm:text-base lg:text-lg leading-tight">
              {exercise.name}
            </h5>
            {showControls && !disabled && (
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onRemoveExercise?.(dayIndex, exerciseIndex)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/30 p-1 sm:p-2 rounded-lg transition-all"
                >
                  <Icon
                    icon="mdi:trash-can-outline"
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                </Button>
              </div>
            )}
          </div>

          {/* Exercise controls - responsive grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
            {/* Sets */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 text-center">
                Sets
              </label>
              {showControls && !disabled ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onRemoveSet?.(dayIndex, exerciseIndex)}
                    disabled={setsCount <= 1}
                    className="p-0.5 sm:p-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon="mdi:minus" className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                  <div className="flex-1 bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-xs sm:text-sm lg:text-base py-1 sm:py-2">
                    {setsCount}
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddSet?.(dayIndex, exerciseIndex)}
                    className="p-0.5 sm:p-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
                  >
                    <Icon icon="mdi:plus" className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ) : (
                <div className="bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-xs sm:text-sm lg:text-base py-1 sm:py-2">
                  {setsCount}
                </div>
              )}
            </div>

            {/* Reps/Seconds */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <label
                  htmlFor={`reps-input-${dayIndex}-${exerciseIndex}`}
                  className="block text-xs sm:text-sm font-medium text-gray-300 text-center"
                >
                  {exercise.repsUnit === "seconds" ? "Seconds" : "Reps"}
                </label>
                {showControls && !disabled && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleRepsUnitToggle}
                    className="p-0.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/20 rounded-md transition-all"
                    title={`Switch to ${
                      exercise.repsUnit === "reps" ? "seconds" : "reps"
                    }`}
                  >
                    <Icon
                      icon={
                        exercise.repsUnit === "reps"
                          ? "mdi:timer-outline"
                          : "mdi:counter"
                      }
                      className="w-2 h-2 sm:w-3 sm:h-3"
                    />
                  </Button>
                )}
              </div>
              <input
                id={`reps-input-${dayIndex}-${exerciseIndex}`}
                type="number"
                value={exercise.reps || 0}
                onChange={(e) =>
                  handleParameterChange("reps", parseInt(e.target.value) || 1)
                }
                disabled={disabled}
                className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-xs sm:text-sm lg:text-base py-1 sm:py-2 focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={getRepsPlaceholder(exercise.repsUnit)}
              />
            </div>

            {/* Rest */}
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor={`rest-input-${dayIndex}-${exerciseIndex}`}
                className="block text-xs sm:text-sm font-medium text-gray-300 text-center"
              >
                Rest (s)
              </label>
              <input
                id={`rest-input-${dayIndex}-${exerciseIndex}`}
                type="number"
                value={exercise.rest || 0}
                onChange={(e) =>
                  handleParameterChange("rest", parseInt(e.target.value) || 0)
                }
                disabled={disabled}
                className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg text-white text-center font-semibold text-xs sm:text-sm lg:text-base py-1 sm:py-2 focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Exercise Instructions - Mobile responsive */}
          {exercise.instructions && (
            <div className="space-y-2 mb-3 sm:mb-4">
              <label
                htmlFor={`instructions-${dayIndex}-${exerciseIndex}`}
                className="block text-xs sm:text-sm font-medium text-gray-200 flex items-center gap-2"
              >
                <Icon
                  icon="mdi:information-outline"
                  className="w-3 h-3 sm:w-4 sm:h-4"
                />
                Instructions
              </label>
              <p
                id={`instructions-${dayIndex}-${exerciseIndex}`}
                className="text-xs sm:text-sm text-gray-300 leading-relaxed"
              >
                {exercise.instructions}
              </p>
            </div>
          )}

          {/* Exercise Notes - Mobile responsive */}
          {showControls && (
            <div className="space-y-2 mb-3 sm:mb-4">
              <label
                htmlFor={`notes-${dayIndex}-${exerciseIndex}`}
                className="block text-xs sm:text-sm font-medium text-gray-200 flex items-center gap-2"
              >
                <Icon icon="mdi:note-text" className="w-3 h-3 sm:w-4 sm:h-4" />
                Notes
              </label>
              <textarea
                id={`notes-${dayIndex}-${exerciseIndex}`}
                value={exercise.notes || ""}
                onChange={(e) => handleParameterChange("notes", e.target.value)}
                disabled={disabled}
                placeholder="Add specific instructions, form cues, or modifications..."
                rows={2}
                className="w-full bg-[#4a4a4a]/80 border border-[#666]/60 rounded-lg resize-none text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00] focus:bg-[#4a4a4a] transition-all backdrop-blur-sm placeholder-gray-400 px-2 sm:px-3 py-1 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {/* Muscle Groups - Mobile responsive */}
          {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
            <div className="space-y-2">
              <label
                htmlFor={`muscle-groups-${dayIndex}-${exerciseIndex}`}
                className="block text-xs sm:text-sm font-medium text-gray-200 flex items-center gap-2"
              >
                <Icon icon="mdi:muscle" className="w-3 h-3 sm:w-4 sm:h-4" />
                Target Muscles
              </label>
              <div
                id={`muscle-groups-${dayIndex}-${exerciseIndex}`}
                className="flex flex-wrap gap-1 sm:gap-2"
              >
                {exercise.muscleGroups.map((muscle, idx) => (
                  <span
                    key={muscle.id || muscle.name || idx}
                    className="px-2 sm:px-3 py-1 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF8500]/20 border border-[#FF6B00]/40 rounded-full text-xs font-medium text-[#FF6B00] capitalize"
                  >
                    {muscle.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Media preview - responsive */}
        {!compact && (
          <div className="w-full lg:w-64 xl:w-80 border-t lg:border-t-0 lg:border-l border-[#555]/50 flex flex-col backdrop-blur-sm">
            <div className="flex-1 p-3 sm:p-4 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] relative">
              {exercise.imageUrl ? (
                <div className="w-full h-full relative rounded-xl overflow-hidden border border-[#555]/30 hover:border-[#555]/50 transition-all group">
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    width={320}
                    height={300}
                  />
                </div>
              ) : exercise.muscleGroups && exercise.muscleGroups.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center rounded-xl border border-[#555]/30 hover:border-[#555]/50 transition-all duration-300 bg-[#121211]">
                  <AnatomicalViewer
                    exerciseName={exercise.name}
                    muscleGroups={exercise.muscleGroups}
                    size={compact ? "small" : "medium"}
                    showBothViews={!compact}
                    interactive={false}
                    showMuscleInfo={false}
                    showExerciseInfo={false}
                    darkMode={true}
                    compact={compact}
                    className="mx-auto"
                    bodyColor="white"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-xl border border-[#555]/30 group hover:border-[#555]/50 transition-all duration-300">
                  <div className="text-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <div className="bg-[#555]/10 rounded-full p-3 sm:p-4 mb-3 sm:mb-4 mx-auto w-fit">
                      <Icon
                        icon="mdi:image-off"
                        className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-gray-300 transition-colors"
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      No image available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseCard;
