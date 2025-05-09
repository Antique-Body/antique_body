"use client";

import { useState } from "react";

import { MealOptionForm } from "./MealOptionForm";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { PlusIcon, TrashIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const DailyMealPlanner = ({ day, meals, updateMeals }) => {
    const [expandedMeal, setExpandedMeal] = useState(null);

    const addMeal = () => {
        const newMeal = {
            name: `Meal ${meals.length + 1}`,
            time: "",
            options: [{ id: crypto.randomUUID(), name: "", description: "", ingredients: [] }],
        };
        updateMeals([...meals, newMeal]);
    };

    const removeMeal = (index) => {
        const updatedMeals = [...meals];
        updatedMeals.splice(index, 1);
        updateMeals(updatedMeals);
    };

    const updateMeal = (index, field, value) => {
        const updatedMeals = [...meals];
        updatedMeals[index] = {
            ...updatedMeals[index],
            [field]: value,
        };
        updateMeals(updatedMeals);
    };

    const updateMealOptions = (mealIndex, updatedOptions) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex] = {
            ...updatedMeals[mealIndex],
            options: updatedOptions,
        };
        updateMeals(updatedMeals);
    };

    const addMealOption = (mealIndex) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].options.push({
            id: crypto.randomUUID(),
            name: "",
            description: "",
            ingredients: [],
        });
        updateMeals(updatedMeals);
    };

    const removeMealOption = (mealIndex, optionIndex) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].options.splice(optionIndex, 1);
        updateMeals(updatedMeals);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">{day}'s Meal Plan</h3>
                <Button variant="orangeOutline" size="small" onClick={addMeal} leftIcon={<PlusIcon size={16} />}>
                    Add Meal
                </Button>
            </div>

            <div className="space-y-6">
                {meals.map((meal, mealIndex) => (
                    <Card key={mealIndex} variant="dark" width="100%" maxWidth="100%">
                        {/* Meal header with name, time and actions */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <FormField
                                    label="Meal Name"
                                    name={`meal-name-${mealIndex}`}
                                    backgroundStyle="transparent"
                                    value={meal.name}
                                    onChange={(e) => updateMeal(mealIndex, "name", e.target.value)}
                                    className="mb-0"
                                />
                            </div>

                            <div className="flex-1 mx-4">
                                <FormField
                                    label="Time"
                                    name={`meal-time-${mealIndex}`}
                                    type="time"
                                    backgroundStyle="transparent"
                                    value={meal.time}
                                    onChange={(e) => updateMeal(mealIndex, "time", e.target.value)}
                                    className="mb-0"
                                />
                            </div>

                            <Button
                                variant="ghost"
                                size="small"
                                onClick={() => removeMeal(mealIndex)}
                                className="mt-2"
                                leftIcon={<TrashIcon size={16} />}
                            >
                                Remove
                            </Button>
                        </div>

                        {/* Meal options section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-md font-medium text-white">Meal Options</h4>
                                <p className="text-sm text-gray-400">Clients can choose from these alternatives</p>
                            </div>

                            <div className="space-y-4">
                                {meal.options.map((option, optionIndex) => (
                                    <div key={option.id}>
                                        <div
                                            className="flex items-center justify-between p-3 bg-[#222] rounded-md cursor-pointer"
                                            onClick={() =>
                                                setExpandedMeal(
                                                    expandedMeal === `${mealIndex}-${optionIndex}`
                                                        ? null
                                                        : `${mealIndex}-${optionIndex}`
                                                )
                                            }
                                        >
                                            <div>
                                                <p className="font-medium text-white">
                                                    {option.name || `Option ${optionIndex + 1}`}
                                                </p>
                                                <p className="text-sm text-gray-400">{option.ingredients.length} ingredients</p>
                                            </div>
                                            <div className="flex">
                                                <Button
                                                    variant="ghost"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeMealOption(mealIndex, optionIndex);
                                                    }}
                                                    leftIcon={<TrashIcon size={16} />}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Expanded form for meal option */}
                                        {expandedMeal === `${mealIndex}-${optionIndex}` && (
                                            <div className="mt-2 p-4 bg-[#1a1a1a] rounded-md border border-[#333]">
                                                <MealOptionForm
                                                    option={option}
                                                    updateOption={(updatedOption) => {
                                                        const updatedOptions = [...meal.options];
                                                        updatedOptions[optionIndex] = updatedOption;
                                                        updateMealOptions(mealIndex, updatedOptions);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => addMealOption(mealIndex)}
                                    leftIcon={<PlusIcon size={16} />}
                                    fullWidth
                                >
                                    Add Meal Option
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
