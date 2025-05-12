"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { PlusIcon, TrashIcon } from "@/components/common/Icons";
import { Modal } from "@/components/common/Modal";

export const MealModal = ({ isOpen, onClose, mode = "view", meal = null, onSave }) => {
    const [currentMode, setCurrentMode] = useState(mode);

    const defaultMeal = {
        name: "",
        type: "breakfast",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        prepTime: "",
        ingredients: [""],
        description: "",
        instructions: "",
        imageUrl: "",
    };

    const [formData, setFormData] = useState(mode === "create" ? defaultMeal : meal);

    useEffect(() => {
        // Reset form when modal opens
        if (mode === "create") {
            setFormData(defaultMeal);
        } else if (meal) {
            setFormData(meal);
        }

        // Reset current mode when modal opens/closes
        setCurrentMode(mode);
    }, [isOpen, meal, mode, defaultMeal]);

    if (!isOpen) return null;

    // Switch to edit mode from view mode
    const handleEditClick = () => {
        setCurrentMode("edit");
    };

    // Handle form submission
    const handleSave = (e) => {
        e?.preventDefault();

        // Validate form
        if (!formData.name || !formData.type || !formData.prepTime || formData.ingredients.length === 0) {
            alert("Please fill in all required fields");
            return;
        }

        onSave(formData);
        onClose();
    };

    // Handle modal close
    const handleClose = () => {
        setCurrentMode(mode); // Reset to initial mode
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === "" ? "" : Number(value),
        }));
    };

    const handleAddIngredient = () => {
        setFormData((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, ""],
        }));
    };

    const handleRemoveIngredient = (index) => {
        setFormData((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const handleIngredientChange = (index, value) => {
        setFormData((prev) => {
            const updatedIngredients = [...prev.ingredients];
            updatedIngredients[index] = value;
            return {
                ...prev,
                ingredients: updatedIngredients,
            };
        });
    };

    // Meal type options
    const mealTypeOptions = [
        { value: "breakfast", label: "Breakfast" },
        { value: "lunch", label: "Lunch" },
        { value: "dinner", label: "Dinner" },
        { value: "snack", label: "Snack" },
    ];

    // View Mode Content
    const ViewModeContent = () => (
        <div className="w-full">
            {/* Meal Image */}
            <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg">
                <Image src={meal.imageUrl || "/images/placeholder-meal.jpg"} alt={meal.name} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span
                        className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${
                            meal.type === "breakfast"
                                ? "bg-yellow-900/60 text-yellow-200"
                                : meal.type === "lunch"
                                  ? "bg-green-900/60 text-green-200"
                                  : meal.type === "dinner"
                                    ? "bg-blue-900/60 text-blue-200"
                                    : "bg-purple-900/60 text-purple-200"
                        }`}
                    >
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                    </span>
                    <span className="ml-2 inline-block rounded-md bg-orange-900/60 px-2 py-1 text-xs font-semibold text-orange-200">
                        {meal.prepTime}
                    </span>
                </div>
            </div>

            {/* Meal Description */}
            <p className="mb-4 text-gray-300">{meal.description}</p>

            {/* Nutrition Facts */}
            <div className="mt-4 rounded-lg bg-[#222] p-4">
                <h3 className="mb-3 text-lg font-bold">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                        <p className="text-sm text-gray-400">Calories</p>
                        <p className="text-xl font-semibold text-orange-500">{meal.calories}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Protein</p>
                        <p className="text-xl font-semibold text-blue-500">{meal.protein}g</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Carbs</p>
                        <p className="text-xl font-semibold text-green-500">{meal.carbs}g</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Fat</p>
                        <p className="text-xl font-semibold text-yellow-500">{meal.fat}g</p>
                    </div>
                </div>
            </div>

            {/* Ingredients List */}
            <div className="mt-4">
                <h3 className="mb-2 text-lg font-bold">Ingredients</h3>
                <ul className="ml-5 list-disc space-y-1">
                    {meal.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-300">
                            {ingredient}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Instructions */}
            <div className="mt-4">
                <h3 className="mb-2 text-lg font-bold">Instructions</h3>
                <p className="text-gray-300">{meal.instructions}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end">
                <Button variant="orangeFilled" onClick={handleEditClick}>
                    Edit Meal
                </Button>
            </div>
        </div>
    );

    // Form Content Component
    const FormContent = () => (
        <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Basic Info */}
                <div className="md:col-span-2">
                    <FormField
                        label="Meal Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <FormField
                    label="Meal Type"
                    type="select"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={mealTypeOptions}
                    required
                />

                <FormField
                    label="Prep Time (e.g. '15 min')"
                    type="text"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    required
                />

                {/* Nutrition Info */}
                <div className="md:col-span-2">
                    <h3 className="mb-2 text-lg font-bold">Nutrition Information</h3>
                </div>

                <FormField
                    label="Calories"
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleNumberChange}
                    min={0}
                />

                <FormField
                    label="Protein (g)"
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleNumberChange}
                    min={0}
                />

                <FormField
                    label="Carbs (g)"
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleNumberChange}
                    min={0}
                />

                <FormField
                    label="Fat (g)"
                    type="number"
                    name="fat"
                    value={formData.fat}
                    onChange={handleNumberChange}
                    min={0}
                />

                {/* Ingredients */}
                <div className="md:col-span-2">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-bold">Ingredients</h3>
                        <Button
                            variant="secondary"
                            size="small"
                            type="button"
                            onClick={handleAddIngredient}
                            leftIcon={<PlusIcon size={14} />}
                        >
                            Add Ingredient
                        </Button>
                    </div>

                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="mb-2 flex items-center gap-2">
                            <div className="flex-1">
                                <FormField
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    placeholder="Ingredient name"
                                    className="mb-0"
                                />
                            </div>
                            {formData.ingredients.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="small"
                                    type="button"
                                    onClick={() => handleRemoveIngredient(index)}
                                    className="mt-2"
                                    leftIcon={<TrashIcon size={14} className="text-red-500" />}
                                ></Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Description and Instructions */}
                <div className="md:col-span-2">
                    <FormField
                        label="Description"
                        type="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of the meal"
                        rows={2}
                    />
                </div>

                <div className="md:col-span-2">
                    <FormField
                        label="Instructions"
                        type="textarea"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        placeholder="Step by step instructions to prepare the meal"
                        rows={4}
                    />
                </div>

                <div className="md:col-span-2">
                    <FormField
                        label="Image URL"
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Link to meal image"
                    />
                </div>
            </div>

            {/* Form Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" type="button" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="orangeFilled" type="submit">
                    {mode === "create" ? "Create Meal" : "Save Changes"}
                </Button>
            </div>
        </form>
    );

    if (currentMode === "view") {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title={meal?.name} size="large" footerButtons={false}>
                <ViewModeContent />
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={mode === "create" ? "Add New Meal" : "Edit Meal"}
            size="large"
            footerButtons={false}
        >
            <FormContent />
        </Modal>
    );
};
