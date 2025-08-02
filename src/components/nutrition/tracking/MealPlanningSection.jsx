import { Icon } from "@iconify/react";
import Image from "next/image";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

// Dietary preferences options
const DIETARY_PREFERENCES = {
  vegan: { label: "Vegan", icon: "mdi:leaf", color: "text-green-400" },
  vegetarian: {
    label: "Vegetarian",
    icon: "mdi:carrot",
    color: "text-green-500",
  },
  keto: { label: "Keto", icon: "mdi:food-steak", color: "text-purple-400" },
  paleo: {
    label: "Paleo",
    icon: "mdi:food-drumstick",
    color: "text-orange-400",
  },
  mediterranean: {
    label: "Mediterranean",
    icon: "mdi:fish",
    color: "text-blue-400",
  },
  glutenFree: {
    label: "Gluten Free",
    icon: "mdi:wheat-off",
    color: "text-yellow-400",
  },
  dairyFree: {
    label: "Dairy Free",
    icon: "mdi:cow-off",
    color: "text-red-400",
  },
  lowCarb: {
    label: "Low Carb",
    icon: "mdi:bread-slice-outline",
    color: "text-indigo-400",
  },
  highProtein: {
    label: "High Protein",
    icon: "mdi:food-drumstick",
    color: "text-pink-400",
  },
  intermittentFasting: {
    label: "Intermittent Fasting",
    icon: "mdi:clock",
    color: "text-cyan-400",
  },
};

