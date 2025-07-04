"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import mealLibrary from "./mealLibrary.json";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";
import { DIETARY_PREFERENCES } from "@/enums";

// Function to map dietary preference values to display labels
const formatDietaryDisplayName = (dietaryValue) => {
  const dietaryOption = DIETARY_PREFERENCES.find(
    (option) => option.value === dietaryValue
  );
  return dietaryOption
    ? dietaryOption.label
    : dietaryValue.charAt(0).toUpperCase() + dietaryValue.slice(1);
};

export const MealLibrarySelector = ({ onSelectMeal, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeals, setFilteredMeals] = useState(mealLibrary);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef(null);

  // Filter meals on search
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const filtered = mealLibrary.filter(
        (meal) =>
          meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.ingredients?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMeals(filtered);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

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

  return (
    <div className="flex flex-col h-full">
      {/* Info message about templates */}
      <div className="mb-4">
        <InfoBanner
          icon="mdi:information-outline"
          title="Templates with placeholder content"
          subtitle="Some meals may have generic images or videos. Customize with your own media as needed."
          variant="info"
        />
      </div>

      {/* Search input */}
      <div className="mb-4">
        <FormField
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search meal library..."
          prefixIcon="mdi:magnify"
          className="mb-0"
        />
      </div>

      {/* Meal list */}
      <div
        className="flex-1 overflow-y-auto pr-2 -mr-2"
        ref={listRef}
        style={{ minHeight: 200, maxHeight: 400 }}
      >
        {filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredMeals.map((meal) => (
              <button
                key={meal.id}
                type="button"
                className="w-full text-left bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                onClick={() => onSelectMeal(meal)}
              >
                <div className="flex items-center gap-3">
                  {/* Meal Image */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-600 flex-shrink-0">
                    {meal.imageUrl ? (
                      <Image
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon
                          icon="mdi:food"
                          className="w-5 h-5 text-zinc-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* Meal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm text-white truncate">
                        {meal.name}
                      </h4>
                      <div className="flex gap-1 ml-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            meal.difficulty === "easy"
                              ? "bg-green-900/40 text-green-300"
                              : meal.difficulty === "medium"
                              ? "bg-orange-900/40 text-orange-300"
                              : "bg-red-900/40 text-red-300"
                          }`}
                        >
                          {meal.difficulty.charAt(0).toUpperCase() +
                            meal.difficulty.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Meal Details */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-zinc-400 capitalize">
                        {meal.mealType}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <Icon icon="mdi:clock-outline" className="w-3 h-3" />
                        {meal.preparationTime}m
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <Icon
                          icon="mdi:fire"
                          className="w-3 h-3 text-orange-400"
                        />
                        {meal.calories}
                      </div>
                    </div>

                    {/* Dietary Tags */}
                    {meal.dietary && meal.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meal.dietary.slice(0, 2).map((diet, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-orange-900/20 text-orange-300 rounded"
                          >
                            {formatDietaryDisplayName(diet)}
                          </span>
                        ))}
                        {meal.dietary.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-zinc-700 text-zinc-400 rounded">
                            +{meal.dietary.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-4"></div>
            <p className="text-gray-400 text-lg">Loading meals...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Icon
              icon="mdi:food-off"
              className="w-12 h-12 text-zinc-600 mb-2"
            />
            <p className="text-zinc-400">
              No meals found{searchTerm ? ` matching "${searchTerm}"` : ""}
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
