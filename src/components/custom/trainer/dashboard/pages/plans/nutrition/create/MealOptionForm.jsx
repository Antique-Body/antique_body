"use client";

import { useState } from "react";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/common/Button";
import { PlusIcon, TrashIcon } from "@/components/common/Icons";

export const MealOptionForm = ({ option, updateOption }) => {
    const [newIngredient, setNewIngredient] = useState("");
    const [newQuantity, setNewQuantity] = useState("");

    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            const ingredient = {
                id: crypto.randomUUID(),
                name: newIngredient,
                quantity: newQuantity,
            };

            updateOption({
                ...option,
                ingredients: [...option.ingredients, ingredient],
            });

            setNewIngredient("");
            setNewQuantity("");
        }
    };

    const handleRemoveIngredient = (ingredientId) => {
        updateOption({
            ...option,
            ingredients: option.ingredients.filter((ing) => ing.id !== ingredientId),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateOption({
            ...option,
            [name]: value,
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <FormField
                    label="Meal Name"
                    name="name"
                    placeholder="e.g., Greek Yogurt with Berries"
                    value={option.name}
                    onChange={handleChange}
                    backgroundStyle="darker"
                />

                <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    rows={2}
                    placeholder="Briefly describe the meal..."
                    value={option.description}
                    onChange={handleChange}
                    backgroundStyle="darker"
                />
            </div>

            <div className="mt-6">
                <h4 className="text-md font-medium text-white mb-3">Ingredients</h4>

                <div className="space-y-2 mb-4">
                    {option.ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="flex items-center justify-between p-2 bg-[#222] rounded">
                            <div className="flex-1">
                                <p className="text-white">{ingredient.name}</p>
                                {ingredient.quantity && <p className="text-sm text-gray-400">{ingredient.quantity}</p>}
                            </div>
                            <Button
                                variant="ghost"
                                size="small"
                                onClick={() => handleRemoveIngredient(ingredient.id)}
                                leftIcon={<TrashIcon size={14} />}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                        <FormField
                            label="Ingredient"
                            name="newIngredient"
                            placeholder="e.g., Greek Yogurt"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            backgroundStyle="darker"
                            className="mb-0"
                        />
                    </div>

                    <div>
                        <FormField
                            label="Quantity"
                            name="newQuantity"
                            placeholder="e.g., 200g"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(e.target.value)}
                            backgroundStyle="darker"
                            className="mb-0"
                        />
                    </div>
                </div>

                <div className="mt-2">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={handleAddIngredient}
                        leftIcon={<PlusIcon size={16} />}
                        fullWidth
                    >
                        Add Ingredient
                    </Button>
                </div>
            </div>
        </div>
    );
};
