"use client";
import { useState } from "react";

import FoodSearch from "./FoodSearch";

const NutritionDashboard = () => {
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  // Mock data for demonstration
  const [nutritionData, setNutritionData] = useState({
    dailyGoals: {
      calories: 2500,
      protein: 180,
      carbs: 300,
      fats: 83,
      water: 3.5,
    },
    currentIntake: {
      calories: 1850,
      protein: 145,
      carbs: 220,
      fats: 65,
      water: 2.1,
    },
    meals: [
      {
        name: "Breakfast",
        time: "08:00",
        foods: [
          { name: "Oatmeal", calories: 350, protein: 12, carbs: 60, fats: 6 },
          {
            name: "Protein Shake",
            calories: 150,
            protein: 30,
            carbs: 5,
            fats: 2,
          },
        ],
      },
      {
        name: "Lunch",
        time: "13:00",
        foods: [
          {
            name: "Chicken Breast",
            calories: 450,
            protein: 55,
            carbs: 0,
            fats: 25,
          },
          { name: "Brown Rice", calories: 220, protein: 5, carbs: 45, fats: 2 },
          { name: "Vegetables", calories: 100, protein: 3, carbs: 20, fats: 0 },
        ],
      },
      {
        name: "Dinner",
        time: "19:00",
        foods: [
          { name: "Salmon", calories: 380, protein: 40, carbs: 0, fats: 22 },
          {
            name: "Sweet Potato",
            calories: 200,
            protein: 2,
            carbs: 45,
            fats: 0,
          },
        ],
      },
    ],
    waterIntake: [
      { time: "08:00", amount: 0.5 },
      { time: "10:00", amount: 0.5 },
      { time: "12:00", amount: 0.5 },
      { time: "14:00", amount: 0.3 },
      { time: "16:00", amount: 0.3 },
    ],
  });

  const handleAddFood = (food) => {
    // Add food to the latest meal or create a new one
    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setNutritionData((prev) => {
      const updatedMeals = [...prev.meals];
      const latestMeal = updatedMeals[updatedMeals.length - 1];

      // Update nutrition totals
      const newCurrentIntake = {
        calories: prev.currentIntake.calories + food.nutrition.calories,
        protein: prev.currentIntake.protein + food.nutrition.protein,
        carbs: prev.currentIntake.carbs + food.nutrition.carbs,
        fats: prev.currentIntake.fats + food.nutrition.fat,
        water: prev.currentIntake.water,
      };

      // If the latest meal was within the last 2 hours, add to it
      if (latestMeal && isWithinTwoHours(latestMeal.time)) {
        latestMeal.foods.push({
          name: food.name,
          calories: food.nutrition.calories,
          protein: food.nutrition.protein,
          carbs: food.nutrition.carbs,
          fats: food.nutrition.fat,
        });
      } else {
        // Create a new meal
        updatedMeals.push({
          name: getMealName(currentTime),
          time: currentTime,
          foods: [
            {
              name: food.name,
              calories: food.nutrition.calories,
              protein: food.nutrition.protein,
              carbs: food.nutrition.carbs,
              fats: food.nutrition.fat,
            },
          ],
        });
      }

      return {
        ...prev,
        meals: updatedMeals,
        currentIntake: newCurrentIntake,
      };
    });
  };

  const isWithinTwoHours = (mealTime) => {
    const [hours, minutes] = mealTime.split(":").map(Number);
    const mealDate = new Date();
    mealDate.setHours(hours, minutes);

    const now = new Date();
    const diffInHours = Math.abs(now - mealDate) / 36e5;

    return diffInHours <= 2;
  };

  const getMealName = (time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour < 11) return "Breakfast";
    if (hour < 15) return "Lunch";
    if (hour < 18) return "Snack";
    return "Dinner";
  };

  return (
    <div className="w-full">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Left Column - Meal Logging */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Log Meal */}
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 hover:border-[#FF6B00] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Log Your Meal</h3>
              <div className="w-10 h-10 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowFoodSearch(true)}
                className="p-6 bg-[#222] rounded-xl hover:bg-[#333] transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B00"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-lg">Search Food</h4>
                    <p className="text-sm text-gray-400">
                      Find food in database
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowFoodSearch(true)}
                className="p-6 bg-[#222] rounded-xl hover:bg-[#333] transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B00"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-lg">Scan Food</h4>
                    <p className="text-sm text-gray-400">
                      Take a photo of your meal
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm text-gray-400 mb-3">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddFood(item)}
                      className="px-4 py-2 bg-[#333] rounded-full text-sm hover:bg-[#444] transition-colors">
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Today's Meals */}
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Today's Meals</h3>
            <div className="space-y-4">
              {nutritionData.meals.map((meal, index) => (
                <div
                  key={index}
                  className="bg-[#222] rounded-xl p-4 hover:bg-[#333] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{meal.name}</h4>
                      <p className="text-sm text-gray-400">{meal.time}</p>
                    </div>
                    <button
                      onClick={() => setShowFoodSearch(true)}
                      className="px-4 py-2 bg-[#FF6B00] hover:bg-[#FF8533] rounded-lg text-sm transition-colors">
                      Add Food
                    </button>
                  </div>
                  <div className="space-y-2">
                    {meal.foods.map((food, foodIndex) => (
                      <div
                        key={foodIndex}
                        className="flex justify-between items-center py-2 border-b border-[#333] last:border-0">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-gray-400">
                            {food.protein}g protein • {food.carbs}g carbs •{" "}
                            {food.fats}g fat
                          </p>
                        </div>
                        <p className="font-medium">{food.calories} kcal</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Recommendations & Stats */}
        <div className="space-y-6">
          {/* Nutrition Progress */}
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 hover:border-[#2ecc71] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Today's Progress</h3>
              <div className="w-10 h-10 rounded-full bg-[#2ecc71] bg-opacity-10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2ecc71"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Calories</span>
                  <span className="font-medium">
                    {nutritionData.currentIntake.calories} /{" "}
                    {nutritionData.dailyGoals.calories}
                  </span>
                </div>
                <div className="h-3 bg-[#333] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2ecc71] rounded-full transition-all duration-300"
                    style={{
                      width: `${(nutritionData.currentIntake.calories / nutritionData.dailyGoals.calories) * 100}%`,
                    }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Protein</span>
                  <span className="font-medium">
                    {nutritionData.currentIntake.protein}g /{" "}
                    {nutritionData.dailyGoals.protein}g
                  </span>
                </div>
                <div className="h-3 bg-[#333] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3498db] rounded-full transition-all duration-300"
                    style={{
                      width: `${(nutritionData.currentIntake.protein / nutritionData.dailyGoals.protein) * 100}%`,
                    }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Carbs</span>
                  <span className="font-medium">
                    {nutritionData.currentIntake.carbs}g /{" "}
                    {nutritionData.dailyGoals.carbs}g
                  </span>
                </div>
                <div className="h-3 bg-[#333] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f1c40f] rounded-full transition-all duration-300"
                    style={{
                      width: `${(nutritionData.currentIntake.carbs / nutritionData.dailyGoals.carbs) * 100}%`,
                    }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Fats</span>
                  <span className="font-medium">
                    {nutritionData.currentIntake.fats}g /{" "}
                    {nutritionData.dailyGoals.fats}g
                  </span>
                </div>
                <div className="h-3 bg-[#333] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e74c3c] rounded-full transition-all duration-300"
                    style={{
                      width: `${(nutritionData.currentIntake.fats / nutritionData.dailyGoals.fats) * 100}%`,
                    }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Recommendations */}
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 hover:border-[#3498db] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recommended Meals</h3>
              <div className="w-10 h-10 rounded-full bg-[#3498db] bg-opacity-10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3498db"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#222] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🥗</span>
                  <div>
                    <h4 className="font-medium">Protein Bowl</h4>
                    <p className="text-sm text-gray-400">
                      450 kcal • 35g protein
                    </p>
                  </div>
                </div>
                <button className="w-full py-2 bg-[#3498db] hover:bg-[#2980b9] rounded-lg text-sm transition-colors">
                  Add to Log
                </button>
              </div>
              <div className="bg-[#222] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🥪</span>
                  <div>
                    <h4 className="font-medium">Chicken Sandwich</h4>
                    <p className="text-sm text-gray-400">
                      380 kcal • 28g protein
                    </p>
                  </div>
                </div>
                <button className="w-full py-2 bg-[#3498db] hover:bg-[#2980b9] rounded-lg text-sm transition-colors">
                  Add to Log
                </button>
              </div>
            </div>
          </div>

          {/* Health Profile */}
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6 hover:border-[#e74c3c] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Health Profile</h3>
              <div className="w-10 h-10 rounded-full bg-[#e74c3c] bg-opacity-10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e74c3c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Allergies & Dietary Restrictions
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Enter your allergies"
                    className="flex-1 px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#e74c3c] text-white placeholder-gray-500"
                  />
                  <button className="px-6 py-3 bg-[#e74c3c] hover:bg-[#c0392b] rounded-xl text-white font-medium transition-colors">
                    Save
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#222] rounded-xl p-4">
                  <h4 className="text-sm text-gray-400 mb-2">
                    Dietary Preferences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#333] rounded-full text-sm">
                      Vegetarian
                    </span>
                    <span className="px-3 py-1 bg-[#333] rounded-full text-sm">
                      Gluten-Free
                    </span>
                    <span className="px-3 py-1 bg-[#333] rounded-full text-sm">
                      + Add
                    </span>
                  </div>
                </div>
                <div className="bg-[#222] rounded-xl p-4">
                  <h4 className="text-sm text-gray-400 mb-2">Health Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#333] rounded-full text-sm">
                      Weight Loss
                    </span>
                    <span className="px-3 py-1 bg-[#333] rounded-full text-sm">
                      Muscle Gain
                    </span>
                    <span className="px-3 py-1 bg-[#333] rounded-full text-sm">
                      + Add
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Search Modal */}
      {showFoodSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#333] rounded-2xl max-w-2xl w-full overflow-hidden animate-scaleIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Food</h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowFoodSearch(false)}>
                  ✕
                </button>
              </div>
              <FoodSearch onAddFood={handleAddFood} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionDashboard;
