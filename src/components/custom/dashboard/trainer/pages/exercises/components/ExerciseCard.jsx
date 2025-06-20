"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Card } from "@/components/common/Card";

export const ExerciseCard = ({ exercise, onView, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { name, location, equipment, type, level, muscleGroups, imageUrl } =
    exercise;

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
        {/* Card Header with Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src={
                imageUrl ||
                "https://www.nrgfitness.ie/site/wp-content/plugins/bbpowerpack/modules/pp-content-grid/images/placeholder.jpg"
              }
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-4">
            <div className="flex justify-between">
              <div>
                <span
                  className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${
                    type === "strength"
                      ? "bg-purple-900/60 text-purple-200"
                      : type === "bodyweight"
                      ? "bg-green-900/60 text-green-200"
                      : "bg-blue-900/60 text-blue-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </div>
              <div>
                <span
                  className={`ml-2 inline-block rounded-md px-2 py-1 text-xs font-semibold ${
                    location === "gym"
                      ? "bg-orange-900/60 text-orange-200"
                      : "bg-cyan-900/60 text-cyan-200"
                  }`}
                >
                  {location === "gym" ? "Gym" : "Home"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="mb-2 text-xl font-bold text-white">{name}</h3>

          <div className="mb-3 flex items-center text-sm text-gray-400">
            <Icon
              icon="mdi:map-marker"
              width={14}
              height={14}
              className="mr-2"
            />
            <span>{location === "gym" ? "Gym" : "Home"}</span>
            <span className="mx-2">•</span>
            <span>{equipment ? "Equipment needed" : "No equipment"}</span>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-md bg-gray-800/80 px-2 py-1 text-sm text-white">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            <span
              className={`rounded-md ${getLevelBadgeColor(
                level
              )} px-2 py-1 text-sm`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          </div>

          {/* Muscle Groups */}
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-400">Target Muscles:</p>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.slice(0, 3).map((muscle, index) => (
                <div
                  key={index}
                  className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs text-[#FF6B00]"
                >
                  {muscle.name.charAt(0).toUpperCase() + muscle.name.slice(1)}
                </div>
              ))}
              {muscleGroups.length > 3 && (
                <div className="rounded-md bg-[rgba(255,255,255,0.1)] px-2 py-1 text-xs text-gray-400">
                  +{muscleGroups.length - 3} more
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex justify-end border-t border-gray-800 p-3">
          <button
            className="mr-2 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onView(exercise);
            }}
          >
            <Icon icon="mdi:eye" width={16} height={16} />
          </button>
          <button
            className="mr-2 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(exercise);
            }}
          >
            <Icon icon="mdi:pencil" width={16} height={16} />
          </button>
          <button
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-red-900/40 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(exercise.id);
            }}
          >
            <Icon icon="mdi:trash-can" width={16} height={16} />
          </button>
        </div>
      </div>
    </Card>
  );
};
