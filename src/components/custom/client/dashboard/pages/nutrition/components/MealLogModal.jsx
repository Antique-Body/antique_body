import { Button } from "@/components/common/Button";
import { CameraIcon, PlusIcon, TrashIcon } from "@/components/common/Icons";
import { Modal } from "@/components/common/Modal";
import { Card } from "@/components/custom/Card";
import { FormField } from "@/components/shared";
import { useEffect, useState } from 'react';

// Common food database with standard nutritional values (simplified)
const commonFoods = [
  {
    name: "Chicken Breast",
    amount: "100g",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    category: "Protein"
  },
  {
    name: "Salmon",
    amount: "100g",
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    fiber: 0,
    category: "Protein"
  },
  {
    name: "Greek Yogurt",
    amount: "100g",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    category: "Dairy"
  },
  {
    name: "Egg",
    amount: "1 large",
    calories: 70,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    fiber: 0,
    category: "Protein"
  },
  {
    name: "Whey Protein",
    amount: "1 scoop (30g)",
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1.5,
    fiber: 0,
    category: "Supplements"
  },
  {
    name: "Oatmeal",
    amount: "1 cup (cooked)",
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3,
    fiber: 4,
    category: "Grains"
  },
  {
    name: "Brown Rice",
    amount: "1 cup (cooked)",
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    fiber: 3.5,
    category: "Grains"
  },
  {
    name: "Sweet Potato",
    amount: "1 medium (150g)",
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    fiber: 3.8,
    category: "Vegetables"
  },
  {
    name: "Avocado",
    amount: "1/2 fruit",
    calories: 161,
    protein: 2,
    carbs: 8.5,
    fat: 15,
    fiber: 6.7,
    category: "Fruits"
  },
  {
    name: "Banana",
    amount: "1 medium",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    category: "Fruits"
  },
  {
    name: "Peanut Butter",
    amount: "2 tbsp",
    calories: 188,
    protein: 8,
    carbs: 6,
    fat: 16,
    fiber: 1.9,
    category: "Fats"
  },
  {
    name: "Olive Oil",
    amount: "1 tbsp",
    calories: 119,
    protein: 0,
    carbs: 0,
    fat: 13.5,
    fiber: 0,
    category: "Fats"
  }
];

// Food categories for filtering
const foodCategories = ["All", "Protein", "Carbs", "Fats", "Fruits", "Vegetables", "Dairy", "Grains", "Supplements"];

// Meal types
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"];

