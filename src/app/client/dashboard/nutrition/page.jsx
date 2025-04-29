"use client";

import { ProgressBar } from "@/components/common";
import {
    AddFoodModal,
    MacroDistribution,
    MealCard,
    NutritionHistory,
} from "@/components/custom/client/dashboard/pages/nutrition/components";
import { weeklyNutritionHistory } from "@/components/custom/client/dashboard/pages/nutrition/data/foodDatabase";
import { useMemo, useRef, useState } from "react";

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
    const totals = useMemo(() => {
        return meals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fat: acc.fat + meal.fat,
                fiber: acc.fiber + (meal.fiber || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        );
    }, [meals]);

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

    // Get calorie percentages by macronutrient
    const macroPercentages = useMemo(() => {
        const totalCals = totals.calories || 1; // Avoid division by zero
        return {
            protein: Math.round(((totals.protein * 4) / totalCals) * 100),
            carbs: Math.round(((totals.carbs * 4) / totalCals) * 100),
            fat: Math.round(((totals.fat * 9) / totalCals) * 100),
        };
    }, [totals]);

    return (
        <div className="space-y-6">
            {/* Nutrition Overview */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Nutrition Overview</h2>
                    <button
                        onClick={() => setShowNutritionHistory(true)}
                        className="text-sm text-[#FF6B00] hover:text-[#FF9A00]"
                    >
                        View History
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Daily Calories Target</h3>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-2xl font-bold">{userData.stats.calorieGoal} cal</p>
                            <div className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                Daily Goal
                            </div>
                        </div>
                        <div className="h-2 bg-[#444] rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
                                style={{ width: `${getPercentage(totals.calories, userData.stats.calorieGoal)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-400">{totals.calories} consumed</p>
                            <p className="text-gray-400">{userData.stats.calorieGoal - totals.calories} remaining</p>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Macronutrient Targets</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <p>Protein</p>
                                    <p>
                                        <span className="text-gray-300">{totals.protein}g</span> of {userData.stats.proteinGoal}
                                        g
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
                                <div className="flex justify-between text-sm mb-1">
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
                                <div className="flex justify-between text-sm mb-1">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={scrollToAddMealForm}
                        className="bg-[#FF6B00] text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[#FF9A00] flex items-center justify-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Log New Meal
                    </button>

                    <button
                        onClick={() => setShowAddFoodModal(true)}
                        className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)] flex items-center justify-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Food Item
                    </button>
                </div>
            </div>

            {/* Today's Food Log */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Today's Food Log</h2>

                <div className="space-y-4">
                    {meals.map(meal => (
                        <MealCard key={meal.id} meal={meal} onDelete={deleteMeal} />
                    ))}

                    {/* Add New Meal Form */}
                    {showMealForm && (
                        <div ref={addMealFormRef} className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium">Add New Meal</h3>
                                <button onClick={() => setShowMealForm(false)} className="text-gray-400 hover:text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Meal Name</label>
                                    <input
                                        type="text"
                                        value={newMeal.name}
                                        onChange={e => setNewMeal({ ...newMeal, name: e.target.value })}
                                        className="w-full p-2 bg-[rgba(20,20,20,0.8)] border border-[#444] rounded text-white"
                                        placeholder="e.g. Dinner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Time</label>
                                    <input
                                        type="text"
                                        value={newMeal.time}
                                        onChange={e => setNewMeal({ ...newMeal, time: e.target.value })}
                                        className="w-full p-2 bg-[rgba(20,20,20,0.8)] border border-[#444] rounded text-white"
                                        placeholder="e.g. 7:00 PM"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-400 text-sm">Food Items</label>
                                    <button
                                        onClick={() => setShowAddFoodModal(true)}
                                        className="text-[#FF6B00] text-sm hover:text-[#FF9A00] flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-1"
                                        >
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Add Food
                                    </button>
                                </div>

                                {newMeal.items.length === 0 ? (
                                    <div className="p-4 bg-[rgba(20,20,20,0.5)] rounded-lg text-center text-gray-400 text-sm">
                                        No food items added. Click "Add Food" to start.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                                        {newMeal.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center p-2 bg-[#1a1a1a] rounded-lg"
                                            >
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
                                                    <button
                                                        onClick={() => deleteNewMealItem(item.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-[rgba(20,20,20,0.5)] p-3 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-1">
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
                                <button
                                    onClick={() => setShowMealForm(false)}
                                    className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMeal}
                                    disabled={!newMeal.name || !newMeal.time || newMeal.items.length === 0}
                                    className={`px-4 py-2 ${
                                        !newMeal.name || !newMeal.time || newMeal.items.length === 0
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-[#FF6B00] hover:bg-[#FF9A00]"
                                    } text-white rounded`}
                                >
                                    Add Meal
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Add More Meals Button (only shown when form is not visible) */}
                    {!showMealForm && (
                        <button
                            onClick={scrollToAddMealForm}
                            className="w-full bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)] flex items-center justify-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Another Meal
                        </button>
                    )}
                </div>
            </div>

            {/* Water Intake Tracker */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Water Intake</h2>

                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mb-4">
                    <div className="flex justify-between mb-2">
                        <p className="font-medium">Today's Intake</p>
                        <p className="font-medium text-blue-400">{(waterIntake / 1000).toFixed(1)} / 3.0 L</p>
                    </div>

                    <div className="h-6 bg-[#1a1a1a] rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                            style={{ width: `${getPercentage(waterIntake, 3000)}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between gap-3">
                        <button
                            onClick={() => addWater(250)}
                            className="flex-1 py-2 bg-[rgba(0,149,255,0.15)] border border-[rgba(0,149,255,0.3)] text-blue-400 rounded-lg hover:bg-[rgba(0,149,255,0.25)]"
                        >
                            +250ml
                        </button>
                        <button
                            onClick={() => addWater(500)}
                            className="flex-1 py-2 bg-[rgba(0,149,255,0.15)] border border-[rgba(0,149,255,0.3)] text-blue-400 rounded-lg hover:bg-[rgba(0,149,255,0.25)]"
                        >
                            +500ml
                        </button>
                        <button
                            onClick={() => addWater(750)}
                            className="flex-1 py-2 bg-[rgba(0,149,255,0.15)] border border-[rgba(0,149,255,0.3)] text-blue-400 rounded-lg hover:bg-[rgba(0,149,255,0.25)]"
                        >
                            +750ml
                        </button>
                    </div>
                </div>
            </div>

            {/* Macro Breakdown & Statistics */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Nutrition Breakdown</h2>

                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mb-4">
                    <h3 className="font-medium mb-3">Macro Distribution</h3>

                    {/* Macro distribution chart */}
                    <MacroDistribution protein={totals.protein * 4} carbs={totals.carbs * 4} fat={totals.fat * 9} />
                </div>

                <button
                    onClick={() => setShowNutritionHistory(true)}
                    className="w-full bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]"
                >
                    View Detailed Nutrition History
                </button>
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
