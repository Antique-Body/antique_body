"use client";

import { useState } from "react";

import { CreateMealCard } from "./CreateMealCard";
import { MealCard } from "./MealCard";
import { MealModal } from "./MealModal";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { PlusIcon } from "@/components/common/Icons";

export const MealsList = ({ meals, onUpdate }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterMaxCalories, setFilterMaxCalories] = useState("");
    const [filterMinProtein, setFilterMinProtein] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [selectedMeal, setSelectedMeal] = useState(null);

    // Filter meals based on search and filter criteria
    const filteredMeals = meals.filter((meal) => {
        // Search term filter
        const matchesSearch =
            meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meal.ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchTerm.toLowerCase()));

        // Meal type filter
        const matchesType = filterType ? meal.type === filterType : true;

        // Calories filter
        const matchesCalories = filterMaxCalories ? meal.calories <= parseInt(filterMaxCalories) : true;

        // Protein filter
        const matchesProtein = filterMinProtein ? meal.protein >= parseInt(filterMinProtein) : true;

        return matchesSearch && matchesType && matchesCalories && matchesProtein;
    });

    // Meal stats
    const totalMeals = meals.length;
    const breakfastMeals = meals.filter((m) => m.type === "breakfast").length;
    const lunchMeals = meals.filter((m) => m.type === "lunch").length;
    const dinnerMeals = meals.filter((m) => m.type === "dinner").length;
    const snackMeals = meals.filter((m) => m.type === "snack").length;

    // Open create meal modal
    const handleCreateClick = () => {
        setSelectedMeal(null);
        setModalMode("create");
        setModalOpen(true);
    };

    // Open view meal modal
    const handleViewMeal = (meal) => {
        setSelectedMeal(meal);
        setModalMode("view");
        setModalOpen(true);
    };

    // Open edit meal modal
    const handleEditMeal = (meal) => {
        setSelectedMeal(meal);
        setModalMode("edit");
        setModalOpen(true);
    };

    // Delete meal
    const handleDeleteMeal = (mealId) => {
        if (window.confirm("Are you sure you want to delete this meal?")) {
            const updatedMeals = meals.filter((m) => m.id !== mealId);
            onUpdate(updatedMeals);
        }
    };

    // Save updated meal
    const handleSaveMeal = (updatedMeal) => {
        let newMeals;

        if (modalMode === "create") {
            // For new meals, generate a new id
            const newId = Math.max(...meals.map((m) => m.id), 0) + 1;
            newMeals = [...meals, { ...updatedMeal, id: newId }];
        } else {
            newMeals = meals.map((m) => (m.id === updatedMeal.id ? updatedMeal : m));
        }

        onUpdate(newMeals);
        setModalOpen(false);
    };

    // Preset filter options
    const typeOptions = [
        { value: "", label: "All Types" },
        { value: "breakfast", label: "Breakfast" },
        { value: "lunch", label: "Lunch" },
        { value: "dinner", label: "Dinner" },
        { value: "snack", label: "Snack" },
    ];

    const caloriesOptions = [
        { value: "", label: "All Calories" },
        { value: "300", label: "Under 300" },
        { value: "400", label: "Under 400" },
        { value: "500", label: "Under 500" },
        { value: "600", label: "Under 600" },
    ];

    const proteinOptions = [
        { value: "", label: "All Protein" },
        { value: "10", label: "10g+" },
        { value: "20", label: "20g+" },
        { value: "30", label: "30g+" },
    ];

    return (
        <div className="w-full">
            {/* Stats Section */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
                    <h3 className="mb-1 text-lg font-bold">Total</h3>
                    <p className="text-2xl font-semibold text-[#FF6B00]">{totalMeals}</p>
                </div>
                <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
                    <h3 className="mb-1 text-lg font-bold">Breakfast</h3>
                    <p className="text-2xl font-semibold text-yellow-400">{breakfastMeals}</p>
                </div>
                <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
                    <h3 className="mb-1 text-lg font-bold">Lunch</h3>
                    <p className="text-2xl font-semibold text-green-400">{lunchMeals}</p>
                </div>
                <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
                    <h3 className="mb-1 text-lg font-bold">Dinner</h3>
                    <p className="text-2xl font-semibold text-blue-400">{dinnerMeals}</p>
                </div>
                <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
                    <h3 className="mb-1 text-lg font-bold">Snacks</h3>
                    <p className="text-2xl font-semibold text-purple-400">{snackMeals}</p>
                </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row">
                    <div className="flex-1">
                        <FormField
                            type="text"
                            placeholder="Search meals by name, ingredients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-0"
                        />
                    </div>
                    <Button
                        variant="orangeFilled"
                        className="!h-fit mt-3"
                        onClick={handleCreateClick}
                        leftIcon={<PlusIcon size={16} />}
                    >
                        New Meal
                    </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <FormField
                        type="select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        options={typeOptions}
                        className="min-w-[150px] max-w-[200px]"
                    />
                    <FormField
                        type="select"
                        value={filterMaxCalories}
                        onChange={(e) => setFilterMaxCalories(e.target.value)}
                        options={caloriesOptions}
                        className="min-w-[150px] max-w-[200px]"
                    />
                    <FormField
                        type="select"
                        value={filterMinProtein}
                        onChange={(e) => setFilterMinProtein(e.target.value)}
                        options={proteinOptions}
                        className="min-w-[150px] max-w-[200px]"
                    />
                </div>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMeals.map((meal) => (
                    <MealCard
                        key={meal.id}
                        meal={meal}
                        onView={handleViewMeal}
                        onEdit={handleEditMeal}
                        onDelete={handleDeleteMeal}
                    />
                ))}

                <CreateMealCard onClick={handleCreateClick} />
            </div>

            {/* Meal Modal */}
            {modalOpen && (
                <MealModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    mode={modalMode}
                    meal={selectedMeal}
                    onSave={handleSaveMeal}
                />
            )}
        </div>
    );
};