export function MealPlanningSection({
  planData,
  nutritionPlan,
  activeDay,
  onPlanUpdate,
  onShowMealLibrary,
  onShowMealCreate,
  onMealSelect,
  onShowMealModal,
  setSelectedMealForAddition,
  setSelectedMealForReplacement,
  hasUnsavedChanges,
}) {
  const currentDay = planData?.days?.[activeDay];

  // Handle dietary preferences toggle
  const toggleDietaryPreference = (mealIndex, optionIndex, prefId) => {
    const updatedPlan = { ...nutritionPlan };
    if (
      updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]?.options?.[
        optionIndex
      ]
    ) {
      const option =
        updatedPlan.planData.days[activeDay].meals[mealIndex].options[
          optionIndex
        ];
      const currentDietary = option.dietary || [];
      const isSelected = currentDietary.includes(prefId);

      if (isSelected) {
        // Remove dietary preference
        option.dietary = currentDietary.filter((id) => id !== prefId);
      } else {
        // Add dietary preference
        option.dietary = [...currentDietary, prefId];
      }

      onPlanUpdate(updatedPlan);
    }
  };

  // Sort meals by time - only when saved
  const sortMealsByTime = (meals) => {
    if (!hasUnsavedChanges) {
      return meals.sort((a, b) => {
        const timeA = a.time || "00:00";
        const timeB = b.time || "00:00";
        return timeA.localeCompare(timeB);
      });
    }
    return meals; // Don't sort if there are unsaved changes
  };

  // Handle adding new meal
  const handleAddMeal = () => {
    const input = document.querySelector('input[placeholder*="Add meal name"]');
    const mealName = input?.value?.trim() || "New Meal";
    if (input) input.value = "";

    const updatedPlan = { ...nutritionPlan };
    if (updatedPlan.planData?.days?.[activeDay]?.meals) {
      const newMeal = {
        name: mealName,
        time: "",
        notes: "",
        options: [
          {
            name: mealName,
            description: "",
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            isTextBased: true,
          },
        ],
      };
      updatedPlan.planData.days[activeDay].meals.push(newMeal);
      onPlanUpdate(updatedPlan);

      // Scroll to the newly added meal
      setTimeout(() => {
        const mealElements = document.querySelectorAll("[data-meal-index]");
        const lastMealElement = mealElements[mealElements.length - 1];
        if (lastMealElement) {
          lastMealElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  };

  // Handle meal name change
  const handleMealNameChange = (mealIndex, value) => {
    const updatedPlan = { ...nutritionPlan };
    if (updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]) {
      updatedPlan.planData.days[activeDay].meals[mealIndex].name = value;
      onPlanUpdate(updatedPlan);
    }
  };

  // Handle meal time change
  const handleMealTimeChange = (mealIndex, value) => {
    const updatedPlan = { ...nutritionPlan };
    if (updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]) {
      updatedPlan.planData.days[activeDay].meals[mealIndex].time = value;
      onPlanUpdate(updatedPlan);
    }
  };

  // Handle meal notes change
  const handleMealNotesChange = (mealIndex, value) => {
    const updatedPlan = { ...nutritionPlan };
    if (updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]) {
      updatedPlan.planData.days[activeDay].meals[mealIndex].notes = value;
      onPlanUpdate(updatedPlan);
    }
  };

  // Handle meal deletion
  const handleDeleteMeal = (mealIndex) => {
    const updatedPlan = { ...nutritionPlan };
    if (updatedPlan.planData?.days?.[activeDay]?.meals) {
      updatedPlan.planData.days[activeDay].meals.splice(mealIndex, 1);
      onPlanUpdate(updatedPlan);
    }
  };

  // Handle option field changes
  const handleOptionChange = (mealIndex, optionIndex, field, value) => {
    const updatedPlan = { ...nutritionPlan };
    if (
      updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]?.options?.[
        optionIndex
      ]
    ) {
      if (field === "ingredients") {
        updatedPlan.planData.days[activeDay].meals[mealIndex].options[
          optionIndex
        ].ingredients = value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      } else if (["calories", "protein", "carbs", "fat"].includes(field)) {
        updatedPlan.planData.days[activeDay].meals[mealIndex].options[
          optionIndex
        ][field] = parseInt(value) || 0;
      } else {
        updatedPlan.planData.days[activeDay].meals[mealIndex].options[
          optionIndex
        ][field] = value;
      }
      onPlanUpdate(updatedPlan);
    }
  };

  // Handle option deletion
  const handleDeleteOption = (mealIndex, optionIndex) => {
    const updatedPlan = { ...nutritionPlan };
    if (updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]?.options) {
      updatedPlan.planData.days[activeDay].meals[mealIndex].options.splice(
        optionIndex,
        1
      );
      onPlanUpdate(updatedPlan);
    }
  };

  if (!currentDay) {
    return null;
  }

  return (
    <Card
      variant="dark"
      className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon
            icon="mdi:silverware-fork-knife"
            className="text-[#3E92CC]"
            width={28}
            height={28}
          />
          <h3 className="text-xl font-semibold text-white">
            {currentDay.name || `Day ${activeDay + 1}`} Meals
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {currentDay.isRestDay && (
            <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
              Rest Day
            </span>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="small"
              onClick={handleAddMeal}
              leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {currentDay.isRestDay ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-zinc-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon
              icon="mdi:sleep"
              className="text-zinc-600"
              width={32}
              height={32}
            />
          </div>
          <p className="text-zinc-400 text-lg font-medium mb-2">Rest Day</p>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            {currentDay.description}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortMealsByTime(currentDay.meals || []).length > 0 ? (
            sortMealsByTime(currentDay.meals || []).map((meal, mealIndex) => (
              <div
                key={mealIndex}
                data-meal-index={mealIndex}
                className="border border-zinc-700/50 rounded-2xl p-6 bg-zinc-800/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#3E92CC]/20 rounded-xl flex items-center justify-center">
                      <Icon
                        icon="mdi:clock"
                        className="text-[#3E92CC]"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={meal.name || ""}
                        onChange={(e) =>
                          handleMealNameChange(mealIndex, e.target.value)
                        }
                        className="w-full bg-transparent border-none text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded px-2 py-1"
                        placeholder="Meal name..."
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={meal.time || ""}
                          onChange={(e) =>
                            handleMealTimeChange(mealIndex, e.target.value)
                          }
                          className="bg-zinc-700/50 border border-zinc-600/50 text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 focus:border-[#3E92CC] rounded px-2 py-1"
                        >
                          <option value="">Select time...</option>
                          {Array.from({ length: 24 }, (_, hour) => 
                            Array.from({ length: 4 }, (_, quarter) => {
                              const minutes = quarter * 15;
                              const timeValue = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                              const displayTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                              return (
                                <option key={timeValue} value={timeValue}>
                                  {displayTime}
                                </option>
                              );
                            })
                          ).flat()}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={meal.notes || ""}
                        onChange={(e) =>
                          handleMealNotesChange(mealIndex, e.target.value)
                        }
                        className="w-full bg-transparent border-none text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded px-2 py-1 mt-1"
                        placeholder="Notes..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setSelectedMealForAddition({ mealIndex });
                        onShowMealLibrary();
                      }}
                      leftIcon={
                        <Icon icon="mdi:library" width={16} height={16} />
                      }
                    >
                      Add from Library
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setSelectedMealForAddition({ mealIndex });
                        onShowMealCreate();
                      }}
                      leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
                    >
                      Create New Meal
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteMeal(mealIndex)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Icon icon="mdi:delete" width={16} height={16} />
                    </Button>
                  </div>
                </div>

                {meal.options && meal.options.length > 0 ? (
                  <div className="space-y-4">
                    {meal.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="p-6 rounded-xl border transition-all duration-200 bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600"
                      >
                        <div className="flex items-start gap-4">
                          {option.imageUrl && (
                            <div className="flex-shrink-0">
                              <Image
                                src={option.imageUrl}
                                alt={option.name}
                                className="w-24 h-24 object-cover rounded-xl"
                                width={96}
                                height={96}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="text"
                                  value={option.name || ""}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      mealIndex,
                                      optionIndex,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="bg-transparent border-none text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded px-2 py-1"
                                  placeholder="Meal name..."
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="secondary"
                                  size="small"
                                  onClick={() => {
                                    onMealSelect({
                                      meal,
                                      option,
                                      mealIndex,
                                      optionIndex,
                                    });
                                    onShowMealModal();
                                  }}
                                  className="text-zinc-400 hover:text-white"
                                >
                                  <Icon icon="mdi:eye" width={16} height={16} />
                                </Button>
                                <Button
                                  variant="warning"
                                  size="small"
                                  onClick={() =>
                                    setSelectedMealForReplacement({
                                      meal,
                                      option,
                                      mealIndex,
                                      optionIndex,
                                    })
                                  }
                                  className="text-zinc-400 hover:text-white"
                                >
                                  <Icon
                                    icon="mdi:swap-horizontal"
                                    width={16}
                                    height={16}
                                  />
                                </Button>
                                <Button
                                  variant="danger"
                                  size="small"
                                  onClick={() =>
                                    handleDeleteOption(mealIndex, optionIndex)
                                  }
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <Icon
                                    icon="mdi:delete"
                                    width={16}
                                    height={16}
                                  />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                <input
                                  type="number"
                                  value={option.calories || ""}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      mealIndex,
                                      optionIndex,
                                      "calories",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-transparent border-none text-orange-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                  placeholder="0"
                                />
                                <div className="text-zinc-400 text-xs">cal</div>
                              </div>
                              <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                <input
                                  type="number"
                                  value={option.protein || ""}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      mealIndex,
                                      optionIndex,
                                      "protein",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-transparent border-none text-blue-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                  placeholder="0"
                                />
                                <div className="text-zinc-400 text-xs">
                                  protein
                                </div>
                              </div>
                              <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                <input
                                  type="number"
                                  value={option.carbs || ""}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      mealIndex,
                                      optionIndex,
                                      "carbs",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-transparent border-none text-yellow-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                  placeholder="0"
                                />
                                <div className="text-zinc-400 text-xs">
                                  carbs
                                </div>
                              </div>
                              <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                <input
                                  type="number"
                                  value={option.fat || ""}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      mealIndex,
                                      optionIndex,
                                      "fat",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-transparent border-none text-green-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                  placeholder="0"
                                />
                                <div className="text-zinc-400 text-xs">fat</div>
                              </div>
                            </div>

                            <textarea
                              value={option.description || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  mealIndex,
                                  optionIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                              placeholder={
                                option.isTextBased
                                  ? "Describe what to eat and how to prepare it (e.g., '2 eggs scrambled with spinach, 1 slice whole grain toast, 1/2 avocado')"
                                  : "Description..."
                              }
                              rows={option.isTextBased ? 4 : 3}
                            />

                            {option.recommendation && (
                              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon
                                    icon="mdi:lightbulb"
                                    className="text-yellow-400"
                                    width={16}
                                    height={16}
                                  />
                                  <span className="text-yellow-400 text-sm font-medium">
                                    Trainer Recommendation
                                  </span>
                                </div>
                                <textarea
                                  value={option.recommendation || ""}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      mealIndex,
                                      optionIndex,
                                      "recommendation",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                                  placeholder="Add trainer recommendation..."
                                  rows={3}
                                />
                              </div>
                            )}

                            {option.ingredients &&
                              Array.isArray(option.ingredients) && (
                                <textarea
                                  value={option.ingredients.join(", ")}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      mealIndex,
                                      optionIndex,
                                      "ingredients",
                                      e.target.value
                                    )
                                  }
                                  className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                                  placeholder="Ingredients (comma-separated)"
                                  rows={2}
                                />
                              )}

                            {/* Dietary Preferences */}
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon
                                  icon="mdi:food-variant"
                                  className="text-[#FF6B00]"
                                  width={16}
                                  height={16}
                                />
                                <span className="text-zinc-300 text-sm font-medium">
                                  Dietary Preferences
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(DIETARY_PREFERENCES).map(
                                  ([prefId, prefConfig]) => {
                                    const isSelected = (
                                      option.dietary || []
                                    ).includes(prefId);
                                    return (
                                      <button
                                        key={prefId}
                                        type="button"
                                        onClick={() =>
                                          toggleDietaryPreference(
                                            mealIndex,
                                            optionIndex,
                                            prefId
                                          )
                                        }
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                                          isSelected
                                            ? "bg-[#FF6B00] text-white shadow-lg"
                                            : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600/50 hover:text-white border border-zinc-600/50"
                                        }`}
                                      >
                                        <Icon
                                          icon={prefConfig.icon}
                                          className={`w-4 h-4 ${
                                            isSelected
                                              ? "text-white"
                                              : prefConfig.color
                                          }`}
                                          width={14}
                                          height={14}
                                        />
                                        <span>{prefConfig.label}</span>
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-zinc-600/50 rounded-xl bg-zinc-800/20">
                    <Icon
                      icon="mdi:food-off"
                      className="text-zinc-500 mx-auto mb-3"
                      width={32}
                      height={32}
                    />
                    <p className="text-zinc-400 text-sm mb-3">
                      No meal options added yet
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setSelectedMealForAddition({ mealIndex });
                          onShowMealLibrary();
                        }}
                        leftIcon={
                          <Icon icon="mdi:library" width={16} height={16} />
                        }
                      >
                        Add from Library
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setSelectedMealForAddition({ mealIndex });
                          onShowMealCreate();
                        }}
                        leftIcon={
                          <Icon icon="mdi:plus" width={16} height={16} />
                        }
                      >
                        Create New Meal
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-zinc-600/50 rounded-xl bg-zinc-800/20">
              <Icon
                icon="mdi:food-off"
                className="text-zinc-500 mx-auto mb-4"
                width={48}
                height={48}
              />
              <h4 className="text-zinc-300 text-lg font-medium mb-2">
                No meals added yet
              </h4>
              <p className="text-zinc-400 text-sm mb-4">
                Start by adding meals using the field above
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={onShowMealLibrary}
                  leftIcon={<Icon icon="mdi:library" width={16} height={16} />}
                >
                  Add from Library
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={onShowMealCreate}
                  leftIcon={<Icon icon="mdi:plus" width={16} height={16} />}
                >
                  Create New Meal
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
