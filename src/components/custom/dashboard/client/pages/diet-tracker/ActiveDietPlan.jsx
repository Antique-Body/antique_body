"use client";

import { Icon } from "@iconify/react";
import { useState, useMemo } from "react";

import { Button } from "@/components/common/Button";

import { AddSnackModal } from "./AddSnackModal";
import { CustomMealModal } from "./CustomMealModal";
import { DayNavigation } from "./DayNavigation";
import { MealDetailModal } from "./MealDetailModal";
import { NewMealCard } from "./NewMealCard";
import { NutritionSummary } from "./NutritionSummary";
import { PlanHeader } from "./PlanHeader";


export const ActiveDietPlan = ({
  activePlan,
  dailyLogs,
  nextMeal,
  validationError,
  onCompleteMeal,
  onUncompleteMeal,
  onChangeMealOption,
  onAddSnack,
  onDeleteSnack,
  getCompletionRate,
  getLogByDate,
  clearValidationError,
}) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMealDetail, setSelectedMealDetail] = useState(null);
  const [showMealDetail, setShowMealDetail] = useState(false);
  const [showCustomMeal, setShowCustomMeal] = useState(false);
  const [customMealContext, setCustomMealContext] = useState(null);
  const [showAddSnack, setShowAddSnack] = useState(false);

  // Get current day number based on start date
  const getCurrentDay = () => {
    if (!activePlan?.startDate) return 1;

    const startDate = new Date(activePlan.startDate);
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(
      1,
      Math.min(diffDays + 1, activePlan.nutritionPlan.days.length)
    );
  };

  const currentDay = getCurrentDay();

  // Get the selected day's data
  const selectedDayData = useMemo(
    () => activePlan?.nutritionPlan?.days?.[selectedDay - 1],
    [activePlan, selectedDay]
  );

  // Get daily log for selected day
  const selectedDayLog = useMemo(() => {
    if (!activePlan?.startDate) return null;

    const startDate = new Date(activePlan.startDate);
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + selectedDay - 1);

    return getLogByDate(dayDate);
  }, [selectedDay, activePlan, getLogByDate]);

  // Get selected day's date
  const getSelectedDayDate = () => {
    if (!activePlan?.startDate) return new Date();

    const startDate = new Date(activePlan.startDate);
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + selectedDay - 1);

    return dayDate;
  };

  // Calculate dynamic meal completion stats (only for planned meals)
  const mealCompletionStats = useMemo(() => {
    if (!selectedDayLog?.mealLogs || !selectedDayData?.meals) {
      return {
        completedMeals: 0,
        totalMeals: selectedDayData?.meals?.length || 0,
      };
    }

    const completedMeals = selectedDayLog.mealLogs.filter(
      (meal) => meal.isCompleted
    ).length;
    const totalMeals = selectedDayData.meals.length;

    return { completedMeals, totalMeals };
  }, [selectedDayLog?.mealLogs, selectedDayData?.meals]);

  // Check if day is editable (only current day)
  const isDayEditable = selectedDay === currentDay;

  // Get next meal info for current day
  const getNextMealInfo = () => {
    if (!isDayEditable || !selectedDayData?.meals) return null;

    // Find first incomplete meal
    for (let i = 0; i < selectedDayData.meals.length; i++) {
      const meal = selectedDayData.meals[i];
      const mealLog = selectedDayLog?.mealLogs?.find(
        (log) => log.mealName === meal.name
      );

      if (!mealLog?.isCompleted) {
        return {
          mealIndex: i,
          meal,
          mealLog,
        };
      }
    }

    return null;
  };

  const nextMealInfo = getNextMealInfo();

  // Check if meal is editable (must complete meals in order)
  const isMealEditable = (mealIndex) => {
    if (!isDayEditable) return false;

    // For current day, allow editing if it's the next meal or already completed
    if (nextMealInfo?.mealIndex === mealIndex) return true;

    // Also allow editing of already completed meals (to uncomplete them)
    const meal = selectedDayData?.meals?.[mealIndex];
    const mealLog = selectedDayLog?.mealLogs?.find(
      (log) => log.mealName === meal?.name
    );
    return mealLog?.isCompleted || false;
  };

  // Handle meal completion
  const handleLogMeal = async (meal, option, mealLog) => {
    try {
      if (mealLog?.isCompleted) {
        // If meal is already completed, uncomplete it
        await onUncompleteMeal(mealLog.id);
      } else {
        // If meal is not completed, complete it
        if (mealLog) {
          // First change the meal option if different
          if (mealLog.selectedOption?.name !== option.name) {
            await onChangeMealOption(mealLog.id, option);
          }

          // Then complete the meal
          await onCompleteMeal(mealLog.id);
        }
      }
    } catch (error) {
      console.error("Error logging meal:", error);
    }
  };

  // Handle meal detail view
  const handleViewMealDetail = (meal, option) => {
    setSelectedMealDetail({ meal, option });
    setShowMealDetail(true);
  };

  // Handle custom meal
  const handleCustomMeal = (meal, mealLog) => {
    setCustomMealContext({
      meal,
      mealLog,
      dayNumber: selectedDay,
      date: (() => {
        const startDate = new Date(activePlan.startDate);
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + selectedDay - 1);
        return dayDate.toISOString().split("T")[0];
      })(),
    });
    setShowCustomMeal(true);
  };

  // Handle custom meal save
  const handleCustomMealSave = async (customMealData) => {
    try {
      // Create custom meal option
      const customOption = {
        name: customMealData.name,
        description: customMealData.description,
        calories: customMealData.calories,
        protein: customMealData.protein,
        carbs: customMealData.carbs,
        fat: customMealData.fat,
        ingredients: customMealData.ingredients || [],
        imageUrl: null,
        isCustom: true,
      };

      // If we have a meal log, change its option and complete it
      if (customMealContext?.mealLog) {
        // Change meal option to custom
        await onChangeMealOption(customMealContext.mealLog.id, customOption);

        // Complete the meal
        await onCompleteMeal(customMealContext.mealLog.id);
      }

      // Save to custom meal history
      try {
        await fetch("/api/users/client/diet-tracker/custom-meals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: customMealData.name,
            description: customMealData.description,
            mealType: customMealContext?.meal?.name?.toLowerCase() || "meal",
            calories: customMealData.calories,
            protein: customMealData.protein,
            carbs: customMealData.carbs,
            fat: customMealData.fat,
            ingredients: customMealData.ingredients || [],
          }),
        });
      } catch (historyError) {
        console.error("Error saving to history:", historyError);
        // Don't fail the whole operation if history save fails
      }

      // Close modal
      setShowCustomMeal(false);
      setCustomMealContext(null);
    } catch (error) {
      console.error("Error saving custom meal:", error);
    }
  };

  // Handle snack save
  const handleSnackSave = async (date, snackData) => {
    try {
      await onAddSnack(date, snackData);
      setShowAddSnack(false);
    } catch (error) {
      console.error("Error adding snack:", error);
    }
  };

  // Handle meal deletion
  const handleDeleteMeal = async (mealLog) => {
    try {
      // "Delete" means uncomplete the meal
      await onUncompleteMeal(mealLog.id);
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  // Handle snack deletion
  const handleDeleteSnack = async (snackLog) => {
    try {
      await onDeleteSnack(snackLog.id);
    } catch (error) {
      console.error("Error deleting snack:", error);
    }
  };

  // Calculate daily nutrition totals (including snacks)
  const getDailyNutrition = () => {
    if (!selectedDayLog) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    // Get nutrition from completed meals
    const mealNutrition = selectedDayLog.mealLogs
      ? selectedDayLog.mealLogs
          .filter((meal) => meal.isCompleted)
          .reduce(
            (total, meal) => ({
              calories: total.calories + (meal.calories || 0),
              protein: total.protein + (meal.protein || 0),
              carbs: total.carbs + (meal.carbs || 0),
              fat: total.fat + (meal.fat || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          )
      : { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // Get nutrition from snacks
    const snackNutrition = selectedDayLog.snackLogs
      ? selectedDayLog.snackLogs.reduce(
          (total, snack) => ({
            calories: total.calories + (snack.calories || 0),
            protein: total.protein + (snack.protein || 0),
            carbs: total.carbs + (snack.carbs || 0),
            fat: total.fat + (snack.fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )
      : { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // Combine meal and snack nutrition
    return {
      calories: mealNutrition.calories + snackNutrition.calories,
      protein: mealNutrition.protein + snackNutrition.protein,
      carbs: mealNutrition.carbs + snackNutrition.carbs,
      fat: mealNutrition.fat + snackNutrition.fat,
    };
  };

  const dailyNutrition = getDailyNutrition();

  // Get snack logs for selected day
  const getSnackLogs = () => {
    if (!selectedDayLog?.snackLogs) return [];

    // Sort snacks by logged time
    return selectedDayLog.snackLogs.sort((a, b) =>
      a.loggedTime.localeCompare(b.loggedTime)
    );
  };

  const snacks = getSnackLogs();

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <PlanHeader
        activePlan={activePlan}
        nextMeal={nextMeal}
        currentDay={currentDay}
        completionRate={getCompletionRate()}
        validationError={validationError}
        onClearValidationError={clearValidationError}
      />

      {/* Day Navigation */}
      <DayNavigation
        days={activePlan.nutritionPlan.days}
        selectedDay={selectedDay}
        currentDay={currentDay}
        onSelectDay={setSelectedDay}
        dailyLogs={dailyLogs}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Meals Section */}
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {selectedDayData?.name || `Day ${selectedDay}`} Meals
            </h2>
            {selectedDayData?.description && (
              <p className="text-zinc-400 text-sm">
                {selectedDayData.description}
              </p>
            )}
          </div>

          {/* Add Snack Button */}
          {isDayEditable && (
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setShowAddSnack(true)}
                className="h-10 px-4"
              >
                <Icon icon="mdi:plus-circle" className="w-4 h-4 mr-2" />
                Add Snack
              </Button>
            </div>
          )}

          {/* Rest Day */}
          {selectedDayData?.isRestDay ? (
            <div className="text-center py-12 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:food-off" className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Rest Day
              </h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                {selectedDayData.description ||
                  "Take a break from the structured meal plan. Enjoy your favorite foods in moderation."}
              </p>

              {/* Allow adding snacks even on rest days */}
              {isDayEditable && (
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={() => setShowAddSnack(true)}
                    className="h-10 px-4"
                  >
                    <Icon icon="mdi:plus-circle" className="w-4 h-4 mr-2" />
                    Add Snack or Drink
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Planned Meal Cards */}
              <div className="grid gap-6">
                {selectedDayData?.meals?.map((meal, index) => {
                  const mealLog = selectedDayLog?.mealLogs?.find(
                    (log) => log.mealName === meal.name
                  );

                  const isNextMeal = nextMealInfo?.mealIndex === index;
                  const isEditable = isMealEditable(index);
                  const isCompleted = mealLog?.isCompleted || false;

                  return (
                    <NewMealCard
                      key={`${meal.name}-${index}`}
                      meal={meal}
                      mealLog={mealLog}
                      isNextMeal={isNextMeal}
                      isEditable={isEditable}
                      isCompleted={isCompleted}
                      isDayEditable={isDayEditable}
                      onLogMeal={handleLogMeal}
                      onViewDetail={handleViewMealDetail}
                      onCustomMeal={handleCustomMeal}
                      onDeleteMeal={handleDeleteMeal}
                    />
                  );
                })}
              </div>

              {/* Extra Snacks/Meals Section */}
              {snacks.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:food-apple"
                      className="w-5 h-5 text-[#FF6B00]"
                    />
                    <h3 className="text-lg font-semibold text-white">
                      Extra Snacks & Meals
                    </h3>
                    <span className="text-sm text-zinc-400">
                      ({snacks.length} items)
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {snacks.map((snackLog) => (
                      <div
                        key={snackLog.id}
                        className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <Icon
                                icon="mdi:food-apple"
                                className="w-5 h-5 text-purple-400"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium text-sm truncate">
                                  {snackLog.name}
                                </h4>
                                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium capitalize">
                                  {snackLog.mealType}
                                </span>
                                <span className="text-xs text-zinc-400">
                                  {snackLog.loggedTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-purple-300 flex-wrap">
                                <span>{snackLog.calories || 0} cal</span>
                                <span>{snackLog.protein || 0}g protein</span>
                                <span>{snackLog.carbs || 0}g carbs</span>
                                <span>{snackLog.fat || 0}g fat</span>
                              </div>
                            </div>
                          </div>

                          {/* Delete Snack Button */}
                          {isDayEditable && (
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => handleDeleteSnack(snackLog)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2 ml-2"
                            >
                              <Icon icon="mdi:delete" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nutrition Summary */}
        <div className="xl:col-span-1">
          <NutritionSummary
            dailyNutrition={dailyNutrition}
            targetNutrition={activePlan.nutritionPlan.nutritionInfo}
            selectedDay={selectedDay}
            currentDay={currentDay}
            completedMeals={mealCompletionStats.completedMeals}
            totalMeals={mealCompletionStats.totalMeals}
          />
        </div>
      </div>

      {/* Modals */}
      <MealDetailModal
        isOpen={showMealDetail}
        onClose={() => {
          setShowMealDetail(false);
          setSelectedMealDetail(null);
        }}
        meal={selectedMealDetail?.meal}
        option={selectedMealDetail?.option}
      />

      <CustomMealModal
        isOpen={showCustomMeal}
        onClose={() => {
          setShowCustomMeal(false);
          setCustomMealContext(null);
        }}
        onSave={handleCustomMealSave}
        mealName={customMealContext?.meal?.name}
        mealTime={customMealContext?.meal?.time}
      />

      <AddSnackModal
        isOpen={showAddSnack}
        onClose={() => setShowAddSnack(false)}
        onSave={handleSnackSave}
        selectedDate={getSelectedDayDate().toISOString().split("T")[0]}
      />
    </div>
  );
};
