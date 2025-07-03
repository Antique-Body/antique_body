"use client";

import { Icon } from "@iconify/react";
import React, { useState, useMemo } from "react";
import Model from "react-body-highlighter";

import { Button } from "@/components/common/Button";
import {
  generateExerciseData,
  convertToBodyHighlighterMuscles,
  getPrimaryAnatomicalView,
  formatMuscleDisplayName,
  MUSCLE_DESCRIPTIONS,
  MUSCLE_COLORS,
} from "@/utils/muscleMapper";

export const AnatomicalViewer = ({
  exerciseName = "Exercise",
  muscleGroups = [],
  className = "",
  showBothViews = true,
  size = "medium",
  interactive = true,
  showMuscleInfo = true,
  onMuscleClick = null,
  initialView = null, // Allow override of the primary view
  showExerciseInfo = true, // New prop to control exercise info display
  darkMode = false, // New prop for dark background
  compact = false, // New prop for compact display
}) => {
  // Determine the optimal initial view based on muscle groups
  const primaryView = useMemo(
    () => initialView || getPrimaryAnatomicalView(muscleGroups),
    [muscleGroups, initialView]
  );

  const [activeView, setActiveView] = useState(primaryView);
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  // Update active view when primary view changes (e.g., when exercise changes)
  React.useEffect(() => {
    if (!initialView) {
      setActiveView(primaryView);
    }
  }, [primaryView, initialView]);

  // Convert muscle groups to supported format
  const supportedMuscles = useMemo(
    () => convertToBodyHighlighterMuscles(muscleGroups),
    [muscleGroups]
  );

  // Generate exercise data for the highlighter
  const exerciseData = useMemo(() => {
    if (supportedMuscles.length === 0) return [];
    return [generateExerciseData(exerciseName, muscleGroups, 1)];
  }, [exerciseName, muscleGroups, supportedMuscles]);

  // Handle muscle click
  const handleMuscleClick = (muscleStats) => {
    const { muscle, data } = muscleStats;
    setSelectedMuscle({
      name: muscle,
      description:
        MUSCLE_DESCRIPTIONS[muscle] || "Muscle information not available",
      exercises: data?.exercises || [exerciseName],
      frequency: data?.frequency || 1,
    });

    // Call external click handler if provided
    if (onMuscleClick) {
      onMuscleClick(muscleStats);
    }
  };

  // Determine size styles
  const getSizeStyles = () => {
    if (compact) {
      return { width: "180px", height: "auto" };
    }
    switch (size) {
      case "small":
        return { width: "200px", height: "auto" };
      case "large":
        return { width: "350px", height: "auto" };
      case "medium":
      default:
        return { width: "250px", height: "auto" };
    }
  };

  const sizeStyles = getSizeStyles();

  // Check if we have muscles to display
  const hasMusclesToShow = supportedMuscles.length > 0;

  // Custom colors for the anatomical model based on dark mode
  const bodyColor = darkMode ? "#2A2A2A" : MUSCLE_COLORS.default;
  const highlightedColors = MUSCLE_COLORS.highlighted;

  return (
    <div
      className={`anatomical-viewer ${className} ${
        darkMode ? "text-zinc-100" : "text-zinc-800"
      }`}
    >
      {/* Header with view toggle */}
      {showBothViews && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="small"
            className={`${
              activeView === "anterior"
                ? "bg-[#FF6B00] text-white border-[#FF6B00] hover:bg-[#FF7800]"
                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-[#FF6B00] hover:text-[#FF6B00]"
            } transition-all duration-200`}
            leftIcon={<Icon icon="mdi:human-handsup" width={16} height={16} />}
            onClick={() => setActiveView("anterior")}
          >
            Front
          </Button>

          <Button
            variant="outline"
            size="small"
            className={`${
              activeView === "posterior"
                ? "bg-[#FF6B00] text-white border-[#FF6B00] hover:bg-[#FF7800]"
                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-[#FF6B00] hover:text-[#FF6B00]"
            } transition-all duration-200`}
            leftIcon={
              <Icon icon="mdi:human-handsdown" width={16} height={16} />
            }
            onClick={() => setActiveView("posterior")}
          >
            Back
          </Button>
        </div>
      )}

      {/* Exercise name and muscle info - only show if not compact and showExerciseInfo is true */}
      {!compact && showExerciseInfo && hasMusclesToShow && (
        <div className="text-center mb-4 px-2">
          <h3
            className={`text-lg font-semibold mb-2 ${
              darkMode ? "text-white" : "text-zinc-800"
            }`}
          >
            {exerciseName}
          </h3>
          <div
            className={`text-sm ${
              darkMode ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            <p className="mb-2">
              <span className="font-medium">Targeted Muscles:</span>
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {muscleGroups.slice(0, 4).map((muscle, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[rgba(255,107,0,0.15)] text-[#FF6B00] rounded-md text-xs font-medium"
                >
                  {formatMuscleDisplayName(muscle)}
                </span>
              ))}
              {muscleGroups.length > 4 && (
                <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded-md text-xs">
                  +{muscleGroups.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Body Model */}
      <div className="flex justify-center">
        <div
          className={`anatomical-model rounded-xl overflow-hidden ${
            darkMode ? "bg-[#121211]" : "bg-[#121211]"
          } ${!compact && ""}`}
          style={sizeStyles}
        >
          {hasMusclesToShow ? (
            <div className="p-3 flex items-center justify-center">
              <Model
                data={exerciseData}
                type={activeView}
                style={{ width: "100%", height: "auto" }}
                bodyColor={bodyColor}
                highlightedColors={highlightedColors}
                onClick={interactive ? handleMuscleClick : undefined}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 h-full min-h-[200px]">
              <Icon
                icon="mdi:human"
                className={`text-4xl mb-3 ${
                  darkMode ? "text-zinc-600" : "text-zinc-500"
                }`}
              />
              <p
                className={`text-center text-sm ${
                  darkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                No muscle groups mapped
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Muscle Information Panel */}
      {showMuscleInfo && selectedMuscle && (
        <div className="mt-4 p-3 bg-[rgba(255,107,0,0.08)] border border-[rgba(255,107,0,0.2)] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-[#FF6B00] capitalize">
              {selectedMuscle.name.replace(/-/g, " ")}
            </h4>
            <button
              onClick={() => setSelectedMuscle(null)}
              className="text-[#FF6B00] hover:text-[#FF7800] transition-colors"
            >
              <Icon icon="mdi:close" width={18} height={18} />
            </button>
          </div>
          <p className="text-sm text-zinc-300 mb-1">
            {selectedMuscle.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnatomicalViewer;
