"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export const MealCard = ({ meal, onView, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    name,
    mealType,
    difficulty,
    preparationTime,
    calories,
    protein,
    carbs,
    fat,
    dietary,
    imageUrl,
  } = meal;

  // Function to get badge color for difficulty (same as exercise level)
  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-900/40 text-green-300";
      case "medium":
        return "bg-orange-900/40 text-orange-300";
      case "hard":
        return "bg-red-900/40 text-red-300";
      default:
        return "bg-blue-900/40 text-blue-300";
    }
  };

  // Function to get meal type color (consistent with exercise type)
  const getMealTypeColor = (type) => {
    switch (type) {
      case "breakfast":
        return "bg-yellow-900/60 text-yellow-200";
      case "lunch":
        return "bg-blue-900/60 text-blue-200";
      case "dinner":
        return "bg-purple-900/60 text-purple-200";
      case "snack":
        return "bg-green-900/60 text-green-200";
      case "dessert":
        return "bg-pink-900/60 text-pink-200";
      default:
        return "bg-gray-900/60 text-gray-200";
    }
  };

  return (
    <Card
      variant="planCard"
      width="100%"
      maxWidth="100%"
      className="transform cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onClick={() => onView(meal)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full flex-col">
        {/* Card Header with Image */}
        <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src={
                imageUrl ||
                "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
              }
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-4">
            <div className="flex justify-between">
              <div>
                <span
                  className={`inline-block rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold ${getMealTypeColor(
                    mealType
                  )}`}
                >
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </span>
              </div>
              <div>
                <span className="inline-block rounded-md bg-orange-900/60 text-orange-200 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold">
                  {preparationTime} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="mb-1 sm:mb-2 text-sm sm:text-lg md:text-xl font-bold text-white leading-tight">
            {name}
          </h3>

          <div className="mb-2 sm:mb-3 flex items-center text-xs sm:text-sm text-gray-400">
            <Icon
              icon="mdi:fire"
              width={12}
              height={12}
              className="mr-1 sm:mr-2 flex-shrink-0"
            />
            <span className="truncate">{calories} cal</span>
            <span className="mx-1 sm:mx-2">•</span>
            <Icon
              icon="mdi:clock"
              width={12}
              height={12}
              className="mr-1 flex-shrink-0"
            />
            <span className="truncate">{preparationTime} min</span>
          </div>

          <div className="mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
            <span className="rounded-md bg-gray-800/80 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-white">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </span>
            <span
              className={`rounded-md ${getDifficultyBadgeColor(
                difficulty
              )} px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>

          {/* Nutrition Info */}
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-400">Nutrition Info:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-1 rounded-lg bg-blue-900/30 border border-blue-500/20 px-2 py-1.5 text-xs">
                <span className="text-blue-300 font-medium">P</span>
                <span className="text-white">{protein}g</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-green-900/30 border border-green-500/20 px-2 py-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-green-300 font-medium">C</span>
                <span className="text-white">{carbs}g</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-yellow-900/30 border border-yellow-500/20 px-2 py-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-300 font-medium">F</span>
                <span className="text-white">{fat}g</span>
              </div>
            </div>
            {dietary && dietary.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {dietary.slice(0, 2).map((diet, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-[rgba(255,107,0,0.15)] px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-[#FF6B00]"
                  >
                    {diet.charAt(0).toUpperCase() + diet.slice(1)}
                  </div>
                ))}
                {dietary.length > 2 && (
                  <div className="rounded-md bg-[rgba(255,255,255,0.1)] px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-gray-400">
                    +{dietary.length - 2}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex justify-end border-t border-gray-800 p-2 sm:p-3">
          <Button
            variant="secondary"
            size="compact"
            className="mr-1 sm:mr-2 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full p-0 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onView(meal);
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
              onEdit(meal);
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
              onDelete(meal.id);
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
