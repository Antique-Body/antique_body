"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { CustomMealModal } from "./CustomMealModal";
import { WaterIntakeTracker } from "./WaterIntakeTracker";
import { NutritionSummary } from "./NutritionSummary";
import { DayNavigation } from "./DayNavigation";

export const CustomMealTracker = ({ 
  assignedPlan, 
  activePlan,
  dailyLogs = []
}) => {
  // Debug log to see if component is being called
  console.log("CustomMealTracker rendered with:", { assignedPlan, activePlan, dailyLogs });
  const [selectedDay, setSelectedDay] = useState(1);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Standardni obroci za custom tracking
  const mealTypes = [
    { 
      name: "Breakfast", 
      time: "08:00", 
      icon: "mdi:coffee",
      color: "from-amber-500 to-orange-500"
    },
    { 
      name: "Lunch", 
      time: "13:00", 
      icon: "mdi:food",
      color: "from-green-500 to-emerald-500"
    },
    { 
      name: "Dinner", 
      time: "19:00", 
      icon: "mdi:silverware-fork-knife",
      color: "from-blue-500 to-indigo-500"
    },
    { 
      name: "Snack", 
      time: "15:00", 
      icon: "mdi:cookie",
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Get today's date for comparison
  const today = new Date();
  const startDate = activePlan?.startDate ? new Date(activePlan.startDate) : today;
  
  // Calculate current day number
  const currentDayNumber = Math.floor(
    (today - startDate) / (1000 * 60 * 60 * 24)
  ) + 1;

  // Get data for selected day
  const selectedDayData = dailyLogs.find(log => log.dayNumber === selectedDay) || {
    date: new Date(startDate.getTime() + (selectedDay - 1) * 24 * 60 * 60 * 1000),
    mealLogs: [],
    waterIntake: 0,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('sr-RS', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle adding custom meal
  const handleAddMeal = async (mealType, mealTime) => {
    setSelectedMealType({ name: mealType, time: mealTime });
    setShowMealModal(true);
  };

  // Handle saving custom meal
  const handleSaveMeal = async (mealData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/client/diet-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'log-custom-meal',
          mealType: selectedMealType.name,
          mealData,
          date: selectedDayData.date,
          portionMultiplier: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save meal');
      }

      // Refresh data
      window.location.reload(); // Temporary - ideally use proper state management
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle water intake update
  const handleWaterUpdate = async (date, waterAmount) => {
    try {
      const response = await fetch('/api/users/client/diet-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-water',
          date,
          waterAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update water intake');
      }

      // Refresh data
      window.location.reload(); // Temporary - ideally use proper state management
    } catch (error) {
      console.error('Error updating water intake:', error);
      throw error;
    }
  };

  // Get meals logged for specific meal type
  const getMealsForType = (mealType) => {
    return selectedDayData.mealLogs.filter(
      meal => meal.mealName.toLowerCase() === mealType.toLowerCase()
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Custom Meal Tracking
        </h1>
        <p className="text-zinc-400 text-lg">
          Track your daily nutrition with flexible meal input
        </p>
      </div>

      {/* Day Navigation */}
      <DayNavigation
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
        currentDay={currentDayNumber}
        totalDays={30} // Default to 30 days for custom tracking
        startDate={startDate}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Header */}
          <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/30 border border-zinc-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Dan {selectedDay}
                </h2>
                <p className="text-zinc-400">
                  {formatDate(selectedDayData.date)}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedDay === currentDayNumber
                  ? "bg-[#FF6B00]/20 text-[#FF6B00]"
                  : selectedDay < currentDayNumber
                  ? "bg-green-500/20 text-green-400"
                  : "bg-zinc-600/20 text-zinc-400"
              }`}>
                {selectedDay === currentDayNumber
                  ? "Danas"
                  : selectedDay < currentDayNumber
                  ? "Završen"
                  : "Nadolazeći"}
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="space-y-6">
            {mealTypes.map((mealType) => {
              const mealsForType = getMealsForType(mealType.name);
              
              return (
                <div key={mealType.name} className="space-y-4">
                  {/* Meal Type Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${mealType.color} flex items-center justify-center shadow-lg`}>
                        <Icon 
                          icon={mealType.icon} 
                          className="w-5 h-5 text-white" 
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {mealType.name}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          Preporučeno vreme: {mealType.time}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAddMeal(mealType.name, mealType.time)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] hover:text-[#FF8B20] transition-all duration-200 disabled:opacity-50"
                    >
                      <Icon icon="mdi:plus" className="w-4 h-4" />
                      Dodaj
                    </button>
                  </div>

                  {/* Logged Meals */}
                  {mealsForType.length > 0 ? (
                    <div className="grid gap-4">
                      {mealsForType.map((meal) => (
                        <div key={meal.id} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Icon 
                                icon={meal.isCompleted ? "mdi:check-circle" : "mdi:clock"} 
                                className={`w-5 h-5 ${
                                  meal.isCompleted ? "text-green-400" : "text-yellow-400"
                                }`} 
                              />
                              <div>
                                <h4 className="font-medium text-white">
                                  {meal.selectedOption?.name || "Custom Meal"}
                                </h4>
                                <p className="text-sm text-zinc-400">
                                  {meal.mealTime} • {meal.isCustom ? "Custom" : "Standard"}
                                </p>
                              </div>
                            </div>
                            
                            {meal.portionMultiplier !== 1 && (
                              <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                                {meal.portionMultiplier}x porcija
                              </span>
                            )}
                          </div>

                          {/* Nutrition Info */}
                          <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-orange-300">
                                {Math.round(meal.calories || 0)}
                              </div>
                              <div className="text-xs text-zinc-500">Kalorije</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-300">
                                {Math.round(meal.protein || 0)}g
                              </div>
                              <div className="text-xs text-zinc-500">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-300">
                                {Math.round(meal.carbs || 0)}g
                              </div>
                              <div className="text-xs text-zinc-500">Ugljeni hidrati</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-yellow-300">
                                {Math.round(meal.fat || 0)}g
                              </div>
                              <div className="text-xs text-zinc-500">Masti</div>
                            </div>
                          </div>

                          {/* Meal Description */}
                          {meal.selectedOption?.description && (
                            <div className="mt-3 pt-3 border-t border-zinc-700/50">
                              <p className="text-sm text-zinc-400">
                                {meal.selectedOption.description}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-zinc-600/50 rounded-xl p-6 text-center">
                      <Icon 
                        icon="mdi:food-off" 
                        className="w-8 h-8 text-zinc-500 mx-auto mb-2" 
                      />
                      <p className="text-zinc-400 text-sm">
                        Nema unetih obroka za {mealType.name.toLowerCase()}
                      </p>
                      <button
                        onClick={() => handleAddMeal(mealType.name, mealType.time)}
                        className="mt-2 text-[#FF6B00] hover:text-[#FF8B20] text-sm font-medium transition-colors"
                      >
                        Dodaj prvi obrok →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Water Intake Tracker */}
          <WaterIntakeTracker
            currentIntake={selectedDayData.waterIntake || 0}
            dailyGoal={2.5}
            date={selectedDayData.date}
            onUpdateWater={handleWaterUpdate}
          />

          {/* Nutrition Summary */}
          <NutritionSummary
            dailyNutrition={{
              calories: selectedDayData.totalCalories || 0,
              protein: selectedDayData.totalProtein || 0,
              carbs: selectedDayData.totalCarbs || 0,
              fat: selectedDayData.totalFat || 0,
            }}
            targetNutrition={{
              calories: 2000, // Default targets for custom tracking
              protein: 150,
              carbs: 200,
              fat: 80,
            }}
            selectedDay={selectedDay}
            currentDay={currentDayNumber}
            completedMeals={selectedDayData.mealLogs?.filter(m => m.isCompleted).length || 0}
            totalMeals={selectedDayData.mealLogs?.length || 0}
            waterIntake={selectedDayData.waterIntake || 0}
            waterGoal={2.5}
          />
        </div>
      </div>

      {/* Custom Meal Modal */}
      <CustomMealModal
        isOpen={showMealModal}
        onClose={() => {
          setShowMealModal(false);
          setSelectedMealType(null);
        }}
        onSave={handleSaveMeal}
        mealName={selectedMealType?.name}
        mealTime={selectedMealType?.time}
        isCustomTracking={true}
        allowMealTypeSelection={false}
      />
    </div>
  );
};