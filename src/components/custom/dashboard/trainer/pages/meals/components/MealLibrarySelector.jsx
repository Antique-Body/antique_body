"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import mealLibrary from "./mealLibrary.json";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";

export const MealLibrarySelector = ({ onSelectMeal, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeals, setFilteredMeals] = useState(mealLibrary);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(mealLibrary.length);
  const listRef = useRef(null);

  // Filter meals on search
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const filtered = mealLibrary.filter(
        (meal) =>
          meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (meal.ingredients &&
            meal.ingredients.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMeals(filtered);
      setTotalCount(filtered.length);
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
      <div className="mb-4 relative">
        <div className="relative">
          <FormField
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
      <div
        className="flex-1 overflow-y-auto pr-2 -mr-2"
        ref={listRef}
        style={{ minHeight: 200, maxHeight: 400 }}
      >
        {filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="group relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden bg-gradient-to-r from-slate-700/80 to-slate-600/80 border-slate-500/60 hover:border-blue-400/60 hover:shadow-md hover:shadow-blue-400/10"
                onClick={() => onSelectMeal(meal)}
              >
                <div className="p-3 flex items-center gap-3 relative z-10">
                  {/* Meal Image with Overlay */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-600 flex-shrink-0 shadow-md">
                    {meal.imageUrl ? (
                      <>
                        <Image
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={48}
                          height={48}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                        <Icon
                          icon="mdi:food"
                          className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  {/* Meal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base text-white truncate group-hover:text-blue-300 transition-colors">
                          {meal.name}
                        </h4>
                      </div>
                    </div>

                    {/* Meal Details Row */}
                    <div className="flex items-center gap-3 mb-1">
                      {/* Type Badge */}
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-xs font-medium text-slate-200 capitalize">
                          {meal.mealType}
                        </span>
                      </div>

                      {/* Difficulty Badge */}
                      <div
                        className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                          meal.difficulty === "easy"
                            ? "bg-emerald-500/30 text-emerald-300"
                            : meal.difficulty === "medium"
                            ? "bg-amber-500/30 text-amber-300"
                            : "bg-red-500/30 text-red-300"
                        }`}
                      >
                        {meal.difficulty.charAt(0).toUpperCase()}
                      </div>

                      {/* Preparation Time */}
                      <div className="flex items-center gap-0.5 text-xs text-slate-300">
                        <Icon icon="mdi:clock-outline" className="w-3 h-3" />
                        {meal.preparationTime}m
                      </div>

                      {/* Calories */}
                      <div className="flex items-center gap-0.5 text-xs text-slate-300">
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
                            className="px-1.5 py-0.5 bg-slate-600/60 rounded text-xs text-slate-300 font-medium"
                          >
                            {diet}
                          </span>
                        ))}
                        {meal.dietary.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-slate-600/60 rounded text-xs text-slate-300 font-medium">
                            +{meal.dietary.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Media Indicators */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {meal.imageUrl && (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20">
                          <Icon
                            icon="mdi:image"
                            className="w-2.5 h-2.5 text-blue-400"
                          />
                        </div>
                      )}
                      {meal.videoUrl && (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20">
                          <Icon
                            icon="mdi:video"
                            className="w-2.5 h-2.5 text-purple-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B00]/30 border-t-[#FF6B00]" />
              </div>
            )}
            {!isLoading && filteredMeals.length === 0 && (
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

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between">
        <div className="text-sm text-zinc-400">
          {totalCount} meal{totalCount !== 1 ? "s" : ""} found
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
