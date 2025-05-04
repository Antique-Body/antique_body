"use client";

import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import { CalendarIcon, CameraIcon, InfoIcon, PlusIcon, WaterLargeIcon, WaterMediumIcon, WaterSmallIcon, WorkoutIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { FoodImageAnalyzer, MacroDistribution, MealCard, MealLogModal, NutritionHistoryModal } from "@/components/custom/client/dashboard/pages/nutrition/components";

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

  // Refs for scrolling
  const foodAnalyzerRef = useRef(null);
  const mealsRef = useRef(null);
  const hydrationRef = useRef(null);

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

  // Scroll to section
  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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


  // Render the daily nutrition summary
  const renderNutritionSummary = () => (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Today's Nutrition</h2>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => setIsHistoryModalOpen(true)}
            leftIcon={<CalendarIcon size={14} />}
          >
            History
          </Button>
          <div className="text-sm bg-[rgba(255,107,0,0.15)] text-[#FF6B00] px-3 py-1 rounded-full">
            {userData.workout.type} Day
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card variant="dark" width="100%" maxWidth="none" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Macro Targets</h3>
            <div className="flex">
              <div className="text-2xl font-bold">{totals.calories}</div>
              <div className="text-gray-400 text-sm ml-1 self-end mb-1">/ {userData.stats.calorieGoal} cal</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                  <p>Protein</p>
                </div>
                <p>
                  <span className="text-white">{totals.protein}g</span> 
                  <span className="text-gray-400"> / {userData.stats.proteinGoal}g</span>
                </p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${getPercentage(totals.protein, userData.stats.proteinGoal)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <p>Carbs</p>
                </div>
                <p>
                  <span className="text-white">{totals.carbs}g</span> 
                  <span className="text-gray-400"> / {userData.stats.carbsGoal}g</span>
                </p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${getPercentage(totals.carbs, userData.stats.carbsGoal)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                  <p>Fat</p>
                </div>
                <p>
                  <span className="text-white">{totals.fat}g</span> 
                  <span className="text-gray-400"> / {userData.stats.fatGoal}g</span>
                </p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${getPercentage(totals.fat, userData.stats.fatGoal)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-orange-800"></div>
                  <p>Fiber</p>
                </div>
                <p>
                  <span className="text-white">{totals.fiber}g</span> 
                  <span className="text-gray-400"> / {userData.stats.fiberGoal}g</span>
                </p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                <div 
                  className="h-full bg-orange-800" 
                  style={{ width: `${getPercentage(totals.fiber, userData.stats.fiberGoal)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="dark" width="100%" maxWidth="none">
          <h3 className="font-bold mb-4">Macro Distribution</h3>
          
          <MacroDistribution 
            protein={totals.protein * 4} 
            carbs={totals.carbs * 4} 
            fat={totals.fat * 9} 
          />

          <div className="mt-4 bg-[rgba(30,30,30,0.7)] p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Training Focus</h4>
            <div className="flex items-center text-sm">
              <WorkoutIcon size={16} className="mr-2 text-[#FF6B00]" />
              <div>
                <p className="font-medium">{userData.workout.focus}</p>
                <p className="text-xs text-gray-400">{userData.workout.duration} • {userData.workout.intensityLevel} intensity</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          variant="dark"
          width="100%" 
          maxWidth="none"
          className="cursor-pointer hover:border-[#FF6B00] transition-colors"
          onClick={() => openNewMealModal()}
        >
          <div className="p-4 flex flex-col items-center text-center">
            <div className="mb-3 h-12 w-12 flex items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
              <PlusIcon size={20} className="text-[#FF6B00]" />
            </div>
            <h3 className="font-medium mb-2">Log Meal Manually</h3>
            <p className="text-gray-400 text-sm mb-3">Track your food intake and nutrition</p>
            <div className="mt-auto">
              <p className="text-xs text-gray-500">{meals.length} meals logged today</p>
            </div>
          </div>
        </Card>

        <Card
          variant="dark"
          width="100%" 
          maxWidth="none"
          className="cursor-pointer hover:border-[#FF6B00] transition-colors"
          onClick={() => scrollToSection(foodAnalyzerRef)}
        >
          <div className="p-4 flex flex-col items-center text-center">
            <div className="mb-3 h-12 w-12 flex items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
              <CameraIcon size={20} className="text-[#FF6B00]" />
            </div>
            <h3 className="font-medium mb-2">Analyze Food Photo</h3>
            <p className="text-gray-400 text-sm mb-3">Identify nutrition info with AI</p>
            <div className="mt-auto">
              <p className="text-xs text-gray-500">Quick and accurate nutrition details</p>
            </div>
          </div>
        </Card>

        <Card
          variant="dark"
          width="100%" 
          maxWidth="none"
          className="cursor-pointer hover:border-[#3B82F6] transition-colors"
          onClick={() => scrollToSection(hydrationRef)}
        >
          <div className="p-4 flex flex-col items-center text-center">
            <div className="mb-3 h-12 w-12 flex items-center justify-center rounded-full bg-[rgba(59,130,246,0.15)]">
              <WaterMediumIcon size={20} className="text-[#3B82F6]" />
            </div>
            <h3 className="font-medium mb-2">Hydration Tracking</h3>
            <p className="text-gray-400 text-sm mb-3">Monitor your daily water intake</p>
            <div className="mt-auto">
              <p className="text-xs text-blue-400 font-medium">{(waterIntake / 1000).toFixed(1)} / 3.0 L consumed</p>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );

  // Render the combined meal log and food analyzer section
  const renderMealSection = () => (
    <div ref={mealsRef} className="scroll-mt-8">
      <Card variant="darkStrong" width="100%" maxWidth="none" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-xl font-bold mb-3 md:mb-0">Meal Logging</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="orangeFilled" 
              onClick={() => openNewMealModal()}
              leftIcon={<PlusIcon size={16} />}
              className="w-full sm:w-auto"
            >
              Add New Meal
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsHistoryModalOpen(true)}
              leftIcon={<CalendarIcon size={16} />}
              className="w-full sm:w-auto"
            >
              View History
            </Button>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="bg-[rgba(30,30,30,0.7)] rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-6">No meals logged for today</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="orangeFilled" 
                onClick={() => openNewMealModal()}
                leftIcon={<PlusIcon size={16} />}
                className="py-3"
              >
                Add Meal Manually
              </Button>
              <Button 
                variant="orangeOutline" 
                onClick={() => scrollToSection(foodAnalyzerRef)}
                leftIcon={<CameraIcon size={16} />}
                className="py-3"
              >
                Use AI Food Scanner
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {meals.map(meal => (
              <MealCard 
                key={meal.id} 
                meal={meal} 
                onDelete={deleteMeal} 
                onEdit={() => editMeal(meal)}
                onAddFood={() => {
                  setSelectedMealForEdit(meal);
                  scrollToSection(foodAnalyzerRef);
                }}
              />
            ))}
          </div>
        )}
      </Card>

      <div ref={foodAnalyzerRef} className="mt-8 scroll-mt-8">
        <FoodImageAnalyzer 
          onAddToMeal={handleAddAnalyzedMeal} 
          dailyGoals={userData.stats}
          dailyMacros={totals}
          selectedMeal={selectedMealForEdit}
        />
      </div>
    </div>
  );

  // Render the water tracker section
  const renderWaterTracker = () => (
    <div ref={hydrationRef} className="scroll-mt-8">
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-4 text-xl font-bold">Hydration Tracker</h2>

        <Card variant="dark" className="mb-4" width="100%" maxWidth="none">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h3 className="font-bold mb-2 md:mb-0">Today's Water Intake</h3>
            <div className="flex items-end">
              <p className="text-2xl font-bold text-blue-400">{(waterIntake / 1000).toFixed(1)}</p>
              <p className="ml-1 text-gray-400 text-sm self-end mb-1">/ 3.0 L</p>
            </div>
          </div>

          <div className="mb-6 h-6 overflow-hidden rounded-full bg-[#222]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              style={{ width: `${getPercentage(waterIntake, 3000)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid grid-cols-1 gap-2">
              <Button variant="blueOutline" onClick={() => addWater(250)} className="h-12 font-bold">
                +250ml
              </Button>
              <div className="bg-[rgba(0,149,255,0.1)] rounded-lg h-16 flex items-center justify-center">
                <WaterSmallIcon size={32} className="text-[#3B82F6]" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="blueOutline" onClick={() => addWater(500)} className="h-12 font-bold">
                +500ml
              </Button>
              <div className="bg-[rgba(0,149,255,0.1)] rounded-lg h-16 flex items-center justify-center">
                <WaterMediumIcon size={32} className="text-[#3B82F6]" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="blueOutline" onClick={() => addWater(750)} className="h-12 font-bold">
                +750ml
              </Button>
              <div className="bg-[rgba(0,149,255,0.1)] rounded-lg h-16 flex items-center justify-center">
                <WaterLargeIcon size={32} className="text-[#3B82F6]" />
              </div>
            </div>
          </div>
        </Card>

        <Card variant="dark" width="100%" maxWidth="none">
          <h3 className="font-bold mb-4">Hydration Tips</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">Based on your workout intensity ({userData.workout.intensityLevel}), you should aim for at least 3 liters of water today.</p>
            
            <div className="bg-[rgba(30,30,30,0.7)] p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <InfoIcon size={16} className="mr-2 text-blue-400" />
                Optimal Timing
              </h4>
              <ul className="text-sm text-gray-300 list-inside list-disc">
                <li>Drink 500ml 2 hours before workout</li>
                <li>Drink 250ml every 15-20 minutes during exercise</li>
                <li>Drink 500ml after workout to rehydrate</li>
              </ul>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderNutritionSummary()}
      {renderMealSection()}
      {renderWaterTracker()}

      {/* Modals */}
      <MealLogModal
        isOpen={isMealModalOpen}
        onClose={() => {
          setIsMealModalOpen(false);
          setSelectedMealForEdit(null);
        }}
        onSave={handleSaveMeal}
        meal={selectedMealForEdit}
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