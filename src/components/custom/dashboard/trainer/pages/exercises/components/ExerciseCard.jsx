"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";


import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  formatMuscleDisplayName,
  getPrimaryAnatomicalView,
} from "@/utils/muscleMapper";

import { AnatomicalViewer } from "./AnatomicalViewer";

export const ExerciseCard = ({ exercise, onView, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { name, location, equipment, type, level, muscleGroups, imageUrl } =
    exercise;

  // Safety check to ensure all values are properly formatted
  const safeName = typeof name === "string" ? name : "Unknown Exercise";
  const safeLocation = typeof location === "string" ? location : "gym";
  const safeType = typeof type === "string" ? type : "strength";
  const safeLevel = typeof level === "string" ? level : "beginner";
  const safeMuscleGroups = Array.isArray(muscleGroups) ? muscleGroups : [];

  // Function to get badge color for level
  const getLevelBadgeColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-green-900/40 text-green-300";
      case "intermediate":
        return "bg-orange-900/40 text-orange-300";
      case "advanced":
        return "bg-red-900/40 text-red-300";
      default:
        return "bg-blue-900/40 text-blue-300";
    }
  };

  return (
    <Card
      variant="planCard"
      width="100%"
      maxWidth="100%"
      className="transform cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={() => onView(exercise)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full flex-col">
        {/* Card Header with Anatomical Viewer or Image */}
        <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden">
          <div className="relative h-full w-full bg-white">
            {imageUrl ? (
              // Show image if available
              <Image
                src={imageUrl}
                alt={safeName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                className="object-cover object-center transition-transform duration-500"
                style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
              />
            ) : safeMuscleGroups && safeMuscleGroups.length > 0 ? (
              // Show anatomy if no image but muscle groups exist
              <div className="flex h-full items-center justify-center p-1 bg-[#121211]">
                <AnatomicalViewer
                  exerciseName={safeName}
                  muscleGroups={safeMuscleGroups}
                  size="small"
                  showBothViews={false}
                  interactive={false}
                  showMuscleInfo={false}
                  showExerciseInfo={false}
                  darkMode={true}
                  compact={true}
                  initialView={getPrimaryAnatomicalView(safeMuscleGroups)}
                  className="w-[40%] h-full"
                  bodyColor="white"
                />
              </div>
            ) : (
              // Fallback placeholder
              <div className="flex h-full items-center justify-center bg-[#1a1b1e]">
                <div className="text-center">
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-4xl text-zinc-500 mb-2"
                  />
                  <p className="text-zinc-400 text-xs">No Image</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-2 sm:p-3 md:p-4">
            <div className="flex justify-between gap-1">
              <div>
                <span
                  className={`inline-block rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold ${
                    safeType === "strength"
                      ? "bg-purple-900/60 text-purple-200"
                      : safeType === "bodyweight"
                        ? "bg-green-900/60 text-green-200"
                        : "bg-blue-900/60 text-blue-200"
                  }`}
                >
                  {safeType.charAt(0).toUpperCase() + safeType.slice(1)}
                </span>
              </div>
              <div>
                <span
                  className={`inline-block rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold ${
                    safeLocation === "gym"
                      ? "bg-orange-900/60 text-orange-200"
                      : "bg-cyan-900/60 text-cyan-200"
                  }`}
                >
                  {safeLocation === "gym" ? "Gym" : "Home"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl font-bold text-white leading-tight">
            {safeName}
          </h3>

          <div className="mb-2 sm:mb-3 flex items-center text-xs sm:text-sm text-gray-400">
            <Icon
              icon="mdi:map-marker"
              width={12}
              height={12}
              className="mr-1 sm:mr-2 flex-shrink-0"
            />
            <span className="truncate">
              {safeLocation === "gym" ? "Gym" : "Home"}
            </span>
            <span className="mx-1 sm:mx-2">•</span>
            <span className="truncate text-xs sm:text-sm">
              {typeof equipment === "boolean"
                ? equipment
                  ? "Equipment"
                  : "No equipment"
                : Array.isArray(equipment)
                  ? equipment.length > 0
                    ? "Equipment"
                    : "No equipment"
                  : "Equipment"}
            </span>
          </div>

          <div className="mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
            <span className="rounded-md bg-gray-800/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-white">
              {safeType.charAt(0).toUpperCase() + safeType.slice(1)}
            </span>
            <span
              className={`rounded-md ${getLevelBadgeColor(
                safeLevel
              )} px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm`}
            >
              {safeLevel.charAt(0).toUpperCase() + safeLevel.slice(1)}
            </span>
          </div>

          {/* Muscle Groups */}
          {safeMuscleGroups && safeMuscleGroups.length > 0 && (
            <div className="mt-2 sm:mt-3">
              <p className="mb-1 sm:mb-2 text-xs text-gray-400">
                Target Muscles:
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {safeMuscleGroups.slice(0, 2).map((muscle, index) => {
                  const muscleName = formatMuscleDisplayName(muscle);
                  return (
                    <div
                      key={index}
                      className="rounded-md bg-[rgba(255,107,0,0.15)] px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-[#FF6B00]"
                    >
                      {muscleName}
                    </div>
                  );
                })}
                {safeMuscleGroups.length > 2 && (
                  <div className="rounded-md bg-[rgba(255,255,255,0.1)] px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-gray-400">
                    +{safeMuscleGroups.length - 2}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex justify-end border-t border-gray-800 p-2 sm:p-3">
          <Button
            variant="secondary"
            size="compact"
            className="mr-1 sm:mr-2 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full p-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onView(exercise);
            }}
          >
            <Icon
              icon="mdi:eye"
              width={12}
              height={12}
              className="sm:w-4 sm:h-4"
            />
          </Button>
          <Button
            variant="secondary"
            size="compact"
            className="mr-1 sm:mr-2 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full p-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(exercise);
            }}
          >
            <Icon
              icon="mdi:pencil"
              width={12}
              height={12}
              className="sm:w-4 sm:h-4"
            />
          </Button>
          <Button
            variant="secondary"
            size="compact"
            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full p-0 flex items-center justify-center hover:bg-red-900/40 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(exercise.id);
            }}
          >
            <Icon
              icon="mdi:trash-can"
              width={12}
              height={12}
              className="sm:w-4 sm:h-4"
            />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExerciseCard;
