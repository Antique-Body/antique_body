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

export const MealLibrarySelector = ({
  meals = [],
  loading = false,
  searchLoading = false,
  searchTerm = "",
  onSearch = () => {},
  onSelectMeal,
  onClose,
  onScroll = () => {},
  hasMore = false,
  useStaticData = false, // New prop to control data source
}) => {
  const listRef = useRef(null);
  const [staticSearchTerm, setStaticSearchTerm] = useState("");
  const [filteredStaticMeals, setFilteredStaticMeals] = useState(mealLibrary);

  // Determine which meals to display
  const displayMeals = useStaticData ? filteredStaticMeals : meals;
  const displaySearchTerm = useStaticData ? staticSearchTerm : searchTerm;
  const displayLoading = useStaticData ? false : loading;
  const displaySearchLoading = useStaticData ? false : searchLoading;
  const displayHasMore = useStaticData ? false : hasMore;

  // Handle static search
  useEffect(() => {
    if (!useStaticData) return;

    if (!staticSearchTerm.trim()) {
      setFilteredStaticMeals(mealLibrary);
      return;
    }

    const lowerCaseSearch = staticSearchTerm.toLowerCase();
    const filtered = mealLibrary.filter(
      (meal) =>
        meal.name.toLowerCase().includes(lowerCaseSearch) ||
        meal.ingredients.toLowerCase().includes(lowerCaseSearch) ||
        meal.recipe.toLowerCase().includes(lowerCaseSearch) ||
        meal.mealType.toLowerCase().includes(lowerCaseSearch) ||
        meal.dietary?.some((diet) =>
          diet.toLowerCase().includes(lowerCaseSearch)
        )
    );

    setFilteredStaticMeals(filtered);
  }, [staticSearchTerm, useStaticData]);

  // Handle search input change
  const handleSearchChange = (value) => {
    if (useStaticData) {
      setStaticSearchTerm(value);
    } else {
      onSearch(value);
    }
  };

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

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current || displayLoading || !displayHasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        onScroll();
      }
    };
    const ref = listRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [displayLoading, displayHasMore, onScroll]);

  // Console log prikazanih meals

  return (
    <div className="flex flex-col h-full">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <InfoBanner
            icon="mdi:information-outline"
            title={useStaticData ? "Pre-built meal templates" : "Meal library"}
            subtitle={
              useStaticData
                ? "These are template meals with placeholder content. Customize with your own media as needed."
                : "Browse and select meals from your library."
            }
            variant="info"
          />
        </div>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <div className="relative">
          <FormField
            type="text"
            value={displaySearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={
              useStaticData ? "Search templates..." : "Search meal library..."
            }
            prefixIcon="mdi:magnify"
            className="mb-0"
          />
          {displaySearchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FF6B00]/30 border-t-[#FF6B00]" />
            </div>
          )}
        </div>
      </div>

      {/* Meal list */}
      <div
        className="flex-1 overflow-y-auto pr-2 -mr-2"
        ref={listRef}
        style={{ minHeight: 200, maxHeight: 400 }}
      >
        {displayMeals.length > 0 || displaySearchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayMeals.map((meal) => (
              <button
                key={meal.id}
                type="button"
                className="group w-full text-left bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 hover:from-zinc-700/80 hover:to-zinc-800/80 border border-zinc-700/50 hover:border-orange-500/40 rounded-2xl p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-md hover:shadow-2xl backdrop-blur-md"
                onClick={() => onSelectMeal(meal)}
              >
                <div className="flex flex-col">
                  {/* Meal Image - Full width at top */}
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800 mb-3 shadow-inner">
                    {meal.imageUrl ? (
                      <Image
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={320}
                        height={128}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-600 to-zinc-700">
                        <Icon
                          icon="mdi:food"
                          className="w-12 h-12 text-zinc-400 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    {/* Difficulty badge overlay */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm shadow-md transition-all duration-200 border-2 group-hover:shadow-lg group-hover:scale-105 ${
                          meal.difficulty === "easy"
                            ? "bg-emerald-500/90 text-white border-emerald-400/70"
                            : meal.difficulty === "medium"
                              ? "bg-amber-500/90 text-white border-amber-400/70"
                              : "bg-red-500/90 text-white border-red-400/70"
                        }`}
                      >
                        {meal.difficulty.charAt(0).toUpperCase() +
                          meal.difficulty.slice(1)}
                      </span>
                    </div>
                    {/* Meal type overlay */}
                    <div className="absolute bottom-2 left-2">
                      <span className="text-xs font-bold text-white capitalize bg-orange-500/90 px-2 py-1 rounded-full backdrop-blur-sm border border-orange-400/60 shadow-md">
                        {meal.mealType}
                      </span>
                    </div>
                  </div>
                  {/* Meal Info */}
                  <div className="flex-1">
                    {/* Header with title only */}
                    <div className="mb-2">
                      <h4 className="font-bold text-base text-white group-hover:text-orange-100 transition-colors duration-200 truncate">
                        {meal.name}
                      </h4>
                    </div>
                    {/* Time Info */}
                    <div className="flex items-center gap-1 mb-2">
                      <Icon
                        icon="mdi:clock-outline"
                        className="w-4 h-4 text-orange-400"
                      />
                      <span className="text-xs font-medium text-zinc-300">
                        {meal.preparationTime} min
                      </span>
                    </div>
                    {/* Nutrition Info */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:fire"
                          className="w-4 h-4 text-orange-400"
                        />
                        <span className="text-xs text-white font-semibold">
                          {meal.calories}
                        </span>
                        <span className="text-[10px] text-zinc-400">cal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:dumbbell"
                          className="w-4 h-4 text-blue-400"
                        />
                        <span className="text-xs text-white font-semibold">
                          {meal.protein}g
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          protein
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:grain"
                          className="w-4 h-4 text-yellow-400"
                        />
                        <span className="text-xs text-white font-semibold">
                          {meal.carbs}g
                        </span>
                        <span className="text-[10px] text-zinc-400">carbs</span>
                      </div>
                    </div>
                    {/* Dietary Tags */}
                    {meal.dietary && meal.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {meal.dietary.slice(0, 3).map((diet, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 bg-gradient-to-r from-orange-900/40 to-orange-800/40 text-orange-200 rounded-full border border-orange-700/40 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            {formatDietaryDisplayName(diet)}
                          </span>
                        ))}
                        {meal.dietary.length > 3 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 bg-gradient-to-r from-zinc-700/60 to-zinc-600/60 text-zinc-300 rounded-full border border-zinc-600/30 shadow-sm">
                            +{meal.dietary.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {displayLoading && (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-2" />
                <p className="text-gray-400 text-sm">Loading more meals...</p>
              </div>
            )}
            {!displayHasMore && !displayLoading && displayMeals.length > 0 && (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Icon
                  icon="mdi:check-circle-outline"
                  className="w-8 h-8 text-green-400 mb-2"
                />
                <p className="text-green-300 text-sm">No more results</p>
              </div>
            )}
          </div>
        ) : displaySearchLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-4" />
            <p className="text-gray-400 text-lg">Searching meals...</p>
          </div>
        ) : displayLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B00]/30 border-t-[#FF6B00] mb-4" />
            <p className="text-gray-400 text-lg">Loading meals...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Icon
              icon="mdi:food-off"
              className="w-12 h-12 text-zinc-600 mb-2"
            />
            <p className="text-zinc-400">
              No meals found
              {displaySearchTerm ? ` matching "${displaySearchTerm}"` : ""}
            </p>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleSearchChange("")}
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
