"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import mealLibrary from "./mealLibrary.json";

import { Button } from "@/components/common/Button";
import { InfoBanner } from "@/components/common/InfoBanner";

export const MealLibrarySelector = ({ onSelectMeal, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeals, setFilteredMeals] = useState(mealLibrary);

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

  // Filter meals based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMeals(mealLibrary);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = mealLibrary.filter(
      (meal) =>
        meal.name.toLowerCase().includes(lowerCaseSearch) ||
        meal.ingredients.toLowerCase().includes(lowerCaseSearch) ||
        meal.recipe.toLowerCase().includes(lowerCaseSearch) ||
        meal.mealType.toLowerCase().includes(lowerCaseSearch) ||
        meal.cuisine.toLowerCase().includes(lowerCaseSearch) ||
        (meal.dietary &&
          meal.dietary.some((diet) =>
            diet.toLowerCase().includes(lowerCaseSearch)
          ))
    );

    setFilteredMeals(filtered);
  }, [searchTerm]);

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
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search meal library..."
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

      {/* Meal list */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {filteredMeals.map((meal, index) => (
              <div
                key={index}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg cursor-pointer transition-colors"
                onClick={() => onSelectMeal(meal)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white">{meal.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs ${
                        meal.mealType === "breakfast"
                          ? "bg-yellow-900/60 text-yellow-200"
                          : meal.mealType === "lunch"
                          ? "bg-blue-900/60 text-blue-200"
                          : meal.mealType === "dinner"
                          ? "bg-purple-900/60 text-purple-200"
                          : meal.mealType === "snack"
                          ? "bg-green-900/60 text-green-200"
                          : "bg-pink-900/60 text-pink-200"
                      }`}
                    >
                      {meal.mealType.charAt(0).toUpperCase() +
                        meal.mealType.slice(1)}
                    </span>
                    <span
                      className={`inline-block rounded-md px-2 py-1 text-xs ${
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
                <div className="mt-1 flex flex-wrap gap-1">
                  {meal.dietary && meal.dietary.length > 0 && (
                    <>
                      {meal.dietary.slice(0, 3).map((diet, idx) => (
                        <span key={idx} className="text-xs text-zinc-400">
                          {diet.charAt(0).toUpperCase() + diet.slice(1)}
                          {idx < Math.min(meal.dietary.length, 3) - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                      {meal.dietary.length > 3 && (
                        <span className="text-xs text-zinc-400">
                          +{meal.dietary.length - 3} more
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Icon
              icon="mdi:food-off"
              className="w-12 h-12 text-zinc-600 mb-2"
            />
            <p className="text-zinc-400">
              No meals found matching "{searchTerm}"
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
          {filteredMeals.length} meal
          {filteredMeals.length !== 1 ? "s" : ""} found
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
