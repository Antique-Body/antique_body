"use client";

import Image from "next/image";
import { useState } from "react";

import { FormField } from "@/components/common/FormField";
import { Card } from "@/components/custom/Card";

export const NutritionPlanInfo = ({ planData, handleChange, handleImageChange }) => {
    const [previewImage, setPreviewImage] = useState(null);

    const handleLocalImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageChange(e);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

                <FormField
                    label="Plan Title"
                    name="title"
                    placeholder="e.g., Weight Loss Nutrition Plan"
                    value={planData.title}
                    onChange={handleChange}
                    required
                />

                <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    placeholder="Describe the nutrition plan and its goals..."
                    value={planData.description}
                    onChange={handleChange}
                    rows={4}
                />

                <FormField
                    label="Target Goal"
                    name="targetGoal"
                    type="select"
                    value={planData.targetGoal}
                    onChange={handleChange}
                    options={[
                        { value: "weight-loss", label: "Weight Loss" },
                        { value: "muscle-gain", label: "Muscle Gain" },
                        { value: "maintenance", label: "Maintenance" },
                        { value: "performance", label: "Athletic Performance" },
                        { value: "health", label: "General Health" },
                    ]}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Nutrition Information</h3>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Daily Calories"
                        name="nutritionInfo.calories"
                        type="number"
                        placeholder="e.g., 2000"
                        value={planData.nutritionInfo.calories}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Protein (g)"
                        name="nutritionInfo.protein"
                        type="number"
                        placeholder="e.g., 150"
                        value={planData.nutritionInfo.protein}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Carbohydrates (g)"
                        name="nutritionInfo.carbs"
                        type="number"
                        placeholder="e.g., 200"
                        value={planData.nutritionInfo.carbs}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Fats (g)"
                        name="nutritionInfo.fats"
                        type="number"
                        placeholder="e.g., 70"
                        value={planData.nutritionInfo.fats}
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Cover Image</h3>

                    <Card variant="dark" width="100%" maxWidth="100%" className="p-4 flex flex-col items-center justify-center">
                        {previewImage ? (
                            <div className="relative w-full h-40 mb-4">
                                <Image src={previewImage} alt="Plan cover preview" fill className="object-cover rounded-md" />
                            </div>
                        ) : (
                            <div className="w-full h-40 mb-4 bg-[#222] rounded-md flex items-center justify-center">
                                <span className="text-gray-400">No image selected</span>
                            </div>
                        )}

                        <FormField
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleLocalImageChange}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-400 mt-2">Recommended size: 1200 x 800px</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
