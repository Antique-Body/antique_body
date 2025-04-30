"use client";

import { useMemo, useRef, useState } from "react";

import { ProgressBar } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CloseXIcon, PlusIcon } from "@/components/common/Icons";
import {
  AddFoodModal,
  MacroDistribution,
  MealCard,
  NutritionHistory,
} from "@/components/custom/client/dashboard/pages/nutrition/components";
import { weeklyNutritionHistory } from "@/components/custom/client/dashboard/pages/nutrition/data/foodDatabase";
import { FormField } from "@/components/shared";

export default function NutritionPage() {
  // Sample user data (should be fetched from API in production)
  const userData = {
    stats: {
      calorieGoal: 2400,
      proteinGoal: 180,
      carbsGoal: 240,
      fatGoal: 80,
    },
  };

  // Refs for scrolling
  const addMealFormRef = useRef(null);

  // State for meals logged today
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: "Breakfast",
      time: "08:30 AM",
      calories: 420,
      protein: 32,
      carbs: 35,
      fat: 18,
      fiber: 5,
      items: [
        {
          id: 101,
          name: "Oatmeal with Berries",
          amount: "1 cup (240g)",
          calories: 320,
          protein: 15,
          carbs: 40,
          fat: 8,
        },
        { id: 102, name: "Black Coffee", amount: "1 cup (240ml)", calories: 5, protein: 0, carbs: 0, fat: 0 },
      ],
    },
    {
      id: 2,
      name: "Lunch",
      time: "12:30 PM",
      calories: 650,
      protein: 48,
      carbs: 56,
      fat: 22,
      fiber: 8,
      items: [
        {
          id: 201,
          name: "Grilled Chicken Salad",
          amount: "1 serving (350g)",
          calories: 450,
          protein: 40,
          carbs: 20,
          fat: 20,
        },
        { id: 202, name: "Whole Grain Bread", amount: "2 slices (80g)", calories: 200, protein: 8, carbs: 36, fat: 2 },
      ],
    },
  ]);

  // State for new meal form
  const [showMealForm, setShowMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    time: "",
    items: [],
  });

  // State for modals
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showNutritionHistory, setShowNutritionHistory] = useState(false);

  // State for water intake
  const [waterIntake, setWaterIntake] = useState(1500); // ml

  // Calculate totals
  const totals = useMemo(
    () =>
      meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
          fiber: acc.fiber + (meal.fiber || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      ),
    [meals],
  );

  // Calculate percentages for progress bars
  const getPercentage = (consumed, goal) => {
    const percentage = (consumed / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Handle adding a food item to the current meal
  const handleAddFoodToMeal = foodItem => {
    setNewMeal({
      ...newMeal,
      items: [...newMeal.items, foodItem],
      calories: (newMeal.calories || 0) + foodItem.calories,
      protein: (newMeal.protein || 0) + foodItem.protein,
      carbs: (newMeal.carbs || 0) + foodItem.carbs,
      fat: (newMeal.fat || 0) + foodItem.fat,
      fiber: (newMeal.fiber || 0) + (foodItem.fiber || 0),
    });
  };

  // Handle adding a new meal
  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.time || newMeal.items.length === 0) return;

    const newId = meals.length > 0 ? Math.max(...meals.map(m => m.id)) + 1 : 1;
    setMeals([...meals, { id: newId, ...newMeal }]);
    setShowMealForm(false);
    setNewMeal({
      name: "",
      time: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      items: [],
    });
  };

  // Add water intake
  const addWater = amount => {
    setWaterIntake(waterIntake + amount);
  };

  // Delete a meal
  const deleteMeal = id => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  // Delete a food item from new meal
  const deleteNewMealItem = id => {
    const itemToRemove = newMeal.items.find(item => item.id === id);
    if (!itemToRemove) return;

    setNewMeal({
      ...newMeal,
      items: newMeal.items.filter(item => item.id !== id),
      calories: newMeal.calories - itemToRemove.calories,
      protein: newMeal.protein - itemToRemove.protein,
      carbs: newMeal.carbs - itemToRemove.carbs,
      fat: newMeal.fat - itemToRemove.fat,
      fiber: newMeal.fiber - (itemToRemove.fiber || 0),
    });
  };

  // Scroll to add meal form
  const scrollToAddMealForm = () => {
    setShowMealForm(true);
    setTimeout(() => {
      addMealFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Nutrition Overview */}
      <div className="z-30 rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg backdrop-blur-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Nutrition Overview</h2>
          <Button variant="ghostOrange" size="small" onClick={() => setShowNutritionHistory(true)}>
            View History
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <h3 className="mb-3 font-medium">Daily Calories Target</h3>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-2xl font-bold">{userData.stats.calorieGoal} cal</p>
              <div className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                Daily Goal
              </div>
            </div>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#444]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                style={{ width: `${getPercentage(totals.calories, userData.stats.calorieGoal)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-400">{totals.calories} consumed</p>
              <p className="text-gray-400">{userData.stats.calorieGoal - totals.calories} remaining</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
            <h3 className="mb-3 font-medium">Macronutrient Targets</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <p>Protein</p>
                  <p>
                    <span className="text-gray-300">{totals.protein}g</span> of {userData.stats.proteinGoal}g
                  </p>
                </div>
                <ProgressBar
                  value={totals.protein}
                  maxValue={userData.stats.proteinGoal}
                  color="bg-blue-500"
                  showValues={false}
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <p>Carbs</p>
                  <p>
                    <span className="text-gray-300">{totals.carbs}g</span> of {userData.stats.carbsGoal}g
                  </p>
                </div>
                <ProgressBar
                  value={totals.carbs}
                  maxValue={userData.stats.carbsGoal}
                  color="bg-green-500"
                  showValues={false}
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <p>Fat</p>
                  <p>
                    <span className="text-gray-300">{totals.fat}g</span> of {userData.stats.fatGoal}g
                  </p>
                </div>
                <ProgressBar
                  value={totals.fat}
                  maxValue={userData.stats.fatGoal}
                  color="bg-yellow-500"
                  showValues={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button variant="orangeFilled" onClick={scrollToAddMealForm} leftIcon={<PlusIcon />}>
            Log New Meal
          </Button>

          <Button variant="orangeOutline" onClick={() => setShowAddFoodModal(true)} leftIcon={<PlusIcon />}>
            Add Food Item
          </Button>
        </div>
      </div>

      {/* Today's Food Log */}
      <div className="z-30 rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg backdrop-blur-lg">
        <h2 className="mb-4 text-xl font-bold">Today's Food Log</h2>

        <div className="space-y-4">
          {meals.map(meal => (
            <MealCard key={meal.id} meal={meal} onDelete={deleteMeal} />
          ))}

          {/* Add New Meal Form */}
          {showMealForm && (
            <div ref={addMealFormRef} className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">Add New Meal</h3>
                <Button
                  variant="ghost"
                  size="small"
                  className="p-1 hover:bg-transparent"
                  onClick={() => setShowMealForm(false)}
                >
                  <CloseXIcon />
                </Button>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <FormField
                  label="Meal Name"
                  type="text"
                  value={newMeal.name}
                  onChange={e => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="e.g. Dinner"
                  backgroundStyle="transparent"
                  size="small"
                />
                <FormField
                  label="Time"
                  type="text"
                  value={newMeal.time}
                  onChange={e => setNewMeal({ ...newMeal, time: e.target.value })}
                  placeholder="e.g. 7:00 PM"
                  backgroundStyle="transparent"
                  size="small"
                />
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm text-gray-400">Food Items</label>
                  <Button
                    variant="ghostOrange"
                    size="small"
                    className="flex items-center p-0"
                    onClick={() => setShowAddFoodModal(true)}
                  >
                    <PlusIcon size={14} className="mr-1" />
                    Add Food
                  </Button>
                </div>

                {newMeal.items.length === 0 ? (
                  <div className="rounded-lg bg-[rgba(20,20,20,0.5)] p-4 text-center text-sm text-gray-400">
                    No food items added. Click "Add Food" to start.
                  </div>
                ) : (
                  <div className="max-h-60 space-y-2 overflow-y-auto p-1">
                    {newMeal.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-[#1a1a1a] p-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.amount}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">{item.calories} kcal</p>
                            <p className="text-xs text-gray-400">
                              P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="small"
                            className="p-0 text-gray-400 hover:bg-transparent hover:text-red-500"
                            onClick={() => deleteNewMealItem(item.id)}
                          >
                            <CloseXIcon />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4 rounded-lg bg-[rgba(20,20,20,0.5)] p-3">
                <div className="mb-1 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Meal Totals</h4>
                  <p className="text-sm font-medium">{newMeal.calories || 0} kcal</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                  <div>Protein: {newMeal.protein || 0}g</div>
                  <div>Carbs: {newMeal.carbs || 0}g</div>
                  <div>Fat: {newMeal.fat || 0}g</div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="small" onClick={() => setShowMealForm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="orangeFilled"
                  size="small"
                  onClick={handleAddMeal}
                  disabled={!newMeal.name || !newMeal.time || newMeal.items.length === 0}
                >
                  Add Meal
                </Button>
              </div>
            </div>
          )}

          {/* Add More Meals Button (only shown when form is not visible) */}
          {!showMealForm && (
            <Button
              variant="orangeOutline"
              fullWidth
              size="large"
              onClick={scrollToAddMealForm}
              leftIcon={<PlusIcon />}
            >
              Add Another Meal
            </Button>
          )}
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div className="z-30 rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg backdrop-blur-lg">
        <h2 className="mb-4 text-xl font-bold">Water Intake</h2>

        <div className="mb-4 rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
          <div className="mb-2 flex justify-between">
            <p className="font-medium">Today's Intake</p>
            <p className="font-medium text-blue-400">{(waterIntake / 1000).toFixed(1)} / 3.0 L</p>
          </div>

          <div className="mb-4 h-6 overflow-hidden rounded-full bg-[#1a1a1a]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${getPercentage(waterIntake, 3000)}%` }}
            ></div>
          </div>

          <div className="flex justify-between gap-3">
            <Button variant="blueOutline" onClick={() => addWater(250)} className="flex-1">
              +250ml
            </Button>
            <Button variant="blueOutline" onClick={() => addWater(500)} className="flex-1">
              +500ml
            </Button>
            <Button variant="blueOutline" onClick={() => addWater(750)} className="flex-1">
              +750ml
            </Button>
          </div>
        </div>
      </div>

      {/* Macro Breakdown & Statistics */}
      <div className="z-30 rounded-2xl border border-[#222] bg-[rgba(20,20,20,0.95)] p-6 shadow-lg backdrop-blur-lg">
        <h2 className="mb-4 text-xl font-bold">Nutrition Breakdown</h2>

        <div className="mb-4 rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4">
          <h3 className="mb-3 font-medium">Macro Distribution</h3>

          {/* Macro distribution chart */}
          <MacroDistribution protein={totals.protein * 4} carbs={totals.carbs * 4} fat={totals.fat * 9} />
        </div>

        <Button variant="orangeOutline" fullWidth onClick={() => setShowNutritionHistory(true)}>
          View Detailed Nutrition History
        </Button>
      </div>

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={showAddFoodModal}
        onClose={() => setShowAddFoodModal(false)}
        onAddFood={handleAddFoodToMeal}
      />

      {/* Nutrition History Modal */}
      {showNutritionHistory && (
        <NutritionHistory historyData={weeklyNutritionHistory} onClose={() => setShowNutritionHistory(false)} />
      )}
    </div>
  );
}
