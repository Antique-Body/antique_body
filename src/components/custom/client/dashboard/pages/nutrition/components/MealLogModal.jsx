import { useEffect, useState } from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CameraIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/common/Icons";
import { Modal } from "@/components/common/Modal";

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
        category: "Protein",
    },
    {
        name: "Salmon",
        amount: "100g",
        calories: 208,
        protein: 20,
        carbs: 0,
        fat: 13,
        fiber: 0,
        category: "Protein",
    },
    {
        name: "Greek Yogurt",
        amount: "100g",
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        fiber: 0,
        category: "Dairy",
    },
    {
        name: "Egg",
        amount: "1 large",
        calories: 70,
        protein: 6,
        carbs: 0.6,
        fat: 5,
        fiber: 0,
        category: "Protein",
    },
    {
        name: "Whey Protein",
        amount: "1 scoop (30g)",
        calories: 120,
        protein: 24,
        carbs: 3,
        fat: 1.5,
        fiber: 0,
        category: "Supplements",
    },
    {
        name: "Oatmeal",
        amount: "1 cup (cooked)",
        calories: 158,
        protein: 6,
        carbs: 27,
        fat: 3,
        fiber: 4,
        category: "Grains",
    },
    {
        name: "Brown Rice",
        amount: "1 cup (cooked)",
        calories: 216,
        protein: 5,
        carbs: 45,
        fat: 1.8,
        fiber: 3.5,
        category: "Grains",
    },
    {
        name: "Sweet Potato",
        amount: "1 medium (150g)",
        calories: 112,
        protein: 2,
        carbs: 26,
        fat: 0.1,
        fiber: 3.8,
        category: "Vegetables",
    },
    {
        name: "Avocado",
        amount: "1/2 fruit",
        calories: 161,
        protein: 2,
        carbs: 8.5,
        fat: 15,
        fiber: 6.7,
        category: "Fruits",
    },
    {
        name: "Banana",
        amount: "1 medium",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        fiber: 3.1,
        category: "Fruits",
    },
    {
        name: "Peanut Butter",
        amount: "2 tbsp",
        calories: 188,
        protein: 8,
        carbs: 6,
        fat: 16,
        fiber: 1.9,
        category: "Fats",
    },
    {
        name: "Olive Oil",
        amount: "1 tbsp",
        calories: 119,
        protein: 0,
        carbs: 0,
        fat: 13.5,
        fiber: 0,
        category: "Fats",
    },
];

// Food categories for filtering
const foodCategories = ["All", "Protein", "Carbs", "Fats", "Fruits", "Vegetables", "Dairy", "Grains", "Supplements"];

// Meal types
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Pre-Workout", "Post-Workout"];

