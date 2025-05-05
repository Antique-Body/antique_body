"use client";

import { useRef, useState } from "react";

import { HydrationTracker, MealLoggingSection, MealLogModal, NutritionHistoryModal, NutritionSummary } from "@/components/custom/client/dashboard/pages/nutrition/components";
export default function NutritionPage() {
  // Sample user data (should be fetched from API in production)
  const userData = {
    stats: {
      calorieGoal: 2400,
      proteinGoal: 180,
      carbsGoal: 240,
      fatGoal: 80,
      fiberGoal: 30
    },
    workout: {
      type: 'Strength Training',
      focus: 'Upper Body',
      duration: '60 min',
      intensityLevel: 'High'
    }
  };

  // State for modals
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedMealForEdit, setSelectedMealForEdit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // State for water intake
  const [waterIntake, setWaterIntake] = useState(1500); // ml

  // Refs for navigation
  const mealLoggingRef = useRef(null);
  const foodAnalyzerRef = useRef(null);
  const hydrationRef = useRef(null);

  // Delete a meal
  const deleteMeal = id => {
    setMeals(meals.filter(meal => meal.id !== id));
  };
  
  // Edit a meal
  const editMeal = (meal) => {
    setSelectedMealForEdit(meal);
    setIsMealModalOpen(true);
  };

  // Open meal modal for a new meal
  const openNewMealModal = (mealType = "") => {
    setSelectedMealForEdit(null);
    setIsMealModalOpen(true);
  };

  // Handle adding or updating a meal
  const handleSaveMeal = (mealData) => {
    if (selectedMealForEdit) {
      // Update existing meal
      setMeals(meals.map(meal => 
        meal.id === selectedMealForEdit.id ? { ...mealData, id: meal.id } : meal
      ));
    } else {
      // Add new meal
      const newId = meals.length > 0 ? Math.max(...meals.map(m => m.id)) + 1 : 1;
      setMeals([...meals, { ...mealData, id: newId }]);
    }
    
    setIsMealModalOpen(false);
    setSelectedMealForEdit(null);
  };

  // Handle adding a meal from image analysis
  const handleAddAnalyzedMeal = (foodItem, mealTime) => {
    // Check if we already have a meal with this time
    const existingMealIndex = meals.findIndex(meal => 
      meal.name.toLowerCase() === mealTime.toLowerCase());
      
    if (existingMealIndex >= 0) {
      // Add to existing meal
      const updatedMeals = [...meals];
      const existingMeal = updatedMeals[existingMealIndex];
      
      // Calculate new meal totals
      const updatedMeal = {
        ...existingMeal,
        calories: existingMeal.calories + foodItem.calories,
        protein: existingMeal.protein + foodItem.protein,
        carbs: existingMeal.carbs + foodItem.carbs,
        fat: existingMeal.fat + foodItem.fat,
        fiber: existingMeal.fiber + (foodItem.fiber || 0),
        items: [...existingMeal.items, foodItem]
      };
      
      updatedMeals[existingMealIndex] = updatedMeal;
      setMeals(updatedMeals);
    } else {
      // Create new meal
      const newId = meals.length > 0 ? Math.max(...meals.map(m => m.id)) + 1 : 1;
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newMeal = {
        id: newId,
        name: mealTime,
        time: timeNow,
        calories: foodItem.calories,
        protein: foodItem.protein,
        carbs: foodItem.carbs,
        fat: foodItem.fat,
        fiber: foodItem.fiber || 0,
        items: [foodItem]
      };
      
      setMeals([...meals, newMeal]);
    }
  };

  // Add water intake
  const addWater = amount => {
    setWaterIntake(waterIntake + amount);
  };

  return (
    <div className="space-y-6">
      <NutritionSummary 
        userData={userData}
        meals={meals}
        waterIntake={waterIntake}
        openNewMealModal={openNewMealModal}
        openHistoryModal={() => setIsHistoryModalOpen(true)}
        mealLoggingRef={mealLoggingRef}
        foodAnalyzerRef={foodAnalyzerRef}
        hydrationRef={hydrationRef}
      />
      
        <MealLoggingSection
          meals={meals}
          userData={userData}
          onDeleteMeal={deleteMeal}
          onEditMeal={editMeal}
          onAddMeal={openNewMealModal}
          onOpenHistory={() => setIsHistoryModalOpen(true)}
          onAddAnalyzedMeal={handleAddAnalyzedMeal}
          selectedMealForEdit={selectedMealForEdit}
          foodAnalyzerRef={foodAnalyzerRef}
        />
      
      <div ref={hydrationRef}>
        <HydrationTracker
          waterIntake={waterIntake}
          onAddWater={addWater}
          userData={userData}
        />
      </div>

      {/* Modals */}
      <MealLogModal
        isOpen={isMealModalOpen}
        onClose={() => {
          setIsMealModalOpen(false);
          setSelectedMealForEdit(null);
        }}
        onSave={handleSaveMeal}
        meal={selectedMealForEdit}
        foodAnalyzerRef={foodAnalyzerRef}
      />
      
      <NutritionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        meals={meals}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        waterIntake={waterIntake}
        dailyGoals={userData.stats}
      />
    </div>
  );
}