export const MealLogModal = ({ isOpen, onClose, onSave, meal }) => {
  // State for meal data
  const [mealData, setMealData] = useState({
    name: "",
    time: "",
    items: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  // State for custom item being added
  const [customItem, setCustomItem] = useState({
    name: "",
    amount: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  // State for food browser
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Set initial meal data if editing
  useEffect(() => {
    if (meal) {
      setMealData({
        name: meal.name,
        time: meal.time,
        items: [...meal.items],
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        fiber: meal.fiber || 0
      });
    } else {
      // Set default time based on current time for new meals
      const now = new Date();
      let defaultMealType = "Snack";
      
      const hour = now.getHours();
      if (hour < 11) defaultMealType = "Breakfast";
      else if (hour < 15) defaultMealType = "Lunch";
      else if (hour < 20) defaultMealType = "Dinner";
      
      setMealData({
        name: defaultMealType,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      });
    }
  }, [meal, isOpen]);

  // Handle adding custom item
  const addCustomItem = () => {
    if (!customItem.name) return;

    const newItem = {
      id: Date.now(),
      ...customItem
    };

    // Add to meal items
    const updatedItems = [...mealData.items, newItem];
    
    // Update meal totals
    const newMealData = {
      ...mealData,
      items: updatedItems,
      calories: mealData.calories + Number(customItem.calories),
      protein: mealData.protein + Number(customItem.protein),
      carbs: mealData.carbs + Number(customItem.carbs),
      fat: mealData.fat + Number(customItem.fat),
      fiber: mealData.fiber + Number(customItem.fiber || 0)
    };
    
    setMealData(newMealData);
    
    // Reset custom item form
    setCustomItem({
      name: "",
      amount: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    });
  };

  // Handle adding common food
  const addCommonFood = (food) => {
    const newItem = {
      id: Date.now(),
      ...food
    };

    // Add to meal items
    const updatedItems = [...mealData.items, newItem];
    
    // Update meal totals
    setMealData({
      ...mealData,
      items: updatedItems,
      calories: mealData.calories + food.calories,
      protein: mealData.protein + food.protein,
      carbs: mealData.carbs + food.carbs,
      fat: mealData.fat + food.fat,
      fiber: mealData.fiber + (food.fiber || 0)
    });
  };

  // Handle removing item
  const removeItem = (itemId) => {
    const itemToRemove = mealData.items.find(item => item.id === itemId);
    if (!itemToRemove) return;

    const updatedItems = mealData.items.filter(item => item.id !== itemId);
    
    setMealData({
      ...mealData,
      items: updatedItems,
      calories: mealData.calories - itemToRemove.calories,
      protein: mealData.protein - itemToRemove.protein,
      carbs: mealData.carbs - itemToRemove.carbs,
      fat: mealData.fat - itemToRemove.fat,
      fiber: mealData.fiber - (itemToRemove.fiber || 0)
    });
  };

  // Handle save meal
  const handleSave = () => {
    onSave(mealData);
  };

  // Filter foods based on category and search query
  const filteredFoods = commonFoods.filter(food => {
    const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      food.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meal ? "Edit Meal" : "Add New Meal"}
      size="large"
      primaryButtonText="Save Meal"
      secondaryButtonText="Cancel"
      primaryButtonAction={handleSave}
      primaryButtonDisabled={mealData.items.length === 0}
    >
      <div className="space-y-8">
        {/* Meal details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Meal Type"
            type="select"
            value={mealData.name}
            onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
          >
            {mealTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
            <option value="Custom">Custom</option>
          </FormField>
          
          {mealData.name === "Custom" && (
            <FormField
              label="Custom Meal Name"
              type="text"
              value={mealData.customName || ""}
              onChange={(e) => setMealData({ ...mealData, customName: e.target.value })}
              placeholder="Enter meal name"
            />
          )}
          
          <FormField
            label="Time"
            type="time"
            value={mealData.time}
            onChange={(e) => setMealData({ ...mealData, time: e.target.value })}
          />
        </div>
        
        {/* Summary of meal nutrition info */}
        {mealData.items.length > 0 && (
          <Card variant="dark" width="100%" maxWidth="none" className="p-4">
            <h3 className="font-medium mb-3 text-base">Meal Nutrition Summary</h3>
            <div className="grid grid-cols-5 gap-3">
              <div className="rounded-md bg-[rgba(255,107,0,0.15)] p-3 text-center">
                <p className="text-xs text-gray-400">Calories</p>
                <p className="text-lg font-bold text-[#FF6B00]">{mealData.calories}</p>
              </div>
              <div className="rounded-md bg-[rgba(59,130,246,0.15)] p-3 text-center">
                <p className="text-xs text-gray-400">Protein</p>
                <p className="text-lg font-bold text-blue-500">{mealData.protein}g</p>
              </div>
              <div className="rounded-md bg-[rgba(34,197,94,0.15)] p-3 text-center">
                <p className="text-xs text-gray-400">Carbs</p>
                <p className="text-lg font-bold text-green-500">{mealData.carbs}g</p>
              </div>
              <div className="rounded-md bg-[rgba(234,179,8,0.15)] p-3 text-center">
                <p className="text-xs text-gray-400">Fat</p>
                <p className="text-lg font-bold text-yellow-500">{mealData.fat}g</p>
              </div>
              <div className="rounded-md bg-[rgba(180,83,9,0.15)] p-3 text-center">
                <p className="text-xs text-gray-400">Fiber</p>
                <p className="text-lg font-bold text-orange-800">{mealData.fiber}g</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Selected food items */}
        {mealData.items.length > 0 && (
          <div>
            <h3 className="font-medium mb-3 text-base">Food Items</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {mealData.items.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.amount}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm">{item.calories} kcal</p>
                    <Button 
                      variant="ghost" 
                      size="small" 
                      className="text-red-500 hover:text-red-400 p-1"
                      onClick={() => removeItem(item.id)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tabs for different food adding methods */}
        <div className="mt-6 border-b border-[#333]">
          <div className="flex">
            <button
              className={`py-3 px-5 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedCategory !== "Manual" 
                  ? 'border-[#FF6B00] text-[#FF6B00]' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              Common Foods
            </button>
            <button
              className={`py-3 px-5 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedCategory === "Manual" 
                  ? 'border-[#FF6B00] text-[#FF6B00]' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedCategory("Manual")}
            >
              Manual Entry
            </button>
          </div>
        </div>
        
        {/* Content based on selected method */}
        {selectedCategory === "Manual" ? (
          <div className="mt-6">
            <h3 className="font-medium mb-4 text-base">Add Food Manually</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Food Name"
                type="text"
                value={customItem.name}
                onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                placeholder="Enter food name"
              />
              <FormField
                label="Amount/Serving"
                type="text"
                value={customItem.amount}
                onChange={(e) => setCustomItem({ ...customItem, amount: e.target.value })}
                placeholder="100g, 1 cup, etc."
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-5">
              <FormField
                label="Calories"
                type="number"
                value={customItem.calories}
                onChange={(e) => setCustomItem({ ...customItem, calories: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <FormField
                label="Protein (g)"
                type="number"
                value={customItem.protein}
                onChange={(e) => setCustomItem({ ...customItem, protein: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <FormField
                label="Carbs (g)"
                type="number"
                value={customItem.carbs}
                onChange={(e) => setCustomItem({ ...customItem, carbs: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <FormField
                label="Fat (g)"
                type="number"
                value={customItem.fat}
                onChange={(e) => setCustomItem({ ...customItem, fat: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
              <FormField
                label="Fiber (g)"
                type="number"
                value={customItem.fiber}
                onChange={(e) => setCustomItem({ ...customItem, fiber: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            
            <Button
              variant="orangeFilled"
              onClick={addCustomItem}
              leftIcon={<PlusIcon size={16} />}
              disabled={!customItem.name}
              className="px-6 py-2.5"
            >
              Add to Meal
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
              {/* Category selection */}
              <FormField
                label="Food Category"
                type="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1"
              >
                {foodCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </FormField>
              
              {/* Search bar */}
              <FormField
                label="Search Foods"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods..."
                className="flex-1"
              />
            </div>
            
            {/* Foods grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {filteredFoods.map((food) => (
                <Card
                  key={food.name}
                  variant="dark"
                  className="p-3 cursor-pointer hover:border-[#FF6B00] hover:bg-[rgba(255,107,0,0.05)] transition-colors"
                  onClick={() => addCommonFood(food)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{food.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{food.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{food.calories} kcal</p>
                      <p className="text-xs text-gray-400 mt-1">
                        P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredFoods.length === 0 && (
              <div className="text-center p-6 bg-[#1a1a1a] rounded-lg">
                <p className="text-gray-400">No foods found. Try a different category or search term.</p>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Can't find what you're looking for? 
                <button 
                  className="ml-1 text-[#FF6B00] hover:underline font-medium"
                  onClick={() => setSelectedCategory("Manual")}
                >
                  Add food manually
                </button>
                {" or "}
                <button
                  className="text-[#FF6B00] hover:underline flex items-center justify-center gap-1 mx-auto mt-2 font-medium"
                >
                  <CameraIcon size={14} />
                  Use AI Food Scanner
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}; 