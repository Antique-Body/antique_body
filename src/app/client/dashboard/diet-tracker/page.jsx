"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";
import { mockNutritionPlan } from "@/components/custom/dashboard/client/pages/diet-tracker/mockNutritionPlan";

export default function DietTrackerPage() {
  const [selectedDate] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loggedMeals, setLoggedMeals] = useState({});
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showCustomMealModal, setShowCustomMealModal] = useState(false);
  const [customMeal, setCustomMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Get current day data
  const currentDay = mockNutritionPlan.days[selectedDayIndex];
  const dayKey = `day-${selectedDayIndex}-${selectedDate.toDateString()}`;

  // Calculate daily totals from logged meals
  const calculateDailyTotals = () => {
    const dayMeals = loggedMeals[dayKey] || [];
    return dayMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + (meal.calories || 0),
        protein: totals.protein + (meal.protein || 0),
        carbs: totals.carbs + (meal.carbs || 0),
        fat: totals.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const dailyTotals = calculateDailyTotals();
  const dailyTargets = { calories: 2800, protein: 180, carbs: 350, fat: 93 };

  // Handle meal logging
  const logMeal = (meal) => {
    const mealData = {
      ...meal,
      loggedAt: new Date(),
      mealType: selectedMeal?.name,
    };

    setLoggedMeals((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), mealData],
    }));

    setShowMealModal(false);
    setSelectedMeal(null);
  };

  const logCustomMeal = () => {
    const mealData = {
      name: customMeal.name,
      calories: parseFloat(customMeal.calories) || 0,
      protein: parseFloat(customMeal.protein) || 0,
      carbs: parseFloat(customMeal.carbs) || 0,
      fat: parseFloat(customMeal.fat) || 0,
      loggedAt: new Date(),
      mealType: selectedMeal?.name,
      isCustom: true,
    };

    setLoggedMeals((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), mealData],
    }));

    setCustomMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    setShowCustomMealModal(false);
    setSelectedMeal(null);
  };

  const removeMeal = (mealIndex) => {
    setLoggedMeals((prev) => ({
      ...prev,
      [dayKey]: (prev[dayKey] || []).filter((_, index) => index !== mealIndex),
    }));
  };

  // Get progress percentage
  const getProgress = (current, target) =>
    Math.min((current / target) * 100, 100);

  // Get last 7 days of logged meals
  const getWeekHistory = () => {
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = `day-${selectedDayIndex}-${date.toDateString()}`;
      const dayMeals = loggedMeals[key] || [];
      const totals = dayMeals.reduce(
        (acc, meal) => ({
          calories: acc.calories + (meal.calories || 0),
          protein: acc.protein + (meal.protein || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fat: acc.fat + (meal.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      history.push({
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        ...totals,
        mealsCount: dayMeals.length,
      });
    }
    return history;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Diet Tracker</h1>
          <p className="text-gray-400">
            Track your nutrition and reach your goals
          </p>
        </motion.div>

        {/* Assigned Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FF6B00]/10 backdrop-blur-sm border border-[#FF6B00]/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#FF6B00]/50">
                <img
                  src={mockNutritionPlan.coverImage}
                  alt={mockNutritionPlan.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    icon="mdi:nutrition"
                    className="w-5 h-5 text-[#FF6B00]"
                  />
                  <span className="text-sm text-[#FF6B00] font-medium">
                    Plan Assigned
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {mockNutritionPlan.title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mockNutritionPlan.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#FF6B00]">
                  {mockNutritionPlan.duration}
                </div>
                <div className="text-sm text-gray-400">
                  {mockNutritionPlan.durationType}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Day Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Select Day</h3>
              <div className="text-sm text-gray-400">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {mockNutritionPlan.days.map((day, index) => (
                <Button
                  key={index}
                  variant={selectedDayIndex === index ? "primary" : "ghost"}
                  size="small"
                  onClick={() => setSelectedDayIndex(index)}
                  className={`${
                    day.isRestDay
                      ? "border-yellow-500/30 text-yellow-400"
                      : selectedDayIndex === index
                      ? "bg-[#FF6B00] text-white"
                      : "border-white/20 text-gray-300 hover:border-[#FF6B00]/50"
                  }`}
                >
                  {day.isRestDay ? "Rest" : `Day ${index + 1}`}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Current Day Content */}
        <motion.div
          key={selectedDayIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {currentDay.isRestDay ? (
            <div className="text-center py-16">
              <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8 max-w-md mx-auto">
                <Icon
                  icon="mdi:sleep"
                  className="w-16 h-16 text-yellow-400 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                  Rest Day
                </h3>
                <p className="text-gray-300">{currentDay.description}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Daily Progress */}
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">
                  Daily Progress
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      key: "calories",
                      label: "Calories",
                      unit: "kcal",
                      color: "blue",
                    },
                    {
                      key: "protein",
                      label: "Protein",
                      unit: "g",
                      color: "red",
                    },
                    { key: "carbs", label: "Carbs", unit: "g", color: "green" },
                    { key: "fat", label: "Fat", unit: "g", color: "yellow" },
                  ].map((macro) => {
                    const progress = getProgress(
                      dailyTotals[macro.key],
                      dailyTargets[macro.key]
                    );
                    return (
                      <div key={macro.key} className="text-center">
                        <div
                          className={`text-2xl font-bold text-${macro.color}-400 mb-1`}
                        >
                          {Math.round(dailyTotals[macro.key])}
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          {macro.label} / {dailyTargets[macro.key]} {macro.unit}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`h-2 bg-${macro.color}-500 rounded-full`}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(progress)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meals */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Today's Meals
                  </h3>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setShowHistoryModal(true)}
                    leftIcon={<Icon icon="mdi:history" className="w-4 h-4" />}
                    className="text-[#FF6B00] hover:text-[#FF6B00]/80"
                  >
                    7-Day History
                  </Button>
                </div>

                {currentDay.meals.map((meal, index) => {
                  const mealLogs = (loggedMeals[dayKey] || []).filter(
                    (log) => log.mealType === meal.name
                  );
                  const isCompleted = mealLogs.length > 0;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-black/20 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                        isCompleted
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-white/10 hover:border-[#FF6B00]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isCompleted
                                ? "bg-green-500/20"
                                : "bg-[#FF6B00]/20"
                            }`}
                          >
                            <Icon
                              icon={
                                isCompleted
                                  ? "mdi:check-circle"
                                  : "mdi:silverware-fork-knife"
                              }
                              className={`w-5 h-5 ${
                                isCompleted
                                  ? "text-green-400"
                                  : "text-[#FF6B00]"
                              }`}
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {meal.name}
                            </h4>
                            <p className="text-sm text-gray-400">{meal.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => {
                                const allMeals = loggedMeals[dayKey] || [];
                                const mealToRemove = allMeals.findIndex(
                                  (m, i) =>
                                    m.mealType === meal.name &&
                                    i ===
                                      allMeals.filter(
                                        (m2) => m2.mealType === meal.name
                                      ).length -
                                        1 +
                                        allMeals.findIndex(
                                          (m2) => m2.mealType === meal.name
                                        )
                                );
                                if (mealToRemove !== -1)
                                  removeMeal(mealToRemove);
                              }}
                              className="text-red-400 hover:text-red-300"
                              leftIcon={
                                <Icon icon="mdi:pencil" className="w-4 h-4" />
                              }
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            variant={isCompleted ? "ghost" : "primary"}
                            size="small"
                            onClick={() => {
                              setSelectedMeal(meal);
                              setShowMealModal(true);
                            }}
                            className={isCompleted ? "text-gray-400" : ""}
                          >
                            {isCompleted ? "Add More" : "Log Meal"}
                          </Button>
                        </div>
                      </div>

                      {/* Meal Options Preview */}
                      {meal.options && meal.options.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {meal.options
                            .slice(0, 2)
                            .map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="bg-white/5 rounded-lg p-3 border border-white/10"
                              >
                                <h5 className="font-medium text-white text-sm mb-2">
                                  {option.name}
                                </h5>
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>{option.calories} cal</span>
                                  <span>{option.protein}g protein</span>
                                  <span>{option.carbs}g carbs</span>
                                  <span>{option.fat}g fat</span>
                                </div>
                              </div>
                            ))}
                          {meal.options.length > 2 && (
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-center">
                              <span className="text-sm text-gray-400">
                                +{meal.options.length - 2} more options
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Logged Meals */}
                      {mealLogs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">
                            Logged:
                          </h5>
                          <div className="space-y-2">
                            {mealLogs.map((log, logIndex) => (
                              <div
                                key={logIndex}
                                className="flex items-center justify-between bg-black/20 rounded-lg p-2"
                              >
                                <div>
                                  <span className="text-sm text-white">
                                    {log.name}
                                  </span>
                                  {log.isCustom && (
                                    <span className="ml-2 text-xs text-[#FF6B00]">
                                      (Custom)
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {log.calories} cal, {log.protein}g protein
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Meal Selection Modal */}
      <Modal
        isOpen={showMealModal}
        onClose={() => {
          setShowMealModal(false);
          setSelectedMeal(null);
        }}
        title={`Log ${selectedMeal?.name}`}
        maxWidth="lg"
      >
        {selectedMeal && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Choose from trainer recommendations or add custom meal
              </h3>
              <p className="text-gray-400">
                Select what you ate for {selectedMeal.name.toLowerCase()}
              </p>
            </div>

            {/* Trainer Recommendations */}
            {selectedMeal.options && selectedMeal.options.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-white mb-4">
                  Trainer Recommendations
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedMeal.options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-black/20 rounded-lg p-4 border border-white/10 hover:border-[#FF6B00]/30 cursor-pointer transition-all"
                      onClick={() => logMeal(option)}
                    >
                      <div className="flex items-start gap-4">
                        {option.imageUrl && (
                          <img
                            src={option.imageUrl}
                            alt={option.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-semibold text-white mb-1">
                            {option.name}
                          </h5>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {option.description}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-300">
                            <span>{option.calories} cal</span>
                            <span>{option.protein}g protein</span>
                            <span>{option.carbs}g carbs</span>
                            <span>{option.fat}g fat</span>
                          </div>
                        </div>
                        <Button variant="primary" size="small">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Meal Option */}
            <div className="pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  setShowMealModal(false);
                  setShowCustomMealModal(true);
                }}
                leftIcon={<Icon icon="mdi:plus" className="w-4 h-4" />}
                className="text-[#FF6B00] hover:text-[#FF6B00]/80 border-[#FF6B00]/30 hover:border-[#FF6B00]/50"
              >
                Add Custom Meal
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom Meal Modal */}
      <Modal
        isOpen={showCustomMealModal}
        onClose={() => {
          setShowCustomMealModal(false);
          setCustomMeal({
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
          });
        }}
        title="Add Custom Meal"
        maxWidth="md"
      >
        <div className="space-y-4">
          <FormField
            label="Meal Name"
            type="text"
            value={customMeal.name}
            onChange={(e) =>
              setCustomMeal({ ...customMeal, name: e.target.value })
            }
            placeholder="Enter meal name"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Calories"
              type="number"
              value={customMeal.calories}
              onChange={(e) =>
                setCustomMeal({ ...customMeal, calories: e.target.value })
              }
              placeholder="0"
            />
            <FormField
              label="Protein (g)"
              type="number"
              value={customMeal.protein}
              onChange={(e) =>
                setCustomMeal({ ...customMeal, protein: e.target.value })
              }
              placeholder="0"
            />
            <FormField
              label="Carbs (g)"
              type="number"
              value={customMeal.carbs}
              onChange={(e) =>
                setCustomMeal({ ...customMeal, carbs: e.target.value })
              }
              placeholder="0"
            />
            <FormField
              label="Fat (g)"
              type="number"
              value={customMeal.fat}
              onChange={(e) =>
                setCustomMeal({ ...customMeal, fat: e.target.value })
              }
              placeholder="0"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setShowCustomMealModal(false);
                setCustomMeal({
                  name: "",
                  calories: "",
                  protein: "",
                  carbs: "",
                  fat: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={logCustomMeal}
              disabled={!customMeal.name || !customMeal.calories}
            >
              Log Meal
            </Button>
          </div>
        </div>
      </Modal>

      {/* 7-Day History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="7-Day Nutrition History"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {getWeekHistory().map((day, index) => (
            <div
              key={index}
              className="bg-black/20 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{day.date}</h4>
                <span className="text-sm text-gray-400">
                  {day.mealsCount} meals logged
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    {Math.round(day.calories)}
                  </div>
                  <div className="text-xs text-gray-400">Calories</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-400">
                    {Math.round(day.protein)}g
                  </div>
                  <div className="text-xs text-gray-400">Protein</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {Math.round(day.carbs)}g
                  </div>
                  <div className="text-xs text-gray-400">Carbs</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">
                    {Math.round(day.fat)}g
                  </div>
                  <div className="text-xs text-gray-400">Fat</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
