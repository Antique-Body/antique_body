"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";

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
          <div>
            <label htmlFor="dailyCalories" className="mb-2 block text-sm font-medium text-gray-200">
              Daily Calories
            </label>
            <input
              type="text"
              id="dailyCalories"
              name="dailyCalories"
              value={formData.dailyCalories}
              onChange={handleChange}
              className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="E.g., 2500 or '10-20% deficit from maintenance'"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Specific number or range based on the goal (e.g., weight loss, maintenance, muscle gain)
            </p>
          </div>

          <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.7)] p-5">
            <h3 className="mb-4 text-lg font-semibold text-white">Macronutrient Distribution</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label htmlFor="protein" className="mb-2 block text-sm font-medium text-gray-200">
                  Protein
                </label>
                <input
                  type="text"
                  id="protein"
                  name="protein"
                  value={formData.macros.protein}
                  onChange={handleMacroChange}
                  className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  placeholder="E.g., 30% or 180g"
                  required
                />
              </div>

              <div>
                <label htmlFor="carbs" className="mb-2 block text-sm font-medium text-gray-200">
                  Carbohydrates
                </label>
                <input
                  type="text"
                  id="carbs"
                  name="carbs"
                  value={formData.macros.carbs}
                  onChange={handleMacroChange}
                  className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  placeholder="E.g., 50% or 300g"
                  required
                />
              </div>

              <div>
                <label htmlFor="fats" className="mb-2 block text-sm font-medium text-gray-200">
                  Fats
                </label>
                <input
                  type="text"
                  id="fats"
                  name="fats"
                  value={formData.macros.fats}
                  onChange={handleMacroChange}
                  className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  placeholder="E.g., 20% or 60g"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="mealPlan" className="mb-2 block text-sm font-medium text-gray-200">
              Nutrition Strategy
            </label>
            <textarea
              id="mealPlan"
              name="mealPlan"
              value={formData.mealPlan}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="Describe the meal timing, food preferences, supplements, and other nutritional guidelines"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Include recommendations for pre/post workout nutrition, meal frequency, food quality, etc.
            </p>
          </div>

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