export const MealLogModal = ({ isOpen, onClose, onSave, meal, foodAnalyzerRef }) => {
    // State for meal data
    const [mealData, setMealData] = useState({
        name: "",
        time: "",
        items: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
    });

    // State for custom item being added
    const [customItem, setCustomItem] = useState({
        name: "",
        amount: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
    });

    // State for food browser
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("common"); // 'common', 'manual', 'scan'

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
                fiber: meal.fiber || 0,
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
                time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                items: [],
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
            });
        }
    }, [meal, isOpen]);

    // Handle adding custom item
    const addCustomItem = () => {
        if (!customItem.name) return;

        const newItem = {
            id: Date.now(),
            ...customItem,
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
            fiber: mealData.fiber + Number(customItem.fiber || 0),
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
            fiber: 0,
        });
    };

    // Handle adding common food
    const addCommonFood = (food) => {
        const newItem = {
            id: Date.now(),
            ...food,
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
            fiber: mealData.fiber + (food.fiber || 0),
        });
    };

    // Handle removing item
    const removeItem = (itemId) => {
        const itemToRemove = mealData.items.find((item) => item.id === itemId);
        if (!itemToRemove) return;

        const updatedItems = mealData.items.filter((item) => item.id !== itemId);

        setMealData({
            ...mealData,
            items: updatedItems,
            calories: mealData.calories - itemToRemove.calories,
            protein: mealData.protein - itemToRemove.protein,
            carbs: mealData.carbs - itemToRemove.carbs,
            fat: mealData.fat - itemToRemove.fat,
            fiber: mealData.fiber - (itemToRemove.fiber || 0),
        });
    };

    // Handle save meal
    const handleSave = () => {
        onSave(mealData);
    };

    // Filter foods based on category and search query
    const filteredFoods = commonFoods.filter((food) => {
        const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
        const matchesSearch = searchQuery === "" || food.name.toLowerCase().includes(searchQuery.toLowerCase());
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
            <div className="space-y-6">
                {/* Top section: Meal details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                label="Meal Type"
                                type="select"
                                value={mealData.name}
                                onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                                className="flex-1 min-w-[180px]"
                                options={mealTypes}
                            />

                            <FormField
                                label="Time"
                                type="time"
                                value={mealData.time}
                                onChange={(e) => setMealData({ ...mealData, time: e.target.value })}
                                className="w-36"
                            />
                        </div>
                    </div>

                    {/* Nutrition summary cards */}
                    <div className="md:col-span-1">
                        <div className="bg-[#222] rounded-lg p-3">
                            <h3 className="text-sm font-medium text-white mb-2">Total Nutrition</h3>
                            <div className="flex justify-between items-center">
                                <div className="text-xl font-bold text-[#FF6B00]">{mealData.calories}</div>
                                <div className="text-sm text-gray-400">calories</div>
                            </div>

                            <div className="mt-2 flex justify-between text-sm">
                                <MacroTag label="P" value={`${mealData.protein}g`} color="bg-blue-500" />
                                <MacroTag label="C" value={`${mealData.carbs}g`} color="bg-green-500" />
                                <MacroTag label="F" value={`${mealData.fat}g`} color="bg-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Added food items section */}
                <div>
                    <div className="mb-2 flex justify-between items-center">
                        <h3 className="text-base font-semibold">Added Food Items</h3>
                        <div className="text-sm text-gray-400">{mealData.items.length} items</div>
                    </div>

                    {mealData.items.length === 0 ? (
                        <div className="bg-[#1a1a1a] rounded-lg p-5 text-center">
                            <p className="text-gray-400">No foods added to this meal yet</p>
                            <p className="text-sm text-gray-500 mt-1">Add foods from the options below</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {mealData.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative bg-[#1a1a1a] rounded-lg p-3 border border-[#333] hover:border-[#555] transition-colors"
                                >
                                    <div className="pr-7">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{item.amount}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="text-sm font-medium text-[#FF6B00]">{item.calories} cal</div>
                                        <div className="flex gap-1 text-xs">
                                            <span className="text-blue-400">P:{item.protein}g</span>
                                            <span className="text-green-400">C:{item.carbs}g</span>
                                            <span className="text-yellow-400">F:{item.fat}g</span>
                                        </div>
                                    </div>

                                    <button
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <TrashIcon size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Food addition tabs */}
                <div className="pt-2 border-t border-[#333]">
                    <div className="flex mb-4 border-b border-[#333]">
                        <TabButton
                            active={activeTab === "common"}
                            onClick={() => setActiveTab("common")}
                            label="Common Foods"
                        />
                        <TabButton
                            active={activeTab === "manual"}
                            onClick={() => setActiveTab("manual")}
                            label="Manual Entry"
                        />
                    </div>

                    {activeTab === "common" && (
                        <div>
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search foods..."
                                        className="w-full pl-10 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="h-full w-full py-2 px-3 bg-[#1a1a1a] border border-[#333] rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    >
                                        {foodCategories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="max-h-[280px] overflow-y-auto pr-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {filteredFoods.map((food) => (
                                        <FoodCard key={food.name} food={food} onAdd={() => addCommonFood(food)} />
                                    ))}
                                </div>

                                {filteredFoods.length === 0 && (
                                    <div className="p-4 text-center text-gray-400 bg-[#1a1a1a] rounded-lg">
                                        No foods found. Try a different category or search term.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "manual" && (
                        <div className="p-4 bg-[#1a1a1a] rounded-lg">
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

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
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
                                className="w-full py-2.5"
                            >
                                Add to Meal
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                    Can't find what you're looking for?
                    <Button
                        variant="orangeText"
                        onClick={() => setActiveTab("manual")}
                        className="ml-1 text-[#FF6B00] hover:underline font-medium"
                    >
                        Add food manually
                    </Button>
                    {" or "}
                    <Button
                        variant="orangeText"
                        onClick={() => {
                            onClose();
                            setTimeout(() => {
                                foodAnalyzerRef.current?.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                        }}
                        className="text-[#FF6B00] hover:underline flex items-center justify-center gap-1 mx-auto mt-2 font-medium"
                    >
                        <CameraIcon size={14} />
                        Use AI Food Scanner
                    </Button>
                </p>
            </div>
        </Modal>
    );
};

// Utility components
const TabButton = ({ active, onClick, label, icon }) => (
    <button
        className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            active ? "border-[#FF6B00] text-[#FF6B00]" : "border-transparent text-gray-400 hover:text-white"
        }`}
        onClick={onClick}
    >
        {icon && icon}
        {label}
    </button>
);

const MacroTag = ({ label, value, color }) => (
    <div className="flex items-center">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${color}`}>
            <span className="text-[10px] font-bold text-white">{label}</span>
        </div>
        <span className="ml-1">{value}</span>
    </div>
);

const FoodCard = ({ food, onAdd }) => (
    <div
        className="bg-[#1d1d1d] border border-[#333] rounded-lg p-3 cursor-pointer hover:bg-[#252525] hover:border-[#FF6B00] transition-colors"
        onClick={onAdd}
    >
        <div className="flex justify-between">
            <div>
                <h4 className="font-medium text-sm">{food.name}</h4>
                <p className="text-xs text-gray-400">{food.amount}</p>
            </div>
            <div className="text-sm font-semibold text-[#FF6B00]">{food.calories}</div>
        </div>

        <div className="mt-2 text-[10px] text-gray-400 flex gap-2">
            <span className="text-blue-400">P: {food.protein}g</span>
            <span className="text-green-400">C: {food.carbs}g</span>
            <span className="text-yellow-400">F: {food.fat}g</span>
        </div>

        <button className="mt-2 w-full text-xs py-1 px-2 bg-[rgba(255,107,0,0.1)] text-[#FF6B00] rounded hover:bg-[rgba(255,107,0,0.2)] transition-colors">
            Add to Meal
        </button>
    </div>
);
