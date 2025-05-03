"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/shared";

export const PlanNutritionStep = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    dailyCalories: initialData.dailyCalories || "",
    macros: {
      protein: initialData.macros?.protein || "",
      carbs: initialData.macros?.carbs || "",
      fats: initialData.macros?.fats || "",
    },
    mealPlan: initialData.mealPlan || "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMacroChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      macros: {
        ...prev.macros,
        [name]: value,
      },
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Nutrition Plan</h2>
      <p className="mb-8 text-gray-400">
        Define the nutritional guidelines for this training plan, including daily caloric intake, macronutrient
        distribution, and meal timing recommendations.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormField
            label="Daily Calories"
            id="dailyCalories"
            name="dailyCalories"
            type="text"
            value={formData.dailyCalories}
            onChange={handleChange}
            required
            placeholder="E.g., 2500 or '10-20% deficit from maintenance'"
            backgroundStyle="darker"
            subLabel="Specific number or range based on the goal (e.g., weight loss, maintenance, muscle gain)"
          />

          <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.7)] p-5">
            <h3 className="mb-4 text-lg font-semibold text-white">Macronutrient Distribution</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                label="Protein"
                id="protein"
                name="protein"
                type="text"
                value={formData.macros.protein}
                onChange={handleMacroChange}
                required
                placeholder="E.g., 30% or 180g"
                backgroundStyle="darker"
                className="mb-0"
              />

              <FormField
                label="Carbohydrates"
                id="carbs"
                name="carbs"
                type="text"
                value={formData.macros.carbs}
                onChange={handleMacroChange}
                required
                placeholder="E.g., 50% or 300g"
                backgroundStyle="darker"
                className="mb-0"
              />

              <FormField
                label="Fats"
                id="fats"
                name="fats"
                type="text"
                value={formData.macros.fats}
                onChange={handleMacroChange}
                required
                placeholder="E.g., 20% or 60g"
                backgroundStyle="darker"
                className="mb-0"
              />
            </div>
          </div>

          <FormField
            label="Nutrition Strategy"
            id="mealPlan"
            name="mealPlan"
            type="textarea"
            value={formData.mealPlan}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe the meal timing, food preferences, supplements, and other nutritional guidelines"
            backgroundStyle="darker"
            subLabel="Include recommendations for pre/post workout nutrition, meal frequency, food quality, etc."
          />

          <div className="pt-6">
            <Button type="submit" variant="orangeFilled" className="w-full py-3">
              Continue to Review
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
